import { useEffect, useMemo, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Graticule from 'ol/layer/Graticule';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import Draw from 'ol/interaction/Draw';
import { getLength } from 'ol/sphere';
import { defaults as defaultControls } from 'ol/control';
import {
  Activity,
  ArrowUpRight,
  Crosshair,
  Layers,
  MapPin,
  Radio,
  RotateCcw,
  Ruler,
  Trash2,
  Waves,
} from 'lucide-react';
import {
  COASTAL_ZONES,
  FALLBACK_LANDMASSES,
  MAP_PRESETS,
  MONITORING_STATIONS,
  SURVEY_TRANSECTS,
  type MonitoringStation,
  type StationStatus,
} from '../data/stations';
import { TelemetryChart, type TelemetryMetric } from './TelemetryChart';
import { useLanguage } from '../i18n/LanguageContext';

type BasemapId = 'dark-gray' | 'satellite' | 'osm' | 'vector-grid';

interface WebGISLabProps {
  onLaunchFullStudio?: () => void;
}

const STATUS_STYLE: Record<
  StationStatus,
  { label: string; dot: string; halo: string; badge: string }
> = {
  nominal: {
    label: 'Nominal',
    dot: '#10B981',
    halo: 'rgba(16, 185, 129, 0.28)',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  advisory: {
    label: 'Advisory',
    dot: '#F59E0B',
    halo: 'rgba(245, 158, 11, 0.28)',
    badge: 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  elevated: {
    label: 'Surge Watch',
    dot: '#F43F5E',
    halo: 'rgba(244, 63, 94, 0.30)',
    badge: 'border-rose-500/35 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
};

function formatCoord(lon: number, lat: number): string {
  const lonDir = lon >= 0 ? 'E' : 'W';
  const latDir = lat >= 0 ? 'N' : 'S';
  return `${Math.abs(lon).toFixed(4)}° ${lonDir}, ${Math.abs(lat).toFixed(4)}° ${latDir}`;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

export function WebGISLab({ onLaunchFullStudio }: WebGISLabProps) {
  const { bi } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const basemapLayerRef = useRef<TileLayer<XYZ | OSM> | null>(null);
  const fallbackLandLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const graticuleLayerRef = useRef<Graticule | null>(null);
  const stationsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const zonesLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const transectsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const measureSourceRef = useRef<VectorSource | null>(null);
  const drawInteractionRef = useRef<Draw | null>(null);

  const [basemap, setBasemap] = useState<BasemapId>('dark-gray');

  const [showStations, setShowStations] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showTransects, setShowTransects] = useState(true);
  const [showGraticule, setShowGraticule] = useState(true);

  const [selectedStationId, setSelectedStationId] = useState<string>(MONITORING_STATIONS[0].id);
  const [metric, setMetric] = useState<TelemetryMetric>('waterLevelM');

  const [measureMode, setMeasureMode] = useState(false);
  const [measuredMeters, setMeasuredMeters] = useState<number>(0);
  const [measurePoints, setMeasurePoints] = useState<number>(0);
  const [hasMeasurements, setHasMeasurements] = useState(false);

  const [cursorCoord, setCursorCoord] = useState<[number, number]>([121.92, 31.38]);
  const [currentZoom, setCurrentZoom] = useState<number>(2.1);

  const selectedStationIdRef = useRef(selectedStationId);
  selectedStationIdRef.current = selectedStationId;

  const measureModeRef = useRef(measureMode);
  measureModeRef.current = measureMode;

  const selectedStation: MonitoringStation = useMemo(
    () => MONITORING_STATIONS.find((s) => s.id === selectedStationId) ?? MONITORING_STATIONS[0],
    [selectedStationId]
  );

  // Initialize OpenLayers Map once
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // 1. Offline-resilient subtle world landmass silhouette layer (sits beneath tile layer)
    const landFeatures = FALLBACK_LANDMASSES.map(
      (ring) => new Feature(new Polygon([ring.map((coord) => fromLonLat(coord))]))
    );
    const fallbackLandLayer = new VectorLayer({
      source: new VectorSource({ features: landFeatures }),
      zIndex: 0,
      style: new Style({
        fill: new Fill({ color: 'rgba(30, 41, 59, 0.72)' }),
        stroke: new Stroke({ color: 'rgba(100, 116, 139, 0.45)', width: 1 }),
      }),
    });
    fallbackLandLayerRef.current = fallbackLandLayer;

    // 2. Zero-API-key Esri World Dark Gray Base (no watermark, no API key required)
    const basemapLayer = new TileLayer<XYZ | OSM>({
      zIndex: 1,
      source: new XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        crossOrigin: 'anonymous',
      }),
    });
    basemapLayerRef.current = basemapLayer;

    // 3. Coordinate Graticule Layer
    const graticuleLayer = new Graticule({
      zIndex: 2,
      strokeStyle: new Stroke({
        color: 'rgba(148, 163, 184, 0.18)',
        width: 1,
        lineDash: [3, 5],
      }),
      showLabels: false,
      wrapX: true,
    });
    graticuleLayerRef.current = graticuleLayer;

    // 4. Coastal Monitoring Zone Polygons
    const zoneFeatures = COASTAL_ZONES.map((zone) => {
      const f = new Feature({
        geometry: new Polygon([zone.coordinates.map((c) => fromLonLat(c))]),
        zoneName: zone.name,
      });
      f.setId(zone.id);
      return f;
    });
    const zonesLayer = new VectorLayer({
      zIndex: 3,
      source: new VectorSource({ features: zoneFeatures }),
      style: (feature) =>
        new Style({
          fill: new Fill({ color: 'rgba(6, 182, 212, 0.16)' }),
          stroke: new Stroke({
            color: 'rgba(56, 189, 248, 0.8)',
            width: 1.5,
            lineDash: [6, 4],
          }),
          text: new Text({
            text: String(feature.get('zoneName') ?? ''),
            font: '600 10px "JetBrains Mono", monospace',
            fill: new Fill({ color: '#E0F2FE' }),
            stroke: new Stroke({ color: 'rgba(2, 6, 23, 0.92)', width: 3 }),
            overflow: false,
          }),
        }),
    });
    zonesLayerRef.current = zonesLayer;

    // 5. Hydrographic Survey Transects
    const transectFeatures = SURVEY_TRANSECTS.map((tr) => {
      const f = new Feature({
        geometry: new LineString(tr.coordinates.map((c) => fromLonLat(c))),
        transectName: tr.name,
      });
      f.setId(tr.id);
      return f;
    });
    const transectsLayer = new VectorLayer({
      zIndex: 4,
      source: new VectorSource({ features: transectFeatures }),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(16, 185, 129, 0.85)',
          width: 2,
          lineDash: [8, 6],
        }),
      }),
    });
    transectsLayerRef.current = transectsLayer;

    // 6. Telemetry Monitoring Stations Layer
    const stationFeatures = MONITORING_STATIONS.map((st) => {
      const f = new Feature({
        geometry: new Point(fromLonLat([st.lon, st.lat])),
        stationId: st.id,
        code: st.code,
        status: st.status,
      });
      f.setId(st.id);
      return f;
    });

    const stationsLayer = new VectorLayer({
      zIndex: 6,
      source: new VectorSource({ features: stationFeatures }),
      style: (feature) => {
        const stId = String(feature.get('stationId'));
        const status = (feature.get('status') as StationStatus) ?? 'nominal';
        const code = String(feature.get('code') ?? '');
        const isSelected = stId === selectedStationIdRef.current;
        const palette = STATUS_STYLE[status];

        return [
          new Style({
            image: new CircleStyle({
              radius: isSelected ? 14 : 9,
              fill: new Fill({ color: isSelected ? 'rgba(56, 189, 248, 0.28)' : palette.halo }),
              stroke: isSelected
                ? new Stroke({ color: '#38BDF8', width: 2 })
                : new Stroke({ color: 'rgba(255,255,255,0.22)', width: 1 }),
            }),
          }),
          new Style({
            image: new CircleStyle({
              radius: isSelected ? 6 : 4.6,
              fill: new Fill({ color: palette.dot }),
              stroke: new Stroke({ color: '#070B13', width: 1.6 }),
            }),
            text: isSelected
              ? new Text({
                  text: code,
                  offsetY: -20,
                  font: '600 11px "JetBrains Mono", monospace',
                  fill: new Fill({ color: '#F8FAFC' }),
                  backgroundFill: new Fill({ color: 'rgba(2, 6, 23, 0.92)' }),
                  backgroundStroke: new Stroke({ color: 'rgba(56, 189, 248, 0.75)', width: 1 }),
                  padding: [3, 6, 2, 6],
                })
              : undefined,
          }),
        ];
      },
    });
    stationsLayerRef.current = stationsLayer;

    // 7. Interactive Geodesic Measurement Layer
    const measureSource = new VectorSource();
    measureSourceRef.current = measureSource;
    const measureLayer = new VectorLayer({
      zIndex: 7,
      source: measureSource,
      style: (feature) => {
        const geom = feature.getGeometry();
        let label = '';
        if (geom instanceof LineString) {
          const len = getLength(geom);
          if (len > 0) label = formatDistance(len);
        }
        return new Style({
          stroke: new Stroke({
            color: '#38BDF8',
            width: 2.5,
            lineDash: [6, 4],
          }),
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: '#38BDF8' }),
            stroke: new Stroke({ color: '#070B13', width: 1.5 }),
          }),
          text: label
            ? new Text({
                text: label,
                placement: 'point',
                offsetY: -14,
                font: '600 11px "JetBrains Mono", monospace',
                fill: new Fill({ color: '#E0F2FE' }),
                backgroundFill: new Fill({ color: 'rgba(2, 6, 23, 0.92)' }),
                backgroundStroke: new Stroke({ color: '#38BDF8', width: 1 }),
                padding: [2, 6, 2, 6],
              })
            : undefined,
        });
      },
    });

    const view = new View({
      center: fromLonLat([14, 24]),
      zoom: 2.1,
      minZoom: 1.6,
      maxZoom: 14,
    });

    const map = new Map({
      target: container,
      layers: [
        fallbackLandLayer,
        basemapLayer,
        graticuleLayer,
        zonesLayer,
        transectsLayer,
        stationsLayer,
        measureLayer,
      ],
      view,
      controls: defaultControls({ attribution: true, rotate: false, zoom: true }),
    });
    mapRef.current = map;

    map.on('pointermove', (evt) => {
      if (evt.dragging) return;
      const [lon, lat] = toLonLat(evt.coordinate);
      setCursorCoord([lon, lat]);

      if (measureModeRef.current) {
        container.style.cursor = 'crosshair';
        return;
      }

      const hitStation = map.hasFeatureAtPixel(evt.pixel, {
        layerFilter: (layer) => layer === stationsLayer,
        hitTolerance: 6,
      });
      container.style.cursor = hitStation ? 'pointer' : '';
    });

    view.on('change:resolution', () => {
      const z = view.getZoom();
      if (typeof z === 'number') {
        setCurrentZoom(z);
      }
    });

    map.on('singleclick', (evt) => {
      if (measureModeRef.current) return;
      const hit = map.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature,
        {
          layerFilter: (layer) => layer === stationsLayer,
          hitTolerance: 8,
        }
      );
      if (hit) {
        const stationId = String(hit.get('stationId'));
        const st = MONITORING_STATIONS.find((item) => item.id === stationId);
        if (st) {
          setSelectedStationId(st.id);
          const zoomNow = view.getZoom() ?? 2.1;
          view.animate({
            center: fromLonLat([st.lon, st.lat]),
            zoom: Math.max(zoomNow, 7.2),
            duration: 720,
          });
        }
      }
    });

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    stationsLayerRef.current?.changed();
  }, [selectedStationId]);

  // Zero-API-key Basemap Switching
  useEffect(() => {
    const tileLayer = basemapLayerRef.current;
    const landLayer = fallbackLandLayerRef.current;
    if (!tileLayer || !landLayer) return;

    const isLightStyle = basemap === 'osm';
    landLayer.setStyle(
      new Style({
        fill: new Fill({
          color: isLightStyle ? 'rgba(203, 213, 225, 0.72)' : 'rgba(30, 41, 59, 0.72)',
        }),
        stroke: new Stroke({
          color: isLightStyle ? 'rgba(100, 116, 139, 0.5)' : 'rgba(100, 116, 139, 0.45)',
          width: 1,
        }),
      })
    );

    if (basemap === 'vector-grid') {
      tileLayer.setVisible(false);
      return;
    }

    tileLayer.setVisible(true);
    if (basemap === 'dark-gray') {
      tileLayer.setSource(
        new XYZ({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          crossOrigin: 'anonymous',
        })
      );
    } else if (basemap === 'satellite') {
      tileLayer.setSource(
        new XYZ({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Imagery &copy; Esri, Maxar, Earthstar Geographics',
          crossOrigin: 'anonymous',
        })
      );
    } else {
      tileLayer.setSource(new OSM());
    }
  }, [basemap]);

  useEffect(() => {
    stationsLayerRef.current?.setVisible(showStations);
  }, [showStations]);

  useEffect(() => {
    zonesLayerRef.current?.setVisible(showZones);
  }, [showZones]);

  useEffect(() => {
    transectsLayerRef.current?.setVisible(showTransects);
  }, [showTransects]);

  useEffect(() => {
    graticuleLayerRef.current?.setVisible(showGraticule);
  }, [showGraticule]);

  // Toggle OpenLayers Geodesic Draw Interaction
  useEffect(() => {
    const map = mapRef.current;
    const measureSource = measureSourceRef.current;
    const container = mapContainerRef.current;
    if (!map || !measureSource) return;

    if (drawInteractionRef.current) {
      map.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }

    if (!measureMode) {
      if (container) container.style.cursor = '';
      return;
    }

    if (container) container.style.cursor = 'crosshair';

    const draw = new Draw({
      source: measureSource,
      type: 'LineString',
      style: new Style({
        stroke: new Stroke({
          color: '#F59E0B',
          width: 2.5,
          lineDash: [6, 4],
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: '#F59E0B' }),
          stroke: new Stroke({ color: '#070B13', width: 1.5 }),
        }),
      }),
    });

    draw.on('drawstart', (evt) => {
      const geom = evt.feature.getGeometry();
      if (geom instanceof LineString) {
        geom.on('change', () => {
          setMeasuredMeters(getLength(geom));
          setMeasurePoints(geom.getCoordinates().length);
        });
      }
    });

    draw.on('drawend', (evt) => {
      const geom = evt.feature.getGeometry();
      if (geom instanceof LineString) {
        setMeasuredMeters(getLength(geom));
        setMeasurePoints(geom.getCoordinates().length);
        setHasMeasurements(true);
      }
    });

    map.addInteraction(draw);
    drawInteractionRef.current = draw;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMeasureMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (drawInteractionRef.current) {
        map.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }
    };
  }, [measureMode]);

  const handleFlyToStation = (station: MonitoringStation) => {
    setSelectedStationId(station.id);
    const view = mapRef.current?.getView();
    if (view) {
      view.animate({
        center: fromLonLat([station.lon, station.lat]),
        zoom: 7.4,
        duration: 750,
      });
    }
  };

  const handlePreset = (presetId: string) => {
    const preset = MAP_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    if (preset.stationId) {
      setSelectedStationId(preset.stationId);
    }
    mapRef.current?.getView().animate({
      center: fromLonLat(preset.center),
      zoom: preset.zoom,
      duration: 750,
    });
  };

  const handleClearMeasurements = () => {
    measureSourceRef.current?.clear();
    setMeasuredMeters(0);
    setMeasurePoints(0);
    setHasMeasurements(false);
  };

  const statusMeta = STATUS_STYLE[selectedStation.status];
  const statusLabel =
    selectedStation.status === 'nominal'
      ? bi('Nominal', '运行正常')
      : selectedStation.status === 'advisory'
        ? bi('Advisory', '趋势关注')
        : bi('Surge Watch', '风暴潮预警');

  const presetLabelsZh: Record<string, string> = {
    global: '全球站网',
    yangtze: '长江口',
    sfbay: '旧金山湾',
    northsea: '北海三角洲',
    chesapeake: '美国东岸',
    tokyo: '东京湾',
  };

  return (
    <section
      id="lab"
      className="scroll-mt-20 border-b border-slate-200/80 py-16 dark:border-slate-800/80 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              <Radio className="h-3.5 w-3.5" />
              <span>{bi('Interactive Engineering Proof · OpenLayers 10', '交互式空间工程实证 · OpenLayers 10')}</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {bi('Live WebGIS & Coastal Telemetry Lab', '在线 WebGIS 与海岸带遥测实验室')}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              {bi(
                'Interact with a live OpenLayers engine directly on this page—switch between Esri Dark Gray, Satellite Imagery, OSM, or Vector Grid, measure spherical geodesic distances, and inspect 24-hour synthetic estuarine profiles.',
                '直接在主页交互体验 OpenLayers 10 引擎：无缝切换 Esri 深灰底图、卫星影像、OSM 与离线矢量经纬网，开展球面测地线量测，并点击全球 14 座合成河口站点查看 24 小时潮位、盐度与水温剖面。'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/apps/webgis-workbench/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 font-mono text-[11px] font-bold text-white shadow-sm transition hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              <span>{bi('Launch Original WebGIS Workbench', '打开原始 WebGIS 工作台')}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            {onLaunchFullStudio && (
              <button
                type="button"
                onClick={onLaunchFullStudio}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 font-mono text-[11px] font-bold text-cyan-700 transition hover:bg-cyan-600 hover:text-white dark:text-cyan-300 dark:hover:bg-cyan-500 dark:hover:text-slate-950"
              >
                <span>{bi('Swipe Compare Lab', '卷帘对比实验室')}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            )}
            {MAP_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePreset(preset.id)}
                className="rounded-lg border border-slate-300/80 bg-white px-2.5 py-1.5 font-mono text-[11px] font-medium text-slate-700 transition hover:border-cyan-500/60 hover:text-cyan-700 dark:border-slate-700/80 dark:bg-obsidian-900 dark:text-slate-300 dark:hover:border-cyan-400/60 dark:hover:text-cyan-300"
              >
                {bi(preset.label, presetLabelsZh[preset.id] ?? preset.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace Grid (equal height columns at 1440px) */}
        <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-12">
          {/* Left 7/8 cols: Map Workspace */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-panel dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-7 xl:col-span-8">
            {/* Map Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-slate-800 dark:bg-obsidian-850/90">
              {/* Zero-API-key Basemap Switcher */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {bi('Basemap:', '底图：')}
                </span>
                {(
                  [
                    { id: 'dark-gray', label: bi('Esri Dark', 'Esri 深灰') },
                    { id: 'satellite', label: bi('Satellite', '卫星影像') },
                    { id: 'osm', label: 'OSM' },
                    { id: 'vector-grid', label: bi('Vector Grid', '离线矢量网') },
                  ] as { id: BasemapId; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBasemap(item.id)}
                    className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-medium transition ${
                      basemap === item.id
                        ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                        : 'border border-slate-300/80 bg-white text-slate-600 hover:border-cyan-500/50 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Geodesic Measure Tools */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMeasureMode((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold transition ${
                    measureMode
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-cyan-500/60 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-200 dark:hover:border-cyan-400/60'
                  }`}
                >
                  <Ruler className="h-3.5 w-3.5" />
                  <span>
                    {measureMode
                      ? bi('Measuring (Dbl-Click End)', '量测中（双击结束）')
                      : bi('Measure Geodesic', '球面测距')}
                  </span>
                </button>

                {(hasMeasurements || measuredMeters > 0) && (
                  <button
                    type="button"
                    onClick={handleClearMeasurements}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-[11px] font-medium text-slate-600 transition hover:border-rose-500/50 hover:text-rose-600 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-300 dark:hover:text-rose-400"
                    title={bi('Clear measurements', '清除量测结果')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{bi('Clear', '清除')}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handlePreset('global')}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-1.5 text-slate-600 transition hover:border-cyan-500/60 hover:text-cyan-600 dark:border-slate-700 dark:bg-obsidian-900 dark:text-slate-300 dark:hover:text-cyan-300"
                  title={bi('Reset Global View', '重置全球视角')}
                  aria-label="Reset Global View"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive OpenLayers Map Viewport — stretches cleanly to match right inspector */}
            <div className="relative min-h-[430px] w-full flex-1 bg-[#070B13] sm:min-h-[490px] lg:min-h-[540px]">
              <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

              {/* High-Contrast Floating Layer Controls (always crisp over Satellite/OSM) */}
              <div className="absolute right-3 top-3 z-10 w-44 rounded-xl border border-slate-700/80 bg-slate-950/95 p-2.5 text-slate-100 shadow-xl backdrop-blur-md">
                <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                  <Layers className="h-3 w-3 text-cyan-400" />
                  <span>{bi('Vector Layers', '矢量图层控制')}</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-100">
                  <label className="flex cursor-pointer items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>{bi('Stations (14)', '监测站点 (14)')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={showStations}
                      onChange={(e) => setShowStations(e.target.checked)}
                      className="h-3.5 w-3.5 accent-cyan-400"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm border border-sky-400 bg-sky-400/30" />
                      <span>{bi('Coastal Zones (6)', '海岸带区划 (6)')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={showZones}
                      onChange={(e) => setShowZones(e.target.checked)}
                      className="h-3.5 w-3.5 accent-cyan-400"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="h-0.5 w-2.5 bg-emerald-400" />
                      <span>{bi('Transects (4)', '水文断面 (4)')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={showTransects}
                      onChange={(e) => setShowTransects(e.target.checked)}
                      className="h-3.5 w-3.5 accent-cyan-400"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 border border-dashed border-slate-400" />
                      <span>{bi('Graticule', '经纬网格')}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={showGraticule}
                      onChange={(e) => setShowGraticule(e.target.checked)}
                      className="h-3.5 w-3.5 accent-cyan-400"
                    />
                  </label>
                </div>
              </div>

              {/* High-Contrast Active Measurement HUD Overlay */}
              {(measureMode || measuredMeters > 0) && (
                <div className="absolute left-14 top-3 z-10 rounded-xl border border-amber-400/50 bg-slate-950/95 px-3 py-2 font-mono text-[11px] text-amber-200 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-3.5 w-3.5 text-amber-400" />
                    <span className="font-semibold">
                      {measuredMeters > 0
                        ? formatDistance(measuredMeters)
                        : bi('Click map points to measure', '点击地图绘制测距点')}
                    </span>
                    {measurePoints > 1 && (
                      <span className="text-[10px] text-slate-300">
                        ({measurePoints} {bi('pts · WGS84 Sphere', '节点 · WGS84 球面')})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* High-Contrast Bottom Coordinate HUD Bar */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-700/80 bg-slate-950/95 px-3.5 py-2 font-mono text-[11px] text-slate-100 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Crosshair className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{formatCoord(cursorCoord[0], cursorCoord[1])}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-300">
                  <span>
                    ZOOM <strong className="text-white">{currentZoom.toFixed(2)}</strong>
                  </span>
                  <span className="hidden sm:inline">CRS: EPSG:3857 / WGS84</span>
                  <span className="font-semibold text-emerald-400">OL 10 LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5/4 cols: Station Inspector & 24h Telemetry Chart */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-5 xl:col-span-4">
            <div>
              {/* Station Quick Selector */}
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="station-select"
                  className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  <MapPin className="h-3.5 w-3.5 text-cyan-500" />
                  <span>{bi('Station Inspector', '站点实时检视器')}</span>
                </label>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${statusMeta.badge}`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: statusMeta.dot }}
                  />
                  {statusLabel}
                </span>
              </div>

              <select
                id="station-select"
                value={selectedStation.id}
                onChange={(e) => {
                  const found = MONITORING_STATIONS.find((s) => s.id === e.target.value);
                  if (found) handleFlyToStation(found);
                }}
                className="mt-2.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs font-medium text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-100"
              >
                {MONITORING_STATIONS.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.code} · {st.name}
                  </option>
                ))}
              </select>

              {/* Station Metadata Card */}
              <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-obsidian-950/60">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-[11px] font-semibold text-cyan-700 dark:text-cyan-400">
                      {selectedStation.code}
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                      {selectedStation.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedStation.basin} · {selectedStation.region}
                    </p>
                  </div>
                  <Waves className="h-5 w-5 shrink-0 text-cyan-500/70" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-3 font-mono text-[11px] dark:border-slate-800">
                  <div>
                    <span className="block text-[10px] text-slate-400">
                      {bi('COORDINATES', '经纬度坐标')}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {formatCoord(selectedStation.lon, selectedStation.lat)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">
                      {bi('TIDAL RANGE / DEPTH', '潮差 / 水深')}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {selectedStation.tidalRangeM} m · {selectedStation.depthM} m
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-slate-400">
                      {bi('SENSOR SUITE', '传感器套件')} ({selectedStation.samplingRate})
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {selectedStation.sensorSuite}
                    </span>
                  </div>
                </div>
              </div>

              {/* 24h Interactive Telemetry Chart */}
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{bi('24-Hour Telemetry Profile', '24 小时连续时序剖面')}</span>
                </div>
                <TelemetryChart
                  series={selectedStation.series}
                  metric={metric}
                  onMetricChange={setMetric}
                />
              </div>
            </div>

            <p className="mt-4 border-t border-slate-200/80 pt-3 font-mono text-[10px] leading-relaxed text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {bi(
                '100% synthetic estuarine demo dataset (NOAA CO-OPS schema style). Click any marker to animate focus, or open the full-viewport WebGIS Studio for 2018 vs. 2026 swipe compare.',
                '100% 合成河口演示数据集（NOAA CO-OPS 结构风格）。点击地图站点即可平滑飞掠聚焦并更新时序曲线，或进入原始一张图工作台体验完整空间分析。'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
