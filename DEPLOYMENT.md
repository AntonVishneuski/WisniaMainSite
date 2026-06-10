# Deployment — Wiśnia Beauty (Phase 1, Vercel)

This app is a single Next.js 16 + Payload CMS 3 project. One Vercel deploy serves the
public site (`/`, `/ru`), the admin panel (`/admin`), and the API (`/api`).

Local build is verified (`pnpm build` passes; SSG for `/[locale]` with ISR, dynamic `/admin` + `/api`).

## 0. Prerequisites (you do these — they need your account/credentials)
- A **Vercel account** with access to the GitHub repo `AntonVishneuski/WisniaMainSite`.
- The branch `worktree-phase1-core` is on GitHub. Either merge it to `main` (recommended) or
  set it as the Vercel **Production Branch**.

## 1. Provision storage (Vercel dashboard → Storage)
- **Postgres** (Vercel Postgres / Neon): create a database, attach it to the project. This sets
  `DATABASE_URL` (and friends) automatically. Payload's Postgres adapter uses `DATABASE_URL`.
- **Blob**: create a Blob store, attach to the project. This sets `BLOB_READ_WRITE_TOKEN`.
  (When this token is present, uploaded media is stored in Vercel Blob instead of local disk.)

## 2. Environment variables (Project → Settings → Environment Variables)
| Variable | Value |
| --- | --- |
| `DATABASE_URL` | from Vercel Postgres (auto if attached) |
| `BLOB_READ_WRITE_TOKEN` | from Vercel Blob (auto if attached) |
| `PAYLOAD_SECRET` | a fresh 32+ char random string (e.g. `openssl rand -hex 24`) — **not** the local one |
| `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://wisniabeauty.pl` |

## 3. Build settings
- Framework preset: **Next.js**. Build command: leave as default (Vercel will auto-detect and
  use the `vercel-build` script instead of `build`). Install command: `pnpm install`.
- Node version: 20.x or 22.x (the app supports `>=20.9`).
- No special overrides needed (config is in `next.config.ts`).

### Database migrations
Payload DB migrations are committed in `src/migrations/`. The `vercel-build` script runs
`payload migrate` **before** `next build`, so the production schema is created (or updated)
automatically on every deploy — no manual schema step needed.

The `build` script (used locally) runs plain `next build` without the migration step; run
`pnpm payload migrate` separately in local dev if you add new migrations.

> If you customise Vercel's Build Command in the dashboard, use:
> `pnpm run vercel-build`

## 4. First deploy
- Import the repo in Vercel (or `git push` to the production branch). Vercel runs `next build`.
- After it deploys, open `https://<your-domain>/admin` → **create the first admin user**
  (email + password). This is the owner login.

## 5. Seed production content (one-off)
After the first deploy the schema already exists (migrations ran during `vercel-build`), but
the **content tables are empty**. Seed the design content (62 prices, 6 reviews, 6 before/after,
settings) as a separate one-off step:

Option A — from your machine against the prod DB:
```bash
# in the project, with a temporary .env.production.local containing the PROD values:
#   DATABASE_URL=<vercel postgres url>
#   BLOB_READ_WRITE_TOKEN=<vercel blob token>
#   PAYLOAD_SECRET=<prod secret>
pnpm seed
```
The seed **inserts content only** — the schema is already created by the migration. It is
**idempotent** (it wipes prices/reviews/beforeAfter/media first), so it's safe to rerun.
Before/after images are uploaded from `wisnia-beauty/design_handoff/source/assets/` into Blob.

Option B — edit everything by hand in `/admin` instead of seeding.

## 6. Post-deploy configuration (in `/admin` → Ustawienia, and code)
Fill the **Settings** global once live:
- `siteUrl` = production URL; `gtmId` (GTM-XXXXXXX), `ga4Id`, `searchConsoleToken` — paste your real IDs
  (these were left blank; GTM/GA4/Search Console load only when set).
- `mapEmbedUrl` = the studio's official Google Maps "Embed a map" URL.
- Confirm `whatsapp` (`48453270435`), `booksyUrl` (`https://wisniabeauty.booksy.com/a`), phone, hours.
- Rating badges (`googleRating`, `booksyRating`) — keep in sync with live profiles.

Also (from the design handoff TODOs):
- Verify the **WhatsApp** number is registered on WhatsApp.
- Add the privacy policy's **legal entity** (NIP / company name) + data-request e-mail.
- Add a male hero photo + male reviews for the men's laser page (Phase 2), and real photos for the
  placeholder service heroes (Phase 2).

## 7. SEO go-live checklist
- Submit `https://<domain>/sitemap.xml` in **Google Search Console** (verify via `searchConsoleToken`).
- Set up the **Google Business Profile** with NAP matching the site.
- Confirm Lighthouse SEO ≥ 95 and LCP ≤ ~2.5–3s on mobile.

## CLI alternative (optional)
After you run `vercel login` yourself, the project can be linked/deployed via:
```bash
pnpm dlx vercel link
pnpm dlx vercel --prod
```
Env vars and storage still need to be set/attached in the dashboard (or `vercel env add`).
