const { PrismaClient } = require('@prisma/client');

const seedCategories = require('./category');
const seedProducts = require('./products');

const prisma = new PrismaClient();

async function main() {
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await seedCategories(prisma);
  await seedProducts(prisma);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
