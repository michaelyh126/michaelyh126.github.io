/**
 * HydroAPI (own-dashboard) — Deterministic 100% Synthetic Bilingual Field Station Telemetry Engine
 */
(function (global) {
  'use strict';

  function isZh() { return global.HydroI18n ? global.HydroI18n.isZh() : false; }
  function pick(en, zh) { return isZh() ? zh : en; }

  function hashSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
  }

  const FIELD_STATIONS_RAW = [
    { station_id: 'FLD-ADCP-01', en: 'North Channel Bottom ADCP Mooring', zh: '北槽座底 ADCP 剖面潜标', station_type: 'adcp', lat: 31.12, lng: 122.04, is_mobile: false },
    { station_id: 'FLD-WAVE-02', en: 'Outer Bay Directional Wave Buoy', zh: '东海湾外缘测波浮标', station_type: 'wave', lat: 30.86, lng: 122.42, is_mobile: false },
    { station_id: 'FLD-WQ-03', en: 'Intertidal Multi-Pile WQ Array', zh: '潮滩多桩号水质阵列', station_type: 'wq', lat: 30.96, lng: 121.88, is_mobile: false },
    { station_id: 'FLD-TIDE-04', en: 'Island Reef Radar Tide Gauge', zh: '岛礁高精度雷达验潮站', station_type: 'tide', lat: 30.68, lng: 122.26, is_mobile: false },
    { station_id: 'FLD-PHEN-05', en: 'Saltmarsh Phenology Camera Tower', zh: '盐沼湿地物候观测塔', station_type: 'phenology', lat: 31.02, lng: 121.82, is_mobile: false },
    { station_id: 'FLD-MET-06', en: 'Offshore Gradient Met Platform', zh: '海上梯度气象观测平台', station_type: 'met', lat: 30.78, lng: 122.54, is_mobile: false },
    { station_id: 'FLD-ADCP-07', en: 'Mobile Underway ADCP Survey Vessel', zh: '走航式 ADCP 断面观测船', station_type: 'adcp', lat: 30.90, lng: 122.18, is_mobile: true },
    { station_id: 'FLD-WQ-08', en: 'South Wing Saltwater Intrusion Buoy', zh: '南翼盐水入侵监测浮标', station_type: 'wq', lat: 30.62, lng: 121.92, is_mobile: false },
  ];

  const OVERLAY_BASINS_RAW = [
    { code: 'east_bay', en: 'East Bay Reference Zone', zh: '东海湾参考区', center_lat: 30.88, center_lng: 122.05, box_deg: 1.6 },
    { code: 'south_shelf', en: 'South Shelf Reference Zone', zh: '南湾陆架参考区', center_lat: 22.15, center_lng: 114.12, box_deg: 1.8 },
  ];

  const OVERLAY_STATIONS_RAW = [
    { id: 'REF-01', en: 'Reference Tide Gauge N1', zh: '参考潮位站 N1', source: 'coops', station_type: 'tide', lat: 31.22, lng: 121.74 },
    { id: 'REF-02', en: 'Reference Met Buoy E2', zh: '参考气象浮标 E2', source: 'jodc', station_type: 'met', lat: 30.72, lng: 122.66 },
    { id: 'REF-03', en: 'Reference Harbor Gauge S3', zh: '参考港口验潮站 S3', source: 'hko', station_type: 'tide', lat: 30.48, lng: 121.82 },
    { id: 'REF-04', en: 'Reference Shelf Exchange E4', zh: '参考陆架交换站 E4', source: 'isd', station_type: 'met', lat: 31.34, lng: 122.38 },
  ];

  function notify(type, msg) {
    if (global.ElementPlus && global.ElementPlus.ElMessage) {
      global.ElementPlus.ElMessage({ message: msg, type, duration: type === 'error' ? 4000 : 2400 });
    }
  }

  function buildProfileGrid(stationId, metric, startIso, endIso) {
    const seed = hashSeed(stationId + ':' + metric);
    const endMs = endIso ? new Date(endIso).getTime() : Date.now();
    const startMs = startIso ? new Date(startIso).getTime() : (endMs - 7 * 86400 * 1000);
    const nTimes = 28;
    const step = Math.max(Math.floor((endMs - startMs) / (nTimes - 1)), 1800 * 1000);
    const times = [];
    for (let i = 0; i < nTimes; i++) times.push(new Date(startMs + i * step).toISOString());
    const layers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const phase = (seed % 360) * Math.PI / 180;

    const matrix = [];
    const coverage = [];
    const qc = [];
    for (let ti = 0; ti < nTimes; ti++) {
      const rowV = [], rowC = [], rowQ = [];
      const h = (startMs + ti * step) / 3600000;
      const tide = Math.abs(Math.sin((2 * Math.PI * h) / 12.42 + phase));
      for (let li = 0; li < layers.length; li++) {
        if (li === 11 && (ti === 6 || ti === 7 || ti === 19)) {
          rowV.push(null); rowC.push(0); rowQ.push(null);
          continue;
        }
        if (li === 9 && ti === 14) {
          rowV.push(null); rowC.push(1); rowQ.push(0);
          continue;
        }
        const depthDecay = 1 - li * 0.058;
        const speed = (0.18 + 1.24 * tide) * depthDecay + 0.08 * Math.sin(ti * 0.7 + li * 0.5 + phase);
        rowV.push(Number(Math.max(0.02, speed).toFixed(3)));
        rowC.push(1);
        rowQ.push((ti + li) % 13 === 0 ? 0 : 1);
      }
      matrix.push(rowV);
      coverage.push(rowC);
      qc.push(rowQ);
    }
    return {
      station_id: stationId,
      metric,
      depth_axis: 'layer',
      adcp_depth_annotation_enabled: false,
      layers,
      times,
      matrix,
      coverage,
      qc,
    };
  }

  function buildVectorField(stationId, startIso, endIso) {
    const seed = hashSeed(stationId + ':vec');
    const phase = (seed % 360) * Math.PI / 180;
    const endMs = endIso ? new Date(endIso).getTime() : Date.now();
    const startMs = startIso ? new Date(startIso).getTime() : (endMs - 7 * 86400 * 1000);
    const nTimes = 16;
    const step = Math.max(Math.floor((endMs - startMs) / (nTimes - 1)), 3600 * 1000);
    const layers = [1, 3, 5, 7, 9, 11];
    const points = [];

    for (let ti = 0; ti < nTimes; ti++) {
      const ts = startMs + ti * step;
      const iso = new Date(ts).toISOString();
      const angle = (2 * Math.PI * (ts / 3600000)) / 12.42 + phase;
      for (let li = 0; li < layers.length; li++) {
        const layer = layers[li];
        const decay = 1 - li * 0.11;
        const u = Number((0.92 * Math.cos(angle) * decay).toFixed(3));
        const v = Number((0.54 * Math.sin(angle + 0.35) * decay).toFixed(3));
        const speed = Number(Math.hypot(u, v).toFixed(3));
        let dir = (Math.atan2(u, v) * 180) / Math.PI;
        if (dir < 0) dir += 360;
        points.push({ time: iso, depth_layer: layer, u, v, speed, dir_deg: Number(dir.toFixed(1)) });
      }
    }
    return {
      station_id: stationId,
      dir_convention: pick('atan2(U_east, V_north), compass deg [0, 360)', 'atan2(U_east, V_north)，罗盘度 [0, 360)'),
      speed_unit: 'm/s',
      points,
    };
  }

  function buildWaveRose(stationId) {
    const seed = hashSeed(stationId + ':wave');
    const dir_bins = [];
    for (let i = 0; i < 16; i++) {
      const center = i * 22.5;
      dir_bins.push({ center_deg: center, start_deg: (center - 11.25 + 360) % 360, end_deg: (center + 11.25) % 360 });
    }
    const height_bins = [
      { min: 0.0, max: 0.5 },
      { min: 0.5, max: 1.0 },
      { min: 1.0, max: 1.5 },
      { min: 1.5, max: 2.5 },
      { min: 2.5, max: null },
    ];
    const primaryIdx = 5 + (seed % 3);
    const secondaryIdx = (primaryIdx + 8) % 16;
    const freq_matrix = [];
    let total = 0;
    for (let di = 0; di < 16; di++) {
      const d1 = Math.min(Math.abs(di - primaryIdx), 16 - Math.abs(di - primaryIdx));
      const d2 = Math.min(Math.abs(di - secondaryIdx), 16 - Math.abs(di - secondaryIdx));
      const weight = Math.exp(-(d1 * d1) / 3.6) * 1.0 + Math.exp(-(d2 * d2) / 4.2) * 0.42 + 0.08;
      const row = [
        Math.round(weight * 26 + ((seed + di * 3) % 5)),
        Math.round(weight * 34 + ((seed + di * 5) % 6)),
        Math.round(weight * 20 + ((seed + di * 7) % 4)),
        Math.round(weight * 11),
        Math.round(weight * 4),
      ];
      row.forEach((v) => { total += v; });
      freq_matrix.push(row);
    }
    return { station_id: stationId, dir_bins, height_bins, freq_matrix, total };
  }

  function buildWqPiles(stationId, metric, startIso, endIso) {
    const seed = hashSeed(stationId + ':' + metric);
    const endMs = endIso ? new Date(endIso).getTime() : Date.now();
    const startMs = startIso ? new Date(startIso).getTime() : (endMs - 7 * 86400 * 1000);
    const nPts = 72;
    const step = Math.max(Math.floor((endMs - startMs) / (nPts - 1)), 1800 * 1000);
    const baseByMetric = {
      salinity_psu: { base: 20.5, amp: 4.8, stepPile: 2.1 },
      water_temp_c: { base: 18.8, amp: 1.4, stepPile: -0.4 },
      do_mgl: { base: 7.4, amp: 1.1, stepPile: 0.35 },
      turbidity_ntu: { base: 38.0, amp: 16.5, stepPile: -6.0 },
    };
    const cfg = baseByMetric[metric] || { base: 18.0, amp: 3.5, stepPile: 1.2 };
    const piles = [1, 2, 3, 4].map((pileNo) => {
      const points = [];
      const phase = ((seed + pileNo * 41) % 360) * Math.PI / 180;
      for (let i = 0; i < nPts; i++) {
        const ts = startMs + i * step;
        const h = ts / 3600000;
        const val = cfg.base + (pileNo - 1) * cfg.stepPile +
          cfg.amp * Math.sin((2 * Math.PI * h) / 12.42 + phase) +
          (cfg.amp * 0.28) * Math.cos((2 * Math.PI * h) / 24.0 + pileNo);
        points.push([new Date(ts).toISOString(), Number(Math.max(0.2, val).toFixed(2))]);
      }
      return { pile_no: pileNo, points };
    });
    return { station_id: stationId, metric, piles };
  }

  function buildPhenology(stationId, dateFilter) {
    const seed = hashSeed(stationId + ':pheno');
    const calendar = [];
    const today = new Date();
    for (let d = 44; d >= 0; d--) {
      const dt = new Date(today.getTime() - d * 86400 * 1000);
      const isoDate = dt.toISOString().slice(0, 10);
      const count = 4 + ((seed + d * 7) % 5);
      calendar.push({ date: isoDate, count });
    }
    const targetDate = dateFilter || calendar[calendar.length - 1].date;
    const slots = ['06:30', '09:00', '11:30', '14:00', '16:30', '18:15'];
    const items = slots.map((tok, idx) => ({
      id: `${stationId}_${targetDate}_${idx + 1}`,
      rel_path: `phenology/${stationId}/${targetDate}/CAM_PTZ${(idx % 3) + 1}_${tok.replace(':', '')}.svg`,
      file_type: 'image/svg+xml',
      capture_date: targetDate,
      time_token: tok,
      ptz: (idx % 3) + 1,
      is_image: true,
      tz_assumption: pick(
        'Synthetic demo phenology frames (simulated UTC+8 clock)',
        'UTC+8 合成物候演示时间戳（不对应真实野外图像）'
      ),
    }));
    return { station_id: stationId, calendar, items, total: items.length };
  }

  function buildSyntheticThumbSvg(fileId) {
    const seed = hashSeed(String(fileId));
    const hourIdx = seed % 6;
    const skyPalettes = [
      ['#1a2a4c', '#f59e0b'],
      ['#0c4a6e', '#38bdf8'],
      ['#0369a1', '#7dd3fc'],
      ['#075985', '#bae6fd'],
      ['#1e3a5f', '#fb923c'],
      ['#0f172a', '#6366f1'],
    ];
    const [skyTop, skyBot] = skyPalettes[hourIdx];
    const ndvi = (0.42 + (seed % 32) * 0.01).toFixed(2);
    const tide = (1.2 + (seed % 18) * 0.1).toFixed(1);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="360" height="220">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${skyTop}"/>
          <stop offset="100%" stop-color="${skyBot}"/>
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a3b5c"/>
          <stop offset="100%" stop-color="#041528"/>
        </linearGradient>
      </defs>
      <rect width="360" height="125" fill="url(#sky)"/>
      <circle cx="${70 + (hourIdx * 44)}" cy="${85 - Math.sin((hourIdx / 5) * Math.PI) * 48}" r="16" fill="#fef3c7" opacity="0.88"/>
      <rect y="120" width="360" height="100" fill="url(#sea)"/>
      <path d="M0 150 Q 60 132 135 148 T 280 144 T 360 154 L 360 220 L 0 220 Z" fill="#134e4a" opacity="0.9"/>
      <path d="M0 172 Q 90 156 190 174 T 360 168 L 360 220 L 0 220 Z" fill="#115e59" opacity="0.85"/>
      <path d="M18 134 Q 80 129 145 134 T 275 133 T 345 135" stroke="#7dd3fc" stroke-width="1.4" fill="none" opacity="0.65"/>
      <rect x="8" y="8" width="215" height="24" rx="4" fill="rgba(4,12,26,0.72)"/>
      <text x="16" y="24" fill="#e0f2fe" font-family="monospace" font-size="10.5">${String(fileId).slice(0, 28)}</text>
      <rect x="8" y="188" width="344" height="24" rx="4" fill="rgba(4,12,26,0.72)"/>
      <text x="16" y="204" fill="#34d399" font-family="monospace" font-size="10">SYNTHETIC PHENOLOGY CAM · NDVI ${ndvi} · TIDE ${tide}m</text>
    </svg>`;
    return new Blob([svg], { type: 'image/svg+xml' });
  }

  async function mockGet(path, query) {
    query = query || {};
    if (path === '/dashboard/summary') {
      return {
        visible_stations: FIELD_STATIONS_RAW.length,
        sampling_points: 142860,
        active_alerts: 2,
        latest_obs_time: new Date(Date.now() - 90 * 1000).toISOString(),
      };
    }
    if (path === '/dashboard/stations') {
      const items = FIELD_STATIONS_RAW.map((s) => ({
        station_id: s.station_id,
        name: pick(s.en, s.zh),
        station_type: s.station_type,
        lat: s.lat,
        lng: s.lng,
        is_mobile: s.is_mobile,
      }));
      return { items, total: items.length };
    }
    if (path === '/overlay/global-stations') {
      return {
        available: true,
        estuaries: OVERLAY_BASINS_RAW.map((b) => ({
          code: b.code,
          name_cn: pick(b.en, b.zh),
          name_en: b.en,
          center_lat: b.center_lat,
          center_lng: b.center_lng,
          box_deg: b.box_deg,
        })),
        stations: OVERLAY_STATIONS_RAW.map((s) => ({
          id: s.id,
          name: pick(s.en, s.zh),
          source: s.source,
          station_type: s.station_type,
          lat: s.lat,
          lng: s.lng,
        })),
      };
    }
    if (path === '/obs/profile-grid') {
      return buildProfileGrid(query.station_id || FIELD_STATIONS_RAW[0].station_id, query.metric || 'adcp_speed', query.start, query.end);
    }
    if (path === '/obs/vector-field') {
      return buildVectorField(query.station_id || FIELD_STATIONS_RAW[0].station_id, query.start, query.end);
    }
    if (path === '/obs/wave-rose') {
      return buildWaveRose(query.station_id || FIELD_STATIONS_RAW[0].station_id);
    }
    if (path === '/obs/wq-piles') {
      return buildWqPiles(query.station_id || FIELD_STATIONS_RAW[0].station_id, query.metric || 'salinity_psu', query.start, query.end);
    }
    if (path === '/files/phenology') {
      return buildPhenology(query.station_id || FIELD_STATIONS_RAW[0].station_id, query.date);
    }
    return {};
  }

  async function mockRaw(method, path) {
    const thumbMatch = path.match(/^\/files\/thumbnail\/(.+)$/);
    const dlMatch = path.match(/^\/files\/download\/(.+)$/);
    const fileId = (thumbMatch && thumbMatch[1]) || (dlMatch && dlMatch[1]) || 'synthetic';
    const blob = buildSyntheticThumbSvg(decodeURIComponent(fileId));
    return {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'image/svg+xml' }),
      blob: async () => blob,
    };
  }

  async function downloadFile(path, _query, filename) {
    const resp = await mockRaw('GET', path);
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'synthetic-phenology.svg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  const ROLE_LEVEL = { viewer: 0, operator: 1, admin: 2 };

  global.HydroAPI = {
    base: 'synthetic://own-dashboard',
    get: mockGet,
    post: async () => ({ ok: true }),
    put: async () => ({ ok: true }),
    del: async () => ({ ok: true }),
    raw: mockRaw,
    downloadFile,
    getRole: () => 'admin',
    getUsername: () => 'field_ops_demo',
    isAuthenticated: () => true,
    hasRole: () => true,
    roleLabel: (r) => pick(r || 'Admin', r === 'admin' ? '管理员' : '运维人员'),
    ROLE_LEVEL,
    ROLE_LABELS: { viewer: 'Viewer', operator: 'Operator', admin: 'Admin' },
    login: async () => ({ access_token: 'demo-own-token' }),
    logout: () => notify('info', pick('Auto-authenticated in Demo Mode', '演示模式已自动登录，无需退出')),
    requireAuth: () => true,
    requireRole: () => true,
    message: {
      success: (m) => notify('success', m),
      error: (m) => notify('error', m),
      warning: (m) => notify('warning', m),
      info: (m) => notify('info', m),
    },
    toQuery: (p) => (p ? '?' + new URLSearchParams(p).toString() : ''),
  };
})(window);
