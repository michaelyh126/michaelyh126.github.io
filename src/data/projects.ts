import type { DemoId } from '../demos/registry';
import type { Lang } from '../i18n/LanguageContext';
import type { EngineeringEra } from './liveApps';

export type ProjectCategory = 'WebGIS & Data' | 'Full-Stack SaaS' | 'AI & Systems';

export interface ProjectLaunchLink {
  label: string;
  href: string;
  sandboxId?: DemoId;
}

export interface ProjectCaseStudy {
  id: string;
  era: EngineeringEra;
  eraLabel: string;
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

export const ERA_FILTERS: ('all' | EngineeringEra)[] = ['all', 'pre-ai', 'ai-era'];

export function getProjectCategoryLabel(cat: 'All' | ProjectCategory, lang: Lang): string {
  if (lang === 'en') return cat;
  switch (cat) {
    case 'All':
      return '全部领域';
    case 'WebGIS & Data':
      return 'WebGIS 与 3D/数据';
    case 'Full-Stack SaaS':
      return '全栈 SaaS 与物联网';
    case 'AI & Systems':
      return 'AI 视觉与系统工具';
  }
}

export function getEraFilterLabel(era: 'all' | EngineeringEra, lang: Lang): string {
  if (lang === 'en') {
    if (era === 'all') return 'All Eras';
    if (era === 'pre-ai') return 'Pre-AI Hand-Crafted · 2021–2025';
    return 'AI-Assisted Era · 2026';
  }
  if (era === 'all') return '全部年代';
  if (era === 'pre-ai') return '前 AI 时代 · 纯手搓 2021–2025';
  return 'AI 时代 · AI 协同 2026';
}

export const PROJECTS: ProjectCaseStudy[] = [
  // ============================================================================
  // PRE-AI HAND-CRAFTED ERA (2021 – 2025.09) · 4 Flagship Case Studies
  // ============================================================================
  {
    id: 'marine-terrain-3d',
    era: 'pre-ai',
    eraLabel: 'Pre-AI Hand-Crafted',
    primaryLink: {
      label: 'Launch Original 3D Terrain App',
      href: '/apps/marine-terrain-3d/',
    },
    repoStatus: 'Pre-AI Hand-Crafted (132 Commits) · Live 3D App',
    title: '3D Marine Bathymetry & Terrain Analysis Workbench',
    subtitle: 'Vue 3 · TypeScript · Mars3D 3.8 / CesiumJS 1.123 · AntD Vue 4 · ECharts',
    category: 'WebGIS & Data',
    period: '2024.11 – 2025.09',
    badge: 'Original 3D GIS App',
    summary:
      'Hand-crafted 3D bathymetric terrain & spatial analysis studio (132 commits) relocated to Monterey Submarine Canyon with deterministic CustomHeightmapTerrainProvider bathymetry, slope/aspect, contours, seabed volume, 3D trench excavation, ECharts cross-sections, marine water shaders, and simulated SSE task queue.',
    metrics: [
      { label: 'Hand-Crafted', value: '132 Commits' },
      { label: '3D Engine', value: 'Cesium 1.123' },
      { label: 'Visual Effects', value: '10 Passed' },
    ],
    stack: ['Vue 3', 'TypeScript', 'CesiumJS 1.123', 'Mars3D 3.8', 'Ant Design Vue 4', 'ECharts', 'Turf.js'],
    architecture: [
      'Full 3D WebGL scene powered by Mars3D 3.8 over CesiumJS 1.123 with deterministic CustomHeightmapTerrainProvider generating continuous bathymetric elevation for Monterey Submarine Canyon.',
      'Interactive geospatial analysis toolkit implementing slope & aspect shading, bathymetric contour extraction, cut-and-fill seabed volume, 3D trench excavation clipping planes, and synchronized ECharts cross-section elevation profiles.',
      'Real-time marine surface water & weather shader controller alongside an asynchronous SSE-style algorithm task queue with vertical terrain exaggeration.',
    ],
    challengesSolved: [
      'Engineered deterministic synthetic bathymetry heightmaps directly in browser memory so all 3D spatial analyses (excavation, profiles, contours, volume) compute accurately with zero private backend servers.',
      'Tuned CesiumJS camera clamping, clipping plane ordering, and custom marine water/weather shaders to pass all 10 real-time rendering and scene-switching tests smoothly.',
      'Structured modular Vue 3 + TypeScript stores decoupling 3D WebGL lifecycle management from Ant Design Vue 4 controls and ECharts analytics.',
    ],
  },
  {
    id: 'typhoon-center',
    era: 'pre-ai',
    eraLabel: 'Pre-AI Hand-Crafted',
    primaryLink: {
      label: 'Launch Original Typhoon Platform',
      href: '/apps/typhoon-center/',
    },
    repoStatus: 'Pre-AI Hand-Crafted · Live 1920×1080 Wallboard',
    title: 'Tropical Cyclone Intelligence & Visualization Platform',
    subtitle: 'Vue 2 · DataV ScaleScreen · ECharts 5 · 950-Particle Rankine Wind Canvas',
    category: 'WebGIS & Data',
    period: '2023.03 – 2024.02',
    badge: 'Original Big-Screen App',
    summary:
      'Hand-crafted meteorological wallboard built with Vue 2, DataV ScaleScreen (1920×1080 adaptive canvas), and ECharts 5—featuring a 950-particle Rankine-vortex animated wind-field Canvas, 6 clickable synthetic Western Pacific cyclones, and procedural IR/WV/VIS satellite & AI eye-detection canvases.',
    metrics: [
      { label: 'Wind Simulation', value: '950 Particles' },
      { label: 'Synthetic Tracks', value: '6 Cyclones' },
      { label: 'Viewport Engine', value: 'DataV 1080p' },
    ],
    stack: ['Vue 2', 'DataV', 'ECharts 5', 'HTML5 Canvas', 'Rankine Vortex Math', 'JavaScript'],
    architecture: [
      'Adaptive 1920×1080 DataV ScaleScreen big-screen layout uniting multi-panel ECharts 5 intensity/pressure curves with live map track playback.',
      'Custom HTML5 Canvas fluid-particle engine animating 950 wind vectors along an analytical Rankine-vortex velocity profile synchronized to active cyclone center & radius.',
      'Procedural multi-channel meteorological imagery synthesizer rendering infrared (IR), water-vapor (WV), visible (VIS) cloud bands and simulated AI cyclone-eye bounding boxes.',
    ],
    challengesSolved: [
      'Achieved smooth 60fps 950-particle wind advection with decaying motion trails directly on 2D Canvas without blocking ECharts tooltip responsiveness.',
      'Designed unified state linking 6 clickable Western Pacific synthetic tracks with wind-radius polygons, pressure-wind evolution charts, and satellite channel switches.',
      'Maintained crisp proportion scaling across ultra-wide desktop monitors and laptops using DataV ScaleScreen matrix transforms.',
    ],
  },
  {
    id: 'rfid-iot-monitor',
    era: 'pre-ai',
    eraLabel: 'Pre-AI Hand-Crafted',
    primaryLink: {
      label: 'Launch Original SmartRFID App',
      href: '/apps/rfid-iot-monitor/',
    },
    repoStatus: 'Pre-AI Hand-Crafted · Live IoT WebSocket Sim',
    title: 'SmartRFID · IoT Asset & Controlled Archive Monitor',
    subtitle: 'Vue 2 · Ant Design Vue 1.7 · Viser-Vue · Spring Boot / WebSocket Architecture',
    category: 'Full-Stack SaaS',
    period: '2021.11 – 2021.12',
    badge: 'Original IoT App',
    summary:
      'Hand-crafted full-stack smart-lab & precision-warehouse RFID asset monitoring platform built with Vue 2, Ant Design Vue 1.7, Viser-Vue, and Spring Boot / WebSocket architecture—featuring real-time simulated WebSocket unauthorized-exit alerts with Web Audio chime and vault check-in/out CRUD.',
    metrics: [
      { label: 'Live Telemetry', value: 'WebSocket Sim' },
      { label: 'Audio Alert', value: 'Web Audio API' },
      { label: 'Original Stack', value: 'Vue 2 + Spring' },
    ],
    stack: ['Vue 2', 'Ant Design Vue 1.7', 'Viser-Vue', 'WebSocket', 'Spring Boot', 'Redis', 'MyBatis-Plus'],
    architecture: [
      'Real-time RFID gate event dashboard combining Vue 2, Ant Design Vue 1.7 tables/modals, and Viser-Vue operational analytics charts.',
      'Event-driven WebSocket architecture (backed in production by Spring Boot, MyBatis-Plus, Redis caching, and scheduled hardware heartbeat monitors) with client-side real-time simulation in the live demo.',
      'End-to-end controlled archive & precision equipment vault workflow covering RFID tag registration, authorized check-in/out, anomaly detection, and immediate audio/visual escalation.',
    ],
    challengesSolved: [
      'Built deterministic client-side WebSocket stream simulation and Web Audio API chime synthesis so visitors can trigger and verify unauthorized-exit alerts directly in the browser.',
      'Handled high-frequency RFID reader scans with Redis-backed deduplication and scheduled device heartbeat checks to detect offline gate readers immediately.',
      'Preserved the authentic 2021 Vue 2 + Ant Design Vue 1.7 production UI cleanly modernized with 100% civilian smart-lab & archive demo fixtures.',
    ],
  },
  {
    id: 'sbupnet-ieee',
    era: 'pre-ai',
    eraLabel: 'Pre-AI Hand-Crafted',
    primaryLink: {
      label: 'Explore SBUPNet Benchmark Lab',
      href: '#/demos/ai-lab',
      sandboxId: 'ai-lab',
    },
    repoStatus: 'First-Author IEEE SMC 2026 · Interactive Benchmark Lab',
    title: 'SBUPNet · Uncertainty-Guided UHR Aerial Segmentation',
    subtitle: 'First Author · Accepted to IEEE SMC 2026 · PyTorch · MMSegmentation',
    category: 'AI & Systems',
    period: '2024.11 – 2025.08',
    badge: 'IEEE SMC 2026 · 1st Author',
    summary:
      'Peer-reviewed first-author deep learning research tackling real-time semantic segmentation of ultra-high-resolution (5000×5000) aerial & remote-sensing imagery—achieving 76.5% mIoU at 9.49 FPS on Inria Aerial (+20% throughput and -35% training time & peak VRAM vs. ISDNet).',
    metrics: [
      { label: 'Inria Aerial', value: '76.5% mIoU' },
      { label: 'Inference Speed', value: '9.49 FPS' },
      { label: 'VRAM & Time', value: '-35% vs ISDNet' },
    ],
    stack: ['Python', 'PyTorch', 'MMSegmentation', 'UHR Semantic Segmentation', 'Remote Sensing CV', 'CUDA'],
    architecture: [
      'Slim-Branch Uncertainty-guided Pixel selection Network (SBUPNet): pairs a fast global context branch with an entropy-based pixel uncertainty estimator.',
      'Selective Top-K high-resolution patch routing refines only ambiguous object edges and dense urban boundaries instead of running expensive dense high-res convolutions across uniform regions.',
      'Systematic empirical optimization study across Inria Aerial, DeepGlobe, CRAG, and MonuSeg comparing Full, Patch, Cross-source Mosaic, and downsampling strategies via gradient variance & mean-update utility.',
    ],
    challengesSolved: [
      'Resolved the memory-vs-accuracy bottleneck of 5000×5000 aerial imagery, lifting throughput ~20% while cutting training time and peak GPU VRAM by ~35% relative to ISDNet.',
      'Quantified why sample-organization strategies shift optimization stability using gradient variance and mean-update utility across 4 heterogeneous UHR benchmarks.',
      'Packaged published benchmark trade-offs and the 4-stage uncertainty routing pipeline into an interactive browser explorer (#/demos/ai-lab).',
    ],
  },

  // ============================================================================
  // AI-ASSISTED ERA (2026.07 – 2026.11) · 7 Flagship Case Studies (9 Live Apps)
  // ============================================================================
  {
    id: 'webgis-workbench',
    era: 'ai-era',
    eraLabel: 'AI-Assisted Era',
    primaryLink: {
      label: 'Launch Original WebGIS App',
      href: '/apps/webgis-workbench/',
    },
    extraLinks: [{ label: 'Swipe Compare Lab', href: '#/demos/webgis', sandboxId: 'webgis' }],
    repoStatus: 'AI-Era Original Frontend · 100% Synthetic Data',
    title: 'WebGIS One-Map Spatial Workbench',
    subtitle: 'React · OpenLayers 10 · Ant Design · Turf.js · 11 Synthetic Coastal Layers',
    category: 'WebGIS & Data',
    period: '2026.10',
    badge: 'Original Production App',
    summary:
      'Production geospatial one-map studio built with React, OpenLayers 10, Ant Design, and Turf.js—featuring 11 synthetic coastal datasets, Esri/OSM basemap switching, interactive layer controls, spatial buffer/measure tools, and attribute inspection.',
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
    id: 'salon-system',
    era: 'ai-era',
    eraLabel: 'AI-Assisted Era',
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
    period: '2026.11',
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
    id: 'hydrology-dashboard',
    era: 'ai-era',
    eraLabel: 'AI-Assisted Era',
    primaryLink: {
      label: 'Launch Original Hydrology App',
      href: '/apps/hydrology-dashboard/',
    },
    extraLinks: [{ label: 'Surge Sim Sandbox', href: '#/demos/hydrology', sandboxId: 'hydrology' }],
    repoStatus: 'Original 3-View Platform · 100% Synthetic Telemetry',
    title: 'Multi-Source Hydrological & Time-Series Platform',
    subtitle: '3-View Suite: Public Big Screen · Own Station Network · Spatial Query Web',
    category: 'WebGIS & Data',
    period: '2026.07 – 2026.10',
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
    id: 'blue-carbon',
    era: 'ai-era',
    eraLabel: 'AI-Assisted Era',
    primaryLink: {
      label: 'Launch Original Blue Carbon App',
      href: '/apps/blue-carbon/',
    },
    repoStatus: 'Original Vue 3 + MapLibre Frontend · Synthetic Data',
    title: 'Coastal Blue Carbon Data Platform',
    subtitle: 'Vue 3 · Pinia · MapLibre GL · 1985–2019 Coastal Saltmarsh Timeline',
    category: 'WebGIS & Data',
    period: '2026.09 – 2026.10',
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
    id: 'open-datahub',
    era: 'ai-era',
    eraLabel: 'AI-Assisted Era',
    primaryLink: {
      label: 'Launch OceanData Portal',
      href: '/apps/open-data-portal/',
    },
    extraLinks: [{ label: 'DataHub Admin Console', href: '/apps/data-share-admin/' }],
    repoStatus: '2 Original Production Frontends Deployed Live',
    title: 'OceanData Open Portal & DataHub Admin Suite',
    subtitle: 'Three.js 3D Globe + OpenLayers Portal · AntD + ApexCharts RBAC Admin Console',
    category: 'Full-Stack SaaS',
    period: '2026.09 – 2026.11',
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
    id: 'sound-ai',
    era: 'ai-era',
    eraLabel: 'AI-Assisted Era',
    primaryLink: {
      label: 'Launch Original Sound-AI App',
      href: '/apps/sound-ai/',
    },
    repoStatus: 'Original React 19 Canvas App · Synthesized WAV',
    title: 'Sound-AI Bio-Acoustic Spectrogram Annotation Studio',
    subtitle: 'React 19 · Custom Canvas LOD1 Spectrogram Engine · 3 Synthesized Demo WAVs',
    category: 'AI & Systems',
    period: '2026.10',
    badge: 'Original Production App',
    summary:
      'Browser-native bio-acoustic annotation workbench built with React 19 and a custom high-FPS Canvas spectrogram engine—featuring 3 procedurally synthesized demo WAV audio tracks, LOD1 tiled spectrogram zoom/pan, synced audio playback, and interactive time-frequency bounding-box labeling.',
    metrics: [
      { label: 'Render Target', value: '60 FPS Canvas' },
      { label: 'Demo Assets', value: '3 WAV + LOD1' },
      { label: 'Frontend', value: 'React 19 + TS' },
    ],
    stack: ['React 19', 'TypeScript', 'HTML5 Canvas', 'Web Audio / WAV', 'LOD1 Spectrogram', 'JSON Export'],
    architecture: [
      'Zero-lag custom HTML5 Canvas LOD1 spectrogram renderer decoupled from React DOM updates for smooth zooming, panning, and bounding-box dragging.',
      'Synchronized Web Audio API playback cursor mapped deterministically to pixel coordinates and physical time/frequency (seconds / Hz) axes.',
      'Self-contained static demo adapter serving 3 procedurally synthesized WAV files and pre-computed LOD1 spectrogram tiles with zero external API keys.',
    ],
    challengesSolved: [
      'Eliminated canvas redraw jank on high-DPI displays via offscreen spectrogram caching and throttled pointer projection.',
      'Maintained exact coordinate round-trip precision between screen pixels and acoustic physical units (Hz / sec) across zoom levels.',
      'Replaced all proprietary audio with 100% procedurally generated synthetic WAV waveforms & spectrograms for open browser evaluation.',
    ],
  },
  {
    id: 'ai-file-lock-qa',
    era: 'ai-era',
    eraLabel: 'AI-Assisted Era',
    primaryLink: {
      label: 'Launch FileLock & QA Sandbox',
      href: '#/demos/devtools',
      sandboxId: 'devtools',
    },
    repoStatus: 'Private Systems CLI · Interactive Browser Simulator',
    title: 'ai-file-lock Concurrency Guard & qa-cli Visual QA Engine',
    subtitle: 'libfuse3 / WinFsp 128-Proc Verified · Playwright Core + FFmpeg MP4 Video Audits',
    category: 'AI & Systems',
    period: '2026.10 – 2026.11',
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

const ZH_PROJECTS: Record<string, Partial<ProjectCaseStudy>> = {
  'marine-terrain-3d': {
    eraLabel: '前 AI 纯手搓',
    primaryLink: { label: '打开原始三维地形应用', href: '/apps/marine-terrain-3d/' },
    repoStatus: '前 AI 时代纯手搓 (132 次提交) · 3D 实景上线',
    title: '三维海洋水深地形与空间分析工作台',
    subtitle: 'Vue 3 · TypeScript · Mars3D 3.8 / CesiumJS 1.123 · AntD Vue 4 · ECharts',
    badge: '原始 3D GIS 应用',
    summary:
      '前 AI 时代历时近一年纯手工编写（132 次提交）的三维海底地形分析工作台，场景迁移至蒙特雷海底峡谷，内置确定性 CustomHeightmapTerrainProvider 水深地形、坡度坡向、等深线、方量测算、三维开挖、ECharts 剖面分析、海面水体/天气特效与模拟 SSE 异步任务队列。',
    metrics: [
      { label: '纯手工沉淀', value: '132 次提交' },
      { label: '三维引擎', value: 'Cesium 1.123' },
      { label: '特效验收', value: '10 项全通过' },
    ],
    architecture: [
      '基于 Mars3D 3.8 与 CesiumJS 1.123 打造 WebGL 三维地球场景，通过确定性 CustomHeightmapTerrainProvider 在浏览器端实时生成连续的蒙特雷海底峡谷水深高程。',
      '集成坡度坡向着色、等深线提取、海底土方量测算、三维沟槽开挖裁剪面及 ECharts 同步地形剖面曲线等全套空间分析工具。',
      '内置海洋水体反射与天气粒子着色器控制面板、地形垂直夸张滑块及模拟 SSE 异步算法任务队列。',
    ],
    challengesSolved: [
      '在纯前端构建确定性合成水深高程提供器，使开挖、剖面、等深线与方量分析在无私有后端的前提下保持精准物理一致。',
      '深度调优 CesiumJS 相机贴地限制、裁剪面渲染顺序与海洋水体/气象着色器，10 项实景特效与切换测试全部通过。',
      '以模块化 Vue 3 + TypeScript 状态架构解耦 WebGL 生命周期、Ant Design Vue 4 交互面板与 ECharts 数据图表。',
    ],
  },
  'typhoon-center': {
    eraLabel: '前 AI 纯手搓',
    primaryLink: { label: '打开原始台风态势大屏', href: '/apps/typhoon-center/' },
    repoStatus: '前 AI 时代纯手搓 · 1920×1080 大屏实景上线',
    title: '热带气旋智能监测与可视化大屏平台',
    subtitle: 'Vue 2 · DataV 自适应大屏 · ECharts 5 · 950 粒子兰金涡旋风场 Canvas',
    badge: '原始监测大屏',
    summary:
      '前 AI 时代纯手工编写的气象监测大屏（Vue 2 + DataV ScaleScreen 1920×1080 + ECharts 5），搭载 950 粒子兰金涡旋动态风场 Canvas、6 条可点击西北太平洋合成台风路径及程序化红外/水汽/可见光卫星云图与 AI 台风眼识别视图。',
    metrics: [
      { label: '粒子风场', value: '950 粒子' },
      { label: '模拟气旋', value: '6 条路径' },
      { label: '大屏引擎', value: 'DataV 1080p' },
    ],
    architecture: [
      '采用 DataV ScaleScreen 1920×1080 等比缩放架构，融合多维 ECharts 5 气压/风速趋势图与台风路径动态回放。',
      '自研 2D Canvas 流体粒子引擎，按兰金涡旋解析速度场驱动 950 个风场粒子实时随气旋中心与风圈半径平流运动。',
      '内置程序化红外 (IR)、水汽 (WV)、可见光 (VIS) 卫星通道云图渲染器与模拟 AI 台风眼定位框。',
    ],
    challengesSolved: [
      '在 2D Canvas 上实现 60fps 950 粒子拖尾平流动画，同时保障多组 ECharts 交互悬停流畅不卡顿。',
      '将 6 条可交互合成台风路径与七级/十级风圈、气压演变曲线及卫星通道切换统一联动。',
      '通过 DataV 矩阵变换保障大屏在超宽显示器与笔记本视口下的精准比例呈现。',
    ],
  },
  'rfid-iot-monitor': {
    eraLabel: '前 AI 纯手搓',
    primaryLink: { label: '打开原始 SmartRFID 平台', href: '/apps/rfid-iot-monitor/' },
    repoStatus: '前 AI 时代纯手搓 · WebSocket 实时告警实景',
    title: 'SmartRFID · 物联网资产与受控档案监控平台',
    subtitle: 'Vue 2 · Ant Design Vue 1.7 · Viser-Vue · Spring Boot / WebSocket 架构',
    badge: '原始物联网应用',
    summary:
      '2021 年纯手工开发的智慧实验室与精密仓储 RFID 物联网资产监控系统（Vue 2 + Ant Design Vue 1.7 + Viser-Vue + Spring Boot / WebSocket 架构），支持模拟 WebSocket 未授权出库实时告警、Web Audio 蜂鸣提示与库房出入登记 CRUD。',
    metrics: [
      { label: '实时通信', value: 'WebSocket 模拟' },
      { label: '声音告警', value: 'Web Audio API' },
      { label: '经典栈', value: 'Vue 2 + Spring' },
    ],
    architecture: [
      '结合 Vue 2、Ant Design Vue 1.7 与 Viser-Vue 打造门禁扫描监控台、资产台账表格与实时统计图表。',
      '事件驱动 WebSocket 推送架构（原生产后端采用 Spring Boot、MyBatis-Plus、Redis 缓存与定时设备心跳巡检），线上演示提供实时客户端事件流模拟。',
      '完整覆盖受控档案与精密仪器标签登记、授权借还、异常离库判定与声光即时告警闭环。',
    ],
    challengesSolved: [
      '在浏览器端实现确定性 WebSocket 事件流模拟与 Web Audio 提示音合成，访客可一键触发并核验异常离库告警。',
      '针对高频 RFID 读卡器并发上报，采用 Redis 去重缓存与定时心跳巡检快速定位离线硬件节点。',
      '完整保留 2021 年原版 Vue 2 + Ant Design Vue 1.7 生产界面，并全面切换为 100% 民用智慧实验室合成数据。',
    ],
  },
  'sbupnet-ieee': {
    eraLabel: '前 AI 纯手搓',
    primaryLink: { label: '进入 SBUPNet 论文基准台', href: '#/demos/ai-lab', sandboxId: 'ai-lab' },
    repoStatus: 'IEEE SMC 2026 第一作者 · 交互式基准实验台',
    title: 'SBUPNet · 超高分辨率遥感影像轻量化语义分割',
    subtitle: '第一作者 · IEEE SMC 2026 已录用 · PyTorch · MMSegmentation',
    badge: 'IEEE SMC 2026 · 一作',
    summary:
      '第一作者发表于 IEEE SMC 2026 的超高分辨率（5000×5000）遥感影像实时语义分割研究：在 Inria Aerial 上达到 76.5% mIoU 与 9.49 FPS，相较 ISDNet 吞吐提升约 20%，训练耗时与峰值显存降低约 35%。',
    metrics: [
      { label: 'Inria Aerial', value: '76.5% mIoU' },
      { label: '推理吞吐', value: '9.49 FPS' },
      { label: '显存与耗时', value: '降低 35%' },
    ],
    architecture: [
      '不确定像素引导轻量化双分支网络 (SBUPNet)：轻量全局分支快速提取宏观语义，并通过预测熵定位高不确定性边缘像素。',
      'Top-K 高不确定区域选择性路由：仅对复杂边界与细碎建筑区域执行高分辨率细化，大幅削减冗余计算与显存峰值。',
      '跨 Inria、DeepGlobe、CRAG、MonuSeg 四大基准系统评估 Full、Patch、Cross-source Mosaic 与降采样策略的梯度方差与优化效能。',
    ],
    challengesSolved: [
      '攻克 5000×5000 超高分航拍影像显存爆炸与推理延迟难题，较 ISDNet 提速约 20% 且节省约 35% 显存与训练时间。',
      '基于梯度方差与 mean-update utility 量化解释样本组织策略对超高分辨率语义分割优化行为的影响机理。',
      '将论文定量对比、帕累托前沿与四阶段路由架构封装为浏览器交互实验台 (#/demos/ai-lab)。',
    ],
  },
  'webgis-workbench': {
    eraLabel: 'AI 协同交付',
    primaryLink: { label: '打开原始 WebGIS 应用', href: '/apps/webgis-workbench/' },
    extraLinks: [{ label: '卷帘对比实验台', href: '#/demos/webgis', sandboxId: 'webgis' }],
    repoStatus: 'AI 时代原始生产前端 · 100% 合成演示数据',
    title: 'WebGIS 一张图空间分析工作台',
    subtitle: 'React · OpenLayers 10 · Ant Design · Turf.js · 11 套海岸带模拟图层',
    badge: '原始生产前端',
    summary:
      '基于 React、OpenLayers 10、Ant Design 与 Turf.js 打造的专业空间信息一张图工作台，内置 11 套脱敏海岸带合成图层、Esri/OSM 底图切换、图层显隐与透明度控制、空间量测分析与属性表联动定位。',
    metrics: [
      { label: '空间图层', value: '11 套数据' },
      { label: '地图引擎', value: 'OL 10 + Turf' },
      { label: '底图支持', value: 'Esri / OSM' },
    ],
    architecture: [
      '模块化 OpenLayers 10 工作台架构，解耦底图瓦片、多源矢量/栅格目录、Turf.js 空间工具与侧边属性检视器。',
      '统一 GeoJSON 与 Web Mercator 瓦片管线，支持 11 套海岸带模拟数据即时开关、透明度叠加与空间筛选。',
      '客户端数据适配层完全解耦，使同一套生产前端既可直连真实后端 API，也可零后端运行 100% 合成演示数据。',
    ],
    challengesSolved: [
      '通过标准化 EPSG:3857 / WGS84 坐标转换管线，彻底消除多源矢量与栅格图层间的投影偏移。',
      '集成 Turf.js 纯前端几何运算（缓冲区、交集分析、球面距离/面积量测），实现零服务端延迟的交互体验。',
      '替换无水印 Esri / OSM 公共底图并完善多面板响应式布局。',
    ],
  },
  'salon-system': {
    eraLabel: 'AI 协同交付',
    primaryLink: { label: '打开 PC 管理后台', href: '/apps/salon-admin/' },
    extraLinks: [
      { label: '移动收银 POS', href: '/apps/salon-admin/#/mobile' },
      { label: '顾客端 H5', href: '/apps/salon-customer/' },
      { label: '发型师端 H5', href: '/apps/salon-barber/' },
    ],
    repoStatus: '4 套原始生产终端全上线 · 跨端实时联动',
    title: '多端美发零售商业 SaaS（四端套件）',
    subtitle: 'PC 管理端 · 移动收银 POS · 顾客端 UniApp H5 · 发型师工作台 H5',
    badge: '4 套原始应用',
    summary:
      '面向实体门店的四端全栈 SaaS，现已将全部 4 套原始编译前端部署上线并通过 localStorage 实时联动：PC 管理后台、手机收银台、顾客自助 H5 与发型师移动工作台，支持 0 费率自有码核账、双账本钱包与 RBAC 越权拦截。',
    metrics: [
      { label: '上线终端', value: '4 套真前端' },
      { label: '自动化用例', value: '20 条闭环' },
      { label: '收款通道费', value: '0% 自有码' },
    ],
    architecture: [
      '四套生产级前端共享统一契约：PC 后台 (/apps/salon-admin/)、移动 POS (/apps/salon-admin/#/mobile)、顾客 H5 (/apps/salon-customer/)、发型师 H5 (/apps/salon-barber/)。',
      '双账本储值与次卡体系严格区分本金/赠金比例扣减、发型师阶梯提成与 5 秒打烊经手人对账。',
      '完整 RBAC 权限矩阵区分店主 OWNER、收银员 CASHIER、发型师与顾客，对越权审批返回 HTTP 403 并记入安全审计。',
    ],
    challengesSolved: [
      '通过 0 费率自有收款码 + 强制到账语音播报勾选 + 收银员账号绑定，省去商户年审与 0.6% 通道手续费。',
      '彻底封堵线上自助储值逃单漏洞：顾客提交申请保持 PENDING_REVIEW，仅 OWNER 核账放行，CASHIER 审批触发 403 审计告警。',
      '利用浏览器跨端状态同步，在顾客端下单即可在发型师端、POS 端与 PC 对账台实时联动体验。',
    ],
  },
  'hydrology-dashboard': {
    eraLabel: 'AI 协同交付',
    primaryLink: { label: '打开原始水文三端平台', href: '/apps/hydrology-dashboard/' },
    extraLinks: [{ label: '风暴潮模拟沙盒', href: '#/demos/hydrology', sandboxId: 'hydrology' }],
    repoStatus: '原始三视图生产平台 · 100% 合成监测数据',
    title: '多源水文与时序监测平台',
    subtitle: '三端合一：公网监测大屏 · 自建站点网络看板 · 空间时序查询门户',
    badge: '原始三视图应用',
    summary:
      '整合 18 个上游数据源、约 2.5 万条站点记录的高密度海岸带水文时序平台（PostgreSQL / TimescaleDB），现以原始三视图顶部切换形态上线：公网大屏、自建站点网络与空间查询 Web 端。',
    metrics: [
      { label: '接入数据源', value: '18 个通道' },
      { label: '管理站点', value: '约 25,000' },
      { label: '上线模块', value: '3 套视图' },
    ],
    architecture: [
      '单入口顶部切换集成三大生产模块：公网监测大屏、自建站网运行看板及空间/时序指标查询门户。',
      '由 systemd 守护的采集任务将 NOAA、ISD、METAR 及区域水文载荷清洗入库至 TimescaleDB 超表。',
      'FastAPI 分析接口支持空间范围检索、多指标聚合趋势计算与河口健康状态诊断。',
    ],
    challengesSolved: [
      '统一 18 种异构数据源的字段结构、时区、缺失值标记与物理量纲，收敛至标准站点观测模型。',
      '借助 TimescaleDB 分区超表与站点-时间联合索引，将跨月多站曲线查询优化至亚秒级。',
      '结合采集日志与接口-数据库入库核对脚本，及时发现静默断流与延迟异常。',
    ],
  },
  'blue-carbon': {
    eraLabel: 'AI 协同交付',
    primaryLink: { label: '打开原始蓝碳平台', href: '/apps/blue-carbon/' },
    repoStatus: '原始 Vue 3 + MapLibre 前端 · 合成演示数据',
    title: '海岸带蓝碳数据可视化平台',
    subtitle: 'Vue 3 · Pinia · MapLibre GL · 1985–2019 盐沼演变时间轴',
    badge: '原始生产前端',
    summary:
      '基于 Vue 3、Pinia 与 MapLibre GL 构建的海岸带蓝碳与盐沼碳汇监测平台，具备 1985–2019 跨年代演变时间轴、WebGL 加速矢量栅格渲染及区域碳储量统计分析看板。',
    metrics: [
      { label: '时间跨度', value: '1985 – 2019' },
      { label: '渲染引擎', value: 'MapLibre GL' },
      { label: '切片层级', value: 'Z6 – Z11' },
    ],
    architecture: [
      '采用 Vue 3 + Pinia 响应式状态同步 MapLibre GL WebGL 图层、时间轴控件与生态指标图表。',
      '搭建自动化 GeoTIFF 重投影与 Web Mercator 金字塔切片流程，修复旧切片投影偏移并扩展至 Z6–Z11。',
      '通过同源 Nginx 反向代理统一分发瓦片缓存与 FastAPI 空间统计接口。',
    ],
    challengesSolved: [
      '定位并修复历史盐沼切片因基准面/投影元数据不一致导致的偏移问题，重建 8 个年份的 Web Mercator GeoTIFF 切片。',
      '利用 MapLibre GL GPU 渲染能力实现 1985–2019 跨年代流畅滑块联动切换。',
      '完整保留原始生产交互界面并迁移至 100% 合成演示数据集，供浏览器直接体验。',
    ],
  },
  'open-datahub': {
    eraLabel: 'AI 协同交付',
    primaryLink: { label: '打开海洋开放门户', href: '/apps/open-data-portal/' },
    extraLinks: [{ label: 'DataHub 审批后台', href: '/apps/data-share-admin/' }],
    repoStatus: '2 套原始生产前端同步上线',
    title: 'OceanData 开放数据门户与 DataHub 后台',
    subtitle: 'Three.js 3D 地球 + OpenLayers 门户 · AntD + ApexCharts RBAC 运维后台',
    badge: '2 套原始应用',
    summary:
      '科研级开放数据共享双端生态：（1）OceanData 开放门户，含 Three.js 3D 交互地球、OpenLayers 空间检索与 i18next 双语支持；（2）DataHub 管理后台，含 Ant Design、ApexCharts 统计、审批队列与防目录穿越文件树。',
    metrics: [
      { label: '上线前端', value: '2 套真应用' },
      { label: '文章审计', value: '4,207 篇' },
      { label: '生产后端', value: 'Spring / Java 21' },
    ],
    architecture: [
      '公共门户 (/apps/open-data-portal/)：React + Three.js 3D 地球 + OpenLayers 空间目录 + i18next 双语切换，涵盖 12 套合成数据集。',
      '管理后台 (/apps/data-share-admin/)：React + Ant Design + ApexCharts 运行指标、多级 RBAC 审批流与安全虚拟文件管理器。',
      '生产环境基于 Spring Boot 3.3 (Java 21)、PostgreSQL、Redis 缓存及同源 Nginx 部署。',
    ],
    challengesSolved: [
      '构建 AI 辅助 CMS 批处理管线，整理 4,207 篇文章源码并完成 724 篇多页文章格式重构、断点续跑与发布后逐篇回读校验。',
      '加固文件上传与浏览接口，防御路径穿越 (../)、异常 MIME 载荷与跨系统编码错误。',
      '打通公众开放检索与内部数据管理员审核发布的同源安全部署架构。',
    ],
  },
  'sound-ai': {
    eraLabel: 'AI 协同交付',
    primaryLink: { label: '打开原始 Sound-AI 应用', href: '/apps/sound-ai/' },
    repoStatus: '原始 React 19 Canvas 应用 · 合成演示 WAV',
    title: 'Sound-AI 生物声学声谱图标注工作台',
    subtitle: 'React 19 · 自定义 Canvas LOD1 声谱引擎 · 3 段合成演示音频',
    badge: '原始生产前端',
    summary:
      '基于 React 19 与高性能自定义 Canvas 声谱渲染引擎构建的浏览器原生生物声学标注工作台，内置 3 段程序合成 WAV 音频与 LOD1 分层声谱图，支持平滑缩放平移、音画同步播放与精确时频拉框标注。',
    metrics: [
      { label: '渲染帧率', value: '60 FPS Canvas' },
      { label: '合成资产', value: '3 WAV + LOD1' },
      { label: '前端架构', value: 'React 19 + TS' },
    ],
    architecture: [
      '零卡顿自定义 HTML5 Canvas LOD1 声谱渲染引擎，与 React DOM 更新解耦以保障流畅缩放、拖拽平移与拉框标注。',
      'Web Audio API 同步播放游标与屏幕像素、物理时频单位（秒 / Hz）精确映射。',
      '内置 3 段纯数学合成 WAV 波形与 LOD1 声谱瓦片静态适配层，免后端免密钥即时体验。',
    ],
    challengesSolved: [
      '借助离屏声谱缓存与节流指针投影，消除高分屏下的 Canvas 重绘卡顿。',
      '在不同缩放倍率下保持像素坐标与物理频率/时间坐标的无损双向转换精度。',
      '将全部音频与声谱替换为 100% 程序合成演示数据，确保零隐私风险。',
    ],
  },
  'ai-file-lock-qa': {
    eraLabel: 'AI 协同交付',
    primaryLink: { label: '启动文件锁与 QA 沙盒', href: '#/demos/devtools', sandboxId: 'devtools' },
    repoStatus: '底层系统 CLI · 浏览器实时并发模拟器',
    title: 'ai-file-lock 挂载并发保护与 qa-cli 视觉 QA 引擎',
    subtitle: 'libfuse3 / WinFsp 128 进程并发验证 · Playwright Core + FFmpeg 录屏验收',
    badge: '系统与 QA 工具',
    summary:
      '面向 AI 辅助软件工程可靠交付的两大底层工具：ai-file-lock 通过原生 FUSE / WinFsp 挂载防止多 Agent 并发写冲突（v1.0.3 通过 128 进程实测）；qa-cli 自动生成 Playwright + FFmpeg MP4 验收视频与零报错报告。',
    metrics: [
      { label: '并发压测', value: '128 进程' },
      { label: '稳定基线', value: 'v1.0.3' },
      { label: '验收交付', value: 'Playwright MP4' },
    ],
    stack: ['Python 3.11+', 'Node.js 22+', 'libfuse3', 'WinFsp', 'SQLite', 'Playwright Core', 'FFmpeg'],
    architecture: [
      '后台守护进程管理原生 libfuse3 / WinFsp 挂载与托管存储仓，持久化 restoration.json 崩溃恢复日志与 SQLite 句柄表。',
      '在截断、原子重命名与删除前强制执行共享读/独占写句柄锁，向调用方 stderr 输出可读冲突诊断。',
      '无头 Playwright Core + FFmpeg 流水线同步执行 DOM 断言、网络/控制台零报错检查并输出 MP4 验收录屏。',
    ],
    challengesSolved: [
      '通过 Linux 真实挂载与 128 进程并发压测，以及 Windows x64 / WinFsp 2.2 冲突保护、原子替换与启停恢复验收。',
      '在实验分支探索乐观保存、静态依赖图与 Tree-sitter 函数级合并，并诚实记录工程边界。',
      '用可复现的自动化视觉录屏取代口头交付，大幅提升远程客户信任与验收效率。',
    ],
  },
};

export function getProjects(lang: Lang): ProjectCaseStudy[] {
  if (lang === 'en') return PROJECTS;
  return PROJECTS.map((p) => ({
    ...p,
    ...(ZH_PROJECTS[p.id] ?? {}),
  }));
}
