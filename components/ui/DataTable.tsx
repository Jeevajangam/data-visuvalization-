'use client';
import { useVirtualization } from '@/hooks/useVirtualization';
import { useData } from '@/hooks/useDataStream';

export default function DataTable() {
  const { filtered } = useData();
  const { containerRef, height, slice, offsetY, spacer, rowHeight } = useVirtualization(filtered, 28, 10);
  return (
    <div className="panel">
      <div className="small" style={{marginBottom:6}}>Virtualized Data ({filtered.length.toLocaleString()} rows)</div>
      <div ref={containerRef} style={{ height, overflow:'auto', border:'1px solid #1f2937', borderRadius:8 }}>
        <table className="table" style={{ position:'relative', borderCollapse:'separate', borderSpacing:0, width:'100%' }}>
          <thead className="sticky">
            <tr><th>Time</th><th>Series</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr style={{ height: offsetY }}><td></td><td></td><td></td></tr>
            {slice.map((d, i) => (
              <tr key={i} style={{ height: rowHeight }}>
                <td>{new Date(d.t).toLocaleTimeString()}</td>
                <td>{d.key}</td>
                <td>{d.v.toFixed(2)}</td>
              </tr>
            ))}
            <tr style={{ height: spacer }}><td></td><td></td><td></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
