"use client";

import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";
import { FileType, RefreshCw, FileImage, FileText } from "lucide-react";

export function FileConverterSection({ theme }: { theme?: "dark" | "light" }) {
    return (
        <Section id="file-converter" className="bg-transparent" theme={theme}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/20 bg-green-500/5">
                        <FileType size={16} className="text-green-500" />
                        <span className="text-sm text-green-500 font-medium">Universal Converter</span>
                    </div>
                    <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl">
                        Convert anything <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-300">
                            in seconds
                        </span>
                    </h2>
                    <p className="text-lg opacity-60 leading-relaxed max-w-lg">
                        Seamlessly convert images, documents, and innovative formats. HEIC to JPG, PDF to PNG, WEBP to GIF - we handle it all with zero quality loss.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 rounded-2xl bg-current/5 border border-current/10">
                            <div className="flex items-center gap-3 mb-2">
                                <FileImage className="text-green-500" />
                                <span className="font-bold">Image Formats</span>
                            </div>
                            <p className="text-sm opacity-60">JPG, PNG, WEBP, HEIC, SVG, AVIF</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-current/5 border border-current/10">
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="text-green-500" />
                                <span className="font-bold">Documents</span>
                            </div>
                            <p className="text-sm opacity-60">PDF, DOCX, TXT, EPUB</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex justify-center">
                    <div className="relative w-full max-w-md">
                        {/* Animation Container */}
                        <div className="aspect-square relative flex items-center justify-center">

                            {/* Central Conversion Hub */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-dashed border-current/20"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-8 rounded-full border border-dashed border-current/20 opacity-50"
                            />

                            <div className="relative z-10 bg-gradient-to-br from-green-400 to-emerald-600 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                                <RefreshCw size={40} className="text-white animate-spin-slow" />
                            </div>

                            {/* Floating Icons */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 left-10 bg-white dark:bg-[#2A2A2B] p-3 rounded-xl shadow-lg"
                            >
                                <span className="font-bold text-xs">JPG</span>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 right-10 bg-white dark:bg-[#2A2A2B] p-3 rounded-xl shadow-lg"
                            >
                                <span className="font-bold text-xs">PNG</span>
                            </motion.div>
                            <motion.div
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute top-1/2 right-0 bg-white dark:bg-[#2A2A2B] p-3 rounded-xl shadow-lg"
                            >
                                <span className="font-bold text-xs">PDF</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
