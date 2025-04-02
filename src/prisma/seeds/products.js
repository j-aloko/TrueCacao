async function seedProducts(prisma) {
  const products = [
    {
      categoryId: 'category-1',
      description: 'Pure, unprocessed cocoa powder',
      id: 'product-1',
      images: ['image1.jpg', 'image2.jpg'],
      lowStockThreshold: 10,
      name: 'Raw Cocoa Powder',
      stock: 280,
      variants: [
        {
          id: 'variant-1',
          images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
          packaging: { type: 'SACHET' },
          price: {
            create: {
              amount: 5.99,
              currencyCode: 'USD',
            },
          },
          stock: 50,
          weight: 100,
        },
        {
          id: 'variant-2',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_SACHETS' },
          price: {
            create: {
              amount: 30.99,
              currencyCode: 'USD',
            },
          },
          stock: 30,
          weight: 100,
        },
        {
          id: 'variant-3',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'SACHET' },
          price: {
            create: {
              amount: 12.99,
              currencyCode: 'USD',
            },
          },
          stock: 30,
          weight: 200,
        },
        {
          id: 'variant-4',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_SACHETS' },
          price: {
            create: {
              amount: 39.99,
              currencyCode: 'USD',
            },
          },
          stock: 30,
          weight: 200,
        },
        {
          id: 'variant-5',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'SACHET' },
          price: {
            create: {
              amount: 12.99,
              currencyCode: 'USD',
            },
          },
          stock: 30,
          weight: 1000,
        },
        {
          id: 'variant-6',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_SACHETS' },
          price: {
            create: {
              amount: 65.99,
              currencyCode: 'USD',
            },
          },
          stock: 30,
          weight: 1000,
        },
        {
          id: 'variant-7',
          images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
          packaging: { type: 'JAR' },
          price: {
            create: {
              amount: 5.99,
              currencyCode: 'USD',
            },
          },
          stock: 50,
          weight: 400,
        },
        {
          id: 'variant-8',
          images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
          packaging: { type: 'JAR' },
          price: {
            create: {
              amount: 5.99,
              currencyCode: 'USD',
            },
          },
          stock: 50,
          weight: 500,
        },
        {
          id: 'variant-9',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_JARS' },
          price: {
            create: {
              amount: 45.99,
              currencyCode: 'USD',
            },
          },
          stock: 30,
          weight: 400,
        },
        {
          id: 'variant-10',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_JARS' },
          price: {
            create: {
              amount: 45.99,
              currencyCode: 'USD',
            },
          },
          stock: 30,
          weight: 500,
        },
        {
          id: 'variant-11',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_JARS' },
          price: {
            create: {
              amount: 45.99,
              currencyCode: 'USD',
            },
          },
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
          id: 'variant-12',
          images: ['variant3-image1.jpg', 'variant3-image2.jpg'],
          packaging: { type: 'BOX_70_PERCENT' },
          price: {
            create: {
              amount: 8.99,
              currencyCode: 'USD',
            },
          },
          stock: 100,
          weight: 100,
        },
        {
          id: 'variant-13',
          images: ['variant4-image1.jpg', 'variant4-image2.jpg'],
          packaging: { type: 'CARTON_70_PERCENT' },
          price: {
            create: {
              amount: 79.99,
              currencyCode: 'USD',
            },
          },
          stock: 50,
          weight: 100,
        },
        {
          id: 'variant-14',
          images: ['variant3-image1.jpg', 'variant3-image2.jpg'],
          packaging: { type: 'BOX_80_PERCENT' },
          price: {
            create: {
              amount: 8.99,
              currencyCode: 'USD',
            },
          },
          stock: 100,
          weight: 100,
        },
        {
          id: 'variant-15',
          images: ['variant4-image1.jpg', 'variant4-image2.jpg'],
          packaging: { type: 'CARTON_80_PERCENT' },
          price: {
            create: {
              amount: 79.99,
              currencyCode: 'USD',
            },
          },
          stock: 50,
          weight: 100,
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
            create: product.variants.map((variant) => ({
              ...variant,
              packaging: variant.packaging, // Prisma will automatically handle JSON
            })),
          },
        },
      });
    })
  );

  console.log('Products seeded successfully!');
}

module.exports = seedProducts;
