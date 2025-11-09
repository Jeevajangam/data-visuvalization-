'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useData } from '@/hooks/useDataStream';
import { useChartRenderer } from '@/hooks/useChartRenderer';

export default function BarChart() {
  const { filtered } = useData();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { fitData, renderBars, attachInteractions } = useChartRenderer();
  const memoData = useMemo(()=>filtered, [filtered]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    fitData(c, memoData);
    attachInteractions(c);
    let raf = 0;
    const loop = () => { renderBars(c, memoData); raf = requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [memoData, fitData, renderBars, attachInteractions]);

  return <div className="card" style={{height:260}}><canvas ref={canvasRef} /></div>;
}
