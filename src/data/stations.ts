export type StationStatus = 'nominal' | 'advisory' | 'elevated';

export interface TelemetryPoint {
  hourLabel: string;
  timestampIso: string;
  waterLevelM: number;
  salinityPsu: number;
  tempC: number;
}

export interface MonitoringStation {
  id: string;
  code: string;
  name: string;
  region: string;
  basin: string;
  lon: number;
  lat: number;
  status: StationStatus;
  sensorSuite: string;
  samplingRate: string;
  depthM: number;
  tidalRangeM: number;
  series: TelemetryPoint[];
}

export interface CoastalZone {
  id: string;
  name: string;
  category: string;
  areaKm2: number;
  /** Ring in [lon, lat] WGS84 coordinates */
  coordinates: [number, number][];
}

export interface SurveyTransect {
  id: string;
  name: string;
  vessel: string;
  /** LineString in [lon, lat] WGS84 coordinates */
  coordinates: [number, number][];
}

export interface MapCameraPreset {
  id: string;
  label: string;
  center: [number, number];
  zoom: number;
  stationId?: string;
}

interface StationSeed {
  id: string;
  code: string;
  name: string;
  region: string;
  basin: string;
  lon: number;
  lat: number;
  status: StationStatus;
  sensorSuite: string;
  samplingRate: string;
  depthM: number;
  baseLevel: number;
  tidalAmp: number;
  phaseOffset: number;
  baseSalinity: number;
  salinitySwing: number;
  baseTemp: number;
  tempSwing: number;
}

/**
 * Deterministic 24-hour physically modeled estuarine telemetry generator
 * (Synthetic open demonstration dataset styled after NOAA CO-OPS / estuarine hydrology).
 */
function buildSeries(seed: StationSeed): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  for (let h = 0; h < 24; h++) {
    const radTide = ((h + seed.phaseOffset) / 12.42) * Math.PI * 2;
    const radSecondary = ((h + seed.phaseOffset * 0.5) / 24.0) * Math.PI * 2;
    const microRipple = Math.sin(h * 1.9 + seed.lon * 0.1) * 0.04;

    const waterLevelM = Number(
      (
        seed.baseLevel +
        seed.tidalAmp * Math.sin(radTide) +
        seed.tidalAmp * 0.16 * Math.cos(radSecondary) +
        microRipple
      ).toFixed(2)
    );

    // Salinity rises slightly during flood tide as denser seawater moves upriver
    const salinityPsu = Number(
      Math.max(
        0.5,
        seed.baseSalinity +
          seed.salinitySwing * Math.sin(radTide - 0.35) +
          Math.cos(h * 1.3 + seed.lat) * 0.18
      ).toFixed(2)
    );

    // Diurnal solar warming cycle peaking around hour 14-15 local index
    const tempC = Number(
      (
        seed.baseTemp +
        seed.tempSwing * Math.sin(((h - 9) / 24) * Math.PI * 2) +
        Math.sin(h * 0.8 + seed.lon) * 0.12
      ).toFixed(1)
    );

    const hh = String(h).padStart(2, '0');
    points.push({
      hourLabel: `${hh}:00`,
      timestampIso: `T-${23 - h}h (${hh}:00 UTC)`,
      waterLevelM,
      salinityPsu,
      tempC,
    });
  }
  return points;
}

