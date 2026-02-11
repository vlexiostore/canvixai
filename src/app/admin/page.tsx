"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Ticket, Plus, Trash2, Copy, Check, AlertCircle, Loader2,
  ShieldCheck, RefreshCw, ChevronDown,
} from "lucide-react";
import Link from "next/link";

interface CouponData {
  _id: string;
  code: string;
  plan: string;
  imageCredits: number;
  videoCredits: number;
  maxUses: number;
  usedCount: number;
  usedBy: string[];
  isActive: boolean;
  expiresAt?: string;
  createdBy: string;
  note?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Generate form state
  const [showForm, setShowForm] = useState(false);
  const [formPlan, setFormPlan] = useState<"basic" | "pro" | "ultimate">("basic");
  const [formCount, setFormCount] = useState(1);
  const [formMaxUses, setFormMaxUses] = useState(1);
  const [formExpiry, setFormExpiry] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formCustomCode, setFormCustomCode] = useState("");

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/coupons");
      const json = await res.json();
      if (json.success) {
        setCoupons(json.data.coupons);
      } else {
        setError(json.error?.message || "Failed to load coupons. Are you an admin?");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: formPlan,
          count: formCount,
          maxUses: formMaxUses,
          expiresInDays: formExpiry ? Number(formExpiry) : undefined,
          note: formNote || undefined,
          customCode: formCustomCode || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchCoupons();
        setShowForm(false);
        setFormCustomCode("");
        setFormNote("");
      } else {
        setError(json.error?.message || "Failed to generate coupon.");
      }
    } catch {
      setError("Network error.");
    }
    setGenerating(false);
  };

  const handleDeactivate = async (code: string) => {
    if (!confirm(`Deactivate coupon ${code}?`)) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (json.success) {
        setCoupons((prev) => prev.map((c) => c.code === code ? { ...c, isActive: false } : c));
      }
    } catch { /* ignore */ }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const planColors: Record<string, string> = {
    basic: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    pro: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    ultimate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm">C</div>
              <span className="font-bold">Canvix</span>
            </Link>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
              <ShieldCheck size={14} className="text-red-400" />
              <span className="text-xs font-bold text-red-400">Admin Panel</span>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Coupon Management</h1>
            <p className="text-sm text-white/40">Generate and manage coupon codes for plans.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchCoupons} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
              <Plus size={16} /> Generate Coupon
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Generate Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="font-bold text-lg mb-4">New Coupon</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Plan */}
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Plan</label>
                <div className="relative">
                  <select
                    value={formPlan}
                    onChange={(e) => setFormPlan(e.target.value as "basic" | "pro" | "ultimate")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="basic">Basic (3,500 img / 2,000 vid)</option>
                    <option value="pro">Pro (8,000 img / 4,000 vid)</option>
                    <option value="ultimate">Ultimate (50,000 img / 25,000 vid)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>

              {/* Count */}
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Number of Coupons</label>
                <input type="number" min={1} max={100} value={formCount} onChange={(e) => setFormCount(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors" />
              </div>

              {/* Max Uses */}
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Max Uses per Coupon</label>
                <input type="number" min={1} value={formMaxUses} onChange={(e) => setFormMaxUses(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors" />
              </div>

              {/* Expiry */}
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Expires in (days, optional)</label>
                <input type="number" min={1} value={formExpiry} onChange={(e) => setFormExpiry(e.target.value)} placeholder="No expiry"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder-white/20" />
              </div>

              {/* Custom Code (only for single) */}
              {formCount === 1 && (
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Custom Code (optional)</label>
                  <input type="text" value={formCustomCode} onChange={(e) => setFormCustomCode(e.target.value.toUpperCase())} placeholder="Auto-generated"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder-white/20 font-mono uppercase" maxLength={20} />
                </div>
              )}

              {/* Note */}
              <div>
                <label className="text-xs text-white/40 block mb-1.5">Note (optional)</label>
                <input type="text" value={formNote} onChange={(e) => setFormNote(e.target.value)} placeholder="Internal note..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder-white/20" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleGenerate} disabled={generating}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50">
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Ticket size={16} />}
                {generating ? "Generating..." : `Generate ${formCount > 1 ? `${formCount} Coupons` : "Coupon"}`}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-white/50 hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 size={32} className="animate-spin mx-auto mb-4 text-white/30" />
            <p className="text-white/40">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20">
            <Ticket size={48} className="mx-auto mb-4 text-white/20" />
            <h2 className="text-xl font-bold mb-2">No coupons yet</h2>
            <p className="text-white/40 mb-6">Generate your first coupon above.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
            {/* Table Header */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_100px_120px_100px_80px_100px_80px] px-5 py-3 bg-white/[0.03] border-b border-white/[0.04] text-xs text-white/40 font-semibold uppercase tracking-wider">
              <span>Code</span>
              <span>Plan</span>
              <span>Credits</span>
              <span>Usage</span>
              <span>Status</span>
              <span>Created</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            {coupons.map((coupon) => (
              <div key={coupon._id} className="grid grid-cols-1 lg:grid-cols-[1fr_100px_120px_100px_80px_100px_80px] px-5 py-4 border-b border-white/[0.04] last:border-0 gap-2 lg:gap-0 items-center hover:bg-white/[0.02] transition-colors">
                {/* Code */}
                <div className="flex items-center gap-2">
                  <button onClick={() => copyCode(coupon.code)} className="flex items-center gap-2 font-mono text-sm font-bold hover:text-purple-300 transition-colors" title="Copy">
                    {copied === coupon.code ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white/30" />}
                    {coupon.code}
                  </button>
                  {coupon.note && <span className="text-[10px] text-white/30 truncate max-w-[150px]">{coupon.note}</span>}
                </div>

                {/* Plan */}
                <div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md border ${planColors[coupon.plan] || "text-white/50"}`}>
                    {coupon.plan.toUpperCase()}
                  </span>
                </div>

                {/* Credits */}
                <div className="text-xs text-white/60">
                  <span>{coupon.imageCredits.toLocaleString()} img</span>
                  <span className="text-white/20 mx-1">/</span>
                  <span>{coupon.videoCredits.toLocaleString()} vid</span>
                </div>

                {/* Usage */}
                <div className="text-xs text-white/50">
                  {coupon.usedCount} / {coupon.maxUses}
                </div>

                {/* Status */}
                <div>
                  {coupon.isActive ? (
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">ACTIVE</span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">INACTIVE</span>
                  )}
                </div>

                {/* Created */}
                <div className="text-xs text-white/40">
                  {new Date(coupon.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div>
                  {coupon.isActive && (
                    <button onClick={() => handleDeactivate(coupon.code)}
                      className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Deactivate">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
