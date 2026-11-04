import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Snowflake, Sparkles, Droplets, Users, Instagram, Facebook, Youtube, Mail, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { FLAVORS } from "@/lib/flavors";

// TODO(client): replace with the real order inbox and social profiles.
export const ORDER_EMAIL = "orders@chilbypenguin.com";
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/", Icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/", Icon: Facebook },
  { label: "YouTube", href: "https://www.youtube.com/", Icon: Youtube },
];

function Reveal({ children, d = 0, className = "" }: { children: ReactNode; d?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ "--d": `${d}s` } as CSSProperties}>{children}</div>;
}

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-flavor-glow mb-4 text-xs font-bold uppercase tracking-[0.3em]">{children}</p>
);

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-5xl px-6 py-28 text-center sm:py-36">
      <Reveal><Eyebrow>Meet Chíl</Eyebrow></Reveal>
      <Reveal d={0.1}>
        <h2 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
          A sparkling beverage from <span className="text-flavor-glow">Penguin</span>, made for the coldest sip of your day.
        </h2>
      </Reveal>
      <Reveal d={0.2}>
        <p className="mx-auto mt-6 max-w-xl text-mute">Five bright flavours, fine bubbles and a crisp finish. Pick your mood, chill the can, crack it open.</p>
      </Reveal>
    </section>
  );
}

