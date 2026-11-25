# Portfolio & 12 Original Production Apps Hub — Deployment Guide

This repository (`Vite + React 19 + TypeScript + Tailwind CSS + OpenLayers 10`) powers **`https://michaelyh126.github.io/`**, serving the bilingual (`EN` default / `中文` synced via `localStorage('portfolio_lang')`) portfolio alongside **12 compiled original production frontends** under `public/apps/` (copied verbatim into `dist/apps/` with zero `.map` sourcemaps) plus 2 interactive CLI/Research labs.

## Deployed Routes (`https://michaelyh126.github.io/`)

### Pre-AI Hand-Crafted Era (`2021 – 2025`, 3 Original Apps + IEEE SMC ’26 Lab)
| # | Application | Live Path |
| --- | --- | --- |
| 1 | **3D Marine Bathymetry & Terrain Workbench** (`Vue 3 + Mars3D / CesiumJS 1.123`) | `/apps/marine-terrain-3d/` |
| 2 | **Tropical Cyclone Intelligence Platform** (`Vue 2 + DataV + 950-Particle Canvas`) | `/apps/typhoon-center/` |
| 3 | **SmartRFID · IoT Asset & Archive Monitor** (`Vue 2 + WebSocket + Spring`) | `/apps/rfid-iot-monitor/` |
| — | **`SBUPNet` IEEE SMC 2026 Benchmark Lab** (`PyTorch` 76.5% mIoU @ 9.49 FPS) | `/#/demos/ai-lab` |

### AI-Assisted Era (`2026`, 9 Original Apps + DevTools Simulator)
| # | Application | Live Path |
| --- | --- | --- |
| 4 | **WebGIS One-Map Workbench** (`React + OL 10 + AntD + Turf`) | `/apps/webgis-workbench/` |
| 5 | **Coastal Blue Carbon Platform** (`Vue 3 + Pinia + MapLibre GL`) | `/apps/blue-carbon/` |
| 6 | **Multi-Source Hydrology Platform** (3-View Big Screen + Station + Query) | `/apps/hydrology-dashboard/` |
| 7 | **OceanData Open Data Portal** (`React + Three.js Globe + OL + i18next`) | `/apps/open-data-portal/` |
| 8 | **DataHub Admin Console** (`React + AntD + ApexCharts + RBAC File Tree`) | `/apps/data-share-admin/` |
| 9 | **Sound-AI Bio-Acoustic Platform** (`React 19 + Canvas + 3 Synthesized WAVs`) | `/apps/sound-ai/` |
| 10 | **Salon SaaS · Desktop Admin & Mobile POS** (`React 19 + Tailwind v4`) | `/apps/salon-admin/` & `/apps/salon-admin/#/mobile` |
| 11 | **Salon SaaS · Customer Mini-App H5** (`UniApp H5`, synced via `localStorage`) | `/apps/salon-customer/` |
| 12 | **Salon SaaS · Barber Workbench H5** (`UniApp H5`, synced via `localStorage`) | `/apps/salon-barber/` |
| — | **`ai-file-lock` & `qa-cli` DevTools Simulator** (`FUSE/WinFsp` + `Playwright`) | `/#/demos/devtools` |

---

## Local Build & Verification

```powershell
cd "d:\经济数据支持中心\portfolio"
npm install
npx tsc --noEmit   # Strict TypeScript check
npm run build      # Compiles portfolio + copies public/apps/* -> dist/apps/*
npm run preview    # Preview full production bundle locally
```
