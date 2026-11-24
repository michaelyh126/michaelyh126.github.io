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

const DEMO_ZH_TITLES: Record<DemoId, { shortTitle: string; title: string }> = {
  webgis: { shortTitle: 'WebGIS 卷帘', title: '交互式 WebGIS 卷帘工作台 (OpenLayers 10)' },
  salon: { shortTitle: '美发四端 SaaS', title: 'Atelier Nova — 多端美发商业 SaaS 沙盒' },
  hydrology: { shortTitle: '水文监测平台', title: '多源水文与时序监测平台 (18 模拟通道)' },
  'data-portal': { shortTitle: '开放数据门户', title: '开放科研数据门户与 DataHub 后台沙盒' },
  devtools: { shortTitle: '文件锁 & QA', title: 'ai-file-lock 并发沙盒与 qa-cli 验收报告' },
  'ai-lab': { shortTitle: 'AI 声学 & 论文', title: '生物声学声谱标注与 SBUPNet 论文基准台' },
};

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
  const displayTitle = lang === 'zh' ? DEMO_ZH_TITLES[activeDemo].title : meta.title;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-obsidian-950 dark:text-slate-100">
      {/* Unified Sticky Demo Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-obsidian-950/92">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5">
          {/* Left: Back + Demo Identity */}
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => onExitToPortfolio()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300/80 bg-white px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{bi('Portfolio', '返回主页')}</span>
            </button>

            <div className="hidden h-5 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-display text-sm font-bold text-slate-950 dark:text-white">
                  {displayTitle}
                </h1>
                <span className="hidden shrink-0 items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-700 dark:text-amber-300 lg:inline-flex">
                  <FlaskConical className="h-3 w-3" />
                  {bi('100% Synthetic Demo Data', '100% 合成演示数据')}
                </span>
              </div>
            </div>
          </div>

          {/* Center: 6-Demo Quick Switcher */}
          <nav
            className="hidden items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-obsidian-900 xl:flex"
            aria-label="Switch live interactive demo"
          >
            {DEMO_CATALOG.map((demo) => {
              const active = demo.id === activeDemo;
              return (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => onSelectDemo(demo.id)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium transition ${
                    active
                      ? 'bg-cyan-600 text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-obsidian-800 dark:hover:text-white'
                  }`}
                >
                  {lang === 'zh' ? DEMO_ZH_TITLES[demo.id].shortTitle : demo.shortTitle}
                </button>
              );
            })}
          </nav>

          {/* Right: Mobile Switcher + EN/中文 + Theme + Hire */}
          <div className="flex shrink-0 items-center gap-2">
            <select
              value={activeDemo}
              onChange={(e) => onSelectDemo(e.target.value as DemoId)}
              aria-label="Switch live demo"
              className="max-w-[140px] rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-mono text-[11px] font-semibold text-slate-800 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-100 xl:hidden"
            >
              {DEMO_CATALOG.map((demo, idx) => (
                <option key={demo.id} value={demo.id}>
                  {idx + 1}. {lang === 'zh' ? DEMO_ZH_TITLES[demo.id].shortTitle : demo.shortTitle}
                </option>
              ))}
            </select>

            <div
              className="inline-flex items-center rounded-lg border border-slate-300/80 bg-slate-100/90 p-0.5 font-mono text-[10px] font-bold dark:border-slate-700/80 dark:bg-obsidian-900"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`rounded-md px-1.5 py-1 leading-none ${
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
                className={`rounded-md px-1.5 py-1 leading-none ${
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
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300/80 bg-white text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-300 dark:hover:border-cyan-400"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => onExitToPortfolio('contact')}
              className="hidden items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 sm:inline-flex"
            >
              <Send className="h-3.5 w-3.5" />
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
