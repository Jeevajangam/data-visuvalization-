export type SeriesKey = 'A' | 'B' | 'C';

export interface DataPoint {
  t: number; // epoch ms
  v: number;
  key: SeriesKey;
  meta?: Record<string, unknown>;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'heatmap';
  key: SeriesKey;
  color: string;
  visible: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  memMB?: number;
  frameTimeMs: number;
  dataProcMs: number;
  points: number;
}
