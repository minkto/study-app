-- CreateTable
CREATE TABLE "public"."statuses" (
    "status_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "public"."resources" (
    "resource_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category_id" INTEGER,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("resource_id")
);

-- CreateTable
CREATE TABLE "public"."chapters" (
    "chapter_id" SERIAL NOT NULL,
    "resource_id" INTEGER NOT NULL,
    "status_id" INTEGER,
    "name" TEXT NOT NULL,
    "url" VARCHAR(800),
    "original_date_completed" TIMESTAMP(3),
    "last_date_completed" TIMESTAMP(3),

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("chapter_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statuses_status_id_key" ON "public"."statuses"("status_id");

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chapters" ADD CONSTRAINT "chapters_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("resource_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chapters" ADD CONSTRAINT "chapters_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("status_id") ON DELETE SET NULL ON UPDATE CASCADE;
