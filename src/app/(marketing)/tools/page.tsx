
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOOLS_CATALOG } from "@/lib/tools";

export default function ToolsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                        Creative AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-pink">Tools</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Unleash your creativity with our suite of powerful AI tools. Generate, edit, and enhance content like never before.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TOOLS_CATALOG.map((tool) => (
                        <Link
                            key={tool.id}
                            href={tool.href}
                            className="group relative p-8 rounded-3xl glass border border-white/10 hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-1 block"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${tool.color}`}>
                                    <tool.icon size={24} />
                                </div>

                                <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-white transition-colors">
                                    {tool.title}
                                </h3>

                                <p className="text-white/60 mb-6 line-clamp-2">
                                    {tool.description}
                                </p>

                                <div className="flex items-center text-sm font-bold text-white/40 group-hover:text-brand-orange transition-colors">
                                    Open Tool
                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