const STATION_SEEDS: StationSeed[] = [
  {
    id: 'cn-yze-01',
    code: 'CN-YZE-01',
    name: 'Yangtze Estuary North Channel',
    region: 'East China Sea',
    basin: 'Yangtze River Delta',
    lon: 121.92,
    lat: 31.38,
    status: 'nominal',
    sensorSuite: 'CTD-SBE37 + Acoustic Tide Gauge',
    samplingRate: '6 min',
    depthM: 11.4,
    baseLevel: 2.15,
    tidalAmp: 1.48,
    phaseOffset: 1.2,
    baseSalinity: 14.8,
    salinitySwing: 4.2,
    baseTemp: 18.4,
    tempSwing: 1.3,
  },
  {
    id: 'us-sfb-04',
    code: 'US-SFB-04',
    name: 'San Francisco Bay · Golden Gate',
    region: 'Northeast Pacific',
    basin: 'San Francisco Estuary',
    lon: -122.48,
    lat: 37.81,
    status: 'nominal',
    sensorSuite: 'Microwave Radar + Optical DO/Salinity',
    samplingRate: '6 min',
    depthM: 18.6,
    baseLevel: 1.32,
    tidalAmp: 0.96,
    phaseOffset: 4.8,
    baseSalinity: 29.4,
    salinitySwing: 2.1,
    baseTemp: 13.8,
    tempSwing: 0.9,
  },
  {
    id: 'us-chb-02',
    code: 'US-CHB-02',
    name: 'Chesapeake Bay · Annapolis',
    region: 'Northwest Atlantic',
    basin: 'Chesapeake Estuarine Shelf',
    lon: -76.48,
    lat: 38.98,
    status: 'advisory',
    sensorSuite: 'Multiparameter Sonde + ADCP',
    samplingRate: '10 min',
    depthM: 8.2,
    baseLevel: 0.74,
    tidalAmp: 0.42,
    phaseOffset: 2.6,
    baseSalinity: 11.6,
    salinitySwing: 1.4,
    baseTemp: 16.5,
    tempSwing: 1.5,
  },
  {
    id: 'nl-rtd-07',
    code: 'NL-RTD-07',
    name: 'Rotterdam Europort · Rhine Delta',
    region: 'North Sea',
    basin: 'Rhine–Meuse–Scheldt Delta',
    lon: 4.05,
    lat: 51.97,
    status: 'elevated',
    sensorSuite: 'Surge Radar + Dual Conductivity Array',
    samplingRate: '5 min',
    depthM: 16.2,
    baseLevel: 1.85,
    tidalAmp: 1.18,
    phaseOffset: 6.1,
    baseSalinity: 22.7,
    salinitySwing: 3.8,
    baseTemp: 11.9,
    tempSwing: 0.8,
  },
  {
    id: 'uk-thm-03',
    code: 'UK-THM-03',
    name: 'Thames Estuary · Southend Pier',
    region: 'North Sea',
    basin: 'Outer Thames Estuary',
    lon: 0.72,
    lat: 51.52,
    status: 'nominal',
    sensorSuite: 'Bubbler Pressure + Salinity Telemetry',
    samplingRate: '15 min',
    depthM: 9.8,
    baseLevel: 2.94,
    tidalAmp: 2.12,
    phaseOffset: 5.5,
    baseSalinity: 27.9,
    salinitySwing: 2.6,
    baseTemp: 12.4,
    tempSwing: 0.9,
  },
  {
    id: 'jp-tkb-05',
    code: 'JP-TKB-05',
    name: 'Tokyo Bay · Yokosuka Sill',
    region: 'Western Pacific',
    basin: 'Uraga Channel Shelf',
    lon: 139.72,
    lat: 35.32,
    status: 'nominal',
    sensorSuite: 'Ultrasonic Tide + Thermistor Chain',
    samplingRate: '5 min',
    depthM: 14.5,
    baseLevel: 1.24,
    tidalAmp: 0.84,
    phaseOffset: 0.7,
    baseSalinity: 31.8,
    salinitySwing: 1.2,
    baseTemp: 19.6,
    tempSwing: 1.1,
  },
  {
    id: 'sg-sgp-06',
    code: 'SG-SGP-06',
    name: 'Singapore Strait · Marina South',
    region: 'Malacca & Singapore Strait',
    basin: 'Equatorial Shelf',
    lon: 103.87,
    lat: 1.26,
    status: 'nominal',
    sensorSuite: 'Radar Level + Turbidity/CTD Node',
    samplingRate: '6 min',
    depthM: 13.0,
    baseLevel: 1.68,
    tidalAmp: 1.05,
    phaseOffset: 3.4,
    baseSalinity: 30.2,
    salinitySwing: 0.9,
    baseTemp: 28.9,
    tempSwing: 0.7,
  },
  {
    id: 'au-syd-09',
    code: 'AU-SYD-09',
    name: 'Sydney Harbour · Port Jackson Heads',
    region: 'Tasman Sea',
    basin: 'Port Jackson Ria',
    lon: 151.28,
    lat: -33.83,
    status: 'nominal',
    sensorSuite: 'Acoustic Gauge + Wave Buoy Link',
    samplingRate: '10 min',
    depthM: 21.0,
    baseLevel: 1.12,
    tidalAmp: 0.76,
    phaseOffset: 8.2,
    baseSalinity: 34.4,
    salinitySwing: 0.7,
    baseTemp: 20.8,
    tempSwing: 1.0,
  },
  {
    id: 'us-nyb-11',
    code: 'US-NYB-11',
    name: 'New York Bight · The Battery',
    region: 'Northwest Atlantic',
    basin: 'Hudson–Raritan Estuary',
    lon: -74.01,
    lat: 40.7,
    status: 'advisory',
    sensorSuite: 'NOAA-Class Radar + CTD Telemetry',
    samplingRate: '6 min',
    depthM: 12.1,
    baseLevel: 1.41,
    tidalAmp: 0.89,
    phaseOffset: 3.1,
    baseSalinity: 21.4,
    salinitySwing: 3.1,
    baseTemp: 15.1,
    tempSwing: 1.2,
  },
  {
    id: 'it-vnl-08',
    code: 'IT-VNL-08',
    name: 'Venice Lagoon · Lido Inlet',
    region: 'Northern Adriatic Sea',
    basin: 'Venetian Lagoon',
    lon: 12.42,
    lat: 45.43,
    status: 'elevated',
    sensorSuite: 'Barrier Surge Gauge + Optical CTD',
    samplingRate: '5 min',
    depthM: 10.6,
    baseLevel: 1.08,
    tidalAmp: 0.56,
    phaseOffset: 7.4,
    baseSalinity: 33.1,
    salinitySwing: 1.8,
    baseTemp: 17.2,
    tempSwing: 1.4,
  },
  {
    id: 'us-msd-12',
    code: 'US-MSD-12',
    name: 'Mississippi Delta · Southwest Pass',
    region: 'Gulf of Mexico',
    basin: 'Mississippi Birdfoot Delta',
    lon: -89.42,
    lat: 28.93,
    status: 'nominal',
    sensorSuite: 'Salt-Wedge Profiler + River Stage',
    samplingRate: '10 min',
    depthM: 15.3,
    baseLevel: 0.62,
    tidalAmp: 0.31,
    phaseOffset: 9.1,
    baseSalinity: 9.2,
    salinitySwing: 4.5,
    baseTemp: 23.4,
    tempSwing: 1.1,
  },
  {
    id: 'kr-bsn-10',
    code: 'KR-BSN-10',
    name: 'Busan · Nakdong Estuarine Barrage',
    region: 'Korea Strait',
    basin: 'Nakdong Coastal Shelf',
    lon: 128.94,
    lat: 35.06,
    status: 'nominal',
    sensorSuite: 'Acoustic Doppler + Salinity Buoy',
    samplingRate: '6 min',
    depthM: 9.4,
    baseLevel: 1.04,
    tidalAmp: 0.68,
    phaseOffset: 1.8,
    baseSalinity: 24.6,
    salinitySwing: 3.4,
    baseTemp: 17.8,
    tempSwing: 1.2,
  },
  {
    id: 'ca-vfr-13',
    code: 'CA-VFR-13',
    name: 'Vancouver · Fraser River Delta',
    region: 'Salish Sea',
    basin: 'Strait of Georgia',
    lon: -123.25,
    lat: 49.12,
    status: 'nominal',
    sensorSuite: 'Radar Tide + Glacial Plume CTD',
    samplingRate: '10 min',
    depthM: 12.8,
    baseLevel: 2.38,
    tidalAmp: 1.64,
    phaseOffset: 5.0,
    baseSalinity: 18.5,
    salinitySwing: 3.7,
    baseTemp: 10.6,
    tempSwing: 0.9,
  },
  {
    id: 'de-elb-14',
    code: 'DE-ELB-14',
    name: 'Hamburg · Elbe Tidal Gate',
    region: 'North Sea',
    basin: 'Lower Elbe Estuary',
    lon: 9.85,
    lat: 53.54,
    status: 'advisory',
    sensorSuite: 'Storm-Surge Telemetry + Conductivity',
    samplingRate: '5 min',
    depthM: 14.1,
    baseLevel: 2.52,
    tidalAmp: 1.72,
    phaseOffset: 6.8,
    baseSalinity: 6.4,
    salinitySwing: 2.3,
    baseTemp: 11.4,
    tempSwing: 1.0,
  },
];

