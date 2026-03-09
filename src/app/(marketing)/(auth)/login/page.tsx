"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthUI } from "@/components/ui/auth-fuse";

const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const skipClerkLocal = process.env.NEXT_PUBLIC_CLERK_DISABLED_FOR_LOCAL === "true";
const hasClerk = clerkPub.startsWith("pk_") && clerkPub.length > 10 && !skipClerkLocal;

export default function LoginPage() {
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

    const handleSignIn = async (email: string, password: string) => {
        setError("");
        setLoading(true);
        try {
            if (hasClerk) {
                const { useSignIn } = await import("@clerk/nextjs");
                // Clerk sign-in is handled via the component hook approach below
            }
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
            initialMode="signin"
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onGoogleClick={() => {
                if (hasClerk) {
                    window.location.href = "/sso-callback?provider=google";
                }
            }}
            error={error}
            loading={loading}
        />
    );
}
