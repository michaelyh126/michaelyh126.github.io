import type { Lang } from '../i18n/LanguageContext';

export interface PlatformLink {
  id: 'upwork' | 'fiverr' | 'wellfound' | 'linkedin' | 'github';
  label: string;
  handle: string;
  /** Leave empty ('') until your profile is live; the UI automatically falls back to a clean direct-contract mailto flow. */
  url: string;
  note: string;
}

export interface ProfileConfig {
  name: string;
  handle: string;
  role: string;
  shortRole: string;
  headline: string;
  subheadline: string;
  availabilityBadge: string;
  location: string;
  timezone: string;
  timezoneOverlap: string;
  responseTime: string;
  /**
   * Direct contact email (no personal phone number exposed).
   * TIP: Replace with a dedicated international Gmail or custom-domain email (e.g. hello@haoyang.dev) before public launch.
   */
  email: string;
  githubUrl: string;
  platforms: PlatformLink[];
  credibilityMetrics: {
    value: string;
    label: string;
    detail: string;
  }[];
}

/**
 * ============================================================================
 * CENTRALIZED PROFILE & LINK CONFIGURATION (English default + Chinese support)
 * Update your Email, Upwork, Fiverr, Wellfound, or LinkedIn URLs here once,
 * and every CTA, Contact card, Navigation link, and Resume header updates.
 * ============================================================================
 */
export const PROFILE: ProfileConfig = {
  name: 'Hao Yang',
  handle: 'michaelyh126',
  role: 'Geospatial & Full-Stack Systems Engineer',
  shortRole: 'WebGIS · Telemetry · Full-Stack SaaS',
  headline: 'Engineering precision WebGIS studios, real-time data platforms & production SaaS.',
  subheadline:
    'M.S. Computer Science candidate & IEEE SMC 2026 first author. I help climate-tech, logistics, research, and SaaS teams ship interactive OpenLayers geospatial apps, high-density time-series pipelines, and full-stack products backed by automated Playwright video QA.',
  availabilityBadge: 'Available for Remote Contracts & Freelance · UTC+8 Async-Friendly',
  location: 'Shanghai, China',
  timezone: 'UTC+8 (Asia/Shanghai)',
  timezoneOverlap: 'Daily live overlap with EU mornings (CET/GMT) & US West Coast evenings (PST)',
  responseTime: '< 12h response time',
  email: '1114952126@qq.com',
  githubUrl: 'https://github.com/michaelyh126',
  platforms: [
    {
      id: 'github',
      label: 'GitHub',
      handle: '@michaelyh126',
      url: 'https://github.com/michaelyh126',
      note: 'Open-source systems, multi-terminal SaaS & verification suites',
    },
    {
      id: 'upwork',
      label: 'Upwork',
      handle: 'Hourly & Fixed Milestones',
      url: '', // <-- Paste your Upwork profile URL here, e.g. 'https://www.upwork.com/freelancers/~01...'
      note: 'Escrow-protected contracts for WebGIS, FastAPI & React SaaS',
    },
    {
      id: 'fiverr',
      label: 'Fiverr',
      handle: 'Scoped Productized Gigs',
      url: '', // <-- Paste your Fiverr profile URL here, e.g. 'https://www.fiverr.com/...'
      note: 'Rapid OpenLayers maps, GeoTIFF pipelines & MVP sprints',
    },
    {
      id: 'wellfound',
      label: 'Wellfound',
      handle: 'Remote Startup Roles',
      url: '', // <-- Paste your Wellfound profile URL here, e.g. 'https://wellfound.com/u/...'
      note: 'Contract-to-hire & founding geospatial/full-stack engineering',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'Hao Yang · CS M.S.',
      url: '', // <-- Paste your LinkedIn profile URL here, e.g. 'https://www.linkedin.com/in/...'
      note: 'Publications, background & direct executive outreach',
    },
  ],
  credibilityMetrics: [
    {
      value: 'M.S. CS',
      label: 'Shanghai Ocean Univ. (2027)',
      detail: 'B.Eng. Spatial Info & Digital Tech',
    },
    {
      value: 'IEEE SMC ’26',
      label: 'First Author · SBUPNet',
      detail: '76.5% mIoU @ 9.49 FPS (Inria)',
    },
    {
      value: '18 Sources',
      label: '~25,000 Stations Shipped',
      detail: 'TimescaleDB + FastAPI Telemetry',
    },
    {
      value: '128-Proc',
      label: 'Author · ai-file-lock',
      detail: 'FUSE / WinFsp Concurrency Guard',
    },
  ],
};

