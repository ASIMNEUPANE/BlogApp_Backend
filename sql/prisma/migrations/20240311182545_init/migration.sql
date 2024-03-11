-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Technology', 'Travel', 'Food', 'Lifestyle');

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'Technology',

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);
