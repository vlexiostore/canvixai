"use client";

import { Section } from "@/components/ui/section";
import { Play } from "lucide-react";

export function VideoGenSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="video-gen" className="py-32" theme={theme}>
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-7xl mb-6">
                    Motion from <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-cyan">Stillness</span>
                </h2>
                <p className="text-xl opacity-50 max-w-2xl mx-auto">
                    Animate your images or generate videos from scratch. Cinematic quality, controllable motion.
                </p>
            </div>

            <div className="max-w-5xl mx-auto relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-violet to-brand-cyan rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative aspect-video bg-[#151518] rounded-[2rem] border border-white/10 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                    {/* Play Button */}
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                        <Play className="text-white fill-white ml-1" size={32} />
                    </div>

                    {/* UI overlay */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                        <div className="flex gap-2">
                            <div className="h-1.5 w-12 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-brand-cyan" />
                            </div>
                            <div className="h-1.5 w-12 bg-white/10 rounded-full" />
                            <div className="h-1.5 w-12 bg-white/10 rounded-full" />
                        </div>
                        <span className="font-mono text-xs text-white/40">00:04 / 00:12</span>
                    </div>
                </div>
            </div>
        </Section>
    );
}
