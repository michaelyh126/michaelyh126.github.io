/**
 * HydroCharts — own-dashboard ECharts5 Bilingual Visualizer (EN default / ZH toggle)
 */
(function (global) {
  'use strict';
  if (!global.echarts) { console.error('[own-dashboard] echarts not loaded'); }

  function isZh() { return global.HydroI18n ? global.HydroI18n.isZh() : false; }
  function pick(en, zh) { return isZh() ? zh : en; }
  function loc() { return isZh() ? 'zh-CN' : 'en-US'; }

  const rootEl = document.documentElement;
  function cssVar(name) { return getComputedStyle(rootEl).getPropertyValue(name).trim() || name; }

  function hexToRgbArr(hex) {
    if (!hex || hex.charAt(0) !== '#') return [126, 184, 212];
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  }
  function rgba(hex, a) { const [r, g, b] = hexToRgbArr(hex); return `rgba(${r},${g},${b},${a})`; }

  const SCALE_STOPS = ['#0a2a5e', '#1e6fff', '#4fc3f7', '#00d4c8', '#eafcff'];
  function lerp(a, b, t) { return a + (b - a) * t; }
  function scaleColor(t) {
    t = Math.max(0, Math.min(1, t));
    const n = SCALE_STOPS.length - 1;
    const seg = Math.min(Math.floor(t * n), n - 1);
    const local = t * n - seg;
    const c1 = hexToRgbArr(SCALE_STOPS[seg]);
    const c2 = hexToRgbArr(SCALE_STOPS[seg + 1]);
    return `rgb(${Math.round(lerp(c1[0], c2[0], local))},${Math.round(lerp(c1[1], c2[1], local))},${Math.round(lerp(c1[2], c2[2], local))})`;
  }

  const instances = new Map();
  function chart(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    let inst = global.echarts.getInstanceByDom(el);
    if (!inst) inst = global.echarts.init(el);
    instances.set(id, inst);
    return inst;
  }
  function resizeAll() { instances.forEach(i => { try { i.resize(); } catch (e) {} }); }
  function clear(id) { const el = document.getElementById(id); if (!el) return; const i = global.echarts.getInstanceByDom(el); if (i) i.clear(); }

  function fmtTime(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString(loc(), { month: '2-digit', day: '2-digit' }) + ' ' +
      d.toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  const baseTooltip = () => ({
    backgroundColor: 'rgba(6,18,42,0.95)',
    borderColor: rgba(cssVar('--blue'), 0.35),
    textStyle: { color: cssVar('--text'), fontSize: 11 },
    extraCssText: 'box-shadow:0 8px 32px rgba(0,0,0,0.5);',
  });
  const axisLabelStyle = () => ({ color: cssVar('--muted'), fontSize: 9 });
  const axisLineStyle = () => ({ lineStyle: { color: rgba(cssVar('--blue-light'), 0.2) } });
  const splitLineStyle = () => ({ lineStyle: { color: rgba(cssVar('--blue-light'), 0.08), type: 'dashed' } });

  function renderHeatmap(id, data) {
    const inst = chart(id); if (!inst) return;
    const layers = data.layers || [];
    const times = data.times || [];
    const matrix = data.matrix || [];
    const coverage = data.coverage || [];
    const qc = data.qc || [];

    const useLayerOnly = (data.depth_axis || 'layer') === 'layer' || !data.adcp_depth_annotation_enabled;
    const yLabels = layers.map(l => useLayerOnly ? ('L' + l) : (l + ' m'));
    const xLabels = times.map(fmtTime);

    const items = [];
    let vmin = Infinity, vmax = -Infinity, hasVal = false;
    for (let ti = 0; ti < times.length; ti++) {
      for (let li = 0; li < layers.length; li++) {
        const val = matrix[ti] ? matrix[ti][li] : null;
        const cov = coverage[ti] && coverage[ti][li] ? 1 : 0;
        const q = qc[ti] ? qc[ti][li] : null;
        if (val !== null && val !== undefined && !Number.isNaN(val)) {
          hasVal = true; if (val < vmin) vmin = val; if (val > vmax) vmax = val;
        }
        items.push([ti, li, (val === undefined ? null : val), cov, q]);
      }
    }
    if (!hasVal) { vmin = 0; vmax = 1; }
    if (vmin === vmax) vmax = vmin + 1;

    const MISS_FILL = rgba(cssVar('--muted'), 0.05);
    const MISS_STROKE = rgba(cssVar('--muted'), 0.4);
    const NULL_STROKE = rgba(cssVar('--blue'), 0.28);

    inst.setOption({
      backgroundColor: 'transparent',
      grid: { top: 14, right: 18, bottom: 30, left: 42 },
      tooltip: Object.assign(baseTooltip(), {
        formatter: (p) => {
          const v = p.value; const ti = v[0], li = v[1], val = v[2], cov = v[3], q = v[4];
          let state = (val !== null && val !== undefined)
            ? `<b>${Number(val).toFixed(3)}</b>`
            : (cov ? pick('Sampled · Null', '有采样行 · 无有效值(null)') : pick('Missing / Unsynced', '缺测 / 未同步'));
          const qcTxt = (q === 0)
            ? pick('qc=0 unknown', 'qc=0 质量未知')
            : (q === null || q === undefined ? pick('qc N/A', 'qc 无') : 'qc=' + q);
          return `${xLabels[ti] || ''}<br/>${pick('Layer', '层号')} <b>${yLabels[li] || ''}</b><br/>${state}<br/><span style="color:${cssVar('--muted')}">${qcTxt}</span>`;
        },
      }),
      visualMap: {
        type: 'continuous', min: vmin, max: vmax, dimension: 2, seriesIndex: 0,
        calculable: true, orient: 'horizontal', left: 'center', bottom: -2, itemWidth: 10, itemHeight: 70,
        text: [pick('High', '高'), pick('Low', '低')], textStyle: { color: cssVar('--muted'), fontSize: 9 },
        inRange: { color: SCALE_STOPS },
        show: hasVal,
      },
      xAxis: {
        type: 'category', data: xLabels,
        axisLine: axisLineStyle(), axisTick: { show: false },
        axisLabel: Object.assign(axisLabelStyle(), { interval: Math.max(Math.floor(xLabels.length / 6), 0), hideOverlap: true }),
      },
      yAxis: {
        type: 'category', data: yLabels, name: useLayerOnly ? pick('Layer', '层号') : pick('Depth', '深度'),
        nameTextStyle: { color: cssVar('--muted'), fontSize: 9 },
        axisLine: axisLineStyle(), axisTick: { show: false },
        axisLabel: axisLabelStyle(),
      },
      series: [{
        type: 'custom', name: 'ADCP',
        renderItem: (params, api) => {
          const ti = api.value(0), li = api.value(1), val = api.value(2), cov = api.value(3);
          const center = api.coord([ti, li]);
          const size = api.size ? api.size([1, 1]) : [10, 10];
          const w = size[0], h = size[1], pad = 0.5;
          const shape = { x: center[0] - w / 2 + pad, y: center[1] - h / 2 + pad, width: Math.max(w - 2 * pad, 1), height: Math.max(h - 2 * pad, 1) };
          if (cov === 0) {
            return { type: 'group', children: [
              { type: 'rect', shape, style: { fill: MISS_FILL, stroke: MISS_STROKE, lineWidth: 0.5, lineDash: [2, 2] } },
              { type: 'line', shape: { x1: shape.x, y1: shape.y + shape.height, x2: shape.x + shape.width, y2: shape.y }, style: { stroke: MISS_STROKE, lineWidth: 0.8 } },
            ] };
          }
          if (val === null || val === undefined || Number.isNaN(val)) {
            return { type: 'rect', shape, style: { fill: 'transparent', stroke: NULL_STROKE, lineWidth: 0.75 } };
          }
          return { type: 'rect', shape, style: { fill: api.visual('color') } };
        },
        data: items,
      }],
    }, true);
  }

  function renderVector(id, data) {
    const inst = chart(id); if (!inst) return;
    const pts = data.points || [];
    const timeSet = [], layerSet = [];
    pts.forEach(p => { if (timeSet.indexOf(p.time) < 0) timeSet.push(p.time); if (layerSet.indexOf(p.depth_layer) < 0) layerSet.push(p.depth_layer); });
    timeSet.sort((a, b) => new Date(a) - new Date(b));
    layerSet.sort((a, b) => a - b);
    const tIdx = new Map(timeSet.map((t, i) => [t, i]));
    const lIdx = new Map(layerSet.map((l, i) => [l, i]));
    const xLabels = timeSet.map(fmtTime);
    const yLabels = layerSet.map(l => 'L' + l);

    let smin = Infinity, smax = -Infinity;
    const items = pts.map(p => {
      const s = p.speed != null ? p.speed : Math.hypot(p.u || 0, p.v || 0);
      if (s < smin) smin = s; if (s > smax) smax = s;
      return [tIdx.get(p.time), lIdx.get(p.depth_layer), p.u || 0, p.v || 0, s, p.dir_deg];
    });
    if (!items.length) { smin = 0; smax = 1; }
    if (smin === smax) smax = smin + 1;

    inst.setOption({
      backgroundColor: 'transparent',
      grid: { top: 14, right: 18, bottom: 30, left: 42 },
      tooltip: Object.assign(baseTooltip(), {
        formatter: (p) => {
          const v = p.value; const ti = v[0], li = v[1], u = v[2], w = v[3], s = v[4], dir = v[5];
          return `${xLabels[ti] || ''}<br/>${pick('Layer', '层号')} <b>${yLabels[li] || ''}</b><br/>U(east)=${Number(u).toFixed(3)} · V(north)=${Number(w).toFixed(3)}<br/>${pick('Speed', '速率')} <b>${Number(s).toFixed(3)}</b> ${data.speed_unit || ''}<br/>${pick('Heading', '流向')} ${dir == null ? '--' : Number(dir).toFixed(1) + '°'}`;
        },
      }),
      visualMap: {
        type: 'continuous', min: smin, max: smax, dimension: 4, seriesIndex: 0,
        calculable: true, orient: 'horizontal', left: 'center', bottom: -2, itemWidth: 10, itemHeight: 70,
        text: [pick('Fast', '快'), pick('Slow', '慢')], textStyle: { color: cssVar('--muted'), fontSize: 9 },
        inRange: { color: SCALE_STOPS },
      },
      xAxis: { type: 'category', data: xLabels, axisLine: axisLineStyle(), axisTick: { show: false }, axisLabel: Object.assign(axisLabelStyle(), { interval: Math.max(Math.floor(xLabels.length / 6), 0), hideOverlap: true }) },
      yAxis: { type: 'category', data: yLabels, name: pick('Layer', '层号'), nameTextStyle: { color: cssVar('--muted'), fontSize: 9 }, axisLine: axisLineStyle(), axisTick: { show: false }, axisLabel: axisLabelStyle() },
      series: [{
        type: 'custom', name: pick('Vector', '矢量'),
        renderItem: (params, api) => {
          const u = api.value(2), w = api.value(3), s = api.value(4);
          const center = api.coord([api.value(0), api.value(1)]);
          const size = api.size ? api.size([1, 1]) : [12, 12];
          const cell = Math.min(size[0], size[1]);
          const mag = Math.hypot(u, w);
          const color = api.visual('color');
          if (mag < 1e-9) {
            return { type: 'circle', shape: { cx: center[0], cy: center[1], r: 2 }, style: { fill: color } };
          }
          const dx = u / mag, dy = w / mag;
          const norm = (s - smin) / (smax - smin || 1);
          const len = cell * (0.28 + 0.16 * norm);
          const ex = center[0] + dx * len, ey = center[1] - dy * len;
          const ah = len * 0.34;
          const ang = Math.atan2(-dy, dx);
          const a1 = ang + Math.PI * 5 / 6, a2 = ang - Math.PI * 5 / 6;
          return { type: 'group', children: [
            { type: 'line', shape: { x1: center[0], y1: center[1], x2: ex, y2: ey }, style: { stroke: color, lineWidth: 1.4 } },
            { type: 'line', shape: { x1: ex, y1: ey, x2: ex + ah * Math.cos(a1), y2: ey + ah * Math.sin(a1) }, style: { stroke: color, lineWidth: 1.4 } },
            { type: 'line', shape: { x1: ex, y1: ey, x2: ex + ah * Math.cos(a2), y2: ey + ah * Math.sin(a2) }, style: { stroke: color, lineWidth: 1.4 } },
          ] };
        },
        data: items,
      }],
    }, true);
  }

  function renderWaveRose(id, data) {
    const inst = chart(id); if (!inst) return;
    const dirBins = data.dir_bins || [];
    const hBins = data.height_bins || [];
    const fm = data.freq_matrix || [];
    const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const dirLabels = dirBins.map(b => {
      const c = b.center_deg || 0;
      return (dirBins.length === 16) ? COMPASS[Math.round(c / 22.5) % 16] : (Math.round(c) + '°');
    });
    const hLabel = (b) => b.max == null ? `≥${b.min}m` : `${b.min}–${b.max}m`;

    const series = hBins.map((hb, hi) => ({
      name: hLabel(hb), type: 'bar', coordinateSystem: 'polar', stack: 'rose',
      data: dirBins.map((_, di) => (fm[di] && fm[di][hi]) || 0),
      itemStyle: { color: scaleColor(hBins.length <= 1 ? 0.6 : hi / (hBins.length - 1)), borderColor: rgba('#050d1a', 0.5), borderWidth: 0.5 },
    }));

    inst.setOption({
      backgroundColor: 'transparent',
      tooltip: Object.assign(baseTooltip(), { trigger: 'item', formatter: (p) => `${p.name} · ${p.seriesName}<br/>${pick('Count', '频次')} <b>${p.value}</b>` }),
      legend: { bottom: 0, textStyle: { color: cssVar('--muted'), fontSize: 9 }, itemWidth: 10, itemHeight: 8, type: 'scroll' },
      polar: { center: ['50%', '46%'], radius: '66%' },
      angleAxis: {
        type: 'category', data: dirLabels, startAngle: 90, clockwise: true,
        axisLine: { lineStyle: { color: rgba(cssVar('--blue-light'), 0.25) } },
        axisLabel: { color: cssVar('--muted'), fontSize: 9 },
        splitLine: { show: true, lineStyle: { color: rgba(cssVar('--blue-light'), 0.08) } },
      },
      radiusAxis: {
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: cssVar('--muted'), fontSize: 8 },
        splitLine: { lineStyle: { color: rgba(cssVar('--blue-light'), 0.1) } },
      },
      series,
    }, true);
  }

  function renderWqPiles(id, data) {
    const inst = chart(id); if (!inst) return;
    const piles = data.piles || [];
    const PALETTE = ['--blue', '--teal', '--orange', '--pink', '--purple', '--success', '--blue-light', '--warning'].map(cssVar);
    const series = piles.map((pile, i) => {
      const color = PALETTE[i % PALETTE.length];
      return {
        name: pick('Pile ', '桩号 ') + pile.pile_no, type: 'line', showSymbol: false, smooth: 0.25, connectNulls: false,
        data: (pile.points || []).map(pt => [pt[0], pt[1]]),
        lineStyle: { width: 1.6, color }, itemStyle: { color },
      };
    });
    inst.setOption({
      backgroundColor: 'transparent',
      grid: { top: 14, right: 16, bottom: 28, left: 44 },
      tooltip: Object.assign(baseTooltip(), { trigger: 'axis' }),
      legend: { top: 0, right: 4, textStyle: { color: cssVar('--muted'), fontSize: 9 }, itemWidth: 12, itemHeight: 8, type: 'scroll' },
      xAxis: { type: 'time', axisLine: axisLineStyle(), axisTick: { show: false }, axisLabel: Object.assign(axisLabelStyle(), { hideOverlap: true }) },
      yAxis: { type: 'value', scale: true, splitLine: splitLineStyle(), axisLabel: axisLabelStyle(), axisLine: { show: false }, axisTick: { show: false } },
      series,
    }, true);
  }

  function renderCalendar(id, calendar, onPick) {
    const inst = chart(id); if (!inst) return;
    calendar = calendar || [];
    let cmin = 0, cmax = 1;
    calendar.forEach(c => { if (c.count > cmax) cmax = c.count; });
    const dates = calendar.map(c => c.date).filter(Boolean).sort();
    const range = dates.length ? [dates[0], dates[dates.length - 1]] : [new Date().toISOString().slice(0, 7)];

    inst.setOption({
      backgroundColor: 'transparent',
      tooltip: Object.assign(baseTooltip(), {
        formatter: (p) => `${p.value[0]}<br/>${pick('Frames', '图片')}: <b>${p.value[1]}</b>`,
      }),
      visualMap: {
        min: cmin, max: cmax, calculable: false, orient: 'horizontal', left: 'center', bottom: 0,
        itemWidth: 10, itemHeight: 60, text: [pick('More', '多'), pick('Less', '少')], textStyle: { color: cssVar('--muted'), fontSize: 9 },
        inRange: { color: [rgba(cssVar('--blue'), 0.25), cssVar('--teal'), cssVar('--orange')] },
      },
      calendar: {
        top: 22, left: 30, right: 12, bottom: 44, cellSize: ['auto', 'auto'], range,
        orient: 'vertical',
        itemStyle: { color: rgba(cssVar('--blue'), 0.05), borderColor: rgba(cssVar('--blue-light'), 0.12), borderWidth: 1 },
        splitLine: { lineStyle: { color: rgba(cssVar('--blue-light'), 0.2) } },
        yearLabel: { show: true, color: cssVar('--muted'), fontSize: 9 },
        monthLabel: { color: cssVar('--muted'), fontSize: 9, nameMap: isZh() ? 'cn' : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
        dayLabel: { color: cssVar('--muted'), fontSize: 8, nameMap: isZh() ? 'cn' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], firstDay: 1 },
      },
      series: [{
        type: 'heatmap', coordinateSystem: 'calendar',
        data: calendar.map(c => [c.date, c.count]),
      }],
    }, true);

    inst.off('click');
    inst.on('click', (params) => {
      if (params && params.value && params.value[0] && typeof onPick === 'function') onPick(params.value[0]);
    });
  }

  global.HydroCharts = {
    cssVar, rgba, scaleColor, chart, resizeAll, clear, fmtTime,
    renderHeatmap, renderVector, renderWaveRose, renderWqPiles, renderCalendar,
  };
})(window);
