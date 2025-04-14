const { default: prisma } = require('@/lib/prisma');

const seedCategories = require('./category');
const seedProducts = require('./products');

async function main() {
  await prisma.shopPayTransaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.trackingLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.discountAllocation.deleteMany();
  await prisma.cartLine.deleteMany();
  await prisma.appliedGiftCard.deleteMany();
  await prisma.cartDiscountCode.deleteMany();
  await prisma.cartCost.deleteMany();
  await prisma.abandonedCart.deleteMany();
  await prisma.session.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.giftCard.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.taxRate.deleteMany();
  await prisma.shippingRate.deleteMany();
  await prisma.shippingZone.deleteMany();
  await prisma.address.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.money.deleteMany();

  // Then seed in the correct order
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
