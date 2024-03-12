-- DropIndex
DROP INDEX "Blog_status_idx";

-- CreateIndex
CREATE INDEX "Blog_status_title_idx" ON "Blog"("status", "title");
