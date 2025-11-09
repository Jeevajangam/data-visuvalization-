'use client';
import { useData } from '@/hooks/useDataStream';

export default function FilterPanel() {
  const { state, dispatch } = useData();
  return (
    <div className="panel">
      <div className="toolbar">
        {(['A','B','C'] as const).map(k => (
          <label key={k} style={{display:'flex',gap:6,alignItems:'center'}}>
            <input
              type="checkbox"
              checked={state.enabledKeys.has(k)}
              onChange={()=>dispatch({ type:'toggleKey', payload:k })}
            />
            <span>Series {k}</span>
          </label>
        ))}
        <select value={state.bucketMs} onChange={e=>dispatch({ type:'setBucket', payload:Number(e.target.value) })}>
          <option value={0}>Raw</option>
          <option value={60_000}>1 min</option>
          <option value={5*60_000}>5 min</option>
          <option value={60*60_000}>1 hour</option>
        </select>
        <button className="button" onClick={()=>dispatch({ type:'setPaused', payload: !state.paused })}>
          {state.paused ? 'Resume' : 'Pause'}
        </button>
        <span className="right small">Rate:</span>
        <select value={state.rateMs} onChange={e=>dispatch({ type:'setRate', payload:Number(e.target.value) })}>
          <option value={50}>50ms</option>
          <option value={100}>100ms</option>
          <option value={250}>250ms</option>
        </select>
        <span className="small">Window:</span>
        <select value={state.windowMs} onChange={e=>dispatch({ type:'setWindow', payload:Number(e.target.value) })}>
          <option value={1*60_000}>1m</option>
          <option value={5*60_000}>5m</option>
          <option value={15*60_000}>15m</option>
        </select>
      </div>
    </div>
  );
}
