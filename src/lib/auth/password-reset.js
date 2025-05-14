import prisma from '@/lib/prisma';

import { sendPasswordResetEmail } from './email-service';
import { hashPassword, generateToken, generateHash } from './security';

export async function initiatePasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return; // Don't reveal if user exists

  const resetToken = generateToken();
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour

  await prisma.user.update({
    data: {
      resetToken: generateHash(resetToken),
      resetTokenExpires: expiresAt,
    },
    where: { id: user.id },
  });

  await sendPasswordResetEmail(email, resetToken);
}

export async function completePasswordReset(token, newPassword) {
  const hashedToken = generateHash(token);

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await hashPassword(newPassword);

  return prisma.user.update({
    data: {
      passwordHash: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    },
    where: { id: user.id },
  });
}
