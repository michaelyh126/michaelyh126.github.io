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
 * CENTRALIZED PROFILE & LINK CONFIGURATION
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
      label: 'OS Author · ai-file-lock',
      detail: 'FUSE / WinFsp Concurrency Guard',
    },
  ],
};

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
