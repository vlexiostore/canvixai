"use client";

import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { ShoppingBag, Eraser, Palette, Camera } from "lucide-react";

export function ProductEditorSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="product-editor" className="bg-transparent" theme={theme}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                <div className="flex-1 space-y-4 md:space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20 bg-purple-500/5">
                        <ShoppingBag size={16} className="text-purple-500" />
                        <span className="text-sm text-purple-500 font-medium">E-commerce Ready</span>
                    </div>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        Pro Product Photos <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400">
                            Instantly
                        </span>
                    </h2>
                    <p className="text-base md:text-lg opacity-60 leading-relaxed max-w-lg">
                        Turn amateur snapshots into professional product photography. Remove backgrounds, add realistic shadows, and generate contextual backgrounds that sell.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                <Eraser size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Magic Erase</h4>
                                <p className="text-xs opacity-60">Clean up defects instantly</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                <Camera size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">AI Backgrounds</h4>
                                <p className="text-xs opacity-60">Generate studio settings</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Interactive Comparison UI */}
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden relative shadow-2xl border border-current/10">
                            {/* Before Image */}
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400 text-sm absolute top-4 left-4">Original</span>
                                {/* Placeholder for Product Original */}
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop)' }}></div>
                            </div>

                            {/* After Image (Clipped) */}
                            <motion.div
                                initial={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }}
                                animate={{ clipPath: ["polygon(0% 0, 100% 0, 100% 100%, 0% 100%)", "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)", "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                className="absolute inset-0 bg-white"
                            >
                                <span className="text-purple-600 font-bold text-sm absolute top-4 right-4 z-10">Enhanced</span>
                                {/* Placeholder for Product Enhanced */}
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop)', filter: 'contrast(1.2) saturate(1.2)' }}>
                                    {/* Overlay for fake background change effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-blue-100/50 mix-blend-overlay"></div>
                                </div>
                            </motion.div>

                            {/* Slider Handle (Visual only) */}
                            <motion.div
                                animate={{ left: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.2)] z-20 flex items-center justify-center cursor-ew-resize"
                            >
                                <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                                    <div className="w-1 h-4 bg-gray-300 rounded-full mx-[1px]" />
                                    <div className="w-1 h-4 bg-gray-300 rounded-full mx-[1px]" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}
