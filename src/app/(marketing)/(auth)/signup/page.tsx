"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Github, Sparkles } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const hasClerk = clerkPub.startsWith("pk_") && clerkPub.length > 10;

export default function SignupPage() {
    // If Clerk is enabled, use Clerk's SignUp component
    if (hasClerk) {
        return (
            <div className="py-8">
                <div className="mb-6">
                    <h1 className="font-display font-bold text-4xl mb-3">Create Account</h1>
                    <p className="text-black/50 text-base">Join the creative revolution.</p>
                </div>
                <SignUp
                    routing="hash"
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "shadow-none p-0 w-full bg-transparent",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            socialButtonsBlockButton: "border border-black/10 rounded-xl py-3 hover:bg-gray-50",
                            formButtonPrimary: "bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 rounded-xl py-3 text-base font-bold",
                            formFieldInput: "bg-gray-50 border border-black/10 rounded-xl px-5 py-4 focus:border-black focus:ring-1 focus:ring-black",
                            footerActionLink: "text-black font-bold hover:text-purple-600",
                            formFieldLabel: "text-sm font-semibold text-black/70",
                        },
                    }}
                    fallbackRedirectUrl="/dashboard"
                />
                <div className="mt-6 text-center text-sm text-black/50">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black hover:text-brand-violet font-bold transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    // Fallback: local auth when Clerk is not configured
    return <LocalSignupForm />;
}

function LocalSignupForm() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const json = await res.json();

            if (!json.success) {
                setError(json.error?.message || "Signup failed");
                setLoading(false);
                return;
            }

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
                <h1 className="font-display font-bold text-4xl mb-3">Create Account</h1>
                <p className="text-black/50 text-base">Join the creative revolution.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black/70 ml-1">First Name</label>
                        <input type="text" placeholder="Alex" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full bg-gray-50 border border-black/10 rounded-xl px-5 py-4 text-black placeholder:text-black/30 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-black/70 ml-1">Last Name</label>
                        <input type="text" placeholder="Rivera" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full bg-gray-50 border border-black/10 rounded-xl px-5 py-4 text-black placeholder:text-black/30 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-black/70 ml-1">Email</label>
                    <input type="email" placeholder="creator@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-50 border border-black/10 rounded-xl px-5 py-4 text-black placeholder:text-black/30 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-black/70 ml-1">Password</label>
                    <input type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-gray-50 border border-black/10 rounded-xl px-5 py-4 text-black placeholder:text-black/30 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" />
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-brand-violet to-brand-cyan rounded-xl font-bold text-white shadow-lg hover:shadow-brand-violet/30 hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? "Creating account..." : <>Get Started Free <Sparkles size={16} /></>}
                    </span>
                </button>
            </form>

            <div className="my-8 flex items-center gap-4 text-xs text-black/20 uppercase font-bold tracking-widest">
                <div className="h-px flex-1 bg-black/10" />
                OR
                <div className="h-px flex-1 bg-black/10" />
            </div>

            <button className="w-full py-4 border border-black/10 rounded-xl font-semibold text-black hover:bg-gray-50 hover:border-black/30 transition-all flex items-center justify-center gap-2">
                <Github size={20} />
                Sign up with GitHub
            </button>

            <div className="mt-8 text-center text-sm text-black/50">
                Already have an account?{" "}
                <Link href="/login" className="text-black hover:text-brand-violet font-bold transition-colors">
                    Sign In
                </Link>
            </div>
        </div>
    );
}
