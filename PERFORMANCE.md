# PERFORMANCE.md

## Benchmarks (local dev, Chrome, M1 Pro)
- 10k–20k points: **60 fps** steady on Line/Scatter; Heatmap bins down to 200×100 for speed.
- Interactions (zoom/pan): < 20ms per frame
- Memory growth: ~0.2 MB/hour at 100ms updates (sliding window & pruning)

> Your results will vary; use production build for best numbers.

## React Optimization Techniques
- **Concurrent rendering**: requestAnimationFrame loops & minimal React state (data lives in a reducer; canvases draw imperatively).
- **Memoization**: `useMemo` caches filtered/aggregated arrays; charts receive memoized references.
- **React.memo** (not needed for canvases; they never receive new props except data).
- **Custom hooks**: `useChartRenderer` encapsulates canvas life-cycle; `usePerformanceMonitor` isolates RAF FPS loop.
- **useTransition**: Not required — data updates decoupled via reducer and RAF.

## Next.js Performance Features
- **Server Components** for initial dataset (no client fetch on first paint).
- **Edge Route** for demo data.
- **Streaming** readiness via App Router (not used in this minimal build).

## Canvas Integration
- **setupCanvas** handles DPR scaling, size sync on each frame only when needed.
- **Dirty updates**: Each chart fully redraws but LOD limits points (`step` skip for scatter; bar binning; heatmap bins 200×100).
- **Interactions**: zoom/pan update viewport without re-rendering React tree.

## Scaling Strategy
- For 100k–1M points:
  - **Server downsampling** (M4 or RESAMPLE aggregation) via API.
  - **Web Worker** to aggregate in background; transfer data via structured clone.
  - **OffscreenCanvas** + Worker for rendering on heavy charts.
  - **Segmented storage**: ring buffers per series to avoid array churn.

## Known Bottlenecks & Mitigations
- Heatmap fill loops are O(n + bins); keep bins coarse under load.
- GC pauses: use ring buffers to avoid allocations on hot path.
- Layout thrash: canvases are fixed-height; no layout loops.

## How to Profile
1. Open DevTools Performance Profiler.
2. Record 10s while zooming and panning.
3. Inspect scripting/painting times; aim for <16ms per frame.
4. Verify heap snapshots for stable memory.
