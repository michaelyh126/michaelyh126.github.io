export interface ServiceOffering {
  id: string;
  tier: string;
  title: string;
  priceRange: string;
  timeline: string;
  idealFor: string;
  description: string;
  deliverables: string[];
  accent: 'cyan' | 'emerald' | 'sky';
}

export interface StackGroup {
  category: string;
  subtitle: string;
  items: string[];
}

export interface CredentialItem {
  period: string;
  role: string;
  organization: string;
  location: string;
  highlights: string[];
  tag: string;
}

export const SERVICES: ServiceOffering[] = [
  {
    id: 'webgis',
    tier: 'Track 01 · Geospatial',
    title: 'Interactive WebGIS & Mapping Systems',
    priceRange: 'From $1,200',
    timeline: '1 – 3 Weeks',
    idealFor: 'Climate-tech, maritime, ag-tech, logistics & environmental startups',
    description:
      'Custom browser-native geospatial applications built with OpenLayers, Leaflet, or Mapbox—engineered for smooth raster pyramids, clean coordinate math, and real spatial analysis tools.',
    deliverables: [
      'Interactive map studio (layer catalog, filters, swipe compare, geodesic measure)',
      'GeoTIFF / Shapefile / GeoJSON ingestion & Web Mercator tile pyramid pipeline',
      'Synchronized telemetry inspector, charts & responsive mobile/desktop UI',
      'Clean TypeScript codebase + automated Playwright visual walkthrough video',
    ],
    accent: 'cyan',
  },
  {
    id: 'telemetry',
    tier: 'Track 02 · Data Engineering',
    title: 'Real-Time Telemetry & Data Platforms',
    priceRange: 'From $1,500',
    timeline: '2 – 4 Weeks',
    idealFor: 'IoT networks, hydro-met observatories, energy & analytics teams',
    description:
      'Reliable multi-source data ingestion pipelines and sub-second analytical dashboards powered by FastAPI, PostgreSQL/TimescaleDB, Redis, and ECharts/React.',
    deliverables: [
      'Multi-source scheduled/streaming collectors with schema validation & retries',
      'TimescaleDB hypertable schema design, indexing & REST/WebSocket APIs',
      'Executive monitoring dashboards, alert rules & health-check diagnostics',
      'Production Docker / Nginx / systemd deployment runbook & full handover',
    ],
    accent: 'emerald',
  },
  {
    id: 'saas',
    tier: 'Track 03 · Product Engineering',
    title: 'Full-Stack SaaS MVP + Automated Video QA',
    priceRange: 'From $2,000',
    timeline: '2 – 5 Weeks',
    idealFor: 'Founders & SMBs shipping commercial SaaS, portals, or AI tools',
    description:
      'Production-ready web apps from database schema to deployed HTTPS frontend—built with React 19, TypeScript, Express/FastAPI/Spring Boot, RBAC security, and recorded E2E QA proof.',
    deliverables: [
      'Multi-role React + TypeScript frontend (Admin, Mobile Web / Responsive)',
      'Hardened REST API, RBAC auth, ledger/audit trails & SQL migrations',
      'Automated Playwright + FFmpeg E2E video audit for every milestone',
      '100% source code ownership, documentation & zero vendor lock-in',
    ],
    accent: 'sky',
  },
];

export const DELIVERY_STEPS = [
  {
    step: '01',
    title: 'Architecture & Fixed Scope',
    desc: 'Clear written spec, data schema, and milestone plan within 24 hours—zero ambiguity before coding starts.',
  },
  {
    step: '02',
    title: 'Weekly Live Staging Builds',
    desc: 'Async Loom/video updates and testable staging links so you inspect real progress across time zones.',
  },
  {
    step: '03',
    title: 'Automated Video E2E QA',
    desc: 'Every milestone ships with Playwright regression assertions and recorded MP4 proof—not guesswork.',
  },
  {
    step: '04',
    title: 'Clean Source Handover',
    desc: 'Documented Git repository, reproducible build scripts, deployment guide, and post-launch support window.',
  },
];

