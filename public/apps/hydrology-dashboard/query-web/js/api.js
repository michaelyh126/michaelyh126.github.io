/**
 * HydroAPI (query-web) — Deterministic 100% Synthetic Spatial & Time-Series Query Engine (Demo Mode)
 * Implements real client-side BBox / Polygon spatial filtering, trajectory playback paths,
 * cross-namespace station catalog, scalar series, ADCP depth profiles, and CSV/manifest export.
 */
(function (global) {
  'use strict';

  function hashSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
  }

  function notify(type, msg) {
    if (global.ElementPlus && global.ElementPlus.ElMessage) {
      global.ElementPlus.ElMessage({ message: msg, type, duration: type === 'error' ? 4200 : 2400 });
    }
  }

  const STATIONS = [
    { station_id: 'field:FLD-ADCP-01', namespace: 'field', system: 'own', name: '北槽座底 ADCP 剖面潜标', lat: 31.12, lng: 122.04, is_mobile: false },
    { station_id: 'field:FLD-WAVE-02', namespace: 'field', system: 'own', name: '东海湾外缘测波浮标', lat: 30.86, lng: 122.42, is_mobile: false },
    { station_id: 'field:FLD-WQ-03', namespace: 'field', system: 'own', name: '潮滩多桩号水质阵列', lat: 30.96, lng: 121.88, is_mobile: false },
    { station_id: 'field:FLD-TIDE-04', namespace: 'field', system: 'own', name: '岛礁高精度雷达验潮站', lat: 30.68, lng: 122.26, is_mobile: false },
    { station_id: 'field:FLD-ADCP-07', namespace: 'field', system: 'own', name: '走航式 ADCP 断面观测船', lat: 30.90, lng: 122.18, is_mobile: true, track: [[31.08, 121.92], [31.01, 122.05], [30.90, 122.18], [30.80, 122.30], [30.72, 122.42]] },
    { station_id: 'field:FLD-WQ-08', namespace: 'field', system: 'own', name: '南翼盐水入侵监测浮标', lat: 30.62, lng: 121.92, is_mobile: false },
    { station_id: 'hko:SYN-HK-01', namespace: 'hko', system: 'app', name: '港湾深水验潮基准站', lat: 22.28, lng: 114.18, is_mobile: false },
    { station_id: 'hko:SYN-HK-02', namespace: 'hko', system: 'app', name: '外海岛屿验潮站', lat: 22.18, lng: 114.34, is_mobile: false },
    { station_id: 'jodc:SYN-JP-01', namespace: 'jodc', system: 'app', name: '西太平洋湾口验潮站', lat: 35.24, lng: 139.78, is_mobile: false },
    { station_id: 'jodc:SYN-JP-02', namespace: 'jodc', system: 'app', name: '内湾海气温盐浮标', lat: 35.52, lng: 139.92, is_mobile: false },
    { station_id: 'coops:SYN-US-01', namespace: 'coops', system: 'app', name: 'Gulf Pass Tide Gauge', lat: 29.02, lng: -89.26, is_mobile: false },
    { station_id: 'coops:SYN-US-02', namespace: 'coops', system: 'app', name: 'Wadden Tidal Observatory', lat: 53.08, lng: 4.84, is_mobile: false },
    { station_id: 'metar_cn:SYN-MC-01', namespace: 'metar_cn', system: 'app', name: '东湾沿岸航空气象站', lat: 31.14, lng: 121.79, is_mobile: false },
    { station_id: 'metar_cn:SYN-MC-02', namespace: 'metar_cn', system: 'app', name: '南岸临海气象站', lat: 22.31, lng: 113.92, is_mobile: false },
    { station_id: 'metar_us:SYN-MU-01', namespace: 'metar_us', system: 'app', name: 'Delta Barrier Airport Met', lat: 29.48, lng: -89.82, is_mobile: false },
    { station_id: 'metar_us:SYN-MU-02', namespace: 'metar_us', system: 'app', name: 'Harbor Aviation Met', lat: 52.92, lng: 4.95, is_mobile: false },
    { station_id: 'isd:SYN-ISD-01', namespace: 'isd', system: 'app', name: '东亚陆架国际气象交换站', lat: 30.72, lng: 122.34, is_mobile: false },
    { station_id: 'isd:SYN-ISD-02', namespace: 'isd', system: 'app', name: 'Mekong Coastal Met Exchange', lat: 9.64, lng: 106.35, is_mobile: false },
  ];

  const METRICS = {
    by_system: {
      app: [
        { code: 'water_level_m', name_cn: '水位/潮位', unit: 'm', system: 'app', dimensions: [] },
        { code: 'water_temp_c', name_cn: '表层水温', unit: '°C', system: 'app', dimensions: [] },
        { code: 'salinity_psu', name_cn: '海表盐度', unit: 'PSU', system: 'app', dimensions: [] },
        { code: 'temp_c', name_cn: '气温', unit: '°C', system: 'app', dimensions: [] },
        { code: 'pressure_hpa', name_cn: '海平面气压', unit: 'hPa', system: 'app', dimensions: [] },
        { code: 'wind_speed_ms', name_cn: '风速', unit: 'm/s', system: 'app', dimensions: [] },
        { code: 'wind_dir_deg', name_cn: '风向', unit: '°', system: 'app', dimensions: [] },
        { code: 'wind_gust_ms', name_cn: '阵风', unit: 'm/s', system: 'app', dimensions: [] },
        { code: 'rh_pct', name_cn: '相对湿度', unit: '%', system: 'app', dimensions: [] },
        { code: 'visibility_m', name_cn: '能见度', unit: 'm', system: 'app', dimensions: [] },
      ],
      own: [
        { code: 'adcp_speed', name_cn: 'ADCP 流速剖面', unit: 'm/s', system: 'own', dimensions: ['depth_layer'] },
        { code: 'adcp_u_ms', name_cn: '东向流速分量 U', unit: 'm/s', system: 'own', dimensions: ['depth_layer'] },
        { code: 'adcp_v_ms', name_cn: '北向流速分量 V', unit: 'm/s', system: 'own', dimensions: ['depth_layer'] },
        { code: 'salinity_psu', name_cn: '多桩号盐度', unit: 'PSU', system: 'own', dimensions: ['pile_no'] },
        { code: 'turbidity_ntu', name_cn: '悬沙浊度', unit: 'NTU', system: 'own', dimensions: ['pile_no'] },
        { code: 'wave_hs_m', name_cn: '有效波高 Hs', unit: 'm', system: 'own', dimensions: [] },
        { code: 'wind_speed_ms', name_cn: '铁塔风速', unit: 'm/s', system: 'own', dimensions: [] },
        { code: 'wind_dir_deg', name_cn: '铁塔风向', unit: '°', system: 'own', dimensions: [] },
        { code: 'wind_gust_ms', name_cn: '铁塔阵风', unit: 'm/s', system: 'own', dimensions: [] },
        { code: 'rh_pct', name_cn: '相对湿度', unit: '%', system: 'own', dimensions: [] },
        { code: 'visibility_m', name_cn: '海面能见度', unit: 'm', system: 'own', dimensions: [] },
      ],
    },
    cross_system_shared_codes: ['wind_speed_ms', 'wind_dir_deg', 'wind_gust_ms', 'rh_pct', 'visibility_m'],
    degraded: [],
  };

  function pointInPolygon(lat, lng, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const yi = ring[i][0], xi = ring[i][1];
      const yj = ring[j][0], xj = ring[j][1];
      const intersect = ((yi > lat) !== (yj > lat)) && (lng < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function matchSpatial(query) {
    let filterFn = () => true;
    if (query.bbox) {
      const [minLng, minLat, maxLng, maxLat] = String(query.bbox).split(',').map(Number);
      filterFn = (lat, lng) => lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
    } else if (query.polygon) {
      const ring = String(query.polygon).split(';').map((pair) => pair.split(',').map(Number));
      filterFn = (lat, lng) => pointInPolygon(lat, lng, ring);
    }

    const mode = query.mode || 'current';
    const items = [];
    STATIONS.forEach((s) => {
      let hit = filterFn(s.lat, s.lng);
      if (!hit && mode === 'trajectory' && Array.isArray(s.track)) {
        hit = s.track.some(([la, ln]) => filterFn(la, ln));
      }
      if (hit) {
        const out = Object.assign({}, s);
        if (mode === 'trajectory' && Array.isArray(s.track)) {
          out.n_points = s.track.length * 48;
          out.first_time = query.start || new Date(Date.now() - 7 * 864e5).toISOString();
          out.last_time = query.end || new Date().toISOString();
        }
        items.push(out);
      }
    });

    return {
      mode,
      count: items.length,
      items,
      auth_note: 'Demo Scope: all synthetic stations authorized (mode=' + (query.auth_mode || 'current') + ')',
      degraded: [],
    };
  }

  function metricVal(stationId, metric, tsMs) {
    const seed = hashSeed(stationId + ':' + metric);
    const phase = (seed % 360) * Math.PI / 180;
    const h = tsMs / 3600000;
    const m2 = Math.sin((2 * Math.PI * h) / 12.42 + phase);
    const d1 = Math.sin((2 * Math.PI * h) / 24.0 + phase * 0.5);
    if (metric.includes('water_level')) return Number((2.2 + 1.15 * m2 + 0.25 * d1).toFixed(3));
    if (metric.includes('salinity')) return Number(Math.max(5, 22.0 + 4.5 * m2 + 0.8 * d1).toFixed(2));
    if (metric.includes('temp')) return Number((19.0 + 1.8 * d1 + 0.4 * m2).toFixed(2));
    if (metric.includes('pressure')) return Number((1013.2 + 3.5 * Math.sin(h / 42 + phase) + 0.8 * d1).toFixed(1));
    if (metric.includes('adcp') || metric.includes('speed')) return Number(Math.max(0.05, 0.82 + 0.55 * Math.abs(m2) + 0.12 * d1).toFixed(3));
    if (metric.includes('wave')) return Number(Math.max(0.2, 1.35 + 0.55 * Math.sin(h / 20 + phase)).toFixed(2));
    if (metric.includes('turbidity')) return Number(Math.max(4, 34 + 14 * Math.abs(m2)).toFixed(1));
    return Number((12.5 + 3.2 * m2 + 1.1 * d1).toFixed(2));
  }

  function buildSeries(query) {
    const stationId = query.station_id || STATIONS[0].station_id;
    const metric = query.metric || 'water_level_m';
    const endMs = query.end ? new Date(query.end).getTime() : Date.now();
    const startMs = query.start ? new Date(query.start).getTime() : (endMs - 7 * 864e5);
    const nPts = 96;
    const step = Math.max(Math.floor((endMs - startMs) / (nPts - 1)), 15 * 60 * 1000);
    const points = [];
    for (let i = 0; i < nPts; i++) {
      const t = startMs + i * step;
      points.push([new Date(t).toISOString(), metricVal(stationId, metric, t)]);
    }
    const ns = stationId.split(':')[0];
    return {
      station_id: stationId,
      metric,
      system: ns === 'field' ? 'own' : 'app',
      interval: '1h',
      available: true,
      points,
      qc_note: 'Synthetic demo telemetry · deterministic harmonic model (qc=1)',
    };
  }

  function buildProfile(query) {
    const stationId = query.station_id || STATIONS[0].station_id;
    const metric = query.metric || 'adcp_speed';
    const endMs = query.end ? new Date(query.end).getTime() : Date.now();
    const startMs = query.start ? new Date(query.start).getTime() : (endMs - 7 * 864e5);
    const nTimes = 24;
    const step = Math.max(Math.floor((endMs - startMs) / (nTimes - 1)), 3600 * 1000);
    const onlyLayer = query.depth_layer != null && query.depth_layer !== '' ? Number(query.depth_layer) : null;
    const layers = onlyLayer != null ? [onlyLayer] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const phase = (hashSeed(stationId + metric) % 360) * Math.PI / 180;
    const points = [];

    for (let ti = 0; ti < nTimes; ti++) {
      const ts = startMs + ti * step;
      const iso = new Date(ts).toISOString();
      const tide = Math.abs(Math.sin((2 * Math.PI * (ts / 3600000)) / 12.42 + phase));
      layers.forEach((layer) => {
        const decay = 1 - (layer - 1) * 0.065;
        const val = Number(Math.max(0.03, (0.2 + 1.18 * tide) * decay).toFixed(3));
        points.push({
          time: iso,
          depth_layer: layer,
          beam: -1,
          pile_no: query.pile_no ? Number(query.pile_no) : -1,
          view_point: -1,
          value: val,
          qc: (ti + layer) % 11 === 0 ? 0 : 1,
        });
      });
    }
    return {
      station_id: stationId,
      metric,
      depth_axis: 'layer',
      available: true,
      points,
      qc_note: 'Synthetic ADCP depth-layer profile (depth_axis=layer)',
    };
  }

  async function mockGet(path, query) {
    query = query || {};
    if (path === '/stations') {
      const ns = query.namespace || '';
      const filtered = ns ? STATIONS.filter((s) => s.namespace === ns) : STATIONS;
      const page = Math.max(1, Number(query.page) || 1);
      const size = Math.max(1, Number(query.size) || 50);
      const items = filtered.slice((page - 1) * size, page * size);
      return { items, total: filtered.length, page, size, degraded: [] };
    }
    if (path === '/metrics') return METRICS;
    if (path === '/spatial') return matchSpatial(query);
    if (path === '/series') return buildSeries(query);
    if (path === '/profile') return buildProfile(query);
    return {};
  }

  async function mockRaw(method, path, opts) {
    const q = (opts && opts.query) || {};
    const series = buildSeries(q);
    const fmt = q.format || 'csv';
    const manifest = {
      platform: 'HydrologyPlatform Query-Web (Synthetic Demo)',
      station_id: series.station_id,
      metric: series.metric,
      format: fmt,
      rows: series.points.length,
      generated_at: new Date().toISOString(),
    };
    const checksumHex = 'sha256:syn' + hashSeed(JSON.stringify(manifest)).toString(16).padStart(8, '0') + 'e4f9a2b7c1d8';

    let content;
    let contentType;
    if (fmt === 'csv') {
      const lines = ['station_id,metric,time,value,qc'];
      series.points.forEach(([t, v]) => lines.push(`${series.station_id},${series.metric},${t},${v},1`));
      content = lines.join('\n');
      contentType = 'text/csv; charset=utf-8';
    } else {
      content = JSON.stringify({ notice: `Synthetic ${fmt.toUpperCase()} demo payload`, manifest, sample_points: series.points.slice(0, 20) }, null, 2);
      contentType = 'application/octet-stream';
    }

    const blob = new Blob([content], { type: contentType });
    const headers = new Headers({
      'content-type': contentType,
      'X-Query-Checksum': checksumHex,
      'X-Query-Manifest': JSON.stringify(manifest),
    });
    return {
      ok: true,
      status: 200,
      headers,
      blob: async () => blob,
      json: async () => manifest,
    };
  }

  const ROLE_LEVEL = { viewer: 0, operator: 1, admin: 2 };
  const ROLE_LABELS = { viewer: '访客', operator: '科研查询', admin: '管理员' };

  global.HydroAPI = {
    base: 'synthetic://query-web',
    get: mockGet,
    post: async () => ({ ok: true }),
    put: async () => ({ ok: true }),
    del: async () => ({ ok: true }),
    raw: mockRaw,
    getRole: () => 'operator',
    getUsername: () => 'demo_researcher',
    isAuthenticated: () => true,
    hasRole: () => true,
    roleLabel: (r) => ROLE_LABELS[r] || r || '科研查询',
    ROLE_LEVEL,
    ROLE_LABELS,
    login: async () => ({ access_token: 'demo-query-token' }),
    register: async () => ({ status: 'approved' }),
    logout: () => notify('info', '演示模式已自动登录，无需退出'),
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
