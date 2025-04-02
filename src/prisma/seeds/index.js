const { default: prisma } = require('@/lib/prisma');

const seedCategories = require('./category');
const seedProducts = require('./products');

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
