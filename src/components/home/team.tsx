"use client";

import { Section } from "@/components/ui/section";
import Image from "next/image";

const team = [
    { name: "Alex Rivera", role: "Design Lead", color: "bg-brand-orange" },
    { name: "Sarah Chen", role: "AI Research", color: "bg-brand-pink" },
    { name: "Marcus Webb", role: "Engineering", color: "bg-brand-cyan" },
    { name: "Luna Park", role: "Product", color: "bg-brand-violet" },
];

export function TeamSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="team" className="py-32 border-t border-white/5" theme={theme}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <h2 className="font-display font-bold text-4xl md:text-5xl">Meet the <br />Makers</h2>
                        <p className="opacity-50 mt-4 max-w-md">
                            We are a team of designers, engineers, and artists obsessed with the future of creativity.
                        </p>
                    </div>
                    <button className="px-6 py-3 rounded-full border border-current/20 hover:bg-current/5 transition-colors">
                        Join our Team
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {team.map((member, i) => (
                        <div key={i} className="group cursor-default">
                            <div className={`aspect-[3/4] rounded-[2rem] overflow-hidden relative mb-4 ${member.color}`}>
                                <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />

                                {/* Avatar Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-white/20 font-display text-9xl font-bold opacity-50 group-hover:scale-110 transition-transform duration-500">
                                    {member.name.charAt(0)}
                                </div>
                            </div>
                            <h3 className="font-display font-bold text-lg">{member.name}</h3>
                            <p className="opacity-40 text-sm">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
