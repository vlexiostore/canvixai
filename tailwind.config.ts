import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0A0A0B",
                foreground: "#ededed",
                brand: {
                    orange: "#FF6B35",
                    pink: "#F43F5E", // approximate pink-500
                    violet: "#8B5CF6", // approximate violet-500
                    cyan: "#06B6D4",
                    emerald: "#10B981",
                }
            },
            fontFamily: {
                plaster: ["Plaster", "sans-serif"],
                display: ["Syne", "sans-serif"],
                sans: ["DM Sans", "sans-serif"],
                mono: ["Space Grotesk", "monospace"],
            },
            animation: {
                float: "float 6s ease-in-out infinite",
                "pulse-glow": "pulse-glow 3s ease-in-out infinite",
                "gradient-shift": "gradient-shift 8s ease infinite",
                "slide-up": "slide-up 0.8s ease-out forwards",
                shimmer: "text-shimmer 3s linear infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(-20px) rotate(2deg)" },
                },
                "pulse-glow": {
                    "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
                    "50%": { opacity: "0.8", transform: "scale(1.05)" },
                },
                "gradient-shift": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
                "slide-up": {
                    from: { opacity: "0", transform: "translateY(40px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "text-shimmer": {
                    "0%": { backgroundPosition: "-200% center" },
                    "100%": { backgroundPosition: "200% center" },
                },
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(to right, #FF6B35, #F43F5E)',
            }
        },
    },
    plugins: [],
} satisfies Config;
