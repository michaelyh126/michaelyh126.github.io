import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  Layers,
  Play,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import {
  ERA_FILTERS,
  getEraFilterLabel,
  getProjectCategoryLabel,
  getProjects,
  PROJECT_CATEGORIES,
  type ProjectCaseStudy,
  type ProjectCategory,
  type ProjectLaunchLink,
} from '../data/projects';
import type { EngineeringEra } from '../data/liveApps';
import { useLanguage } from '../i18n/LanguageContext';
import type { DemoId } from '../demos/registry';

interface ProjectsSectionProps {
  onLaunchDemo: (demoId: DemoId) => void;
}

export function ProjectsSection({ onLaunchDemo }: ProjectsSectionProps) {
  const { lang, bi } = useLanguage();
  const projects = getProjects(lang);

  const [activeEra, setActiveEra] = useState<'all' | EngineeringEra>('all');
  const [activeCategory, setActiveCategory] = useState<'All' | ProjectCategory>('All');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject: ProjectCaseStudy | null =
    selectedProjectId ? (projects.find((p) => p.id === selectedProjectId) ?? null) : null;

  const eraFilteredProjects =
    activeEra === 'all' ? projects : projects.filter((p) => p.era === activeEra);

  const filteredProjects =
    activeCategory === 'All'
      ? eraFilteredProjects
      : eraFilteredProjects.filter((p) => p.category === activeCategory);

  useEffect(() => {
    if (!selectedProjectId) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProjectId(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedProjectId]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: ProjectLaunchLink,
    closeModal = false
  ) => {
    e.stopPropagation();
    if (link.sandboxId) {
      e.preventDefault();
      if (closeModal) setSelectedProjectId(null);
      onLaunchDemo(link.sandboxId);
    }
  };

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-b border-slate-200/80 py-16 dark:border-slate-800/80 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + "Why Two Eras?" Value Proposition */}
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>
              {bi(
                '12 Original Production Frontends Live + 2 Interactive Labs · 100% Synthetic Data',
                '12 套原始生产前端在线直连 + 2 套实验台 · 100% 合成演示数据'
              )}
            </span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {bi('Flagship Case Studies & Live Apps', '代表项目与跨年代实景应用')}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            {bi(
              'Why two eras? Solid hand-crafted 3D CesiumJS, Canvas fluid-physics, WebSocket IoT, and PyTorch fundamentals (2021–2025) multiplied by AI-native full-stack velocity & automated Playwright QA (2026). Every web project below opens its real compiled frontend with zero login walls.',
              '为何明确区分两个时代？2021–2025 前 AI 时代纯手搓三维 CesiumJS、粒子风场、WebSocket 物联网与 PyTorch 算法夯实底层功底，叠加 2026 AI 协同高效全栈交付与 Playwright 自动化验收——全部项目均可免登录直接体验真实前端。'
            )}
          </p>
        </div>

        {/* Dual Filter Bar: Era Filter (Left) + Domain Filter (Right) — crisp single-row at 1440px */}
        <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Era Filter Tabs */}
          <div
            className="inline-flex shrink-0 flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100/85 p-1 dark:border-slate-800 dark:bg-obsidian-900 md:flex-nowrap"
            role="tablist"
            aria-label="Filter case studies by engineering era"
          >
            {ERA_FILTERS.map((era) => {
              const active = activeEra === era;
              const count =
                era === 'all' ? projects.length : projects.filter((p) => p.era === era).length;

              const activeClass =
                era === 'pre-ai'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : era === 'ai-era'
                    ? 'bg-cyan-600 text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                    : 'bg-white text-slate-950 shadow-sm dark:bg-obsidian-800 dark:text-white';

              return (
                <button
                  key={era}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveEra(era)}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold transition sm:text-xs ${
                    active
                      ? activeClass
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {era === 'pre-ai' && <Wrench className="h-3 w-3 shrink-0" />}
                  {era === 'ai-era' && <Sparkles className="h-3 w-3 shrink-0" />}
                  <span>{getEraFilterLabel(era, lang)}</span>
                  <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Domain Filter Tabs (dynamically counted within selected era) */}
          <div
            className="inline-flex shrink-0 flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100/85 p-1 dark:border-slate-800 dark:bg-obsidian-900 md:flex-nowrap"
            role="tablist"
            aria-label="Filter case studies by domain"
          >
            {PROJECT_CATEGORIES.map((category) => {
              const active = activeCategory === category;
              const count =
                category === 'All'
                  ? eraFilteredProjects.length
                  : eraFilteredProjects.filter((p) => p.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-medium transition sm:px-3 sm:text-xs ${
                    active
                      ? 'bg-white text-slate-950 shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {getProjectCategoryLabel(category, lang)}{' '}
                  <span className="opacity-65">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const isPreAi = project.era === 'pre-ai';
            return (
              <article
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProjectId(project.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open case study for ${project.title}`}
                className={`group flex cursor-pointer flex-col justify-between rounded-2xl border bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-glow focus:outline-none focus:ring-2 dark:bg-obsidian-900/90 sm:p-6 ${
                  isPreAi
                    ? 'border-amber-500/30 hover:border-amber-500/70 focus:ring-amber-500/50 dark:border-amber-500/25 dark:hover:border-amber-400/70'
                    : 'border-slate-200/90 hover:border-cyan-500/60 focus:ring-cyan-500/50 dark:border-slate-800 dark:hover:border-cyan-400/60'
                }`}
              >
                <div>
                  {/* High-Contrast Era Badge + Period */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${
                        isPreAi
                          ? 'border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300'
                          : 'border-cyan-500/35 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                      }`}
                    >
                      {isPreAi ? (
                        <Wrench className="h-3 w-3 shrink-0" />
                      ) : (
                        <Sparkles className="h-3 w-3 shrink-0" />
                      )}
                      <span>{project.eraLabel}</span>
                    </span>
                    <span className="font-mono text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {project.period}
                    </span>
                  </div>

                  <div className="mt-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-obsidian-950 dark:text-slate-400">
                      {project.badge}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-slate-950 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                    {project.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {project.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {project.summary}
                  </p>

                  {/* Metrics Bar */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-obsidian-950/70">
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <div
                          className={`font-mono text-xs font-bold ${
                            isPreAi
                              ? 'text-amber-700 dark:text-amber-300'
                              : 'text-slate-900 dark:text-cyan-300'
                          }`}
                        >
                          {m.value}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600 dark:bg-obsidian-850 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 5 && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-500 dark:bg-obsidian-850 dark:text-slate-400">
                        +{project.stack.length - 5}
                      </span>
                    )}
                  </div>

                  {/* Extra Quick-Launch App Pills */}
                  {project.extraLinks && project.extraLinks.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.extraLinks.map((extra) => (
                        <a
                          key={extra.href}
                          href={extra.href}
                          onClick={(e) => handleLinkClick(e, extra)}
                          className="inline-flex items-center gap-1 rounded-md border border-cyan-500/35 bg-cyan-500/10 px-2 py-1 font-mono text-[10px] font-semibold text-cyan-700 transition hover:bg-cyan-600 hover:text-white dark:text-cyan-300 dark:hover:bg-cyan-500 dark:hover:text-slate-950"
                        >
                          <span>{extra.label}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Primary Launch App + Architecture Inspect Row */}
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200/80 pt-3.5 dark:border-slate-800">
                    <a
                      href={project.primaryLink.href}
                      onClick={(e) => handleLinkClick(e, project.primaryLink)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold shadow-sm transition ${
                        isPreAi
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                          : 'bg-cyan-600 text-white hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400'
                      }`}
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{project.primaryLink.label}</span>
                    </a>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition group-hover:text-cyan-700 dark:text-slate-300 dark:group-hover:text-cyan-300">
                      <span>{bi('Specs', '架构详情')}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Case Study Architecture Drawer / Modal */}
      {selectedProject && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-end bg-slate-950/75 backdrop-blur-sm"
          onClick={() => setSelectedProjectId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
        >
          <div
            className="flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-obsidian-950 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                      selectedProject.era === 'pre-ai'
                        ? 'border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300'
                        : 'border-cyan-500/35 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                    }`}
                  >
                    {selectedProject.era === 'pre-ai' ? (
                      <Wrench className="h-3 w-3" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    {selectedProject.eraLabel} · {selectedProject.period}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                    {selectedProject.repoStatus}
                  </span>
                </div>
                <h3
                  id="case-study-title"
                  className="mt-3 font-display text-2xl font-bold text-slate-950 dark:text-white"
                >
                  {selectedProject.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {selectedProject.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:border-cyan-500 hover:text-slate-950 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                aria-label="Close case study drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Key Metrics */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {selectedProject.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-obsidian-900"
                >
                  <div className="font-mono text-base font-bold text-cyan-700 dark:text-cyan-400">
                    {m.value}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {selectedProject.summary}
            </p>

            {/* Architecture Overview */}
            <div className="mt-6">
              <h4 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                <Layers className="h-4 w-4 text-cyan-500" />
                <span>{bi('System Architecture', '系统架构设计')}</span>
              </h4>
              <ul className="mt-3 space-y-2.5">
                {selectedProject.architecture.map((line, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges Solved */}
            <div className="mt-6">
              <h4 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{bi('Engineering Challenges Solved', '攻克的工程难点')}</span>
              </h4>
              <ul className="mt-3 space-y-2.5">
                {selectedProject.challengesSolved.map((line, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="mt-6">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {bi('Technology Stack', '核心技术栈')}
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {selectedProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-obsidian-900 dark:text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Launch Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5 border-t border-slate-200 pt-5 dark:border-slate-800">
              <a
                href={selectedProject.primaryLink.href}
                onClick={(e) => handleLinkClick(e, selectedProject.primaryLink, true)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{selectedProject.primaryLink.label}</span>
              </a>

              {selectedProject.extraLinks?.map((extra) => (
                <a
                  key={extra.href}
                  href={extra.href}
                  onClick={(e) => handleLinkClick(e, extra, true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2.5 text-xs font-bold text-cyan-700 transition hover:bg-cyan-600 hover:text-white dark:text-cyan-300 dark:hover:bg-cyan-500 dark:hover:text-slate-950"
                >
                  <span>{extra.label}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}

              <a
                href="#contact"
                onClick={() => setSelectedProjectId(null)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
              >
                <span>{bi('Request Code Walkthrough', '预约源码讲解')}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
