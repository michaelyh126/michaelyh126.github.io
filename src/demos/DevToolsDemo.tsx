import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Cpu,
  FileLock2,
  Film,
  Play,
  RotateCcw,
  ShieldAlert,
  StepForward,
  Terminal,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

type DevTab = 'filelock' | 'qacli';
type LockPolicy = 'handle-v1.0.3' | 'optimistic-depgraph';

interface AgentState {
  id: string;
  name: string;
  pid: number;
  status: 'IDLE' | 'READING' | 'WRITING' | 'BLOCKED_EBUSY' | 'RETRY_BACKOFF' | 'COMMITTED';
  targetFile: string;
}

interface LockRow {
  file: string;
  version: number;
  shaShort: string;
  mode: 'UNLOCKED' | 'SHARED_READ' | 'EXCLUSIVE_WRITE';
  holder: string;
  conflictsPrevented: number;
}

interface QaScenario {
  id: string;
  app: string;
  name: string;
  durationSec: number;
  assertions: { check: string; passed: boolean }[];
  requests: { endpoint: string; status: number; ms: number }[];
  domAudit: { overflowPx: number; consoleErrors: number; brokenImages: number; cjkFontOk: boolean };
  keyframes: { t: string; label: string; selector: string; state: string }[];
}

const INITIAL_AGENTS: AgentState[] = [
  { id: 'ag-1', name: 'Claude-Agent', pid: 4102, status: 'IDLE', targetFile: 'src/map/engine.ts' },
  { id: 'ag-2', name: 'Codex-Worker', pid: 4188, status: 'IDLE', targetFile: 'src/map/engine.ts' },
  { id: 'ag-3', name: 'Refactor-Bot', pid: 4215, status: 'IDLE', targetFile: 'src/api/telemetry.py' },
  { id: 'ag-4', name: 'Test-Runner', pid: 4309, status: 'IDLE', targetFile: 'src/auth/rbac.ts' },
];

const INITIAL_LOCKS: LockRow[] = [
  { file: 'src/map/engine.ts', version: 12, shaShort: 'a94f1c', mode: 'UNLOCKED', holder: '—', conflictsPrevented: 0 },
  { file: 'src/api/telemetry.py', version: 8, shaShort: '7e21b0', mode: 'UNLOCKED', holder: '—', conflictsPrevented: 0 },
  { file: 'src/db/ledger.sql', version: 5, shaShort: '3c90d4', mode: 'UNLOCKED', holder: '—', conflictsPrevented: 0 },
  { file: 'src/auth/rbac.ts', version: 14, shaShort: 'f018e9', mode: 'UNLOCKED', holder: '—', conflictsPrevented: 0 },
];

