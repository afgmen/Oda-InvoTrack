# Oda InvoTrack

Oda InvoTrack is a standalone restaurant VAT e-invoice request tracker. It is not an
invoice issuer, accounting system, tax portal automation system, system of record, or
long-term invoice archive.

The product requirements are defined by
[`docs/oda-invotrack-prd-v0.9.1.md`](docs/oda-invotrack-prd-v0.9.1.md).

## Phase 0 scope

This repository currently contains only the application foundation:

- Next.js App Router with TypeScript and Tailwind CSS
- Supabase Auth using email magic-link/OTP
- Supabase Postgres company membership and role foundation
- RLS policies for authenticated company access
- private, deny-by-default temporary-file buckets
- Vitest, pgTAP, Playwright, ESLint, Prettier, and production-build checks

QR codes, invoice requests, request statuses, uploads, Card Ready, and other Phase 1+
features are intentionally absent.

## Toolchain

- Node.js `24.16.0`
- pnpm `11.5.2`
- Docker Desktop
- Supabase CLI

Use `nvm use` before running project commands. Corepack or the pinned package manager
field will select the expected pnpm release.

## Local setup

```bash
nvm install
nvm use
corepack enable
pnpm install
pnpm supabase:start
cp .env.example .env.local
```

Populate `.env.local` from `pnpm exec supabase status -o env`, then run:

```bash
pnpm dev
```

The local start command excludes optional services not used in Phase 0: Edge
Functions, Realtime, analytics, vector search, image proxying, and Studio.

Local Supabase Studio is normally available at `http://127.0.0.1:54323`. Create a
company and membership with `supabase/seed.sql` as a template after creating a user
through Auth.

## Verification

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:db
pnpm build
pnpm test:e2e
```

Playwright expects the local Supabase stack to be running. The browser test uses
Supabase Inbucket to follow the local magic link without a real email provider.

## Environment variables

Only the Supabase URL and publishable key are public. The service-role key is
server-only and must never use a `NEXT_PUBLIC_*` name.

Vercel Preview and Production environments must use separate non-production and
production Supabase projects. GitHub Actions runs quality checks; Vercel Git
integration creates PR previews and deploys `main` to production.
