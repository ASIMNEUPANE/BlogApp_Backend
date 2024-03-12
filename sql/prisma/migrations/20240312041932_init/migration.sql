/*
  Warnings:

  - The values [Technology] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - The values [users,admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [draft] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('TECHNOLOGY', 'Travel', 'Food', 'Lifestyle');
ALTER TABLE "Blog" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Blog" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
ALTER TABLE "Blog" ALTER COLUMN "category" SET DEFAULT 'TECHNOLOGY';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USERS', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "roles" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "Role_new" USING ("roles"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT 'USERS';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('Published', 'DRAFT');
ALTER TABLE "Blog" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Blog" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Blog" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "category" SET DEFAULT 'TECHNOLOGY',
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT 'USERS';
