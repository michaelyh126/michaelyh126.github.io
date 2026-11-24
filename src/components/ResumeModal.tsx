import { useEffect } from 'react';
import { Github, Globe, Mail, Printer, X } from 'lucide-react';
import { PROFILE } from '../data/profile';
import { useLanguage } from '../i18n/LanguageContext';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeModal({ open, onClose }: ResumeModalProps) {
  const { bi } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6 print:static print:block print:bg-white print:p-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Hao Yang One-Page Resume"
    >
      <div
        className="print-only-container flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-white text-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Controls (hidden during print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div className="font-mono text-xs font-semibold text-slate-600">
            {bi(
              'ONE-PAGE ENGLISH CV · PRINT / SAVE AS PDF READY',
              '单页英文 ATS 标准简历 · 支持直接打印或保存为 PDF'
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-500"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{bi('Print / Save PDF', '打印 / 导出 PDF')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-600 transition hover:text-slate-950"
              aria-label="Close resume preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable A4 CV Body */}
        <div className="overflow-y-auto p-6 text-[13px] leading-relaxed sm:p-10 print:overflow-visible print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950">
                {PROFILE.name}
              </h1>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-700">
                {PROFILE.role}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-cyan-700" />
                {PROFILE.location} ({PROFILE.timezone} · Remote Ready)
              </span>
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-1 hover:text-cyan-700"
              >
                <Mail className="h-3.5 w-3.5 text-cyan-700" />
                {PROFILE.email}
              </a>
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-cyan-700"
              >
                <Github className="h-3.5 w-3.5 text-cyan-700" />
                github.com/{PROFILE.handle}
              </a>
            </div>
          </div>

          {/* Education */}
          <div className="mt-4">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Education
            </h2>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap justify-between gap-1">
                <div>
                  <strong className="text-slate-950">Shanghai Ocean University</strong> — M.S. in
                  Computer Science &amp; Technology
                  <div className="text-xs text-slate-600">
                    Focus: Computer Vision, Ultra-High-Resolution Remote Sensing Semantic Segmentation, Real-Time Inference
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-600">Sep 2024 – Jun 2027</span>
              </div>
              <div className="flex flex-wrap justify-between gap-1">
                <div>
                  <strong className="text-slate-950">Shanghai Ocean University</strong> — B.Eng. in
                  Spatial Information &amp; Digital Technology
                </div>
                <span className="font-mono text-xs text-slate-600">Sep 2020 – Jun 2024</span>
              </div>
            </div>
          </div>

          {/* Publication */}
          <div className="mt-4">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Peer-Reviewed Publication
            </h2>
            <div className="mt-2">
              <div className="flex flex-wrap justify-between gap-1">
                <strong className="text-slate-950">
                  SBUPNet — Uncertainty-Guided Lightweight Network for Ultra-High-Resolution Semantic Segmentation
                </strong>
                <span className="font-mono text-xs font-semibold text-cyan-800">
                  IEEE SMC 2026 (Accepted · First Author)
                </span>
              </div>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-slate-700">
                <li>
                  Achieved <strong>76.5% mIoU at 9.49 FPS</strong> on Inria Aerial (~20% higher
                  throughput and ~35% lower training time &amp; peak VRAM than ISDNet).
                </li>
                <li>
                  Conducted optimization mechanism analysis across Inria, DeepGlobe, CRAG, and
                  MonuSeg comparing Full, Patch, Cross-source Mosaic, and downsampling strategies
                  using gradient variance and mean-update utility.
                </li>
              </ul>
            </div>
          </div>

          {/* Engineering Experience */}
          <div className="mt-4">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Engineering Experience
            </h2>
            <div className="mt-2">
              <div className="flex flex-wrap justify-between gap-1">
                <strong className="text-slate-950">
                  East China Normal University (Research &amp; Data Platform) — Full-Stack &amp; WebGIS Engineer (Intern)
                </strong>
                <span className="font-mono text-xs text-slate-600">2025 – 2026</span>
              </div>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-700">
                <li>
                  <strong>Blue-Carbon WebGIS Platform:</strong> Built Vue 3 / FastAPI geospatial
                  interfaces with station overlays and saltmarsh raster timelines; diagnosed legacy
                  tile projection drift and rebuilt 8 yearly GeoTIFF pyramids in Web Mercator (Z6–Z11).
                </li>
                <li>
                  <strong>Hydrological Telemetry Platform:</strong> Integrated NOAA, ISD, METAR, and
                  regional feeds across <strong>18 sources and ~25,000 stations</strong> on
                  PostgreSQL / TimescaleDB; shipped analytical APIs and estuarine monitoring dashboards.
                </li>
                <li>
                  <strong>Platform Automation &amp; DevOps:</strong> Audited 4,207 CMS articles and
                  batch-migrated 724 multi-page entries with resumable read-back verification; managed
                  Linux, Nginx same-origin reverse proxy, and systemd services.
                </li>
              </ul>
            </div>
          </div>

          {/* Open-Source & Commercial Projects */}
          <div className="mt-4">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Selected Open-Source &amp; Commercial Projects
            </h2>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
              <li>
                <strong className="text-slate-950">salon-system (Multi-Terminal Retail SaaS)</strong>{' '}
                — React 19, TypeScript, Express, MySQL, UniApp/H5, Caddy. Built 4 client apps (Admin,
                Mobile POS, Customer H5, Stylist Workbench) with zero-fee QR reconciliation,
                double-entry wallet ledger, RBAC audit logs, and 20 automated verification flows.
              </li>
              <li>
                <strong className="text-slate-950">ai-file-lock (FUSE / WinFsp Concurrency Guard, v1.0.3)</strong>{' '}
                — Python, Node.js, libfuse3, WinFsp, SQLite, Tree-sitter. Transparent native mount
                protecting editors &amp; AI agents from file races; verified under 128 concurrent
                processes on Linux and native WinFsp 2.2 on Windows.
              </li>
              <li>
                <strong className="text-slate-950">Enterprise DataHub &amp; Visual E2E QA Pipeline (qa-cli)</strong>{' '}
                — React 19, Spring Boot 3.3 (Java 21), PostgreSQL, Redis, Playwright Core, FFmpeg.
                Shipped RBAC approval workflows, hardened file management, and automated MP4 video QA
                audits.
              </li>
            </ul>
          </div>

          {/* Technical Skills & Languages */}
          <div className="mt-4">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Technical Skills &amp; Certifications
            </h2>
            <div className="mt-2 grid gap-1 text-xs text-slate-700">
              <div>
                <strong className="text-slate-950">Geospatial &amp; Data:</strong> OpenLayers 10,
                GeoTIFF / GDAL, Turf.js, EPSG:3857 / WGS84, PostGIS, PostgreSQL, TimescaleDB, ArcPy
              </div>
              <div>
                <strong className="text-slate-950">Full-Stack &amp; AI:</strong> React 19, Vue 3,
                TypeScript, Tailwind CSS, FastAPI, Express, Spring Boot 3 / Java 21, MySQL, Redis,
                Python, PyTorch, MMSegmentation
              </div>
              <div>
                <strong className="text-slate-950">DevOps, QA &amp; Language:</strong> Playwright
                Core, FFmpeg, Linux, Nginx, systemd, Git, CET-6 English Certified (Async-friendly
                technical communication)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
