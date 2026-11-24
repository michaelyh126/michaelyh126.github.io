import type { DemoId } from '../demos/registry';

export type ProjectCategory = 'WebGIS & Data' | 'Full-Stack SaaS' | 'AI & Systems';

export interface ProjectCaseStudy {
  id: string;
  demoId: DemoId;
  demoRoute: string;
  demoLabel: string;
  repoStatus: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  period: string;
  badge: string;
  summary: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  architecture: string[];
  challengesSolved: string[];
}

export const PROJECT_CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'WebGIS & Data',
  'Full-Stack SaaS',
  'AI & Systems',
];

export const PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'webgis-studio',
    demoId: 'webgis',
    demoRoute: '#/demos/webgis',
    demoLabel: 'Launch WebGIS Studio',
    repoStatus: 'Private Platform · Interactive Sandbox Live',
    title: 'Interactive WebGIS Studio & Coastal Raster Platform',
    subtitle: 'OpenLayers 10 · 2018 vs. 2026 Swipe Compare · Spatial Analytics',
    category: 'WebGIS & Data',
    period: '2025 – 2026',
    badge: 'Flagship WebGIS',
    summary:
      'Production geospatial web workspace for coastal blue-carbon monitoring and spatial comparison—featuring 8-year Web Mercator GeoTIFF timelines (Z6–Z11), canvas swipe comparison, geodesic distance/area tools, and clickable attribute tables.',
    metrics: [
      { label: 'Raster Epochs', value: '8 Years' },
      { label: 'Zoom Pyramid', value: 'Z6 – Z11' },
      { label: 'CRS Drift', value: '0 px' },
    ],
    stack: ['OpenLayers 10', 'React / Vue 3', 'TypeScript', 'Turf.js', 'GeoTIFF / GDAL', 'FastAPI', 'Nginx'],
    architecture: [
      'Modular OpenLayers 10 viewport decoupling tile basemaps, multi-epoch raster overlays, vector telemetry stations, and interactive measurement/query draw layers.',
      'Automated GeoTIFF reprojection & pyramid tiling pipeline normalizing raw satellite rasters into Web Mercator (EPSG:3857) XYZ tiles served via same-origin Nginx caching.',
      'FastAPI spatial REST layer delivering GeoJSON station catalogs, temporal filter indices, and cross-layer metadata queries.',
    ],
    challengesSolved: [
      'Diagnosed persistent alignment drift in legacy coastal saltmarsh tiles caused by mismatched datum/projection metadata; rebuilt all 8 annual GeoTIFF pyramids cleanly in EPSG:3857 and extended usable zoom from Z8 to Z6–Z11.',
      'Implemented smooth canvas swipe-compare and timeline scrubbing without tile flicker via OpenLayers prerender/postrender clipping.',
      'Built interactive coordinate HUD, geodesic area/distance tools, and fly-to attribute tables for in-browser spatial inspection.',
    ],
  },
  {
    id: 'salon-system',
    demoId: 'salon',
    demoRoute: '#/demos/salon',
    demoLabel: 'Launch 4-App Salon SaaS',
    repoStatus: 'Private Commercial Repo · 4-Terminal Sandbox',
    title: 'Multi-Terminal Salon & Retail SaaS (Atelier Nova)',
    subtitle: '4-Terminal Suite · Zero-Fee Direct-QR · Double-Entry Ledger · RBAC 403',
    category: 'Full-Stack SaaS',
    period: '2026',
    badge: 'Commercial SaaS',
    summary:
      'End-to-end 4-terminal SaaS platform built for brick-and-mortar salons & retail chains: Customer H5 Booking, Stylist Workbench, Mobile Cashier POS, and Desktop Admin EOD Reconciliation with zero-fee QR checkout & anti-fraud audit rails.',
    metrics: [
      { label: 'Client Terminals', value: '4 Apps' },
      { label: 'E2E Test Suites', value: '20 Flows' },
      { label: 'Payment Fee', value: '0% Direct' },
    ],
    stack: ['React 19', 'TypeScript', 'Express', 'MySQL', 'Tailwind CSS', 'UniApp / H5', 'Caddy HTTPS'],
    architecture: [
      'Monorepo architecture spanning business REST API (TypeScript + Express + MySQL), Desktop Admin & Mobile POS (React 19), Customer H5 Web App, and Stylist Mobile Workbench.',
      'Double-entry prepaid wallet & session-card ledger tracking principal vs. promotional bonus balances, stylist commission splits, inventory movements, and full DB snapshots.',
      'Strict RBAC permission matrix separating OWNER, CASHIER, STYLIST, and CUSTOMER scopes with explicit HTTP 403 audit logging on privileged approval endpoints.',
    ],
    challengesSolved: [
      'Eliminated 0.6% payment gateway fees and merchant onboarding delays by designing a zero-fee direct-QR flow with mandatory audio-confirmation checklists and cashier-bound audit trails.',
      'Closed self-service top-up fraud loopholes: customer QR submissions stay in PENDING_REVIEW until explicitly verified by the OWNER; cashier privilege-escalation attempts are hard-blocked (HTTP 403) and logged.',
      'Shipped automated regression verification suites covering 14 core commerce journeys and 6 direct-QR anti-fraud checks plus printable QR signage.',
    ],
  },
  {
    id: 'hydrological-platform',
    demoId: 'hydrology',
    demoRoute: '#/demos/hydrology',
    demoLabel: 'Launch Hydrology Dashboard',
    repoStatus: 'Private Platform · Live Telemetry Sandbox',
    title: 'Multi-Source Hydrological & Time-Series Telemetry Platform',
    subtitle: '18 Data Sources · ~25,000 Monitoring Stations · TimescaleDB Hypertables',
    category: 'WebGIS & Data',
    period: '2025 – 2026',
    badge: 'Telemetry Platform',
    summary:
      'High-density coastal, estuarine, and meteorological telemetry platform unifying NOAA, ISD, METAR, and regional hydrological networks into a single PostgreSQL/TimescaleDB time-series backbone with storm-surge threshold alerts and CSV export.',
    metrics: [
      { label: 'Data Sources', value: '18 Feeds' },
      { label: 'Active Stations', value: '~25,000' },
      { label: 'Runtime Stack', value: 'TimescaleDB' },
    ],
    stack: ['FastAPI', 'PostgreSQL', 'TimescaleDB', 'Vue 3', 'ECharts', 'Linux', 'Nginx', 'systemd'],
    architecture: [
      'Scheduled systemd ingestion workers normalizing heterogeneous NOAA, ISD, METAR, and coastal sensor payloads into unified TimescaleDB hypertables.',
      'FastAPI analytical endpoints supporting multi-station bounding-box queries, indicator aggregation, rolling trend calculations, and estuarine health summaries.',
      'Interactive monitoring dashboard deployed behind same-origin Nginx reverse proxy with automated ingestion freshness & health-check diagnostics.',
    ],
    challengesSolved: [
      'Harmonized 18 inconsistent upstream schemas, time zones, missing-value sentinels, and unit systems into a clean canonical station & observation model covering ~25,000 stations.',
      'Diagnosed silent ingestion gaps by pairing systemd service logs with cross-checked API vs. database row reconciliation and automated freshness alerts.',
      'Optimized multi-month chart queries with TimescaleDB chunk partitioning and composite station-time indexes for sub-second dashboard rendering.',
    ],
  },
  {
    id: 'enterprise-datahub',
    demoId: 'data-portal',
    demoRoute: '#/demos/data-portal',
    demoLabel: 'Launch Open DataHub',
    repoStatus: 'Private Portal · Dual-Mode Sandbox Live',
    title: 'Enterprise Open Research Data Portal & DataHub',
    subtitle: 'React 19 · Spring Boot 3.3 / Java 21 · RBAC Workflow & Hardened File Manager',
    category: 'Full-Stack SaaS',
    period: '2025 – 2026',
    badge: 'Enterprise Portal',
    summary:
      'Institutional open-data catalog and content operations platform combining a React 19 frontend, Spring Boot 3.3 (Java 21) API, Redis caching, multi-stage RBAC dataset approval workflows, and a path-traversal hardened file manager.',
    metrics: [
      { label: 'Articles Audited', value: '4,207' },
      { label: 'Batch Migrated', value: '724 Verified' },
      { label: 'Backend Runtime', value: 'Java 21' },
    ],
    stack: ['React 19', 'TypeScript', 'Spring Boot 3.3', 'Java 21', 'PostgreSQL', 'Redis', 'Nginx'],
    architecture: [
      'Layered Spring Boot 3.3 + PostgreSQL backend with Redis cache-aside acceleration for high-traffic catalog search, faceted filtering, and dataset metadata trees.',
      'Role-based submission, editorial review, and publication approval workflow with immutable audit history and granular download permissions.',
      'Hardened server-side file manager handling structured dataset attachments with canonical path sanitization, MIME checks, soft-delete recycle bin, and resumable batch operations.',
    ],
    challengesSolved: [
      'Engineered an AI-assisted CMS audit and migration pipeline that indexed 4,207 legacy articles and cleanly reformatted & republished 724 multi-page entries with checkpoint resume and post-publish read-back verification.',
      'Hardened file browsing and upload endpoints against path traversal (../), oversized payloads, and broken character encodings across mixed OS archives.',
      'Unified reverse-proxy routing and session security under Nginx so frontend SPA routes, REST endpoints, and static media operate cleanly under a single origin.',
    ],
  },
  {
    id: 'ai-file-lock',
    demoId: 'devtools',
    demoRoute: '#/demos/devtools',
    demoLabel: 'Launch FileLock & QA Sandbox',
    repoStatus: 'Private Systems Repo · Live Concurrency Simulator',
    title: 'ai-file-lock Concurrency Guard & qa-cli Visual QA Engine',
    subtitle: 'FUSE / WinFsp 128-Proc Verified · Playwright Core + FFmpeg MP4 Audits',
    category: 'AI & Systems',
    period: '2026',
    badge: 'Systems & DevTools',
    summary:
      'Two flagship developer-reliability tools: (1) ai-file-lock, a native libfuse3/WinFsp mount guarding editors & AI agents against concurrent file races (128-process verified v1.0.3); (2) qa-cli, an automated Playwright + FFmpeg E2E video audit harness.',
    metrics: [
      { label: 'Concurrency Test', value: '128 Procs' },
      { label: 'Release Baseline', value: 'v1.0.3' },
      { label: 'QA Verification', value: 'Playwright MP4' },
    ],
    stack: ['Python 3.11+', 'Node.js 22+', 'libfuse3', 'WinFsp', 'SQLite', 'Playwright Core', 'FFmpeg'],
    architecture: [
      'Background daemon managing native FUSE / WinFsp mounts over a managed project vault with persistent restoration.json crash-recovery logs and SQLite handle tracking.',
      'Shared-read / exclusive-write handle locking enforced prior to truncation, atomic rename, or delete—emitting actionable conflict diagnostics to caller stderr.',
      'Headless Playwright Core + FFmpeg qa-cli pipeline capturing DOM assertions, console/network zero-error checks, and synchronized MP4 walkthrough videos.',
    ],
    challengesSolved: [
      'Passed real mount acceptance testing and 128-process concurrent stress verification on Linux alongside native Windows x64 / WinFsp 2.2 conflict, rename-replace, and restart recovery checks.',
      'Explored optimistic commits, static dependency graphs, and Tree-sitter AST function-level merging while strictly documenting verified v1.0.3 boundaries.',
      'Eliminated "works on my machine" handoffs for remote clients by shipping reproducible E2E visual proof videos alongside every milestone delivery.',
    ],
  },
  {
    id: 'ai-acoustic-sbupnet',
    demoId: 'ai-lab',
    demoRoute: '#/demos/ai-lab',
    demoLabel: 'Launch AI & Acoustic Lab',
    repoStatus: 'IEEE SMC 2026 Research · Interactive Lab Live',
    title: 'Acoustic Spectrogram Workbench & SBUPNet (IEEE SMC 2026)',
    subtitle: 'HTML5 Canvas Signal Annotator · Real-Time UHR Semantic Segmentation',
    category: 'AI & Systems',
    period: '2024 – 2026',
    badge: 'IEEE SMC 2026 · First Author',
    summary:
      'Peer-reviewed geospatial computer vision research paired with browser-native ML tooling: SBUPNet delivers real-time UHR aerial segmentation (76.5% mIoU @ 9.49 FPS), alongside an interactive canvas spectrogram bounding-box annotation studio.',
    metrics: [
      { label: 'Inria Aerial', value: '76.5% mIoU' },
      { label: 'Inference Speed', value: '9.49 FPS' },
      { label: 'VRAM & Time', value: '-35% vs ISDNet' },
    ],
    stack: ['PyTorch', 'MMSegmentation', 'Python', 'HTML5 Canvas', 'TypeScript', 'COCO JSON'],
    architecture: [
      'SBUPNet (IEEE SMC 2026, First Author): Uncertainty-guided pixel selection architecture balancing global context and selective top-K high-resolution refinement for UHR aerial imagery.',
      'Cross-benchmark optimization study across Inria Aerial, DeepGlobe, CRAG, and MonuSeg analyzing Full, Patch, Cross-source Mosaic, and downsampling regimes via gradient variance and mean-update utility.',
      'Browser-native HTML5 Canvas spectrogram annotator supporting interactive click-and-drag time-frequency bounding boxes, contrast/gain controls, and COCO/JSON export.',
    ],
    challengesSolved: [
      'Achieved ~20% higher throughput and ~35% lower training time & peak VRAM than ISDNet on Inria Aerial while reaching 76.5% mIoU at 9.49 FPS.',
      'Engineered zero-latency 60fps canvas rendering and coordinate projection between pixel space and time-frequency (seconds / Hz) physical units.',
      'Built disciplined AI-assisted engineering verification loops combining quantitative benchmarks and reproducible visual inspection.',
    ],
  },
];
