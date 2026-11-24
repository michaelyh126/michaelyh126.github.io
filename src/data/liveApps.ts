import type { DemoId } from '../demos/registry';
import type { Lang } from '../i18n/LanguageContext';

export type LiveAppCategory =
  | 'Geospatial & Data'
  | 'Salon 4-Terminal SaaS'
  | 'AI, Audio & Systems';

export interface LiveAppEntry {
  id: string;
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

export const LIVE_APP_GROUPS: LiveAppCategory[] = [
  'Geospatial & Data',
  'Salon 4-Terminal SaaS',
  'AI, Audio & Systems',
];

const ZH_APP_OVERRIDES: Record<string, { label: string; shortLabel: string; stackTag: string }> = {
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
  'sbupnet-lab': {
    label: 'SBUPNet (IEEE SMC ’26) 基准台',
    shortLabel: 'SBUPNet 论文实验',
    stackTag: '76.5% mIoU · 9.49 FPS',
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
    case 'Geospatial & Data':
      return '空间地理与实时数据（原始前端）';
    case 'Salon 4-Terminal SaaS':
      return '美发四端商业 SaaS（实时联动）';
    case 'AI, Audio & Systems':
      return 'AI 声学标注与系统工具沙盒';
  }
}
