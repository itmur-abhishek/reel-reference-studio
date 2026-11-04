import canBlueberry from "@/assets/can-blueberry.png.asset.json";
import canLime from "@/assets/can-lime.png.asset.json";
import canMango from "@/assets/can-mango.png.asset.json";
import canApple from "@/assets/can-apple.png.asset.json";
import canOrange from "@/assets/can-orange.png.asset.json";
import fBlueberry from "@/assets/fruit-blueberry.png";
import fLime from "@/assets/fruit-lime.png";
import fMango from "@/assets/fruit-mango.png";
import fApple from "@/assets/fruit-apple.png";
import fOrange from "@/assets/fruit-orange.png";

export type Flavor = {
  id: string;
  name: string;
  /** flavour accent colour (oklch) used for light, glow and UI */
  color: string;
  tagline: string;
  description: string;
  can: string;
  fruit: string;
};

// Copy kept exactly from the client's original site.
export const FLAVORS: Flavor[] = [
  { id: "blueberry", name: "Blueberry", color: "oklch(0.6 0.22 290)", tagline: "Deep berry. Ice cold.", description: "Sparkling blueberry with a crisp, not-too-sweet finish. Best served very cold.", can: canBlueberry.url, fruit: fBlueberry },
  { id: "lime", name: "Lime & Mint", color: "oklch(0.8 0.2 150)", tagline: "Fresh lime. Cool mint.", description: "Zesty lime and cooling mint in a light sparkle that wakes you up in one sip.", can: canLime.url, fruit: fLime },
  { id: "mango", name: "Mango", color: "oklch(0.83 0.17 78)", tagline: "Sunny mango. Zero fuss.", description: "Ripe, juicy mango with fine bubbles. Tastes like summer, even in November.", can: canMango.url, fruit: fMango },
  { id: "apple", name: "Green Apple", color: "oklch(0.84 0.2 128)", tagline: "Crunchy, tart, bright.", description: "Green apple with a tart snap and a clean, sparkling finish. Crisp from first sip to last.", can: canApple.url, fruit: fApple },
  { id: "orange", name: "Orange", color: "oklch(0.74 0.19 52)", tagline: "Zesty orange. Big fizz.", description: "Bright orange peel and juicy citrus in a sparkling can that’s made to be shared.", can: canOrange.url, fruit: fOrange },
];

/** Floating fruit layout: left %, top %, size (vmin), depth 0 (far) .. 1 (near), rotation */
export const FRUIT_SLOTS = [
  { x: 33, y: 30, s: 9, z: 0.8, r: -20 },
  { x: 64, y: 24, s: 7, z: 0.5, r: 30 },
  { x: 37, y: 62, s: 8, z: 0.9, r: 60 },
  { x: 62, y: 56, s: 12, z: 1, r: -40 },
  { x: 55, y: 14, s: 4, z: 0.2, r: 10 },
  { x: 42, y: 16, s: 3.5, z: 0.15, r: 90 },
  { x: 70, y: 70, s: 4.5, z: 0.3, r: -70 },
];

export const wrap = (i: number, n = FLAVORS.length) => ((i % n) + n) % n;
/** shortest direction from a to b on the carousel: 1 forward, -1 back */
export const direction = (from: number, to: number, n = FLAVORS.length) =>
  wrap(to - from, n) <= n / 2 ? 1 : -1;
