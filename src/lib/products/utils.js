import prisma from '@/lib/prisma';

export async function getProductBySlug(slug, customFields = {}) {
  const product = await prisma.product.findUnique({
    select: getProductSchema(customFields),
    where: { slug },
  });

  return sanitizeProductData(product);
}

export async function getProductById(id, customFields = {}) {
  const product = await prisma.product.findUnique({
    select: getProductSchema(customFields),
    where: { id },
  });

  return sanitizeProductData(product);
}

export async function updateProduct(id, updates) {
  const updatedProduct = await prisma.product.update({
    data: updates,
    where: { id },
  });

  return sanitizeProductData(updatedProduct);
}

export async function deleteProduct(id) {
  return prisma.product.delete({
    where: { id },
  });
}

export async function createProducts(inputProducts) {
  const products = Array.isArray(inputProducts)
    ? inputProducts
    : [inputProducts];

  try {
    return await prisma.$transaction(async (tx) => {
      const createdProducts = await Promise.all(
        products.map(async (product) => {
          if (!product?.name || !product?.categoryId) {
            throw new Error('Product name and categoryId are required');
          }
          const slug = slugify(product.name);

          const existing = await tx.product.findFirst({
            select: { id: true },
            where: { slug },
          });
          if (existing) {
            throw new Error(`Product with slug "${slug}" already exists`);
          }

          const newProduct = await tx.product.create({
            data: {
              ...product,
              slug,
              variants: {
                create: prepareVariants(product.variants),
              },
              ...(product.reviews && {
                reviews: {
                  create: prepareReviews(product.reviews),
                },
              }),
            },
            include: {
              reviews: true,
              variants: true,
            },
          });

          return sanitizeProductData(newProduct);
        })
      );

      return createdProducts.length === 1
        ? createdProducts[0]
        : createdProducts;
    });
  } catch (error) {
    throw new Error(`Failed to create products: ${error.message}`);
  }
}

function prepareVariants(variants) {
  if (!variants?.length) {
    throw new Error('At least one variant is required');
  }
  return variants.map((variant) => ({
    ...variant,
    packaging: variant.packaging,
    price: {
      create: {
        ...variant.price.create,
        amount: Math.max(0, variant.price.create.amount),
      },
    },
    stock: Math.max(0, variant.stock ?? 0),
    weight: Math.max(0, variant.weight ?? 0),
  }));
}

function prepareReviews(reviews) {
  return (
    reviews?.map((review) => ({
      ...review,
      createdAt: review.createdAt ?? new Date(),
      rating: Math.min(5, Math.max(1, review.rating)),
    })) ?? []
  );
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

export function sanitizeProductData(product) {
  if (!product) return null;

  return {
    ...product,
    reviews: product.reviews?.map((review) => ({
      ...review,
      createdAt: review.createdAt ?? new Date(),
      rating: Math.min(5, Math.max(1, review.rating)),
    })),
    variants: product.variants?.map((variant) => ({
      ...variant,
      price: {
        amount: Number(variant.price.amount),
        currencyCode: variant.price.currencyCode,
      },
    })),
  };
}

export async function getProductReviewStats(productId) {
  const { _avg, _count } = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: { rating: true },
    where: { productId },
  });

  if (!_count.rating) {
    return { averageRating: 0, averageRatingPrecision: 0, totalReviews: 0 };
  }
  const averageRating = Number(_avg.rating.toFixed(2));
  const totalReviews = _count.rating;
  const averageRatingPrecision = Number((averageRating % 1).toFixed(2));
  return { averageRating, averageRatingPrecision, totalReviews };
}

export function getProductSchema(customFields = {}) {
  const defaultFields = {
    averageRating: true,
    averageRatingPrecision: true,
    category: { select: { name: true } },
    descriptionHtml: true,
    descriptionSummary: true,
    id: true,
    images: true,
    name: true,
    slug: true,
    stock: true,
    totalReviews: true,
    variants: {
      select: {
        id: true,
        images: true,
        packaging: true,
        price: { select: { amount: true, currencyCode: true } },
        reservedStock: true,
        stock: true,
        weight: true,
      },
    },
  };

  return { ...defaultFields, ...customFields };
}
