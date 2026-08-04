-- 2. Add new uuid column to users, backfill
ALTER TABLE "users" ADD COLUMN "user_id_new" UUID DEFAULT gen_random_uuid();
UPDATE "users" SET "user_id_new" = gen_random_uuid() WHERE "user_id_new" IS NULL;

-- 3. Add new uuid FK columns to dependent tables
ALTER TABLE "categories" ADD COLUMN "user_id_new" UUID;
ALTER TABLE "user_settings" ADD COLUMN "user_id_new" UUID;
ALTER TABLE "resources" ADD COLUMN "user_id_new" UUID;

-- 4a. Backfill categories/user_settings by joining on the OLD integer user_id
UPDATE "categories" c
SET "user_id_new" = u."user_id_new"
FROM "users" u
WHERE c."user_id" = u."user_id";

UPDATE "user_settings" s
SET "user_id_new" = u."user_id_new"
FROM "users" u
WHERE s."user_id" = u."user_id";

-- 4b. Backfill resources by joining on clerk_user_id instead (different key!)
UPDATE "resources" r
SET "user_id_new" = u."user_id_new"
FROM "users" u
WHERE r."user_id" = u."clerk_user_id";

-- 4c. Sanity check before proceeding — this should return 0 rows.
-- If it doesn't, you have resources with a user_id that doesn't match
-- any clerk_user_id (orphaned data) — investigate before continuing.
SELECT count(*) FROM "resources" WHERE "user_id_new" IS NULL;

-- 5. Drop old FK constraints (verify actual names via \d first)
ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_user_id_fkey";
ALTER TABLE "user_settings" DROP CONSTRAINT IF EXISTS "user_settings_user_id_fkey";

-- 6. Drop old unique constraint on categories before column swap
ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_user_id_name_key";

-- 7. Drop old columns, rename new ones into place
ALTER TABLE "users" DROP COLUMN "user_id";
ALTER TABLE "users" RENAME COLUMN "user_id_new" TO "user_id";
ALTER TABLE "users" ADD PRIMARY KEY ("user_id");

ALTER TABLE "categories" DROP COLUMN "user_id";
ALTER TABLE "categories" RENAME COLUMN "user_id_new" TO "user_id";
ALTER TABLE "categories" ALTER COLUMN "user_id" SET NOT NULL;

ALTER TABLE "user_settings" DROP COLUMN "user_id";
ALTER TABLE "user_settings" RENAME COLUMN "user_id_new" TO "user_id";
ALTER TABLE "user_settings" ALTER COLUMN "user_id" SET NOT NULL;

ALTER TABLE "resources" DROP COLUMN "user_id";
ALTER TABLE "resources" RENAME COLUMN "user_id_new" TO "user_id";
ALTER TABLE "resources" ALTER COLUMN "user_id" SET NOT NULL;

-- 8. Recreate constraints
ALTER TABLE "categories"
  ADD CONSTRAINT "categories_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("user_id");

ALTER TABLE "categories"
  ADD CONSTRAINT "categories_user_id_name_key"
  UNIQUE ("user_id", "name");

ALTER TABLE "user_settings"
  ADD CONSTRAINT "user_settings_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("user_id");

ALTER TABLE "user_settings"
  ADD CONSTRAINT "user_settings_user_id_key"
  UNIQUE ("user_id");

ALTER TABLE "resources"
  ADD CONSTRAINT "resources_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("user_id");