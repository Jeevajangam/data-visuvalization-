// Simple data worker that generates bursts to avoid main thread work
self.onmessage = (e) => {
  const { now, perSeries } = e.data || {};
  const keys = ['A','B','C'];
  const out = [];
  for (const key of keys) {
    for (let i = 0; i < (perSeries || 1); i++) {
      const t = (now || Date.now()) + i;
      const v = 50 + 40 * Math.sin((t/1000) + (key === 'A' ? 0 : key === 'B' ? 1 : 2)) + (Math.random() - .5) * 8;
      out.push({ t, v, key });
    }
  }
  postMessage(out);
};
