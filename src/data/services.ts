import type { Lang } from '../i18n/LanguageContext';

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
      'Custom browser-native geospatial applications built with OpenLayers, MapLibre GL, or Leaflet—engineered for smooth raster pyramids, clean coordinate math, and real spatial analysis tools.',
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
      'MapLibre GL',
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
      'Vue 3 / Pinia',
      'TypeScript',
      'Tailwind CSS',
      'FastAPI',
      'Express / Node.js',
      'Spring Boot 3 / Java 21',
      'PostgreSQL / TimescaleDB',
      'MySQL',
      'Redis',
      'ECharts / Three.js',
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
      'Canvas Audio Annotation',
      'Model Benchmarking',
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

export function getServices(lang: Lang): ServiceOffering[] {
  if (lang === 'en') return SERVICES;
  return [
    {
      ...SERVICES[0],
      tier: '方向 01 · 空间地理 WebGIS',
      title: '交互式 WebGIS 与地图系统定制',
      priceRange: '$1,200 起',
      timeline: '1 – 3 周',
      idealFor: '气候科技、海洋科研、智慧农业、物流与环保团队',
      description:
        '基于 OpenLayers 10、MapLibre GL 或 Leaflet 定制浏览器原生空间应用，解决栅格切片投影精度、海量矢量交互与专业空间分析工具落地。',
      deliverables: [
        '交互式一张图工作台（图层目录、过滤、卷帘对比、球面量测）',
        'GeoTIFF / Shapefile / GeoJSON 清洗与 Web Mercator 切片管线',
        '联动时序监测图表、属性检视器与桌面/移动端响应式 UI',
        '整洁 TypeScript 源码 + 自动化 Playwright 视觉验收视频',
      ],
    },
    {
      ...SERVICES[1],
      tier: '方向 02 · 实时数据工程',
      title: '多源时序监测与数据大屏平台',
      priceRange: '$1,500 起',
      timeline: '2 – 4 周',
      idealFor: '物联网站网、水文气象观测、能源与实时数据分析团队',
      description:
        '依托 FastAPI、PostgreSQL / TimescaleDB、Redis 与 ECharts / React 打造高可靠多源采集流水线与亚秒级响应监测看板。',
      deliverables: [
        '多源定时/流式采集器，支持 schema 校验、断点重试与异常告警',
        'TimescaleDB 超表建模、索引优化与 REST / WebSocket 接口',
        '管理层监测大屏、阈值告警机制与服务健康诊断',
        '生产级 Docker / Nginx / systemd 部署手册与完整源码移交',
      ],
    },
    {
      ...SERVICES[2],
      tier: '方向 03 · 商业产品工程',
      title: '全栈 SaaS MVP + 自动化录屏 QA',
      priceRange: '$2,000 起',
      timeline: '2 – 5 周',
      idealFor: '需要快速上线商业 SaaS、门户后台或 AI 工具的创业团队',
      description:
        '从数据库建模到 HTTPS 生产部署的一站式交付，采用 React 19、TypeScript、Express / FastAPI / Spring Boot 与 RBAC 权限安全体系。',
      deliverables: [
        '多角色 React + TypeScript 前端（桌面管理后台 + 移动 H5 端）',
        '安全加固 REST API、RBAC 权限审计、账本流水与 SQL 迁移脚本',
        '每个里程碑配套 Playwright + FFmpeg 自动化 E2E 录屏验收',
        '100% 源码归属权、完善开发文档与零供应商锁定',
      ],
    },
  ];
}

export function getDeliverySteps(lang: Lang) {
  if (lang === 'en') return DELIVERY_STEPS;
  return [
    {
      step: '01',
      title: '架构设计与清晰范围',
      desc: '24 小时内输出书面技术方案、数据结构与里程碑计划，编码前消除需求歧义。',
    },
    {
      step: '02',
      title: '每周可测预发构建',
      desc: '提供异步视频进展与在线测试链接，跨时区客户也可随时直观检视真实进度。',
    },
    {
      step: '03',
      title: '自动化视频 E2E 验收',
      desc: '每个里程碑均附带 Playwright 回归断言与 MP4 演示录屏证据，拒绝口头承诺。',
    },
    {
      step: '04',
      title: '整洁源码与部署移交',
      desc: '完整 Git 仓库、可复现构建脚本、上线部署文档及交付后稳定维护窗口。',
    },
  ];
}

export function getStackMatrix(lang: Lang): StackGroup[] {
  if (lang === 'en') return STACK_MATRIX;
  return [
    { ...STACK_MATRIX[0], category: '空间地理与 WebGIS', subtitle: '地图渲染、坐标投影与栅格切片' },
    { ...STACK_MATRIX[1], category: '全栈与实时数据', subtitle: 'Web 应用、后端接口与时序存储' },
    { ...STACK_MATRIX[2], category: 'AI 与计算机视觉', subtitle: '学术研究与高分辨率模型推理' },
    { ...STACK_MATRIX[3], category: '系统、运维与 QA', subtitle: '并发可靠、生产部署与自动测试' },
  ];
}

export function getCredentials(lang: Lang): CredentialItem[] {
  if (lang === 'en') return CREDENTIALS;
  return [
    {
      period: '2024.09 – 2027.06',
      role: '计算机科学与技术 · 硕士研究生',
      organization: '上海海洋大学',
      location: '中国 · 上海',
      tag: '研究生科研',
      highlights: [
        '研究方向：计算机视觉、超高分辨率 (UHR) 遥感影像语义分割与实时推理加速。',
        'IEEE SMC 2026 录用论文 SBUPNet 第一作者：Inria Aerial 达 76.5% mIoU @ 9.49 FPS，相较 ISDNet 吞吐提升约 20%，训练时长及峰值显存降低约 35%。',
      ],
    },
    {
      period: '2025 – 2026',
      role: '科研数据平台与 WebGIS 全栈开发（实习）',
      organization: '华东师范大学 · 科研平台开发与网站维护',
      location: '中国 · 上海',
      tag: '生产平台落地',
      highlights: [
        '参与蓝碳 WebGIS 平台（Vue 3 / FastAPI）开发与地图联调，定位旧切片投影偏移并按 Web Mercator 重建 8 个年份 GeoTIFF 切片（Z6–Z11）。',
        '参与多源水文平台开发，基于 PostgreSQL / TimescaleDB 接入 NOAA、ISD、METAR 等 18 个来源、约 2.5 万条站点记录并交付监测大屏。',
        '借助 AI 编写 CMS 批处理管线，整理 4,207 篇文章源码并完成 724 篇格式重构与回读校验，负责 Linux / Nginx / systemd 部署运维。',
      ],
    },
    {
      period: '2020.09 – 2024.06',
      role: '空间信息与数字技术 · 工学学士',
      organization: '上海海洋大学',
      location: '中国 · 上海',
      tag: '空间信息基础',
      highlights: [
        '系统掌握 GIS 空间算法、空间数据库、遥感原理、地图投影与全栈软件工程。',
        '使用 Python、ArcPy 与 Flask 构建智慧农业 Shapefile / TIFF 自动化地图服务发布接口。',
        '资质证书：大学英语六级 (CET-6) · 上海市高等学校信息技术水平考试优秀证书。',
      ],
    },
  ];
}
