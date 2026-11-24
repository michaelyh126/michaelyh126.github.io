export type DemoId =
  | 'webgis'
  | 'salon'
  | 'hydrology'
  | 'data-portal'
  | 'devtools'
  | 'ai-lab';

export interface DemoMetadata {
  id: DemoId;
  route: string;
  shortTitle: string;
  title: string;
  category: string;
  tagline: string;
  stack: string[];
}

export const DEMO_CATALOG: DemoMetadata[] = [
  {
    id: 'webgis',
    route: '#/demos/webgis',
    shortTitle: 'WebGIS Studio',
    title: 'Interactive WebGIS Studio (OpenLayers 10)',
    category: 'Geospatial',
    tagline: 'Swipe compare (2018 vs 2026), geodesic distance/area measure, layer opacity & attribute table',
    stack: ['OpenLayers 10', 'EPSG:3857', 'Canvas Swipe', 'ol/sphere'],
  },
  {
    id: 'salon',
    route: '#/demos/salon',
    shortTitle: 'Salon SaaS (4-App)',
    title: 'Atelier Nova — Multi-Terminal Salon & Retail SaaS',
    category: 'Commercial SaaS',
    tagline: 'Live cross-terminal state across Customer Booking, Stylist Workbench, Mobile POS & Admin EOD',
    stack: ['React 19', 'Double-Entry Ledger', 'Direct-QR', 'RBAC 403'],
  },
  {
    id: 'hydrology',
    route: '#/demos/hydrology',
    shortTitle: 'Hydrology Platform',
    title: 'Multi-Source Hydrological & Time-Series Platform',
    category: 'Telemetry Data',
    tagline: '18 simulated feeds, 24H/7D/30D multi-metric telemetry, storm-surge injection & CSV export',
    stack: ['TimescaleDB Model', '18 Feeds', 'SVG Telemetry', 'CSV Export'],
  },
  {
    id: 'data-portal',
    route: '#/demos/data-portal',
    shortTitle: 'Open DataHub',
    title: 'Open Research Data Portal & DataHub Admin',
    category: 'Enterprise Portal',
    tagline: 'Public catalog search, live approval queue sync, RBAC audit log & hardened virtual file manager',
    stack: ['Data Catalog', 'Approval Queue', 'Virtual FS', 'Path Guard'],
  },
  {
    id: 'devtools',
    route: '#/demos/devtools',
    shortTitle: 'FileLock & QA CLI',
    title: 'ai-file-lock Concurrency Sandbox & qa-cli Report Viewer',
    category: 'Systems & QA',
    tagline: '4-agent FUSE/WinFsp write-storm simulator + headless Playwright/FFmpeg audit inspection',
    stack: ['FUSE / WinFsp', 'SQLite Lock Table', 'Playwright E2E', 'FFmpeg'],
  },
  {
    id: 'ai-lab',
    route: '#/demos/ai-lab',
    shortTitle: 'AI & Acoustic Lab',
    title: 'Bio-Acoustic Spectrogram Annotator & SBUPNet Benchmark Lab',
    category: 'AI & Vision',
    tagline: 'Interactive canvas spectrogram bbox drawing + IEEE SMC 2026 SBUPNet accuracy/speed explorer',
    stack: ['HTML5 Canvas', 'COCO JSON Export', 'IEEE SMC 2026', 'SBUPNet'],
  },
];

const VALID_DEMO_IDS = new Set<string>(DEMO_CATALOG.map((d) => d.id));

export function parseHashToDemoId(hash: string): DemoId | null {
  const cleaned = hash.replace(/^#\/?/, '').split('?')[0].replace(/\/+$/, '');
  if (!cleaned.startsWith('demos/')) return null;
  const candidate = cleaned.slice('demos/'.length);
  if (VALID_DEMO_IDS.has(candidate)) {
    return candidate as DemoId;
  }
  return null;
}

export function getDemoMeta(id: DemoId): DemoMetadata {
  return DEMO_CATALOG.find((d) => d.id === id) ?? DEMO_CATALOG[0];
}
