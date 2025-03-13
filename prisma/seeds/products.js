async function seedProducts(prisma) {
  const products = [
    {
      categoryId: 'category-1',
      description: 'Pure, unprocessed cocoa powder',
      id: 'product-1',
      images: ['image1.jpg', 'image2.jpg'],
      lowStockThreshold: 10,
      name: 'Raw Cocoa Powder',
      stock: 150, // Main product images
      variants: [
        {
          id: 'variant-1',
          images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
          packaging: { type: 'SACHET' },
          price: 5.99,
          stock: 50,
          weight: 100,
        },
        {
          id: 'variant-2',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'JAR' },
          price: 12.99,
          stock: 30,
          weight: 200,
        },
      ],
    },
    {
      categoryId: 'category-2',
      description: 'Rich and smooth dark chocolate',
      id: 'product-2',
      images: ['image3.jpg', 'image4.jpg'],
      lowStockThreshold: 20,
      name: 'Dark Chocolate Bar',
      stock: 200,
      variants: [
        {
          id: 'variant-3',
          images: ['variant3-image1.jpg', 'variant3-image2.jpg'],
          packaging: { type: 'BOX_70_PERCENT' },
          price: 8.99,
          stock: 100,
          weight: 100,
        },
        {
          id: 'variant-4',
          images: ['variant4-image1.jpg', 'variant4-image2.jpg'],
          packaging: { type: 'CARTON_70_PERCENT' },
          price: 79.99,
          stock: 50,
          weight: 200,
        },
      ],
    },
  ];

  await Promise.all(
    products.map(async (product) => {
      await prisma.product.create({
        data: {
          ...product,
          variants: {
            create: product.variants,
          },
        },
      });
    })
  );

  console.log('Products seeded successfully!');
}

module.exports = seedProducts;
