-- AlterTable
ALTER TABLE "public"."categories" RENAME CONSTRAINT "categories_clerk_user_id_fkey" TO "categories_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."categories" 
RENAME COLUMN "clerk_user_id" TO "user_id"