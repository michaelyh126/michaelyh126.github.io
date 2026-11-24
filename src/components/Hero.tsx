import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Play,
  Terminal,
  Video,
} from 'lucide-react';
import { PROFILE } from '../data/profile';
import { LIVE_APPS } from '../data/liveApps';
import type { DemoId } from '../demos/registry';

interface HeroProps {
  onOpenResume: () => void;
  onLaunchDemo: (id: DemoId) => void;
}

export function Hero({ onOpenResume, onLaunchDemo }: HeroProps) {
  const geoAndAiApps = LIVE_APPS.filter(
    (a) => a.category === 'Geospatial & Data' || a.id === 'sound-ai'
  );
  const salonApps = LIVE_APPS.filter((a) => a.category === 'Salon 4-Terminal SaaS');
  const cliSandboxes = LIVE_APPS.filter((a) => !a.isOriginal);

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-slate-200/80 bg-geo-grid dark:border-slate-800/80"
    >
      <div className="pointer-events-none absolute inset-0 bg-geo-radial" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Main Narrative */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>{PROFILE.availabilityBadge}</span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-[3.35rem]">
              {PROFILE.headline}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {PROFILE.subheadline}
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-glow hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Explore 9 Live Production Apps</span>
                <ArrowDownRight className="h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/95 px-5 py-3 text-sm font-semibold text-slate-900 hover:border-cyan-500/60 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-850/95 dark:text-white dark:hover:border-cyan-400/60 dark:hover:text-cyan-300"
              >
                <span>Book / Discuss a Project</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200/60 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
              >
                <FileText className="h-4 w-4" />
                <span>Inspect 1-Page CV</span>
              </button>
            </div>
          </div>

          {/* Right Live Production Apps Quick-Launcher Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-panel backdrop-blur-md dark:border-slate-800 dark:bg-obsidian-900/95 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <Terminal className="h-4 w-4 text-cyan-500" />
                  <span>LIVE_PRODUCTION_APPS (9)</span>
                </div>
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  100% Synthetic
                </span>
              </div>

              {/* Geospatial, Data & Sound-AI Original Apps */}
              <div className="mt-3.5 grid grid-cols-2 gap-2">
                {geoAndAiApps.map((app) => (
                  <a
                    key={app.id}
                    href={app.href}
                    className="group flex items-center justify-between gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 px-2.5 py-2 text-left hover:border-cyan-500/60 hover:bg-cyan-500/10 dark:border-slate-800 dark:bg-obsidian-950/75 dark:hover:border-cyan-400/60"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-mono text-[11px] font-bold text-slate-900 group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-300">
                        {app.shortLabel}
                      </div>
                      <div className="truncate font-mono text-[9px] text-slate-500 dark:text-slate-400">
                        {app.stackTag}
                      </div>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-cyan-500" />
                  </a>
                ))}
              </div>

              {/* 4-Terminal Salon SaaS Strip */}
              <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-obsidian-950/60">
                <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>SALON 4-TERMINAL SAAS (LIVE SYNCED)</span>
                  <span className="text-cyan-600 dark:text-cyan-400">4 APPS</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {salonApps.map((app) => (
                    <a
                      key={app.id}
                      href={app.href}
                      className="rounded-lg border border-slate-200 bg-white px-1.5 py-1.5 text-center font-mono text-[10px] font-bold text-slate-800 hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-800 dark:bg-obsidian-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                    >
                      {app.shortLabel}
                    </a>
                  ))}
                </div>
              </div>

              {/* Interactive CLI & Research Sandboxes */}
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {cliSandboxes.map((sim) => (
                  <a
                    key={sim.id}
                    href={sim.href}
                    onClick={(e) => {
                      if (sim.sandboxId) {
                        e.preventDefault();
                        onLaunchDemo(sim.sandboxId);
                      }
                    }}
                    className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 px-2.5 py-1.5 font-mono text-[10px] font-semibold text-amber-800 hover:border-amber-500 dark:text-amber-300"
                  >
                    <span className="truncate">{sim.shortLabel}</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0" />
                  </a>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-slate-200/80 pt-3.5 dark:border-slate-800 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-obsidian-850 dark:text-slate-300">
                  <Video className="h-4 w-4 shrink-0 text-cyan-500" />
                  <span>Playwright + FFmpeg QA</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-obsidian-850 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{PROFILE.responseTime} · UTC+8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Credibility Bar */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 lg:grid-cols-4 lg:gap-4">
          {PROFILE.credibilityMetrics.map((metric) => (
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
