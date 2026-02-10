"use client";

import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";

export function ImageGenSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="image-gen" className="bg-transparent" theme={theme}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-orange/20 bg-brand-orange/5">
                        <Sparkles size={16} className="text-brand-orange" />
                        <span className="text-sm text-brand-orange font-medium">Text to Image</span>
                    </div>
                    <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl">
                        Dream it. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-pink">
                            Generate it.
                        </span>
                    </h2>
                    <p className="text-lg opacity-60 leading-relaxed max-w-lg">
                        Turn text prompts into high-fidelity images. From photorealistic portraits to stylized art,
                        Canvix understands your creative intent.
                    </p>

                    {/* Prompt Demo */}
                    <div className="glass p-4 rounded-2xl flex gap-3 items-center border border-current/10">
                        <span className="text-brand-pink/50 text-lg">/imagine</span>
                        <input
                            type="text"
                            readOnly
                            value="retro futuristic city with neon lights..."
                            className="bg-transparent border-none outline-none opacity-80 w-full font-mono text-sm text-current"
                        />
                        <button className="p-2 bg-gradient-to-r from-brand-orange to-brand-pink rounded-xl text-white hover:opacity-90">
                            <Wand2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="aspect-square rounded-2xl overflow-hidden glass hover:scale-105 transition-transform duration-500 border border-current/5"
                            >
                                <div className="w-full h-full bg-gradient-to-br from-current/5 to-transparent flex items-center justify-center group relative">
                                    {/* Placeholder for Gen Image */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/10 via-transparent to-brand-pink/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <Sparkles className="opacity-20 group-hover:opacity-60 transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}