const QA_SCENARIOS: QaScenario[] = [
  {
    id: 'QA-01',
    app: 'WebGIS Coastal Studio',
    name: 'Basemap switch + Swipe compare + Geodesic measurement',
    durationSec: 8.4,
    assertions: [
      { check: 'Zero console errors & zero uncaught pageerror events', passed: true },
      { check: 'OpenLayers canvas rendered with non-zero bounding box', passed: true },
      { check: 'Swipe divider drag clipped 2018 vs 2026 layers cleanly', passed: true },
      { check: 'ol/sphere geodesic length formatted in km (> 0)', passed: true },
    ],
    requests: [
      { endpoint: 'GET /index.html', status: 200, ms: 24 },
      { endpoint: 'GET /assets/openlayers.js', status: 200, ms: 88 },
      { endpoint: 'GET /tile/World_Dark_Gray_Base/6/26/53', status: 200, ms: 142 },
      { endpoint: 'GET /api/mock/stations.geojson', status: 200, ms: 31 },
    ],
    domAudit: { overflowPx: 0, consoleErrors: 0, brokenImages: 0, cjkFontOk: true },
    keyframes: [
      { t: 'T+0.0s', label: 'Initial Viewport Hydrated', selector: '#lab canvas', state: 'Esri Dark Gray tiles loaded (14 stations)' },
      { t: 'T+2.4s', label: 'Station Fly-To Triggered', selector: 'select#station-select', state: 'Camera animated to CN-YZE-01 (Z 7.4)' },
      { t: 'T+5.1s', label: 'Geodesic Measure Draw', selector: 'button[measure]', state: '3 vertices drawn → 142.84 km verified' },
      { t: 'T+8.4s', label: 'Final Assertion Snapshot', selector: 'body', state: '0 console errors · MP4 audit encoded' },
    ],
  },
  {
    id: 'QA-02',
    app: 'Atelier Nova Salon SaaS',
    name: 'Booking → Stylist Complete → Direct-QR Checkout → RBAC 403',
    durationSec: 11.2,
    assertions: [
      { check: 'Booking created in Customer H5 propagates to Stylist queue', passed: true },
      { check: 'POS Direct-QR enforces mandatory audio speaker confirmation', passed: true },
      { check: 'Cashier top-up approval returns HTTP 403 + security audit entry', passed: true },
      { check: 'Owner approval credits principal & bonus double-entry ledger', passed: true },
    ],
    requests: [
      { endpoint: 'POST /api/appointments', status: 201, ms: 46 },
      { endpoint: 'PATCH /api/appointments/APT-104/status', status: 200, ms: 38 },
      { endpoint: 'POST /api/direct-pay/approve (CASHIER)', status: 403, ms: 14 },
      { endpoint: 'POST /api/direct-pay/approve (OWNER)', status: 200, ms: 52 },
    ],
    domAudit: { overflowPx: 0, consoleErrors: 0, brokenImages: 0, cjkFontOk: true },
    keyframes: [
      { t: 'T+0.0s', label: 'Customer H5 Booking Submit', selector: 'button.confirm-booking', state: 'APT-104 queued for Elena Vance' },
      { t: 'T+3.8s', label: 'POS Anti-Fraud Gate', selector: 'input[type=checkbox]', state: 'Unchecked audio blocked; checked → settled' },
      { t: 'T+7.5s', label: 'RBAC 403 Escalation Check', selector: 'button.approve-topup', state: 'HTTP 403 logged under Cashier Mia' },
      { t: 'T+11.2s', label: 'EOD Reconciliation Match', selector: 'table.eod-matrix', state: 'Direct QR + Wallet totals balanced to $0.00' },
    ],
  },
  {
    id: 'QA-03',
    app: 'Open Research DataHub',
    name: 'Catalog filter + Approval workflow + Path traversal guard',
    durationSec: 6.9,
    assertions: [
      { check: 'Facet filters narrow 10 datasets without layout shift', passed: true },
      { check: 'Access request appears instantaneously in Admin queue', passed: true },
      { check: 'Folder "../../etc/passwd" blocked with PATH_TRAVERSAL_BLOCKED', passed: true },
      { check: 'Soft-delete → Recycle Bin → Restore preserves file metadata', passed: true },
    ],
    requests: [
      { endpoint: 'GET /api/catalog?format=NetCDF', status: 200, ms: 29 },
      { endpoint: 'POST /api/access-requests', status: 201, ms: 41 },
      { endpoint: 'POST /api/fs/mkdir (../../etc/passwd)', status: 400, ms: 9 },
      { endpoint: 'POST /api/fs/restore/vf-6', status: 200, ms: 22 },
    ],
    domAudit: { overflowPx: 0, consoleErrors: 0, brokenImages: 0, cjkFontOk: true },
    keyframes: [
      { t: 'T+0.0s', label: 'Public Catalog Loaded', selector: '.dataset-list', state: '10 synthetic datasets indexed' },
      { t: 'T+2.1s', label: 'Approval Request Synced', selector: '.admin-queue', state: 'REQ-403 visible & approved by steward' },
      { t: 'T+4.6s', label: 'Path Traversal Attack Test', selector: 'input.mkdir', state: 'HTTP 400 PATH_TRAVERSAL_BLOCKED logged' },
      { t: 'T+6.9s', label: 'Recycle Bin Roundtrip', selector: 'button.restore', state: 'Restored cleanly · 0 layout overflow' },
    ],
  },
];

