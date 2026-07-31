# EHSWatch — Marketing Site (Frontend)

Marketing website for **EHSWatch**, an AI-powered EHSQ platform. Next.js App Router
frontend that renders content from the EHSWatch CMS. Deployed to the **stage**
environment at `https://stage.odigma.ooo/ehswatch-stage`.

---

## Stack

- **Next.js 16** (App Router) + **React 19**, **TypeScript**
- **Tailwind CSS v4**
- `output: "standalone"` build, served by **PM2** behind **nginx + Cloudflare**
- Content from the **EHSWatch CMS** (Laravel/Filament) via a JSON API

> **basePath is `/ehswatch-stage`.** The whole app is served under that path, so
> local URLs are `http://localhost:3000/ehswatch-stage` — **not** `localhost:3000/`
> (that 404s).

---

## Getting started

Requires **Node 20**.

```bash
git clone git@github.com:adityagupta-odg-dev/ehswatch-website.git
cd ehswatch-website
git checkout stage            # active branch — see "Branches" below
cp .env.example .env.local    # then fill in the values (see "Environment")
npm ci
npm run dev
```

Open **http://localhost:3000/ehswatch-stage**.

### Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Dev server (hot reload) |
| `npm run build` | Production build (`next build --webpack`) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

---

## Environment

Copy `.env.example` → `.env.local` and set:

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_BASE_PATH` | App base path — `/ehswatch-stage` on stage |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for forms |

Real secret values are shared **out-of-band** (password manager), never committed.
`.env*` and `*.pem` are git-ignored.

---

## Project structure

```
app/                      App Router routes (pages, layout, metadata, /api)
  modules/[slug]/         Product-module detail pages (CMS-driven)
  preview/[type]/[slug]/  CMS draft preview
components/
  layout/                 Navbar, Footer, i18n (GoogleTranslate, ArabicOverrides)
  sections/               Page sections (hero, pricing, IRIS, industries, blog, …)
  ui/                     Reusable UI primitives
lib/
  api.ts                  CMS fetch layer (axios; retry/timeout; SSR cache; LKG)
  blocks.ts               CMS block helpers (buildPageMap, resolveCta, mediaUrl…)
  moduleContent.ts        Maps CMS product-module → ModuleTemplate props
  text.ts                 headingHtml() etc. (CMS heading highlight spans)
```

---

## CMS

Content comes from **`https://stage.odigma.ooo/ehswatch-cms/api/v1/`**
(`/pages/{slug}`, `/product-modules/{slug}`, `/settings`, `/header`, …).
Headings, CTAs, images, forms, and module pages are all CMS-driven. The CMS is a
**separate Laravel app** (not this repo). `lib/api.ts` never throws — it returns
`null` / last-known-good on failure so a CMS blip degrades gracefully.

---

## Branches & deploy

- **`stage`** — active branch and **default**. Do all work here (branch from
  `stage`, PR back into `stage`).
- **`main`** — **legacy** (untouched since Jul 2026, superseded by `stage`).
  Its deploy is manual-only. Don't merge `main` into `stage`.

**Deploy is automatic:** pushing to `stage` triggers `.github/workflows/deploy.yml`,
which runs `npm ci` + `npm run build`, bundles the standalone output, ships it to
the server, does a blue-green swap into `ehswatch-next`, and `pm2 restart`s the app
(PM2 process **`ehswatch-stage`**, listening on port **3003**). Deploy credentials
live in **GitHub Actions Secrets** (`DEPLOY_HOST/USER/SSH_KEY`) — not in the repo.

---

## Gotchas (read these — they cost hours otherwise)

- **Cloudflare cache:** the public site is behind Cloudflare. If a change "isn't
  showing", it's usually stale cache — test in **incognito / hard-refresh** first.
- **basePath:** local dev is at `/ehswatch-stage`, and assets/images resolve under
  that path. `next/image` uses `remotePatterns` for `stage.odigma.ooo` + `unoptimized`.
- **i18n / Arabic (RTL):** a first-party translator (`components/layout/GoogleTranslate.tsx`
  → `/api/translate`) plus an authored-override map (`ArabicOverrides.tsx`). In RTL,
  **use logical CSS props** (`text-start`, `ps-`, `me-`) — physical ones (`text-left`,
  `pl-`, `mr-`) don't flip and cause bugs.
- **Never commit build output:** `.next/`, `out/`, static exports, snapshots, or
  `node_modules` (see `.gitignore`). CI always builds fresh.
