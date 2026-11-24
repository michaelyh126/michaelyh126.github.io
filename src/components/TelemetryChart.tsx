import { useState } from 'react';
import type { TelemetryPoint } from '../data/stations';

export type TelemetryMetric = 'waterLevelM' | 'salinityPsu' | 'tempC';

interface TelemetryChartProps {
  series: TelemetryPoint[];
  metric: TelemetryMetric;
  onMetricChange: (metric: TelemetryMetric) => void;
}

const METRIC_META: Record<
  TelemetryMetric,
  { label: string; shortLabel: string; unit: string; stroke: string; fillStart: string; badgeClass: string }
> = {
  waterLevelM: {
    label: 'Water Level (MLLW)',
    shortLabel: 'Water Level',
    unit: 'm',
    stroke: '#38BDF8',
    fillStart: 'rgba(56, 189, 248, 0.28)',
    badgeClass: 'text-sky-600 dark:text-sky-300',
  },
  salinityPsu: {
    label: 'Salinity',
    shortLabel: 'Salinity',
    unit: 'PSU',
    stroke: '#10B981',
    fillStart: 'rgba(16, 185, 129, 0.26)',
    badgeClass: 'text-emerald-600 dark:text-emerald-300',
  },
  tempC: {
    label: 'Water Temp',
    shortLabel: 'Temp',
    unit: '°C',
    stroke: '#F59E0B',
    fillStart: 'rgba(245, 158, 11, 0.24)',
    badgeClass: 'text-amber-600 dark:text-amber-300',
  },
};

export function TelemetryChart({ series, metric, onMetricChange }: TelemetryChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const meta = METRIC_META[metric];

  const values = series.map((pt) => pt[metric]);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const meanVal = values.reduce((acc, v) => acc + v, 0) / values.length;
  const padding = Math.max((rawMax - rawMin) * 0.18, 0.2);
  const minDomain = rawMin - padding;
  const maxDomain = rawMax + padding;
  const domainSpan = maxDomain - minDomain || 1;

  const width = 420;
  const height = 164;
  const padLeft = 38;
  const padRight = 12;
  const padTop = 14;
  const padBottom = 24;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const coords = series.map((pt, i) => {
    const x = padLeft + (i / Math.max(series.length - 1, 1)) * innerW;
    const normalizedY = (pt[metric] - minDomain) / domainSpan;
    const y = padTop + innerH - normalizedY * innerH;
    return { x, y, pt, value: pt[metric] };
  });

  const polylinePoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaPath =
    coords.length > 0
      ? `M ${coords[0].x.toFixed(1)} ${(padTop + innerH).toFixed(1)} ` +
        coords.map((c) => `L ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ') +
        ` L ${coords[coords.length - 1].x.toFixed(1)} ${(padTop + innerH).toFixed(1)} Z`
      : '';

  const activeIndex = hoverIdx ?? series.length - 1;
  const activePoint = coords[activeIndex] ?? coords[0];
  const gradientId = `telemetry-grad-${metric}`;

  const yTicks = [0, 0.5, 1].map((ratio) => {
    const val = maxDomain - ratio * domainSpan;
    const y = padTop + ratio * innerH;
    return { val, y };
  });

  return (
    <div className="space-y-3">
      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 dark:border-slate-800 dark:bg-obsidian-950">
          {(Object.keys(METRIC_META) as TelemetryMetric[]).map((key) => {
            const active = key === metric;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onMetricChange(key)}
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-medium transition ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-obsidian-800 dark:text-cyan-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {METRIC_META[key].shortLabel}
              </button>
            );
          })}
        </div>

        {activePoint && (
          <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
            <span className="text-slate-400 dark:text-slate-500">{activePoint.pt.hourLabel} UTC · </span>
            <span className={`font-semibold ${meta.badgeClass}`}>
              {activePoint.value.toFixed(metric === 'tempC' ? 1 : 2)} {meta.unit}
            </span>
          </div>
        )}
      </div>

      {/* Responsive Interactive SVG Chart */}
      <div
        className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/70 p-2 dark:border-slate-800/90 dark:bg-obsidian-950/80"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-40 w-full select-none overflow-visible"
          role="img"
          aria-label={`24-hour ${meta.label} telemetry chart`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={meta.fillStart} />
              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={tick.y}
                y2={tick.y}
                stroke="currentColor"
                className="text-slate-300/70 dark:text-slate-700/70"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padLeft - 6}
                y={tick.y + 3}
                textAnchor="end"
                className="fill-slate-500 font-mono text-[9px] dark:fill-slate-400"
              >
                {tick.val.toFixed(metric === 'tempC' ? 0 : 1)}
              </text>
            </g>
          ))}

          {/* X-Axis Time Markers */}
          {[0, 6, 12, 18, 23].map((idx) => {
            const pt = coords[idx];
            if (!pt) return null;
            return (
              <text
                key={idx}
                x={pt.x}
                y={height - 5}
                textAnchor="middle"
                className="fill-slate-500 font-mono text-[9px] dark:fill-slate-400"
              >
                {pt.pt.hourLabel}
              </text>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Line Stroke */}
          <polyline
            fill="none"
            stroke={meta.stroke}
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={polylinePoints}
          />

          {/* Active Crosshair */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                x2={activePoint.x}
                y1={padTop}
                y2={padTop + innerH}
                stroke={meta.stroke}
                strokeOpacity="0.45"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <circle cx={activePoint.x} cy={activePoint.y} r="6" fill={meta.stroke} fillOpacity="0.22" />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="3.2"
                fill={meta.stroke}
                stroke="#0F172A"
                strokeWidth="1.2"
              />
            </g>
          )}

          {/* Invisible Hover Columns */}
          {coords.map((c, idx) => {
            const colW = innerW / Math.max(coords.length - 1, 1);
            return (
              <rect
                key={idx}
                x={c.x - colW / 2}
                y={padTop}
                width={colW}
                height={innerH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIdx(idx)}
                onClick={() => setHoverIdx(idx)}
              />
            );
          })}
        </svg>
      </div>

      {/* 24h KPI Strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Latest', val: values[values.length - 1] },
          { label: '24h Min', val: rawMin },
          { label: '24h Max', val: rawMax },
          { label: '24h Avg', val: meanVal },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-200/80 bg-white px-2.5 py-2 dark:border-slate-800 dark:bg-obsidian-950/70"
          >
            <div className="font-mono text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {item.label}
            </div>
            <div className="mt-0.5 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
              {item.val.toFixed(metric === 'tempC' ? 1 : 2)}
              <span className="ml-0.5 text-[10px] font-normal text-slate-400">{meta.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
