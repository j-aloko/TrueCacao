import prisma from '@/lib/prisma';

import { sendVerificationEmail } from './email-service';
import { generateHash, generateToken, hashPassword } from './security';

export async function createUser(email, password, name, role = 'CUSTOMER') {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await hashPassword(password);
  const verificationToken = generateToken();

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashedPassword,
      role,
      verificationToken: generateHash(verificationToken),
      verificationTokenExpires: new Date(Date.now() + 86400000), // 1 day
    },
  });

  await sendVerificationEmail(email, verificationToken);
  return user;
}

export async function verifyUserEmail(token) {
  const hashedToken = generateHash(token);

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashedToken,
      verificationTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  return prisma.user.update({
    data: {
      verificationToken: null,
      verificationTokenExpires: null,
      verified: true,
    },
    where: { id: user.id },
  });
}
