-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_imageId_fkey";

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
