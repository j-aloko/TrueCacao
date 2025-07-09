import prisma from '@/lib/prisma';

import { sendPasswordResetEmail } from './email-service';
import { hashPassword, generateToken, generateHash } from './security';

export async function initiatePasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  await prisma.resetToken.deleteMany({ where: { userId: user.id } });

  const rawToken = await generateToken();
  const hashedToken = await generateHash(rawToken);

  await prisma.resetToken.create({
    data: {
      expiresAt: new Date(Date.now() + 3600000),
      token: hashedToken,
      userId: user.id,
    },
  });

  await sendPasswordResetEmail(email, rawToken);
}

export async function completePasswordReset(token, newPassword) {
  const hashedToken = await generateHash(token);

  const tokenRecord = await prisma.resetToken.findFirst({
    include: { user: true },
    where: {
      expiresAt: { gt: new Date() },
      token: hashedToken,
    },
  });

  if (!tokenRecord) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    data: {
      passwordHash: hashedPassword,
    },
    where: { id: tokenRecord.userId },
  });

  await prisma.resetToken.delete({
    where: { id: tokenRecord.id },
  });
}
