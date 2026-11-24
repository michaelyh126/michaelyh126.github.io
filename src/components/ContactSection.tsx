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
import { getPlatformHref, PROFILE } from '../data/profile';

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
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback for non-HTTPS local preview
      const textarea = document.createElement('textarea');
      textarea.value = PROFILE.email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-geo-grid py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 shadow-panel backdrop-blur-md dark:border-slate-800 dark:bg-obsidian-900/95">
          <div className="grid lg:grid-cols-12">
            {/* Left Direct Outreach Column */}
            <div className="border-b border-slate-200/80 p-7 dark:border-slate-800 sm:p-10 lg:col-span-6 lg:border-b-0 lg:border-r">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open for New Remote Contracts</span>
              </div>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Let’s ship your geospatial or full-stack system.
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                Send a short brief—stack, target deadline, and rough budget—and I’ll reply within
                12 hours with architecture feedback and a clear milestone breakdown.
              </p>

              {/* Direct Email Copy Box */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-obsidian-950">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Direct Email
                  </span>
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    {PROFILE.responseTime}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`mailto:${PROFILE.email}?subject=${encodeURIComponent('Remote Project Inquiry — Hao Yang Portfolio')}`}
                    className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-900 hover:text-cyan-600 dark:text-white dark:hover:text-cyan-400 sm:text-base"
                  >
                    <Mail className="h-4 w-4 text-cyan-500" />
                    <span>{PROFILE.email}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-850 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`mailto:${PROFILE.email}?subject=${encodeURIComponent('Project Brief — WebGIS / Full-Stack Engineering')}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
                >
                  <Send className="h-4 w-4" />
                  <span>Email Project Brief</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenResume}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-850 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                >
                  <FileText className="h-4 w-4" />
                  <span>View / Print 1-Page CV</span>
                </button>
              </div>

              {/* Live Timezone Readout */}
              <div className="mt-7 flex flex-col gap-2 border-t border-slate-200/80 pt-5 font-mono text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-500" />
                  <span>
                    Local Time ({PROFILE.location}):{' '}
                    <strong className="text-slate-900 dark:text-slate-200">
                      {shanghaiTime} UTC+8
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-500" />
                  <span>{PROFILE.timezoneOverlap}</span>
                </div>
              </div>
            </div>

            {/* Right Platforms & Profiles Column */}
            <div className="p-7 sm:p-10 lg:col-span-6">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Hiring Channels &amp; Public Profiles
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Contract directly via invoice or through your preferred remote hiring platform.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {PROFILE.platforms.map((platform) => {
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
                        {isExternal ? platform.handle : `${platform.handle} · Request Link`}
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
