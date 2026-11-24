import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Compass, FileText, Menu, Moon, Play, Sun, X } from 'lucide-react';
import { PROFILE } from '../data/profile';
import { LIVE_APP_GROUPS, LIVE_APPS } from '../data/liveApps';
import type { DemoId } from '../demos/registry';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenResume: () => void;
  onLaunchDemo: (id: DemoId) => void;
}

const NAV_LINKS = [
  { label: 'Live Lab', href: '#lab' },
  { label: 'Case Studies', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({ theme, onToggleTheme, onOpenResume, onLaunchDemo }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!appsMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAppsMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAppsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [appsMenuOpen]);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-obsidian-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand + Status */}
        <a
          href="#top"
          className="group flex items-center gap-3 focus:outline-none"
          aria-label="Hao Yang Portfolio Home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 group-hover:border-cyan-400/70 group-hover:bg-cyan-500/20 dark:text-cyan-400">
            <Compass className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">
                {PROFILE.name}
              </span>
              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-700 dark:text-emerald-300 xl:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Remote · UTC+8
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {PROFILE.shortRole}
            </span>
          </div>
        </a>

        {/* Desktop Links + Live Apps (9) Dropdown */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary Navigation">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setAppsMenuOpen((o) => !o)}
              aria-expanded={appsMenuOpen}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs font-bold text-cyan-700 hover:bg-cyan-500/20 dark:text-cyan-300"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Live Apps (9)</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${appsMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {appsMenuOpen && (
              <div className="absolute left-0 top-11 z-50 w-[440px] max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-obsidian-900">
                <div className="flex items-center justify-between border-b border-slate-200/80 px-2 pb-2 dark:border-slate-800">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                    9 Original Production Apps + 2 Sandboxes
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                    100% Synthetic Data
                  </span>
                </div>

                <div className="mt-2.5 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                  {LIVE_APP_GROUPS.map((groupName) => (
                    <div key={groupName}>
                      <div className="px-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {groupName}
                      </div>
                      <div className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {LIVE_APPS.filter((a) => a.category === groupName).map((app) => (
                          <a
                            key={app.id}
                            href={app.href}
                            onClick={(e) => {
                              setAppsMenuOpen(false);
                              if (app.sandboxId) {
                                e.preventDefault();
                                onLaunchDemo(app.sandboxId);
                              }
                            }}
                            className="flex flex-col rounded-xl border border-transparent px-2.5 py-2 text-left hover:border-cyan-500/30 hover:bg-cyan-500/10"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="truncate font-display text-xs font-bold text-slate-950 dark:text-white">
                                {app.shortLabel}
                              </span>
                              <span
                                className={`shrink-0 rounded px-1 py-0.5 font-mono text-[8px] font-bold uppercase ${
                                  app.isOriginal
                                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                }`}
                              >
                                {app.isOriginal ? 'App' : 'Sim'}
                              </span>
                            </div>
                            <span className="truncate font-mono text-[10px] text-slate-500 dark:text-slate-400">
                              {app.stackTag}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenResume}
            className="hidden items-center gap-1.5 rounded-lg border border-slate-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-cyan-500/50 hover:text-cyan-700 dark:border-slate-700/80 dark:bg-obsidian-850 dark:text-slate-200 dark:hover:border-cyan-400/60 dark:hover:text-cyan-300 sm:inline-flex"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>CV / Print</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300/80 bg-white text-slate-700 hover:border-cyan-500/50 hover:text-cyan-600 dark:border-slate-700/80 dark:bg-obsidian-850 dark:text-slate-300 dark:hover:border-cyan-400/60 dark:hover:text-cyan-300"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href="#contact"
            className="hidden rounded-lg bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 sm:inline-flex"
          >
            Hire / Inquire
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300/80 bg-white text-slate-700 dark:border-slate-700/80 dark:bg-obsidian-850 dark:text-slate-200 md:hidden"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 dark:border-slate-800 dark:bg-obsidian-950 md:hidden">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{PROFILE.availabilityBadge}</span>
          </div>

          <div className="mb-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-2.5">
            <div className="mb-1.5 font-mono text-[10px] font-bold uppercase text-cyan-700 dark:text-cyan-400">
              Live Original Apps (9) &amp; Sandboxes
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LIVE_APPS.map((app) => (
                <a
                  key={app.id}
                  href={app.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    if (app.sandboxId) {
                      e.preventDefault();
                      onLaunchDemo(app.sandboxId);
                    }
                  }}
                  className="truncate rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-mono text-[10px] font-semibold text-slate-800 dark:border-slate-800 dark:bg-obsidian-900 dark:text-slate-200"
                >
                  {app.shortLabel}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenResume();
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              <FileText className="h-3.5 w-3.5" />
              View / Print CV
            </button>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="flex flex-1 items-center justify-center rounded-lg bg-cyan-600 py-2 text-xs font-semibold text-white dark:bg-cyan-500 dark:text-slate-950"
            >
              Discuss a Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
