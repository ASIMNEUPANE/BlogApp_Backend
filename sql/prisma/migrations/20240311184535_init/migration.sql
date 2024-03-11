/*
  Warnings:

  - Made the column `created_by` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "userId" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "created_by" SET DEFAULT 0,
ALTER COLUMN "roles" SET DEFAULT 'users',
ALTER COLUMN "updated_by" SET NOT NULL,
ALTER COLUMN "updated_by" SET DEFAULT 0;
