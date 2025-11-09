import { DataPoint, SeriesKey } from './types';

export function seedData(count: number, start = Date.now() - 5 * 60_000, stepMs = 100): DataPoint[] {
  const out: DataPoint[] = [];
  let t = start;
  for (let i = 0; i < count; i++) {
    const keys: SeriesKey[] = ['A','B','C'];
    for (const key of keys) {
      const v = 50 + 40 * Math.sin((t/1000) + (key === 'A' ? 0 : key === 'B' ? 1 : 2)) + (Math.random() - .5) * 5;
      out.push({ t, v, key });
    }
    t += stepMs;
  }
  return out;
}

export function generateBurst(now = Date.now(), pointsPerSeries = 1): DataPoint[] {
  const keys: SeriesKey[] = ['A','B','C'];
  const out: DataPoint[] = [];
  for (const key of keys) {
    for (let i = 0; i < pointsPerSeries; i++) {
      const t = now + i;
      const v = 50 + 40 * Math.sin((t/1000) + (key === 'A' ? 0 : key === 'B' ? 1 : 2)) + (Math.random() - .5) * 8;
      out.push({ t, v, key });
    }
  }
  return out;
}

export function aggregateByBucket(data: DataPoint[], bucketMs: number): DataPoint[] {
  // Simple average per key per bucket
  const map = new Map<string, { sum: number, n: number, key: SeriesKey, t: number }>();
  for (const d of data) {
    const bucket = Math.floor(d.t / bucketMs) * bucketMs;
    const id = `${bucket}-${d.key}`;
    const prev = map.get(id);
    if (prev) { prev.sum += d.v; prev.n++; }
    else map.set(id, { sum: d.v, n: 1, key: d.key, t: bucket });
  }
  const out: DataPoint[] = [];
  map.forEach(({ sum, n, key, t }) => out.push({ t, v: sum / n, key }));
  out.sort((a,b)=>a.t-b.t);
  return out;
}
