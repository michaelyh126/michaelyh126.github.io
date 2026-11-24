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
import { getArea, getLength } from 'ol/sphere';
import { defaults as defaultControls } from 'ol/control';
import { getRenderPixel } from 'ol/render';
import type RenderEvent from 'ol/render/Event';
import {
  ChevronDown,
  ChevronUp,
  Crosshair,
  Eye,
  EyeOff,
  Layers,
  Pause,
  Pentagon,
  Play,
  RotateCcw,
  Ruler,
  Search,
  SlidersHorizontal,
  SplitSquareHorizontal,
  Table2,
  Trash2,
} from 'lucide-react';
import {
  COASTAL_ZONES,
  FALLBACK_LANDMASSES,
  MAP_PRESETS,
  MONITORING_STATIONS,
  SURVEY_TRANSECTS,
  type MonitoringStation,
} from '../data/stations';

type BasemapId = 'dark-gray' | 'satellite' | 'osm' | 'vector-grid';
type MeasureTool = 'none' | 'distance' | 'area';

interface SelectedFeatureInfo {
  kind: 'station' | 'zone';
  id: string;
  title: string;
  subtitle: string;
  lon: number;
  lat: number;
  properties: Record<string, string | number>;
}

/** Expand or shrink a WGS84 polygon around its centroid to synthesize 2018–2026 blue-carbon restoration epochs */
function scaleZoneRing(ring: [number, number][], scaleFactor: number): [number, number][] {
  const pts = ring.slice(0, -1);
  const cx = pts.reduce((acc, p) => acc + p[0], 0) / pts.length;
  const cy = pts.reduce((acc, p) => acc + p[1], 0) / pts.length;
  const scaled = pts.map(
    ([lon, lat]): [number, number] => [
      Number((cx + (lon - cx) * scaleFactor).toFixed(4)),
      Number((cy + (lat - cy) * scaleFactor).toFixed(4)),
    ]
  );
  return [...scaled, scaled[0]];
}

