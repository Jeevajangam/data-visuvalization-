'use client';
import { useData } from '@/hooks/useDataStream';

export default function TimeRangeSelector() {
  const { state, dispatch } = useData();
  return (
    <div className="panel flex">
      <span className="badge">Time Range</span>
      <input
        type="range"
        min={60_000}
        max={60*60_000}
        step={60_000}
        value={state.windowMs}
        onChange={(e)=>dispatch({ type: 'setWindow', payload: Number(e.target.value) })}
        style={{ width: 240 }}
      />
      <span className="small">{Math.round(state.windowMs/60000)} min</span>
    </div>
  );
}
