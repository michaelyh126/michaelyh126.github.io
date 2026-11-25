import type { DemoId } from '../demos/registry';
import type { Lang } from '../i18n/LanguageContext';

export type EngineeringEra = 'pre-ai' | 'ai-era';

export type LiveAppCategory =
  | 'Pre-AI Hand-Crafted (2021–2025)'
  | 'AI-Era Geospatial & Data (2026)'
  | 'AI-Era Salon 4-Terminal SaaS (2026)'
  | 'AI-Era Audio & DevTools (2026)';

export interface LiveAppEntry {
  id: string;
  era: EngineeringEra;
  period: string;
  label: string;
  shortLabel: string;
  category: LiveAppCategory;
  href: string;
  stackTag: string;
  /** If set, routes via hash SPA sandbox instead of navigating to a standalone /apps/ bundle */
  sandboxId?: DemoId;
  isOriginal: boolean;
}

export const LIVE_APPS: LiveAppEntry[] = [
  // ================= PRE-AI HAND-CRAFTED ERA (2021 – 2025) =================
  {
    id: 'marine-terrain-3d',
    era: 'pre-ai',
    period: '2024.11 – 2025.09',
    label: '3D Marine Bathymetry & Terrain Workbench',
    shortLabel: '3D Marine Terrain',
    category: 'Pre-AI Hand-Crafted (2021–2025)',
    href: '/apps/marine-terrain-3d/',
    stackTag: 'Vue 3 · Mars3D / CesiumJS',
    isOriginal: true,
  },
  {
    id: 'typhoon-center',
    era: 'pre-ai',
    period: '2023.03 – 2024.02',
    label: 'Tropical Cyclone Intelligence Platform',
    shortLabel: 'Typhoon Center',
    category: 'Pre-AI Hand-Crafted (2021–2025)',
    href: '/apps/typhoon-center/',
    stackTag: 'Vue 2 · DataV · Wind Canvas',
    isOriginal: true,
  },
  {
    id: 'rfid-iot-monitor',
    era: 'pre-ai',
    period: '2021.11 – 2021.12',
    label: 'SmartRFID · IoT Asset & Archive Monitor',
    shortLabel: 'SmartRFID IoT',
    category: 'Pre-AI Hand-Crafted (2021–2025)',
    href: '/apps/rfid-iot-monitor/',
    stackTag: 'Vue 2 · WebSocket · Spring',
    isOriginal: true,
  },
  {
    id: 'sbupnet-lab',
    era: 'pre-ai',
    period: '2024.11 – 2025.08',
    label: 'SBUPNet · IEEE SMC 2026 Benchmark Lab',
    shortLabel: 'SBUPNet (IEEE ’26)',
    category: 'Pre-AI Hand-Crafted (2021–2025)',
    href: '#/demos/ai-lab',
    stackTag: 'PyTorch · 76.5% mIoU',
    sandboxId: 'ai-lab',
    isOriginal: false,
  },

  // ================= AI-ASSISTED ERA (2026) =================
  {
    id: 'webgis-workbench',
    era: 'ai-era',
    period: '2026.10',
    label: 'WebGIS One-Map Workbench',
    shortLabel: 'WebGIS One-Map',
    category: 'AI-Era Geospatial & Data (2026)',
    href: '/apps/webgis-workbench/',
    stackTag: 'React · OL 10 · Turf',
    isOriginal: true,
  },
  {
    id: 'blue-carbon',
    era: 'ai-era',
    period: '2026.09 – 2026.10',
    label: 'Coastal Blue Carbon Platform',
    shortLabel: 'Blue Carbon (Vue 3)',
    category: 'AI-Era Geospatial & Data (2026)',
    href: '/apps/blue-carbon/',
    stackTag: 'Vue 3 · MapLibre GL',
    isOriginal: true,
  },
  {
    id: 'hydrology-dashboard',
    era: 'ai-era',
    period: '2026.07 – 2026.10',
    label: 'Multi-Source Hydrology Platform',
    shortLabel: 'Hydrology (3-View)',
    category: 'AI-Era Geospatial & Data (2026)',
    href: '/apps/hydrology-dashboard/',
    stackTag: 'Big Screen · Query Web',
    isOriginal: true,
  },
  {
    id: 'open-data-portal',
    era: 'ai-era',
    period: '2026.09 – 2026.11',
    label: 'OceanData Open Data Portal',
    shortLabel: 'OceanData Portal',
    category: 'AI-Era Geospatial & Data (2026)',
    href: '/apps/open-data-portal/',
    stackTag: 'Three.js Globe · OL',
    isOriginal: true,
  },
  {
    id: 'data-share-admin',
    era: 'ai-era',
    period: '2026.09 – 2026.11',
    label: 'DataHub Admin & RBAC Console',
    shortLabel: 'DataHub Admin',
    category: 'AI-Era Geospatial & Data (2026)',
    href: '/apps/data-share-admin/',
    stackTag: 'AntD · ApexCharts',
    isOriginal: true,
  },
  {
    id: 'salon-admin',
    era: 'ai-era',
    period: '2026.11',
    label: 'Salon SaaS · Desktop Admin',
    shortLabel: 'PC Admin',
    category: 'AI-Era Salon 4-Terminal SaaS (2026)',
    href: '/apps/salon-admin/',
    stackTag: 'React 19 · EOD · RBAC',
    isOriginal: true,
  },
  {
    id: 'salon-pos',
    era: 'ai-era',
    period: '2026.11',
    label: 'Salon SaaS · Mobile Cashier POS',
    shortLabel: 'Mobile POS',
    category: 'AI-Era Salon 4-Terminal SaaS (2026)',
    href: '/apps/salon-admin/#/mobile',
    stackTag: 'Direct-QR · Wallet',
    isOriginal: true,
  },
  {
    id: 'salon-customer',
    era: 'ai-era',
    period: '2026.11',
    label: 'Salon SaaS · Customer Mini-App H5',
    shortLabel: 'Customer H5',
    category: 'AI-Era Salon 4-Terminal SaaS (2026)',
    href: '/apps/salon-customer/',
    stackTag: 'UniApp H5 · Synced',
    isOriginal: true,
  },
  {
    id: 'salon-barber',
    era: 'ai-era',
    period: '2026.11',
    label: 'Salon SaaS · Barber Workbench H5',
    shortLabel: 'Barber H5',
    category: 'AI-Era Salon 4-Terminal SaaS (2026)',
    href: '/apps/salon-barber/',
    stackTag: 'UniApp H5 · Synced',
    isOriginal: true,
  },
  {
    id: 'sound-ai',
    era: 'ai-era',
    period: '2026.10',
    label: 'Sound-AI Bio-Acoustic Platform',
    shortLabel: 'Sound-AI Studio',
    category: 'AI-Era Audio & DevTools (2026)',
    href: '/apps/sound-ai/',
    stackTag: 'React 19 · WAV Canvas',
    isOriginal: true,
  },
  {
    id: 'devtools-sandbox',
    era: 'ai-era',
    period: '2026.10 – 2026.11',
    label: 'ai-file-lock & qa-cli Simulator',
    shortLabel: 'FileLock & QA CLI',
    category: 'AI-Era Audio & DevTools (2026)',
    href: '#/demos/devtools',
    stackTag: 'FUSE · Playwright QA',
    sandboxId: 'devtools',
    isOriginal: false,
  },
];