function formatCoord(lon: number, lat: number): string {
  return `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}, ${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
}

function formatLength(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}

function formatArea(sqM: number): string {
  if (sqM >= 1_000_000) return `${(sqM / 1_000_000).toFixed(2)} km²`;
  if (sqM >= 10_000) return `${(sqM / 10_000).toFixed(2)} ha`;
  return `${Math.round(sqM)} m²`;
}

export default function WebGISStudioDemo() {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const basemapLayerRef = useRef<TileLayer<XYZ | OSM> | null>(null);
  const landLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const graticuleLayerRef = useRef<Graticule | null>(null);
  const baseline2018LayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const epochLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const transectsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const stationsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const measureSourceRef = useRef<VectorSource | null>(null);
  const drawRef = useRef<Draw | null>(null);

  const [basemap, setBasemap] = useState<BasemapId>('dark-gray');
  const [layerSearch, setLayerSearch] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState(false);

  // Swipe Compare (2018 Baseline left vs Active Epoch right)
  const [swipeActive, setSwipeActive] = useState(true);
  const [swipeRatio, setSwipeRatio] = useState(0.5);
  const swipeActiveRef = useRef(swipeActive);
  swipeActiveRef.current = swipeActive;
  const swipeRatioRef = useRef(swipeRatio);
  swipeRatioRef.current = swipeRatio;

  // Layer visibility & opacity states
  const [layerVis, setLayerVis] = useState({
    epoch2026: true,
    baseline2018: true,
    stations: true,
    transects: true,
    graticule: true,
  });
  const [layerOpacity, setLayerOpacity] = useState({
    epoch2026: 0.85,
    baseline2018: 0.85,
    stations: 1,
    transects: 0.9,
    graticule: 0.65,
  });

  // Measurements
  const [measureTool, setMeasureTool] = useState<MeasureTool>('none');
  const measureToolRef = useRef(measureTool);
  measureToolRef.current = measureTool;
  const [measureReadout, setMeasureReadout] = useState<string>('');
  const [hasMeasurements, setHasMeasurements] = useState(false);

  // Spatial Inspector & Attribute Table
  const [cursorCoord, setCursorCoord] = useState<[number, number]>([121.92, 31.38]);
  const [zoomLevel, setZoomLevel] = useState<number>(6.8);
  const [tableOpen, setTableOpen] = useState(true);
  const [tableTab, setTableTab] = useState<'stations' | 'zones'>('stations');
  const [tableQuery, setTableQuery] = useState('');

  const [selectedFeature, setSelectedFeature] = useState<SelectedFeatureInfo>(() => {
    const st = MONITORING_STATIONS[0];
    return {
      kind: 'station',
      id: st.id,
      title: st.name,
      subtitle: `${st.code} · ${st.basin}`,
      lon: st.lon,
      lat: st.lat,
      properties: {
        station_code: st.code,
        region: st.region,
        status: st.status.toUpperCase(),
        depth_m: st.depthM,
        tidal_range_m: st.tidalRangeM,
        latest_level_m: st.series[st.series.length - 1].waterLevelM,
        latest_salinity_psu: st.series[st.series.length - 1].salinityPsu,
      },
    };
  });

  const selectedIdRef = useRef(selectedFeature.id);
  selectedIdRef.current = selectedFeature.id;

  const yearRef = useRef(year);
  yearRef.current = year;

  // Timeline auto-play effect
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setYear((prev) => (prev >= 2026 ? 2018 : prev + 1));
    }, 950);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  // Initialize OpenLayers 10 Map
  useEffect(() => {
    const container = mapElRef.current;
    if (!container) return;

    // 0. Built-in offline-safe world landmass silhouette
    const landFeatures = FALLBACK_LANDMASSES.map(
      (ring) => new Feature(new Polygon([ring.map((c) => fromLonLat(c))]))
    );
    const landLayer = new VectorLayer({
      zIndex: 0,
      source: new VectorSource({ features: landFeatures }),
      style: new Style({
        fill: new Fill({ color: 'rgba(30, 41, 59, 0.72)' }),
        stroke: new Stroke({ color: 'rgba(100, 116, 139, 0.45)', width: 1 }),
      }),
    });
    landLayerRef.current = landLayer;

    // 1. Zero-API-key Esri World Dark Gray Base
    const basemapLayer = new TileLayer<XYZ | OSM>({
      zIndex: 1,
      source: new XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        crossOrigin: 'anonymous',
      }),
    });
    basemapLayerRef.current = basemapLayer;

    // 2. Coordinate Graticule
    const graticuleLayer = new Graticule({
      zIndex: 2,
      strokeStyle: new Stroke({
        color: 'rgba(148, 163, 184, 0.2)',
        width: 1,
        lineDash: [3, 5],
      }),
      wrapX: true,
    });
    graticuleLayerRef.current = graticuleLayer;

    // 3. 2018 Baseline Blue-Carbon Layer (amber tint — shown on LEFT side during Swipe Compare)
    const baselineFeatures = COASTAL_ZONES.map((z) => {
      const scaled = scaleZoneRing(z.coordinates, 0.74);
      const f = new Feature({
        geometry: new Polygon([scaled.map((c) => fromLonLat(c))]),
        zoneId: z.id,
        zoneName: `${z.name} (2018)`,
      });
      f.setId(`${z.id}-2018`);
      return f;
    });
    const baseline2018Layer = new VectorLayer({
      zIndex: 3,
      source: new VectorSource({ features: baselineFeatures }),
      style: (feature) =>
        new Style({
          fill: new Fill({ color: 'rgba(245, 158, 11, 0.24)' }),
          stroke: new Stroke({
            color: 'rgba(251, 191, 36, 0.9)',
            width: 2,
            lineDash: [5, 4],
          }),
          text: new Text({
            text: String(feature.get('zoneName') ?? ''),
            font: '600 10px "JetBrains Mono", monospace',
            fill: new Fill({ color: '#FDE68A' }),
            stroke: new Stroke({ color: 'rgba(7, 11, 19, 0.92)', width: 3 }),
            overflow: false,
          }),
        }),
    });
    baseline2018LayerRef.current = baseline2018Layer;

    // 4. Dynamic Epoch Blue-Carbon Layer (2018–2026 cyan/emerald — shown on RIGHT side during Swipe Compare)
    const epochSource = new VectorSource();
    const epochLayer = new VectorLayer({
      zIndex: 4,
      source: epochSource,
      style: (feature) => {
        const isSel = String(feature.get('zoneId')) === selectedIdRef.current;
        return new Style({
          fill: new Fill({
            color: isSel ? 'rgba(16, 185, 129, 0.34)' : 'rgba(6, 182, 212, 0.22)',
          }),
          stroke: new Stroke({
            color: isSel ? '#34D399' : '#38BDF8',
            width: isSel ? 2.5 : 1.8,
          }),
          text: new Text({
            text: `${String(feature.get('zoneName') ?? '')} (${yearRef.current})`,
            font: '600 10px "JetBrains Mono", monospace',
            fill: new Fill({ color: '#BAE6FD' }),
            stroke: new Stroke({ color: 'rgba(7, 11, 19, 0.92)', width: 3 }),
            overflow: false,
          }),
        });
      },
    });
    epochLayerRef.current = epochLayer;

    // Canvas clipping hooks for real OpenLayers Swipe Compare!
    const clipLeft = (event: RenderEvent) => {
      if (!swipeActiveRef.current) return;
      const ctx = event.context as CanvasRenderingContext2D | null;
      const mapInst = mapRef.current;
      if (!ctx || !mapInst) return;
      const size = mapInst.getSize();
      if (!size) return;
      const width = size[0] * swipeRatioRef.current;
      const tl = getRenderPixel(event, [0, 0]);
      const tr = getRenderPixel(event, [width, 0]);
      const br = getRenderPixel(event, [width, size[1]]);
      const bl = getRenderPixel(event, [0, size[1]]);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tl[0], tl[1]);
      ctx.lineTo(tr[0], tr[1]);
      ctx.lineTo(br[0], br[1]);
      ctx.lineTo(bl[0], bl[1]);
      ctx.closePath();
      ctx.clip();
    };

    const clipRight = (event: RenderEvent) => {
      if (!swipeActiveRef.current) return;
      const ctx = event.context as CanvasRenderingContext2D | null;
      const mapInst = mapRef.current;
      if (!ctx || !mapInst) return;
      const size = mapInst.getSize();
      if (!size) return;
      const width = size[0] * swipeRatioRef.current;
      const tl = getRenderPixel(event, [width, 0]);
      const tr = getRenderPixel(event, [size[0], 0]);
      const br = getRenderPixel(event, [size[0], size[1]]);
      const bl = getRenderPixel(event, [width, size[1]]);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tl[0], tl[1]);
      ctx.lineTo(tr[0], tr[1]);
      ctx.lineTo(br[0], br[1]);
      ctx.lineTo(bl[0], bl[1]);
      ctx.closePath();
      ctx.clip();
    };

    const restoreCtx = (event: RenderEvent) => {
      if (!swipeActiveRef.current) return;
      const ctx = event.context as CanvasRenderingContext2D | null;
      if (ctx) ctx.restore();
    };

    baseline2018Layer.on('prerender', clipLeft);
    baseline2018Layer.on('postrender', restoreCtx);
    epochLayer.on('prerender', clipRight);
    epochLayer.on('postrender', restoreCtx);

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
      zIndex: 5,
      source: new VectorSource({ features: transectFeatures }),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(16, 185, 129, 0.82)',
          width: 2.2,
          lineDash: [8, 5],
        }),
      }),
    });
    transectsLayerRef.current = transectsLayer;

    // 6. Stations Layer
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
        const isSel = stId === selectedIdRef.current;
        const status = String(feature.get('status'));
        const color =
          status === 'elevated' ? '#F43F5E' : status === 'advisory' ? '#F59E0B' : '#10B981';

        return [
          new Style({
            image: new CircleStyle({
              radius: isSel ? 13 : 8.5,
              fill: new Fill({
                color: isSel ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.22)',
              }),
              stroke: isSel
                ? new Stroke({ color: '#38BDF8', width: 2 })
                : new Stroke({ color: 'rgba(255,255,255,0.25)', width: 1 }),
            }),
          }),
          new Style({
            image: new CircleStyle({
              radius: isSel ? 5.8 : 4.5,
              fill: new Fill({ color }),
              stroke: new Stroke({ color: '#070B13', width: 1.5 }),
            }),
            text: isSel
              ? new Text({
                  text: String(feature.get('code')),
                  offsetY: -19,
                  font: '600 11px "JetBrains Mono", monospace',
                  fill: new Fill({ color: '#F8FAFC' }),
                  backgroundFill: new Fill({ color: 'rgba(2, 6, 23, 0.92)' }),
                  backgroundStroke: new Stroke({ color: '#38BDF8', width: 1 }),
                  padding: [3, 6, 2, 6],
                })
              : undefined,
          }),
        ];
      },
    });
    stationsLayerRef.current = stationsLayer;

    // 7. Measurement Layer
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
          if (len > 0) label = formatLength(len);
        } else if (geom instanceof Polygon) {
          const area = getArea(geom);
          if (area > 0) label = formatArea(area);
        }
        return new Style({
          fill: new Fill({ color: 'rgba(245, 158, 11, 0.18)' }),
          stroke: new Stroke({ color: '#F59E0B', width: 2.5, lineDash: [6, 4] }),
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: '#F59E0B' }),
            stroke: new Stroke({ color: '#070B13', width: 1.5 }),
          }),
          text: label
            ? new Text({
                text: label,
                offsetY: -14,
                font: '600 11px "JetBrains Mono", monospace',
                fill: new Fill({ color: '#FEF3C7' }),
                backgroundFill: new Fill({ color: 'rgba(2, 6, 23, 0.92)' }),
                backgroundStroke: new Stroke({ color: '#F59E0B', width: 1 }),
                padding: [2, 6, 2, 6],
              })
            : undefined,
        });
      },
    });

    const view = new View({
      center: fromLonLat([121.92, 31.38]),
      zoom: 6.8,
      minZoom: 1.6,
      maxZoom: 15,
    });

    const map = new Map({
      target: container,
      layers: [
        landLayer,
        basemapLayer,
        graticuleLayer,
        baseline2018Layer,
        epochLayer,
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
      if (measureToolRef.current !== 'none') {
        container.style.cursor = 'crosshair';
        return;
      }
      const hit = map.hasFeatureAtPixel(evt.pixel, {
        layerFilter: (l) => l === stationsLayer || l === epochLayer,
        hitTolerance: 5,
      });
      container.style.cursor = hit ? 'pointer' : '';
    });

    view.on('change:resolution', () => {
      const z = view.getZoom();
      if (typeof z === 'number') setZoomLevel(z);
    });

    map.on('singleclick', (evt) => {
      if (measureToolRef.current !== 'none') return;
      // Prioritize stations, then coastal zones
      const stHit = map.forEachFeatureAtPixel(evt.pixel, (f) => f, {
        layerFilter: (l) => l === stationsLayer,
        hitTolerance: 7,
      });
      if (stHit) {
        const stId = String(stHit.get('stationId'));
        const st = MONITORING_STATIONS.find((s) => s.id === stId);
        if (st) {
          selectStation(st, false);
          return;
        }
      }

      const zoneHit = map.forEachFeatureAtPixel(evt.pixel, (f) => f, {
        layerFilter: (l) => l === epochLayer,
      });
      if (zoneHit) {
        const zId = String(zoneHit.get('zoneId'));
        const z = COASTAL_ZONES.find((item) => item.id === zId);
        if (z) {
          const [lon, lat] = z.coordinates[0];
          const growthPct = Math.round(((yearRef.current - 2018) / 8) * 28);
          setSelectedFeature({
            kind: 'zone',
            id: z.id,
            title: z.name,
            subtitle: `${z.category} · Epoch ${yearRef.current}`,
            lon,
            lat,
            properties: {
              zone_id: z.id,
              epoch_year: yearRef.current,
              baseline_2018_km2: Math.round(z.areaKm2 * 0.74),
              current_area_km2: Math.round(z.areaKm2 * (0.74 + (growthPct / 100))),
              restoration_delta: `+${growthPct}%`,
              crs: 'EPSG:3857',
            },
          });
        }
      }
    });

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  // Populate / update synthetic Epoch polygons whenever `year` changes
  useEffect(() => {
    const src = epochLayerRef.current?.getSource();
    if (!src) return;
    src.clear();
    const scale = 0.74 + ((year - 2018) / 8) * 0.34;
    const feats = COASTAL_ZONES.map((z) => {
      const ring = scaleZoneRing(z.coordinates, scale);
      const f = new Feature({
        geometry: new Polygon([ring.map((c) => fromLonLat(c))]),
        zoneId: z.id,
        zoneName: z.name,
      });
      f.setId(`${z.id}-${year}`);
      return f;
    });
    src.addFeatures(feats);
    mapRef.current?.render();
  }, [year]);

  // Re-render on swipe or selection change
  useEffect(() => {
    stationsLayerRef.current?.changed();
    epochLayerRef.current?.changed();
    mapRef.current?.render();
  }, [swipeActive, swipeRatio, selectedFeature.id]);

  // Sync Basemap (Zero-API-key Esri Dark Gray / Esri Satellite / OSM / Offline Vector Grid)
  useEffect(() => {
    const tileLayer = basemapLayerRef.current;
    const landLayer = landLayerRef.current;
    if (!tileLayer || !landLayer) return;

    const isLight = basemap === 'osm';
    landLayer.setStyle(
      new Style({
        fill: new Fill({
          color: isLight ? 'rgba(203, 213, 225, 0.72)' : 'rgba(30, 41, 59, 0.72)',
        }),
        stroke: new Stroke({ color: 'rgba(100, 116, 139, 0.45)', width: 1 }),
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
          attributions: 'Tiles &copy; Esri',
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

  // Sync layer visibility & opacity
  useEffect(() => {
    epochLayerRef.current?.setVisible(layerVis.epoch2026);
    epochLayerRef.current?.setOpacity(layerOpacity.epoch2026);
    baseline2018LayerRef.current?.setVisible(layerVis.baseline2018);
    baseline2018LayerRef.current?.setOpacity(layerOpacity.baseline2018);
    stationsLayerRef.current?.setVisible(layerVis.stations);
    stationsLayerRef.current?.setOpacity(layerOpacity.stations);
    transectsLayerRef.current?.setVisible(layerVis.transects);
    transectsLayerRef.current?.setOpacity(layerOpacity.transects);
    graticuleLayerRef.current?.setVisible(layerVis.graticule);
    graticuleLayerRef.current?.setOpacity(layerOpacity.graticule);
  }, [layerVis, layerOpacity]);

  // Measurement Draw Interaction (Distance OR Area)
  useEffect(() => {
    const map = mapRef.current;
    const src = measureSourceRef.current;
    const el = mapElRef.current;
    if (!map || !src) return;

    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
      drawRef.current = null;
    }

    if (measureTool === 'none') {
      if (el) el.style.cursor = '';
      return;
    }

    if (el) el.style.cursor = 'crosshair';
    const draw = new Draw({
      source: src,
      type: measureTool === 'distance' ? 'LineString' : 'Polygon',
    });

    draw.on('drawstart', (evt) => {
      const geom = evt.feature.getGeometry();
      if (!geom) return;
      geom.on('change', () => {
        if (geom instanceof LineString) {
          setMeasureReadout(`Distance: ${formatLength(getLength(geom))}`);
        } else if (geom instanceof Polygon) {
          setMeasureReadout(`Area: ${formatArea(getArea(geom))}`);
        }
      });
    });

    draw.on('drawend', (evt) => {
      const geom = evt.feature.getGeometry();
      if (geom instanceof LineString) {
        setMeasureReadout(`Distance: ${formatLength(getLength(geom))}`);
      } else if (geom instanceof Polygon) {
        setMeasureReadout(`Area: ${formatArea(getArea(geom))}`);
      }
      setHasMeasurements(true);
    });

    map.addInteraction(draw);
    drawRef.current = draw;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMeasureTool('none');
    };
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('keydown', onEsc);
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
        drawRef.current = null;
      }
    };
  }, [measureTool]);

  const selectStation = (st: MonitoringStation, fly = true) => {
    setSelectedFeature({
      kind: 'station',
      id: st.id,
      title: st.name,
      subtitle: `${st.code} · ${st.basin}`,
      lon: st.lon,
      lat: st.lat,
      properties: {
        station_code: st.code,
        region: st.region,
        status: st.status.toUpperCase(),
        depth_m: st.depthM,
        tidal_range_m: st.tidalRangeM,
        latest_level_m: st.series[st.series.length - 1].waterLevelM,
        latest_salinity_psu: st.series[st.series.length - 1].salinityPsu,
      },
    });
    if (fly) {
      mapRef.current?.getView().animate({
        center: fromLonLat([st.lon, st.lat]),
        zoom: 7.5,
        duration: 720,
      });
    }
  };

  const flyToZone = (zoneId: string) => {
    const z = COASTAL_ZONES.find((item) => item.id === zoneId);
    if (!z) return;
    const pts = z.coordinates.slice(0, -1);
    const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
    const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    const growthPct = Math.round(((year - 2018) / 8) * 28);
    setSelectedFeature({
      kind: 'zone',
      id: z.id,
      title: z.name,
      subtitle: `${z.category} · Epoch ${year}`,
      lon: cx,
      lat: cy,
      properties: {
        zone_id: z.id,
        epoch_year: year,
        baseline_2018_km2: Math.round(z.areaKm2 * 0.74),
        current_area_km2: Math.round(z.areaKm2 * (0.74 + growthPct / 100)),
        restoration_delta: `+${growthPct}%`,
        crs: 'EPSG:3857',
      },
    });
    mapRef.current?.getView().animate({
      center: fromLonLat([cx, cy]),
      zoom: 6.8,
      duration: 750,
    });
  };

  const layerItems = [
    { key: 'epoch2026' as const, label: `Blue-Carbon Epoch (${year})`, color: '#38BDF8' },
    { key: 'baseline2018' as const, label: '2018 Baseline Reference', color: '#F59E0B' },
    { key: 'stations' as const, label: 'Telemetry Stations (14)', color: '#10B981' },
    { key: 'transects' as const, label: 'Survey Transects (4)', color: '#34D399' },
    { key: 'graticule' as const, label: 'WGS84 Graticule', color: '#94A3B8' },
  ].filter((l) => l.label.toLowerCase().includes(layerSearch.toLowerCase()));

  const filteredStations = useMemo(
    () =>
      MONITORING_STATIONS.filter(
        (s) =>
          s.name.toLowerCase().includes(tableQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(tableQuery.toLowerCase()) ||
          s.region.toLowerCase().includes(tableQuery.toLowerCase())
      ),
    [tableQuery]
  );

  const filteredZones = useMemo(
    () =>
      COASTAL_ZONES.filter(
        (z) =>
          z.name.toLowerCase().includes(tableQuery.toLowerCase()) ||
          z.category.toLowerCase().includes(tableQuery.toLowerCase())
      ),
    [tableQuery]
  );

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-3 p-3 sm:p-4">
      {/* Top Studio Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 shadow-sm dark:border-slate-800 dark:bg-obsidian-900">
        {/* Region Camera Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {MAP_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                if (p.stationId) {
                  const st = MONITORING_STATIONS.find((s) => s.id === p.stationId);
                  if (st) selectStation(st, false);
                }
                mapRef.current?.getView().animate({
                  center: fromLonLat(p.center),
                  zoom: p.zoom,
                  duration: 700,
                });
              }}
              className="rounded-md border border-slate-300/80 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Spatial Analysis Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSwipeActive((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold transition ${
              swipeActive
                ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                : 'border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-200'
            }`}
          >
            <SplitSquareHorizontal className="h-3.5 w-3.5" />
            <span>Swipe Compare (2018 vs {year})</span>
          </button>

          <button
            type="button"
            onClick={() => setMeasureTool((t) => (t === 'distance' ? 'none' : 'distance'))}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition ${
              measureTool === 'distance'
                ? 'bg-amber-500 text-slate-950'
                : 'border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-200'
            }`}
          >
            <Ruler className="h-3.5 w-3.5" />
            <span>Distance</span>
          </button>

          <button
            type="button"
            onClick={() => setMeasureTool((t) => (t === 'area' ? 'none' : 'area'))}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-semibold transition ${
              measureTool === 'area'
                ? 'bg-amber-500 text-slate-950'
                : 'border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-200'
            }`}
          >
            <Pentagon className="h-3.5 w-3.5" />
            <span>Area</span>
          </button>

          {(hasMeasurements || measureReadout) && (
            <button
              type="button"
              onClick={() => {
                measureSourceRef.current?.clear();
                setMeasureReadout('');
                setHasMeasurements(false);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-rose-600 dark:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3-Column Workbench */}
      <div className="grid gap-3 lg:grid-cols-12">
        {/* Left Panel: Layer Stack & Basemaps */}
        <aside className="flex flex-col gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-3">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Layers className="h-3.5 w-3.5 text-cyan-500" />
              <span>Basemap Engine</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'dark-gray', label: 'Esri Dark' },
                  { id: 'satellite', label: 'Esri Satellite' },
                  { id: 'osm', label: 'OpenStreetMap' },
                  { id: 'vector-grid', label: 'Vector Grid' },
                ] as { id: BasemapId; label: string }[]
              ).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBasemap(b.id)}
                  className={`rounded-lg px-2 py-1.5 font-mono text-[11px] font-medium transition ${
                    basemap === b.id
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                      : 'border border-slate-300/80 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-300'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200/80 pt-3 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-500" />
                <span>Layer Stack</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">{layerItems.length} layers</span>
            </div>

            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={layerSearch}
                onChange={(e) => setLayerSearch(e.target.value)}
                placeholder="Filter layers..."
                className="w-full rounded-lg border border-slate-300/80 bg-slate-50 py-1.5 pl-8 pr-2.5 font-mono text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-100"
              />
            </div>

            <div className="mt-3 space-y-2.5">
              {layerItems.map((item) => {
                const visible = layerVis[item.key];
                const opacity = layerOpacity[item.key];
                return (
                  <div
                    key={item.key}
                    className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-obsidian-950/70"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate font-mono text-[11px] font-medium text-slate-800 dark:text-slate-200">
                          {item.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setLayerVis((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                        }
                        className="text-slate-500 hover:text-cyan-500"
                        aria-label={`Toggle ${item.label}`}
                      >
                        {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 opacity-50" />}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">Opacity</span>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={Math.round(opacity * 100)}
                        onChange={(e) =>
                          setLayerOpacity((prev) => ({
                            ...prev,
                            [item.key]: Number(e.target.value) / 100,
                          }))
                        }
                        className="h-1 flex-1 accent-cyan-500"
                      />
                      <span className="w-8 text-right font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        {Math.round(opacity * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Center OpenLayers Canvas + Swipe + Timeline */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-slate-950 shadow-panel dark:border-slate-800 lg:col-span-6">
          <div className="relative min-h-[460px] flex-1 bg-[#070B13]">
            <div ref={mapElRef} className="h-full min-h-[460px] w-full" />

            {/* Swipe Compare Divider & Labels */}
            {swipeActive && (
              <>
                <div
                  className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]"
                  style={{ left: `${swipeRatio * 100}%` }}
                />
                <div className="pointer-events-none absolute left-14 top-3 z-10 rounded-lg border border-amber-400/50 bg-slate-950/95 px-2.5 py-1 font-mono text-[11px] font-semibold text-amber-300 shadow-xl backdrop-blur-md">
                  LEFT: 2018 Baseline
                </div>
                <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg border border-cyan-400/50 bg-slate-950/95 px-2.5 py-1 font-mono text-[11px] font-semibold text-cyan-300 shadow-xl backdrop-blur-md">
                  RIGHT: {year} Epoch
                </div>
                <div className="absolute bottom-11 left-1/2 z-20 flex w-64 -translate-x-1/2 items-center gap-2 rounded-full border border-slate-700/90 bg-slate-950/95 px-3 py-1.5 text-slate-100 shadow-xl backdrop-blur-md">
                  <span className="font-mono text-[10px] text-amber-300">2018</span>
                  <input
                    type="range"
                    min={5}
                    max={95}
                    value={Math.round(swipeRatio * 100)}
                    onChange={(e) => setSwipeRatio(Number(e.target.value) / 100)}
                    aria-label="Swipe compare split position"
                    className="h-1.5 flex-1 cursor-ew-resize accent-cyan-400"
                  />
                  <span className="font-mono text-[10px] text-cyan-300">{year}</span>
                </div>
              </>
            )}

            {/* Measure Active Badge */}
            {(measureTool !== 'none' || measureReadout) && (
              <div className="absolute left-14 top-12 z-10 rounded-lg border border-amber-400/50 bg-slate-950/95 px-3 py-1.5 font-mono text-[11px] font-semibold text-amber-200 shadow-xl backdrop-blur-md">
                {measureReadout ||
                  `Click map points to measure geodesic ${measureTool} (dbl-click to end)`}
              </div>
            )}

            {/* High-Contrast Coordinate HUD */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-700/80 bg-slate-950/95 px-3.5 py-2 font-mono text-[11px] text-slate-100 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Crosshair className="h-3.5 w-3.5 text-cyan-400" />
                <span>{formatCoord(cursorCoord[0], cursorCoord[1])}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-300">
                <span>
                  ZOOM <strong className="text-white">{zoomLevel.toFixed(2)}</strong>
                </span>
                <span>EPSG:3857</span>
              </div>
            </div>
          </div>

          {/* Year Epoch Timeline Scrubber */}
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-100">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play Epochs'}</span>
            </button>

            <div className="flex flex-1 items-center gap-3">
              <span className="font-mono text-xs font-semibold text-amber-300">2018</span>
              <input
                type="range"
                min={2018}
                max={2026}
                step={1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                aria-label="Raster epoch year timeline"
                className="h-1.5 flex-1 accent-cyan-400"
              />
              <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300">
                {year}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setYear(2026);
                setIsPlaying(false);
                mapRef.current?.getView().animate({
                  center: fromLonLat([121.92, 31.38]),
                  zoom: 6.8,
                  duration: 600,
                });
              }}
              className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
              title="Reset viewport"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Panel: Spatial Feature Inspector */}
        <aside className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-obsidian-900 lg:col-span-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Spatial Inspector
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-600 dark:bg-obsidian-950 dark:text-slate-300">
                {selectedFeature.kind}
              </span>
            </div>

            <h2 className="mt-2 font-display text-lg font-bold text-slate-950 dark:text-white">
              {selectedFeature.title}
            </h2>
            <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {selectedFeature.subtitle}
            </p>

            <div className="mt-3 rounded-lg border border-slate-200/80 bg-slate-50 p-2.5 font-mono text-[11px] text-slate-700 dark:border-slate-800 dark:bg-obsidian-950 dark:text-slate-300">
              {formatCoord(selectedFeature.lon, selectedFeature.lat)}
            </div>

            <div className="mt-4 space-y-2">
              {Object.entries(selectedFeature.properties).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between border-b border-slate-200/70 pb-1.5 font-mono text-xs dark:border-slate-800"
                >
                  <span className="text-slate-500 dark:text-slate-400">{k}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200/80 bg-slate-950 p-3 font-mono text-[10px] text-cyan-300 dark:border-slate-800">
            <div className="mb-1 text-slate-400">// Live GeoJSON Feature Snapshot</div>
            <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
{JSON.stringify(
  {
    type: 'Feature',
    id: selectedFeature.id,
    geometry: {
      type: selectedFeature.kind === 'station' ? 'Point' : 'Polygon',
      coordinates: [Number(selectedFeature.lon.toFixed(3)), Number(selectedFeature.lat.toFixed(3))],
    },
    properties: { epoch: year },
  },
  null,
  2
)}
            </pre>
          </div>
        </aside>
      </div>

      {/* Bottom Collapsible Interactive Attribute Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-obsidian-900">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 px-4 py-2.5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTableOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-900 dark:text-white"
            >
              <Table2 className="h-4 w-4 text-cyan-500" />
              <span>Attribute Table (Click row to fly camera)</span>
              {tableOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-obsidian-950">
              <button
                type="button"
                onClick={() => setTableTab('stations')}
                className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                  tableTab === 'stations'
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Stations ({MONITORING_STATIONS.length})
              </button>
              <button
                type="button"
                onClick={() => setTableTab('zones')}
                className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                  tableTab === 'zones'
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Blue-Carbon Zones ({COASTAL_ZONES.length})
              </button>
            </div>
          </div>

          <input
            type="text"
            value={tableQuery}
            onChange={(e) => setTableQuery(e.target.value)}
            placeholder="Search attributes..."
            className="w-48 rounded-lg border border-slate-300/80 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-900 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-obsidian-950 dark:text-slate-100"
          />
        </div>

        {tableOpen && (
          <div className="max-h-52 overflow-auto">
            {tableTab === 'stations' ? (
              <table className="w-full text-left font-mono text-xs">
                <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase text-slate-500 dark:bg-obsidian-950 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Station Name</th>
                    <th className="px-4 py-2">Region</th>
                    <th className="px-4 py-2">Lon / Lat</th>
                    <th className="px-4 py-2">Tidal Range</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                  {filteredStations.map((st) => (
                    <tr
                      key={st.id}
                      onClick={() => selectStation(st, true)}
                      className={`cursor-pointer transition hover:bg-cyan-500/10 ${
                        selectedFeature.id === st.id ? 'bg-cyan-500/15' : ''
                      }`}
                    >
                      <td className="px-4 py-2 font-semibold text-cyan-700 dark:text-cyan-400">
                        {st.code}
                      </td>
                      <td className="px-4 py-2 text-slate-900 dark:text-slate-100">{st.name}</td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{st.region}</td>
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-300">
                        {formatCoord(st.lon, st.lat)}
                      </td>
                      <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                        {st.tidalRangeM} m
                      </td>
                      <td className="px-4 py-2 uppercase">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            st.status === 'elevated'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                              : st.status === 'advisory'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left font-mono text-xs">
                <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase text-slate-500 dark:bg-obsidian-950 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-2">Zone ID</th>
                    <th className="px-4 py-2">Coastal Zone Name</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">2018 Baseline</th>
                    <th className="px-4 py-2">{year} Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                  {filteredZones.map((z) => {
                    const growth = ((year - 2018) / 8) * 0.28;
                    return (
                      <tr
                        key={z.id}
                        onClick={() => flyToZone(z.id)}
                        className={`cursor-pointer transition hover:bg-cyan-500/10 ${
                          selectedFeature.id === z.id ? 'bg-cyan-500/15' : ''
                        }`}
                      >
                        <td className="px-4 py-2 font-semibold text-cyan-700 dark:text-cyan-400">
                          {z.id}
                        </td>
                        <td className="px-4 py-2 text-slate-900 dark:text-slate-100">{z.name}</td>
                        <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                          {z.category}
                        </td>
                        <td className="px-4 py-2 text-amber-600 dark:text-amber-300">
                          {Math.round(z.areaKm2 * 0.74).toLocaleString()} km²
                        </td>
                        <td className="px-4 py-2 text-emerald-600 dark:text-emerald-300">
                          {Math.round(z.areaKm2 * (0.74 + growth)).toLocaleString()} km²
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