export const STACK_MATRIX: StackGroup[] = [
  {
    category: 'Geospatial & WebGIS',
    subtitle: 'Mapping, projections & raster pipelines',
    items: [
      'OpenLayers 10',
      'GeoTIFF / COG',
      'Turf.js',
      'Web Mercator (EPSG:3857)',
      'WGS84 / GeoJSON',
      'GDAL / Tile Pyramids',
      'PostGIS',
      'ArcPy / Shapefile',
    ],
  },
  {
    category: 'Full-Stack & Real-Time Data',
    subtitle: 'Web apps, APIs & time-series storage',
    items: [
      'React 19',
      'Vue 3',
      'TypeScript',
      'Tailwind CSS',
      'FastAPI',
      'Express / Node.js',
      'Spring Boot 3 / Java 21',
      'PostgreSQL / TimescaleDB',
      'MySQL',
      'Redis',
      'ECharts',
    ],
  },
  {
    category: 'AI & Computer Vision',
    subtitle: 'Research & production inference',
    items: [
      'Python 3.11+',
      'PyTorch',
      'MMSegmentation',
      'UHR Semantic Segmentation',
      'Remote Sensing CV',
      'Model Benchmarking',
      'AI-Assisted Workflows',
      'Tree-sitter AST',
    ],
  },
  {
    category: 'Systems, DevOps & QA',
    subtitle: 'Reliability, deployment & verification',
    items: [
      'Playwright Core',
      'FFmpeg Video QA',
      'Linux / systemd',
      'Nginx / Caddy HTTPS',
      'libfuse3 / WinFsp',
      'SQLite',
      'Git / CI Workflows',
      'REST Contract Testing',
    ],
  },
];

export const CREDENTIALS: CredentialItem[] = [
  {
    period: '2024.09 – 2027.06',
    role: 'M.S. in Computer Science & Technology',
    organization: 'Shanghai Ocean University',
    location: 'Shanghai, China',
    tag: 'Graduate Research',
    highlights: [
      'Research focus: Computer Vision, Ultra-High-Resolution (UHR) Remote Sensing Semantic Segmentation, and Real-Time Inference.',
      'First Author of SBUPNet (Accepted to IEEE SMC 2026): 76.5% mIoU @ 9.49 FPS on Inria Aerial (+20% throughput, -35% training time & peak VRAM vs. ISDNet).',
    ],
  },
  {
    period: '2025 – 2026',
    role: 'Full-Stack & Geospatial Platform Engineer (Intern)',
    organization: 'East China Normal University · Research & Data Platform',
    location: 'Shanghai, China',
    tag: 'Production Engineering',
    highlights: [
      'Built & maintained coastal blue-carbon WebGIS dashboards (Vue 3 / FastAPI), rebuilding 8 yearly GeoTIFF tile pyramids in Web Mercator (Z6–Z11) to eliminate projection drift.',
      'Engineered multi-source hydrological data pipelines (PostgreSQL / TimescaleDB) aggregating 18 data sources (NOAA, ISD, METAR, regional networks) across ~25,000 stations.',
      'Automated CMS auditing & batch publishing across 4,207 articles (724 reformatted with read-back verification) and managed Linux / Nginx / systemd production deployments.',
    ],
  },
  {
    period: '2020.09 – 2024.06',
    role: 'B.Eng. in Spatial Information & Digital Technology',
    organization: 'Shanghai Ocean University',
    location: 'Shanghai, China',
    tag: 'Geospatial Foundation',
    highlights: [
      'Four-year foundation in GIS algorithms, spatial databases, remote sensing, cartographic projections, and software engineering.',
      'Developed automated Python + ArcPy + Flask geospatial processing services for smart agriculture Shapefile/TIFF pipelines.',
      'Credentials: CET-6 English Proficiency · Shanghai Municipal Higher Education IT Proficiency Certificate (Excellence).',
    ],
  },
];
