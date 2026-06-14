import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Idempotent on purpose: `push` mode (used in dev/test against this project's DB)
// may have already created these objects, so a plain CREATE/ADD would fail on
// deploy with "already exists". IF NOT EXISTS + DROP-then-ADD for constraints
// makes `payload migrate` a safe no-op when the schema is already present, and a
// normal create on a fresh database. Schema result is identical either way.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "media_videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );

  CREATE TABLE IF NOT EXISTS "media_videos_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "service_pages" ADD COLUMN IF NOT EXISTS "hero_video_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "media_videos_id" integer;
  ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "hero_video_id" integer;
  ALTER TABLE "media_videos_locales" DROP CONSTRAINT IF EXISTS "media_videos_locales_parent_id_fk";
  ALTER TABLE "media_videos_locales" ADD CONSTRAINT "media_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "media_videos_updated_at_idx" ON "media_videos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_videos_created_at_idx" ON "media_videos" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_videos_filename_idx" ON "media_videos" USING btree ("filename");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_videos_locales_locale_parent_id_unique" ON "media_videos_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "service_pages" DROP CONSTRAINT IF EXISTS "service_pages_hero_video_id_media_videos_id_fk";
  ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_hero_video_id_media_videos_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media_videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_media_videos_fk";
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_videos_fk" FOREIGN KEY ("media_videos_id") REFERENCES "public"."media_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" DROP CONSTRAINT IF EXISTS "settings_hero_video_id_media_videos_id_fk";
  ALTER TABLE "settings" ADD CONSTRAINT "settings_hero_video_id_media_videos_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media_videos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "service_pages_hero_video_idx" ON "service_pages" USING btree ("hero_video_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("media_videos_id");
  CREATE INDEX IF NOT EXISTS "settings_hero_video_idx" ON "settings" USING btree ("hero_video_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "media_videos" CASCADE;
  DROP TABLE IF EXISTS "media_videos_locales" CASCADE;
  ALTER TABLE "service_pages" DROP COLUMN IF EXISTS "hero_video_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "media_videos_id";
  ALTER TABLE "settings" DROP COLUMN IF EXISTS "hero_video_id";`)
}
