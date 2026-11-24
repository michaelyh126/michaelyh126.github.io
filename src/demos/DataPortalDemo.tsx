import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Database,
  Download,
  FileCode2,
  Folder,
  FolderPlus,
  Lock,
  Pencil,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlock,
  Upload,
} from 'lucide-react';

type PortalMode = 'public' | 'admin';
type Discipline = 'All' | 'Coastal & Marine' | 'Climate & Met' | 'Remote Sensing' | 'Hydrology';
type DataFormat = 'All' | 'GeoTIFF' | 'NetCDF' | 'Parquet' | 'GeoJSON';
type AccessTier = 'All' | 'Open' | 'Approval';

interface SyntheticDataset {
  id: string;
  title: string;
  discipline: Exclude<Discipline, 'All'>;
  format: Exclude<DataFormat, 'All'>;
  access: Exclude<AccessTier, 'All'>;
  sizeGb: number;
  updated: string;
  bbox: string;
  summary: string;
  schema: { field: string; type: string; desc: string }[];
}

interface AccessRequest {
  id: string;
  datasetId: string;
  datasetTitle: string;
  requester: string;
  institution: string;
  purpose: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface VirtualFileNode {
  id: string;
  folder: string;
  name: string;
  sizeMb: number;
  mime: string;
  deleted: boolean;
}

const DATASETS: SyntheticDataset[] = [
  {
    id: 'DS-001',
    title: 'Global Synthetic Estuarine Salinity Grid v4',
    discipline: 'Coastal & Marine',
    format: 'NetCDF',
    access: 'Open',
    sizeGb: 4.8,
    updated: '2026-09-14',
    bbox: '[-180, -60, 180, 72]',
    summary: 'Procedurally synthesized 0.05° coastal salinity reanalysis grid designed for open WebGIS & hydrology pipeline testing.',
    schema: [
      { field: 'lon / lat', type: 'float32', desc: 'WGS84 grid cell center' },
      { field: 'salinity_psu', type: 'float32', desc: 'Practical Salinity Units' },
      { field: 'qc_flag', type: 'uint8', desc: '0=nominal, 1=interpolated' },
    ],
  },
  {
    id: 'DS-002',
    title: 'Coastal Saltmarsh Synthetic GeoTIFF Pyramid (2018–2026)',
    discipline: 'Remote Sensing',
    format: 'GeoTIFF',
    access: 'Open',
    sizeGb: 12.4,
    updated: '2026-10-02',
    bbox: '[120.5, 30.2, 123.0, 32.3]',
    summary: '9-epoch synthetic Web Mercator (EPSG:3857) tiled biomass & canopy classification rasters covering zoom levels Z6–Z11.',
    schema: [
      { field: 'band_1_ndvi', type: 'uint16', desc: 'Scaled vegetation index' },
      { field: 'band_2_class', type: 'uint8', desc: 'Marsh / Mudflat / Water class' },
      { field: 'crs', type: 'string', desc: 'EPSG:3857 Web Mercator' },
    ],
  },
  {
    id: 'DS-003',
    title: 'North Sea Storm-Surge Synthetic Ensemble Benchmark',
    discipline: 'Hydrology',
    format: 'Parquet',
    access: 'Approval',
    sizeGb: 9.1,
    updated: '2026-10-18',
    bbox: '[-3.0, 50.5, 11.0, 56.0]',
    summary: 'Columnar time-series benchmark of 500 synthetic storm-surge trajectories with tidal residuals and barometric pressure forcing.',
    schema: [
      { field: 'station_id', type: 'string', desc: 'Synthetic gauge code' },
      { field: 'ts_utc', type: 'timestamp', desc: '10-minute hypertable bucket' },
      { field: 'surge_m', type: 'float64', desc: 'Non-tidal water residual (m)' },
    ],
  },
  {
    id: 'DS-004',
    title: 'Multi-Source Hydro-Met Station Registry (18 Mock Feeds)',
    discipline: 'Hydrology',
    format: 'GeoJSON',
    access: 'Open',
    sizeGb: 0.4,
    updated: '2026-11-01',
    bbox: '[-170, -50, 175, 70]',
    summary: 'Normalized GeoJSON FeatureCollection representing ~25,000 simulated coastal, estuarine, and synoptic weather nodes.',
    schema: [
      { field: 'geometry', type: 'Point', desc: 'WGS84 [lon, lat]' },
      { field: 'feed_source', type: 'string', desc: 'Upstream feed identifier' },
      { field: 'sampling_sec', type: 'int32', desc: 'Nominal ingest cadence' },
    ],
  },
  {
    id: 'DS-005',
    title: 'Synthetic Urban UHR Aerial Segmentation Tiles (5000×5000)',
    discipline: 'Remote Sensing',
    format: 'GeoTIFF',
    access: 'Approval',
    sizeGb: 28.6,
    updated: '2026-08-22',
    bbox: '[-122.6, 37.6, -122.2, 37.9]',
    summary: 'Ultra-high-resolution synthetic imagery tiles & pixel masks engineered for benchmarking real-time CV networks like SBUPNet.',
    schema: [
      { field: 'rgb_tile', type: 'uint8[3]', desc: '5000×5000 synthetic ortho' },
      { field: 'label_mask', type: 'uint8', desc: 'Semantic class mask' },
      { field: 'uncertainty_ref', type: 'float32', desc: 'Boundary entropy map' },
    ],
  },
  {
    id: 'DS-006',
    title: 'Coastal Boundary-Layer Wind & Gust Reanalysis (Mock)',
    discipline: 'Climate & Met',
    format: 'NetCDF',
    access: 'Open',
    sizeGb: 6.3,
    updated: '2026-09-29',
    bbox: '[-180, -65, 180, 75]',
    summary: 'Hourly 10m wind-vector synthetic benchmark for marine energy siting and offshore logistics route modeling.',
    schema: [
      { field: 'u10 / v10', type: 'float32', desc: 'Zonal / meridional wind (m/s)' },
      { field: 'gust_max', type: 'float32', desc: 'Peak 3s gust estimate' },
    ],
  },
  {
    id: 'DS-007',
    title: 'Estuarine Dissolved Oxygen & Hypoxia Corridor Polygons',
    discipline: 'Coastal & Marine',
    format: 'GeoJSON',
    access: 'Open',
    sizeGb: 0.2,
    updated: '2026-10-11',
    bbox: '[-95.0, 25.0, -70.0, 42.0]',
    summary: 'Seasonal synthetic hypoxia risk polygons with turbidity & water-temperature covariates for browser GIS overlays.',
    schema: [
      { field: 'polygon_id', type: 'string', desc: 'Corridor identifier' },
      { field: 'do_mg_l', type: 'float32', desc: 'Mean dissolved oxygen' },
    ],
  },
  {
    id: 'DS-008',
    title: 'High-Frequency Bathymetric Transect Soundings (Synthetic)',
    discipline: 'Coastal & Marine',
    format: 'Parquet',
    access: 'Approval',
    sizeGb: 15.2,
    updated: '2026-10-25',
    bbox: '[121.0, 30.5, 140.5, 36.0]',
    summary: 'Synthetic shelf survey line soundings modeled for hydrographic QC, spline gridding, and channel dredging simulations.',
    schema: [
      { field: 'transect_id', type: 'string', desc: 'Vessel survey line ID' },
      { field: 'depth_m', type: 'float32', desc: 'Chart datum depth (m)' },
    ],
  },
  {
    id: 'DS-009',
    title: 'Global Coastal Heatwave Anomaly Index (1995–2026 Sim)',
    discipline: 'Climate & Met',
    format: 'Parquet',
    access: 'Open',
    sizeGb: 3.4,
    updated: '2026-11-04',
    bbox: '[-180, -60, 180, 70]',
    summary: '30-year synthetic marine heatwave intensity & duration indicators formatted for fast DuckDB / Arrow queries.',
    schema: [
      { field: 'grid_cell', type: 'int64', desc: 'H3 index resolution 5' },
      { field: 'sst_anom_c', type: 'float32', desc: 'SST anomaly (°C)' },
    ],
  },
  {
    id: 'DS-010',
    title: 'River Basin Precipitation & Runoff Synthetic Hydrology Pack',
    discipline: 'Hydrology',
    format: 'NetCDF',
    access: 'Approval',
    sizeGb: 7.9,
    updated: '2026-11-09',
    bbox: '[-125.0, 32.0, -72.0, 50.0]',
    summary: 'Coupled watershed synthetic runoff series for flood-routing model validation and API stress testing.',
    schema: [
      { field: 'basin_code', type: 'string', desc: 'HydroSHEDS-style basin key' },
      { field: 'discharge_m3s', type: 'float32', desc: 'Simulated discharge (m³/s)' },
    ],
  },
];

const INITIAL_REQUESTS: AccessRequest[] = [
  {
    id: 'REQ-401',
    datasetId: 'DS-003',
    datasetTitle: 'North Sea Storm-Surge Synthetic Ensemble Benchmark',
    requester: 'Dr. Hannah Lindqvist',
    institution: 'Nordic Coastal Analytics Lab',
    purpose: 'Benchmarking TimescaleDB query latency for surge forecasting.',
    submittedAt: '2026-11-23 14:22',
    status: 'PENDING',
  },
  {
    id: 'REQ-402',
    datasetId: 'DS-005',
    datasetTitle: 'Synthetic Urban UHR Aerial Segmentation Tiles (5000×5000)',
    requester: 'Alex Rivera',
    institution: 'GeoVision Robotics (Remote)',
    purpose: 'Evaluating real-time semantic segmentation VRAM usage on RTX 4090.',
    submittedAt: '2026-11-24 09:05',
    status: 'PENDING',
  },
];

const INITIAL_FILES: VirtualFileNode[] = [
  { id: 'vf-1', folder: '/datasets/coastal', name: 'estuarine_salinity_v4.nc', sizeMb: 482, mime: 'application/x-netcdf', deleted: false },
  { id: 'vf-2', folder: '/datasets/coastal', name: 'hypoxia_corridors_2026.geojson', sizeMb: 18, mime: 'application/geo+json', deleted: false },
  { id: 'vf-3', folder: '/datasets/rasters', name: 'saltmarsh_2026_epsg3857.tif', sizeMb: 1240, mime: 'image/tiff', deleted: false },
  { id: 'vf-4', folder: '/datasets/rasters', name: 'uhr_aerial_sample_5k.tif', sizeMb: 860, mime: 'image/tiff', deleted: false },
  { id: 'vf-5', folder: '/datasets/exports', name: 'hydro_stations_18feeds.parquet', sizeMb: 94, mime: 'application/vnd.apache.parquet', deleted: false },
  { id: 'vf-6', folder: '/datasets/exports', name: 'deprecated_v2_manifest.json', sizeMb: 2, mime: 'application/json', deleted: true },
];

export default function DataPortalDemo() {
  const [mode, setMode] = useState<PortalMode>('public');
  const [search, setSearch] = useState('');
  const [discipline, setDiscipline] = useState<Discipline>('All');
  const [format, setFormat] = useState<DataFormat>('All');
  const [accessTier, setAccessTier] = useState<AccessTier>('All');

  const [selectedDs, setSelectedDs] = useState<SyntheticDataset>(DATASETS[2]);
  const [requests, setRequests] = useState<AccessRequest[]>(INITIAL_REQUESTS);
  const [reqName, setReqName] = useState('Jordan Taylor');
  const [reqOrg, setReqOrg] = useState('Pacific Climate Ventures');
  const [reqPurpose, setReqPurpose] = useState('Evaluating geospatial API integration & schema coverage.');

  // Virtual File Manager state
  const [folders, setFolders] = useState<string[]>([
    '/datasets/coastal',
    '/datasets/rasters',
    '/datasets/exports',
  ]);
  const [activeFolder, setActiveFolder] = useState<string>('/datasets/coastal');
  const [viewRecycleBin, setViewRecycleBin] = useState(false);
  const [files, setFiles] = useState<VirtualFileNode[]>(INITIAL_FILES);
  const [newFolderInput, setNewFolderInput] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [auditLogs, setAuditLogs] = useState<string[]>([
    '[09:05:12] RBAC_INIT · Admin session verified (ROLE_DATA_STEWARD)',
    '[09:06:00] PATH_GUARD · Canonical root jail enforced at /datasets/*',
  ]);
  const [toast, setToast] = useState<{ kind: 'ok' | 'error'; msg: string } | null>(null);

  const pushLog = (line: string) => {
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    setAuditLogs((prev) => [`[${ts}] ${line}`, ...prev.slice(0, 14)]);
  };

  const notify = (kind: 'ok' | 'error', msg: string) => {
    setToast({ kind, msg });
    window.setTimeout(() => setToast(null), 3800);
  };

  const filteredDatasets = useMemo(
    () =>
      DATASETS.filter((d) => {
        const matchD = discipline === 'All' || d.discipline === discipline;
        const matchF = format === 'All' || d.format === format;
        const matchA = accessTier === 'All' || d.access === accessTier;
        const q = search.toLowerCase();
        const matchQ =
          !q || d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q);
        return matchD && matchF && matchA && matchQ;
      }),
    [discipline, format, accessTier, search]
  );

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  const handleSubmitRequest = () => {
    const id = `REQ-${401 + requests.length}`;
    const newReq: AccessRequest = {
      id,
      datasetId: selectedDs.id,
      datasetTitle: selectedDs.title,
      requester: reqName.trim() || 'Guest Researcher',
      institution: reqOrg.trim() || 'Independent',
      purpose: reqPurpose.trim() || 'Evaluation',
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'PENDING',
    };
    setRequests((prev) => [newReq, ...prev]);
    pushLog(`REQUEST_SUBMITTED · ${id} for ${selectedDs.id} by ${newReq.requester}`);
    notify('ok', `Submitted ${id}! Switch to DataHub Admin tab to approve or reject it live.`);
  };

