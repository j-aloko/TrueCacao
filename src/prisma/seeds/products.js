const { round } = require('mathjs');

function calculateReviewStats(reviews) {
  if (!reviews?.create?.length) {
    return { averageRating: 0, averageRatingPrecision: 0, totalReviews: 0 };
  }

  const totalReviews = reviews.create.length;
  const averageRating =
    reviews.create.reduce((sum, review) => sum + review.rating, 0) /
    totalReviews;
  const averageRatingPrecision = averageRating % 1;

  return {
    averageRating: Number(averageRating.toFixed(2)),
    averageRatingPrecision: Number(averageRatingPrecision.toFixed(2)),
    totalReviews,
  };
}

const formatAmount = (amount) => {
  if (typeof amount !== 'number') {
    throw new Error('Amount must be a number');
  }

  return round(amount, 2);
};

const moneyRecord = (amount, currencyCode = 'USD') => ({
  create: { amount: formatAmount(amount), currencyCode },
});

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

async function seedProducts(prisma) {
  const products = [
    {
      categoryId: 'category-1',
      descriptionHtml: `
<div class="cocoa-description">
  <h2 class="product-subtitle">Premium Raw Organic Cocoa Powder</h2>

  <div class="product-highlight">
    <svg class="icon" viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor" d="M12,2L4,5v6.09c0,5.05 3.41,9.76 8,10.91c4.59-1.15 8-5.86 8-10.91V5L12,2z"/>
    </svg>
    <p>Cold-pressed from premium organic cocoa beans to preserve maximum nutrients and flavor</p>
  </div>

  <h3 class="section-title">About Our Cocoa</h3>
  <p>Our Raw Organic Cocoa Powder is carefully crafted from heirloom cocoa varieties grown in Ecuador's rich volcanic soil. The beans are:</p>
  <ul class="feature-list">
    <li>Fermented using traditional methods</li>
    <li>Slow-dried at low temperatures</li>
    <li>Cold-pressed to remove cocoa butter</li>
    <li>Never alkalized or chemically processed</li>
  </ul>

  <h3 class="section-title">Health Benefits</h3>
  <ul class="benefits-list">
    <li>Rich in antioxidants (ORAC score of 95,500)</li>
    <li>High in flavonoids and polyphenols</li>
    <li>Natural source of magnesium and iron</li>
    <li>Contains mood-enhancing compounds like theobromine</li>
  </ul>

  <div class="product-specs">
    <h3 class="section-title">Product Details</h3>
    <p><strong>Ingredients:</strong> 100% organic raw cocoa powder (single origin)</p>
    <p><strong>Certifications:</strong> USDA Organic, Fair Trade, Non-GMO</p>
    <p><strong>Net Weight:</strong> 8 oz (227g) - About 30 servings</p>
    <p><strong>Origin:</strong> Sustainably sourced from small family farms in Ecuador's Manabí province</p>
    <p><strong>Suggested Use:</strong> Add to smoothies, baked goods, or make rich hot chocolate</p>
  </div>

  <div class="storage-tip">
    <svg class="icon" viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor" d="M12,3L2,12v9h20v-9L12,3z M19,19v-6.7L12,15.4L5,12.3V19H19z"/>
    </svg>
    <p><strong>Storage:</strong> Keep in a cool, dry place. For maximum freshness, store in an airtight container.</p>
  </div>
</div>
`,
      descriptionSummary:
        'Cold-pressed from premium Ecuadorian cocoa beans, our USDA Organic Raw Cocoa Powder delivers intense chocolate flavor with maximum nutrients. Unprocessed, non-alkalized, and packed with antioxidants – perfect for baking, smoothies, or rich hot chocolate. Single-origin and fair trade certified.',
      images: [
        '/product-images/royale-cocoa-powder-1.jpg',
        '/product-images/royale-cocoa-powder-3.jpg',
      ],
      lowStockThreshold: 10,
      name: 'Raw Cocoa Powder',
      reviews: {
        create: [
          {
            comment:
              'Absolutely love this cocoa powder! The flavor is rich and authentic. Perfect for my morning smoothies.',
            createdAt: new Date('2023-10-15'),
            rating: 5,
            userId: 'user-1',
          },
          {
            comment:
              'Great quality but the packaging could be more resealable. Taste is wonderful though!',
            createdAt: new Date('2023-11-02'),
            rating: 4,
            userId: 'user-2',
          },
          {
            comment:
              'This has become a staple in my pantry. Makes the best hot chocolate!',
            createdAt: new Date('2023-09-28'),
            rating: 5,
            userId: 'user-3',
          },
          {
            comment:
              'Good flavor but a bit clumpy. Might try a different brand next time.',
            createdAt: new Date('2023-12-05'),
            rating: 3,
            userId: 'user-4',
          },
        ],
      },
      slug: slugify('Raw Cocoa Powder'),
      stock: 280,
      tag: 'BEST_SELLER',
      variants: [
        {
          id: 'variant-1',
          images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
          packaging: { type: 'SACHET' },
          price: { amount: 5.99, currencyCode: 'USD' },
          stock: 50,
          weight: 100,
        },
        {
          id: 'variant-2',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_SACHETS' },
          price: { amount: 30.99, currencyCode: 'USD' },
          stock: 30,
          weight: 100,
        },
        {
          id: 'variant-3',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'SACHET' },
          price: { amount: 12.99, currencyCode: 'USD' },
          stock: 30,
          weight: 200,
        },
        {
          id: 'variant-4',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_SACHETS' },
          price: { amount: 39.99, currencyCode: 'USD' },
          stock: 30,
          weight: 200,
        },
        {
          id: 'variant-5',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'SACHET' },
          price: { amount: 12.99, currencyCode: 'USD' },
          stock: 30,
          weight: 1000,
        },
        {
          id: 'variant-6',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_SACHETS' },
          price: { amount: 65.99, currencyCode: 'USD' },
          stock: 30,
          weight: 1000,
        },
        {
          id: 'variant-7',
          images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
          packaging: { type: 'JAR' },
          price: { amount: 5.99, currencyCode: 'USD' },
          stock: 50,
          weight: 400,
        },
        {
          id: 'variant-8',
          images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
          packaging: { type: 'JAR' },
          price: { amount: 5.99, currencyCode: 'USD' },
          stock: 50,
          weight: 500,
        },
        {
          id: 'variant-9',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_JARS' },
          price: { amount: 45.99, currencyCode: 'USD' },
          stock: 30,
          weight: 400,
        },
        {
          id: 'variant-10',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_JARS' },
          price: { amount: 45.99, currencyCode: 'USD' },
          stock: 30,
          weight: 500,
        },
        {
          id: 'variant-11',
          images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
          packaging: { type: 'CARTON_OF_JARS' },
          price: { amount: 45.99, currencyCode: 'USD' },
          stock: 30,
          weight: 200,
        },
      ],
    },
    {
      categoryId: 'category-2',
      descriptionHtml: `
        <div class="chocolate-description">
  <h2 class="product-subtitle">Artisan Dark Chocolate Bar</h2>

  <div class="product-highlight">
    <svg class="icon" viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor" d="M12,3L2,12v9h20v-9L12,3z M12,7.7l5,4.5V18h-2v-6h-6v6H7v-5.8L12,7.7z"/>
    </svg>
    <p>Small-batch crafted from single-origin cocoa beans with 72% cocoa content for perfect balance</p>
  </div>

  <h3 class="section-title">Craftsmanship</h3>
  <p>Our Dark Chocolate Bar represents 3 generations of chocolate-making expertise:</p>
  <ul class="feature-list">
    <li>Bean-to-bar production in our micro-factory</li>
    <li>72-hour slow conching for velvety texture</li>
    <li>Precision tempering for perfect snap and shine</li>
    <li>No soy lecithin or artificial emulsifiers</li>
  </ul>

  <h3 class="section-title">Tasting Notes</h3>
  <ul class="benefits-list">
    <li><strong>Aroma:</strong> Intense cocoa with hints of red berries</li>
    <li><strong>Flavor:</strong> Deep chocolate with notes of caramel and subtle citrus</li>
    <li><strong>Mouthfeel:</strong> Smooth melt with lingering richness</li>
    <li><strong>Finish:</strong> Balanced bitterness with natural sweetness</li>
  </ul>

  <div class="product-specs">
    <h3 class="section-title">Product Details</h3>
    <p><strong>Ingredients:</strong> Organic cocoa beans, organic cane sugar, organic cocoa butter</p>
    <p><strong>Cocoa Content:</strong> 72% (perfect balance of intensity and approachability)</p>
    <p><strong>Certifications:</strong> USDA Organic, Direct Trade, Rainforest Alliance</p>
    <p><strong>Net Weight:</strong> 3 oz (85g) - 6 generous squares</p>
    <p><strong>Origin:</strong> Single-estate cocoa from Piedra de Plata, Dominican Republic</p>
    <p><strong>Pairing Suggestions:</strong> Red wine, espresso, or enjoy solo as an after-dinner treat</p>
  </div>

  <div class="storage-tip">
    <svg class="icon" viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor" d="M12,3L2,12v9h20v-9L12,3z M19,19v-6.7L12,15.4L5,12.3V19H19z"/>
    </svg>
    <p><strong>Storage:</strong> Keep at 60-65°F (15-18°C). Avoid refrigeration as it may cause bloom.</p>
  </div>

  <div class="ethical-info">
    <h3 class="section-title">Ethical Commitment</h3>
    <p>We pay 35% above fair trade prices and fund community projects at origin, including:</p>
    <ul>
      <li>School nutrition programs</li>
      <li>Organic farming education</li>
      <li>Women's cooperative development</li>
    </ul>
  </div>
</div>
`,
      descriptionSummary:
        '70%, 80%, and 90% Single-Origin Dark Chocolate Bar crafted in small batches from Dominican cocoa. Slow-conched for velvety texture with notes of red berries and caramel. Ethically sourced, Rainforest Alliance certified, and perfect for mindful indulgence.',
      images: [
        '/product-images/TQ-premium-dark-chocolate-70.jpg',
        '/product-images/TQ-premium-dark-chocolate-90.jpg',
      ],
      lowStockThreshold: 20,
      name: 'Dark Chocolate Bar',
      reviews: {
        create: [
          {
            comment:
              'The 80% dark chocolate is perfection - not too bitter with just the right sweetness.',
            createdAt: new Date('2023-11-18'),
            rating: 5,
            userId: 'user-5',
          },
          {
            comment:
              'Excellent quality chocolate. The 70% is my favorite for baking.',
            createdAt: new Date('2023-10-22'),
            rating: 4,
            userId: 'user-6',
          },
          {
            comment:
              'Worth every penny! The flavor profile is complex and satisfying.',
            createdAt: new Date('2023-12-10'),
            rating: 5,
            userId: 'user-7',
          },
          {
            comment:
              'Too bitter for my taste. Maybe I should have gone with the 70%.',
            createdAt: new Date('2023-09-05'),
            rating: 2,
            userId: 'user-8',
          },
          {
            comment:
              'My new favorite chocolate! The bars arrived in perfect condition.',
            createdAt: new Date('2023-12-15'),
            rating: 5,
            userId: 'user-9',
          },
        ],
      },
      slug: slugify('Dark Chocolate Bar'),
      stock: 200,
      tag: 'BEST_SELLER',
      variants: [
        {
          id: 'variant-12',
          images: ['variant3-image1.jpg', 'variant3-image2.jpg'],
          packaging: { type: 'BOX_70_PERCENT' },
          price: { amount: 8.99, currencyCode: 'USD' },
          stock: 100,
          weight: 100,
        },
        {
          id: 'variant-13',
          images: ['variant4-image1.jpg', 'variant4-image2.jpg'],
          packaging: { type: 'CARTON_70_PERCENT' },
          price: { amount: 79.99, currencyCode: 'USD' },
          stock: 50,
          weight: 100,
        },
        {
          id: 'variant-14',
          images: ['variant3-image1.jpg', 'variant3-image2.jpg'],
          packaging: { type: 'BOX_80_PERCENT' },
          price: { amount: 8.99, currencyCode: 'USD' },
          stock: 100,
          weight: 100,
        },
        {
          id: 'variant-15',
          images: ['variant4-image1.jpg', 'variant4-image2.jpg'],
          packaging: { type: 'CARTON_80_PERCENT' },
          price: { amount: 79.99, currencyCode: 'USD' },
          stock: 50,
          weight: 100,
        },
      ],
    },
  ];

  await Promise.all(
    products.map(async (product) => {
      const reviewStats = calculateReviewStats(product.reviews);

      await prisma.product.create({
        data: {
          ...product,
          averageRating: reviewStats.averageRating,
          averageRatingPrecision: reviewStats.averageRatingPrecision,
          totalReviews: reviewStats.totalReviews,
          variants: {
            create: product.variants.map((variant) => ({
              ...variant,
              packaging: variant.packaging,
              price: moneyRecord(
                variant.price.amount,
                variant.price.currencyCode
              ),
            })),
          },
        },
      });
    })
  );

  console.log('Products and reviews seeded successfully!');
}

module.exports = seedProducts;
