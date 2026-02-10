"use client";

import { Section } from "@/components/ui/section";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Starter",
        price: "Free",
        desc: "Perfect for testing ideas.",
        features: ["5 AI Generations/day", "Standard Resolution", "Basic Editor Tools", "Watermarked Exports"],
        cta: "Start for Free",
        highlight: false,
    },
    {
        name: "Pro",
        price: "$12",
        period: "/mo",
        desc: "For serious creators.",
        features: ["Unlimited Generations", "4K Upscaling", "Magic Eraser & BG Remover", "Priority Support", "Private Mode"],
        cta: "Start 7-Day Trial",
        highlight: true,
    },
    {
        name: "Team",
        price: "$29",
        period: "/mo",
        desc: "Collaborate and scale.",
        features: ["5 Team Seats", "Shared Workspace", "API Access (Beta)", "Dedicated Success Manager", "SSO & Security"],
        cta: "Contact Sales",
        highlight: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen pt-32 pb-24">
            <Section className="text-center mb-20">
                <h1 className="font-display font-bold text-5xl md:text-7xl mb-6">
                    Invest in your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-pink">
                        creativity.
                    </span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto">
                    Simple, transparent pricing. No hidden fees. Cancel anytime.
                </p>
            </Section>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <Section key={i} delay={i * 0.1}>
                        <div className={`relative h-full p-8 rounded-[2rem] border transition-all hover:-translate-y-2 duration-300 ${plan.highlight
                                ? "bg-white/5 border-brand-orange/50 shadow-[0_0_40px_-10px_rgba(255,107,53,0.3)]"
                                : "bg-transparent border-white/10 hover:bg-white/5"
                            }`}>
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-orange to-brand-pink rounded-full text-xs font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="font-display font-bold text-2xl mb-2">{plan.name}</h3>
                            <p className="text-white/40 text-sm mb-6 min-h-[40px]">{plan.desc}</p>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="font-display font-bold text-5xl">{plan.price}</span>
                                {plan.period && <span className="text-white/40">{plan.period}</span>}
                            </div>

                            <Link
                                href={plan.name === "Team" ? "/contact" : "/signup"}
                                className={`block w-full py-3 rounded-xl text-center font-semibold mb-8 transition-all ${plan.highlight
                                        ? "bg-white text-black hover:bg-gray-100"
                                        : "bg-white/10 hover:bg-white/20"
                                    }`}
                            >
                                {plan.cta}
                            </Link>

                            <div className="space-y-4">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-start gap-3 text-sm text-white/70">
                                        <Check size={18} className={plan.highlight ? "text-brand-orange" : "text-white/40"} />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>
                ))}
            </div>
        </div>
    );
}
