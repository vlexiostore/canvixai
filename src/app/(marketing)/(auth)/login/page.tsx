"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Github } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const json = await res.json();

            if (!json.success) {
                setError(json.error?.message || "Login failed");
                setLoading(false);
                return;
            }

            // Store user info and redirect immediately
            localStorage.setItem("canvix_user", JSON.stringify(json.data));
            router.replace("/dashboard");
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="font-display font-bold text-4xl mb-3">Welcome Back</h1>
                <p className="text-black/50 text-base">Sign in to continue creating.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-black/70 ml-1">Email</label>
                    <input
                        type="email"
                        placeholder="creator@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-gray-50 border border-black/10 rounded-xl px-5 py-4 text-black placeholder:text-black/30 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between px-1">
                        <label className="text-sm font-semibold text-black/70">Password</label>
                        <Link href="#" className="text-xs font-semibold text-brand-orange hover:text-brand-pink transition-colors">Forgot Password?</Link>
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-gray-50 border border-black/10 rounded-xl px-5 py-4 text-black placeholder:text-black/30 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-900 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <div className="my-8 flex items-center gap-4 text-xs text-black/20 uppercase font-bold tracking-widest">
                <div className="h-px flex-1 bg-black/10" />
                OR
                <div className="h-px flex-1 bg-black/10" />
            </div>

            <button className="w-full py-4 border border-black/10 rounded-xl font-semibold text-black hover:bg-gray-50 hover:border-black/30 transition-all flex items-center justify-center gap-2">
                <Github size={20} />
                Continue with GitHub
            </button>

            <div className="mt-8 text-center text-sm text-black/50">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-black hover:text-brand-orange font-bold transition-colors">
                    Sign Up
                </Link>
            </div>
        </div>
    );
}
