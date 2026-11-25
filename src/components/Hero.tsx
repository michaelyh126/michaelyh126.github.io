import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Play,
  Sparkles,
  Terminal,
  Video,
  Wrench,
} from 'lucide-react';
import { getProfile } from '../data/profile';
import { getLiveApps } from '../data/liveApps';
import { useLanguage } from '../i18n/LanguageContext';
import type { DemoId } from '../demos/registry';

interface HeroProps {
  onOpenResume: () => void;
  onLaunchDemo: (id: DemoId) => void;
}

export function Hero({ onOpenResume, onLaunchDemo }: HeroProps) {
  const { lang, bi } = useLanguage();
  const profile = getProfile(lang);
  const liveApps = getLiveApps(lang);

  const preAiApps = liveApps.filter((a) => a.era === 'pre-ai');
  const aiGeoAndAudioApps = liveApps.filter(
    (a) =>
      a.category === 'AI-Era Geospatial & Data (2026)' || a.id === 'sound-ai'
  );
  const salonApps = liveApps.filter((a) => a.category === 'AI-Era Salon 4-Terminal SaaS (2026)');
  const devToolsSim = liveApps.find((a) => a.id === 'devtools-sandbox');

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-slate-200/80 bg-geo-grid dark:border-slate-800/80"
    >
      <div className="pointer-events-none absolute inset-0 bg-geo-radial" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Main Narrative */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>{profile.availabilityBadge}</span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-[3.2rem]">
              {profile.headline}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {profile.subheadline}
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-glow hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{bi('Explore 12 Live Production Apps', '体验 12 套上线实景前端')}</span>
                <ArrowDownRight className="h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/95 px-5 py-3 text-sm font-semibold text-slate-900 hover:border-cyan-500/60 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-850/95 dark:text-white dark:hover:border-cyan-400/60 dark:hover:text-cyan-300"
              >
                <span>{bi('Book / Discuss a Project', '咨询 / 预约项目合作')}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
              >
                <FileText className="h-4 w-4" />
                <span>{bi('Inspect 1-Page CV', '查看单页英文简历')}</span>
              </button>
            </div>
          </div>

          {/* Right Dual-Era Live Production Apps Quick-Launcher Card */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-panel backdrop-blur-md dark:border-slate-800 dark:bg-obsidian-900/95 sm:p-5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <Terminal className="h-4 w-4 text-cyan-500" />
                  <span>{bi('LIVE_PRODUCTION_APPS (12)', '上线实景前端直达 (12 套)')}</span>
                </div>
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  {bi('100% Synthetic', '100% 合成数据')}
                </span>
              </div>

              {/* Pre-AI Hand-Crafted Section (2021–2025) */}
              <div className="mt-3 rounded-xl border border-amber-500/35 bg-amber-500/5 p-2.5">
                <div className="mb-2 flex items-center justify-between font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300">
                  <span className="inline-flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
                    {bi('PRE-AI HAND-CRAFTED · 2021–2025', '前 AI 时代 · 纯手搓 (2021–2025)')}
                  </span>
                  <span>{bi('3 APPS + IEEE ’26', '3 实景 + 论文')}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {preAiApps.map((app) => (
                    <a
                      key={app.id}
                      href={app.href}
                      onClick={(e) => {
                        if (app.sandboxId) {
                          e.preventDefault();
                          onLaunchDemo(app.sandboxId);
                        }
                      }}
                      className="group flex items-center justify-between gap-1 rounded-lg border border-amber-500/25 bg-white/90 px-2.5 py-1.5 text-left hover:border-amber-500 dark:bg-obsidian-950/80"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[10.5px] font-bold text-slate-900 group-hover:text-amber-700 dark:text-slate-100 dark:group-hover:text-amber-300">
                          {app.shortLabel}
                        </div>
                        <div className="truncate font-mono text-[9px] text-slate-500 dark:text-slate-400">
                          {app.stackTag}
                        </div>
                      </div>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-amber-500/70 group-hover:text-amber-500" />
                    </a>
                  ))}
                </div>
              </div>

              {/* AI-Assisted Era Section (2026) */}
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {bi('AI-ASSISTED ERA · 2026', 'AI 协同交付时代 · 2026')}
                  </span>
                  <span>{bi('9 APPS + DEVTOOLS', '9 实景 + 工具')}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {aiGeoAndAudioApps.map((app) => (
                    <a
                      key={app.id}
                      href={app.href}
                      className="group flex items-center justify-between gap-1 rounded-lg border border-slate-200/90 bg-slate-50/80 px-2.5 py-1.5 text-left hover:border-cyan-500/60 hover:bg-cyan-500/10 dark:border-slate-800 dark:bg-obsidian-950/75 dark:hover:border-cyan-400/60"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[10.5px] font-bold text-slate-900 group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-300">
                          {app.shortLabel}
                        </div>
                        <div className="truncate font-mono text-[9px] text-slate-500 dark:text-slate-400">
                          {app.stackTag}
                        </div>
                      </div>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-400 group-hover:text-cyan-500" />
                    </a>
                  ))}
                </div>

                {/* 4-Terminal Salon SaaS Strip + DevTools */}
                <div className="mt-2 rounded-lg border border-slate-200/80 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-obsidian-950/60">
                  <div className="mb-1.5 flex items-center justify-between font-mono text-[9.5px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>{bi('SALON 4-TERMINAL SAAS (SYNCED)', '美发四端 SAAS（实时联动）')}</span>
                    {devToolsSim && (
                      <a
                        href={devToolsSim.href}
                        onClick={(e) => {
                          if (devToolsSim.sandboxId) {
                            e.preventDefault();
                            onLaunchDemo(devToolsSim.sandboxId);
                          }
                        }}
                        className="inline-flex items-center gap-0.5 text-cyan-600 hover:underline dark:text-cyan-400"
                      >
                        <span>{devToolsSim.shortLabel}</span>
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {salonApps.map((app) => (
                      <a
                        key={app.id}
                        href={app.href}
                        className="rounded-md border border-slate-200 bg-white px-1 py-1 text-center font-mono text-[9.5px] font-bold text-slate-800 hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-800 dark:bg-obsidian-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                      >
                        {app.shortLabel}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-800">
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 text-[11px] text-slate-700 dark:border-slate-800 dark:bg-obsidian-850 dark:text-slate-300">
                  <Video className="h-3.5 w-3.5 shrink-0 text-cyan-500" />
                  <span className="truncate">{bi('Playwright Video QA', 'Playwright 录屏验收')}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 text-[11px] text-slate-700 dark:border-slate-800 dark:bg-obsidian-850 dark:text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span className="truncate">{profile.responseTime} · UTC+8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Credibility Bar */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 lg:grid-cols-4 lg:gap-4">
          {profile.credibilityMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-slate-200/90 bg-white/85 p-4 backdrop-blur-sm hover:border-cyan-500/40 dark:border-slate-800/90 dark:bg-obsidian-900/80"
            >
              <div className="font-mono text-lg font-bold text-cyan-700 dark:text-cyan-400 sm:text-xl">
                {metric.value}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">
                {metric.label}
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {metric.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
