"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroShutterTextProps {
  text?: string;
  className?: string;
  /** Accent color for the shutter slices */
  accentClassName?: string;
}

export default function HeroShutterText({
  text = "CANVIX",
  className = "",
  accentClassName = "text-purple-500",
}: HeroShutterTextProps) {
  const [count, setCount] = useState(0);
  const characters = text.split("");

  // Auto-replay on mount after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setCount((c) => c + 1), 6000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full pointer-events-none select-none",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          className="flex flex-wrap justify-center items-center w-full"
        >
          {characters.map((char, i) => (
            <div
              key={i}
              className="relative px-[0.05em] overflow-hidden"
            >
              {/* Main Character */}
              <motion.span
                initial={{ opacity: 0, filter: "blur(12px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: i * 0.05 + 0.3, duration: 0.8 }}
                className="text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-none font-black text-white tracking-tighter"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>

              {/* Top Slice Layer */}
              <motion.span
                initial={{ x: "-110%", opacity: 0 }}
                animate={{ x: "110%", opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }}
                className={cn(
                  "absolute inset-0 text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-none font-black z-10 pointer-events-none",
                  accentClassName
                )}
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
              >
                {char}
              </motion.span>

              {/* Middle Slice Layer */}
              <motion.span
                initial={{ x: "110%", opacity: 0 }}
                animate={{ x: "-110%", opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05 + 0.1,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-none font-black text-white/60 z-10 pointer-events-none"
                style={{
                  clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)",
                }}
              >
                {char}
              </motion.span>

              {/* Bottom Slice Layer */}
              <motion.span
                initial={{ x: "-110%", opacity: 0 }}
                animate={{ x: "110%", opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05 + 0.2,
                  ease: "easeInOut",
                }}
                className={cn(
                  "absolute inset-0 text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-none font-black z-10 pointer-events-none",
                  accentClassName
                )}
                style={{
                  clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)",
                }}
              >
                {char}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
