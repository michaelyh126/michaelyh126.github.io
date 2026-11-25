import type { ReactNode } from 'react';
import { ArrowLeft, FlaskConical, Moon, Sun, Send } from 'lucide-react';
import { DEMO_CATALOG, getDemoMeta, type DemoId } from '../demos/registry';
import { useLanguage } from '../i18n/LanguageContext';

interface DemoShellProps {
  activeDemo: DemoId;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onExitToPortfolio: (scrollSection?: string) => void;
  onSelectDemo: (id: DemoId) => void;
  children: ReactNode;
}

const DEMO_TITLES: Record<DemoId, { en: string; zh: string; shortEn: string; shortZh: string }> = {
  devtools: {
    en: 'ai-file-lock Concurrency Sandbox & qa-cli Report Viewer',
    zh: 'ai-file-lock 并发沙盒与 qa-cli 验收报告',
    shortEn: 'DevTools Sandbox',
    shortZh: '文件锁 & QA',
  },
  'ai-lab': {
    en: 'SBUPNet (IEEE SMC ’26) Lab & Acoustic Spectrogram Studio',
    zh: 'SBUPNet (IEEE SMC ’26) 论文基准与声谱标注台',
    shortEn: 'SBUPNet AI Lab',
    shortZh: 'SBUPNet 论文台',
  },
  webgis: {
    en: 'WebGIS Swipe Compare Lab (OpenLayers 10)',
    zh: 'WebGIS 卷帘对比实验台 (OpenLayers 10)',
    shortEn: 'WebGIS Swipe',
    shortZh: 'WebGIS 卷帘',
  },
  salon: {
    en: 'Atelier Nova — 4-Terminal Salon SaaS Sandbox',
    zh: 'Atelier Nova — 多端美发商业 SaaS 沙盒',
    shortEn: 'Salon SaaS',
    shortZh: '美发四端',
  },
  hydrology: {
    en: 'Multi-Source Hydrology Surge Simulator',
    zh: '多源水文风暴潮模拟沙盒',
    shortEn: 'Hydrology Sim',
    shortZh: '水文沙盒',
  },
  'data-portal': {
    en: 'Open Research DataHub Sandbox',
    zh: '开放科研数据门户沙盒',
    shortEn: 'DataHub Sim',
    shortZh: '数据门户',
  },
};

const PRIMARY_SANDBOX_TABS: DemoId[] = ['devtools', 'ai-lab'];

export function DemoShell({
  activeDemo,
  theme,
  onToggleTheme,
  onExitToPortfolio,
  onSelectDemo,
  children,
}: DemoShellProps) {
  const { lang, setLang, bi } = useLanguage();
  const meta = getDemoMeta(activeDemo);
  const titleEntry = DEMO_TITLES[activeDemo];
  const displayTitle = titleEntry ? (lang === 'zh' ? titleEntry.zh : titleEntry.en) : meta.title;
  const isPrimarySandbox = PRIMARY_SANDBOX_TABS.includes(activeDemo);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-obsidian-950 dark:text-slate-100">
      {/* Crisp Single-Row Sticky Demo Bar — zero overflow & full desktop h1 visibility */}
      <header className="sticky top-0 z-40 h-14 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-obsidian-950/95">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5">
          {/* Left: Back + Full Title */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <button
              type="button"
              onClick={() => onExitToPortfolio()}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300/80 bg-white px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{bi('Portfolio', '返回主页')}</span>
            </button>

            <div className="hidden h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-800 sm:block" />

            <h1 className="min-w-0 truncate font-display text-sm font-bold text-slate-950 dark:text-white sm:text-[15px]">
              {displayTitle}
            </h1>

            <span className="hidden shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-700 dark:text-amber-300 2xl:inline-flex">
              <FlaskConical className="h-3 w-3 shrink-0" />
              <span>{bi('100% Synthetic Data', '100% 合成数据')}</span>
            </span>
          </div>

          {/* Right: Compact 2-Tab Sandbox Switcher + EN/中文 + Theme + Hire */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Desktop 2-Tab Primary Sandbox Switcher (zero multi-line wrap!) */}
            {isPrimarySandbox ? (
              <div
                className="hidden shrink-0 items-center gap-1 rounded-lg border border-slate-200/90 bg-slate-100/90 p-0.5 dark:border-slate-800 dark:bg-obsidian-900 lg:inline-flex"
                role="tablist"
                aria-label="Switch interactive sandbox"
              >
                {PRIMARY_SANDBOX_TABS.map((id) => {
                  const active = id === activeDemo;
                  const entry = DEMO_TITLES[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => onSelectDemo(id)}
                      className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold leading-none ${
                        active
                          ? 'bg-cyan-600 text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                      }`}
                    >
                      {lang === 'zh' ? entry.shortZh : entry.shortEn}
                    </button>
                  );
                })}
              </div>
            ) : (
              <select
                value={activeDemo}
                onChange={(e) => onSelectDemo(e.target.value as DemoId)}
                aria-label="Switch sandbox"
                className="hidden shrink-0 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-[11px] font-semibold text-slate-800 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-100 lg:block"
              >
                {DEMO_CATALOG.map((demo) => {
                  const entry = DEMO_TITLES[demo.id];
                  return (
                    <option key={demo.id} value={demo.id}>
                      {lang === 'zh' ? entry.shortZh : entry.shortEn}
                    </option>
                  );
                })}
              </select>
            )}

            {/* Mobile / Tablet Compact Switcher */}
            <select
              value={activeDemo}
              onChange={(e) => onSelectDemo(e.target.value as DemoId)}
              aria-label="Switch sandbox"
              className="max-w-[138px] shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-mono text-[11px] font-semibold text-slate-800 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-100 lg:hidden"
            >
              {DEMO_CATALOG.map((demo) => {
                const entry = DEMO_TITLES[demo.id];
                return (
                  <option key={demo.id} value={demo.id}>
                    {lang === 'zh' ? entry.shortZh : entry.shortEn}
                  </option>
                );
              })}
            </select>

            {/* Compact EN | 中文 Toggle */}
            <div
              className="inline-flex shrink-0 items-center rounded-lg border border-slate-300/80 bg-slate-100/90 p-0.5 font-mono text-[11px] font-bold dark:border-slate-700/80 dark:bg-obsidian-900"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`shrink-0 whitespace-nowrap rounded-md px-2 py-1 leading-none ${
                  lang === 'en'
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('zh')}
                className={`shrink-0 whitespace-nowrap rounded-md px-2 py-1 leading-none ${
                  lang === 'zh'
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                中文
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-300/80 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-300 dark:hover:border-cyan-400"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => onExitToPortfolio('contact')}
              className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 sm:inline-flex"
            >
              <Send className="h-3.5 w-3.5 shrink-0" />
              <span>{bi('Hire Me', '联系合作')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Demo Canvas */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
