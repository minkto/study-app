/*
  Warnings:

  - Made the column `clerk_user_id` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_clerk_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."categories" ALTER COLUMN "clerk_user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "public"."users"("clerk_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
