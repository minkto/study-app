-- CreateTable
CREATE TABLE "public"."notes" (
    "note_id" SERIAL NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "content" VARCHAR(256),
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("note_id")
);

-- AddForeignKey
ALTER TABLE "public"."notes" ADD CONSTRAINT "notes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("chapter_id") ON DELETE RESTRICT ON UPDATE CASCADE;
