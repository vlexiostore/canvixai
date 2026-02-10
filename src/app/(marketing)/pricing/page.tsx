"use client";

import { Check, Zap, Crown, Building2 } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Starter",
        price: "Free",
        desc: "Perfect for exploring AI creation.",
        icon: Zap,
        features: [
            "50 credits on signup",
            "5 AI generations per day",
            "Standard resolution output",
            "Basic editor tools",
            "Community support",
        ],
        cta: "Start for Free",
        highlight: false,
        color: "from-gray-500 to-gray-600",
    },
    {
        name: "Pro",
        price: "$12",
        period: "/mo",
        desc: "For serious creators who need more power.",
        icon: Crown,
        features: [
            "500 credits per month",
            "Unlimited AI generations",
            "4K upscaling & HD output",
            "Magic Eraser & BG Remover",
            "Priority generation queue",
            "No watermarks",
            "Private mode",
        ],
        cta: "Start 7-Day Trial",
        highlight: true,
        color: "from-purple-500 to-orange-400",
    },
    {
        name: "Team",
        price: "$29",
        period: "/mo per seat",
        desc: "Collaborate and scale with your team.",
        icon: Building2,
        features: [
            "2000 credits per month",
            "Up to 10 team seats",
            "Shared workspace & assets",
            "API access (beta)",
            "Dedicated success manager",
            "SSO & advanced security",
            "Custom model fine-tuning",
        ],
        cta: "Contact Sales",
        highlight: false,
        color: "from-blue-500 to-cyan-400",
    },
];

const faqs = [
    { q: "What are credits?", a: "Credits are used for AI generations. Different actions cost different amounts — for example, image generation costs 10 credits and video generation costs 25 credits." },
    { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll keep access until the end of your billing period." },
    { q: "What happens when I run out of credits?", a: "You can purchase additional credit packs or upgrade your plan. Unused credits roll over to the next month on paid plans." },
    { q: "Is there a free trial?", a: "Yes! Pro plan comes with a 7-day free trial. No credit card required to start." },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white pt-28 sm:pt-32 pb-20">
            {/* Header */}
            <div className="text-center mb-16 sm:mb-20 px-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-sm text-white/60">Simple, transparent pricing</span>
                </div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl mb-4 sm:mb-6">
                    Invest in your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                        creativity.
                    </span>
                </h1>
                <p className="text-base sm:text-xl text-white/40 max-w-2xl mx-auto">
                    No hidden fees. No surprises. Cancel anytime.
                </p>
            </div>

            {/* Plans Grid */}
            <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-3 gap-5 lg:gap-6 mb-20 sm:mb-28">
                {plans.map((plan, i) => {
                    const Icon = plan.icon;
                    return (
                        <div
                            key={i}
                            className={`relative h-full rounded-2xl sm:rounded-3xl border transition-all hover:-translate-y-1 duration-300 ${
                                plan.highlight
                                    ? "bg-white/[0.04] border-purple-500/40 shadow-[0_0_60px_-15px_rgba(168,85,247,0.25)]"
                                    : "bg-white/[0.02] border-white/[0.06] hover:border-white/10 hover:bg-white/[0.04]"
                            }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-orange-400 rounded-full text-[11px] font-bold uppercase tracking-wider text-white">
                                    Most Popular
                                </div>
                            )}

                            <div className="p-6 sm:p-8">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-5`}>
                                    <Icon size={20} className="text-white" />
                                </div>

                                <h3 className="font-display font-bold text-xl sm:text-2xl mb-1">{plan.name}</h3>
                                <p className="text-white/30 text-sm mb-6 min-h-[40px]">{plan.desc}</p>

                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="font-display font-bold text-4xl sm:text-5xl">{plan.price}</span>
                                    {plan.period && <span className="text-white/30 text-sm">{plan.period}</span>}
                                </div>

                                <Link
                                    href={plan.name === "Team" ? "/contact" : "/signup"}
                                    className={`block w-full py-3 rounded-xl text-center font-semibold text-sm transition-all ${
                                        plan.highlight
                                            ? "bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10"
                                            : "bg-white/8 hover:bg-white/12 border border-white/10"
                                    }`}
                                >
                                    {plan.cta}
                                </Link>

                                <div className="mt-8 space-y-3.5">
                                    {plan.features.map((feature, j) => (
                                        <div key={j} className="flex items-start gap-3 text-sm">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlight ? 'bg-purple-500/20' : 'bg-white/5'}`}>
                                                <Check size={12} className={plan.highlight ? "text-purple-400" : "text-white/40"} />
                                            </div>
                                            <span className="text-white/60">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Credit costs table */}
            <div className="max-w-3xl mx-auto px-5 mb-20 sm:mb-28">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-3">Credit Costs</h2>
                <p className="text-center text-white/40 mb-10 text-sm">How much each action costs</p>
                <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                    {[
                        { action: "Image Generation", cost: 10 },
                        { action: "Video Generation", cost: 25 },
                        { action: "Image-to-Video", cost: 15 },
                        { action: "Background Removal", cost: 2 },
                        { action: "AI Upscale", cost: 3 },
                        { action: "Generative Fill / Expand", cost: 5 },
                        { action: "Chat Message (AI)", cost: 1 },
                    ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between px-5 sm:px-6 py-3.5 text-sm ${i !== 0 ? 'border-t border-white/[0.04]' : ''} ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                            <span className="text-white/70">{item.action}</span>
                            <span className="font-mono font-bold text-white/50">{item.cost} credits</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQs */}
            <div className="max-w-3xl mx-auto px-5 mb-16">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-10">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                            <summary className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer text-sm font-semibold text-white/80 hover:text-white transition-colors [&::-webkit-details-marker]:hidden">
                                {faq.q}
                                <span className="text-white/30 group-open:rotate-45 transition-transform text-lg">+</span>
                            </summary>
                            <div className="px-5 sm:px-6 pb-4 text-sm text-white/50 leading-relaxed">{faq.a}</div>
                        </details>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-3xl mx-auto px-5 text-center">
                <div className="rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-12">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">Ready to create?</h2>
                    <p className="text-white/40 mb-6 text-sm sm:text-base">Start with 50 free credits. No credit card required.</p>
                    <Link href="/signup" className="inline-block px-8 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                        Get Started Free
                    </Link>
                </div>
            </div>
        </div>
    );
}
