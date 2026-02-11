"use client";

import Link from "next/link";
import { Pricing } from "@/components/ui/single-pricing-card-1";

const faqs = [
    { q: "What are credits?", a: "Credits are used for AI generations. Different actions cost different amounts — for example, image generation costs 10 credits and video generation costs 25 credits." },
    { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll keep access until the end of your billing period." },
    { q: "What happens when I run out of credits?", a: "You can purchase additional credit packs or upgrade your plan. Unused credits roll over to the next month on paid plans." },
    { q: "Is there a free trial?", a: "Yes! Pro plan comes with a 7-day free trial. No credit card required to start." },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white pt-20 sm:pt-24 pb-20">
            {/* Pricing Card Section */}
            <Pricing />

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
