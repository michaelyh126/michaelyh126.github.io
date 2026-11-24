/**
 * HydroQCharts — query-web ECharts5 Bilingual Visualizer (EN default / ZH toggle)
 */
(function (global) {
  'use strict';
  if (!global.echarts) { console.error('[query-web] echarts not loaded'); }

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

  function renderSeries(id, data) {
    const inst = chart(id); if (!inst) return;
    const pts = (data && data.points) || [];
    const color = data && data.system === 'own' ? cssVar('--teal') : cssVar('--blue-light');
    const metric = (data && data.metric) || '';
    const seriesData = pts.map(pt => [pt[0], pt[1]]);
    inst.setOption({
      backgroundColor: 'transparent',
      grid: { top: 18, right: 18, bottom: 30, left: 52 },
      tooltip: Object.assign(baseTooltip(), {
        trigger: 'axis',
        formatter: (arr) => {
          const p = arr[0]; if (!p) return '';
          const v = p.value;
          return `${fmtTime(v[0])}<br/><b>${metric}</b> ${v[1] == null ? '—' : Number(v[1])}`;
        },
      }),
      xAxis: {
        type: 'time', axisLine: axisLineStyle(), axisTick: { show: false },
        axisLabel: Object.assign(axisLabelStyle(), { hideOverlap: true }),
      },
      yAxis: {
        type: 'value', scale: true, name: metric,
        nameTextStyle: { color: cssVar('--muted'), fontSize: 9, align: 'left' },
        splitLine: splitLineStyle(), axisLabel: axisLabelStyle(),
        axisLine: { show: false }, axisTick: { show: false },
      },
      series: [{
        name: metric, type: 'line', showSymbol: seriesData.length <= 200, symbolSize: 3,
        smooth: 0.18, connectNulls: false, sampling: 'lttb',
        data: seriesData,
        lineStyle: { width: 1.6, color },
        itemStyle: { color },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
          { offset: 0, color: rgba(color, 0.28) }, { offset: 1, color: rgba(color, 0.01) },
        ] } },
      }],
    }, true);
  }

  function renderProfile(id, data) {
    const inst = chart(id); if (!inst) return;
    const pts = (data && data.points) || [];
    const timeSet = [], layerSet = [];
    pts.forEach(p => {
      if (timeSet.indexOf(p.time) < 0) timeSet.push(p.time);
      if (layerSet.indexOf(p.depth_layer) < 0) layerSet.push(p.depth_layer);
    });
    timeSet.sort((a, b) => new Date(a) - new Date(b));
    layerSet.sort((a, b) => a - b);
    const tIdx = new Map(timeSet.map((t, i) => [t, i]));
    const lIdx = new Map(layerSet.map((l, i) => [l, i]));
    const xLabels = timeSet.map(fmtTime);
    const yLabels = layerSet.map(l => (l === -1 ? 'N/A' : 'L' + l));

    let vmin = Infinity, vmax = -Infinity, hasVal = false;
    const items = pts.map(p => {
      const v = (p.value === undefined ? null : p.value);
      if (v !== null && !Number.isNaN(v)) { hasVal = true; if (v < vmin) vmin = v; if (v > vmax) vmax = v; }
      return [tIdx.get(p.time), lIdx.get(p.depth_layer), v, (p.qc == null ? null : p.qc)];
    });
    if (!hasVal) { vmin = 0; vmax = 1; }
    if (vmin === vmax) vmax = vmin + 1;

    const NULL_STROKE = rgba(cssVar('--blue'), 0.28);

    inst.setOption({
      backgroundColor: 'transparent',
      grid: { top: 16, right: 18, bottom: 44, left: 46 },
      tooltip: Object.assign(baseTooltip(), {
        formatter: (p) => {
          const v = p.value; const ti = v[0], li = v[1], val = v[2], q = v[3];
          const state = (val !== null && val !== undefined) ? `<b>${Number(val)}</b>` : pick('Null', '空值(null)');
          const qcTxt = (q === 0) ? pick('qc=0 unknown', 'qc=0 质量未知') : (q === null || q === undefined ? pick('qc N/A', 'qc 无') : 'qc=' + q);
          return `${xLabels[ti] || ''}<br/>${pick('Layer', '层号')} <b>${yLabels[li] || ''}</b><br/>${state}<br/><span style="color:${cssVar('--muted')}">${qcTxt}</span>`;
        },
      }),
      visualMap: {
        type: 'continuous', min: vmin, max: vmax, dimension: 2, seriesIndex: 0,
        calculable: true, orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 10, itemHeight: 60,
        text: [pick('High', '高'), pick('Low', '低')], textStyle: { color: cssVar('--muted'), fontSize: 9 },
        inRange: { color: SCALE_STOPS }, show: hasVal,
      },
      xAxis: {
        type: 'category', data: xLabels, axisLine: axisLineStyle(), axisTick: { show: false },
        axisLabel: Object.assign(axisLabelStyle(), { interval: Math.max(Math.floor(xLabels.length / 6), 0), hideOverlap: true }),
      },
      yAxis: {
        type: 'category', data: yLabels, name: pick('Layer', '层号'),
        nameTextStyle: { color: cssVar('--muted'), fontSize: 9 },
        axisLine: axisLineStyle(), axisTick: { show: false }, axisLabel: axisLabelStyle(),
      },
      series: [{
        type: 'custom', name: pick('Profile', '剖面'),
        renderItem: (params, api) => {
          const val = api.value(2);
          const center = api.coord([api.value(0), api.value(1)]);
          const size = api.size ? api.size([1, 1]) : [10, 10];
          const w = size[0], h = size[1], pad = 0.5;
          const shape = { x: center[0] - w / 2 + pad, y: center[1] - h / 2 + pad, width: Math.max(w - 2 * pad, 1), height: Math.max(h - 2 * pad, 1) };
          if (val === null || val === undefined || Number.isNaN(val)) {
            return { type: 'rect', shape, style: { fill: 'transparent', stroke: NULL_STROKE, lineWidth: 0.75 } };
          }
          return { type: 'rect', shape, style: { fill: api.visual('color') } };
        },
        data: items,
      }],
    }, true);
  }

  global.HydroQCharts = {
    cssVar, rgba, chart, resizeAll, clear, fmtTime,
    renderSeries, renderProfile,
  };
})(window);
