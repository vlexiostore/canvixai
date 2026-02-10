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
import Ballpit from "@/components/Ballpit";

export default function HomePage() {
  return (
    <>
      {/* Hero Section - BLACK */}
      <section className="relative z-10 overflow-hidden bg-[#0A0A0B] text-white h-screen min-h-[800px] flex items-center justify-center">
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

        <div className="max-w-7xl mx-auto relative z-10 px-6 lg:px-12 w-full">
          <div className="text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-white/10 hover:border-brand-orange/50 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-sm text-white/70">Canvix 2.0 is here</span>
            </div>

            <h1 className="font-display font-extrabold text-6xl sm:text-7xl lg:text-9xl tracking-tight leading-[0.9] mb-8">
              <span className="block">Create instant</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
                masterpieces
              </span>
            </h1>

            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
              The all-in-one AI creative suite. BG removal, Image Gen, Video, and Editing.
              <span className="text-white"> No credit card required.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Link href="/signup" className="group relative px-10 py-5 bg-black text-white border border-white/20 rounded-full text-xl font-bold overflow-hidden transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-lg hover:shadow-white/20">
                <span className="relative z-10 flex items-center gap-2">
                  Start Creating Free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <button className="px-10 py-5 rounded-full text-lg font-medium glass hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10 text-white">
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

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

      <Section className="py-32 bg-white text-black" theme="light">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-black text-white rounded-[3rem] p-12 sm:p-20 relative overflow-hidden border border-black/5 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-violet/20 to-transparent pointer-events-none" />
            <h2 className="font-display font-bold text-5xl mb-6">Ready to start?</h2>
            <p className="text-white/60 text-xl mb-10">Join 2M+ creators today.</p>
            <Link href="/signup" className="inline-block px-12 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-200 transition-colors hover:scale-105 shadow-lg">
              Get Started Now
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
