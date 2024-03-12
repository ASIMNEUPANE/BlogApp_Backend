/*
  Warnings:

  - You are about to drop the column `author_id` on the `Blog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_author_id_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "author_id";

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
