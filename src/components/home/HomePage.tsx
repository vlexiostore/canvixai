"use client";

import { Section } from "@/components/ui/section";
import { NanobanaImageGenSection } from "@/components/home/nanobana-image-gen";
import { CollageMakerSection } from "@/components/home/collage-maker";
import { FileConverterSection } from "@/components/home/file-converter";
import { ProductEditorSection } from "@/components/home/product-editor";
import { MockupMakerSection } from "@/components/home/mockup-maker";
import { RealisticGenSection } from "@/components/home/realistic-gen";
import { TeamSection } from "@/components/home/team";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Only load Ballpit on desktop (heavy Three.js component)
const Ballpit = dynamic(() => import("@/components/Ballpit"), { ssr: false });

export default function HomePage() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden bg-[#0A0A0B] text-white min-h-[100dvh] flex items-center justify-center px-5 sm:px-6">
        {/* Desktop: Ballpit, Mobile: gradient bg */}
        {isDesktop ? (
          <div className="absolute inset-0 z-0">
            <Ballpit
              count={100}
              gravity={0.5}
              friction={0.9975}
              wallBounce={0.95}
              followCursor
              colors={["#000000", "#000000", "#ffffff"]}
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[200px] h-[200px] bg-orange-500/8 rounded-full blur-[100px]" />
          </div>
        )}

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="text-center relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass mb-6 sm:mb-8 border border-white/10 hover:border-brand-orange/50 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-xs sm:text-sm text-white/70">Canvix 2.0 is here</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-[2.75rem] sm:text-6xl md:text-7xl lg:text-9xl tracking-tight leading-[0.9] mb-5 sm:mb-8">
              <span className="block">Create instant</span>
              <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
                masterpieces
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
              The all-in-one AI creative suite. BG removal, Image Gen, Video, and Editing.
              <span className="text-white"> No credit card required.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-20">
              <Link
                href="/signup"
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-black text-white border border-white/20 rounded-full text-lg sm:text-xl font-bold overflow-hidden transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-lg hover:shadow-white/20 text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Creating Free <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </Link>
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-medium glass hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10 text-white">
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="bg-white">
        <NanobanaImageGenSection theme="light" />
      </div>

      <div className="bg-[#0A0A0B]">
        <CollageMakerSection theme="dark" />
      </div>

      <div className="bg-white">
        <FileConverterSection theme="light" />
      </div>

      <div className="bg-[#0A0A0B]">
        <ProductEditorSection theme="dark" />
      </div>

      <div className="bg-white">
        <MockupMakerSection theme="light" />
      </div>

      <div className="bg-[#0A0A0B]">
        <RealisticGenSection theme="dark" />
      </div>

      <div className="bg-[#0A0A0B]">
        <TeamSection theme="dark" />
      </div>

      {/* CTA Bottom */}
      <Section className="py-16 sm:py-32 bg-white text-black" theme="light">
        <div className="max-w-4xl mx-auto text-center px-5">
          <div className="bg-black text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 relative overflow-hidden border border-black/5 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-violet/20 to-transparent pointer-events-none" />
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">Ready to start?</h2>
            <p className="text-white/60 text-base sm:text-xl mb-6 sm:mb-10">Join 2M+ creators today.</p>
            <Link href="/signup" className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-white text-black rounded-full font-bold text-base sm:text-xl hover:bg-gray-200 transition-colors hover:scale-105 shadow-lg">
              Get Started Now
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