export const MONITORING_STATIONS: MonitoringStation[] = STATION_SEEDS.map((seed) => {
  const series = buildSeries(seed);
  const levels = series.map((p) => p.waterLevelM);
  const tidalRangeM = Number((Math.max(...levels) - Math.min(...levels)).toFixed(2));
  return {
    id: seed.id,
    code: seed.code,
    name: seed.name,
    region: seed.region,
    basin: seed.basin,
    lon: seed.lon,
    lat: seed.lat,
    status: seed.status,
    sensorSuite: seed.sensorSuite,
    samplingRate: seed.samplingRate,
    depthM: seed.depthM,
    tidalRangeM,
    series,
  };
});

export const COASTAL_ZONES: CoastalZone[] = [
  {
    id: 'zone-yze',
    name: 'Yangtze Saltmarsh & Estuarine Zone',
    category: 'Blue-Carbon & Hydrological Basin',
    areaKm2: 4820,
    coordinates: [
      [121.35, 31.88],
      [122.45, 31.78],
      [122.58, 30.88],
      [121.62, 30.78],
      [121.25, 31.32],
      [121.35, 31.88],
    ],
  },
  {
    id: 'zone-sfb',
    name: 'San Francisco Bay Telemetry Basin',
    category: 'Tidal Exchange Monitoring Zone',
    areaKm2: 3140,
    coordinates: [
      [-122.95, 38.28],
      [-121.95, 38.25],
      [-121.88, 37.38],
      [-122.72, 37.42],
      [-122.95, 38.28],
    ],
  },
  {
    id: 'zone-northsea',
    name: 'North Sea Delta Corridor (Thames–Rhine–Elbe)',
    category: 'Storm-Surge & Salinity Network',
    areaKm2: 38400,
    coordinates: [
      [0.15, 51.25],
      [3.6, 51.35],
      [9.95, 53.05],
      [10.25, 54.05],
      [3.9, 52.75],
      [0.35, 52.15],
      [0.15, 51.25],
    ],
  },
  {
    id: 'zone-chesapeake',
    name: 'Mid-Atlantic Estuarine Belt',
    category: 'Coastal Ecosystem Array',
    areaKm2: 19600,
    coordinates: [
      [-77.15, 39.55],
      [-73.55, 41.15],
      [-73.25, 40.25],
      [-75.75, 37.95],
      [-77.25, 38.35],
      [-77.15, 39.55],
    ],
  },
  {
    id: 'zone-tokyo',
    name: 'Tokyo Bay & Uraga Shelf',
    category: 'Met-Ocean Telemetry Polygon',
    areaKm2: 2680,
    coordinates: [
      [139.42, 35.75],
      [140.25, 35.68],
      [140.12, 34.95],
      [139.38, 35.05],
      [139.42, 35.75],
    ],
  },
  {
    id: 'zone-venice',
    name: 'Northern Adriatic Lagoon Basin',
    category: 'Surge Barrier Sector',
    areaKm2: 1940,
    coordinates: [
      [12.05, 45.68],
      [12.92, 45.66],
      [12.88, 45.12],
      [12.12, 45.14],
      [12.05, 45.68],
    ],
  },
];