  const handleDownloadMockSample = (ds: SyntheticDataset) => {
    const sample = {
      dataset_id: ds.id,
      title: ds.title,
      synthetic_notice: '100% synthetic demonstration sample payload',
      format: ds.format,
      bbox_wgs84: ds.bbox,
      schema: ds.schema,
    };
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ds.id.toLowerCase()}_sample_metadata.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushLog(`SAMPLE_EXPORT · Downloaded mock metadata for ${ds.id}`);
  };

  const handleReviewRequest = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    pushLog(`RBAC_APPROVAL · ${id} marked ${status} by Admin Steward`);
    notify('ok', `Request ${id} ${status.toLowerCase()} and recorded in audit trail.`);
  };

  // Hardened Virtual File Manager: blocks path traversal (../, \, null bytes, absolute escapes)
  const validateSafeName = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (!trimmed) return 'Name cannot be empty.';
    if (
      trimmed.includes('..') ||
      trimmed.includes('\\') ||
      trimmed.startsWith('/etc') ||
      trimmed.startsWith('C:') ||
      trimmed.includes('\0')
    ) {
      return 'HTTP 400 PATH_TRAVERSAL_BLOCKED: Canonical path sanitizer rejected unsafe path segment.';
    }
    return null;
  };

  const handleCreateFolder = () => {
    const err = validateSafeName(newFolderInput);
    if (err) {
      pushLog(`SECURITY_BLOCK · Attempted folder "${newFolderInput}" → ${err}`);
      notify('error', err);
      return;
    }
    const slug = newFolderInput.trim().replace(/^\/+/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
    const fullPath = `/datasets/${slug}`;
    if (!folders.includes(fullPath)) {
      setFolders((prev) => [...prev, fullPath]);
    }
    setActiveFolder(fullPath);
    setViewRecycleBin(false);
    setNewFolderInput('');
    pushLog(`FS_MKDIR · Created canonical folder ${fullPath}`);
    notify('ok', `Created folder ${fullPath}`);
  };

  const handleSimulateUpload = () => {
    const nextNum = files.length + 1;
    const newNode: VirtualFileNode = {
      id: `vf-${Date.now()}`,
      folder: activeFolder,
      name: `synthetic_upload_batch_${nextNum}.geojson`,
      sizeMb: Number((4 + (nextNum % 9) * 3.2).toFixed(1)),
      mime: 'application/geo+json',
      deleted: false,
    };
    setFiles((prev) => [newNode, ...prev]);
    pushLog(`FS_UPLOAD · Validated MIME (${newNode.mime}) & stored ${activeFolder}/${newNode.name}`);
    notify('ok', `Uploaded ${newNode.name} to ${activeFolder}`);
  };

  const handleCommitRename = (id: string) => {
    const err = validateSafeName(renameDraft);
    if (err) {
      pushLog(`SECURITY_BLOCK · Rename attempt "${renameDraft}" → ${err}`);
      notify('error', err);
      return;
    }
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: renameDraft.trim() } : f)));
    pushLog(`FS_RENAME · Renamed node ${id} → ${renameDraft.trim()}`);
    setRenamingId(null);
  };

  const visibleFiles = files.filter((f) =>
    viewRecycleBin ? f.deleted : !f.deleted && f.folder === activeFolder
  );

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
      {/* Mode Switch Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
            Open Research Data Portal &amp; DataHub Console
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit a dataset access request in <strong>Public Portal</strong>, then switch to{' '}
            <strong>DataHub Admin</strong> to approve it and test the path-traversal hardened file
            manager.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 font-mono text-xs dark:border-slate-800 dark:bg-obsidian-950">
          <button
            type="button"
            onClick={() => setMode('public')}
            className={`rounded-lg px-3.5 py-1.5 font-bold transition ${
              mode === 'public'
                ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            1. Public Data Portal ({DATASETS.length})
          </button>
          <button
            type="button"
            onClick={() => setMode('admin')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition ${
              mode === 'admin'
                ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>2. DataHub Admin &amp; FS</span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium ${
            toast.kind === 'error'
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-200'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
          }`}
        >
          {toast.kind === 'error' ? (
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* MODE 1: PUBLIC OPEN DATA PORTAL */}
      {mode === 'public' && (
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left: Search & Dataset List */}
          <div className="space-y-3 lg:col-span-7">
            <div className="grid gap-2 rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900 sm:grid-cols-4">
              <div className="relative sm:col-span-2">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search datasets, variables..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-8 pr-2.5 font-mono text-xs dark:border-slate-700 dark:bg-obsidian-950"
                />
              </div>

              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as Discipline)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-2 font-mono text-xs dark:border-slate-700 dark:bg-obsidian-950"
              >
                {(['All', 'Coastal & Marine', 'Climate & Met', 'Remote Sensing', 'Hydrology'] as Discipline[]).map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>

              <div className="flex gap-1.5">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as DataFormat)}
                  className="w-1/2 rounded-lg border border-slate-300 bg-slate-50 px-1.5 py-2 font-mono text-xs dark:border-slate-700 dark:bg-obsidian-950"
                >
                  {(['All', 'GeoTIFF', 'NetCDF', 'Parquet', 'GeoJSON'] as DataFormat[]).map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <select
                  value={accessTier}
                  onChange={(e) => setAccessTier(e.target.value as AccessTier)}
                  className="w-1/2 rounded-lg border border-slate-300 bg-slate-50 px-1.5 py-2 font-mono text-xs dark:border-slate-700 dark:bg-obsidian-950"
                >
                  <option value="All">Tier</option>
                  <option value="Open">Open</option>
                  <option value="Approval">Approval</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredDatasets.map((ds) => {
                const active = selectedDs.id === ds.id;
                return (
                  <button
                    key={ds.id}
                    type="button"
                    onClick={() => setSelectedDs(ds)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? 'border-cyan-500 bg-cyan-500/10 dark:border-cyan-400'
                        : 'border-slate-200/90 bg-white hover:border-cyan-500/40 dark:border-slate-800 dark:bg-obsidian-900'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">{ds.id}</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-obsidian-950">
                          {ds.format}
                        </span>
                        <span className="text-slate-500">{ds.discipline}</span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          ds.access === 'Open'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {ds.access === 'Open' ? (
                          <Unlock className="h-3 w-3" />
                        ) : (
                          <Lock className="h-3 w-3" />
                        )}
                        {ds.access === 'Open' ? 'Open Access' : 'Approval Required'}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-bold text-slate-950 dark:text-white">
                      {ds.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{ds.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Schema Inspector & Access Request Form */}
          <div className="h-fit rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:sticky lg:top-20 lg:col-span-5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                {selectedDs.id} · {selectedDs.format}
              </span>
              <span className="text-slate-500">
                {selectedDs.sizeGb} GB · Updated {selectedDs.updated}
              </span>
            </div>
            <h3 className="mt-2 font-display text-xl font-bold text-slate-950 dark:text-white">
              {selectedDs.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {selectedDs.summary}
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs dark:border-slate-800 dark:bg-obsidian-950">
              <div className="text-[10px] uppercase text-slate-400">Spatial Extent (WGS84 BBox)</div>
              <div className="mt-0.5 font-semibold">{selectedDs.bbox}</div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase text-slate-500">
                <Database className="h-3.5 w-3.5 text-cyan-500" />
                <span>Schema Preview</span>
              </div>
              <div className="mt-2 divide-y divide-slate-200/70 rounded-xl border border-slate-200 text-xs dark:divide-slate-800 dark:border-slate-800">
                {selectedDs.schema.map((col) => (
                  <div key={col.field} className="flex items-center justify-between px-3 py-2 font-mono">
                    <div>
                      <span className="font-bold text-cyan-700 dark:text-cyan-300">{col.field}</span>
                      <span className="ml-2 text-[10px] text-slate-400">{col.type}</span>
                    </div>
                    <span className="text-right text-[11px] text-slate-500">{col.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedDs.access === 'Open' ? (
              <button
                type="button"
                onClick={() => handleDownloadMockSample(selectedDs)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white transition hover:bg-emerald-500"
              >
                <Download className="h-4 w-4" />
                <span>Download Mock Metadata Sample (.JSON)</span>
              </button>
            ) : (
              <div className="mt-5 space-y-2.5 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4">
                <div className="font-mono text-xs font-bold text-amber-800 dark:text-amber-300">
                  Submit RBAC Dataset Access Request
                </div>
                <input
                  type="text"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-obsidian-950"
                />
                <input
                  type="text"
                  value={reqOrg}
                  onChange={(e) => setReqOrg(e.target.value)}
                  placeholder="Institution / Company"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-obsidian-950"
                />
                <textarea
                  rows={2}
                  value={reqPurpose}
                  onChange={(e) => setReqPurpose(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-obsidian-950"
                />
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit to Admin Approval Queue</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: DATAHUB ADMIN & HARDENED VIRTUAL FILE MANAGER */}
      {mode === 'admin' && (
        <div className="space-y-4">
          {/* Approval Queue */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900">
            <h3 className="font-display text-base font-bold">
              RBAC Dataset Approval Queue ({requests.length})
            </h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-obsidian-950/70"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">
                      {r.id} · {r.datasetId}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        r.status === 'APPROVED'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                          : r.status === 'REJECTED'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-1 font-display text-sm font-bold">{r.datasetTitle}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {r.requester} ({r.institution}) · {r.submittedAt}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">{r.purpose}</p>
                  {r.status === 'PENDING' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleReviewRequest(r.id, 'APPROVED')}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 font-mono text-[11px] font-bold text-white"
                      >
                        Approve Access
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewRequest(r.id, 'REJECTED')}
                        className="rounded-lg border border-rose-500/40 px-3 py-1.5 font-mono text-[11px] font-bold text-rose-600 dark:text-rose-300"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hardened Virtual File Manager */}
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold">Virtual Storage Tree</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  Path Guard ON
                </span>
              </div>

              <div className="mt-3 space-y-1.5 font-mono text-xs">
                {folders.map((folder) => (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => {
                      setActiveFolder(folder);
                      setViewRecycleBin(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${
                      !viewRecycleBin && activeFolder === folder
                        ? 'bg-cyan-500/15 font-bold text-cyan-700 dark:text-cyan-300'
                        : 'hover:bg-slate-100 dark:hover:bg-obsidian-850'
                    }`}
                  >
                    <Folder className="h-4 w-4 text-cyan-500" />
                    <span>{folder}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setViewRecycleBin(true)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                    viewRecycleBin
                      ? 'bg-rose-500/15 font-bold text-rose-600 dark:text-rose-300'
                      : 'hover:bg-slate-100 dark:hover:bg-obsidian-850'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-rose-500" />
                    <span>/recycle-bin</span>
                  </span>
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] dark:bg-obsidian-950">
                    {files.filter((f) => f.deleted).length}
                  </span>
                </button>
              </div>

              {/* Create Folder + Path-Traversal Test */}
              <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <label className="font-mono text-[10px] uppercase text-slate-400">
                  Create Folder (Try typing <code className="text-rose-500">../../etc/passwd</code>!)
                </label>
                <div className="mt-1.5 flex gap-1.5">
                  <input
                    type="text"
                    value={newFolderInput}
                    onChange={(e) => setNewFolderInput(e.target.value)}
                    placeholder="e.g. climate-2026 or ../etc"
                    className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 font-mono text-xs dark:border-slate-700 dark:bg-obsidian-950"
                  />
                  <button
                    type="button"
                    onClick={handleCreateFolder}
                    className="inline-flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 font-mono text-xs font-bold text-white dark:bg-cyan-500 dark:text-slate-950"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-8">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
                  <div className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    {viewRecycleBin ? '/recycle-bin (Soft-Deleted Files)' : activeFolder}
                  </div>
                  {!viewRecycleBin && (
                    <button
                      type="button"
                      onClick={handleSimulateUpload}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 font-mono text-xs font-bold text-white hover:bg-emerald-500"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Simulate File Upload</span>
                    </button>
                  )}
                </div>

                <div className="mt-3 divide-y divide-slate-200/70 font-mono text-xs dark:divide-slate-800">
                  {visibleFiles.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">Folder is empty.</div>
                  ) : (
                    visibleFiles.map((f) => (
                      <div key={f.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <FileCode2 className="h-4 w-4 text-cyan-500" />
                          {renamingId === f.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={renameDraft}
                                onChange={(e) => setRenameDraft(e.target.value)}
                                className="rounded border border-cyan-500 bg-slate-50 px-2 py-0.5 text-xs dark:bg-obsidian-950"
                              />
                              <button
                                type="button"
                                onClick={() => handleCommitRename(f.id)}
                                className="rounded bg-cyan-600 px-2 py-0.5 text-[10px] font-bold text-white"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="font-semibold">{f.name}</div>
                              <div className="text-[10px] text-slate-400">
                                {f.sizeMb} MB · {f.mime}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!f.deleted ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setRenamingId(f.id);
                                  setRenameDraft(f.name);
                                }}
                                className="rounded border border-slate-300 p-1.5 text-slate-500 hover:border-cyan-500 hover:text-cyan-500 dark:border-slate-700"
                                title="Rename"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setFiles((prev) =>
                                    prev.map((x) => (x.id === f.id ? { ...x, deleted: true } : x))
                                  );
                                  pushLog(`FS_SOFT_DELETE · Moved ${f.name} to /recycle-bin`);
                                }}
                                className="rounded border border-slate-300 p-1.5 text-slate-500 hover:border-rose-500 hover:text-rose-500 dark:border-slate-700"
                                title="Move to Recycle Bin"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setFiles((prev) =>
                                  prev.map((x) => (x.id === f.id ? { ...x, deleted: false } : x))
                                );
                                pushLog(`FS_RESTORE · Restored ${f.name} to ${f.folder}`);
                              }}
                              className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Restore
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Security & RBAC Console Log */}
              <div className="rounded-xl bg-slate-950 p-3.5 font-mono text-[11px] text-emerald-300">
                <div className="mb-1.5 text-[10px] uppercase text-slate-400">
                  Hardened File-Manager &amp; RBAC Security Stream
                </div>
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {auditLogs.map((l, idx) => (
                    <div
                      key={idx}
                      className={l.includes('SECURITY_BLOCK') ? 'text-rose-400' : 'text-emerald-300'}
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
