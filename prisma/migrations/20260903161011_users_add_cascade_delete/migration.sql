-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."chapters" DROP CONSTRAINT "chapters_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."notes" DROP CONSTRAINT "notes_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."resources" DROP CONSTRAINT "resources_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_settings" DROP CONSTRAINT "user_settings_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chapters" ADD CONSTRAINT "chapters_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("resource_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."notes" ADD CONSTRAINT "notes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("chapter_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
