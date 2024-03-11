/*
  Warnings:

  - Added the required column `author` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWord` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Published', 'draft');

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "images" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'draft',
ADD COLUMN     "totalWord" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