export const SURVEY_TRANSECTS: SurveyTransect[] = [
  {
    id: 'tr-east-asia',
    name: 'East Asia Coastal Shelf Transect (YZE ↔ Busan ↔ Tokyo)',
    vessel: 'R/V Shelf-Surveyor A',
    coordinates: [
      [121.92, 31.38],
      [125.5, 33.1],
      [128.94, 35.06],
      [134.8, 34.15],
      [139.72, 35.32],
    ],
  },
  {
    id: 'tr-north-sea',
    name: 'North Sea Surge Baseline (Thames ↔ Rotterdam ↔ Elbe)',
    vessel: 'R/V Delta-Watch II',
    coordinates: [
      [0.72, 51.52],
      [2.45, 51.85],
      [4.05, 51.97],
      [6.8, 53.35],
      [9.85, 53.54],
    ],
  },
  {
    id: 'tr-us-east',
    name: 'US East Coast Estuarine Corridor (Chesapeake ↔ NY Bight)',
    vessel: 'NOAA-Style Transect Line',
    coordinates: [
      [-76.48, 38.98],
      [-75.2, 38.75],
      [-74.35, 39.65],
      [-74.01, 40.7],
    ],
  },
  {
    id: 'tr-us-west',
    name: 'Pacific Shelf Hydrographic Line (SF Bay ↔ Fraser Delta)',
    vessel: 'R/V Cascadia-CTD',
    coordinates: [
      [-122.48, 37.81],
      [-124.5, 41.2],
      [-124.65, 45.3],
      [-123.25, 49.12],
    ],
  },
];

