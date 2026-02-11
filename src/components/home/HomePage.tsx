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
import dynamic from "next/dynamic";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

const InfiniteShowcase = dynamic(
  () => import("@/components/ui/argent-loop-infinite-slider").then((m) => ({ default: m.InfiniteShowcase })),
  { ssr: false }
);

const AnimatedMarqueeHero = dynamic(
  () => import("@/components/ui/hero-3").then((m) => ({ default: m.AnimatedMarqueeHero })),
  { ssr: false }
);

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop",
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <AnimatedMarqueeHero
        tagline=""
        preTitle={
          <GooeyText
            texts={["AI Images", "AI Videos", "BG Removal", "Editing", "Upscaling"]}
            morphTime={1}
            cooldownTime={0.25}
            className="h-[50px] sm:h-[65px] md:h-[85px] w-full mb-0"
            textClassName="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tighter text-white"
          />
        }
        title={
          <>
            Create Instant
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              Masterpieces
            </span>
          </>
        }
        description="The all-in-one AI creative suite. Image generation, video creation, background removal, and editing — no credit card required."
        ctaText="Start Creating Free"
        ctaHref="/signup"
        images={HERO_IMAGES}
      />

      {/* Showcase Slider */}
      <section className="relative z-10">
        <InfiniteShowcase />
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
