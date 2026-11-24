import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  FileText,
  Globe,
  Mail,
  Send,
} from 'lucide-react';
import { getPlatformHref, getProfile } from '../data/profile';
import { useLanguage } from '../i18n/LanguageContext';

interface ContactSectionProps {
  onOpenResume: () => void;
}

function getShanghaiTimeString(): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      weekday: 'short',
    }).format(new Date());
  } catch {
    return 'UTC+8';
  }
}

export function ContactSection({ onOpenResume }: ContactSectionProps) {
  const { lang, bi } = useLanguage();
  const profile = getProfile(lang);

  const [copied, setCopied] = useState(false);
  const [shanghaiTime, setShanghaiTime] = useState<string>(() => getShanghaiTimeString());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setShanghaiTime(getShanghaiTimeString());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = profile.email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 bg-geo-grid py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 shadow-panel backdrop-blur-md dark:border-slate-800 dark:bg-obsidian-900/95">
          <div className="grid lg:grid-cols-12">
            {/* Left Direct Outreach Column */}
            <div className="border-b border-slate-200/80 p-7 dark:border-slate-800 sm:p-10 lg:col-span-6 lg:border-b-0 lg:border-r">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{bi('Open for New Remote Contracts', '开放远程项目与长期技术合作')}</span>
              </div>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                {bi(
                  'Let’s ship your geospatial or full-stack system.',
                  '一起将您的 WebGIS 或全栈系统高质量交付上线。'
                )}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                {bi(
                  'Send a short brief—stack, target deadline, and rough budget—and I’ll reply within 12 hours with architecture feedback and a clear milestone breakdown.',
                  '欢迎发送简要需求说明（技术栈、预期工期与预算区间），我将在 12 小时内反馈架构建议与清晰的里程碑拆分方案。'
                )}
              </p>

              {/* Direct Email Copy Box */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-obsidian-950">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {bi('Direct Email', '联系邮箱')}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    {profile.responseTime}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`mailto:${profile.email}?subject=${encodeURIComponent('Remote Project Inquiry — Hao Yang Portfolio')}`}
                    className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-900 hover:text-cyan-600 dark:text-white dark:hover:text-cyan-400 sm:text-base"
                  >
                    <Mail className="h-4 w-4 text-cyan-500" />
                    <span>{profile.email}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-850 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{bi('Copied!', '已复制')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{bi('Copy', '复制')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.email}?subject=${encodeURIComponent('Project Brief — WebGIS / Full-Stack Engineering')}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                >
                  <Send className="h-4 w-4" />
                  <span>{bi('Email Project Brief', '发送项目需求邮件')}</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenResume}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-850 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                >
                  <FileText className="h-4 w-4" />
                  <span>{bi('View / Print 1-Page CV', '查看 / 打印英文简历')}</span>
                </button>
              </div>

              {/* Live Timezone Readout */}
              <div className="mt-7 flex flex-col gap-2 border-t border-slate-200/80 pt-5 font-mono text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-500" />
                  <span>
                    {bi(`Local Time (${profile.location}): `, `当地时间 (${profile.location})：`)}
                    <strong className="text-slate-900 dark:text-slate-200">
                      {shanghaiTime} UTC+8
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-500" />
                  <span>{profile.timezoneOverlap}</span>
                </div>
              </div>
            </div>

            {/* Right Platforms & Profiles Column */}
            <div className="p-7 sm:p-10 lg:col-span-6">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {bi('Hiring Channels & Public Profiles', '合作平台与公开主页')}
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {bi(
                  'Contract directly via invoice or through your preferred remote hiring platform.',
                  '支持直接合同签约，或通过您习惯的远程自由职业平台进行托管合作。'
                )}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {profile.platforms.map((platform) => {
                  const { href, isExternal } = getPlatformHref(platform);
                  return (
                    <a
                      key={platform.id}
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noreferrer' : undefined}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 transition hover:border-cyan-500/60 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-obsidian-950/70 dark:hover:border-cyan-400/60 dark:hover:bg-obsidian-850"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-base font-bold text-slate-950 dark:text-white">
                          {platform.label}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-500" />
                      </div>
                      <div className="mt-1 font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-400">
                        {isExternal
                          ? platform.handle
                          : `${platform.handle} · ${bi('Request Link', '邮件获取链接')}`}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {platform.note}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
