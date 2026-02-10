"use client";

import { Section } from "@/components/ui/section";
import { Move, Crop, Wand2, Layers, Sliders } from "lucide-react";

export function PhotoEditorSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="editor" className="py-24" theme={theme}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
                        Pro Editing, <span className="italic text-white/50">Simplified</span>
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        A full suite of professional editing tools right in your browser.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tool Cards */}
                    {[
                        { icon: <Crop />, title: "Smart Crop", desc: "Auto-frame your subjects" },
                        { icon: <Wand2 />, title: "Magic Erase", desc: "Remove unwanted objects" },
                        { icon: <Layers />, title: "Layers", desc: "Non-destructive editing" },
                    ].map((tool, i) => (
                        <div key={i} className="glass p-8 rounded-3xl hover:bg-white/10 transition-colors group cursor-default">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-white/60 group-hover:text-brand-cyan group-hover:bg-brand-cyan/20 transition-all">
                                {tool.icon}
                            </div>
                            <h3 className="font-display font-bold text-xl mb-2">{tool.title}</h3>
                            <p className="text-white/50">{tool.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
