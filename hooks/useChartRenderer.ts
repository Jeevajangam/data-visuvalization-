'use client';
import { useCallback, useRef, useState } from 'react';
import { DataPoint } from '@/lib/types';
import { setupCanvas, clear } from '@/lib/canvasUtils';

export interface Viewport { xmin: number; xmax: number; ymin: number; ymax: number; }

export function useChartRenderer() {
  const vp = useRef<Viewport>({ xmin: 0, xmax: 1, ymin: 0, ymax: 100 });
  const [view, setView] = useState(vp.current);

  const toPx = (x: number, y: number, w: number, h: number) => {
    const px = (x - vp.current.xmin) / (vp.current.xmax - vp.current.xmin) * w;
    const py = h - (y - vp.current.ymin) / (vp.current.ymax - vp.current.ymin) * h;
    return [px, py];
  };

  const fitData = useCallback((canvas: HTMLCanvasElement, data: DataPoint[]) => {
    if (!data.length) return;
    const xs = data.map(d=>d.t);
    const ys = data.map(d=>d.v);
    const xmin = Math.min(...xs), xmax = Math.max(...xs);
    const ymin = Math.min(...ys), ymax = Math.max(...ys);
    vp.current = { xmin, xmax, ymin: ymin - 5, ymax: ymax + 5 };
    setView(vp.current);
    setupCanvas(canvas);
  }, []);

  const renderLine = useCallback((canvas: HTMLCanvasElement, data: DataPoint[], color = '#22d3ee') => {
    const { ctx, width, height } = setupCanvas(canvas);
    clear(ctx, width, height);
    if (!data.length) return;
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const [x, y] = toPx(data[i].t, data[i].v, width, height);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, []);

  const renderScatter = useCallback((canvas: HTMLCanvasElement, data: DataPoint[], color = '#7dd3fc') => {
    const { ctx, width, height } = setupCanvas(canvas);
    clear(ctx, width, height);
    ctx.fillStyle = color;
    const n = data.length;
    // Level-of-detail: skip points when overly dense
    const step = n > 20000 ? Math.floor(n/10000) : 1;
    for (let i = 0; i < n; i += step) {
      const [x, y] = toPx(data[i].t, data[i].v, width, height);
      ctx.fillRect(x-1, y-1, 2, 2);
    }
  }, []);

  const renderBars = useCallback((canvas: HTMLCanvasElement, data: DataPoint[], color = '#34d399') => {
    const { ctx, width, height } = setupCanvas(canvas);
    clear(ctx, width, height);
    if (!data.length) return;
    const n = data.length;
    const barW = Math.max(1, Math.floor(width / Math.min(n, 400)));
    ctx.fillStyle = color;
    for (let i = 0; i < n; i++) {
      const [x, y] = toPx(data[i].t, Math.max(view.ymin, data[i].v), width, height);
      const [, y0] = toPx(data[i].t, view.ymin, width, height);
      ctx.fillRect(x, Math.min(y, y0), barW, Math.abs(y0 - y));
    }
  }, [view.ymin]);

  const renderHeatmap = useCallback((canvas: HTMLCanvasElement, data: DataPoint[]) => {
    const { ctx, width, height } = setupCanvas(canvas);
    clear(ctx, width, height);
    if (!data.length) return;
    // Simple 2D binning by time (x) and value (y)
    const cols = 200, rows = 100;
    const grid = new Uint16Array(cols * rows);
    const xmin = vp.current.xmin, xmax = vp.current.xmax;
    const ymin = vp.current.ymin, ymax = vp.current.ymax;
    for (const d of data) {
      const cx = Math.min(cols-1, Math.max(0, Math.floor((d.t - xmin)/(xmax - xmin) * cols)));
      const cy = Math.min(rows-1, Math.max(0, Math.floor((d.v - ymin)/(ymax - ymin) * rows)));
      grid[cy * cols + cx]++;
    }
    const max = grid.reduce((a,b)=>Math.max(a,b),0) || 1;
    const cellW = width / cols, cellH = height / rows;
    for (let y=0;y<rows;y++){
      for (let x=0;x<cols;x++){
        const v = grid[y*cols+x] / max;
        const alpha = Math.min(1, v);
        ctx.fillStyle = `rgba(34,211,238,${alpha})`;
        ctx.fillRect(x*cellW, y*cellH, Math.ceil(cellW)+1, Math.ceil(cellH)+1);
      }
    }
  }, []);

  // Zoom/Pan handlers (wheel to zoom, drag to pan)
  const attachInteractions = useCallback((canvas: HTMLCanvasElement) => {
    let dragging = false;
    let lastX = 0;
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.1 : 0.9;
      const cx = vp.current.xmin + (vp.current.xmax - vp.current.xmin) * (e.offsetX / canvas.clientWidth);
      const nxmin = cx - (cx - vp.current.xmin) * factor;
      const nxmax = cx + (vp.current.xmax - cx) * factor;
      vp.current = { ...vp.current, xmin: nxmin, xmax: nxmax };
      setView(vp.current);
    }, { passive: false });
    canvas.addEventListener('mousedown', (e) => { dragging = true; lastX = e.clientX; });
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const span = vp.current.xmax - vp.current.xmin;
      const shift = -dx / canvas.clientWidth * span;
      vp.current = { ...vp.current, xmin: vp.current.xmin + shift, xmax: vp.current.xmax + shift };
      setView(vp.current);
    });
  }, []);

  return { fitData, renderLine, renderScatter, renderBars, renderHeatmap, attachInteractions };
}
