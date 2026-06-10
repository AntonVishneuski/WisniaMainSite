# Wiśnia Beauty Studio

Marketing site for Wiśnia Beauty Studio — a professional laser hair removal studio.

## Stack

- **Next.js 15** (App Router) + **Payload CMS 3**
- **PostgreSQL** (database) — local or Docker
- **Vercel Blob** (media storage in production)
- **next-intl** (PL + RU localisation)
- **Tailwind CSS v4** with custom design tokens
- Deployed to **Vercel**

## Local development

### Prerequisites

- Node.js 20+, pnpm 9+
- Local PostgreSQL instance (or use Docker — see below)

### Setup

```bash
pnpm install
cp .env.example .env
# Edit .env: set DATABASE_URL, PAYLOAD_SECRET, and any optional vars
pnpm dev
```

The app runs at <http://localhost:3000>. The Payload admin panel is at <http://localhost:3000/admin>.

### Seed demo data

```bash
pnpm seed
```

### Database migrations

```bash
pnpm payload migrate        # run pending migrations
pnpm payload migrate:create # create a new migration after schema changes
```

### Docker (optional Postgres)

```bash
docker-compose up -d        # starts a Postgres 16 container on port 5432
# Then set DATABASE_URL=postgresql://wisnia:wisnia@localhost:5432/wisnia in .env
pnpm dev
```

## Tests

```bash
pnpm test          # unit + integration (Vitest)
pnpm test:e2e      # end-to-end (Playwright) — requires a running dev server
```

## Build

```bash
pnpm build         # production build
pnpm start         # serve the production build locally
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel setup, environment variables, and release process.
