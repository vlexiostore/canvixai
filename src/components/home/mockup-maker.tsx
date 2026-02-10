"use client";

import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { Box, Smartphone, Monitor, Shirt } from "lucide-react";

export function MockupMakerSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="mockup-maker" className="bg-transparent" theme={theme}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1 space-y-4 md:space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/20 bg-amber-500/5">
                        <Box size={16} className="text-amber-500" />
                        <span className="text-sm text-amber-500 font-medium">Mockup Generator</span>
                    </div>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        Showcase your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400">
                            Designs Realistically
                        </span>
                    </h2>
                    <p className="text-base md:text-lg opacity-60 leading-relaxed max-w-lg">
                        Present your designs on real-world products. High-resolution mockups for apparel, devices, print, and packaging in just a click.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-4">
                        {["iPhone", "MacBook", "T-Shirts", "Mugs", "Posters"].map((item) => (
                            <span key={item} className="px-3 py-1 bg-current/5 border border-current/10 rounded-full text-sm opacity-70">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="grid grid-cols-2 gap-6 relative">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="space-y-4 pt-12"
                        >
                            <div className="aspect-[3/4] rounded-2xl bg-white shadow-xl overflow-hidden relative p-4 flex items-center justify-center border border-gray-100">
                                <div className="absolute top-2 right-2 text-gray-300">
                                    <Smartphone size={24} />
                                </div>
                                <div className="w-[80%] h-[90%] bg-gray-900 rounded-3xl shadow-inner border-4 border-gray-800 overflow-hidden relative">
                                    {/* Screen Content */}
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop)' }}></div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="space-y-4"
                        >
                            <div className="aspect-square rounded-2xl bg-white shadow-xl overflow-hidden relative p-4 flex items-center justify-center border border-gray-100">
                                <div className="absolute top-2 right-2 text-gray-300">
                                    <Shirt size={24} />
                                </div>
                                {/* T-Shirt Mockup */}
                                <div className="w-full h-full relative">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-100" stroke="currentColor" strokeWidth="1">
                                        <path d="M20.38 3.4a1.64 1.64 0 0 0-1.8-1.11l-3.21.35a20.89 20.89 0 0 0-6.74 0l-3.21-.35a1.64 1.64 0 0 0-1.8 1.11L2 8.7a1.62 1.62 0 0 0 1 1.95l1.64-.4v8.15a2.16 2.16 0 0 0 2.16 2.16h10.4a2.16 2.16 0 0 0 2.16-2.16V10.25l1.64.4a1.62 1.62 0 0 0 1-1.95z" fill="#f3f4f6" stroke="none" />
                                    </svg>
                                    <div className="absolute top-[30%] left-[30%] right-[30%] bottom-[30%] flex items-center justify-center">
                                        <span className="font-display font-bold text-black text-xl bg-yellow-300 px-2 skew-y-[-5deg]">COOL DESIGN</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Badge */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="bg-white dark:bg-[#2A2A2B] shadow-2xl p-4 rounded-full border border-current/5 animate-pulse-slow">
                                <Box size={32} className="text-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
