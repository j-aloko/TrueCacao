import { USER_ROLE } from '@/constants/constants';
import prisma from '@/lib/prisma';

import { generateHash, generateToken, hashPassword } from './security';

/**
 * Create a new user with a hashed password and a secure email verification token.
 * Returns the raw token for frontend email delivery (not stored).
 */
export async function createUser(
  email,
  password,
  name,
  role = USER_ROLE.CUSTOMER
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await hashPassword(password);
  const rawVerificationToken = await generateToken();
  const hashedVerificationToken = await generateHash(rawVerificationToken);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashedPassword,
      role,
      verificationToken: hashedVerificationToken,
      verificationTokenExpires: new Date(Date.now() + 86400000), // expires in 24h
    },
    select: {
      email: true,
      id: true,
      verified: true,
    },
  });

  return {
    email: user.email,
    verificationToken: rawVerificationToken,
  };
}

/**
 * Resend a verification token for a user who hasn't verified yet.
 * Returns raw token for frontend delivery.
 */
export async function resendVerification(email) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) throw new Error('User not found');
  if (existingUser.verified) throw new Error('User already verified');

  const rawToken = await generateToken();
  const hashedToken = await generateHash(rawToken);

  const updatedUser = await prisma.user.update({
    data: {
      verificationToken: hashedToken,
      verificationTokenExpires: new Date(Date.now() + 86400000),
    },
    select: {
      email: true,
      id: true,
      verified: true,
    },
    where: { email },
  });

  return {
    email: updatedUser.email,
    verificationToken: rawToken,
  };
}

/**
 * Verifies user email by checking the hashed token and expiration.
 * Clears token fields upon success.
 */
export async function verifyUserEmail(token) {
  const hashedToken = await generateHash(token);

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashedToken,
      verificationTokenExpires: { gt: new Date() }, // token still valid
    },
  });

  if (!user) throw new Error('Invalid or expired token');

  await prisma.user.update({
    data: {
      verificationToken: null,
      verificationTokenExpires: null,
      verified: true,
    },
    where: { id: user.id },
  });

  return { email: user.email, verified: true };
}
