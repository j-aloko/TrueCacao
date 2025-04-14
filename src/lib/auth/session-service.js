import prisma from '@/lib/prisma';

import { createSessionTokens } from './jwt';

export async function createSession(user, ipAddress, userAgent) {
  // Invalidate any existing sessions for this device
  await prisma.session.updateMany({
    data: {
      expiresAt: new Date(),
    },
    where: {
      expiresAt: { gt: new Date() },
      userAgent,
      userId: user.id,
    },
  });

  const session = await prisma.session.create({
    data: {
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress,
      userAgent,
      userId: user.id,
    },
  });

  return createSessionTokens(user, session);
}

export async function revokeSession(sessionId) {
  return prisma.session.update({
    data: { expiresAt: new Date() },
    where: { id: sessionId },
  });
}

export async function validateSession(sessionId, userId) {
  return prisma.session.findFirst({
    where: {
      expiresAt: { gt: new Date() },
      id: sessionId,
      userId,
    },
  });
}
