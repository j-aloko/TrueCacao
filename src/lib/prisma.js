import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  transactionOptions: {
    // 15 seconds
    maxWait: 15000,
    // TODO: Increase timeout to 20000 (20s) when user subscribes to accelerate plan
    timeout: 15000, // 15 seconds
  },
}).$extends(withAccelerate());

const globalForPrisma = global;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
