"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    delay?: number;
    theme?: "dark" | "light"; // New theme prop
}

export function Section({ children, className, id, delay = 0, theme = "light" }: SectionProps) {
    const isDark = theme === "dark";

    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className={cn(
                "relative z-10 px-5 sm:px-6 lg:px-12 py-16 sm:py-20 lg:py-24 transition-colors duration-500",
                isDark ? "bg-[#0A0A0B] text-white" : "bg-white text-black",
                className
            )}
        >
            {/* Optional: Add distinctive separators or patterns based on theme */}
            {children}
        </motion.section>
    );
}