export function getProfile(lang: Lang): ProfileConfig {
  if (lang === 'en') return PROFILE;

  return {
    ...PROFILE,
    name: '杨昊 · Hao Yang',
    role: 'WebGIS 空间信息与全栈系统工程师',
    shortRole: 'WebGIS · 时序数据 · 全栈 SaaS',
    headline: '专注高精度 WebGIS 工作台、实时数据平台与可验证的全栈 SaaS 工程。',
    subheadline:
      '计算机科学与技术硕士在读，IEEE SMC 2026 第一作者。长期面向科研机构、气候科技、物流与商业团队交付交互式 OpenLayers / MapLibre 地图应用、高密度时序监测平台及配套 Playwright 录屏 E2E 验收的全栈系统。',
    availabilityBadge: '开放远程合同与项目合作 · UTC+8 支持全球异步协作',
    location: '中国 · 上海',
    timezone: 'UTC+8 (北京时间)',
    timezoneOverlap: '每日可与欧洲上午 (CET/GMT) 及美西傍晚 (PST) 实时沟通',
    responseTime: '12 小时内响应',
    platforms: PROFILE.platforms.map((p) => {
      const zhMap: Record<PlatformLink['id'], { handle: string; note: string }> = {
        github: {
          handle: '@michaelyh126',
          note: '个人主页、9 大实景演示前端入口与自动化测试实践',
        },
        upwork: {
          handle: '按小时或里程碑托管',
          note: '适合海外 WebGIS、FastAPI 与 React 全栈合同项目',
        },
        fiverr: {
          handle: '标准化短周期交付',
          note: 'OpenLayers 地图组件、GeoTIFF 切片流水线与 MVP 快启',
        },
        wellfound: {
          handle: '远程初创团队合作',
          note: '适合远程空间信息与全栈工程顾问或长期合同',
        },
        linkedin: {
          handle: 'Hao Yang · 计算机硕士',
          note: '学术论文成果、工程履历与商务直连',
        },
      };
      return {
        ...p,
        handle: zhMap[p.id].handle,
        note: zhMap[p.id].note,
      };
    }),
    credibilityMetrics: [
      {
        value: 'CS 硕士',
        label: '上海海洋大学 (2027 届)',
        detail: '本科：空间信息与数字技术',
      },
      {
        value: 'IEEE SMC ’26',
        label: '第一作者 · SBUPNet',
        detail: 'Inria 76.5% mIoU @ 9.49 FPS',
      },
      {
        value: '18 数据源',
        label: '约 2.5 万站点落地',
        detail: 'TimescaleDB + FastAPI 时序平台',
      },
      {
        value: '128 并发',
        label: '作者 · ai-file-lock',
        detail: 'FUSE / WinFsp 挂载并发保护',
      },
    ],
  };
}

export function getPlatformHref(platform: PlatformLink): {
  href: string;
  isExternal: boolean;
} {
  if (platform.url && platform.url.trim().length > 0) {
    return { href: platform.url.trim(), isExternal: true };
  }
  const subject = encodeURIComponent(`Remote Project Inquiry (${platform.label} / Direct)`);
  const body = encodeURIComponent(
    `Hi Hao,\n\nI saw your portfolio and would like to discuss a project (WebGIS / Data Platform / Full-Stack SaaS).\n\nScope & timeline:\n`
  );
  return {
    href: `mailto:${PROFILE.email}?subject=${subject}&body=${body}`,
    isExternal: false,
  };
}
