/*
  Warnings:

  - You are about to drop the column `value` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCost` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cartId]` on the table `AbandonedCart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartId` to the `AbandonedCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueId` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineTotalId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CURRENCY_CODE" AS ENUM ('GHS', 'NGN', 'USD');

-- DropForeignKey
ALTER TABLE "AbandonedCart" DROP CONSTRAINT "AbandonedCart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_abandonedCartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_userId_fkey";

-- AlterTable
ALTER TABLE "AbandonedCart" ADD COLUMN     "cartId" TEXT NOT NULL,
ADD COLUMN     "recovered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recoveredAt" TIMESTAMP(3),
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "value",
ADD COLUMN     "minAmountId" TEXT,
ADD COLUMN     "valueId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingCost",
ADD COLUMN     "shippingCostId" TEXT,
ADD COLUMN     "subtotalId" TEXT NOT NULL,
ADD COLUMN     "taxAmountId" TEXT,
ADD COLUMN     "totalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "price",
ADD COLUMN     "lineTotalId" TEXT NOT NULL,
ADD COLUMN     "priceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
ADD COLUMN     "amountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "price",
ADD COLUMN     "priceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "CartItem";

-- CreateTable
CREATE TABLE "AppliedGiftCard" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "giftCardId" TEXT NOT NULL,
    "amountUsedId" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,
    "lastCharacters" TEXT NOT NULL,
    "presentmentAmountUsedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppliedGiftCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "checkoutUrl" TEXT NOT NULL,
    "note" TEXT,
    "totalQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartCost" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "subtotalId" TEXT NOT NULL,
    "subtotalAmount" DECIMAL(65,30) NOT NULL,
    "totalTaxId" TEXT NOT NULL,
    "totalTaxAmount" DECIMAL(65,30) NOT NULL,
    "totalId" TEXT NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "shippingId" TEXT,
    "shippingAmount" DECIMAL(65,30),
    "discountId" TEXT,
    "discountAmount" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartDiscountCode" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "applicable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartDiscountCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartLine" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "priceId" TEXT NOT NULL,
    "attributes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountAllocation" (
    "id" TEXT NOT NULL,
    "cartLineId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "amountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscountAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftCard" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "initialValueId" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Money" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currencyCode" "CURRENCY_CODE" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Money_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_checkoutUrl_key" ON "Cart"("checkoutUrl");

-- CreateIndex
CREATE UNIQUE INDEX "CartCost_cartId_key" ON "CartCost"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_code_key" ON "GiftCard"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AbandonedCart_cartId_key" ON "AbandonedCart"("cartId");

-- AddForeignKey
ALTER TABLE "AbandonedCart" ADD CONSTRAINT "AbandonedCart_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbandonedCart" ADD CONSTRAINT "AbandonedCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedGiftCard" ADD CONSTRAINT "AppliedGiftCard_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedGiftCard" ADD CONSTRAINT "AppliedGiftCard_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "GiftCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedGiftCard" ADD CONSTRAINT "AppliedGiftCard_amountUsedId_fkey" FOREIGN KEY ("amountUsedId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedGiftCard" ADD CONSTRAINT "AppliedGiftCard_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedGiftCard" ADD CONSTRAINT "AppliedGiftCard_presentmentAmountUsedId_fkey" FOREIGN KEY ("presentmentAmountUsedId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartCost" ADD CONSTRAINT "CartCost_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartCost" ADD CONSTRAINT "CartCost_subtotalId_fkey" FOREIGN KEY ("subtotalId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartCost" ADD CONSTRAINT "CartCost_totalTaxId_fkey" FOREIGN KEY ("totalTaxId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartCost" ADD CONSTRAINT "CartCost_totalId_fkey" FOREIGN KEY ("totalId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartCost" ADD CONSTRAINT "CartCost_shippingId_fkey" FOREIGN KEY ("shippingId") REFERENCES "Money"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartCost" ADD CONSTRAINT "CartCost_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Money"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartDiscountCode" ADD CONSTRAINT "CartDiscountCode_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartLine" ADD CONSTRAINT "CartLine_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartLine" ADD CONSTRAINT "CartLine_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartLine" ADD CONSTRAINT "CartLine_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_minAmountId_fkey" FOREIGN KEY ("minAmountId") REFERENCES "Money"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountAllocation" ADD CONSTRAINT "DiscountAllocation_cartLineId_fkey" FOREIGN KEY ("cartLineId") REFERENCES "CartLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountAllocation" ADD CONSTRAINT "DiscountAllocation_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountAllocation" ADD CONSTRAINT "DiscountAllocation_amountId_fkey" FOREIGN KEY ("amountId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftCard" ADD CONSTRAINT "GiftCard_initialValueId_fkey" FOREIGN KEY ("initialValueId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftCard" ADD CONSTRAINT "GiftCard_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingCostId_fkey" FOREIGN KEY ("shippingCostId") REFERENCES "Money"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_taxAmountId_fkey" FOREIGN KEY ("taxAmountId") REFERENCES "Money"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_subtotalId_fkey" FOREIGN KEY ("subtotalId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_totalId_fkey" FOREIGN KEY ("totalId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_lineTotalId_fkey" FOREIGN KEY ("lineTotalId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_amountId_fkey" FOREIGN KEY ("amountId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Money"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
