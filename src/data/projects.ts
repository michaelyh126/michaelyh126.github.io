import type { DemoId } from '../demos/registry';
import type { Lang } from '../i18n/LanguageContext';

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

export function getProjectCategoryLabel(cat: 'All' | ProjectCategory, lang: Lang): string {
  if (lang === 'en') return cat;
  switch (cat) {
    case 'All':
      return '全部';
    case 'WebGIS & Data':
      return 'WebGIS 与数据';
    case 'Full-Stack SaaS':
      return '全栈 SaaS';
    case 'AI & Systems':
      return 'AI 与系统工程';
  }
}

export const PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'webgis-workbench',
    primaryLink: {
      label: 'Launch Original WebGIS App',
      href: '/apps/webgis-workbench/',
    },
    extraLinks: [{ label: 'Swipe Compare Lab', href: '#/demos/webgis', sandboxId: 'webgis' }],
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
    extraLinks: [{ label: 'Surge Sim Sandbox', href: '#/demos/hydrology', sandboxId: 'hydrology' }],
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
    extraLinks: [{ label: 'DataHub Admin Console', href: '/apps/data-share-admin/' }],
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
    extraLinks: [{ label: 'SBUPNet IEEE SMC ’26 Lab', href: '#/demos/ai-lab', sandboxId: 'ai-lab' }],
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

const ZH_PROJECTS: Record<string, Partial<ProjectCaseStudy>> = {
  'webgis-workbench': {
    primaryLink: { label: '打开原始 WebGIS 应用', href: '/apps/webgis-workbench/' },
    extraLinks: [{ label: '卷帘对比实验台', href: '#/demos/webgis', sandboxId: 'webgis' }],
    repoStatus: '原始生产前端上线 · 100% 合成演示数据',
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
  'blue-carbon': {
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
  'hydrology-dashboard': {
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
  'salon-system': {
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
  'open-datahub': {
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
  'sound-ai-sbupnet': {
    primaryLink: { label: '打开原始 Sound-AI 应用', href: '/apps/sound-ai/' },
    extraLinks: [{ label: 'SBUPNet 论文实验台', href: '#/demos/ai-lab', sandboxId: 'ai-lab' }],
    repoStatus: '原始 React 19 应用 + IEEE SMC 2026 实验台',
    title: 'Sound-AI 生物声学标注平台与 SBUPNet (IEEE SMC ’26)',
    subtitle: 'React 19 自定义 Canvas 声谱图 + 合成 WAV · 超高分辨率遥感语义分割',
    badge: '原始应用 + IEEE ’26',
    summary:
      '采用 React 19 与高性能 Canvas 声谱图引擎构建的原始生物声学标注平台（内置 3 段合成 WAV 与 LOD1 声谱图），并结合本人 IEEE SMC 2026 一作论文 SBUPNet 超高分辨率语义分割研究（76.5% mIoU @ 9.49 FPS）。',
    metrics: [
      { label: 'Inria Aerial', value: '76.5% mIoU' },
      { label: '推理速度', value: '9.49 FPS' },
      { label: '显存与耗时', value: '降低 35%' },
    ],
    architecture: [
      'Sound-AI 原始前端 (/apps/sound-ai/)：React 19 自定义 Canvas LOD1 声谱渲染器，支持拉框标注、缩放平移与 3 段合成 WAV 音频同步播放。',
      'SBUPNet (IEEE SMC 2026 一作 · #/demos/ai-lab)：基于像素不确定性引导的轻量化双分支网络，仅对高熵边界区域执行高分辨率细化。',
      '跨 Inria、DeepGlobe、CRAG、MonuSeg 四大基准分析梯度方差与样本组织优化机理。',
    ],
    challengesSolved: [
      '在 Inria Aerial 上达到 76.5% mIoU 与 9.49 FPS，相比 ISDNet 吞吐提升约 20%，训练时长与峰值显存降低约 35%。',
      '实现 60fps 浏览器端 Canvas 声谱绘制、Web Audio 播放同步及精确时频坐标标注导出。',
      '将全部音频与声谱替换为 100% 数学合成 WAV 与 LOD1 演示数据，零隐私风险。',
    ],
  },
  'ai-file-lock-qa': {
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
