"use client";

import { Check, Zap, Crown, Gem, ShieldCheck, ImageIcon, Video, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic",
    price: "$9",
    period: "/mo",
    desc: "For creators getting started with AI.",
    icon: Zap,
    color: "from-blue-500 to-cyan-400",
    highlight: false,
    features: [
      { text: "3,500 image credits", icon: ImageIcon },
      { text: "2,000 video credits", icon: Video },
      { text: "Unlimited AI chat", icon: MessageSquare },
      { text: "Background removal", icon: Sparkles },
      { text: "Premium support", icon: ShieldCheck },
    ],
    cta: "Get Basic",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    desc: "For serious creators who need more power.",
    icon: Crown,
    color: "from-purple-500 to-orange-400",
    highlight: true,
    features: [
      { text: "Everything in Basic +", icon: Check },
      { text: "8,000 image credits", icon: ImageIcon },
      { text: "4,000 video credits", icon: Video },
      { text: "Unlimited AI chat", icon: MessageSquare },
      { text: "Priority generation queue", icon: Sparkles },
      { text: "Premium support", icon: ShieldCheck },
    ],
    cta: "Get Pro",
  },
  {
    name: "Ultimate",
    price: "$49",
    period: "/mo",
    desc: "Unlimited creative power for teams and pros.",
    icon: Gem,
    color: "from-amber-400 to-orange-500",
    highlight: false,
    features: [
      { text: "Everything in Pro +", icon: Check },
      { text: "50,000 image credits", icon: ImageIcon },
      { text: "25,000 video credits", icon: Video },
      { text: "Unlimited AI chat", icon: MessageSquare },
      { text: "Dedicated support", icon: ShieldCheck },
      { text: "Custom model access", icon: Sparkles },
    ],
    cta: "Get Ultimate",
  },
];

const faqs = [
  { q: "What are image credits vs video credits?", a: "Image credits are used for image generation, editing, background removal, and upscaling. Video credits are used for video generation and image-to-video animation. Each action costs a different number of credits." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll keep access until the end of your billing period." },
  { q: "What happens when I run out of credits?", a: "You can purchase additional credit packs or upgrade your plan. Contact support for custom packages." },
  { q: "Do you have coupon codes?", a: "Yes! If you have a coupon code, visit the Redeem page to instantly activate your plan." },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-28 sm:pt-32 pb-20">
      {/* Header */}
      <div className="text-center mb-16 sm:mb-20 px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm text-white/60">Simple, transparent pricing</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl mb-4 sm:mb-6">
            Choose your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              plan.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-white/40 max-w-2xl mx-auto">
            Start free with 50 credits. Upgrade anytime. Redeem a coupon code to unlock your plan instantly.
          </p>
        </motion.div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-3 gap-5 lg:gap-6 mb-12">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
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
                  <span className="text-white/30 text-sm">{plan.period}</span>
                </div>

                <Link
                  href="/redeem"
                  className={`block w-full py-3 rounded-xl text-center font-semibold text-sm transition-all ${
                    plan.highlight
                      ? "bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10"
                      : "bg-white/8 hover:bg-white/12 border border-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="mt-8 space-y-3.5">
                  {plan.features.map((feature, j) => {
                    const FIcon = feature.icon;
                    return (
                      <div key={j} className="flex items-start gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlight ? "bg-purple-500/20" : "bg-white/5"}`}>
                          <FIcon size={12} className={plan.highlight ? "text-purple-400" : "text-white/40"} />
                        </div>
                        <span className="text-white/60">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Free tier note */}
      <div className="max-w-6xl mx-auto px-5 mb-20 sm:mb-28">
        <div className="text-center py-6 px-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-white/50 text-sm">
            <span className="text-white font-semibold">Free plan</span> includes 50 image credits and limited AI chat. No credit card required.
          </p>
        </div>
      </div>

      {/* Redeem CTA */}
      <div className="max-w-3xl mx-auto px-5 mb-20 sm:mb-28">
        <div className="rounded-2xl sm:rounded-3xl border border-purple-500/20 bg-purple-500/[0.04] p-8 sm:p-12 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">Have a coupon code?</h2>
          <p className="text-white/40 mb-6 text-sm sm:text-base">
            Redeem your coupon to instantly activate your plan and start creating.
          </p>
          <Link
            href="/redeem"
            className="inline-block px-8 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
          >
            Redeem Coupon
          </Link>
        </div>
      </div>

      {/* Credit costs table */}
      <div className="max-w-3xl mx-auto px-5 mb-20 sm:mb-28">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-3">Credit Costs</h2>
        <p className="text-center text-white/40 mb-10 text-sm">How much each action costs</p>
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
          {[
            { action: "Image Generation", cost: "10 image credits", icon: ImageIcon },
            { action: "Video Generation", cost: "25 video credits", icon: Video },
            { action: "Image-to-Video", cost: "15 video credits", icon: Video },
            { action: "Background Removal", cost: "2 image credits", icon: Sparkles },
            { action: "AI Upscale", cost: "3 image credits", icon: Sparkles },
            { action: "Generative Fill / Expand", cost: "5 image credits", icon: Sparkles },
            { action: "AI Chat Message", cost: "Free (unlimited on paid)", icon: MessageSquare },
          ].map((item, i) => {
            const CIcon = item.icon;
            return (
              <div key={i} className={`flex items-center justify-between px-5 sm:px-6 py-3.5 text-sm ${i !== 0 ? "border-t border-white/[0.04]" : ""} ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                <span className="text-white/70 flex items-center gap-2">
                  <CIcon size={14} className="text-white/30" />
                  {item.action}
                </span>
                <span className="font-mono font-bold text-white/50">{item.cost}</span>
              </div>
            );
          })}
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

      {/* Bottom CTA */}
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
