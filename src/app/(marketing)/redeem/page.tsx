"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, CheckCircle, AlertCircle, Loader2, Sparkles, ImageIcon, Video } from "lucide-react";
import Link from "next/link";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{ plan: string; imageCredits: number; videoCredits: number } | null>(null);

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setStatus("loading");
    setMessage("");
    setResult(null);

    try {
      const res = await fetch("/api/coupons/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const json = await res.json();

      if (json.success) {
        setStatus("success");
        setMessage(json.data.message);
        setResult({
          plan: json.data.plan,
          imageCredits: json.data.imageCredits,
          videoCredits: json.data.videoCredits,
        });
      } else {
        setStatus("error");
        setMessage(json.error?.message || "Failed to redeem coupon.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-28 sm:pt-36 pb-20">
      <div className="max-w-lg mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6">
            <Ticket size={28} className="text-purple-400" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-3">
            Redeem Coupon
          </h1>
          <p className="text-white/40 text-sm sm:text-base">
            Enter your coupon code to instantly activate your plan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
        >
          {/* Input */}
          <div className="mb-6">
            <label className="text-xs text-white/40 font-medium block mb-2">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); if (status !== "idle") setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
              placeholder="e.g. BAS-A1B2C3D4"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-lg font-mono tracking-widest text-center text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all uppercase"
              maxLength={20}
              disabled={status === "loading" || status === "success"}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleRedeem}
            disabled={!code.trim() || status === "loading" || status === "success"}
            className="w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-gray-200"
          >
            {status === "loading" ? (
              <><Loader2 size={18} className="animate-spin" /> Redeeming...</>
            ) : status === "success" ? (
              <><CheckCircle size={18} /> Activated!</>
            ) : (
              <><Sparkles size={18} /> Redeem & Activate</>
            )}
          </button>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {status === "success" && result && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-5 rounded-xl bg-green-500/10 border border-green-500/20"
              >
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-green-300 text-sm">{message}</div>
                    <div className="text-xs text-green-400/60 mt-1">
                      Your {result.plan.toUpperCase()} plan is now active.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/[0.06] text-center">
                    <ImageIcon size={16} className="text-orange-400 mx-auto mb-1" />
                    <div className="font-bold text-lg">{result.imageCredits.toLocaleString()}</div>
                    <div className="text-[10px] text-white/40">Image Credits</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/[0.06] text-center">
                    <Video size={16} className="text-purple-400 mx-auto mb-1" />
                    <div className="font-bold text-lg">{result.videoCredits.toLocaleString()}</div>
                    <div className="text-[10px] text-white/40">Video Credits</div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="mt-4 block w-full py-3 rounded-xl bg-white text-black text-center font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
              >
                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Help */}
        <p className="text-center text-white/30 text-xs mt-6">
          Don&apos;t have a code?{" "}
          <Link href="/pricing" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
            View pricing plans
          </Link>
        </p>
      </div>
    </div>
  );
}