export const LIVE_APP_GROUPS: LiveAppCategory[] = [
  'Pre-AI Hand-Crafted (2021–2025)',
  'AI-Era Geospatial & Data (2026)',
  'AI-Era Salon 4-Terminal SaaS (2026)',
  'AI-Era Audio & DevTools (2026)',
];

const ZH_APP_OVERRIDES: Record<string, { label: string; shortLabel: string; stackTag: string }> = {
  'marine-terrain-3d': {
    label: '三维海洋地形与水深分析工作台',
    shortLabel: '三维海洋地形 3D',
    stackTag: 'Vue 3 · Mars3D / CesiumJS',
  },
  'typhoon-center': {
    label: '热带气旋智能监测与可视化大屏',
    shortLabel: '台风态势大屏',
    stackTag: 'Vue 2 · DataV · 粒子风场',
  },
  'rfid-iot-monitor': {
    label: 'SmartRFID · 物联网资产与档案监控',
    shortLabel: 'SmartRFID 监控',
    stackTag: 'Vue 2 · WebSocket · Spring',
  },
  'sbupnet-lab': {
    label: 'SBUPNet · IEEE SMC 2026 基准台',
    shortLabel: 'SBUPNet 论文台',
    stackTag: 'PyTorch · 76.5% mIoU',
  },
  'webgis-workbench': {
    label: 'WebGIS 一张图工作台',
    shortLabel: 'WebGIS 一张图',
    stackTag: 'React · OL 10 · Turf',
  },
  'blue-carbon': {
    label: '海岸带蓝碳数据平台',
    shortLabel: '蓝碳平台 (Vue 3)',
    stackTag: 'Vue 3 · MapLibre GL',
  },
  'hydrology-dashboard': {
    label: '多源水文监测平台 (三视图)',
    shortLabel: '水文平台 (三端)',
    stackTag: '公网大屏 · 站点 · 查询',
  },
  'open-data-portal': {
    label: 'OceanData 开放数据门户',
    shortLabel: '海洋开放门户',
    stackTag: 'Three.js 地球 · OL',
  },
  'data-share-admin': {
    label: 'DataHub 审批与文件后台',
    shortLabel: 'DataHub 后台',
    stackTag: 'AntD · ApexCharts',
  },
  'salon-admin': {
    label: '美发 SaaS · PC 管理后台',
    shortLabel: 'PC 管理端',
    stackTag: 'React 19 · 对账 · RBAC',
  },
  'salon-pos': {
    label: '美发 SaaS · 移动收银台 POS',
    shortLabel: '移动收银',
    stackTag: '0费率码 · 双账本',
  },
  'salon-customer': {
    label: '美发 SaaS · 顾客端 H5',
    shortLabel: '顾客端 H5',
    stackTag: 'UniApp H5 · 实时同步',
  },
  'salon-barber': {
    label: '美发 SaaS · 发型师工作台',
    shortLabel: '发型师端',
    stackTag: 'UniApp H5 · 提成同步',
  },
  'sound-ai': {
    label: 'Sound-AI 生物声学标注平台',
    shortLabel: 'Sound-AI 声学',
    stackTag: 'React 19 · 声谱 Canvas',
  },
  'devtools-sandbox': {
    label: 'ai-file-lock 与 qa-cli 沙盒',
    shortLabel: '文件锁 & QA 沙盒',
    stackTag: 'FUSE · Playwright QA',
  },
};

export function getLiveApps(lang: Lang): LiveAppEntry[] {
  if (lang === 'en') return LIVE_APPS;
  return LIVE_APPS.map((app) => ({
    ...app,
    ...(ZH_APP_OVERRIDES[app.id] ?? {}),
  }));
}

export function getLiveAppGroupLabel(group: LiveAppCategory, lang: Lang): string {
  if (lang === 'en') return group;
  switch (group) {
    case 'Pre-AI Hand-Crafted (2021–2025)':
      return '前 AI 时代 · 纯手搓基础工程 (2021–2025)';
    case 'AI-Era Geospatial & Data (2026)':
      return 'AI 时代 · 空间地理与数据平台 (2026)';
    case 'AI-Era Salon 4-Terminal SaaS (2026)':
      return 'AI 时代 · 美发四端商业 SaaS (2026)';
    case 'AI-Era Audio & DevTools (2026)':
      return 'AI 时代 · 声学标注与系统工具 (2026)';
  }
}
