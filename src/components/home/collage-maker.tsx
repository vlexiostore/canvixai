"use client";

import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { Layout, Grid, Layers } from "lucide-react";

export function CollageMakerSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="collage-maker" className="bg-transparent" theme={theme}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                <div className="flex-1 space-y-4 md:space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 bg-blue-500/5">
                        <Layout size={16} className="text-blue-500" />
                        <span className="text-sm text-blue-500 font-medium">Collage Maker</span>
                    </div>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        Tell a story with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                            Every Pixel
                        </span>
                    </h2>
                    <p className="text-base md:text-lg opacity-60 leading-relaxed max-w-lg">
                        Combine your favorite moments into stunning photo collages. Choose from hundreds of artistic layouts and customize them to fit your style perfectly.
                    </p>

                    <ul className="space-y-3 pt-4">
                        {[
                            "Hundreds of customizable layouts",
                            "Drag & drop simplicity",
                            "Smart auto-arrange layouts"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Grid size={14} className="text-blue-500" />
                                </div>
                                <span className="text-lg opacity-80">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Abstract Collage UI Representation */}
                        <div className="aspect-square rounded-3xl bg-gray-100 overflow-hidden relative shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
                            <div className="absolute inset-2 grid grid-cols-2 gap-2">
                                <div className="bg-gray-200 rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop)' }}></div>
                                <div className="grid grid-rows-2 gap-2">
                                    <div className="bg-gray-200 rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop)' }}></div>
                                    <div className="bg-gray-200 rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop)' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 bg-white p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-2 md:gap-3 animate-bounce-slow">
                            <Layers className="text-blue-500" />
                            <span className="font-bold text-black">Smart Layouts</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}
