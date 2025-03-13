/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `barVariant` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `powderVariant` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `packaging` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productVariantId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "COCOA_POWDER_PACKAGING" AS ENUM ('SACHET', 'JAR', 'CARTON_OF_SACHETS', 'CARTON_OF_JARS');

-- CreateEnum
CREATE TYPE "COCOA_BAR_PACKAGING" AS ENUM ('BOX_70_PERCENT', 'CARTON_70_PERCENT', 'BOX_80_PERCENT', 'CARTON_80_PERCENT', 'BOX_90_PERCENT', 'CARTON_90_PERCENT');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ALTER COLUMN "stock" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "barVariant",
DROP COLUMN "powderVariant",
ADD COLUMN     "packaging" JSONB NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "COCOA_BAR_VARIANT";

-- DropEnum
DROP TYPE "COCOA_POWDER_VARIANT";

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