export default function DevToolsDemo() {
  const { bi } = useLanguage();
  const [tab, setTab] = useState<DevTab>('filelock');
  const [policy, setPolicy] = useState<LockPolicy>('handle-v1.0.3');
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [locks, setLocks] = useState<LockRow[]>(INITIAL_LOCKS);
  const [stepNum, setStepNum] = useState(0);
  const [stormRunning, setStormRunning] = useState(false);
  const [events, setEvents] = useState<string[]>([
    '[MOUNT] libfuse3 / WinFsp virtual mount active at /workspace (v1.0.3 · 128-proc baseline)',
    '[SQLITE] State DB initialized · 4 tracked repository files · 0 active conflicts',
  ]);
  const timerRef = useRef<number | null>(null);

  // QA CLI state
  const [selectedQaId, setSelectedQaId] = useState(QA_SCENARIOS[0].id);
  const [frameIdx, setFrameIdx] = useState(0);
  const selectedQa = QA_SCENARIOS.find((s) => s.id === selectedQaId) ?? QA_SCENARIOS[0];

  const appendEvent = (msg: string) => {
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    setEvents((prev) => [`[${ts}] ${msg}`, ...prev.slice(0, 18)]);
  };

  const runSimulationStep = (nextStep: number, activePolicy: LockPolicy) => {
    if (nextStep === 1) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === 'ag-1'
            ? { ...a, status: 'WRITING', targetFile: 'src/map/engine.ts' }
            : a.id === 'ag-4'
              ? { ...a, status: 'READING', targetFile: 'src/auth/rbac.ts' }
              : a
        )
      );
      setLocks((prev) =>
        prev.map((l) =>
          l.file === 'src/map/engine.ts'
            ? { ...l, mode: 'EXCLUSIVE_WRITE', holder: 'Claude-Agent (4102)' }
            : l.file === 'src/auth/rbac.ts'
              ? { ...l, mode: 'SHARED_READ', holder: 'Test-Runner (4309)' }
              : l
        )
      );
      appendEvent('LOCK_ACQUIRE · Claude-Agent acquired EXCLUSIVE_WRITE on src/map/engine.ts (v12)');
    } else if (nextStep === 2) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === 'ag-2'
            ? { ...a, status: 'BLOCKED_EBUSY', targetFile: 'src/map/engine.ts' }
            : a.id === 'ag-3'
              ? { ...a, status: 'WRITING', targetFile: 'src/api/telemetry.py' }
              : a
        )
      );
      setLocks((prev) =>
        prev.map((l) =>
          l.file === 'src/map/engine.ts'
            ? { ...l, conflictsPrevented: l.conflictsPrevented + 1 }
            : l.file === 'src/api/telemetry.py'
              ? { ...l, mode: 'EXCLUSIVE_WRITE', holder: 'Refactor-Bot (4215)' }
              : l
        )
      );
      appendEvent(
        activePolicy === 'handle-v1.0.3'
          ? 'CONFLICT_GUARD · Codex-Worker write to src/map/engine.ts REJECTED (EBUSY — held by PID 4102, stderr diff emitted)'
          : 'OPTIMISTIC_REJECT · Codex-Worker base v12 stale against active writer on src/map/engine.ts (DepGraph invalidation)'
      );
    } else if (nextStep === 3) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === 'ag-1'
            ? { ...a, status: 'COMMITTED' }
            : a.id === 'ag-2'
              ? { ...a, status: 'RETRY_BACKOFF' }
              : a
        )
      );
      setLocks((prev) =>
        prev.map((l) =>
          l.file === 'src/map/engine.ts'
            ? { ...l, version: l.version + 1, shaShort: 'b82e4d', mode: 'UNLOCKED', holder: '—' }
            : l
        )
      );
      appendEvent('COMMIT_OK · Claude-Agent flushed src/map/engine.ts → v13 (sha b82e4d); exclusive handle released');
      appendEvent('BACKOFF_RETRY · Codex-Worker re-reading fresh v13 snapshot before regenerating candidate');
    } else {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === 'ag-2' || a.id === 'ag-3' || a.id === 'ag-4'
            ? { ...a, status: 'COMMITTED' }
            : a
        )
      );
      setLocks((prev) =>
        prev.map((l) =>
          l.file === 'src/map/engine.ts'
            ? { ...l, version: l.version + 1, shaShort: 'd19c7a', mode: 'UNLOCKED', holder: '—' }
            : l.file === 'src/api/telemetry.py'
              ? { ...l, version: l.version + 1, shaShort: '99af02', mode: 'UNLOCKED', holder: '—' }
              : { ...l, mode: 'UNLOCKED', holder: '—' }
        )
      );
      appendEvent('STORM_COMPLETE · Codex-Worker committed cleanly on v14 & Refactor-Bot committed telemetry.py v9 — 0 silent overwrites!');
      setStormRunning(false);
    }
  };

  const handleTriggerStorm = () => {
    if (stormRunning) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStormRunning(true);
    setStepNum(1);
    runSimulationStep(1, policy);

    timerRef.current = window.setTimeout(() => {
      setStepNum(2);
      runSimulationStep(2, policy);
      timerRef.current = window.setTimeout(() => {
        setStepNum(3);
        runSimulationStep(3, policy);
        timerRef.current = window.setTimeout(() => {
          setStepNum(4);
          runSimulationStep(4, policy);
        }, 1450);
      }, 1450);
    }, 1250);
  };

  const handleStepOnce = () => {
    if (stormRunning) return;
    const next = stepNum >= 4 ? 1 : stepNum + 1;
    setStepNum(next);
    runSimulationStep(next, policy);
  };

  const handleReset = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStormRunning(false);
    setStepNum(0);
    setAgents(INITIAL_AGENTS);
    setLocks(INITIAL_LOCKS);
    appendEvent('MOUNT_RESET · Cleared simulated locks & restored clean baseline.');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
      {/* Top Dual-Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
            {bi(
              'Systems Engineering & Automated Visual QA Sandbox',
              '底层系统并发与自动化视觉 QA 沙盒'
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {bi(
              'Explore how ai-file-lock prevents multi-agent race conditions at the filesystem mount layer and how qa-cli produces verifiable Playwright video audits.',
              '实时模拟 ai-file-lock 如何在 FUSE/WinFsp 挂载层拦截多 Agent 并发写冲突，并检视 qa-cli 自动生成的 Playwright 录屏验收报告。'
            )}
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 font-mono text-xs dark:border-slate-800 dark:bg-obsidian-950">
          <button
            type="button"
            onClick={() => setTab('filelock')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition ${
              tab === 'filelock'
                ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <FileLock2 className="h-3.5 w-3.5" />
            <span>{bi('ai-file-lock Concurrency Sandbox', 'ai-file-lock 并发沙盒')}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('qacli')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition ${
              tab === 'qacli'
                ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>{bi('qa-cli Visual E2E Report Viewer', 'qa-cli 视觉 QA 报告检视')}</span>
          </button>
        </div>
      </div>

      {/* TAB A: AI-FILE-LOCK CONCURRENCY SIMULATOR */}
      {tab === 'filelock' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerStorm}
                disabled={stormRunning}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 font-mono text-xs font-bold text-white shadow-glow transition hover:bg-cyan-500 disabled:opacity-60 dark:bg-cyan-500 dark:text-slate-950"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>
                  {stormRunning
                    ? bi('Simulating Write Storm...', '正在模拟并发写风暴...')
                    : bi('Trigger Concurrent Write Storm', '触发多 Agent 并发写风暴')}
                </span>
              </button>

              <button
                type="button"
                onClick={handleStepOnce}
                disabled={stormRunning}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs font-semibold text-slate-700 hover:border-cyan-500 dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-200"
              >
                <StepForward className="h-3.5 w-3.5" />
                <span>{bi(`Step (${stepNum}/4)`, `单步推进 (${stepNum}/4)`)}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs text-slate-600 hover:border-cyan-500 dark:border-slate-700 dark:text-slate-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{bi('Reset', '重置挂载')}</span>
              </button>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 font-mono text-[11px] dark:border-slate-800 dark:bg-obsidian-950">
              <button
                type="button"
                onClick={() => setPolicy('handle-v1.0.3')}
                className={`rounded-md px-2.5 py-1 font-semibold ${
                  policy === 'handle-v1.0.3'
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-obsidian-800 dark:text-cyan-300'
                    : 'text-slate-500'
                }`}
              >
                {bi('Handle Lock (v1.0.3 Verified)', '句柄独占锁 (v1.0.3 稳定版)')}
              </button>
              <button
                type="button"
                onClick={() => setPolicy('optimistic-depgraph')}
                className={`rounded-md px-2.5 py-1 font-semibold ${
                  policy === 'optimistic-depgraph'
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-obsidian-800 dark:text-amber-300'
                    : 'text-slate-500'
                }`}
              >
                {bi('Optimistic + DepGraph (Exp.)', '乐观提交 + 依赖图 (实验性)')}
              </button>
            </div>
          </div>

          {/* 4 Concurrent AI Agents Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((ag) => (
              <div
                key={ag.id}
                className={`rounded-2xl border p-4 transition ${
                  ag.status === 'BLOCKED_EBUSY'
                    ? 'border-rose-500/60 bg-rose-500/10'
                    : ag.status === 'WRITING'
                      ? 'border-cyan-500/60 bg-cyan-500/10'
                      : ag.status === 'COMMITTED'
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-slate-200/90 bg-white dark:border-slate-800 dark:bg-obsidian-900'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Cpu className="h-3.5 w-3.5 text-cyan-500" />
                    {ag.name}
                  </span>
                  <span className="text-[10px] text-slate-400">PID {ag.pid}</span>
                </div>
                <div className="mt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {bi('Target:', '目标文件：')}{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{ag.targetFile}</strong>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                      ag.status === 'BLOCKED_EBUSY'
                        ? 'bg-rose-600 text-white'
                        : ag.status === 'WRITING'
                          ? 'bg-cyan-600 text-white'
                          : ag.status === 'RETRY_BACKOFF'
                            ? 'bg-amber-500 text-slate-950'
                            : ag.status === 'COMMITTED'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700 dark:bg-obsidian-850 dark:text-slate-300'
                    }`}
                  >
                    {ag.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* SQLite Lock Table + Event Stream */}
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-7">
              <h3 className="font-display text-base font-bold">
                {bi('SQLite Active Handle Lock & Version Table', 'SQLite 活跃句柄锁与版本状态表')}
              </h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-slate-200 text-[10px] uppercase text-slate-400 dark:border-slate-800">
                    <tr>
                      <th className="py-2">{bi('Mounted File', '挂载文件')}</th>
                      <th className="py-2">{bi('Ver / SHA', '版本 / SHA')}</th>
                      <th className="py-2">{bi('Lock Mode', '锁状态')}</th>
                      <th className="py-2">{bi('Holder', '持有者')}</th>
                      <th className="py-2 text-right">{bi('Blocked Races', '拦截冲突')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                    {locks.map((row) => (
                      <tr key={row.file}>
                        <td className="py-2.5 font-semibold text-cyan-700 dark:text-cyan-400">
                          {row.file}
                        </td>
                        <td className="py-2.5">
                          v{row.version} <span className="text-slate-400">({row.shaShort})</span>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              row.mode === 'EXCLUSIVE_WRITE'
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                                : row.mode === 'SHARED_READ'
                                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                                  : 'bg-slate-100 text-slate-500 dark:bg-obsidian-950'
                            }`}
                          >
                            {row.mode}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-300">{row.holder}</td>
                        <td className="py-2.5 text-right font-bold text-rose-500">
                          {row.conflictsPrevented}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 font-mono text-[11px] text-slate-200 lg:col-span-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Terminal className="h-4 w-4" />
                <span>{bi('FUSE / WinFsp Kernel Event Stream', 'FUSE / WinFsp 内核挂载事件流')}</span>
              </div>
              <div className="max-h-56 space-y-1.5 overflow-y-auto">
                {events.map((ev, idx) => (
                  <div
                    key={idx}
                    className={
                      ev.includes('CONFLICT') || ev.includes('REJECT')
                        ? 'text-rose-400'
                        : ev.includes('COMMIT') || ev.includes('COMPLETE')
                          ? 'text-emerald-400'
                          : 'text-slate-300'
                    }
                  >
                    {ev}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: QA-CLI HEADLESS VISUAL & E2E AUDIT REPORT VIEWER */}
      {tab === 'qacli' && (
        <div className="space-y-4">
          {/* Summary KPI Row */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: bi('Audited Apps', '验收应用'), val: bi('3 Suites', '3 套系统') },
              { label: bi('Scenarios Verified', '通过场景'), val: '12 / 12' },
              { label: bi('Test Assertions', '断言用例'), val: bi('40 Passed (100%)', '40 项全通过 (100%)') },
              { label: bi('Console & Layout Errors', '控制台与布局报错'), val: bi('0 Errors', '0 报错') },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900"
              >
                <div className="font-mono text-[10px] uppercase text-slate-400">{k.label}</div>
                <div className="mt-1 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {k.val}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            {/* Left: Scenario Selector */}
            <div className="space-y-2.5 lg:col-span-4">
              {QA_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setSelectedQaId(sc.id);
                    setFrameIdx(0);
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedQa.id === sc.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-200/90 bg-white dark:border-slate-800 dark:bg-obsidian-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{sc.id}</span>
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-300">
                      PASS · {sc.durationSec}s
                    </span>
                  </div>
                  <div className="mt-1 font-display text-sm font-bold">{sc.app}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{sc.name}</div>
                </button>
              ))}
            </div>

            {/* Right: Detailed Report & Interactive Keyframe Scrubber */}
            <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-8">
              {/* Simulated FFmpeg MP4 Keyframe Scrubber */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-100">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Play className="h-3.5 w-3.5" />
                    <span>
                      {bi(
                        'Playwright + FFmpeg MP4 Keyframe Inspector',
                        'Playwright + FFmpeg 关键帧录屏检视器'
                      )}
                    </span>
                  </span>
                  <span className="text-emerald-400">{selectedQa.keyframes[frameIdx].t}</span>
                </div>

                <div className="mt-3 rounded-lg border border-slate-800 bg-obsidian-900 p-4 font-mono text-xs">
                  <div className="text-[10px] uppercase text-slate-400">
                    {bi('Frame', '关键帧')} {frameIdx + 1} / {selectedQa.keyframes.length} ·{' '}
                    {bi('Selector:', '选择器：')}{' '}
                    <span className="text-cyan-300">{selectedQa.keyframes[frameIdx].selector}</span>
                  </div>
                  <div className="mt-1 font-display text-base font-bold text-white">
                    {selectedQa.keyframes[frameIdx].label}
                  </div>
                  <div className="mt-1 text-emerald-300">
                    ✓ {selectedQa.keyframes[frameIdx].state}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2">
                  {selectedQa.keyframes.map((kf, idx) => (
                    <button
                      key={kf.t}
                      type="button"
                      onClick={() => setFrameIdx(idx)}
                      className={`rounded-lg border px-2 py-1.5 text-left font-mono text-[10px] transition ${
                        frameIdx === idx
                          ? 'border-cyan-400 bg-cyan-500/20 text-white'
                          : 'border-slate-800 bg-obsidian-950 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold">{kf.t}</div>
                      <div className="truncate">{kf.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Assertions + HTTP Waterfall */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-mono text-xs font-semibold uppercase text-slate-500">
                    {bi('E2E & DOM Assertions', 'E2E 与 DOM 自动化断言')}
                  </h4>
                  <ul className="mt-2 space-y-2 text-xs">
                    {selectedQa.assertions.map((a) => (
                      <li key={a.check} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span>{a.check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-xs font-semibold uppercase text-slate-500">
                    {bi('HTTP Request Waterfall', 'HTTP 请求瀑布流')}
                  </h4>
                  <div className="mt-2 space-y-2 font-mono text-[11px]">
                    {selectedQa.requests.map((r) => (
                      <div
                        key={r.endpoint}
                        className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1.5 dark:border-slate-800 dark:bg-obsidian-950"
                      >
                        <span className="truncate pr-2">{r.endpoint}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              r.status >= 400
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                            }`}
                          >
                            {r.status}
                          </span>
                          <span className="text-slate-400">{r.ms}ms</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 font-mono text-[11px] dark:border-slate-800 dark:bg-obsidian-950">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {bi('Overflow:', '水平溢出：')} {selectedQa.domAudit.overflowPx}px
                </span>
                <span>{bi('Console Errors:', '控制台报错：')} {selectedQa.domAudit.consoleErrors}</span>
                <span>{bi('Broken Images:', '破损图片：')} {selectedQa.domAudit.brokenImages}</span>
                <span>{bi('Typography / CJK Metrics: PASS', '中英文排版检测：PASS')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
