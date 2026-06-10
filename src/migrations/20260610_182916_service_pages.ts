import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_service_pages_reviews_source" AS ENUM('Google', 'Booksy');
  CREATE TYPE "public"."enum_service_pages_status" AS ENUM('draft', 'published');
  CREATE TABLE "service_pages_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "service_pages_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "service_pages_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"initial" varchar,
  	"avatar_color" varchar DEFAULT '#8B1A3A',
  	"rating" numeric DEFAULT 5,
  	"source" "enum_service_pages_reviews_source" DEFAULT 'Google'
  );
  
  CREATE TABLE "service_pages_reviews_locales" (
  	"quote" varchar NOT NULL,
  	"date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "service_pages_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"before_image_id" integer NOT NULL,
  	"after_image_id" integer NOT NULL
  );
  
  CREATE TABLE "service_pages_before_after_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "service_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_service_pages_status" DEFAULT 'draft',
  	"order" numeric DEFAULT 0,
  	"og_image_id" integer,
  	"hero_image_id" integer,
  	"package_promo_enabled" boolean DEFAULT false,
  	"package_promo_badge" varchar DEFAULT '-15%',
  	"package_promo_link" varchar DEFAULT '#pakiety',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_pages_locales" (
  	"title" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"service_name" varchar,
  	"service_description" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"about" jsonb,
  	"for_whom" jsonb,
  	"results" jsonb,
  	"price_heading" varchar,
  	"package_promo_title" varchar,
  	"package_promo_desc" varchar,
  	"package_promo_now_price" varchar,
  	"package_promo_was_price" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "service_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"prices_id" integer,
  	"service_pages_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_pages_id" integer;
  ALTER TABLE "service_pages_steps" ADD CONSTRAINT "service_pages_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_steps_locales" ADD CONSTRAINT "service_pages_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_reviews" ADD CONSTRAINT "service_pages_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_reviews_locales" ADD CONSTRAINT "service_pages_reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_before_after" ADD CONSTRAINT "service_pages_before_after_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages_before_after" ADD CONSTRAINT "service_pages_before_after_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages_before_after" ADD CONSTRAINT "service_pages_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_before_after_locales" ADD CONSTRAINT "service_pages_before_after_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages_before_after"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_pages_locales" ADD CONSTRAINT "service_pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_rels" ADD CONSTRAINT "service_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_rels" ADD CONSTRAINT "service_pages_rels_prices_fk" FOREIGN KEY ("prices_id") REFERENCES "public"."prices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_pages_rels" ADD CONSTRAINT "service_pages_rels_service_pages_fk" FOREIGN KEY ("service_pages_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "service_pages_steps_order_idx" ON "service_pages_steps" USING btree ("_order");
  CREATE INDEX "service_pages_steps_parent_id_idx" ON "service_pages_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "service_pages_steps_locales_locale_parent_id_unique" ON "service_pages_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "service_pages_reviews_order_idx" ON "service_pages_reviews" USING btree ("_order");
  CREATE INDEX "service_pages_reviews_parent_id_idx" ON "service_pages_reviews" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "service_pages_reviews_locales_locale_parent_id_unique" ON "service_pages_reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "service_pages_before_after_order_idx" ON "service_pages_before_after" USING btree ("_order");
  CREATE INDEX "service_pages_before_after_parent_id_idx" ON "service_pages_before_after" USING btree ("_parent_id");
  CREATE INDEX "service_pages_before_after_before_image_idx" ON "service_pages_before_after" USING btree ("before_image_id");
  CREATE INDEX "service_pages_before_after_after_image_idx" ON "service_pages_before_after" USING btree ("after_image_id");
  CREATE UNIQUE INDEX "service_pages_before_after_locales_locale_parent_id_unique" ON "service_pages_before_after_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "service_pages_slug_idx" ON "service_pages" USING btree ("slug");
  CREATE INDEX "service_pages_og_image_idx" ON "service_pages" USING btree ("og_image_id");
  CREATE INDEX "service_pages_hero_image_idx" ON "service_pages" USING btree ("hero_image_id");
  CREATE INDEX "service_pages_updated_at_idx" ON "service_pages" USING btree ("updated_at");
  CREATE INDEX "service_pages_created_at_idx" ON "service_pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "service_pages_locales_locale_parent_id_unique" ON "service_pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "service_pages_rels_order_idx" ON "service_pages_rels" USING btree ("order");
  CREATE INDEX "service_pages_rels_parent_idx" ON "service_pages_rels" USING btree ("parent_id");
  CREATE INDEX "service_pages_rels_path_idx" ON "service_pages_rels" USING btree ("path");
  CREATE INDEX "service_pages_rels_prices_id_idx" ON "service_pages_rels" USING btree ("prices_id");
  CREATE INDEX "service_pages_rels_service_pages_id_idx" ON "service_pages_rels" USING btree ("service_pages_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_pages_fk" FOREIGN KEY ("service_pages_id") REFERENCES "public"."service_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_service_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("service_pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "service_pages_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_pages_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_pages_reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_pages_reviews_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_pages_before_after" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_pages_before_after_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_pages_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "service_pages_steps" CASCADE;
  DROP TABLE "service_pages_steps_locales" CASCADE;
  DROP TABLE "service_pages_reviews" CASCADE;
  DROP TABLE "service_pages_reviews_locales" CASCADE;
  DROP TABLE "service_pages_before_after" CASCADE;
  DROP TABLE "service_pages_before_after_locales" CASCADE;
  DROP TABLE "service_pages" CASCADE;
  DROP TABLE "service_pages_locales" CASCADE;
  DROP TABLE "service_pages_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_service_pages_fk";
  
  DROP INDEX "payload_locked_documents_rels_service_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "service_pages_id";
  DROP TYPE "public"."enum_service_pages_reviews_source";
  DROP TYPE "public"."enum_service_pages_status";`)
}
