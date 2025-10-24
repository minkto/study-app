-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "clerk_user_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "public"."users"("clerk_user_id") ON DELETE SET NULL ON UPDATE CASCADE;
