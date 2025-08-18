import { PASSWORD_RESET_LINK_EXPIRY } from '@/constants/constants';
import { ROUTES } from '@/constants/routes';
import prisma from '@/lib/prisma';

import {
  hashPassword,
  generateToken,
  generateHash,
  encrypt,
  decrypt,
} from './security';

export async function initiatePasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('An account does not exist for this email.');
  }

  await prisma.resetToken.deleteMany({ where: { userId: user.id } });

  const rawToken = await generateToken();
  const hashedToken = await generateHash(rawToken);

  await prisma.$transaction([
    prisma.resetToken.create({
      data: {
        expiresAt: new Date(Date.now() + PASSWORD_RESET_LINK_EXPIRY * 1000),
        token: hashedToken,
        userId: user.id,
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'PASSWORD_RESET_REQUEST',
        createdAt: new Date(),
        details: { email },
        model: 'User',
        modelId: user.id,
        userId: user.id,
      },
    }),
  ]);

  const encryptedId = await encrypt(user.id);
  const encryptedRawToken = await encrypt(rawToken);
  const verificationLink = `${process.env.APP_URL}${ROUTES.resetPassword}?token=${encryptedRawToken}&id=${encryptedId}&email=${encodeURIComponent(user.email)}`;
  return { email: user.email, verificationLink };
}

export async function completePasswordReset(token, newPassword) {
  const decryptedToken = await decrypt(token);
  const hashedToken = await generateHash(decryptedToken);
  const tokenRecord = await prisma.resetToken.findFirst({
    where: {
      expiresAt: { gt: new Date() },
      token: hashedToken,
    },
  });
  if (!tokenRecord) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await hashPassword(newPassword);

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      data: {
        passwordHash: hashedPassword,
      },
      select: {
        email: true,
        id: true,
        name: true,
        role: true,
        verified: true,
      },
      where: { id: tokenRecord.userId },
    }),
    prisma.resetToken.delete({
      where: { id: tokenRecord.id },
    }),
    prisma.session.updateMany({
      data: { expiresAt: new Date() },
      where: { userId: tokenRecord.userId }, // Invalidate all sessions
    }),
    prisma.auditLog.create({
      data: {
        action: 'PASSWORD_RESET_COMPLETE',
        createdAt: new Date(),
        details: { email: prisma.user.fields.email },
        model: 'User',
        modelId: tokenRecord.userId,
        userId: tokenRecord.userId,
      },
    }),
  ]);

  return updatedUser;
}
