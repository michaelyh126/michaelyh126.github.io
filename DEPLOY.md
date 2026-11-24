# Portfolio & Live 6-Demo Showcase Hub — Deployment Guide

This repository (`Vite + React 19 + TypeScript + Tailwind CSS + OpenLayers 10`) powers **`https://michaelyh126.github.io/`**, including **6 full-viewport, 100% synthetic-data interactive demos** accessible via zero-404 hash routes:

| # | Showcase App | Direct Hash Route |
| --- | --- | --- |
| 1 | **Interactive WebGIS Studio** (OpenLayers 10, Swipe Compare, Distance/Area Measure) | `/#/demos/webgis` |
| 2 | **Atelier Nova Salon SaaS** (4-Terminal Live Flow, Double-Entry Ledger, RBAC 403) | `/#/demos/salon` |
| 3 | **Multi-Source Hydrology Platform** (18 Mock Feeds, Storm Surge Sim, CSV Export) | `/#/demos/hydrology` |
| 4 | **Open Research DataHub** (Catalog Search, Live Approval Queue, Path-Guard FS) | `/#/demos/data-portal` |
| 5 | **`ai-file-lock` & `qa-cli` DevTools** (4-Agent Write Storm + Playwright Report) | `/#/demos/devtools` |
| 6 | **Bio-Acoustic Annotator & `SBUPNet` Lab** (Canvas BBox Drawing + IEEE SMC 2026) | `/#/demos/ai-lab` |

---

## 1. Customize Links in 10 Seconds

Edit [`src/data/profile.ts`](./src/data/profile.ts) to update your international email, Upwork, Fiverr, Wellfound, or LinkedIn URLs:

```ts
export const PROFILE: ProfileConfig = {
  email: 'your-international-email@gmail.com',
  platforms: [
    { id: 'upwork', url: 'https://www.upwork.com/freelancers/~YOUR_ID', ... },
    { id: 'fiverr', url: 'https://www.fiverr.com/YOUR_HANDLE', ... },
    { id: 'wellfound', url: 'https://wellfound.com/u/YOUR_HANDLE', ... },
    { id: 'linkedin', url: 'https://www.linkedin.com/in/YOUR_HANDLE', ... },
  ],
};
```

> Any platform left as `url: ''` gracefully falls back to a pre-filled direct-contract `mailto:` inquiry — zero broken `#` links.

---

## 2. Local Verification Commands

```powershell
cd "d:\经济数据支持中心\portfolio"
npm install
npm run dev        # Dev server (http://localhost:5173)
npx tsc --noEmit   # Strict TypeScript check
npm run build      # Generates production static bundle in dist/
npm run preview    # Preview compiled dist/ bundle locally
```

---

## 3. Deploy to GitHub Pages (`https://michaelyh126.github.io/`)

`.github/workflows/deploy.yml` and `vite.config.ts` (`base: '/'`) are already pre-configured!

1. Create public repository **`michaelyh126/michaelyh126.github.io`**.
2. Push this `portfolio/` folder to the `main` branch.
3. In GitHub **Settings → Pages → Build and deployment**, select **Source: GitHub Actions**.
4. Wait ~60 seconds for the workflow to deploy to **`https://michaelyh126.github.io/`**.

---

## 4. Alternative Free Hosts (Cloudflare Pages / Vercel)

- **Cloudflare Pages:** Connect repo → Framework `Vite`, Build command `npm run build`, Output directory `dist` (or CLI: `npx wrangler pages deploy dist --project-name hao-yang-portfolio`).
- **Vercel:** Import repo → auto-detects Vite → click **Deploy**.
