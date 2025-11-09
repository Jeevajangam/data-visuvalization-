'use client';
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { generateBurst, seedData, aggregateByBucket } from '@/lib/dataGenerator';

type Action =
  | { type: 'append', payload: DataPoint[] }
  | { type: 'setWindow', payload: number }
  | { type: 'setBucket', payload: number }
  | { type: 'toggleKey', payload: string }
  | { type: 'setRate', payload: number }
  | { type: 'setPaused', payload: boolean };

interface State {
  data: DataPoint[];
  windowMs: number; // visible time window
  bucketMs: number; // aggregation
  enabledKeys: Set<string>;
  rateMs: number; // tick rate
  paused: boolean;
}

const initial: State = {
  data: seedData(2000),
  windowMs: 5 * 60_000,
  bucketMs: 0,
  enabledKeys: new Set(['A','B','C']),
  rateMs: 100,
  paused: false
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'append': {
      const all = [...state.data, ...action.payload];
      const cut = Date.now() - state.windowMs;
      const pruned = all.slice(Math.max(0, all.findIndex(d => d.t >= cut)));
      return { ...state, data: pruned };
    }
    case 'setWindow': return { ...state, windowMs: action.payload };
    case 'setBucket': return { ...state, bucketMs: action.payload };
    case 'toggleKey': {
      const next = new Set(state.enabledKeys);
      if (next.has(action.payload)) next.delete(action.payload); else next.add(action.payload);
      return { ...state, enabledKeys: next };
    }
    case 'setRate': return { ...state, rateMs: action.payload };
    case 'setPaused': return { ...state, paused: action.payload };
    default: return state;
  }
}

const DataCtx = createContext<{ state: State; dispatch: React.Dispatch<Action>; filtered: DataPoint[] } | null>(null);

export function DataProvider({ children, initialData }: { children: React.ReactNode, initialData?: DataPoint[] }) {
  const [state, dispatch] = useReducer(reducer, { ...initial, data: initialData ?? initial.data });

  // Simulated real-time stream
  const timer = useRef<number | null>(null);
  useEffect(() => {
    const tick = () => {
      if (!state.paused) {
        const burst = generateBurst(Date.now(), 1);
        dispatch({ type: 'append', payload: burst });
      }
      timer.current = window.setTimeout(tick, state.rateMs);
    };
    timer.current = window.setTimeout(tick, state.rateMs);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [state.rateMs, state.paused]);

  const filtered = useMemo(() => {
    const cut = Date.now() - state.windowMs;
    let arr = state.data.filter(d => d.t >= cut && state.enabledKeys.has(d.key));
    if (state.bucketMs > 0) arr = aggregateByBucket(arr, state.bucketMs);
    return arr;
  }, [state.data, state.windowMs, state.bucketMs, state.enabledKeys]);

  const value = useMemo(()=>({ state, dispatch, filtered }), [state, filtered]);

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export function useData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
}
