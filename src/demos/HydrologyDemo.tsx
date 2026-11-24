import { useMemo, useState } from 'react';
import {
  Activity,
  AlertOctagon,
  Database,
  Download,
  Radio,
  Search,
  Waves,
  Zap,
} from 'lucide-react';
import { MONITORING_STATIONS, type MonitoringStation } from '../data/stations';

type TimeRange = '24H' | '7D' | '30D';
type HydroMetric = 'waterLevelM' | 'salinityPsu' | 'dissolvedO2' | 'turbidityNtu';

interface MockFeed {
  id: string;
  name: string;
  protocol: string;
  stations: number;
  latencyMs: number;
  status: 'healthy' | 'degraded';
}

const MOCK_FEEDS: MockFeed[] = [
  { id: 'f1', name: 'NOAA-Mock-Atlantic', protocol: 'HTTPS JSON', stations: 2480, latencyMs: 142, status: 'healthy' },
  { id: 'f2', name: 'NOAA-Mock-Pacific', protocol: 'HTTPS JSON', stations: 2150, latencyMs: 158, status: 'healthy' },
  { id: 'f3', name: 'ISD-Coastal-Synoptic', protocol: 'SFTP / CSV', stations: 4820, latencyMs: 310, status: 'healthy' },
  { id: 'f4', name: 'METAR-Marine-Airports', protocol: 'REST Stream', stations: 3640, latencyMs: 96, status: 'healthy' },
  { id: 'f5', name: 'Estuary-Buoy-Network', protocol: 'MQTT / JSON', stations: 1290, latencyMs: 84, status: 'healthy' },
  { id: 'f6', name: 'NorthSea-TideGauge-Sim', protocol: 'OGC SOS', stations: 1840, latencyMs: 175, status: 'healthy' },
  { id: 'f7', name: 'EastAsia-Delta-CTD', protocol: 'FastAPI Push', stations: 2110, latencyMs: 112, status: 'healthy' },
  { id: 'f8', name: 'Baltic-Salinity-Array', protocol: 'NetCDF Poll', stations: 960, latencyMs: 224, status: 'healthy' },
  { id: 'f9', name: 'Gulf-Surge-Telemetry', protocol: 'Webhook', stations: 1140, latencyMs: 138, status: 'healthy' },
  { id: 'f10', name: 'Adriatic-Lagoon-Nodes', protocol: 'REST JSON', stations: 640, latencyMs: 410, status: 'degraded' },
  { id: 'f11', name: 'RiverMouth-ADCP-Feed', protocol: 'Binary TCP', stations: 890, latencyMs: 129, status: 'healthy' },
  { id: 'f12', name: 'Shelf-Thermistor-Grid', protocol: 'HTTPS Batch', stations: 1180, latencyMs: 190, status: 'healthy' },
  { id: 'f13', name: 'Port-Barometer-Net', protocol: 'REST JSON', stations: 720, latencyMs: 105, status: 'healthy' },
  { id: 'f14', name: 'Tidal-Harmonic-Ref', protocol: 'Cron Sync', stations: 480, latencyMs: 88, status: 'healthy' },
  { id: 'f15', name: 'Turbidity-Optical-Sim', protocol: 'MQTT', stations: 390, latencyMs: 119, status: 'healthy' },
  { id: 'f16', name: 'Dissolved-O2-Sondes', protocol: 'HTTPS JSON', stations: 310, latencyMs: 147, status: 'healthy' },
  { id: 'f17', name: 'Glacial-Plume-Buoys', protocol: 'Iridium Mock', stations: 195, latencyMs: 520, status: 'degraded' },
  { id: 'f18', name: 'Wetland-Piezo-Array', protocol: 'LoRaWAN Sim', stations: 245, latencyMs: 131, status: 'healthy' },
];

const METRIC_CFG: Record<
  HydroMetric,
  { label: string; unit: string; color: string; threshold: number; thresholdLabel: string }
> = {
  waterLevelM: {
    label: 'Water Level (MLLW)',
    unit: 'm',
    color: '#38BDF8',
    threshold: 3.1,
    thresholdLabel: 'Surge Alert (3.1 m)',
  },
  salinityPsu: {
    label: 'Salinity',
    unit: 'PSU',
    color: '#10B981',
    threshold: 33.5,
    thresholdLabel: 'Intrusion Limit (33.5 PSU)',
  },
  dissolvedO2: {
    label: 'Dissolved Oxygen',
    unit: 'mg/L',
    color: '#A78BFA',
    threshold: 5.0,
    thresholdLabel: 'Hypoxia Floor (5.0 mg/L)',
  },
  turbidityNtu: {
    label: 'Turbidity',
    unit: 'NTU',
    color: '#F59E0B',
    threshold: 28.0,
    thresholdLabel: 'Plume Spike (28 NTU)',
  },
};

