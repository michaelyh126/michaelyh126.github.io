import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AudioWaveform,
  BookOpen,
  Cpu,
  Download,
  Layers,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

type LabTab = 'spectrogram' | 'sbupnet';

interface BBoxAnnotation {
  id: string;
  label: string;
  color: string;
  /** Normalized coordinates [0..1] on the canvas */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const ACOUSTIC_CLASSES = [
  { name: 'Harmonic Sweep A', color: '#38BDF8' },
  { name: 'Broadband Pulse B', color: '#10B981' },
  { name: 'Low-Freq Call C', color: '#F59E0B' },
  { name: 'Ambient Artifact', color: '#F43F5E' },
];

const INITIAL_BOXES: BBoxAnnotation[] = [
  { id: 'box-1', label: 'Harmonic Sweep A', color: '#38BDF8', x1: 0.12, y1: 0.24, x2: 0.34, y2: 0.56 },
  { id: 'box-2', label: 'Broadband Pulse B', color: '#10B981', x1: 0.48, y1: 0.16, x2: 0.62, y2: 0.68 },
  { id: 'box-3', label: 'Low-Freq Call C', color: '#F59E0B', x1: 0.72, y1: 0.62, x2: 0.89, y2: 0.86 },
];

interface BenchmarkRow {
  model: string;
  miou: number;
  fps: number;
  vramGb: number;
  trainHours: number;
  highlight?: boolean;
  note: string;
}

const BENCHMARKS: BenchmarkRow[] = [
  { model: 'SBUPNet (Ours · IEEE SMC ’26)', miou: 76.5, fps: 9.49, vramGb: 10.4, trainHours: 14.2, highlight: true, note: 'Uncertainty-guided slim branch; +20% FPS & -35% VRAM/time vs ISDNet' },
  { model: 'ISDNet (CVPR ’22 Baseline)', miou: 74.2, fps: 7.91, vramGb: 16.0, trainHours: 21.8, note: 'Dual-branch global/local UHR segmentation baseline' },
  { model: 'FCtL (ICCV ’21)', miou: 73.7, fps: 1.42, vramGb: 18.6, trainHours: 29.5, note: 'Multi-crop contextual fusion — slow inference' },
  { model: 'GLNet (CVPR ’19)', miou: 71.2, fps: 0.85, vramGb: 19.2, trainHours: 34.0, note: 'Heavy global-local sharing — high latency' },
  { model: 'BiSeNetV2 (Downsampled)', miou: 67.8, fps: 18.4, vramGb: 6.2, trainHours: 8.5, note: 'Fast global pass, loses fine UHR boundary detail' },
];

const ARCH_STAGES = [
  {
    step: '01',
    title: 'Global Context Branch',
    detail: 'Processes downsampled ultra-high-resolution aerial frame (5000×5000 → 1/4 scale) in a single lightweight pass to capture macro road/building topology.',
  },
  {
    step: '02',
    title: 'Pixel Uncertainty Estimator',
    detail: 'Computes per-pixel prediction entropy directly from global logits—pinpointing crisp object edges and ambiguous boundaries while ignoring uniform background.',
  },
  {
    step: '03',
    title: 'Selective Top-K Patch Routing',
    detail: 'Routes only the highest-uncertainty spatial regions into the high-resolution refinement branch—cutting FLOPs and peak VRAM by ~35% compared to dense full-frame branches.',
  },
  {
    step: '04',
    title: 'Uncertainty-Guided Fusion Head',
    detail: 'Re-injects refined high-resolution features strictly at uncertain pixel coordinates, yielding 76.5% mIoU at 9.49 FPS on Inria Aerial.',
  },
];

/** Map energy [0..1] to an Inferno/Cyan scientific colormap RGB tuple */
function spectrogramColor(val: number): [number, number, number] {
  const v = Math.max(0, Math.min(1, val));
  if (v < 0.25) {
    const t = v / 0.25;
    return [Math.round(8 + t * 20), Math.round(14 + t * 34), Math.round(32 + t * 68)];
  }
  if (v < 0.55) {
    const t = (v - 0.25) / 0.3;
    return [Math.round(28 + t * 22), Math.round(48 + t * 135), Math.round(100 + t * 125)];
  }
  if (v < 0.8) {
    const t = (v - 0.55) / 0.25;
    return [Math.round(50 + t * 195), Math.round(183 + t * 40), Math.round(225 - t * 145)];
  }
  const t = (v - 0.8) / 0.2;
  return [255, Math.round(223 + t * 32), Math.round(80 + t * 165)];
}

export default function AILabDemo() {
  const { bi } = useLanguage();
  const [tab, setTab] = useState<LabTab>('sbupnet');

  // Spectrogram Workbench State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [boxes, setBoxes] = useState<BBoxAnnotation[]>(INITIAL_BOXES);
  const [activeClass, setActiveClass] = useState(ACOUSTIC_CLASSES[0]);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(INITIAL_BOXES[0].id);
  const [gain, setGain] = useState(1.15);
  const [showGrid, setShowGrid] = useState(true);
  const [draftBox, setDraftBox] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // SBUPNet Explorer State
  const [activeStage, setActiveStage] = useState(0);

  // Procedurally paint 100% synthetic harmonic spectrogram onto HTML5 Canvas
  useEffect(() => {
    if (tab !== 'spectrogram') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const img = ctx.createImageData(W, H);
    const data = img.data;

    for (let y = 0; y < H; y++) {
      const freqNorm = 1 - y / H; // 0 (low Hz) -> 1 (high Hz)
      for (let x = 0; x < W; x++) {
        const tNorm = x / W; // 0..10s

        // Synthetic ambient noise floor (deterministic pseudo-noise)
        const noise =
          0.11 +
          0.04 * Math.sin(x * 12.9898 + y * 78.233) * Math.cos(x * 0.7 - y * 0.4);

        // Synthetic Signal 1: Rising dual-harmonic frequency sweep around t=0.12..0.34
        let energy = noise;
        if (tNorm >= 0.11 && tNorm <= 0.35) {
          const localT = (tNorm - 0.11) / 0.24;
          const f1 = 0.44 + 0.22 * Math.sin(localT * Math.PI);
          const f2 = f1 + 0.14;
          const env = Math.sin(localT * Math.PI);
          energy += env * 0.78 * Math.exp(-Math.pow((freqNorm - f1) / 0.025, 2));
          energy += env * 0.48 * Math.exp(-Math.pow((freqNorm - f2) / 0.022, 2));
        }

        // Synthetic Signal 2: Broadband pulsed clicks around t=0.49..0.61
        if (tNorm >= 0.49 && tNorm <= 0.61) {
          const pulse = Math.pow(Math.max(0, Math.sin((tNorm - 0.49) * 180)), 6);
          const band = Math.exp(-Math.pow((freqNorm - 0.58) / 0.22, 2));
          energy += pulse * band * 0.85;
        }

        // Synthetic Signal 3: Low-frequency modulated tone around t=0.73..0.88
        if (tNorm >= 0.73 && tNorm <= 0.88) {
          const localT = (tNorm - 0.73) / 0.15;
          const fLow = 0.24 + 0.04 * Math.sin(localT * 14);
          const env = Math.sin(localT * Math.PI);
          energy += env * 0.75 * Math.exp(-Math.pow((freqNorm - fLow) / 0.032, 2));
        }

        const [r, g, b] = spectrogramColor(energy * gain);
        const idx = (y * W + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);

    // Optional Time-Frequency Reference Grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.16)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 10; i++) {
        const gx = (i / 10) * W;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let j = 1; j < 6; j++) {
        const gy = (j / 6) * H;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }
    }

    // Draw saved annotations
    const drawRect = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string,
      label: string,
      selected: boolean
    ) => {
      const rx = Math.min(x1, x2) * W;
      const ry = Math.min(y1, y2) * H;
      const rw = Math.abs(x2 - x1) * W;
      const rh = Math.abs(y2 - y1) * H;
      ctx.fillStyle = `${color}28`;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = color;
      ctx.lineWidth = selected ? 2.8 : 1.8;
      ctx.strokeRect(rx, ry, rw, rh);

      if (label) {
        ctx.font = '600 11px "JetBrains Mono", monospace';
        const tw = ctx.measureText(label).width + 10;
        ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
        ctx.fillRect(rx, Math.max(0, ry - 18), tw, 18);
        ctx.fillStyle = color;
        ctx.fillText(label, rx + 5, Math.max(12, ry - 5));
      }
    };

    for (const b of boxes) {
      drawRect(b.x1, b.y1, b.x2, b.y2, b.color, b.label, b.id === selectedBoxId);
    }

    if (draftBox) {
      drawRect(
        draftBox.x1,
        draftBox.y1,
        draftBox.x2,
        draftBox.y2,
        activeClass.color,
        activeClass.name,
        true
      );
    }
  }, [tab, boxes, draftBox, selectedBoxId, gain, showGrid, activeClass]);

