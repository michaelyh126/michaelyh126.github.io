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
        <div className="overflow-y-auto p-6 text-[12.5px] leading-relaxed sm:p-9 print:overflow-visible print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950">
                {PROFILE.name}
              </h1>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-700">
                {PROFILE.role}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-slate-600">
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
                github.com/{PROFILE.handle} · 12 Live Apps at michaelyh126.github.io
              </a>
            </div>
          </div>

          {/* Education */}
          <div className="mt-3.5">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Education
            </h2>
            <div className="mt-2 space-y-1.5">
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
          <div className="mt-3.5">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Peer-Reviewed Publication
            </h2>
            <div className="mt-1.5">
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
                  Benchmarked Full, Patch, Cross-source Mosaic, and downsampling strategies across
                  Inria, DeepGlobe, CRAG, and MonuSeg via gradient variance and mean-update utility.
                </li>
              </ul>
            </div>
          </div>

          {/* Engineering Experience (2026) */}
          <div className="mt-3.5">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Engineering Experience
            </h2>
            <div className="mt-1.5">
              <div className="flex flex-wrap justify-between gap-1">
                <strong className="text-slate-950">
                  East China Normal University (Research &amp; Data Platform) — Full-Stack &amp; WebGIS Engineer (Intern)
                </strong>
                <span className="font-mono text-xs text-slate-600">2026</span>
              </div>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-700">
                <li>
                  <strong>Blue-Carbon &amp; WebGIS Platforms:</strong> Built Vue 3 / MapLibre &amp;
                  React / OpenLayers 10 geospatial interfaces; fixed legacy tile projection drift
                  and rebuilt 8 yearly GeoTIFF pyramids in Web Mercator (Z6–Z11).
                </li>
                <li>
                  <strong>Hydrological Telemetry Platform:</strong> Integrated NOAA, ISD, METAR, and
                  regional feeds across <strong>18 sources and ~25,000 stations</strong> on
                  PostgreSQL / TimescaleDB with 3-view monitoring dashboards.
                </li>
                <li>
                  <strong>Platform Automation &amp; DevOps:</strong> Audited 4,207 CMS articles and
                  batch-migrated 724 multi-page entries with resumable read-back verification; managed
                  Linux, Nginx same-origin reverse proxy, and systemd services.
                </li>
              </ul>
            </div>
          </div>

          {/* Flagship Projects Across Two Eras */}
          <div className="mt-3.5">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Selected Projects (Pre-AI Hand-Crafted 2021–2025 &amp; AI-Assisted 2026)
            </h2>
            <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
              <li>
                <strong className="text-slate-950">3D Marine Bathymetry Workbench (2024–2025 · Pre-AI, 132 Commits)</strong>{' '}
                — Vue 3, TypeScript, CesiumJS 1.123 / Mars3D 3.8, ECharts, Turf. Built 3D terrain
                slope/aspect, contours, seabed volume, trench excavation, cross-sections, and 10
                passing marine shader effects.
              </li>
              <li>
                <strong className="text-slate-950">Tropical Cyclone Platform (2023–2024) &amp; SmartRFID IoT Monitor (2021 · Pre-AI)</strong>{' '}
                — Vue 2, DataV 1080p, 950-particle Rankine wind Canvas; Spring Boot, WebSocket,
                Redis &amp; real-time RFID anomaly alerting.
              </li>
              <li>
                <strong className="text-slate-950">Multi-Terminal Salon SaaS &amp; OceanData Portal / Sound-AI (2026 · AI-Era)</strong>{' '}
                — React 19, Three.js Globe, Express/MySQL, Spring Boot 3 (Java 21), custom Canvas
                spectrograms, 0% Direct-QR double-entry ledger, and RBAC 403 security rails.
              </li>
              <li>
                <strong className="text-slate-950">ai-file-lock (FUSE / WinFsp v1.0.3) &amp; qa-cli Visual QA (2026)</strong>{' '}
                — Python, Node.js, libfuse3, WinFsp (128-process verified), Playwright Core + FFmpeg
                automated MP4 regression proofs.
              </li>
            </ul>
          </div>

          {/* Technical Skills & Languages */}
          <div className="mt-3.5">
            <h2 className="border-b border-slate-300 pb-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              Technical Skills &amp; Certifications
            </h2>
            <div className="mt-1.5 grid gap-1 text-xs text-slate-700">
              <div>
                <strong className="text-slate-950">2D/3D Geospatial &amp; Data:</strong> OpenLayers 10,
                CesiumJS / Mars3D, MapLibre GL, Three.js, GeoTIFF / GDAL, Turf.js, PostGIS, TimescaleDB, ArcPy
              </div>
              <div>
                <strong className="text-slate-950">Full-Stack &amp; AI:</strong> React 19, Vue 2/3,
                TypeScript, Tailwind CSS, FastAPI, Express, Spring Boot 3 / Java 21, WebSocket,
                PostgreSQL, MySQL, Redis, Python, PyTorch, MMSegmentation
              </div>
              <div>
                <strong className="text-slate-950">Systems, QA &amp; Language:</strong> Playwright
                Core, FFmpeg, Linux, Nginx, systemd, libfuse3 / WinFsp, CET-6 English Certified
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
