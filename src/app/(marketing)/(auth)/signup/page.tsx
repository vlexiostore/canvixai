"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { AuthUI } from "@/components/ui/auth-fuse";

const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const skipClerkLocal = process.env.NEXT_PUBLIC_CLERK_DISABLED_FOR_LOCAL === "true";
const hasClerk = clerkPub.startsWith("pk_") && clerkPub.length > 10 && !skipClerkLocal;

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (skipClerkLocal) {
            router.replace("/dashboard");
            return;
        }
        try {
            const raw = localStorage.getItem("canvix_user");
            if (raw) {
                const data = JSON.parse(raw);
                if (data?.userId || data?.email) {
                    router.replace("/dashboard");
                }
            }
        } catch { /* ignore */ }
    }, [router]);

    if (skipClerkLocal) return null;

    if (hasClerk) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <SignUp
                    routing="hash"
                    appearance={{
                        elements: {
                            rootBox: "w-full max-w-md",
                            card: "shadow-none p-0 w-full bg-transparent",
                            formButtonPrimary: "bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 rounded-xl py-3 text-base font-bold",
                            formFieldInput: "bg-gray-50 border border-black/10 rounded-xl px-5 py-4 focus:border-black focus:ring-1 focus:ring-black",
                            footerActionLink: "text-black font-bold hover:text-purple-600",
                        },
                    }}
                    fallbackRedirectUrl="/dashboard"
                />
            </div>
        );
    }

    const handleSignIn = async (email: string, password: string) => {
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
            localStorage.setItem("canvix_user", JSON.stringify(json.data));
            router.replace("/dashboard");
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const handleSignUp = async (name: string, email: string, password: string) => {
        setError("");
        setLoading(true);
        const [firstName, ...rest] = name.split(" ");
        const lastName = rest.join(" ");
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
        <AuthUI
            initialMode="signup"
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onGoogleClick={() => console.log("Google auth not configured for local dev")}
            error={error}
            loading={loading}
        />
    );
}
