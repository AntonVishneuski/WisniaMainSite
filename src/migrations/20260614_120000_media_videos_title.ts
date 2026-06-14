import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Idempotent: IF NOT EXISTS / IF EXISTS guards make this safe to re-run
// (consistent with the hero_video migration pattern in this project).
// DEFAULT '' lets the ALTER succeed on existing rows; those rows will have an
// empty title until an editor fills it in via the admin panel.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media_videos" ADD COLUMN IF NOT EXISTS "title" varchar NOT NULL DEFAULT '';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media_videos" DROP COLUMN IF EXISTS "title";
  `)
}
