"use client";

import { Section } from "@/components/ui/section";
import { RoadmapSection } from "@/components/about/roadmap";
import { TeamSection } from "@/components/home/team";

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-28 sm:pt-32 pb-24">
            {/* Hero */}
            <Section theme="light">
                <div className="max-w-4xl mx-auto text-center mb-20 sm:mb-32">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-black/5 mb-6">
                        <span className="text-sm text-black/50 font-medium">About Canvix</span>
                    </div>
                    <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-8xl mb-6 sm:mb-8">
                        We are building the{" "}
                        <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-cyan">
                            factory of imagination.
                        </span>
                    </h1>
                    <p className="text-base sm:text-xl text-black/50 leading-relaxed max-w-2xl mx-auto px-4">
                        Canvix started with a simple question: &ldquo;What if the only limit to creation was your own imagination?&rdquo;
                        Today, we empower millions of creators to bring their wildest dreams to life.
                    </p>
                </div>
            </Section>

            {/* Story Section - Dark */}
            <div className="bg-[#0A0A0B] text-white">
                <Section className="bg-transparent py-20 sm:py-32" theme="dark">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div className="order-2 md:order-1 relative aspect-square bg-white/5 rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-pink/20" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full mix-blend-overlay blur-xl animate-pulse" />
                            <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-purple-500 rounded-full mix-blend-overlay blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
                        </div>
                        <div className="space-y-5 sm:space-y-6 order-1 md:order-2">
                            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-orange">Our Story</h2>
                            <h3 className="text-xl sm:text-2xl font-semibold">From a garage in San Francisco to a global studio.</h3>
                            <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                                Founded in 2023, Canvix began as a research project exploring generative adversarial networks.
                                We realized that while the tech was powerful, the tools were alienating. We set out to bridge that gap.
                            </p>
                            <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                                Three years later, we&apos;re a team of 40+ designers, engineers, and dreamers, working remotely across 12 timezones
                                to make professional-grade AI tools accessible to everyone.
                            </p>
                        </div>
                    </div>
                </Section>
            </div>

            {/* Stats */}
            <Section theme="light" className="py-20 sm:py-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
                        {[
                            { label: "Active Users", value: "2M+" },
                            { label: "Images Generated", value: "500M+" },
                            { label: "Countries", value: "150+" },
                            { label: "Team Members", value: "42" },
                        ].map((stat, i) => (
                            <div key={i} className="p-5 sm:p-8 border border-black/5 rounded-2xl sm:rounded-3xl hover:bg-gray-50 transition-colors">
                                <div className="font-display font-bold text-2xl sm:text-4xl md:text-5xl mb-1 sm:mb-2 text-brand-violet">{stat.value}</div>
                                <div className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-black/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Values */}
            <Section className="bg-black/5 py-20 sm:py-32 rounded-2xl sm:rounded-[3rem] mx-4 sm:mx-6" theme="light">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 px-4 sm:px-6">
                    <div className="space-y-6 sm:space-y-8">
                        <h2 className="font-display font-bold text-3xl sm:text-4xl">Our Principles</h2>
                        <p className="text-black/60 text-sm sm:text-lg">
                            We believe in tools that enhance human creativity, not replace it. Every feature we build is designed to give you more control, fidelity, and speed.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:gap-8">
                        {[
                            { title: "Human First", desc: "AI should serve the artist, not the other way around." },
                            { title: "Craftsmanship", desc: "We obsess over every pixel, interaction, and millisecond." },
                            { title: "Accessibility", desc: "Professional power, accessible to everyone." },
                        ].map((val, i) => (
                            <div key={i} className="border-l-2 border-brand-violet pl-5 sm:pl-6">
                                <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">{val.title}</h3>
                                <p className="text-black/50 text-sm sm:text-base">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Team Section - Dark with all members */}
            <div className="bg-[#0A0A0B] text-white mt-16 sm:mt-24">
                <TeamSection theme="dark" showAll />
            </div>

            {/* Roadmap */}
            <RoadmapSection />
        </div>
    );
}
