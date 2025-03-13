async function seedCategories(prisma) {
  const categories = [
    {
      description: 'High-quality raw cocoa powder',
      id: 'category-1',
      name: 'COCOA_POWDER',
    },
    {
      description: 'Premium dark chocolate bars',
      id: 'category-2',
      name: 'COCOA_BAR',
    },
  ];

  await prisma.category.createMany({
    data: categories,
  });

  console.log('Categories seeded successfully!');
}

module.exports = seedCategories;
