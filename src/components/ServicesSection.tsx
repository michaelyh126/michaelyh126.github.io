import { ArrowRight, Briefcase, Check, ShieldCheck } from 'lucide-react';
import { PROFILE } from '../data/profile';
import { getDeliverySteps, getServices } from '../data/services';
import { useLanguage } from '../i18n/LanguageContext';

const ACCENT_BORDER = {
  cyan: 'border-t-cyan-500',
  emerald: 'border-t-emerald-500',
  sky: 'border-t-sky-500',
};

export function ServicesSection() {
  const { lang, bi } = useLanguage();
  const services = getServices(lang);
  const deliverySteps = getDeliverySteps(lang);

  return (
    <section
      id="services"
      className="scroll-mt-20 border-b border-slate-200/80 bg-slate-100/50 py-16 dark:border-slate-800/80 dark:bg-obsidian-900/35 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            <Briefcase className="h-3.5 w-3.5" />
            <span>{bi('Freelance & Remote Contract Models', '远程合同与技术合作模式')}</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {bi('Scoped Engineering Services', '标准化工程交付方案')}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            {bi(
              'Transparent milestone pricing built for overseas founders, research labs, and product teams. Every engagement includes written specs, async progress updates, automated Playwright video QA, and full source-code ownership.',
              '面向海外与国内创业团队、科研实验室及产品负责人提供透明的里程碑交付方案：书面架构设计、异步进度同步、Playwright 自动化录屏验收及 100% 源码移交。'
            )}
          </p>
        </div>

        {/* 3 Service Cards */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {services.map((svc) => {
            const mailSubject = encodeURIComponent(`Scope Inquiry: ${svc.title}`);
            const mailHref = `mailto:${PROFILE.email}?subject=${mailSubject}`;
            return (
              <div
                key={svc.id}
                className={`flex flex-col justify-between rounded-2xl border border-slate-200/90 border-t-4 bg-white p-6 shadow-sm transition hover:shadow-glow dark:border-slate-800 dark:bg-obsidian-900 ${ACCENT_BORDER[svc.accent]}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {svc.tier}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600 dark:bg-obsidian-850 dark:text-slate-300">
                      {svc.timeline}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-xl font-bold text-slate-950 dark:text-white">
                    {svc.title}
                  </h3>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-cyan-700 dark:text-cyan-400">
                      {svc.priceRange}
                    </span>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {bi('USD · Fixed Milestone or Hourly', 'USD · 里程碑或工时制')}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {svc.description}
                  </p>

                  <div className="mt-4 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-obsidian-950/70 dark:text-slate-300">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {bi('Best for: ', '适用场景：')}
                    </span>
                    {svc.idealFor}
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {svc.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-slate-200/80 pt-5 dark:border-slate-800">
                  <a
                    href={mailHref}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-900 transition hover:border-cyan-500 hover:bg-cyan-600 hover:text-white dark:border-slate-700 dark:bg-obsidian-850 dark:text-white dark:hover:border-cyan-400 dark:hover:bg-cyan-500 dark:hover:text-slate-950"
                  >
                    <span>{bi('Request Scope & Estimate', '获取方案与报价评估')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4-Step Delivery Guarantee Strip */}
        <div className="mt-10 rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-obsidian-900">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>{bi('Remote Delivery Protocol', '远程交付保障规范')}</span>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {bi(
                'Milestone-Based · Automated Video QA · Full Source Handover',
                '分阶段里程碑 · 自动化录屏验收 · 完整源码移交'
              )}
            </span>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deliverySteps.map((item) => (
              <div key={item.step}>
                <div className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  STEP {item.step}
                </div>
                <h4 className="mt-1 font-display text-base font-bold text-slate-950 dark:text-white">
                  {item.title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
