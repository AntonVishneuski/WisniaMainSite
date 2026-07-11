import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { MediaVideos } from './collections/MediaVideos'
import { Prices } from './collections/Prices'
import { Reviews } from './collections/Reviews'
import { BeforeAfter } from './collections/BeforeAfter'
import { ServicePages } from './collections/ServicePages'
import { Authors } from './collections/Authors'
import { Posts } from './collections/Posts'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, MediaVideos, Prices, Reviews, BeforeAfter, ServicePages, Authors, Posts],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Use committed migrations only. Without this, Payload's default dev/test
    // "push" mode syncs the config schema straight into the connected DB (prod,
    // via .env) and leaves a `dev` row in payload_migrations that hangs
    // `payload migrate` on deploy. Schema changes must go through migrations.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  localization: {
    locales: [
      { label: 'Polski', code: 'pl' },
      { label: 'Русский', code: 'ru' },
    ],
    defaultLocale: 'pl',
    fallback: true,
  },
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true, 'media-videos': true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true,
      // Without this, two uploads that land on the same blob pathname (e.g. a retry after a
      // required-field validation error, or simply two files sharing a filename like
      // "photo.png") throw "This blob already exists" — Vercel Blob's put() does not overwrite
      // by default. addRandomSuffix makes every upload's storage key unique so retries and
      // filename collisions never fail; Payload keeps the doc's `filename` in sync with the
      // actual randomized name it gets back.
      addRandomSuffix: true,
    }),
  ],
})
