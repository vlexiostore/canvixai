"use client";

import { Section } from "@/components/ui/section";
import { RoadmapSection } from "@/components/about/roadmap";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-white text-black">
            {/* Hero */}
            <Section theme="light">
                <div className="max-w-4xl mx-auto text-center mb-32">
                    <h1 className="font-display font-bold text-6xl md:text-8xl mb-8">
                        We are building the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-cyan">
                            factory of imagination.
                        </span>
                    </h1>
                    <p className="text-xl text-black/50 leading-relaxed max-w-2xl mx-auto">
                        Canvix started with a simple question: "What if the only limit to creation was your own imagination?"
                        Today, we empower millions of creators to bring their wildest dreams to life.
                    </p>
                </div>
            </Section>

            {/* Story Section - Dark */}
            <Section className="bg-[#0A0A0B] text-white py-32 -mx-6 lg:-mx-12 px-6 lg:px-12 rounded-[3rem]" theme="dark">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative aspect-square bg-white/5 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-pink/20" />
                        {/* Abstract shape for story */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full mix-blend-overlay blur-xl animate-pulse" />
                    </div>
                    <div className="space-y-6 order-1 md:order-2">
                        <h2 className="font-display font-bold text-4xl text-brand-orange">Our Story</h2>
                        <h3 className="text-2xl font-semibold">From a garage in San Francisco to a global studio.</h3>
                        <p className="text-white/60 leading-relaxed">
                            Founded in 2023, Canvix began as a research project exploring generative adversarial networks.
                            We realized that while the tech was powerful, the tools were alienating. We set out to bridge that gap.
                            <br /><br />
                            Three years later, we're a team of 40+ designers, engineers, and dreamers, working remotely across 12 timezones.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Stats / Global Reach - Light */}
            <Section theme="light" className="py-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Active Users", value: "2M+" },
                            { label: "Images Generated", value: "500M+" },
                            { label: "Countries", value: "150+" },
                            { label: "Team Members", value: "42" }
                        ].map((stat, i) => (
                            <div key={i} className="p-8 border border-black/5 rounded-3xl hover:bg-gray-50 transition-colors">
                                <div className="font-display font-bold text-4xl md:text-5xl mb-2 text-brand-violet">{stat.value}</div>
                                <div className="text-sm font-semibold uppercase tracking-wider text-black/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Values Grid */}
            <Section className="bg-black/5 py-32 rounded-[3rem] mx-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 px-6">
                    <div className="space-y-8">
                        <h2 className="font-display font-bold text-4xl">Our Principles</h2>
                        <p className="text-black/60 text-lg">
                            We believe in tools that enhance human creativity, not replace it. Every feature we build is designed to give you more control, fidelity, and speed.
                        </p>
                    </div>

                    <div className="grid gap-8">
                        {[
                            { title: "Human First", desc: "AI should serve the artist, not the other way around." },
                            { title: "Craftsmanship", desc: "We obsess over every pixel, interaction, and millisecond." },
                            { title: "Accessibility", desc: "Professional power, accessible to everyone." }
                        ].map((val, i) => (
                            <div key={i} className="border-l-2 border-brand-violet pl-6">
                                <h3 className="font-bold text-xl mb-2">{val.title}</h3>
                                <p className="text-black/50">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
            {/* Roadmap */}
            <RoadmapSection />
        </div>
    );
}
