/*
  Warnings:

  - You are about to drop the column `recipeId` on the `Photo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[photoId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_recipeId_fkey";

-- DropIndex
DROP INDEX "Photo_recipeId_key";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "recipeId";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "photoId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_photoId_key" ON "Recipe"("photoId");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