export const MAP_PRESETS: MapCameraPreset[] = [
  { id: 'global', label: 'Global Network', center: [14, 24], zoom: 2.1 },
  { id: 'yangtze', label: 'Yangtze Estuary', center: [121.92, 31.38], zoom: 7.4, stationId: 'cn-yze-01' },
  { id: 'sfbay', label: 'SF Bay', center: [-122.48, 37.81], zoom: 7.8, stationId: 'us-sfb-04' },
  { id: 'northsea', label: 'North Sea Delta', center: [4.8, 52.35], zoom: 6.1, stationId: 'nl-rtd-07' },
  { id: 'chesapeake', label: 'US Atlantic', center: [-75.4, 39.7], zoom: 6.6, stationId: 'us-chb-02' },
  { id: 'tokyo', label: 'Tokyo Bay', center: [139.72, 35.32], zoom: 7.6, stationId: 'jp-tkb-05' },
];

/**
 * Lightweight simplified continental reference polygons so even in offline/air-gapped
 * environments where remote basemap tiles are blocked, the WebGIS canvas renders a
 * crisp geospatial world silhouette beneath the graticule and telemetry layers.
 */
export const FALLBACK_LANDMASSES: [number, number][][] = [
  // North America
  [
    [-166, 65], [-140, 70], [-95, 70], [-62, 58], [-55, 48], [-70, 41],
    [-81, 25], [-90, 29], [-97, 26], [-88, 16], [-78, 9], [-85, 10],
    [-105, 20], [-117, 32], [-125, 48], [-140, 60], [-166, 65],
  ],
  // South America
  [
    [-78, 9], [-62, 10], [-35, -6], [-40, -22], [-54, -35], [-68, -54],
    [-74, -46], [-71, -18], [-81, -4], [-78, 9],
  ],
  // Europe
  [
    [-9, 37], [3, 43], [14, 45], [26, 41], [38, 47], [42, 66],
    [25, 70], [8, 62], [4, 52], [-5, 49], [-9, 43], [-9, 37],
  ],
  // UK & Ireland
  [
    [-6, 50], [2, 51], [1, 58], [-6, 58], [-6, 50],
  ],
  // Africa
  [
    [-16, 15], [-6, 36], [11, 37], [32, 31], [43, 12], [51, 11],
    [40, -14], [28, -33], [18, -34], [12, -16], [9, 4], [-10, 5], [-16, 15],
  ],
  // Asia
  [
    [38, 47], [60, 68], [115, 73], [168, 66], [156, 52], [140, 46],
    [131, 42], [128, 35], [122, 31], [114, 22], [105, 10], [99, 1],
    [96, 16], [80, 8], [68, 24], [56, 26], [36, 36], [38, 47],
  ],
  // Japan Archipelago
  [
    [130, 31], [136, 34], [141, 36], [145, 44], [140, 42], [135, 36], [130, 31],
  ],
  // Australia
  [
    [114, -22], [130, -12], [142, -11], [153, -27], [150, -37],
    [137, -35], [115, -34], [114, -22],
  ],
];
