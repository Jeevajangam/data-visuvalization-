# Performance Dashboard (Next.js 14 + TypeScript)

High-performance real-time dashboard built **from scratch** (no chart libs) using:
- Next.js 14 App Router
- React 18 (Concurrent rendering)
- TypeScript
- Canvas rendering with custom pan/zoom + LOD
- Virtualized table
- FPS & memory monitor
- Simulated real‑time data (every 100ms)

## ✨ Features
- Line, Scatter, Bar, Heatmap — pure Canvas
- Real-time updates with sliding window & aggregation
- Zoom (wheel) + Pan (drag)
- Data filtering (toggle series), time range, update rate
- Virtual scrolling for large tables
- Edge Route for sample data (`/api/data`)

## 🚀 Quick Start
```bash
npm install
npm run dev
# open http://localhost:3000/dashboard
```

## 🧪 Performance Testing
- Use the **PerformanceMonitor** in the header (FPS, frame time, memory, points).
- Try different **Window** sizes (1–15m), **Rate** (50–250ms), and **Aggregation** (Raw/1m/5m/1h).
- Use DevTools Performance Profiler; CPU throttle 4× to stress-test.
- Expect 60fps for 10k+ points on modern hardware.

## 🧩 Next.js Specific
- Server Component provides the initial dataset in `app/dashboard/page.tsx` (no blocking on client).
- Client Components render charts and interactivity.
- Edge Route handler in `app/api/data/route.ts` for demonstration.
- No external chart libraries.

## 📸 Screenshots
Add screenshots of `/dashboard` showing 60fps counter.

## 🧱 Project Structure
```
performance-dashboard-next/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── data/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/ (LineChart|ScatterPlot|BarChart|Heatmap)
│   ├── controls/ (FilterPanel|TimeRangeSelector)
│   ├── providers/ (DataProvider)
│   └── ui/ (DataTable|PerformanceMonitor)
├── hooks/ (useDataStream|useChartRenderer|usePerformanceMonitor|useVirtualization)
├── lib/ (dataGenerator|performanceUtils|canvasUtils|types)
├── public/workers/dataWorker.js
└── PERFORMANCE.md
```

## 🧠 Browser Notes
- Memory readout uses `performance.memory` (Chrome-based only).
- Canvas uses devicePixelRatio for crisp rendering.
- Works on desktop/tablet; mobile renders but heavy charts reduce bins with LOD.

## 🔧 Env
Node 18+ recommended.
