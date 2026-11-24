# Portfolio & 9 Original Production Apps Showcase Hub — Deployment Guide

This repository (`Vite + React 19 + TypeScript + Tailwind CSS + OpenLayers 10`) powers **`https://michaelyh126.github.io/`**, serving the main portfolio alongside **9 compiled original production frontends** under `public/apps/` (copied verbatim into `dist/apps/` with zero `.map` sourcemaps) plus interactive CLI/Research sandboxes.

## Deployed Routes (`https://michaelyh126.github.io/`)

### 9 Original Production Frontends (100% Synthetic Demo Data)
| # | Application | Live Path |
| --- | --- | --- |
| 1 | **WebGIS One-Map Workbench** (`React + OL 10 + AntD + Turf`) | `/apps/webgis-workbench/` |
| 2 | **OceanData Open Data Portal** (`React + Three.js Globe + OL + i18next`) | `/apps/open-data-portal/` |
| 3 | **DataHub Admin Console** (`React + AntD + ApexCharts + RBAC File Tree`) | `/apps/data-share-admin/` |
| 4 | **Multi-Source Hydrology Platform** (3-View Big Screen + Station + Query) | `/apps/hydrology-dashboard/` |
| 5 | **Sound-AI Bio-Acoustic Platform** (`React 19 + Canvas + 3 Synthesized WAVs`) | `/apps/sound-ai/` |
| 6 | **Coastal Blue Carbon Platform** (`Vue 3 + Pinia + MapLibre GL`) | `/apps/blue-carbon/` |
| 7 | **Salon SaaS · Desktop Admin & Mobile POS** (`React 19 + Tailwind v4`) | `/apps/salon-admin/` & `/apps/salon-admin/#/mobile` |
| 8 | **Salon SaaS · Customer Mini-App H5** (`UniApp H5`, synced via `localStorage`) | `/apps/salon-customer/` |
| 9 | **Salon SaaS · Barber Workbench H5** (`UniApp H5`, synced via `localStorage`) | `/apps/salon-barber/` |

### Built-In CLI & Research Interactive Sandboxes
- **`/#/demos/devtools`** — `ai-file-lock` 4-Agent Concurrency Simulator & `qa-cli` Playwright/FFmpeg Report Viewer
- **`/#/demos/ai-lab`** — `SBUPNet` (IEEE SMC 2026) Interactive Pareto Benchmark Explorer & Spectrogram Lab
- **`/#/demos/webgis`** — English OpenLayers 10 Canvas Swipe Compare Lab (2018 vs. 2026)

---

## 1. Customize Contact & Freelance Links in 10 Seconds

Edit [`src/data/profile.ts`](./src/data/profile.ts) to update your email, Upwork, Fiverr, Wellfound, or LinkedIn URLs. Any platform left as `url: ''` gracefully falls back to a pre-filled direct-contract `mailto:` inquiry.

---

## 2. Local Build & Verification

```powershell
cd "d:\经济数据支持中心\portfolio"
npm install
npx tsc --noEmit   # Strict TypeScript check
npm run build      # Compiles portfolio + copies public/apps/* -> dist/apps/*
npm run preview    # Preview full production bundle locally
```

---

## 3. Deploy Free to GitHub Pages (`https://michaelyh126.github.io/`)

`.github/workflows/deploy.yml` and `vite.config.ts` (`base: '/'`, `sourcemap: false`) are pre-configured. Push `portfolio/` to `michaelyh126/michaelyh126.github.io` (`main` branch) and set **Settings → Pages → Source: GitHub Actions**.
