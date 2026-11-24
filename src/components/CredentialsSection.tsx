import { Award, BookOpen, Cpu, GraduationCap } from 'lucide-react';
import { getCredentials, getStackMatrix } from '../data/services';
import { useLanguage } from '../i18n/LanguageContext';

export function CredentialsSection() {
  const { lang, bi } = useLanguage();
  const stackMatrix = getStackMatrix(lang);
  const credentials = getCredentials(lang);

  return (
    <section
      id="credentials"
      className="scroll-mt-20 border-b border-slate-200/80 py-16 dark:border-slate-800/80 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stack Matrix */}
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            <Cpu className="h-3.5 w-3.5" />
            <span>{bi('Technical Stack Matrix', '核心技术栈矩阵')}</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {bi('Production Capabilities & Credentials', '工程技术栈与科研履历')}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            {bi(
              'Bridging spatial algorithms, peer-reviewed computer vision research, and pragmatic full-stack shipping across TypeScript, Python, Java, and Linux production infrastructure.',
              '打通空间信息算法、顶会视觉科研与务实全栈落地，覆盖 TypeScript、Python、Java 与 Linux 生产级部署运维。'
            )}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stackMatrix.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900"
              >
                <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                  {group.category}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {group.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-1 font-mono text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-obsidian-950 dark:text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publication Highlight + Timeline */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Featured Peer-Reviewed Publication Card */}
          <div className="lg:col-span-5">
            <div className="h-full rounded-2xl border border-cyan-500/35 bg-gradient-to-br from-cyan-500/10 via-white to-emerald-500/5 p-6 dark:from-cyan-500/15 dark:via-obsidian-900 dark:to-emerald-500/10">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/35 bg-cyan-500/15 px-3 py-1 font-mono text-[11px] font-semibold text-cyan-800 dark:text-cyan-300">
                <BookOpen className="h-3.5 w-3.5" />
                <span>
                  {bi(
                    'IEEE SMC 2026 · Accepted · First Author',
                    'IEEE SMC 2026 · 已录用 · 第一作者'
                  )}
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold text-slate-950 dark:text-white">
                {bi(
                  'SBUPNet: Uncertainty-Guided Lightweight UHR Semantic Segmentation',
                  'SBUPNet：面向超高分辨率遥感影像的不确定像素轻量化语义分割网络'
                )}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {bi(
                  'Research on real-time semantic segmentation for ultra-high-resolution aerial and remote-sensing imagery—explicitly targeting the trade-off between pixel-level accuracy, inference throughput, and GPU memory footprint.',
                  '针对超高分辨率遥感影像语义分割中的精度、推理吞吐与显存开销权衡，提出基于不确定像素引导的轻量化双分支架构。'
                )}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { val: '76.5%', label: bi('Inria Aerial mIoU', 'Inria Aerial mIoU 精度') },
                  { val: '9.49 FPS', label: bi('Real-Time Throughput', '实时推理吞吐') },
                  { val: '+20%', label: bi('Speed vs. ISDNet', '相比 ISDNet 提速') },
                  { val: '-35%', label: bi('Train Time & Peak VRAM', '训练耗时与显存降低') },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-200/80 bg-white/90 p-3 dark:border-slate-800 dark:bg-obsidian-950/80"
                  >
                    <div className="font-mono text-lg font-bold text-cyan-700 dark:text-cyan-400">
                      {stat.val}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-slate-200/80 bg-white/80 p-3.5 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-obsidian-950/60 dark:text-slate-300">
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {bi('Optimization Analysis: ', '机制分析：')}
                </span>
                {bi(
                  'Benchmarked Full, Patch, Cross-source Mosaic, and input downsampling strategies across Inria Aerial, DeepGlobe, CRAG, and MonuSeg via gradient variance and mean-update utility.',
                  '在 Inria、DeepGlobe、CRAG、MonuSeg 四大基准系统对比 Full、Patch、Cross-source Mosaic 与降采样策略，结合梯度方差与 mean-update utility 剖析优化机理。'
                )}
              </div>

              <div className="mt-5 flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                <Award className="h-4 w-4 text-emerald-500" />
                <span>
                  {bi(
                    'CET-6 English Certified · Async International Collaboration',
                    '英语六级 (CET-6) · 流畅英文技术文档与国际远程协作'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Education & Engineering Timeline */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <GraduationCap className="h-4 w-4 text-cyan-500" />
              <span>{bi('Education & Industry Engineering Track', '教育背景与工程实践履历')}</span>
            </div>

            {credentials.map((cred) => (
              <div
                key={cred.role}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-cyan-700 dark:bg-obsidian-850 dark:text-cyan-300">
                    {cred.tag}
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {cred.period}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold text-slate-950 dark:text-white">
                  {cred.role}
                </h3>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {cred.organization} · {cred.location}
                </div>

                <ul className="mt-3 space-y-2">
                  {cred.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
