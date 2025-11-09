'use client';
import { useMemo, useRef, useState, useEffect } from 'react';

export function useVirtualization<T>(items: T[], rowHeight = 28, overscan = 8) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const total = items.length;
  const height = Math.min(400, Math.max(200, Math.floor(window.innerHeight * 0.3)));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(total, Math.ceil((scrollTop + height) / rowHeight) + overscan);
  const slice = items.slice(start, end);
  const offsetY = start * rowHeight;
  const spacer = (total * rowHeight) - slice.length * rowHeight - offsetY;
  return { containerRef, height, slice, offsetY, spacer, total, rowHeight };
}
