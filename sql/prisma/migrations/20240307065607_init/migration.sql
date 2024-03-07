/*
  Warnings:

  - You are about to drop the column `author` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `totalWord` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "author",
DROP COLUMN "content",
DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "images",
DROP COLUMN "totalWord",
DROP COLUMN "updated_at";