interface SyntheticSeriesPt {
  label: string;
  waterLevelM: number;
  salinityPsu: number;
  dissolvedO2: number;
  turbidityNtu: number;
}

function buildWindowSeries(
  station: MonitoringStation,
  range: TimeRange,
  surgeActive: boolean
): SyntheticSeriesPt[] {
  const count = range === '24H' ? 24 : range === '7D' ? 28 : 30;
  const pts: SyntheticSeriesPt[] = [];

  for (let i = 0; i < count; i++) {
    const basePt = station.series[i % station.series.length];
    const wave = Math.sin(i * 0.55 + station.lon * 0.05);
    const surgeEnvelope =
      surgeActive && i >= count - 8
        ? Math.exp(-Math.pow((i - (count - 4)) / 2.6, 2))
        : 0;

    const waterLevelM = Number((basePt.waterLevelM + wave * 0.14 + surgeEnvelope * 1.45).toFixed(2));
    const salinityPsu = Number(
      Math.max(1.2, basePt.salinityPsu + Math.cos(i * 0.4) * 0.8 + surgeEnvelope * 4.8).toFixed(2)
    );
    const dissolvedO2 = Number(
      Math.max(2.4, 7.6 - (basePt.tempC - 12) * 0.12 + wave * 0.35 - surgeEnvelope * 1.9).toFixed(2)
    );
    const turbidityNtu = Number(
      Math.max(2.0, 11.5 + Math.abs(wave) * 7.5 + surgeEnvelope * 26.0).toFixed(1)
    );

    const label =
      range === '24H'
        ? `${String(i).padStart(2, '0')}:00`
        : range === '7D'
          ? `D-${Math.floor((count - 1 - i) / 4)} ${String((i % 4) * 6).padStart(2, '0')}h`
          : `Day ${i + 1}`;

    pts.push({ label, waterLevelM, salinityPsu, dissolvedO2, turbidityNtu });
  }
  return pts;
}

