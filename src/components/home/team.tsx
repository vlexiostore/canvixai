"use client";

import { Section } from "@/components/ui/section";
import { Linkedin, Twitter } from "lucide-react";

const team = [
    {
        name: "Alex Rivera",
        role: "Co-Founder & Design Lead",
        color: "bg-gradient-to-br from-brand-orange to-amber-600",
        bio: "Former Figma design lead. Obsessed with pixel-perfect interfaces.",
    },
    {
        name: "Sarah Chen",
        role: "Co-Founder & AI Research",
        color: "bg-gradient-to-br from-brand-pink to-rose-600",
        bio: "PhD in Computer Vision from Stanford. Led generative AI research at DeepMind.",
    },
    {
        name: "Marcus Webb",
        role: "Head of Engineering",
        color: "bg-gradient-to-br from-brand-cyan to-blue-600",
        bio: "Ex-Netflix & Vercel. Built systems that serve billions of requests.",
    },
    {
        name: "Luna Park",
        role: "Head of Product",
        color: "bg-gradient-to-br from-brand-violet to-purple-700",
        bio: "Previously at Notion and Linear. Passionate about creator tools.",
    },
    {
        name: "James Okonkwo",
        role: "ML Engineer",
        color: "bg-gradient-to-br from-emerald-500 to-teal-600",
        bio: "Specializes in diffusion models and real-time inference optimization.",
    },
    {
        name: "Mia Torres",
        role: "Creative Director",
        color: "bg-gradient-to-br from-rose-500 to-pink-600",
        bio: "Award-winning creative director. Previously at Adobe Creative Cloud.",
    },
    {
        name: "David Kim",
        role: "Backend Lead",
        color: "bg-gradient-to-br from-indigo-500 to-blue-600",
        bio: "Distributed systems expert. Built infrastructure at Cloudflare.",
    },
    {
        name: "Aisha Patel",
        role: "Growth & Community",
        color: "bg-gradient-to-br from-amber-500 to-orange-600",
        bio: "Grew creator communities from 0 to 2M+. Former head of community at Midjourney.",
    },
];

export function TeamSection({ theme, showAll = false }: { theme?: "dark" | "light"; showAll?: boolean }) {
    const isDark = theme === "dark";
    const members = showAll ? team : team.slice(0, 4);

    return (
        <Section id="team" className="py-16 sm:py-24 lg:py-32 border-t border-white/5" theme={theme}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'} mb-4`}>
                            <span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-black/60'}`}>The People</span>
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl">
                            Meet the{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400">
                                Makers
                            </span>
                        </h2>
                        <p className={`mt-3 md:mt-4 max-w-lg text-sm md:text-base ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                            A team of designers, engineers, researchers, and artists obsessed with the future of AI-powered creativity.
                        </p>
                    </div>
                    <a
                        href="mailto:careers@canvix.ai"
                        className={`px-6 py-3 rounded-full border text-sm md:text-base font-medium transition-colors ${
                            isDark
                                ? 'border-white/20 hover:bg-white/5 text-white/70 hover:text-white'
                                : 'border-black/20 hover:bg-black/5 text-black/70 hover:text-black'
                        }`}
                    >
                        Join our Team
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {members.map((member, i) => (
                        <div key={i} className="group cursor-default">
                            <div className={`aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden relative mb-3 md:mb-4 ${member.color}`}>
                                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                                {/* Large initial letter */}
                                <div className="absolute inset-0 flex items-center justify-center text-white/15 font-display text-7xl sm:text-8xl md:text-9xl font-bold group-hover:scale-110 transition-transform duration-500">
                                    {member.name.charAt(0)}
                                </div>
                                {/* Hover overlay with bio */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                                    <div className="flex gap-2 mt-2">
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                            <Twitter size={12} className="text-white/70" />
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                            <Linkedin size={12} className="text-white/70" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-display font-bold text-sm md:text-base lg:text-lg">{member.name}</h3>
                            <p className={`text-xs md:text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
