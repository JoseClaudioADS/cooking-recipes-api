/*
  Warnings:

  - Added the required column `caterogyId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "caterogyId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_caterogyId_fkey" FOREIGN KEY ("caterogyId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
