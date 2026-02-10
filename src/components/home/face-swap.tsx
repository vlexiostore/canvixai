"use client";

import { Section } from "@/components/ui/section";
import { RefreshCw, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function FaceSwapSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="face-swap" className="relative" theme={theme}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 relative order-2 md:order-1">
                    {/* Face Swap Demo UI */}
                    <div className="relative aspect-[4/3] glass rounded-3xl overflow-hidden p-8 flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                <UserCircle2 size={40} className="text-current opacity-40" />
                            </div>
                            <span className="text-xs opacity-40 uppercase tracking-widest">Source</span>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <div className="w-10 h-1 rounded-full bg-gradient-to-r from-brand-orange to-brand-pink" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="p-2 bg-current/10 rounded-full border border-current/10 -mt-3 z-10"
                            >
                                <RefreshCw size={16} className="text-current" />
                            </motion.div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-orange to-brand-pink p-1">
                                <div className="w-full h-full rounded-full bg-black/20 backdrop-blur-sm" />
                            </div>
                            <span className="text-xs text-brand-pink uppercase tracking-widest">Result</span>
                        </div>
                    </div>

                    {/* Decorative blobs */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-pink/20 blur-[100px] rounded-full" />
                </div>

                <div className="flex-1 space-y-6 order-1 md:order-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-pink/20 bg-brand-pink/5">
                        <RefreshCw size={16} className="text-brand-pink" />
                        <span className="text-sm text-brand-pink font-medium">Re-imagine Identity</span>
                    </div>
                    <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl">
                        Seamless <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-violet">
                            Face Swap
                        </span>
                    </h2>
                    <p className="text-lg opacity-60 leading-relaxed max-w-lg">
                        Swap faces in photos and videos with incredible realism. Lighting, skin tone, and expression matching powered by advanced AI.
                    </p>
                </div>
            </div>
        </Section>
    );
}
