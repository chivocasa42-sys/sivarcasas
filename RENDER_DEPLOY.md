# SivarCasas – Render Deployment Guide

## Architecture Overview

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 16 (App Router) |
| Rendering | SSR (Server-Side Rendering) |
| API Routes | 13 routes using Supabase REST + RPC |
| Database | Supabase (PostgreSQL) |
| Image Processing | `sharp` (native, compiled on Render) |
| Output Mode | `standalone` (self-contained Node.js server) |
| Hosting | Render Web Service (persistent Node.js) |

## Pre-Deployment Checklist

- [x] `output: 'standalone'` in `next.config.ts`
- [x] No `@vercel/*` dependencies in `package.json`
- [x] No Vercel Analytics or Speed Insights imports
- [x] No serverless assumptions in API routes
- [x] `sharp` in production dependencies (for `next/image`)
- [x] `engines` field in `package.json` (Node >= 18)
- [x] `render.yaml` blueprint with all env vars declared
- [x] Health check endpoint configured (`/api/tags`)

## Deploying to Render

### Option A: Blueprint (Recommended)

1. Push this repo to GitHub/GitLab
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **"New" → "Blueprint"**
4. Connect your repository
5. Render will auto-detect `render.yaml` and create the service
6. **Set the secret env vars** in the Render Dashboard:
   - `SUPABASE_URL` → your Supabase project URL
   - `SUPABASE_SERVICE_KEY` → your Supabase service role key

### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New" → "Web Service"**
3. Connect your repository
4. Configure:
   - **Name**: `sivarcasas`
   - **Runtime**: Node
   - **Build Command**:
     ```bash
     npm ci && npm run build && cp -r public .next/standalone/public && cp -r .next/static .next/standalone/.next/static
     ```
   - **Start Command**:
     ```bash
     node .next/standalone/server.js
     ```
5. Add environment variables:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `HOSTNAME` | `0.0.0.0` |
   | `SUPABASE_URL` | *(your Supabase URL)* |
   | `SUPABASE_SERVICE_KEY` | *(your service role key)* |

## How It Works

### Standalone Mode

The `output: 'standalone'` config in `next.config.ts` tells Next.js to produce a minimal, self-contained server at `.next/standalone/server.js`. This server:

- Handles **all SSR pages** (home, department pages, tendencias, etc.)
- Serves **all 13 API routes** (listings, tags, valuador, department-stats, etc.)
- Processes **`next/image`** optimization via `sharp`
- Manages **fetch-level caching** via `next: { revalidate: N }` in API routes
- Runs as a **persistent process** (NOT serverless, NOT cold-start)

### Build Process

```
npm ci                    → clean install dependencies
npm run build             → next build (produces .next/standalone/)
cp -r public ...          → copy static assets into standalone
cp -r .next/static ...    → copy client JS/CSS into standalone
```

### Environment Variables

- `PORT` & `HOSTNAME` are read by `server.js` to bind the HTTP listener
- `SUPABASE_URL` & `SUPABASE_SERVICE_KEY` are used by all 13 API routes
- These are **not** embedded at build time — they're read at runtime

## Caching Strategy

The app uses Next.js fetch-level caching (works identically on Node.js server):

| Endpoint | Cache Duration |
|----------|---------------|
| `/api/tags` | 5 min |
| `/api/listings` | 5 min |
| `/api/department-stats` | 5 min |
| `/api/department/[slug]` | 1-5 min |
| `/api/tag/[tag]` | 1 min |
| `/api/listing/[id]` | 1 min |
| `/api/nearby-listings` | 1 min |
| `/api/geocode` | 1 hour |
| `/api/reverse-geocode` | 24 hours |
| `/api/colonias` | 1 hour |
| `/api/valuador` | 5 min |

## Troubleshooting

### Health check failing
- Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set in Render Dashboard
- The health check hits `/api/tags` which requires Supabase connectivity

### Images not loading
- Verify `sharp` is installed (it's in `dependencies`, not `devDependencies`)
- Render installs native modules during build automatically

### OG/Twitter images not generating
- These routes use `runtime = 'edge'` which Next.js emulates in standalone mode
- This is a Next.js built-in feature, not Vercel-specific

### Slow first request after deploy
- Normal for a Node.js server: the first SSR page compilation takes a moment
- Subsequent requests are fast due to caching
