import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "media_videos" (
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
  
  CREATE TABLE "media_videos_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "service_pages" ADD COLUMN "hero_video_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_videos_id" integer;
  ALTER TABLE "settings" ADD COLUMN "hero_video_id" integer;
  ALTER TABLE "media_videos_locales" ADD CONSTRAINT "media_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_videos_updated_at_idx" ON "media_videos" USING btree ("updated_at");
  CREATE INDEX "media_videos_created_at_idx" ON "media_videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_videos_filename_idx" ON "media_videos" USING btree ("filename");
  CREATE UNIQUE INDEX "media_videos_locales_locale_parent_id_unique" ON "media_videos_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "service_pages" ADD CONSTRAINT "service_pages_hero_video_id_media_videos_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media_videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_videos_fk" FOREIGN KEY ("media_videos_id") REFERENCES "public"."media_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_hero_video_id_media_videos_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media_videos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "service_pages_hero_video_idx" ON "service_pages" USING btree ("hero_video_id");
  CREATE INDEX "payload_locked_documents_rels_media_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("media_videos_id");
  CREATE INDEX "settings_hero_video_idx" ON "settings" USING btree ("hero_video_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_videos_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_videos" CASCADE;
  DROP TABLE "media_videos_locales" CASCADE;
  ALTER TABLE "service_pages" DROP CONSTRAINT "service_pages_hero_video_id_media_videos_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_videos_fk";
  
  ALTER TABLE "settings" DROP CONSTRAINT "settings_hero_video_id_media_videos_id_fk";
  
  DROP INDEX "service_pages_hero_video_idx";
  DROP INDEX "payload_locked_documents_rels_media_videos_id_idx";
  DROP INDEX "settings_hero_video_idx";
  ALTER TABLE "service_pages" DROP COLUMN "hero_video_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_videos_id";
  ALTER TABLE "settings" DROP COLUMN "hero_video_id";`)
}