export default function HydrologyDemo() {
  const [selectedStationId, setSelectedStationId] = useState(MONITORING_STATIONS[0].id);
  const [range, setRange] = useState<TimeRange>('24H');
  const [metric, setMetric] = useState<HydroMetric>('waterLevelM');
  const [surgeActive, setSurgeActive] = useState(false);
  const [showAllFeeds, setShowAllFeeds] = useState(false);
  const [search, setSearch] = useState('');
  const [basinFilter, setBasinFilter] = useState('ALL');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const selectedStation =
    MONITORING_STATIONS.find((s) => s.id === selectedStationId) ?? MONITORING_STATIONS[0];

  const series = useMemo(
    () => buildWindowSeries(selectedStation, range, surgeActive),
    [selectedStation, range, surgeActive]
  );

  const cfg = METRIC_CFG[metric];
  const values = series.map((p) => p[metric]);
  const maxVal = Math.max(...values, cfg.threshold + 0.4);
  const minVal = Math.min(...values, cfg.threshold - 0.5);
  const span = maxVal - minVal || 1;

  const isBreach =
    metric === 'dissolvedO2'
      ? Math.min(...values) < cfg.threshold
      : Math.max(...values) > cfg.threshold;

  const totalFeedStations = MOCK_FEEDS.reduce((s, f) => s + f.stations, 0);
  const basins = useMemo(
    () => ['ALL', ...Array.from(new Set(MONITORING_STATIONS.map((s) => s.region)))],
    []
  );

  const filteredStations = useMemo(
    () =>
      MONITORING_STATIONS.filter((st) => {
        const matchBasin = basinFilter === 'ALL' || st.region === basinFilter;
        const q = search.toLowerCase();
        const matchQ =
          !q ||
          st.name.toLowerCase().includes(q) ||
          st.code.toLowerCase().includes(q) ||
          st.basin.toLowerCase().includes(q);
        return matchBasin && matchQ;
      }),
    [basinFilter, search]
  );

  // Download Real Mock CSV
  const handleExportCsv = () => {
    const header = 'timestamp_label,water_level_m,salinity_psu,dissolved_o2_mg_l,turbidity_ntu';
    const rows = series.map(
      (p) => `${p.label},${p.waterLevelM},${p.salinityPsu},${p.dissolvedO2},${p.turbidityNtu}`
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedStation.code.toLowerCase()}_${range.toLowerCase()}_synthetic.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // SVG chart layout
  const W = 720;
  const H = 230;
  const PL = 46;
  const PR = 18;
  const PT = 18;
  const PB = 28;
  const IW = W - PL - PR;
  const IH = H - PT - PB;

  const pts = series.map((p, idx) => {
    const x = PL + (idx / Math.max(series.length - 1, 1)) * IW;
    const y = PT + IH - ((p[metric] - minVal) / span) * IH;
    return { x, y, p, val: p[metric] };
  });
  const thresholdY = PT + IH - ((cfg.threshold - minVal) / span) * IH;
  const poly = pts.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area =
    `M ${pts[0].x.toFixed(1)} ${(PT + IH).toFixed(1)} ` +
    pts.map((c) => `L ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ') +
    ` L ${pts[pts.length - 1].x.toFixed(1)} ${(PT + IH).toFixed(1)} Z`;

  const activePt = pts[hoverIdx ?? pts.length - 1];

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
      {/* Top KPI Summary Strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
            <span>Ingested Sources</span>
            <Radio className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-950 dark:text-white">
            18 <span className="text-xs font-normal text-emerald-500">16 healthy</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
            <span>Simulated Stations</span>
            <Database className="h-3.5 w-3.5 text-cyan-500" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-950 dark:text-white">
            {totalFeedStations.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
            <span>Active Station Peak</span>
            <Waves className="h-3.5 w-3.5 text-sky-500" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-cyan-600 dark:text-cyan-400">
            {Math.max(...values).toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">{cfg.unit}</span>
          </div>
        </div>

        <div
          className={`rounded-xl border p-4 ${
            surgeActive || isBreach
              ? 'border-rose-500/50 bg-rose-500/10'
              : 'border-slate-200/90 bg-white dark:border-slate-800 dark:bg-obsidian-900'
          }`}
        >
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-slate-400">
            <span>Threshold Alert State</span>
            <AlertOctagon
              className={`h-3.5 w-3.5 ${surgeActive || isBreach ? 'text-rose-500' : 'text-emerald-500'}`}
            />
          </div>
          <div
            className={`mt-1 font-mono text-lg font-bold ${
              surgeActive || isBreach
                ? 'text-rose-600 dark:text-rose-300'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {surgeActive ? 'STORM SURGE ACTIVE' : isBreach ? 'THRESHOLD BREACH' : 'NOMINAL'}
          </div>
        </div>
      </div>

      {/* Main Chart + Controls Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div>
            <div className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              {selectedStation.code} · {selectedStation.basin}
            </div>
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              {selectedStation.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSurgeActive((s) => !s)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-bold transition ${
                surgeActive
                  ? 'bg-rose-600 text-white shadow-sm hover:bg-rose-500'
                  : 'border border-amber-500/50 bg-amber-500/10 text-amber-700 hover:bg-amber-500 hover:text-slate-950 dark:text-amber-300'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{surgeActive ? 'Clear Storm Surge' : 'Simulate Storm Surge Event'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-200 dark:hover:border-cyan-400"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Metric & Time Window Selectors */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(METRIC_CFG) as HydroMetric[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition ${
                  metric === m
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-obsidian-950 dark:text-slate-300'
                }`}
              >
                {METRIC_CFG[m].label}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 font-mono text-xs dark:border-slate-800 dark:bg-obsidian-950">
            {(['24H', '7D', '30D'] as TimeRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`rounded-md px-3 py-1 font-bold ${
                  range === r
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-obsidian-800 dark:text-cyan-300'
                    : 'text-slate-500'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div
          className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-obsidian-950/90"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <div className="mb-2 flex flex-wrap items-center justify-between font-mono text-xs">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Activity className="h-3.5 w-3.5 text-cyan-500" />
              <span>TimescaleDB Hypertable Simulation ({range} bucket)</span>
            </span>
            {activePt && (
              <span className="font-bold text-cyan-600 dark:text-cyan-300">
                {activePt.p.label} · {activePt.val} {cfg.unit}
              </span>
            )}
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full select-none overflow-visible">
            <defs>
              <linearGradient id="hydro-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cfg.color} stopOpacity="0.32" />
                <stop offset="100%" stopColor={cfg.color} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Threshold Warning Line */}
            {thresholdY >= PT && thresholdY <= PT + IH && (
              <g>
                <line
                  x1={PL}
                  x2={W - PR}
                  y1={thresholdY}
                  y2={thresholdY}
                  stroke="#F43F5E"
                  strokeWidth="1.4"
                  strokeDasharray="5 4"
                />
                <text
                  x={W - PR - 4}
                  y={thresholdY - 5}
                  textAnchor="end"
                  className="fill-rose-500 font-mono text-[10px] font-semibold"
                >
                  {cfg.thresholdLabel}
                </text>
              </g>
            )}

            {/* Y Ticks */}
            {[0, 0.5, 1].map((r, i) => {
              const v = maxVal - r * span;
              const y = PT + r * IH;
              return (
                <g key={i}>
                  <line
                    x1={PL}
                    x2={W - PR}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-300/60 dark:text-slate-800"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={PL - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-slate-500 font-mono text-[10px]"
                  >
                    {v.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Area + Line */}
            <path d={area} fill="url(#hydro-area)" />
            <polyline fill="none" stroke={cfg.color} strokeWidth="2.4" points={poly} />

            {/* X labels */}
            {pts
              .filter((_, i) => i === 0 || i === Math.floor(pts.length / 2) || i === pts.length - 1)
              .map((c, idx) => (
                <text
                  key={idx}
                  x={c.x}
                  y={H - 6}
                  textAnchor="middle"
                  className="fill-slate-500 font-mono text-[10px]"
                >
                  {c.p.label}
                </text>
              ))}

            {/* Hover Marker */}
            {activePt && (
              <g>
                <line
                  x1={activePt.x}
                  x2={activePt.x}
                  y1={PT}
                  y2={PT + IH}
                  stroke={cfg.color}
                  strokeOpacity="0.5"
                  strokeDasharray="2 2"
                />
                <circle cx={activePt.x} cy={activePt.y} r="5" fill={cfg.color} />
              </g>
            )}

            {/* Hover Columns */}
            {pts.map((c, idx) => (
              <rect
                key={idx}
                x={c.x - IW / pts.length / 2}
                y={PT}
                width={IW / pts.length}
                height={IH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIdx(idx)}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Bottom Grid: Station Catalog + 18 Upstream Ingestion Feeds */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Searchable Station Table */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold">Monitoring Station Directory</h3>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search station..."
                  className="w-40 rounded-lg border border-slate-300 bg-slate-50 py-1.5 pl-8 pr-2 font-mono text-xs dark:border-slate-700 dark:bg-obsidian-950"
                />
              </div>
              <select
                value={basinFilter}
                onChange={(e) => setBasinFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 font-mono text-xs dark:border-slate-700 dark:bg-obsidian-950"
              >
                {basins.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 max-h-72 overflow-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase text-slate-400 dark:bg-obsidian-950">
                <tr>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Station</th>
                  <th className="px-3 py-2">Region</th>
                  <th className="px-3 py-2">Tidal Range</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {filteredStations.map((st) => (
                  <tr
                    key={st.id}
                    onClick={() => setSelectedStationId(st.id)}
                    className={`cursor-pointer transition hover:bg-cyan-500/10 ${
                      st.id === selectedStationId ? 'bg-cyan-500/15' : ''
                    }`}
                  >
                    <td className="px-3 py-2 font-bold text-cyan-600 dark:text-cyan-400">
                      {st.code}
                    </td>
                    <td className="px-3 py-2">{st.name}</td>
                    <td className="px-3 py-2 text-slate-500">{st.region}</td>
                    <td className="px-3 py-2">{st.tidalRangeM} m</td>
                    <td className="px-3 py-2 uppercase">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          st.status === 'elevated'
                            ? 'bg-rose-500/15 text-rose-500'
                            : st.status === 'advisory'
                              ? 'bg-amber-500/15 text-amber-500'
                              : 'bg-emerald-500/15 text-emerald-500'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 18 Upstream Ingestion Feeds Health */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold">18 Simulated Upstream Feeds</h3>
            <button
              type="button"
              onClick={() => setShowAllFeeds((v) => !v)}
              className="font-mono text-xs text-cyan-600 hover:underline dark:text-cyan-400"
            >
              {showAllFeeds ? 'Show Top 8' : 'Expand All 18'}
            </button>
          </div>
          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
            {(showAllFeeds ? MOCK_FEEDS : MOCK_FEEDS.slice(0, 8)).map((feed) => (
              <div
                key={feed.id}
                className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2 font-mono text-xs dark:border-slate-800 dark:bg-obsidian-950/70"
              >
                <div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        feed.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{feed.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {feed.protocol} · {feed.stations.toLocaleString()} stations
                  </div>
                </div>
                <span className="text-[11px] text-slate-500">{feed.latencyMs} ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
