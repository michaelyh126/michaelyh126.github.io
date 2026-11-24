/**
 * HydroAPI — Deterministic 100% Synthetic Hydrological Telemetry Engine (Demo Mode)
 * Self-contained replacement for Public Hydrology Big-Screen (zero network / zero localhost calls).
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

  function seededRand(seed) {
    let x = seed >>> 0;
    return function () {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return ((x >>> 0) % 100000) / 100000;
    };
  }

  const BASINS = [
    { id: 1, code: 'east_bay', name_cn: '东海湾示范流域', name_en: 'East Bay Coastal Basin', center_lat: 30.88, center_lng: 122.05, box_deg: 2.2 },
    { id: 2, code: 'south_shelf', name_cn: '南湾陆架海区', name_en: 'South Shelf Tidal Basin', center_lat: 22.15, center_lng: 114.12, box_deg: 2.0 },
    { id: 3, code: 'mekong_delta', name_cn: '湄公河三角洲海岸', name_en: 'Mekong Coastal Delta', center_lat: 9.85, center_lng: 106.45, box_deg: 2.4 },
    { id: 4, code: 'gulf_delta', name_cn: '墨西哥湾三角洲区', name_en: 'Mississippi Gulf Basin', center_lat: 29.18, center_lng: -89.45, box_deg: 2.5 },
    { id: 5, code: 'north_sea', name_cn: '北海潮汐示范海域', name_en: 'North Sea Tidal Basin', center_lat: 52.85, center_lng: 4.65, box_deg: 2.2 },
    { id: 6, code: 'tokyo_bay', name_cn: '太平洋西缘港湾区', name_en: 'West Pacific Bay Basin', center_lat: 35.38, center_lng: 139.82, box_deg: 1.8 },
  ];

  const STATION_SPECS = [
    // Basin 1: East Bay
    { id: 'SYN-EB-01', basin: 1, name: '东湾北口验潮基准站', source_code: 'hko', capability: 'realtime', lat: 31.14, lng: 121.84, connectivity: 'ok', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c', 'wind_speed_ms'] },
    { id: 'SYN-EB-02', basin: 1, name: '浅滩多参数浮标站A', source_code: 'jodc', capability: 'realtime', lat: 30.92, lng: 122.12, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'salinity_psu', 'pressure_hpa'] },
    { id: 'SYN-EB-03', basin: 1, name: '外海航道气象观测站', source_code: 'metar_cn', capability: 'realtime', lat: 30.72, lng: 122.34, connectivity: 'ok', metrics: ['wind_speed_ms', 'temp_c', 'pressure_hpa', 'rh_pct', 'visibility_m'] },
    { id: 'SYN-EB-04', basin: 1, name: '南翼潮滩综合水文站', source_code: 'isd', capability: 'daily_batch', lat: 30.58, lng: 121.78, connectivity: 'degraded', metrics: ['water_level_m', 'temp_c', 'precip_mm', 'wind_speed_ms'] },

    // Basin 2: South Shelf
    { id: 'SYN-SS-01', basin: 2, name: '港湾深水验潮站', source_code: 'hko', capability: 'realtime', lat: 22.28, lng: 114.18, connectivity: 'ok', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c'] },
    { id: 'SYN-SS-02', basin: 2, name: '离岸岛礁风浪站', source_code: 'metar_cn', capability: 'realtime', lat: 21.95, lng: 114.32, connectivity: 'ok', metrics: ['wind_speed_ms', 'wind_gust_ms', 'temp_c', 'pressure_hpa'] },
    { id: 'SYN-SS-03', basin: 2, name: '西翼盐度剖面浮标', source_code: 'isd', capability: 'realtime', lat: 22.08, lng: 113.78, connectivity: 'ok', metrics: ['salinity_psu', 'water_temp_c', 'water_level_m'] },
    { id: 'SYN-SS-04', basin: 2, name: '东岸滨海气象交换站', source_code: 'isd', capability: 'daily_batch', lat: 22.36, lng: 114.56, connectivity: 'ok', metrics: ['temp_c', 'rh_pct', 'pressure_hpa', 'precip_mm'] },

    // Basin 3: Mekong Delta
    { id: 'SYN-MK-01', basin: 3, name: '东支入海口潮位站', source_code: 'coops', capability: 'realtime', lat: 10.12, lng: 106.72, connectivity: 'ok', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c'] },
    { id: 'SYN-MK-02', basin: 3, name: '三角洲沿岸气象站', source_code: 'isd', capability: 'realtime', lat: 9.64, lng: 106.35, connectivity: 'ok', metrics: ['temp_c', 'rh_pct', 'wind_speed_ms', 'precip_mm'] },
    { id: 'SYN-MK-03', basin: 3, name: '近岸浑浊带观测标', source_code: 'jodc', capability: 'realtime', lat: 9.42, lng: 106.68, connectivity: 'degraded', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c'] },
    { id: 'SYN-MK-04', basin: 3, name: '西翼港口潮汐基准站', source_code: 'hko', capability: 'realtime', lat: 10.05, lng: 105.98, connectivity: 'ok', metrics: ['water_level_m', 'temp_c', 'pressure_hpa'] },

    // Basin 4: Gulf Delta
    { id: 'SYN-GF-01', basin: 4, name: 'Gulf Pass Tide Gauge', source_code: 'coops', capability: 'realtime', lat: 29.02, lng: -89.26, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'salinity_psu', 'wind_speed_ms'] },
    { id: 'SYN-GF-02', basin: 4, name: 'Delta Barrier Airport Met', source_code: 'metar_us', capability: 'realtime', lat: 29.48, lng: -89.82, connectivity: 'ok', metrics: ['temp_c', 'dewpoint_c', 'wind_speed_ms', 'pressure_hpa', 'visibility_m'] },
    { id: 'SYN-GF-03', basin: 4, name: 'Offshore Shelf Buoy W1', source_code: 'coops', capability: 'realtime', lat: 28.86, lng: -89.64, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'wind_gust_ms', 'pressure_hpa'] },
    { id: 'SYN-GF-04', basin: 4, name: 'East Bay Marsh Station', source_code: 'isd', capability: 'daily_batch', lat: 29.32, lng: -89.08, connectivity: 'down', metrics: ['temp_c', 'rh_pct', 'precip_mm'] },

    // Basin 5: North Sea
    { id: 'SYN-NS-01', basin: 5, name: 'Wadden Tidal Observatory', source_code: 'coops', capability: 'realtime', lat: 53.08, lng: 4.84, connectivity: 'ok', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c', 'wind_speed_ms'] },
    { id: 'SYN-NS-02', basin: 5, name: 'North Shelf Met Beacon', source_code: 'isd', capability: 'realtime', lat: 52.68, lng: 4.32, connectivity: 'ok', metrics: ['wind_speed_ms', 'pressure_hpa', 'temp_c', 'rh_pct'] },
    { id: 'SYN-NS-03', basin: 5, name: 'Coastal Channel Gauge', source_code: 'jodc', capability: 'realtime', lat: 52.46, lng: 4.58, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'salinity_psu'] },
    { id: 'SYN-NS-04', basin: 5, name: 'Harbor Aviation Met', source_code: 'metar_us', capability: 'realtime', lat: 52.92, lng: 4.95, connectivity: 'ok', metrics: ['temp_c', 'wind_speed_ms', 'visibility_m', 'pressure_hpa'] },

    // Basin 6: West Pacific Bay
    { id: 'SYN-WP-01', basin: 6, name: '湾口深槽验潮站', source_code: 'jodc', capability: 'realtime', lat: 35.24, lng: 139.78, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'salinity_psu'] },
    { id: 'SYN-WP-02', basin: 6, name: '内湾海气通量浮标', source_code: 'jodc', capability: 'realtime', lat: 35.52, lng: 139.92, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'wind_speed_ms', 'pressure_hpa'] },
    { id: 'SYN-WP-03', basin: 6, name: '临港气象观测站', source_code: 'metar_cn', capability: 'realtime', lat: 35.56, lng: 139.74, connectivity: 'ok', metrics: ['temp_c', 'wind_speed_ms', 'pressure_hpa', 'rh_pct'] },
    { id: 'SYN-WP-04', basin: 6, name: '外缘陆坡温盐标', source_code: 'isd', capability: 'daily_batch', lat: 35.08, lng: 140.08, connectivity: 'ok', metrics: ['water_temp_c', 'salinity_psu', 'wind_gust_ms'] },
  ];

  const nowIso = () => new Date(Date.now() - 120 * 1000).toISOString();

  function metricValue(stationId, metric, tsMs) {
    const seed = hashSeed(stationId + ':' + metric);
    const phase = (seed % 360) * Math.PI / 180;
    const h = tsMs / 3600000;
    const tideM2 = Math.sin((2 * Math.PI * h) / 12.42 + phase);
    const tideS2 = Math.sin((2 * Math.PI * h) / 12.0 + phase * 0.7);
    const diurnal = Math.sin((2 * Math.PI * h) / 24.0 + phase * 0.5);
    const synNoise = Math.sin(h * 1.73 + seed) * 0.12 + Math.cos(h * 0.41 + seed * 0.3) * 0.08;

    switch (metric) {
      case 'water_level_m':
        return Number((2.15 + 1.12 * tideM2 + 0.38 * tideS2 + 0.14 * diurnal + synNoise * 0.25).toFixed(3));
      case 'salinity_psu':
        return Number(Math.max(4.5, 22.8 + 4.4 * tideM2 + 1.1 * tideS2 + ((seed % 7) - 3) * 0.9 + synNoise * 1.4).toFixed(2));
      case 'water_temp_c':
        return Number((18.4 + ((seed % 9) - 4) * 0.8 + 0.95 * diurnal + 0.25 * tideM2 + synNoise * 0.3).toFixed(2));
      case 'temp_c':
        return Number((19.6 + ((seed % 11) - 5) * 1.1 + 3.2 * diurnal + synNoise * 0.7).toFixed(2));
      case 'dewpoint_c':
        return Number((14.2 + ((seed % 7) - 3) * 0.9 + 1.6 * diurnal + synNoise * 0.5).toFixed(2));
      case 'pressure_hpa':
        return Number((1013.4 + 4.2 * Math.sin(h / 48 + phase) + 1.1 * diurnal + synNoise * 0.9).toFixed(1));
      case 'wind_speed_ms':
        return Number(Math.max(0.6, 6.4 + 2.8 * Math.sin(h / 18 + phase) + 1.2 * diurnal + synNoise * 1.8).toFixed(2));
      case 'wind_gust_ms':
        return Number(Math.max(1.5, 9.2 + 3.6 * Math.sin(h / 18 + phase) + 1.5 * diurnal + synNoise * 2.2).toFixed(2));
      case 'rh_pct':
        return Number(Math.min(99, Math.max(42, 76 - 9 * diurnal + synNoise * 6)).toFixed(1));
      case 'visibility_m':
        return Math.round(Math.max(2500, 11500 + 3200 * diurnal + synNoise * 1800));
      case 'precip_mm':
        return Number(Math.max(0, (Math.sin(h / 11 + phase) - 0.65) * 8.5).toFixed(2));
      default:
        return Number((10 + 3 * tideM2 + synNoise).toFixed(2));
    }
  }

  function buildSeries(stationId, metrics, startIso, endIso, interval) {
    const endMs = endIso ? new Date(endIso).getTime() : Date.now();
    const startMs = startIso ? new Date(startIso).getTime() : (endMs - 7 * 86400 * 1000);
    const spanMs = Math.max(endMs - startMs, 3600 * 1000);
    const maxPts = interval === 'raw' ? 96 : 120;
    const stepMs = Math.max(Math.floor(spanMs / maxPts), 15 * 60 * 1000);

    return metrics.map((metric) => {
      const points = [];
      for (let t = startMs; t <= endMs; t += stepMs) {
        points.push([new Date(t).toISOString(), metricValue(stationId, metric, t)]);
      }
      return { station_id: stationId, metric, interval: interval || '1h', points };
    });
  }

  async function mockGet(path, params) {
    params = params || {};
    if (path === '/estuaries') {
      return BASINS.map((b) => Object.assign({}, b));
    }

    const stnMatch = path.match(/^\/estuaries\/(\d+)\/stations$/);
    if (stnMatch) {
      const bid = Number(stnMatch[1]);
      const list = STATION_SPECS.filter((s) => s.basin === bid).map((s) =>
        Object.assign({}, s, { latest_obs_time: nowIso() })
      );
      return { items: list, total: list.length, page: 1, size: list.length };
    }

    if (path === '/dashboard/summary') {
      const online = STATION_SPECS.filter((s) => s.connectivity === 'ok').length;
      return {
        station_count: STATION_SPECS.length,
        station_enabled_count: STATION_SPECS.length,
        online_count: online,
      };
    }

    if (path === '/dashboard/estuary-previews') {
      const ts = Date.now();
      return BASINS.map((b) => {
        const list = STATION_SPECS.filter((s) => s.basin === b.id).slice(0, 3);
        return {
          estuary_id: b.id,
          stations: list.map((s) => {
            const m = s.metrics[0] || 'water_level_m';
            return {
              station_id: s.id,
              station_name: s.name,
              metric: m,
              value: metricValue(s.id, m, ts),
              unit: m === 'water_level_m' ? 'm' : m === 'salinity_psu' ? 'psu' : m === 'wind_speed_ms' ? 'm/s' : '°C',
              time: nowIso(),
            };
          }),
        };
      });
    }

    const obsMatch = path.match(/^\/stations\/([^/]+)\/observations$/);
    if (obsMatch) {
      const stationId = decodeURIComponent(obsMatch[1]);
      const metrics = String(params.metrics || 'water_level_m').split(',').filter(Boolean);
      return buildSeries(stationId, metrics, params.start, params.end, params.interval || '1h');
    }

    if (path === '/alerts') {
      return {
        items: [
          { severity: 'info', scope_type: 'basin', scope_id: 'east_bay', message: '天文大潮高潮位窗口预警 · 潮差预计 3.4 m（合成演示）' },
          { severity: 'warn', scope_type: 'station', scope_id: 'SYN-EB-04', message: '南翼潮滩综合水文站回传延迟 18 min · 自动降级监测' },
          { severity: 'info', scope_type: 'basin', scope_id: 'north_sea', message: '北海示范海域西风增强至 11.4 m/s · 波高上升趋势' },
          { severity: 'warn', scope_type: 'station', scope_id: 'SYN-GF-04', message: 'East Bay Marsh Station 计划性传感器校准维护中' },
        ],
        total: 4,
      };
    }

    return {};
  }

  function poll(fn, intervalMs) {
    const id = setInterval(() => {
      try { fn(); } catch (e) { console.warn(e); }
    }, intervalMs);
    return function stop() { clearInterval(id); };
  }

  global.HydroAPI = {
    base: 'synthetic://public-hydrology',
    get: mockGet,
    post: async () => ({ ok: true }),
    login: async (username) => ({ access_token: 'demo-token', role: 'admin', username: username || 'demo_analyst' }),
    logout: function () { /* auto-authenticated demo */ },
    isAuthenticated: function () { return true; },
    getRole: function () { return 'admin'; },
    getUsername: function () { return 'demo_analyst'; },
    getToken: function () { return 'demo-token'; },
    redirectToLogin: function () {},
    poll,
  };
})(window);