export function FlavourGrid({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <section id="flavours" className="mx-auto max-w-7xl px-6 pb-28">
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div><Eyebrow>The line-up</Eyebrow><h2 className="font-display text-3xl font-bold sm:text-4xl">Five flavours</h2></div>
        <p className="max-w-xs text-sm text-mute">Tap a can to bring it into the spotlight.</p>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {FLAVORS.map((f, k) => (
          <Reveal key={f.id} d={k * 0.07}>
            <button
              onClick={() => { onPick(k); document.getElementById("top")?.scrollIntoView({ behavior: "smooth" }); }}
              aria-label={`Show ${f.name}`}
              style={{ "--c": f.color } as CSSProperties}
              className={`group relative flex w-full flex-col items-center overflow-hidden rounded-3xl border bg-card px-4 pb-6 pt-10 transition-all duration-500 hover:-translate-y-1 ${k === active ? "border-flavor" : "border-border"}`}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-2/3 opacity-40 transition-opacity duration-500 group-hover:opacity-80" style={{ background: "radial-gradient(ellipse at 50% 60%, var(--c), transparent 70%)" }} />
              <img src={f.fruit} alt="" loading="lazy" className="absolute right-3 top-3 w-12 transition-transform duration-700 group-hover:rotate-45 group-hover:scale-125" />
              <img src={f.can} alt={`${f.name} can`} loading="lazy" width={240} height={474} className="can-mask relative h-48 w-auto transition-transform duration-500 group-hover:scale-105 sm:h-56" />
              <span className="relative mt-4 font-display text-sm font-bold">{f.name}</span>
              <span className="relative mt-1 text-xs text-mute">{f.tagline}</span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ProductDetails({ index }: { index: number }) {
  const f = FLAVORS[index];
  return (
    <section className="relative overflow-hidden border-y border-border py-28">
      <div aria-hidden className="absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--flavor)" }} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <Reveal className="flex justify-center">
          <div className="relative">
            <img key={f.id} src={f.fruit} alt="" loading="lazy" className="spin-slow absolute -left-10 top-6 w-24 opacity-90" />
            <img key={f.can} src={f.can} alt={`Chíl ${f.name} can`} loading="lazy" width={240} height={474} className="can-mask can-bob relative h-[420px] w-auto drop-shadow-[0_40px_50px_oklch(0_0_0/0.6)]" />
          </div>
        </Reveal>
        <Reveal d={0.15}>
          <Eyebrow>Product details</Eyebrow>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Chíl {f.name}</h2>
          <p className="mt-5 text-lg text-ink/85">{f.description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {[["Type", "Sparkling beverage"], ["Format", "Can"], ["Flavour", f.name], ["Serve", "Very cold"]].map(([k, v]) => (
              <div key={k} className="glass rounded-2xl p-4"><dt className="text-xs uppercase tracking-widest text-mute">{k}</dt><dd className="mt-1 font-display font-bold">{v}</dd></div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export function WhyChil() {
  const items = [
    { Icon: Snowflake, t: "Built for ice cold", d: "Every flavour is tuned to taste best straight from the fridge." },
    { Icon: Sparkles, t: "Fine, lively bubbles", d: "A light sparkle that lifts the fruit instead of drowning it." },
    { Icon: Droplets, t: "Five bright flavours", d: "Berry, citrus, tropical and orchard — there’s a can for every mood." },
    { Icon: Users, t: "Made to be shared", d: "Grab a mixed pack and let everyone pick their favourite." },
  ];
  return (
    <section id="why" className="mx-auto max-w-7xl px-6 py-28">
      <Reveal className="mb-12 text-center"><Eyebrow>Why Chíl</Eyebrow><h2 className="font-display text-3xl font-bold sm:text-4xl">Small can. Big chill.</h2></Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, t, d }, k) => (
          <Reveal key={t} d={k * 0.08}>
            <div className="glass h-full rounded-3xl p-7 transition-colors duration-500 hover:border-flavor">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-flavor text-night"><Icon size={22} /></span>
              <h3 className="mt-6 font-display text-base font-bold">{t}</h3>
              <p className="mt-2 text-sm text-mute">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const field = "w-full rounded-xl border border-input bg-muted px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-flavor";

export function Order({ index, onPick }: { index: number; onPick: (i: number) => void }) {
  const [qty, setQty] = useState(6);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") || "").trim();
    const contact = String(d.get("contact") || "").trim();
    if (!name || !contact) { toast.error("Please add your name and a phone or email."); return; }
    const body = `Hi Chíl team,\n\nI'd like to order:\n${qty} x Chíl ${FLAVORS[index].name}\n\nName: ${name}\nContact: ${contact}\nNotes: ${d.get("notes") || "-"}`;
    window.location.href = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(`Order: ${qty} x ${FLAVORS[index].name}`)}&body=${encodeURIComponent(body)}`;
    toast.success("Opening your email app with the order ready to send.");
  };
  return (
    <section id="order" className="relative overflow-hidden py-28">
      <div aria-hidden className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(ellipse 50% 60% at 80% 50%, var(--flavor), transparent 70%)" }} />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <Eyebrow>Order</Eyebrow>
          <h2 className="font-display text-3xl font-bold sm:text-5xl">Get Chíl delivered.</h2>
          <p className="mt-5 max-w-sm text-mute">Choose your flavour and quantity. We’ll get back to you to confirm availability and delivery.</p>
          <img key={FLAVORS[index].can} src={FLAVORS[index].can} alt={`Chíl ${FLAVORS[index].name} can`} loading="lazy" width={240} height={474} className="can-mask anim-copy-in mt-10 hidden h-64 w-auto md:block" />
        </Reveal>
        <Reveal d={0.1}>
          <form onSubmit={submit} className="glass grid gap-5 rounded-3xl p-6 sm:p-8">
            <fieldset>
              <legend className="mb-3 text-xs uppercase tracking-widest text-mute">Flavour</legend>
              <div className="flex flex-wrap gap-2">
                {FLAVORS.map((f, k) => (
                  <button type="button" key={f.id} onClick={() => onPick(k)} aria-pressed={k === index}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${k === index ? "border-flavor bg-flavor text-night" : "border-border text-ink hover:border-flavor"}`}>{f.name}</button>
                ))}
              </div>
            </fieldset>
            <div>
              <span className="mb-3 block text-xs uppercase tracking-widest text-mute">Cans</span>
              <div className="flex items-center gap-3">
                <button type="button" aria-label="Fewer cans" onClick={() => setQty(Math.max(1, qty - 1))} className="pill grid h-11 w-11 place-items-center text-lg">−</button>
                <output aria-live="polite" className="w-12 text-center font-display text-xl font-bold">{qty}</output>
                <button type="button" aria-label="More cans" onClick={() => setQty(Math.min(240, qty + 1))} className="pill grid h-11 w-11 place-items-center text-lg">+</button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs uppercase tracking-widest text-mute">Name<input name="name" required maxLength={80} className={field} /></label>
              <label className="grid gap-2 text-xs uppercase tracking-widest text-mute">Phone or email<input name="contact" required maxLength={120} className={field} /></label>
            </div>
            <label className="grid gap-2 text-xs uppercase tracking-widest text-mute">Notes<textarea name="notes" rows={3} maxLength={500} className={field} /></label>
            <button type="submit" className="btn-flavor py-4 text-sm">Send order — {qty} × {FLAVORS[index].name}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24 text-center">
      <Reveal><Eyebrow>Say hello</Eyebrow><h2 className="font-display text-3xl font-bold sm:text-4xl">Stay chilled with us.</h2></Reveal>
      <Reveal d={0.1} className="mt-10 flex flex-wrap justify-center gap-3">
        <a href={`mailto:${ORDER_EMAIL}`} className="pill inline-flex items-center gap-2 px-5 py-3 text-sm"><Mail size={16} /> {ORDER_EMAIL}</a>
        {SOCIALS.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" className="pill inline-flex items-center gap-2 px-5 py-3 text-sm"><Icon size={16} /> {label}</a>
        ))}
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border px-6 pb-10 pt-16">
      <div aria-hidden className="ghost-text font-display pointer-events-none select-none text-center text-[22vw] font-black leading-none">CHÍL</div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-wrap items-center justify-between gap-6 text-sm text-mute">
        <span className="font-display text-ink">Chíl <span className="font-sans text-xs text-mute">by Penguin</span></span>
        <nav className="flex flex-wrap gap-5" aria-label="Footer">
          {[["About", "#about"], ["Flavours", "#flavours"], ["Why Chíl", "#why"], ["Order", "#order"], ["Contact", "#contact"]].map(([l, h]) => <a key={h} href={h} className="hover:text-ink">{l}</a>)}
        </nav>
        <span>© {new Date().getFullYear()} Chíl by Penguin</span>
        <a href="#top" aria-label="Back to top" className="pill grid h-10 w-10 place-items-center"><ArrowUp size={16} /></a>
      </div>
    </footer>
  );
}
