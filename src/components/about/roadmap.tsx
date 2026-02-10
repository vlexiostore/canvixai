"use client";

import { Section } from "@/components/ui/section";
import { Timer, Zap, Globe2 } from "lucide-react";

export function RoadmapSection() {
    return (
        <Section theme="light" className="bg-gray-50 py-32 rounded-[3rem] mx-6 mb-24">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4 block">What's Next</span>
                <h2 className="font-display font-bold text-5xl md:text-6xl">The Future of Canvix</h2>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-6">
                {[
                    { icon: <Zap className="text-brand-orange" />, title: "Real-time Collab", desc: "Multiplayer editing for teams, coming Q3 2026.", status: "In Development" },
                    { icon: <Globe2 className="text-brand-cyan" />, title: "3D Generation", desc: "Text-to-3D model generation for game dev and AR.", status: "Research" },
                    { icon: <Timer className="text-brand-violet" />, title: "AI Animation v2", desc: "Keyframe control and temporal consistency improvements.", status: "Designing" }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                            {item.icon}
                        </div>
                        <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                        <p className="text-black/60 text-sm mb-6">{item.desc}</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full text-xs font-semibold text-black/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-black/30 animate-pulse" />
                            {item.status}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}
