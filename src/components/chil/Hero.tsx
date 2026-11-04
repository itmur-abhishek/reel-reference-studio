import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import rocks from "@/assets/rocks.jpg";
import { FLAVORS, FRUIT_SLOTS, direction, wrap } from "@/lib/flavors";
import { Particles } from "./Particles";

const AUTO_MS = 6500;
const OUT_MS = 480;

export function Hero({ index, onChange, onOrder }: { index: number; onChange: (i: number) => void; onOrder: (i: number) => void }) {
  const [shown, setShown] = useState(index); // flavour currently drawn
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [dir, setDir] = useState(1);
  const [burst, setBurst] = useState(0);
  const [paused, setPaused] = useState(false);
  const [menu, setMenu] = useState(false);
  const busy = useRef(false);
  const tilt = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const f = FLAVORS[shown]!;

  const goTo = useCallback((to: number) => {
    to = wrap(to);
    if (busy.current || to === shown) return;
    busy.current = true;
    setDir(direction(shown, to));
    setPhase("out");
    setTimeout(() => {
      setShown(to); onChange(to); setPhase("in"); setBurst((b) => b + 1);
      setTimeout(() => (busy.current = false), 700);
    }, OUT_MS);
  }, [shown, onChange]);

  // external selection (e.g. from the flavours grid)
  useEffect(() => { if (index !== shown && !busy.current) goTo(index); }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  // autoplay, paused on hover/touch/focus
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => goTo(shown + 1), AUTO_MS);
    return () => clearTimeout(t);
  }, [shown, paused, goTo]);

  // keyboard
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,textarea,select")) return;
      if (e.key === "ArrowRight") goTo(shown + 1);
      if (e.key === "ArrowLeft") goTo(shown - 1);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [shown, goTo]);

  // swipe
  const sx = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { sx.current = e.touches[0]!.clientX; setPaused(true); };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (sx.current !== null) { const dx = e.changedTouches[0]!.clientX - sx.current; if (Math.abs(dx) > 50) goTo(shown + (dx < 0 ? 1 : -1)); }
    sx.current = null; setTimeout(() => setPaused(false), 4000);
  };

  // pointer parallax (written straight to CSS vars, no re-render)
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    stage.current.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    stage.current.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  // flavour colour drives the whole page
  useEffect(() => { document.documentElement.style.setProperty("--flavor", f.color); }, [f.color]);

  const o = phase === "out";
  const nav = [["About", "#about"], ["Flavours", "#flavours"], ["Why Chíl", "#why"], ["Order", "#order"], ["Contact", "#contact"]];

  return (
    <section
      id="top" ref={stage} aria-roledescription="carousel" aria-label="Chíl flavours"
      className="hero-glow relative isolate h-[100svh] min-h-[620px] w-full overflow-hidden"
      style={{ "--dir": dir, "--mx": 0, "--my": 0 } as CSSProperties}
      onPointerMove={onMove} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
    >
      {/* colour wash sweeping across on change */}
      <div key={`w${burst}`} aria-hidden className={`flavor-wash pointer-events-none absolute inset-0 z-0 opacity-0 ${burst ? "anim-wash" : ""}`} />

      {/* giant background word */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[40%] z-0 -translate-y-1/2 overflow-hidden">
        <div key={`g${shown}`} className={`ghost-text font-display whitespace-nowrap text-center text-[clamp(72px,17vw,280px)] font-black uppercase leading-none tracking-tighter ${o ? "anim-ghost-out" : "anim-ghost-in"}`}>
          {f.name}
        </div>
      </div>

      {/* far fruit (behind can) */}
      <Fruits shown={shown} out={o} layer="back" />

      {/* can */}
      <div className="absolute bottom-[19%] left-1/2 z-10 -translate-x-1/2 sm:bottom-[16%]">
        <div aria-hidden className="can-shadow absolute -bottom-6 left-1/2 h-10 w-[140%] -translate-x-1/2" />
        <div key={`c${shown}`} className={o ? "anim-can-out" : "anim-can-in"}>
          <div className="can-bob">
            <div ref={tilt} className="relative transition-transform duration-300 ease-out"
              style={{ transform: "perspective(900px) rotateY(calc(var(--mx) * 22deg)) rotateX(calc(var(--my) * -10deg))" }}>
              <img src={f.can} alt={`Chíl by Penguin ${f.name} sparkling beverage can`} width={240} height={474}
                className="can-mask block h-[min(50svh,460px)] w-auto drop-shadow-[0_40px_60px_oklch(0_0_0/0.6)]" />
              <div aria-hidden className="can-shine can-mask pointer-events-none absolute inset-0" />
            </div>
          </div>
        </div>
      </div>

      {/* near fruit (in front) */}
      <Fruits shown={shown} out={o} layer="front" />

      {/* rocky ground */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[42%]">
        <div key={`r${burst}`} className={`absolute -inset-x-[4%] inset-y-0 ${burst ? "anim-rocks" : ""}`}
          style={{ transform: "translateX(calc(var(--mx) * -14px))" }}>
          <img src={rocks} alt="" width={1920} height={768} className="hero-rocks h-full w-full object-cover object-bottom" />
          <div className="hero-rocks-tint absolute inset-0" />
        </div>
      </div>
      <div aria-hidden className="hero-vignette pointer-events-none absolute inset-0 z-[16]" />

      <Particles burstKey={burst} dir={dir} color={f.color} />

      {/* header */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 sm:px-10">
        <a href="#top" className="font-display text-xl font-black leading-none tracking-tight text-ink">
          Chíl<span className="mt-1 block font-sans text-[11px] font-medium tracking-wide text-mute">by Penguin</span>
        </a>
        <nav className="hidden gap-2 md:flex" aria-label="Main">
          {nav.map(([l, h]) => <a key={h} href={h} className="pill px-4 py-2 text-xs font-medium uppercase tracking-widest">{l}</a>)}
        </nav>
        <button className="pill grid h-11 w-11 place-items-center md:hidden" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} onClick={() => setMenu(!menu)}>
          {menu ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>
      {menu && (
        <nav aria-label="Mobile" className="glass absolute inset-x-4 top-20 z-40 grid gap-1 rounded-2xl p-3 md:hidden">
          {nav.map(([l, h]) => <a key={h} href={h} onClick={() => setMenu(false)} className="rounded-xl px-4 py-3 font-display text-sm hover:bg-flavor hover:text-night">{l}</a>)}
        </nav>
      )}

      {/* left copy */}
      <div className="absolute left-5 right-5 top-[13%] z-30 text-center sm:left-10 sm:right-auto sm:top-[36%] sm:max-w-[240px] sm:text-left">
        <div key={`t${shown}`} className={o ? "anim-copy-out" : "anim-copy-in"}>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.25em] text-mute">Sparkling beverage</p>
          <h1 className="font-display text-lg font-bold leading-tight sm:text-xl">{f.tagline}</h1>
          <button onClick={() => onOrder(shown)} className="btn-flavor mt-5 px-6 py-3 text-sm">Order {f.name}</button>
        </div>
      </div>

      {/* right copy */}
      <div className="absolute bottom-[23%] left-6 right-6 z-30 text-center sm:bottom-auto sm:left-auto sm:right-10 sm:top-[38%] sm:max-w-[260px] sm:text-right">
        <div key={`d${shown}`} className={o ? "anim-copy-out" : "anim-copy-in"} style={{ "--d": ".5s" } as CSSProperties}>
          <p className="text-flavor-glow mb-2 text-xs font-bold uppercase tracking-[0.2em]">{f.name}</p>
          <p className="text-sm leading-relaxed text-ink/85">{f.description}</p>
        </div>
      </div>

      {/* side arrows */}
      <button onClick={() => goTo(shown - 1)} aria-label="Previous flavour" className="pill absolute left-3 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 place-items-center sm:grid"><ChevronLeft size={20} /></button>
      <button onClick={() => goTo(shown + 1)} aria-label="Next flavour" className="pill absolute right-3 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 place-items-center sm:grid"><ChevronRight size={20} /></button>

      {/* flavour list */}
      <div role="group" aria-label="Choose flavour" className="absolute bottom-8 left-10 z-30 hidden gap-1 sm:grid">
        {FLAVORS.map((fl, k) => (
          <button key={fl.id} onClick={() => goTo(k)} aria-current={k === shown}
            className={`flex items-center gap-3 py-0.5 text-left text-xs uppercase tracking-widest transition-colors ${k === shown ? "font-bold text-ink" : "text-mute hover:text-ink"}`}>
            <span className={`h-px transition-all duration-500 ${k === shown ? "w-8 bg-flavor" : "w-3 bg-mute"}`} />{fl.name}
          </button>
        ))}
      </div>

      {/* mobile controls + counter */}
      <div className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-center gap-4 sm:inset-x-auto sm:right-10 sm:bottom-8">
        <button onClick={() => goTo(shown - 1)} aria-label="Previous flavour" className="pill grid h-11 w-11 place-items-center sm:hidden"><ChevronLeft size={18} /></button>
        <span className="font-display text-xs tabular-nums text-mute"><span className="text-ink">{String(shown + 1).padStart(2, "0")}</span> / {String(FLAVORS.length).padStart(2, "0")}</span>
        <button onClick={() => goTo(shown + 1)} aria-label="Next flavour" className="pill grid h-11 w-11 place-items-center sm:hidden"><ChevronRight size={18} /></button>
      </div>
    </section>
  );
}

function Fruits({ shown, out, layer }: { shown: number; out: boolean; layer: "front" | "back" }) {
  const f = FLAVORS[shown]!;
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${layer === "front" ? "z-[17]" : "z-[5]"}`}>
      {FRUIT_SLOTS.map((s, j) => {
        const front = s.z >= 0.75;
        if ((layer === "front") !== front) return null;
        const px = (1 - s.z) * 8 + s.z * 40; // nearer fruit moves more
        return (
          <div key={`${shown}-${j}`} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.s}vmin`, transform: `translate(-50%,-50%) translate(calc(var(--mx) * ${px}px), calc(var(--my) * ${px}px))` }}>
            <div className={out ? "anim-fruit-out" : "anim-fruit-in"} style={{ "--d": `${0.12 + j * 0.06}s`, "--blur": `${s.z < 0.3 ? 2 : 0}px` } as CSSProperties}>
              <div className="float" style={{ "--t": `${5 + j}s`, "--fd": `${-j}s` } as CSSProperties}>
                <img src={f.fruit} alt="" loading="eager" decoding="async" className="w-full drop-shadow-[0_18px_22px_oklch(0_0_0/0.55)]"
                  style={{ transform: `rotate(${s.r}deg)`, opacity: s.z < 0.3 ? 0.75 : 1 }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
