-- CreateTable
CREATE TABLE "public"."user_settings" (
    "user_setting_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ai_helper_credits" INTEGER NOT NULL DEFAULT 0,
    "global_chapter_days_before_review_due" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_setting_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "public"."user_settings"("user_id");

-- AddForeignKey
ALTER TABLE "public"."user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
