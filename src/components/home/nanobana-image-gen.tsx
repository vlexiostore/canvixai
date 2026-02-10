"use client";

import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { Sparkles, Wand2, Zap } from "lucide-react";

export function NanobanaImageGenSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="nanobana-image-gen" className="bg-transparent" theme={theme}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-orange/20 bg-brand-orange/5">
                        <Zap size={16} className="text-brand-orange" />
                        <span className="text-sm text-brand-orange font-medium">Nanobana Image Gen</span>
                    </div>
                    <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl">
                        Unleash Creativity with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-pink">
                            Nanobana AI
                        </span>
                    </h2>
                    <p className="text-lg opacity-60 leading-relaxed max-w-lg">
                        Experience the next evolution of image generation. Nanobana's advanced algorithms create stunning, high-fidelity visuals from your wildest ideas in seconds.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <button className="px-8 py-3 rounded-full bg-black text-white font-medium hover:scale-105 transition-transform">
                            Try Nanobana
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <div className="relative z-10 grid grid-cols-2 gap-4">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm font-medium">Cyberpunk Street</p>
                                </div>
                                {/* Placeholder for Nanobana Image 1 */}
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop)' }}></div>
                            </div>
                            <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm font-medium">Abstract Art</p>
                                </div>
                                {/* Placeholder for Nanobana Image 2 */}
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop)' }}></div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-4 pt-8"
                        >
                            <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm font-medium">3D Character</p>
                                </div>
                                {/* Placeholder for Nanobana Image 3 */}
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1633511094396-f94e19ed7772?q=80&w=1976&auto=format&fit=crop)' }}></div>
                            </div>
                            <div className="aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm font-medium">Digital Landscape</p>
                                </div>
                                {/* Placeholder for Nanobana Image 4 */}
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2064&auto=format&fit=crop)' }}></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
