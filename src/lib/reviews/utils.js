import prisma from '@/lib/prisma';
import {
  getProductReviewStats,
  sanitizeProductData,
} from '@/lib/products/utils';

export async function createReview({ userId, productId, rating, comment }) {
  if (!userId || !productId || !rating) {
    throw new Error('User ID, product ID, and rating are required');
  }

  await prisma.review.create({
    data: { comment, productId, rating, userId },
  });

  const { averageRating, totalReviews, averageRatingPrecision } =
    await getProductReviewStats(productId);

  const updatedProduct = await prisma.product.update({
    data: { averageRating, averageRatingPrecision, totalReviews },
    where: { id: productId },
  });

  return sanitizeProductData(updatedProduct);
}

export async function getProductReviews(productId) {
  return prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      comment: true,
      createdAt: true,
      id: true,
      rating: true,
      user: { select: { name: true } },
    },
    where: { productId },
  });
}
