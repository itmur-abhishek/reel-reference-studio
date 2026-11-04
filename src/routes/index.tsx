import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Hero } from "@/components/chil/Hero";
import { About, Contact, FlavourGrid, Footer, Order, ProductDetails, WhyChil } from "@/components/chil/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chíl by Penguin — Sparkling beverage in five flavours" },
      { name: "description", content: "Blueberry, Lime & Mint, Mango, Green Apple and Orange. Discover Chíl by Penguin sparkling beverages and order yours." },
      { property: "og:title", content: "Chíl by Penguin — Sparkling beverage" },
      { property: "og:description", content: "Five ice-cold sparkling flavours from Penguin. Pick yours and order online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [active, setActive] = useState(0);
  const order = (i: number) => { setActive(i); document.getElementById("order")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <main className="bg-background text-foreground">
      <Hero index={active} onChange={setActive} onOrder={order} />
      <About />
      <FlavourGrid active={active} onPick={setActive} />
      <ProductDetails index={active} />
      <WhyChil />
      <Order index={active} onPick={setActive} />
      <Contact />
      <Footer />
      <Toaster position="top-center" />
    </main>
  );
}
