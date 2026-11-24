import { ArrowUp, Compass, Github } from 'lucide-react';
import { getProfile } from '../data/profile';
import { useLanguage } from '../i18n/LanguageContext';

export function Footer() {
  const { lang, bi } = useLanguage();
  const profile = getProfile(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-slate-200/80 bg-white py-8 dark:border-slate-800/80 dark:bg-obsidian-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Compass className="h-4 w-4" />
          </span>
          <div>
            <div className="font-display text-sm font-bold text-slate-900 dark:text-white">
              {profile.name}{' '}
              <span className="font-mono text-xs font-normal text-slate-500">
                · 31.2304° N, 121.4737° E
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {bi(
                `© ${year} ${profile.name} · Built with React 19, TypeScript, Tailwind & OpenLayers 10`,
                `© ${year} ${profile.name} · 基于 React 19、TypeScript、Tailwind 与 OpenLayers 10 构建`
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 font-mono text-xs text-slate-600 transition hover:border-cyan-500/60 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-300 dark:hover:border-cyan-400/60 dark:hover:text-cyan-300"
          >
            <Github className="h-3.5 w-3.5" />
            <span>@{profile.handle}</span>
          </a>
          <a
            href="#top"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-mono text-xs text-slate-600 transition hover:border-cyan-500/60 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-300 dark:hover:border-cyan-400/60 dark:hover:text-cyan-300"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>{bi('Top', '返回顶部')}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
