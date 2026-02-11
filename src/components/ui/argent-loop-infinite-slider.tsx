"use client";
import * as React from "react";

interface ShowcaseItem {
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
}

const SHOWCASE_DATA: ShowcaseItem[] = [
  {
    title: "AI Portrait Studio",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    category: "Image Generation",
    year: "2026",
    description: "Photorealistic AI portraits",
  },
  {
    title: "Cinematic Frames",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
    category: "Video Generation",
    year: "2026",
    description: "AI-powered cinematography",
  },
  {
    title: "Style Transfer",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop",
    category: "Image Editing",
    year: "2026",
    description: "Transform any style instantly",
  },
  {
    title: "Motion Canvas",
    image: "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=1887&auto=format&fit=crop",
    category: "Image to Video",
    year: "2026",
    description: "Animate stills into video",
  },
  {
    title: "Generative Art",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1896&auto=format&fit=crop",
    category: "AI Creation",
    year: "2026",
    description: "Boundless creative expression",
  },
];

const ITEM_COUNT = SHOWCASE_DATA.length;

export function InfiniteShowcase() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const imagesRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const imgTagsRef = React.useRef<(HTMLImageElement | null)[]>([]);
  const infosRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const labelsRef = React.useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const raw = -rect.top / scrollable;
      const progress = Math.max(0, Math.min(1, raw));
      const activeFloat = progress * (ITEM_COUNT - 1);
      const activeIndex = Math.round(activeFloat);

      // Update images
      for (let i = 0; i < ITEM_COUNT; i++) {
        const el = imagesRef.current[i];
        const img = imgTagsRef.current[i];
        if (!el) continue;
        const dist = activeFloat - i;
        const opacity = Math.max(0, 1 - Math.min(Math.abs(dist), 1));
        const parallaxY = dist * -80;
        el.style.opacity = String(opacity);
        el.style.zIndex = opacity > 0.01 ? "1" : "0";
        if (img) img.style.transform = `translateY(${parallaxY}px) scale(1.15)`;
      }

      // Update info overlays
      for (let i = 0; i < ITEM_COUNT; i++) {
        const el = infosRef.current[i];
        if (!el) continue;
        const dist = activeFloat - i;
        const opacity = Math.max(0, 1 - Math.min(Math.abs(dist) * 2, 1));
        const translateY = dist * 40;
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${translateY}px)`;
      }

      // Update dots / labels
      for (let i = 0; i < ITEM_COUNT; i++) {
        const dot = dotsRef.current[i];
        const label = labelsRef.current[i];
        const isActive = i === activeIndex;
        if (dot) {
          dot.style.width = isActive ? "24px" : "6px";
          dot.style.background = isActive ? "white" : "rgba(255,255,255,0.2)";
        }
        if (label) {
          label.style.color = isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)";
          label.style.opacity = isActive ? "1" : "0.6";
        }
      }

      // Update hint
      if (hintRef.current) {
        hintRef.current.style.opacity = progress < 0.1 ? "1" : "0";
      }
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once immediately
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{ height: `${ITEM_COUNT * 100}vh` }}
      className="relative"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        {/* Images */}
        {SHOWCASE_DATA.map((item, i) => (
          <div
            key={i}
            ref={(el) => { imagesRef.current[i] = el; }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 }}
          >
            <img
              ref={(el) => { imgTagsRef.current[i] = el; }}
              src={item.image}
              alt={item.title}
              loading={i < 2 ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "translateY(0px) scale(1.15)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/50 to-black/80 pointer-events-none" />
          </div>
        ))}

        {/* Info overlays */}
        <div className="absolute inset-0 z-10 flex items-end justify-start pointer-events-none pb-20 pl-8 sm:pl-16 md:pl-24">
          {SHOWCASE_DATA.map((item, i) => (
            <div
              key={i}
              ref={(el) => { infosRef.current[i] = el; }}
              className="absolute"
              style={{ opacity: i === 0 ? 1 : 0, transform: "translateY(0px)" }}
            >
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-white/30 uppercase mb-2">
                {String(i + 1).padStart(2, "0")} / {String(ITEM_COUNT).padStart(2, "0")}
              </p>
              <h3 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white mb-2 tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-white/50 mb-1">{item.category}</p>
              <p className="text-xs sm:text-sm text-white/30">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end gap-5">
          {SHOWCASE_DATA.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                ref={(el) => { labelsRef.current[i] = el; }}
                className="text-[10px] sm:text-xs font-mono tracking-wider text-right whitespace-nowrap transition-colors duration-300"
                style={{
                  color: i === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)",
                  opacity: i === 0 ? 1 : 0.6,
                }}
              >
                {item.title}
              </span>
              <div
                ref={(el) => { dotsRef.current[i] = el; }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === 0 ? "24px" : "6px",
                  height: "6px",
                  background: i === 0 ? "white" : "rgba(255,255,255,0.2)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom hint */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-opacity duration-700 pointer-events-none"
        >
          <p className="font-mono text-[9px] tracking-[0.4em] text-white/35 uppercase">
            Scroll to explore
          </p>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
