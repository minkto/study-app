/*
  Warnings:

  - Made the column `status_id` on table `chapters` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."chapters" DROP CONSTRAINT "chapters_status_id_fkey";

-- AlterTable
ALTER TABLE "public"."chapters" ALTER COLUMN "status_id" SET NOT NULL,
ALTER COLUMN "status_id" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "public"."chapters" ADD CONSTRAINT "chapters_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;
