import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "service_pages_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "service_pages_gallery_locales" (
      "caption" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    ALTER TABLE "service_pages_gallery"
      DROP CONSTRAINT IF EXISTS "service_pages_gallery_image_id_media_id_fk";
    ALTER TABLE "service_pages_gallery"
      ADD CONSTRAINT "service_pages_gallery_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "service_pages_gallery"
      DROP CONSTRAINT IF EXISTS "service_pages_gallery_parent_id_fk";
    ALTER TABLE "service_pages_gallery"
      ADD CONSTRAINT "service_pages_gallery_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "service_pages_gallery_locales"
      DROP CONSTRAINT IF EXISTS "service_pages_gallery_locales_parent_id_fk";
    ALTER TABLE "service_pages_gallery_locales"
      ADD CONSTRAINT "service_pages_gallery_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages_gallery"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "service_pages_gallery_order_idx"
      ON "service_pages_gallery" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "service_pages_gallery_parent_id_idx"
      ON "service_pages_gallery" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "service_pages_gallery_image_idx"
      ON "service_pages_gallery" USING btree ("image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "service_pages_gallery_locales_locale_parent_id_unique"
      ON "service_pages_gallery_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "service_pages_gallery_locales" CASCADE;
    DROP TABLE IF EXISTS "service_pages_gallery" CASCADE;
  `)
}
