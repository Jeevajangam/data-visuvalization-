'use client';
import { useEffect, useRef, useState } from 'react';
import { FpsCounter, estimateMemoryMB } from '@/lib/performanceUtils';
import type { PerformanceMetrics } from '@/lib/types';

export function usePerformanceMonitor(pointsFn: () => number) {
  const fps = useRef(new FpsCounter());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 0, frameTimeMs: 0, dataProcMs: 0, points: 0 });

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const t0 = performance.now();
      fps.current.tick();
      const memMB = estimateMemoryMB();
      const t1 = performance.now();
      setMetrics({
        fps: fps.current.fps,
        frameTimeMs: +(fps.current.frameTimeMs.toFixed(2)),
        dataProcMs: +(t1 - t0).toFixed(2),
        memMB,
        points: pointsFn()
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [pointsFn]);

  return metrics;
}
