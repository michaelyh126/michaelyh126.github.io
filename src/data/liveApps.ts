import type { DemoId } from '../demos/registry';

export interface LiveAppEntry {
  id: string;
  label: string;
  shortLabel: string;
  category: 'Geospatial & Data' | 'Salon 4-Terminal SaaS' | 'AI, Audio & Systems';
  href: string;
  stackTag: string;
  /** If set, routes via hash SPA sandbox instead of navigating to a standalone /apps/ bundle */
  sandboxId?: DemoId;
  isOriginal: boolean;
}

export const LIVE_APPS: LiveAppEntry[] = [
  // 1–6: Geospatial, OceanData, Hydrology, Blue Carbon & Sound-AI Original Production Frontends
  {
    id: 'webgis-workbench',
    label: 'WebGIS One-Map Workbench',
    shortLabel: 'WebGIS One-Map',
    category: 'Geospatial & Data',
    href: '/apps/webgis-workbench/',
    stackTag: 'React · OL 10 · Turf',
    isOriginal: true,
  },
  {
    id: 'blue-carbon',
    label: 'Coastal Blue Carbon Platform',
    shortLabel: 'Blue Carbon (Vue 3)',
    category: 'Geospatial & Data',
    href: '/apps/blue-carbon/',
    stackTag: 'Vue 3 · MapLibre GL',
    isOriginal: true,
  },
  {
    id: 'hydrology-dashboard',
    label: 'Multi-Source Hydrology Platform',
    shortLabel: 'Hydrology (3-View)',
    category: 'Geospatial & Data',
    href: '/apps/hydrology-dashboard/',
    stackTag: 'Big Screen · Query Web',
    isOriginal: true,
  },
  {
    id: 'open-data-portal',
    label: 'OceanData Open Data Portal',
    shortLabel: 'OceanData Portal',
    category: 'Geospatial & Data',
    href: '/apps/open-data-portal/',
    stackTag: 'Three.js Globe · OL',
    isOriginal: true,
  },
  {
    id: 'data-share-admin',
    label: 'DataHub Admin & RBAC Console',
    shortLabel: 'DataHub Admin',
    category: 'Geospatial & Data',
    href: '/apps/data-share-admin/',
    stackTag: 'AntD · ApexCharts',
    isOriginal: true,
  },

  // 7–9 (4 Terminals): Commercial Salon SaaS Original Production Frontends
  {
    id: 'salon-admin',
    label: 'Salon SaaS · Desktop Admin',
    shortLabel: 'PC Admin',
    category: 'Salon 4-Terminal SaaS',
    href: '/apps/salon-admin/',
    stackTag: 'React 19 · EOD · RBAC',
    isOriginal: true,
  },
  {
    id: 'salon-pos',
    label: 'Salon SaaS · Mobile Cashier POS',
    shortLabel: 'Mobile POS',
    category: 'Salon 4-Terminal SaaS',
    href: '/apps/salon-admin/#/mobile',
    stackTag: 'Direct-QR · Wallet',
    isOriginal: true,
  },
  {
    id: 'salon-customer',
    label: 'Salon SaaS · Customer Mini-App H5',
    shortLabel: 'Customer H5',
    category: 'Salon 4-Terminal SaaS',
    href: '/apps/salon-customer/',
    stackTag: 'UniApp H5 · Synced',
    isOriginal: true,
  },
  {
    id: 'salon-barber',
    label: 'Salon SaaS · Barber Workbench H5',
    shortLabel: 'Barber H5',
    category: 'Salon 4-Terminal SaaS',
    href: '/apps/salon-barber/',
    stackTag: 'UniApp H5 · Synced',
    isOriginal: true,
  },

  // Original Sound-AI Frontend + 2 Interactive CLI/Research Sandboxes
  {
    id: 'sound-ai',
    label: 'Sound-AI Bio-Acoustic Platform',
    shortLabel: 'Sound-AI Studio',
    category: 'AI, Audio & Systems',
    href: '/apps/sound-ai/',
    stackTag: 'React 19 · WAV Canvas',
    isOriginal: true,
  },
  {
    id: 'devtools-sandbox',
    label: 'ai-file-lock & qa-cli Simulator',
    shortLabel: 'FileLock & QA CLI',
    category: 'AI, Audio & Systems',
    href: '#/demos/devtools',
    stackTag: 'FUSE · Playwright QA',
    sandboxId: 'devtools',
    isOriginal: false,
  },
  {
    id: 'sbupnet-lab',
    label: 'SBUPNet IEEE SMC ’26 Lab',
    shortLabel: 'SBUPNet Lab',
    category: 'AI, Audio & Systems',
    href: '#/demos/ai-lab',
    stackTag: '76.5% mIoU · 9.49 FPS',
    sandboxId: 'ai-lab',
    isOriginal: false,
  },
];

export const LIVE_APP_GROUPS: LiveAppEntry['category'][] = [
  'Geospatial & Data',
  'Salon 4-Terminal SaaS',
  'AI, Audio & Systems',
];
