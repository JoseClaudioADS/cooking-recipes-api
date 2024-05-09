-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_recipeId_fkey";

-- AlterTable
ALTER TABLE "Photo" ALTER COLUMN "recipeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
