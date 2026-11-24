import type { DemoId } from '../demos/registry';

export type ProjectCategory = 'WebGIS & Data' | 'Full-Stack SaaS' | 'AI & Systems';

export interface ProjectLaunchLink {
  label: string;
  href: string;
  sandboxId?: DemoId;
}

export interface ProjectCaseStudy {
  id: string;
  primaryLink: ProjectLaunchLink;
  extraLinks?: ProjectLaunchLink[];
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
    id: 'webgis-workbench',
    primaryLink: {
      label: 'Launch Original WebGIS App',
      href: '/apps/webgis-workbench/',
    },
    extraLinks: [
      { label: 'Swipe Compare Lab', href: '#/demos/webgis', sandboxId: 'webgis' },
    ],
    repoStatus: 'Original Frontend Deployed · 100% Synthetic Data',
    title: 'WebGIS One-Map Spatial Workbench',
    subtitle: 'React · OpenLayers 10 · Ant Design · Turf.js · 11 Synthetic Coastal Layers',
    category: 'WebGIS & Data',
    period: '2025 – 2026',
    badge: 'Original Production App',
    summary:
      'Full production geospatial one-map studio built with React, OpenLayers 10, Ant Design, and Turf.js—featuring 11 synthetic coastal datasets, Esri/OSM basemap switching, interactive layer controls, spatial buffer/measure tools, and attribute inspection.',
    metrics: [
      { label: 'Spatial Layers', value: '11 Datasets' },
      { label: 'Map Engine', value: 'OL 10 + Turf' },
      { label: 'Basemaps', value: 'Esri / OSM' },
    ],
    stack: ['React', 'TypeScript', 'OpenLayers 10', 'Ant Design', 'Turf.js', 'EPSG:3857', 'FastAPI'],
    architecture: [
      'Modular OpenLayers 10 one-map workbench decoupling basemap tiles, multi-layer vector/raster catalog, Turf.js spatial analysis tools, and inspector drawers.',
      'Unified GeoJSON & Web Mercator tiling pipeline supporting instant layer toggling, opacity blending, and spatial filtering across 11 synthetic coastal datasets.',
      'Cleanly decoupled client data adapters allowing the real production frontend to run identically against live REST APIs or 100% static synthetic demo fixtures.',
    ],
    challengesSolved: [
      'Eliminated CRS alignment drift across heterogeneous vector & raster layers by normalizing coordinates cleanly into EPSG:3857 / WGS84 pipelines.',
      'Integrated Turf.js client-side geometry operations (buffers, intersections, geodesic measurement) without round-trip server latency.',
      'Shipped zero-watermark Esri & OSM basemap switching with responsive multi-panel workspace layout.',
    ],
  },
  {
    id: 'blue-carbon',
    primaryLink: {
      label: 'Launch Original Blue Carbon App',
      href: '/apps/blue-carbon/',
    },
    repoStatus: 'Original Vue 3 + MapLibre Frontend · Synthetic Data',
    title: 'Coastal Blue Carbon Data Platform',
    subtitle: 'Vue 3 · Pinia · MapLibre GL · 1985–2019 Coastal Saltmarsh Timeline',
    category: 'WebGIS & Data',
    period: '2025 – 2026',
    badge: 'Original Production App',
    summary:
      'Interactive coastal blue-carbon & saltmarsh carbon-sink visualization platform powered by Vue 3, Pinia, and MapLibre GL—featuring a 1985–2019 multi-decade coastal timeline, GPU-accelerated vector/raster layers, and regional carbon stock analytics.',
    metrics: [
      { label: 'Temporal Span', value: '1985 – 2019' },
      { label: 'Map Renderer', value: 'MapLibre GL' },
      { label: 'GeoTIFF Zoom', value: 'Z6 – Z11' },
    ],
    stack: ['Vue 3', 'Pinia', 'MapLibre GL', 'TypeScript', 'GeoTIFF / GDAL', 'FastAPI', 'Nginx'],
    architecture: [
      'Vue 3 + Pinia reactive state architecture synchronizing MapLibre GL WebGL map layers with timeline controls and ecological KPI charts.',
      'Automated GeoTIFF reprojection & Web Mercator pyramid pipeline resolving legacy projection drift and extending saltmarsh raster coverage across Z6–Z11.',
      'Same-origin Nginx reverse proxy serving cached map tiles alongside FastAPI spatial statistics endpoints.',
    ],
    challengesSolved: [
      'Diagnosed persistent pixel offset in legacy coastal saltmarsh tiles caused by mismatched datum metadata; rebuilt 8 yearly GeoTIFF pyramids cleanly in Web Mercator.',
      'Engineered smooth multi-decade timeline scrubbing (1985–2019) using GPU-accelerated MapLibre GL styling transitions.',
      'Sanitized the full production frontend onto 100% synthetic demonstration data for instant browser evaluation.',
    ],
  },
  {
    id: 'hydrology-dashboard',
    primaryLink: {
      label: 'Launch Original Hydrology App',
      href: '/apps/hydrology-dashboard/',
    },
    extraLinks: [
      { label: 'Surge Sim Sandbox', href: '#/demos/hydrology', sandboxId: 'hydrology' },
    ],
    repoStatus: 'Original 3-View Platform · 100% Synthetic Telemetry',
    title: 'Multi-Source Hydrological & Time-Series Platform',
    subtitle: '3-View Suite: Public Big Screen · Own Station Network · Spatial Query Web',
    category: 'WebGIS & Data',
    period: '2025 – 2026',
    badge: 'Original 3-View App',
    summary:
      'High-density coastal & hydrological telemetry platform unifying 18 upstream data feeds (~25,000 stations on PostgreSQL/TimescaleDB), deployed live with its original 3-view switcher: Public Wallboard, Station Network Dashboard, and Spatial/Time-Series Query Web.',
    metrics: [
      { label: 'Data Sources', value: '18 Feeds' },
      { label: 'Active Stations', value: '~25,000' },
      { label: 'Live Views', value: '3 Modules' },
    ],
    stack: ['FastAPI', 'PostgreSQL', 'TimescaleDB', 'Vue 3', 'ECharts', 'Linux', 'Nginx', 'systemd'],
    architecture: [
      'Three cohesive monitoring modules accessible from a single top switcher: Public Monitoring Big-Screen, Own Station Network Dashboard, and Spatial/Time-Series Query Portal.',
      'Scheduled systemd ingestion pipelines normalizing NOAA, ISD, METAR, and regional coastal feeds into partitioned TimescaleDB hypertables.',
      'FastAPI analytical endpoints serving multi-station bounding-box filters, indicator rollups, and estuarine health diagnostics.',
    ],
    challengesSolved: [
      'Harmonized 18 inconsistent upstream formats, time zones, and sensor units into a canonical schema across ~25,000 stations.',
      'Optimized multi-month trend charts using TimescaleDB chunk partitioning and composite station-time indexes for sub-second response.',
      'Paired systemd ingestion logs with API-to-DB row reconciliation checks to catch silent upstream feed stalls immediately.',
    ],
  },
  {
    id: 'salon-system',
    primaryLink: {
      label: 'Launch PC Admin Console',
      href: '/apps/salon-admin/',
    },
    extraLinks: [
      { label: 'Mobile POS', href: '/apps/salon-admin/#/mobile' },
      { label: 'Customer H5', href: '/apps/salon-customer/' },
      { label: 'Barber H5', href: '/apps/salon-barber/' },
    ],
    repoStatus: 'All 4 Original Terminals Live · Cross-Tab Sync',
    title: 'Multi-Terminal Salon & Retail SaaS (4-App Suite)',
    subtitle: 'PC Admin · Mobile Cashier POS · Customer UniApp H5 · Barber Workbench H5',
    category: 'Full-Stack SaaS',
    period: '2026',
    badge: '4 Original Live Apps',
    summary:
      'Complete 4-terminal commercial SaaS suite deployed with all original frontends synced live via localStorage: Desktop Admin, Mobile Cashier POS, Customer Mini-App H5, and Barber Workbench H5—featuring zero-fee Direct-QR, double-entry ledger, and Owner/Cashier RBAC.',
    metrics: [
      { label: 'Live Terminals', value: '4 Real Apps' },
      { label: 'E2E Test Suites', value: '20 Flows' },
      { label: 'Payment Fee', value: '0% Direct' },
    ],
    stack: ['React 19', 'TypeScript', 'Tailwind v4', 'UniApp H5', 'Express', 'MySQL', 'Caddy HTTPS'],
    architecture: [
      'Four compiled production frontends sharing unified business contracts: PC Admin (/apps/salon-admin/), Mobile POS (/apps/salon-admin/#/mobile), Customer H5 (/apps/salon-customer/), and Barber H5 (/apps/salon-barber/).',
      'Double-entry prepaid wallet & session-card ledger separating principal vs. promotional bonus balances alongside stylist commission splits and full EOD reconciliation.',
      'Strict RBAC permission enforcement separating OWNER, CASHIER, STYLIST, and CUSTOMER scopes with explicit HTTP 403 audit logging.',
    ],
    challengesSolved: [
      'Eliminated 0.6% payment gateway fees via zero-fee Direct-QR checkout with mandatory audio-confirmation checklists and cashier-bound audit logs.',
      'Blocked self-service top-up fraud: customer QR requests stay in PENDING_REVIEW until explicitly verified by the OWNER; cashier attempts trigger HTTP 403 security alerts.',
      'Wired live localStorage cross-terminal demo sync so bookings made in Customer H5 appear immediately in Barber H5, POS, and PC Admin.',
    ],
  },
  {
    id: 'open-datahub',
    primaryLink: {
      label: 'Launch OceanData Portal',
      href: '/apps/open-data-portal/',
    },
    extraLinks: [
      { label: 'DataHub Admin Console', href: '/apps/data-share-admin/' },
    ],
    repoStatus: '2 Original Production Frontends Deployed Live',
    title: 'OceanData Open Portal & DataHub Admin Suite',
    subtitle: 'Three.js 3D Globe + OpenLayers Portal · AntD + ApexCharts RBAC Admin Console',
    category: 'Full-Stack SaaS',
    period: '2025 – 2026',
    badge: '2 Original Live Apps',
    summary:
      'Dual-frontend institutional open-data ecosystem: (1) OceanData Hub Public Portal featuring an interactive Three.js 3D globe, OpenLayers catalog, and i18next localization; (2) DataHub Admin Console featuring Ant Design, ApexCharts analytics, RBAC approval queues, and hardened file tree.',
    metrics: [
      { label: 'Live Frontends', value: '2 Real Apps' },
      { label: 'Articles Audited', value: '4,207' },
      { label: 'Backend Runtime', value: 'Spring / Java 21' },
    ],
    stack: ['React 19', 'Three.js', 'OpenLayers', 'Ant Design', 'ApexCharts', 'i18next', 'Spring Boot 3', 'Redis'],
    architecture: [
      'Public OceanData Portal (/apps/open-data-portal/): React + Three.js interactive 3D Earth + OpenLayers spatial search + i18next bilingual support over 12 synthetic datasets.',
      'DataHub Admin Console (/apps/data-share-admin/): React + Ant Design + ApexCharts operational telemetry, dataset review/approval queues, and RBAC virtual file manager.',
      'Backed in production by Spring Boot 3.3 (Java 21), PostgreSQL, Redis caching, and canonical path-traversal hardened file APIs.',
    ],
    challengesSolved: [
      'Automated CMS auditing & format migration across 4,207 legacy articles (724 multi-page entries republished with checkpoint resume and read-back validation).',
      'Hardened server-side file operations against path traversal (../), MIME spoofing, and broken character encodings across mixed OS uploads.',
      'Unified both public discovery and internal steward operations cleanly under same-origin Nginx routing.',
    ],
  },
  {
    id: 'sound-ai-sbupnet',
    primaryLink: {
      label: 'Launch Original Sound-AI App',
      href: '/apps/sound-ai/',
    },
    extraLinks: [
      { label: 'SBUPNet IEEE SMC ’26 Lab', href: '#/demos/ai-lab', sandboxId: 'ai-lab' },
    ],
    repoStatus: 'Original React 19 App + IEEE SMC 2026 Benchmark Lab',
    title: 'Sound-AI Bio-Acoustic Studio & SBUPNet (IEEE SMC ’26)',
    subtitle: 'React 19 Custom Canvas Spectrogram + Synthesized WAV · Real-Time UHR Segmentation',
    category: 'AI & Systems',
    period: '2024 – 2026',
    badge: 'Original App + IEEE ’26',
    summary:
      'Original React 19 bio-acoustic annotation workbench powered by a custom high-FPS Canvas spectrogram engine and 3 synthesized demo WAV / LOD1 datasets—paired with my IEEE SMC 2026 First-Author SBUPNet remote-sensing segmentation research (76.5% mIoU @ 9.49 FPS).',
    metrics: [
      { label: 'Inria Aerial', value: '76.5% mIoU' },
      { label: 'Inference Speed', value: '9.49 FPS' },
      { label: 'VRAM & Time', value: '-35% vs ISDNet' },
    ],
    stack: ['React 19', 'HTML5 Canvas', 'Web Audio / WAV', 'PyTorch', 'MMSegmentation', 'Python'],
    architecture: [
      'Sound-AI Production Frontend (/apps/sound-ai/): React 19 custom Canvas LOD1 spectrogram renderer with interactive bounding-box annotation, zoom/pan, and 3 synthesized WAV demo audio tracks.',
      'SBUPNet (IEEE SMC 2026, First Author · #/demos/ai-lab): Uncertainty-guided pixel selection architecture pairing lightweight global context with selective top-K high-resolution refinement.',
      'Cross-benchmark optimization study across Inria Aerial, DeepGlobe, CRAG, and MonuSeg quantifying gradient variance and mean-update utility.',
    ],
    challengesSolved: [
      'Achieved ~20% higher inference throughput and ~35% lower training time & peak VRAM than ISDNet on Inria Aerial at 76.5% mIoU (9.49 FPS).',
      'Built smooth 60fps browser canvas spectrogram rendering with synced Web Audio playback and precise time-frequency coordinate annotation.',
      'Replaced proprietary audio files with 100% procedurally synthesized WAV files and LOD1 spectrograms for public browser testing.',
    ],
  },
  {
    id: 'ai-file-lock-qa',
    primaryLink: {
      label: 'Launch FileLock & QA Sandbox',
      href: '#/demos/devtools',
      sandboxId: 'devtools',
    },
    repoStatus: 'Private Systems CLI · Interactive Browser Simulator',
    title: 'ai-file-lock Concurrency Guard & qa-cli Visual QA Engine',
    subtitle: 'libfuse3 / WinFsp 128-Proc Verified · Playwright Core + FFmpeg MP4 Video Audits',
    category: 'AI & Systems',
    period: '2026',
    badge: 'Systems & QA CLI',
    summary:
      'Two systems-level engineering tools built for reliable AI-assisted software delivery: ai-file-lock (native FUSE/WinFsp mount preventing multi-agent file races, 128-process verified v1.0.3) and qa-cli (headless Playwright Core + FFmpeg MP4 E2E proof pipeline).',
    metrics: [
      { label: 'Concurrency Test', value: '128 Procs' },
      { label: 'Release Baseline', value: 'v1.0.3' },
      { label: 'QA Verification', value: 'Playwright MP4' },
    ],
    stack: ['Python 3.11+', 'Node.js 22+', 'libfuse3', 'WinFsp', 'SQLite', 'Playwright Core', 'FFmpeg'],
    architecture: [
      'Background daemon managing native FUSE / WinFsp mounts over a managed project vault with persistent restoration.json crash-recovery logs and SQLite handle tracking.',
      'Shared-read / exclusive-write handle locking enforced prior to truncation, atomic rename, or delete—emitting conflict diagnostics directly to caller stderr.',
      'Headless Playwright Core + FFmpeg qa-cli runner capturing DOM assertions, console/network zero-error checks, and stitched MP4 walkthrough proof videos.',
    ],
    challengesSolved: [
      'Passed real mount acceptance testing and 128-process concurrent stress verification on Linux alongside native Windows x64 / WinFsp 2.2 conflict & crash-recovery checks.',
      'Explored optimistic commits, static dependency graphs, and Tree-sitter AST function-level merging while documenting verified v1.0.3 production boundaries.',
      'Eliminated "works on my machine" handoffs for overseas clients by automating reproducible visual E2E proof videos alongside every milestone.',
    ],
  },
];
