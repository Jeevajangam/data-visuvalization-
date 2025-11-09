'use client';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useData } from '@/hooks/useDataStream';

export default function PerformanceMonitor() {
  const { filtered } = useData();
  const metrics = usePerformanceMonitor(()=>filtered.length);
  return (
    <div className="panel">
      <div className="flex">
        <span className="badge">FPS</span><b>{metrics.fps}</b>
        <span className="badge">Frame</span><span>{metrics.frameTimeMs} ms</span>
        <span className="badge">Proc</span><span>{metrics.dataProcMs} ms</span>
        <span className="badge">Points</span><span>{metrics.points.toLocaleString()}</span>
        <span className="badge">Memory</span><span>{metrics.memMB ? metrics.memMB + ' MB' : 'n/a'}</span>
      </div>
    </div>
  );
}
