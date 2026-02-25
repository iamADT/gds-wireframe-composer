# Netlify — Reference for This Project

This project is a React/Vite SPA deployed to Netlify. Only what's relevant to that setup is documented here.

---

## Current `netlify.toml`

```toml
[build]
  base    = "app"
  command = "npm run build"
  publish = "app/dist"

  [build.environment]
    NODE_VERSION = "22"

[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200
```

The `[[redirects]]` rule is **required** for client-side routing. Without it, any direct URL hit (or page refresh) on a non-root path returns a 404 from Netlify's CDN.

---

## Plans and Credits (new accounts from Sept 4, 2025)

Netlify moved to a credit-based model. The old Free/Starter/Pro minute tiers no longer apply to new accounts.

| Plan | Credits/month | Price |
|------|--------------|-------|
| Free | 300 (hard cap — site suspended if exceeded) | $0 |
| Personal | 1,000 | $9/month |
| Pro | 3,000 per team | $20/member/month |

**What costs credits:**
- **Production deploy** — 15 credits each (failed deploys and rollbacks are free)
- **Bandwidth** — 10 credits per GB outbound
- **Function compute** — 5 credits per GB-hour
- **Form submissions** — 1 credit each

**Deploy previews and branch deploys are free** (0 credits).

On the Free plan (300 credits): ~20 production deploys/month before bandwidth and other usage eat into it. For this tool, the Free plan is fine for low-traffic development use; Personal ($9/month) is more comfortable if deploying frequently.

---

## Build Limits

- **Timeout per build:** ~30 minutes (hard limit, cannot self-configure — contact support to increase)
- **Concurrent builds:** 1 on Free/Personal, 3 on Pro
- **`CI=true` is set by default** — some build tools treat warnings as fatal errors under this flag. Fix with `CI=''` in the build environment if needed. Vite is unaffected; this matters more for CRA or ESLint-heavy pipelines

---

## TypeScript / Build Gotchas

- Netlify runs `tsc -b` (composite build mode) which is **stricter than `tsc --noEmit`**. Errors that pass locally may fail on Netlify — always run `npm run build` locally (not just `tsc --noEmit`) before pushing
- Known pattern: `useState([])` infers `never[]` under strict mode; always add explicit generics (e.g., `useState<Node[]>([])`)
- Unused imports are errors (`TS6133`) in strict mode — clean them up before pushing

---

## Node.js

- **Default:** Node 22 (updated from Node 18 in February 2025)
- **Minimum for Vite:** Node 18.14.0+
- **To pin a version:** Set `NODE_VERSION = "22"` in `netlify.toml` or in the Netlify UI, or add a `.node-version` file

---

## File and Deploy Limits

| Limit | Value |
|-------|-------|
| Individual file max (CDN) | 10 MB — files over this may fail to deploy or serve |
| Files per directory | 54,000 — exceeding this causes deploy failure |
| Build output directory | `app/dist` (this project) |

For a Vite SPA the bundled output is typically well under these limits.

---

## Environment Variables

- **Client-side (inlined at build):** Must be prefixed `VITE_` — e.g., `VITE_API_KEY`. These end up in the JS bundle, so never use them for secrets
- **Build-only secrets:** No prefix needed; never referenced in client code
- **Runtime (Netlify Functions):** Hard cap of **4 KB total** across all variable names+values combined (AWS Lambda constraint, cannot be increased)
- **Do not commit secrets** to `netlify.toml` — use the Netlify UI (Site settings → Environment variables) instead

---

## Bandwidth

- ~30 GB/month on the Free plan before credits run out (shared with deploys and other usage)
- Site is **suspended for the remainder of the calendar month** if the Free cap is hit — visitors see "Site not available"
- Large JS bundles increase bandwidth consumption on every page load. The current bundle is ~600 KB (187 KB gzipped), driven primarily by `@xyflow/react`

---

## CDN and Caching

- Static assets (JS, CSS, fonts) are cached at edge nodes for up to **1 year**; automatically invalidated on every new deploy
- Each deploy is **atomic** — old and new asset versions never mix
- The browser is instructed to revalidate on every request (`max-age=0, must-revalidate`); the CDN serves from cache

---

## What Netlify Does NOT Support (relevant to this project)

- **WebSockets** — Functions are request/response only; no persistent connections
- **Long-running server processes** — no always-on Node server; everything is triggered by HTTP
- **Server-side databases** — connect to an external provider (Supabase, Neon, etc.) if ever needed
- **In-memory state between Function invocations** — Functions are stateless; each call is fresh
- **File writes that persist** — `/tmp` in Lambda is ephemeral and not shared between calls
- **Private GitHub org repos on Free/Personal plans** — requires Pro, or deploy via CLI

---

## Domains and HTTPS

- Every site gets a free `[site-name].netlify.app` subdomain with HTTPS
- Custom domains supported on all plans; SSL via Let's Encrypt, auto-provisioned
- HTTP → HTTPS redirect is automatic

---

## Framework Support

This project uses **Vite + React**. Netlify has [first-class Vite support](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/) — no special plugin needed. Build output goes to `dist/` by default; this project uses `app/dist` (set in `netlify.toml`).

---

## Quick Troubleshooting Checklist

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Direct URL or refresh returns 404 | Missing redirect rule | Add `/* /index.html 200` to `netlify.toml` |
| Build passes locally, fails on Netlify | `tsc -b` stricter than `tsc --noEmit` | Run `npm run build` locally before pushing |
| `never[]` type errors | `useState([])` without generic | Add explicit generic: `useState<Node[]>([])` |
| Unused import errors (`TS6133`) | Import left in after refactor | Remove unused imports |
| Warnings treated as errors | `CI=true` in build env | Set `CI=''` if needed |
| Wrong Node version | Default may differ | Pin with `NODE_VERSION = "22"` in `netlify.toml` |
| Site suspended mid-month | Free plan credit cap hit | Upgrade to Personal ($9/month) or reduce deploys |
