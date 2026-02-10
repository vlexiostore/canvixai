"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-[#0A0A0B]/80 backdrop-blur-md border-white/5 py-4" : "py-6 bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center transform transition-transform group-hover:rotate-12">
                        <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="font-display font-bold text-2xl tracking-tight">
                        Canvix<span className="text-brand-orange">.ai</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {["Features", "Pricing", "About"].map((item) => (
                        <Link
                            key={item}
                            href={item === "Features" ? "/#features" : `/${item.toLowerCase()}`}
                            className="text-white/60 hover:text-white transition-colors text-sm font-medium"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-white/90 transition-all hover:scale-105"
                    >
                        Start Creating
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#0A0A0B] border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6">
                            {["Features", "Pricing", "About"].map((item) => (
                                <Link
                                    key={item}
                                    href={item === "Features" ? "/#features" : `/${item.toLowerCase()}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-white/80"
                                >
                                    {item}
                                </Link>
                            ))}
                            <hr className="border-white/10" />
                            <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-white/80">
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-brand-orange"
                            >
                                Start Creating
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
