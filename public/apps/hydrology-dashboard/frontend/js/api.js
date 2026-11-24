/**
 * HydroAPI — Deterministic 100% Synthetic Bilingual Hydrological Telemetry Engine (Demo Mode)
 */
(function (global) {
  'use strict';

  function isZh() {
    return global.HydroI18n ? global.HydroI18n.isZh() : false;
  }
  function pick(en, zh) { return isZh() ? zh : en; }

  function hashSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
  }

  const BASINS_RAW = [
    { id: 1, code: 'east_bay', en: 'East Bay Coastal Basin', zh: '东海湾示范流域', center_lat: 30.88, center_lng: 122.05, box_deg: 2.2 },
    { id: 2, code: 'south_shelf', en: 'South Shelf Tidal Basin', zh: '南湾陆架海区', center_lat: 22.15, center_lng: 114.12, box_deg: 2.0 },
    { id: 3, code: 'mekong_delta', en: 'Mekong Coastal Delta', zh: '湄公河三角洲海岸', center_lat: 9.85, center_lng: 106.45, box_deg: 2.4 },
    { id: 4, code: 'gulf_delta', en: 'Mississippi Gulf Basin', zh: '墨西哥湾三角洲区', center_lat: 29.18, center_lng: -89.45, box_deg: 2.5 },
    { id: 5, code: 'north_sea', en: 'North Sea Tidal Basin', zh: '北海潮汐示范海域', center_lat: 52.85, center_lng: 4.65, box_deg: 2.2 },
    { id: 6, code: 'tokyo_bay', en: 'West Pacific Bay Basin', zh: '太平洋西缘港湾区', center_lat: 35.38, center_lng: 139.82, box_deg: 1.8 },
  ];

  const STATION_SPECS = [
    // Basin 1: East Bay
    { id: 'SYN-EB-01', basin: 1, en: 'East Bay North Tide Gauge', zh: '东湾北口验潮基准站', source_code: 'hko', capability: 'realtime', lat: 31.14, lng: 121.84, connectivity: 'ok', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c', 'wind_speed_ms'] },
    { id: 'SYN-EB-02', basin: 1, en: 'Shoal Multi-Param Buoy A', zh: '浅滩多参数浮标站A', source_code: 'jodc', capability: 'realtime', lat: 30.92, lng: 122.12, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'salinity_psu', 'pressure_hpa'] },
    { id: 'SYN-EB-03', basin: 1, en: 'Outer Channel Met Station', zh: '外海航道气象观测站', source_code: 'metar_cn', capability: 'realtime', lat: 30.72, lng: 122.34, connectivity: 'ok', metrics: ['wind_speed_ms', 'temp_c', 'pressure_hpa', 'rh_pct', 'visibility_m'] },
    { id: 'SYN-EB-04', basin: 1, en: 'South Tidal Flat Hydro Node', zh: '南翼潮滩综合水文站', source_code: 'isd', capability: 'daily_batch', lat: 30.58, lng: 121.78, connectivity: 'degraded', metrics: ['water_level_m', 'temp_c', 'precip_mm', 'wind_speed_ms'] },

    // Basin 2: South Shelf
    { id: 'SYN-SS-01', basin: 2, en: 'Deep Harbor Tide Gauge', zh: '港湾深水验潮站', source_code: 'hko', capability: 'realtime', lat: 22.28, lng: 114.18, connectivity: 'ok', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c'] },
    { id: 'SYN-SS-02', basin: 2, en: 'Offshore Island Wave Station', zh: '离岸岛礁风浪站', source_code: 'metar_cn', capability: 'realtime', lat: 21.95, lng: 114.32, connectivity: 'ok', metrics: ['wind_speed_ms', 'wind_gust_ms', 'temp_c', 'pressure_hpa'] },
    { id: 'SYN-SS-03', basin: 2, en: 'West Wing Salinity Buoy', zh: '西翼盐度剖面浮标', source_code: 'isd', capability: 'realtime', lat: 22.08, lng: 113.78, connectivity: 'ok', metrics: ['salinity_psu', 'water_temp_c', 'water_level_m'] },
    { id: 'SYN-SS-04', basin: 2, en: 'East Coast Met Exchange', zh: '东岸滨海气象交换站', source_code: 'isd', capability: 'daily_batch', lat: 22.36, lng: 114.56, connectivity: 'ok', metrics: ['temp_c', 'rh_pct', 'pressure_hpa', 'precip_mm'] },

    // Basin 3: Mekong Delta
    { id: 'SYN-MK-01', basin: 3, en: 'East Mouth Tide Gauge', zh: '东支入海口潮位站', source_code: 'coops', capability: 'realtime', lat: 10.12, lng: 106.72, connectivity: 'ok', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c'] },
    { id: 'SYN-MK-02', basin: 3, en: 'Delta Coastal Met Station', zh: '三角洲沿岸气象站', source_code: 'isd', capability: 'realtime', lat: 9.64, lng: 106.35, connectivity: 'ok', metrics: ['temp_c', 'rh_pct', 'wind_speed_ms', 'precip_mm'] },
    { id: 'SYN-MK-03', basin: 3, en: 'Nearshore Turbidity Buoy', zh: '近岸浑浊带观测标', source_code: 'jodc', capability: 'realtime', lat: 9.42, lng: 106.68, connectivity: 'degraded', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c'] },
    { id: 'SYN-MK-04', basin: 3, en: 'West Port Tide Benchmark', zh: '西翼港口潮汐基准站', source_code: 'hko', capability: 'realtime', lat: 10.05, lng: 105.98, connectivity: 'ok', metrics: ['water_level_m', 'temp_c', 'pressure_hpa'] },

    // Basin 4: Gulf Delta
    { id: 'SYN-GF-01', basin: 4, en: 'Gulf Pass Tide Gauge', zh: '墨西哥湾口验潮站', source_code: 'coops', capability: 'realtime', lat: 29.02, lng: -89.26, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'salinity_psu', 'wind_speed_ms'] },
    { id: 'SYN-GF-02', basin: 4, en: 'Delta Barrier Airport Met', zh: '三角洲机场气象站', source_code: 'metar_us', capability: 'realtime', lat: 29.48, lng: -89.82, connectivity: 'ok', metrics: ['temp_c', 'dewpoint_c', 'wind_speed_ms', 'pressure_hpa', 'visibility_m'] },
    { id: 'SYN-GF-03', basin: 4, en: 'Offshore Shelf Buoy W1', zh: '外陆架综合浮标 W1', source_code: 'coops', capability: 'realtime', lat: 28.86, lng: -89.64, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'wind_gust_ms', 'pressure_hpa'] },
    { id: 'SYN-GF-04', basin: 4, en: 'East Bay Marsh Station', zh: '东湾盐沼观测站', source_code: 'isd', capability: 'daily_batch', lat: 29.32, lng: -89.08, connectivity: 'down', metrics: ['temp_c', 'rh_pct', 'precip_mm'] },

    // Basin 5: North Sea
    { id: 'SYN-NS-01', basin: 5, en: 'Wadden Tidal Observatory', zh: '瓦登海潮汐观测站', source_code: 'coops', capability: 'realtime', lat: 53.08, lng: 4.84, connectivity: 'ok', metrics: ['water_level_m', 'salinity_psu', 'water_temp_c', 'wind_speed_ms'] },
    { id: 'SYN-NS-02', basin: 5, en: 'North Shelf Met Beacon', zh: '北海陆架气象浮标', source_code: 'isd', capability: 'realtime', lat: 52.68, lng: 4.32, connectivity: 'ok', metrics: ['wind_speed_ms', 'pressure_hpa', 'temp_c', 'rh_pct'] },
    { id: 'SYN-NS-03', basin: 5, en: 'Coastal Channel Gauge', zh: '近岸航道验潮站', source_code: 'jodc', capability: 'realtime', lat: 52.46, lng: 4.58, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'salinity_psu'] },
    { id: 'SYN-NS-04', basin: 5, en: 'Harbor Aviation Met', zh: '海港航空气象站', source_code: 'metar_us', capability: 'realtime', lat: 52.92, lng: 4.95, connectivity: 'ok', metrics: ['temp_c', 'wind_speed_ms', 'visibility_m', 'pressure_hpa'] },

    // Basin 6: West Pacific Bay
    { id: 'SYN-WP-01', basin: 6, en: 'Bay Mouth Deep Channel Gauge', zh: '湾口深槽验潮站', source_code: 'jodc', capability: 'realtime', lat: 35.24, lng: 139.78, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'salinity_psu'] },
    { id: 'SYN-WP-02', basin: 6, en: 'Inner Bay Air-Sea Flux Buoy', zh: '内湾海气通量浮标', source_code: 'jodc', capability: 'realtime', lat: 35.52, lng: 139.92, connectivity: 'ok', metrics: ['water_level_m', 'water_temp_c', 'wind_speed_ms', 'pressure_hpa'] },
    { id: 'SYN-WP-03', basin: 6, en: 'Port Coastal Met Station', zh: '临港气象观测站', source_code: 'metar_cn', capability: 'realtime', lat: 35.56, lng: 139.74, connectivity: 'ok', metrics: ['temp_c', 'wind_speed_ms', 'pressure_hpa', 'rh_pct'] },
    { id: 'SYN-WP-04', basin: 6, en: 'Outer Slope CTD Mooring', zh: '外缘陆坡温盐标', source_code: 'isd', capability: 'daily_batch', lat: 35.08, lng: 140.08, connectivity: 'ok', metrics: ['water_temp_c', 'salinity_psu', 'wind_gust_ms'] },
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

  function mapBasin(b) {
    const latStr = Math.abs(b.center_lat).toFixed(1) + (b.center_lat >= 0 ? '°N' : '°S');
    const lngStr = Math.abs(b.center_lng).toFixed(1) + (b.center_lng >= 0 ? '°E' : '°W');
    return {
      id: b.id,
      code: b.code,
      name_cn: pick(b.en, b.zh),
      name_en: pick(`${latStr} · ${lngStr}`, b.en),
      center_lat: b.center_lat,
      center_lng: b.center_lng,
      box_deg: b.box_deg,
    };
  }

  function mapStation(s) {
    return {
      id: s.id,
      basin: s.basin,
      name: pick(s.en, s.zh),
      source_code: s.source_code,
      capability: s.capability,
      lat: s.lat,
      lng: s.lng,
      connectivity: s.connectivity,
      metrics: s.metrics,
      latest_obs_time: nowIso(),
    };
  }

  async function mockGet(path, params) {
    params = params || {};
    if (path === '/estuaries') {
      return BASINS_RAW.map(mapBasin);
    }

    const stnMatch = path.match(/^\/estuaries\/(\d+)\/stations$/);
    if (stnMatch) {
      const bid = Number(stnMatch[1]);
      const list = STATION_SPECS.filter((s) => s.basin === bid).map(mapStation);
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
      return BASINS_RAW.map((b) => {
        const list = STATION_SPECS.filter((s) => s.basin === b.id).slice(0, 3);
        return {
          estuary_id: b.id,
          stations: list.map((s) => {
            const m = s.metrics[0] || 'water_level_m';
            return {
              station_id: s.id,
              station_name: pick(s.en, s.zh),
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
          {
            severity: 'info',
            scope_type: 'basin',
            scope_id: 'east_bay',
            message: pick(
              'Spring high-tide window advisory · Predicted range 3.4 m (Synthetic Demo)',
              '天文大潮高潮位窗口预警 · 潮差预计 3.4 m（合成演示）'
            ),
          },
          {
            severity: 'warn',
            scope_type: 'station',
            scope_id: 'SYN-EB-04',
            message: pick(
              'South Tidal Flat Hydro Node telemetry delayed 18 min · Degraded mode',
              '南翼潮滩综合水文站回传延迟 18 min · 自动降级监测'
            ),
          },
          {
            severity: 'info',
            scope_type: 'basin',
            scope_id: 'north_sea',
            message: pick(
              'North Sea westerly wind strengthening to 11.4 m/s · Rising swell trend',
              '北海示范海域西风增强至 11.4 m/s · 波高上升趋势'
            ),
          },
          {
            severity: 'warn',
            scope_type: 'station',
            scope_id: 'SYN-GF-04',
            message: pick(
              'East Bay Marsh Station scheduled sensor calibration maintenance',
              '东湾盐沼观测站计划性传感器校准维护中'
            ),
          },
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
    logout: function () {},
    isAuthenticated: function () { return true; },
    getRole: function () { return 'admin'; },
    getUsername: function () { return 'demo_analyst'; },
    getToken: function () { return 'demo-token'; },
    redirectToLogin: function () {},
    poll,
  };
})(window);