  const getNormCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getNormCoords(e);
    setDraftBox({ x1: x, y1: y, x2: x, y2: y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draftBox) return;
    const { x, y } = getNormCoords(e);
    setDraftBox((prev) => (prev ? { ...prev, x2: x, y2: y } : null));
  };

  const handleMouseUp = () => {
    if (!draftBox) return;
    const w = Math.abs(draftBox.x2 - draftBox.x1);
    const h = Math.abs(draftBox.y2 - draftBox.y1);
    if (w > 0.02 && h > 0.02) {
      const id = `box-${Date.now().toString().slice(-4)}`;
      const created: BBoxAnnotation = {
        id,
        label: activeClass.name,
        color: activeClass.color,
        x1: Math.min(draftBox.x1, draftBox.x2),
        y1: Math.min(draftBox.y1, draftBox.y2),
        x2: Math.max(draftBox.x1, draftBox.x2),
        y2: Math.max(draftBox.y1, draftBox.y2),
      };
      setBoxes((prev) => [...prev, created]);
      setSelectedBoxId(id);
    }
    setDraftBox(null);
  };

  const exportJson = () => {
    const payload = {
      source: 'procedural_synthetic_spectrogram_10s_12kHz',
      annotations: boxes.map((b) => ({
        id: b.id,
        label: b.label,
        t_start_sec: Number((b.x1 * 10).toFixed(2)),
        t_end_sec: Number((b.x2 * 10).toFixed(2)),
        f_min_hz: Math.round((1 - b.y2) * 12000),
        f_max_hz: Math.round((1 - b.y1) * 12000),
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synthetic_spectrogram_annotations.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const stageZh: Record<string, { title: string; detail: string }> = {
    '01': {
      title: '全局语义上下文分支',
      detail: '对超高分辨率遥感影像（5000×5000 → 1/4 尺度）进行轻量全局前向推理，快速提取道路、建筑等宏观拓扑结构。',
    },
    '02': {
      title: '像素不确定性估计器',
      detail: '直接基于全局 logits 计算逐像素预测熵，精准锁定细碎目标边缘与高歧义边界，跳过大片均匀背景区域。',
    },
    '03': {
      title: 'Top-K 不确定区域选择性路由',
      detail: '仅将最高不确定性的局部区域送入高分辨率细化分支，相比整图双分支显著降低约 35% 训练耗时与峰值显存。',
    },
    '04': {
      title: '不确定性引导融合头',
      detail: '仅在不确定像素坐标精准回注高分辨率边界特征，在 Inria Aerial 上实现 76.5% mIoU 与 9.49 FPS 实时吞吐。',
    },
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
      {/* Header & Tab Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
            {bi(
              'SBUPNet Research Lab & Acoustic Spectrogram Workbench',
              'SBUPNet 论文实验台与生物声学标注沙盒'
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {bi(
              'Explore the published IEEE SMC 2026 SBUPNet accuracy/speed Pareto frontier or click-and-drag to label procedurally synthesized acoustic signals.',
              '交互式检视 IEEE SMC 2026 录用论文 SBUPNet 的精度-速度帕累托前沿与网络架构，或体验浏览器端合成声谱图拉框标注。'
            )}
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 font-mono text-xs dark:border-slate-800 dark:bg-obsidian-950">
          <button
            type="button"
            onClick={() => setTab('sbupnet')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition ${
              tab === 'sbupnet'
                ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{bi('SBUPNet (IEEE SMC ’26)', 'SBUPNet 论文基准 (IEEE ’26)')}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('spectrogram')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition ${
              tab === 'spectrogram'
                ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <AudioWaveform className="h-3.5 w-3.5" />
            <span>{bi('Spectrogram Annotator', '声谱图拉框标注')}</span>
          </button>
        </div>
      </div>

      {/* TAB A: BIO-ACOUSTIC SPECTROGRAM ANNOTATOR */}
      {tab === 'spectrogram' && (
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {ACOUSTIC_CLASSES.map((cls) => (
                  <button
                    key={cls.name}
                    type="button"
                    onClick={() => setActiveClass(cls)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition ${
                      activeClass.name === cls.name
                        ? 'border-cyan-500 bg-cyan-500/15 text-slate-950 dark:text-white'
                        : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: cls.color }} />
                    <span>{cls.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <label className="flex items-center gap-1.5">
                  <span className="text-slate-400">{bi('Gain', '增益')}</span>
                  <input
                    type="range"
                    min={0.7}
                    max={1.8}
                    step={0.05}
                    value={gain}
                    onChange={(e) => setGain(Number(e.target.value))}
                    className="w-20 accent-cyan-500"
                  />
                </label>
                <label className="flex cursor-pointer items-center gap-1">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="accent-cyan-500"
                  />
                  <span>{bi('Grid', '网格')}</span>
                </label>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <canvas
                ref={canvasRef}
                width={800}
                height={340}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="block h-auto w-full cursor-crosshair select-none"
              />
              <div className="flex justify-between border-t border-slate-800 bg-slate-950/95 px-3 py-1.5 font-mono text-[10px] text-slate-400">
                <span>
                  {bi(
                    '0.0 s (Y-axis: 0 – 12.0 kHz) · Click & drag anywhere to draw box',
                    '0.0 s（纵轴 0 – 12.0 kHz）· 在画布任意处按住拖拽即可新建标注框'
                  )}
                </span>
                <span>{bi('10.0 s · 100% Procedurally Synthesized Signal', '10.0 s · 100% 数学合成信号')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold">
                  {bi(`Bounding Box Regions (${boxes.length})`, `标注框列表 (${boxes.length})`)}
                </h3>
                <button
                  type="button"
                  onClick={exportJson}
                  className="inline-flex items-center gap-1 rounded-lg bg-cyan-600 px-2.5 py-1.5 font-mono text-[11px] font-bold text-white dark:bg-cyan-500 dark:text-slate-950"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{bi('Export JSON', '导出 JSON')}</span>
                </button>
              </div>

              <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
                {boxes.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBoxId(b.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 font-mono text-xs transition ${
                      selectedBoxId === b.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-obsidian-950/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: b.color }} />
                        <span>{b.label}</span>
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500">
                        {(b.x1 * 10).toFixed(2)}s–{(b.x2 * 10).toFixed(2)}s ·{' '}
                        {Math.round((1 - b.y2) * 12000)}–{Math.round((1 - b.y1) * 12000)} Hz
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoxes((prev) => prev.filter((item) => item.id !== b.id));
                      }}
                      className="rounded p-1 text-slate-400 hover:text-rose-500"
                      aria-label="Delete box"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-950 p-3 font-mono text-[10px] text-cyan-300">
              <div className="text-slate-400">// Live Annotation Count</div>
              <div>
                boxes: {boxes.length} · active_class: &quot;{activeClass.name}&quot;
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: SBUPNET (IEEE SMC 2026) BENCHMARK EXPLORER */}
      {tab === 'sbupnet' && (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-12">
            {/* Pareto Scatter Plot (mIoU vs FPS) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-7">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold">
                    {bi(
                      'Inria Aerial UHR Benchmark: Accuracy (mIoU) vs. Speed (FPS)',
                      'Inria Aerial 超高分辨率基准：分割精度 (mIoU) vs 速度 (FPS)'
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {bi(
                      'Upper-right = stronger accuracy-speed Pareto frontier.',
                      '越靠右上方代表综合精度与推理吞吐帕累托优势越强。'
                    )}
                  </p>
                </div>
                <Activity className="h-5 w-5 text-cyan-500" />
              </div>

              <svg viewBox="0 0 540 250" className="mt-4 h-60 w-full">
                {/* Axes */}
                <line x1="54" y1="20" x2="54" y2="210" stroke="#475569" strokeWidth="1.2" />
                <line x1="54" y1="210" x2="515" y2="210" stroke="#475569" strokeWidth="1.2" />

                {/* Y Labels (mIoU 65..80) */}
                {[65, 70, 75, 80].map((v) => {
                  const y = 210 - ((v - 65) / 15) * 185;
                  return (
                    <g key={v}>
                      <line x1="54" x2="515" y1={y} y2={y} stroke="#334155" strokeDasharray="3 4" strokeOpacity="0.4" />
                      <text x="46" y={y + 3} textAnchor="end" className="fill-slate-400 font-mono text-[10px]">
                        {v}%
                      </text>
                    </g>
                  );
                })}

                {/* X Labels (FPS 0..20) */}
                {[0, 5, 10, 15, 20].map((v) => {
                  const x = 54 + (v / 20) * 455;
                  return (
                    <text key={v} x={x} y="228" textAnchor="middle" className="fill-slate-400 font-mono text-[10px]">
                      {v} FPS
                    </text>
                  );
                })}

                {/* Points */}
                {BENCHMARKS.map((b) => {
                  const cx = 54 + (b.fps / 20) * 455;
                  const cy = 210 - ((b.miou - 65) / 15) * 185;
                  return (
                    <g key={b.model}>
                      {b.highlight && <circle cx={cx} cy={cy} r="14" fill="rgba(56, 189, 248, 0.25)" />}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={b.highlight ? 7 : 5}
                        fill={b.highlight ? '#38BDF8' : '#94A3B8'}
                        stroke="#0F172A"
                        strokeWidth="1.5"
                      />
                      <text
                        x={cx + (b.fps > 14 ? -10 : 10)}
                        y={cy + (b.highlight ? -10 : 4)}
                        textAnchor={b.fps > 14 ? 'end' : 'start'}
                        className={`font-mono text-[10px] font-bold ${
                          b.highlight ? 'fill-cyan-400' : 'fill-slate-400'
                        }`}
                      >
                        {b.model.split(' ')[0]} ({b.miou}%, {b.fps} FPS)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Interactive Slim-Branch Architecture Diagram */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-5">
              <div className="flex items-center gap-2 font-display text-base font-bold">
                <Layers className="h-4 w-4 text-cyan-500" />
                <span>
                  {bi('Uncertainty-Guided Slim-Branch Pipeline', '不确定像素引导轻量化双分支架构')}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {bi(
                  'Click any pipeline stage to inspect how SBUPNet cuts VRAM & training cost by ~35%.',
                  '点击下方任意阶段，了解 SBUPNet 如何降低约 35% 显存与训练成本。'
                )}
              </p>

              <div className="mt-4 space-y-2">
                {ARCH_STAGES.map((st, idx) => (
                  <button
                    key={st.step}
                    type="button"
                    onClick={() => setActiveStage(idx)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      activeStage === idx
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-xs font-bold">
                      <span className="text-cyan-600 dark:text-cyan-400">STAGE {st.step}</span>
                      <span className="font-display text-sm text-slate-950 dark:text-white">
                        {bi(st.title, stageZh[st.step]?.title ?? st.title)}
                      </span>
                    </div>
                    {activeStage === idx && (
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {bi(st.detail, stageZh[st.step]?.detail ?? st.detail)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Benchmark Comparison Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900">
            <div className="flex items-center gap-2 font-display text-base font-bold">
              <Cpu className="h-4 w-4 text-emerald-500" />
              <span>
                {bi(
                  'Quantitative Comparison (Inria Aerial UHR Benchmark)',
                  '定量指标对比（Inria Aerial 超高分辨率遥感基准）'
                )}
              </span>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-slate-200 text-[10px] uppercase text-slate-400 dark:border-slate-800">
                  <tr>
                    <th className="py-2">{bi('Model', '模型')}</th>
                    <th className="py-2">mIoU (%)</th>
                    <th className="py-2">{bi('Throughput (FPS)', '推理速度 (FPS)')}</th>
                    <th className="py-2">{bi('Peak VRAM', '峰值显存')}</th>
                    <th className="py-2">{bi('Train Time', '训练时长')}</th>
                    <th className="py-2">{bi('Notes', '特点说明')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                  {BENCHMARKS.map((row) => (
                    <tr
                      key={row.model}
                      className={row.highlight ? 'bg-cyan-500/10 font-bold' : ''}
                    >
                      <td className="py-2.5 text-slate-950 dark:text-white">{row.model}</td>
                      <td className="py-2.5 text-cyan-600 dark:text-cyan-400">{row.miou}%</td>
                      <td className="py-2.5 text-emerald-600 dark:text-emerald-400">
                        {row.fps} FPS
                      </td>
                      <td className="py-2.5">{row.vramGb} GB</td>
                      <td className="py-2.5">{row.trainHours} h</td>
                      <td className="py-2.5 font-sans text-xs text-slate-500 dark:text-slate-400">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
