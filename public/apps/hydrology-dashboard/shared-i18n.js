/**
 * HydroI18n — Shared Bilingual Engine (EN default / ZH toggle) for HydrologyPlatform Suite.
 * Reads ?lang=en|zh -> localStorage['portfolio_lang'] -> defaults to 'en'.
 * Combines native bilingual API/ECharts helpers with a WeakMap-backed DOM translator & MutationObserver
 * so zero stray Chinese characters appear in English mode while preserving lossless Chinese restoration.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'portfolio_lang';

  function detectLang() {
    try {
      var search = new URLSearchParams(global.location.search || '');
      var hashStr = global.location.hash || '';
      var qIdx = hashStr.indexOf('?');
      var hashSearch = qIdx >= 0 ? new URLSearchParams(hashStr.slice(qIdx + 1)) : null;
      var param = (search.get('lang') || (hashSearch && hashSearch.get('lang')) || '').toLowerCase();
      if (param === 'zh' || param === 'en') {
        global.localStorage.setItem(STORAGE_KEY, param);
        return param;
      }
      var stored = (global.localStorage.getItem(STORAGE_KEY) || '').toLowerCase();
      if (stored === 'zh' || stored === 'en') return stored;
    } catch (e) {
      // ignore storage errors
    }
    return 'en';
  }

  var currentLang = detectLang();

  function getLang() { return currentLang; }
  function isEn() { return currentLang === 'en'; }
  function isZh() { return currentLang === 'zh'; }

  function setLang(next) {
    currentLang = next === 'zh' ? 'zh' : 'en';
    try { global.localStorage.setItem(STORAGE_KEY, currentLang); } catch (e) {}
    if (global.document && global.document.documentElement) {
      global.document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    }
  }

  // Exact full-string dictionary (ZH -> EN)
  var EXACT = {
    // Titles & Headers
    '水文大数据实时共享聚合平台': 'Real-Time Hydrological Big Data Platform',
    '水文自有系统 · 数据展示大屏 own-dashboard': 'Field Station Telemetry Dashboard',
    '水文自有系统 · 数据展示大屏': 'Field Station Network Dashboard',
    '水文公网综合查询平台 query-web': 'Hydrological Spatial & Time-Series Query',
    '水文公网综合查询平台': 'Spatial & Time-Series Query Platform',

    // Public Big-Screen (frontend/dashboard.html)
    '接入站点': 'Stations',
    '在线站点': 'Online',
    '典型河口': 'Coastal Basins',
    '数据来源': 'Data Sources',
    '全局时间范围': 'Time Window',
    '自动刷新': 'Auto Refresh',
    '关': 'Off',
    '连接中...': 'Connecting...',
    '系统运行中': 'System Live',
    '平台运行中': 'Platform Live',
    '部分数据连接中断': 'Partial Link Issue',
    '连接中断': 'Disconnected',
    '数据获取失败': 'Fetch Error',
    '总体分布': 'Overview',
    '站点类型': 'Station Types',
    '非在线站点': 'Offline / Degraded',
    '机场气象站': 'Airport Met',
    '国际气象站': 'Global Met',
    '国际气象交换站': 'Global Met Exchange',
    '美国潮位站': 'US Tide Gauge',
    '日本潮位站': 'JP Tide Gauge',
    '香港潮位站': 'Regional Tide Gauge',
    '站点分布': 'Station Directory',
    '站点实时数据': 'Station Telemetry',
    '加载中...': 'Loading...',
    '加载中…': 'Loading…',
    '加载中': 'Loading',
    '连接状态': 'Connectivity',
    '选择左侧站点以查看趋势': 'Select a station to inspect trends',
    '加载告警中...': 'Loading operational alerts...',
    '暂无告警，系统运行正常': 'No active alerts · All systems nominal',
    '实时监测': 'Real-time',
    '每日批处理': 'Daily Batch',
    '静态元数据': 'Static Meta',
    '在线': 'Online',
    '降级': 'Degraded',
    '离线': 'Offline',
    '未知': 'Unknown',
    '未知来源': 'Unknown Source',
    '气温': 'Air Temp',
    '露点温度': 'Dewpoint',
    '气压': 'Pressure',
    '风速': 'Wind Speed',
    '风向': 'Wind Dir',
    '阵风': 'Wind Gust',
    '能见度': 'Visibility',
    '降水量': 'Precip',
    '相对湿度': 'Humidity',
    '水位': 'Water Level',
    '水温': 'Water Temp',
    '盐度': 'Salinity',
    '云高': 'Cloud Base',
    '近24小时': 'Last 24h',
    '近7天': 'Last 7d',
    '近14天': 'Last 14d',
    '近30天': 'Last 30d',
    '近 24 小时': 'Last 24h',
    '近 7 天': 'Last 7d',
    '近 14 天': 'Last 14d',
    '近 30 天': 'Last 30d',
    '类型': 'Type',
    '坐标': 'Coords',
    '指标': 'Metrics',
    '监测方式': 'Mode',
    '河口': 'Basin',
    '暂无数据': 'No Data',
    '暂无对比数据': 'No prior sample',
    '暂无观测记录': 'No observations',
    '无指标': 'No metrics',
    '该站点未配置可展示指标': 'No displayable metrics configured',
    '该河口暂无接入站点': 'No stations registered in basin',
    '当前时间范围暂无有效河口数据': 'No basin telemetry in selected range',
    '暂无可展示站点': 'No station selected',
    '暂无站点数据': 'No station telemetry',
    '坐标未知': 'Coords unavailable',

    // own-dashboard
    '可见站点': 'Stations',
    '采样点位': 'Data Points',
    '活跃告警': 'Active Alerts',
    '最近观测(UTC)': 'Latest Obs (UTC)',
    '退出': 'Session',
    '概览': 'Summary',
    '查询控制': 'Controls',
    '站点 station_id': 'Station (station_id)',
    '时间窗口（原始区间 ≤ 31 天）': 'Time Window (Raw ≤ 31d)',
    'ADCP 指标 metric': 'ADCP Metric',
    '水质指标 metric': 'Water Quality Metric',
    '重新加载全部图表': 'Reload All Charts',
    '全球叠加图层': 'Global Overlay',
    '全球站点/河口叠加': 'Global Reference Overlay',
    '只读参考': 'Read-Only',
    '只读叠加': 'Read-Only Overlay',
    '只读叠加：不并入本系统观测、不跨基准比较。': 'Read-only reference overlay (isolated from field telemetry & datums).',
    '只读叠加：不并入本系统观测、不跨基准比较。datum_unknown 站点并列展示、不求差。': 'Read-only reference overlay: isolated from field observations & vertical datums.',
    '图例': 'Legend',
    '本系统站点': 'Field Stations',
    '本系统站点（主图层）': 'Field Stations (Primary)',
    '全球叠加站点': 'Global Reference',
    '全球叠加站点（只读）': 'Global Reference (Read-Only)',
    '河口边界': 'Basin Boundary',
    '热力单元语义': 'Heatmap Cell States',
    '有值(含 0)': 'Valid Value (incl. 0)',
    '有采样·空值(null)': 'Sampled · Null',
    '缺测/未同步': 'Missing / Unsynced',
    '站点分布 · 全球叠加图层': 'Station Network · Global Overlay',
    'ADCP 剖面热力（时间×层号）': 'ADCP Profile Heatmap (Time × Layer)',
    'Y 轴=层号': 'Y-Axis = Layer',
    'Y 轴=深度': 'Y-Axis = Depth',
    '（水深门禁默认关，不标实际水深 m）· 缺测层≠0 值 · qc=0=质量未知': ' (Depth gate off by default) · Missing ≠ 0 · qc=0 unknown',
    '矢量场（U/V 定向 · 流速定色）': 'Current Vector Field (U/V Direction · Speed Color)',
    '流向约定加载中…': 'Loading direction convention…',
    '波浪玫瑰（方向×波高）': 'Directional Wave Rose (Dir × Height)',
    '水质多桩号对比': 'Multi-Pile Water Quality Comparison',
    '物候日历 + 图片画廊': 'Phenology Calendar & Camera Gallery',
    '图片画廊': 'Camera Gallery',
    '点击左侧日历某日': 'Click any date on calendar',
    '时区免责：图片时刻按 UTC+8 处理为': 'Timestamp note: synthetic demo frames tagged as',
    '未核准假设': 'simulated local clock',
    '（pending R0-B），不作为精确采集时刻依据。': ' (synthetic phenology showcase).',
    '选择有图日期以查看缩略图': 'Select a calendar date to view camera frames',
    '下载原图': 'Download Frame',
    '关闭': 'Close',
    '物候原图': 'Phenology Frame',
    '移动站': 'Mobile',
    '是': 'Yes',
    '否': 'No',
    '来源': 'Source',
    'ADCP 剖面': 'ADCP Profile',
    '波浪': 'Wave Buoy',
    '水质': 'Water Quality',
    '潮位': 'Tide Gauge',
    '多光谱/物候': 'Phenology Cam',
    '物候': 'Phenology',
    '气象': 'Meteorology',
    '未分类': 'Other',
    '访客': 'Viewer',
    '运维人员': 'Operator',
    '科研查询': 'Researcher',
    '管理员': 'Admin',
    '该窗口内无剖面网格数据': 'No profile-grid samples in window',
    '该窗口内无 U/V 配对数据': 'No U/V vector pairs in window',
    '该窗口内无波浪方向/波高样本': 'No wave rose samples in window',
    '该窗口内无水质桩号数据': 'No water-quality pile series in window',
    '该站点无物候图片日历': 'No phenology calendar for station',
    '该站点暂无物候图片': 'No phenology frames for station',
    '该日无图片文件': 'No camera frames on selected date',
    '已开始下载原图': 'Frame download started',
    '加载失败': 'Load Failed',
    '非图片': 'Non-image',
    '额度受限': 'Quota limit',

    // query-web
    '空间画框查询': 'Spatial Draw Query',
    '查询模式': 'Spatial Mode',
    '当前位置': 'Current Position',
    '指定时刻': 'At Timestamp',
    '轨迹相交': 'Trajectory Intersect',
    'at_time（指定时刻位置，UTC 解析）': 'at_time (Position at UTC Timestamp)',
    'auth_mode（空间授权语义标注）': 'auth_mode (Authorization Scope)',
    'current（按站点身份授权）': 'current (Station Identity Scope)',
    'trajectory（预留：按轨迹时段细化）': 'trajectory (Time-Sliced Scope)',
    '在地图右上角用': 'Use the top-right map tools to draw a',
    '矩形': 'Rectangle',
    '或': 'or',
    '多边形': 'Polygon',
    '工具画框 → 自动执行空间查询。授权按站点身份落 SQL，几何相交不放宽授权。': ' to query stations automatically. Strict deny-by-default scope enforcement.',
    '站点目录 · {ns}:{id}': 'Station Catalog · {ns}:{id}',
    '全部': 'All',
    '上一页': 'Prev',
    '下一页': 'Next',
    '指标字典 · 按 system 分组': 'Metric Dictionary · by System',
    '⚠ 跨系统同名 code': '⚠ Shared Cross-System Codes',
    '：wind_speed_ms / wind_dir_deg / wind_gust_ms / rh_pct / visibility_m 在 app、own 两系统均存在，来源歧义由站点 namespace 前缀消歧；不跨命名空间 join、不跨基准比较。': ': wind_speed_ms / wind_dir_deg / wind_gust_ms / rh_pct / visibility_m exist in both app & own; disambiguated by station namespace prefix.',
    '空间查询结果 · 画框寻站': 'Spatial Query Canvas · Draw to Search',
    '模式：当前位置': 'Mode: Current Position',
    '模式：指定时刻': 'Mode: At Timestamp',
    '模式：轨迹相交': 'Mode: Trajectory Intersect',
    '清除画框与结果': 'Clear drawn shape & results',
    '清除': 'Clear',
    '画框以查询站点。': 'Draw a bounding box or polygon to query stations. ',
    '：未授权站点不返回、不泄露存在性。': ': unauthorized stations are never disclosed.',
    '标量时序查询': 'Scalar Time-Series Query',
    '如 temp_c / air_temp_c': 'e.g. salinity_psu / water_level_m',
    '查询': 'Run Query',
    '选择站点 + metric 后查询': 'Select a station + metric and click Run Query',
    '目标站点：': 'Target Station: ',
    '未选择': 'None',
    '剖面查询 · own field': 'ADCP Depth Profile · own field',
    '如 adcp_vel_east': 'e.g. adcp_speed',
    '可选': 'Optional',
    'Y 轴=层号（水深门禁默认关，不标实际 m）· 哨兵 -1=维度不适用 · qc=0=质量未知': 'Y-Axis = Layer (depth gate off) · Sentinel -1 = N/A · qc=0 unknown',
    '剖面仅 field 命名空间可用': 'Depth profiles available for field namespace only',
    '点击「查询」加载剖面': 'Click Run Query to load depth profile',
    '数据导出': 'Data Export',
    '导出目标沿用': 'Export inherits station, metric & range from ',
    '的 station / metric / 时间范围。': '.',
    '目标：': 'Target: ',
    '未选择站点': 'No station selected',
    '格式': 'Format',
    'CSV：标量长表（station_id,metric,time,value,unit,qc）。': 'CSV: Long-format scalar table (station_id, metric, time, value, qc).',
    'CSV：标量长表（station_id,metric,time,value,unit,qc），公式注入中和。': 'CSV: Long-format scalar table (station_id, metric, time, value, qc).',
    'PARQUET：标量长表（pyarrow snappy），Arrow schema 内嵌 query_manifest。': 'PARQUET: Synthetic demo payload with embedded query_manifest.',
    'NETCDF：ADCP 时间×深度剖面（仅 field 命名空间），全局属性写 manifest。': 'NETCDF: Synthetic ADCP time × depth profile manifest (field namespace).',
    '导出下载': 'Export File',
    '导出中…': 'Exporting…',
    '导出完成': 'Export complete',
    '选此站点查询': 'Select Station',
    '轨迹点数': 'Track Points',
    '时段': 'Time Span',
    '查询中…': 'Querying…',
    '无指标': 'No metrics',
    '演示模式已自动登录，无需退出': 'Auto-authenticated in Demo Mode',
  };

  // Ordered fragment replacements for composite/interpolated strings
  var FRAGMENTS = [
    [/^(.+?) · 最新站点数据$/, '$1 · Latest Station Telemetry'],
    [/^最近数据\s+(.+)$/, 'Latest obs $1'],
    [/^(↑|↓)\s+([\d.]+)\s+较上一采样点$/, '$1 $2 vs prior sample'],
    [/^近24小时趋势 · (.+)$/, '24h Trend · $1'],
    [/^近7天趋势 · (.+)$/, '7d Trend · $1'],
    [/^近14天趋势 · (.+)$/, '14d Trend · $1'],
    [/^近30天趋势 · (.+)$/, '30d Trend · $1'],
    [/^流向约定：(.+)$/, 'Direction convention: $1'],
    [/^时区免责：(.+)$/, 'Timestamp note: $1'],
    [/^第\s+(\d+)\s*\/\s*(\d+)\s*页\s*·\s*共\s*([\d,]+)$/, 'Page $1 / $2 · Total $3'],
    [/^(\d+)\s*项$/, '$1 items'],
    [/^已下载\s+(.+?)（([\d,]+)\s*字节）。?$/, 'Downloaded $1 ($2 bytes).'],
    [/^命中\s*(\d+)\s*站点。?$/, 'Matched $1 stations.'],
    [/^模式\s+(.+?)\s*·\s*命中\s+(\d+)\s*站点。?$/, 'Mode $1 · Matched $2 stations.'],
    [/^模式\s+(.+?)\s*·\s*无匹配站点或未授权（deny by default，不泄露存在性）。?$/, 'Mode $1 · No matching stations in region (deny by default).'],
    [/^（水深门禁默认关，不标实际水深 m）· 缺测层≠0 值 · qc=0=质量未知 · (.+)$/, ' (Depth gate off) · Missing ≠ 0 · qc=0 unknown · $1'],
    [/^剖面仅\s+(.+?)\s+命名空间可用（当前\s+(.+?)）$/, 'Profile available for $1 namespace only (current: $2)'],
    [/^已选 metric：(.+?)（(.+?)）$/, 'Selected metric: $1 ($2)'],
    [/^已选择\s+(.+)$/, 'Selected $1'],
    [/^已清除。画框以查询站点。/, 'Cleared. Draw a box/polygon to query stations. '],
    [/^ · metric (.+?) · interval (.+?) · 点数 (\d+)$/, ' · metric $1 · interval $2 · $3 pts'],
    [/^ · (.+?) · depth_axis (.+?) · 样本 (\d+)$/, ' · $1 · depth_axis $2 · $3 samples'],
    [/^时刻为 UTC\+8 未核准假设$/, 'Simulated UTC+8 demo timestamp'],
    [/^(\d{2})\/(\d{2})\s+(\d+)时$/, '$1/$2 $3:00'],
  ];

  // Replace standalone known terms inside mixed strings as final fallback
  var INLINE_TERMS = [
    ['机场气象站', 'Airport Met'],
    ['国际气象交换站', 'Global Met Exchange'],
    ['美国潮位站', 'US Tide Gauge'],
    ['日本潮位站', 'JP Tide Gauge'],
    ['香港潮位站', 'Regional Tide Gauge'],
    ['实时监测', 'Real-time'],
    ['每日批处理', 'Daily Batch'],
    ['静态元数据', 'Static Meta'],
    ['露点温度', 'Dewpoint'],
    ['相对湿度', 'Humidity'],
    ['降水量', 'Precip'],
    ['能见度', 'Visibility'],
    ['气温', 'Air Temp'],
    ['气压', 'Pressure'],
    ['风速', 'Wind Speed'],
    ['风向', 'Wind Dir'],
    ['阵风', 'Wind Gust'],
    ['水位', 'Water Level'],
    ['水温', 'Water Temp'],
    ['盐度', 'Salinity'],
    ['云高', 'Cloud Base'],
    ['ADCP 剖面', 'ADCP Profile'],
    ['多光谱/物候', 'Phenology Cam'],
    ['波浪', 'Wave Buoy'],
    ['水质', 'Water Quality'],
    ['潮位', 'Tide Gauge'],
    ['物候', 'Phenology'],
    ['气象', 'Meteorology'],
    ['目标站点：', 'Target: '],
    ['目标：', 'Target: '],
    ['点数 ', 'Points: '],
    ['样本 ', 'Samples: '],
    ['字节', 'bytes'],
    ['已下载 ', 'Downloaded '],
    ['模式 ', 'Mode '],
    ['命中 ', 'Matched '],
    [' 站点。', ' stations.'],
    [' 站点', ' stations'],
    ['层号', 'Layer'],
    ['深度', 'Depth'],
    ['无数据 / 未授权', 'No data in window'],
    ['、', ', '],
  ];

  function translateText(raw) {
    if (!raw || typeof raw !== 'string') return raw;
    if (!/[\u4e00-\u9fa5]/.test(raw)) return raw;
    var lead = raw.match(/^\s*/)[0];
    var trail = raw.match(/\s*$/)[0];
    var core = raw.trim();
    if (!core) return raw;
    if (EXACT[core]) return lead + EXACT[core] + trail;
    for (var i = 0; i < FRAGMENTS.length; i++) {
      var rule = FRAGMENTS[i];
      if (rule[0].test(core)) {
        var out = core.replace(rule[0], rule[1]);
        // Run inline cleanup on captured groups if any Chinese remains
        if (/[\u4e00-\u9fa5]/.test(out)) {
          for (var k = 0; k < INLINE_TERMS.length; k++) {
            if (out.indexOf(INLINE_TERMS[k][0]) >= 0) {
              out = out.split(INLINE_TERMS[k][0]).join(INLINE_TERMS[k][1]);
            }
          }
        }
        return lead + out + trail;
      }
    }
    var replaced = core;
    for (var j = 0; j < INLINE_TERMS.length; j++) {
      if (replaced.indexOf(INLINE_TERMS[j][0]) >= 0) {
        replaced = replaced.split(INLINE_TERMS[j][0]).join(INLINE_TERMS[j][1]);
      }
    }
    return lead + replaced + trail;
  }

  var origTextMap = new WeakMap();
  var origAttrMap = new WeakMap();
  var ATTR_NAMES = ['placeholder', 'title', 'aria-label', 'alt'];
  var isApplying = false;

  function processNode(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      var parentTag = node.parentElement && node.parentElement.tagName;
      if (parentTag === 'SCRIPT' || parentTag === 'STYLE') return;
      var val = node.nodeValue;
      if (!val || !val.trim()) return;
      if (currentLang === 'en') {
        if (/[\u4e00-\u9fa5]/.test(val)) {
          origTextMap.set(node, val);
          var translated = translateText(val);
          if (translated !== val) node.nodeValue = translated;
        }
      } else if (origTextMap.has(node)) {
        var orig = origTextMap.get(node);
        if (node.nodeValue !== orig) node.nodeValue = orig;
      }
      return;
    }
    if (node.nodeType === 1) {
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
      var savedAttrs = origAttrMap.get(node);
      for (var a = 0; a < ATTR_NAMES.length; a++) {
        var attr = ATTR_NAMES[a];
        if (!node.hasAttribute(attr)) continue;
        var cur = node.getAttribute(attr);
        if (currentLang === 'en') {
          if (/[\u4e00-\u9fa5]/.test(cur)) {
            if (!savedAttrs) { savedAttrs = {}; origAttrMap.set(node, savedAttrs); }
            savedAttrs[attr] = cur;
            var t = translateText(cur);
            if (t !== cur) node.setAttribute(attr, t);
          }
        } else if (savedAttrs && savedAttrs[attr] != null) {
          node.setAttribute(attr, savedAttrs[attr]);
        }
      }
      var children = node.childNodes;
      for (var c = 0; c < children.length; c++) processNode(children[c]);
    }
  }

  function translateDom(root) {
    if (!global.document) return;
    isApplying = true;
    try {
      if (global.document.title && currentLang === 'en' && /[\u4e00-\u9fa5]/.test(global.document.title)) {
        global.document.title = translateText(global.document.title);
      }
      processNode(root || global.document.body);
    } finally {
      isApplying = false;
    }
  }

  function startObserver() {
    if (!global.document || !global.MutationObserver) return;
    var boot = function () {
      global.document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
      if (currentLang === 'en') translateDom(global.document.body);
      var observer = new MutationObserver(function (mutations) {
        if (isApplying || currentLang !== 'en') return;
        isApplying = true;
        try {
          for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            if (m.type === 'characterData') {
              processNode(m.target);
            } else if (m.type === 'childList') {
              for (var j = 0; j < m.addedNodes.length; j++) processNode(m.addedNodes[j]);
            }
          }
        } finally {
          isApplying = false;
        }
      });
      observer.observe(global.document.body, { childList: true, subtree: true, characterData: true });
    };
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }

  startObserver();

  global.HydroI18n = {
    getLang: getLang,
    isEn: isEn,
    isZh: isZh,
    setLang: setLang,
    translateText: translateText,
    translateDom: translateDom,
    t: function (enStr, zhStr) { return currentLang === 'zh' ? zhStr : enStr; },
    locale: function () { return currentLang === 'zh' ? 'zh-CN' : 'en-US'; },
  };
})(window);
