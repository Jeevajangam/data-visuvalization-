export class FpsCounter {
  private last = performance.now();
  private frames = 0;
  fps = 0;
  frameTimeMs = 0;

  tick() {
    const now = performance.now();
    this.frames++;
    const dt = now - this.last;
    this.frameTimeMs = dt;
    if (dt >= 1000) {
      this.fps = Math.round((this.frames * 1000) / dt);
      this.frames = 0;
      this.last = now;
    }
  }
}

export function estimateMemoryMB(): number | undefined {
  // Not supported everywhere
  // @ts-ignore
  if (performance && performance.memory) {
    // @ts-ignore
    const used = performance.memory.usedJSHeapSize as number;
    return +(used / (1024*1024)).toFixed(1);
  }
  return undefined;
}
