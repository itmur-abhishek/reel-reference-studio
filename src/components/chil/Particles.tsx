import { useEffect, useRef } from "react";

type P = { x: number; y: number; r: number; vx: number; vy: number; life: number; burst: boolean };

/** Lightweight canvas: drifting frost + a coloured fizz burst on every flavour change. */
export function Particles({ burstKey, dir, color }: { burstKey: number; dir: number; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const parts = useRef<P[]>([]);
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, visible = true;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const resize = () => {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(W / 18, 70));
      parts.current = parts.current.filter((p) => p.burst).concat(
        Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.4, vx: 0, vy: Math.random() * 0.4 + 0.15, life: 1, burst: false })),
      );
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => e && { visible = e.isIntersecting; if (visible && !raf) loop(); });
    io.observe(cv);
    function loop() {
      raf = 0;
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      const arr = parts.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i]!;
        if (p.burst) { p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97; p.life -= 0.012; if (p.life <= 0) { arr.splice(i, 1); continue; } ctx.globalAlpha = p.life; ctx.fillStyle = colorRef.current; }
        else { p.y += p.vy; p.x += Math.sin(p.y / 50) * 0.25; if (p.y > H) { p.y = -4; p.x = Math.random() * W; } ctx.globalAlpha = 0.5; ctx.fillStyle = "rgba(255,255,255,1)"; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(loop);
    }
    loop();
    (cv as any).__burst = (d: number) => {
      if (reduce) return;
      for (let n = 0; n < 80; n++) parts.current.push({ x: d > 0 ? -10 : W + 10, y: H * (0.25 + Math.random() * 0.5), vx: d * (Math.random() * 14 + 5), vy: (Math.random() - 0.5) * 3, r: Math.random() * 2.4 + 0.8, life: 1, burst: true });
      if (!raf) loop();
    };
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  useEffect(() => { if (burstKey) (ref.current as any)?.__burst?.(dir); }, [burstKey, dir]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-20 h-full w-full" />;
}
