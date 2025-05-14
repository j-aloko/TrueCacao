import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Fetch stock from Redis with fallback to database
export async function getCachedStock(productVariantId, fetchFromDB) {
  const cacheKey = `stock:${productVariantId}`;

  let stock = await redis.get(cacheKey);

  if (!stock) {
    stock = await fetchFromDB(productVariantId);
    if (stock !== null) {
      await redis.set(cacheKey, stock, 'EX', 60); // Cache for 60 seconds
    }
  }

  return parseInt(stock, 10);
}

// Invalidate stock cache (e.g., after an update)
export async function invalidateStockCache(productVariantId) {
  const cacheKey = `stock:${productVariantId}`;
  await redis.del(cacheKey);
}
