"use client";

import { useState } from "react";
import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sliders } from "lucide-react";

export function BGRemoverSection({ theme }: { theme?: "dark" | "light" }) {
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleDrag = (e: any, info: any) => {
        // Simplified drag handling logic for demo purposes
        // In production, use a more robust slider component
    };

    return (
        <Section id="bg-remover" className="relative overflow-hidden" theme={theme}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-emerald/20 bg-brand-emerald/5">
                        <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                        <span className="text-sm text-brand-emerald font-medium">One-Click Magic</span>
                    </div>
                    <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl">
                        Remove Backgrounds <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand-cyan">
                            Instantly
                        </span>
                    </h2>
                    <p className="text-lg opacity-60 leading-relaxed max-w-lg">
                        Upload any image and let our AI handle the rest. Perfect for e-commerce, profiles, and design projects.
                        Clean edges, hair details preserved.
                    </p>
                    <button className="px-8 py-4 bg-brand-emerald text-black rounded-full text-lg font-semibold hover:bg-brand-emerald/90 transition-all hover:scale-105 shadow-[0_0_20px_-5px_#10B981]">
                        Try it Free
                    </button>
                </div>

                <div className="flex-1 relative">
                    {/* Placeholder for Interactive Comparison - using static image for now with overlay */}
                    <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass-card border-2 border-brand-emerald/20 shadow-2xl shadow-brand-emerald/10 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/10 to-transparent pointer-events-none" />

                        {/* Mockup UI */}
                        <div className="absolute inset-4 bg-[#1a1a1f] rounded-2xl overflow-hidden flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-24 h-24 mx-auto bg-brand-emerald/20 rounded-full flex items-center justify-center">
                                    <Sliders size={40} className="text-brand-emerald" />
                                </div>
                                <p className="text-white/40 font-mono text-sm">Drag to compare</p>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur rounded-lg text-xs text-white/60">Original</div>
                            <div className="absolute top-4 left-4 px-3 py-1 bg-brand-emerald/20 backdrop-blur rounded-lg text-xs text-brand-emerald border border-brand-emerald/20">Removed</div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
