import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "service_pages_faq" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "service_pages_faq_locales" (
      "question" varchar,
      "answer" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    ALTER TABLE "service_pages_faq"
      DROP CONSTRAINT IF EXISTS "service_pages_faq_parent_id_fk";
    ALTER TABLE "service_pages_faq"
      ADD CONSTRAINT "service_pages_faq_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "service_pages_faq_locales"
      DROP CONSTRAINT IF EXISTS "service_pages_faq_locales_parent_id_fk";
    ALTER TABLE "service_pages_faq_locales"
      ADD CONSTRAINT "service_pages_faq_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages_faq"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "service_pages_faq_order_idx"
      ON "service_pages_faq" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "service_pages_faq_parent_id_idx"
      ON "service_pages_faq" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "service_pages_faq_locales_locale_parent_id_unique"
      ON "service_pages_faq_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "service_pages_faq_locales" CASCADE;
    DROP TABLE IF EXISTS "service_pages_faq" CASCADE;
  `)
}
