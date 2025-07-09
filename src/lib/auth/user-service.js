import { EMAIL_VERIFICATION_EXPIRY, USER_ROLE } from '@/constants/constants';
import prisma from '@/lib/prisma';

import {
  generateHash,
  generateToken,
  hashPassword,
  verifyPassword,
} from './security';
import { createSession } from './session-service';

export async function loginUser({ email, password, ipAddress, userAgent }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) throw new Error('Invalid credentials');

  const { accessToken, refreshToken } = await createSession(
    user,
    ipAddress,
    userAgent
  );

  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      id: user.id,
      name: user.name,
      role: user.role,
      verified: user.verified,
    },
  };
}

export async function createUser(
  email,
  password,
  name,
  role = USER_ROLE.CUSTOMER
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await hashPassword(password);
  const rawToken = await generateToken();
  const hashedToken = await generateHash(rawToken);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashedPassword,
      role,
    },
  });

  await prisma.verificationToken.create({
    data: {
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY * 1000), // 24 hours
      token: hashedToken,
      userId: user.id,
    },
  });

  return { email: user.email, verificationToken: rawToken };
}

export async function resendVerification(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }
  if (user.verified) {
    throw new Error('User already verified');
  }

  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

  const rawToken = await generateToken();
  const hashedToken = await generateHash(rawToken);

  await prisma.verificationToken.create({
    data: {
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY * 1000), // 24 hours
      token: hashedToken,
      userId: user.id,
    },
  });

  return { email: user.email, verificationToken: rawToken };
}

export async function verifyUserEmail(token) {
  const hashedToken = await generateHash(token);
  const tokenRecord = await prisma.verificationToken.findFirst({
    include: { user: true },
    where: {
      expiresAt: { gt: new Date() },
      token: hashedToken,
    },
  });
  if (!tokenRecord) {
    throw new Error('Invalid or expired token');
  }
  await prisma.user.update({
    data: { verified: true },
    where: { id: tokenRecord.userId },
  });
  await prisma.verificationToken.delete({
    where: { id: tokenRecord.id },
  });
  return { email: tokenRecord.user.email, verified: true };
}

export async function verifyToken(token) {
  const hashedToken = await generateHash(token);

  const tokenRecord = await prisma.verificationToken.findFirst({
    include: { user: true },
    where: {
      expiresAt: { gt: new Date() },
      token: hashedToken,
    },
  });

  if (!tokenRecord) {
    throw new Error('Invalid or expired token');
  }

  return tokenRecord;
}
