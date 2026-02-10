import Link from "next/link";
import { Twitter, Instagram, Youtube, User } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative z-10 px-5 sm:px-6 lg:px-12 py-10 sm:py-16 border-t border-white/5 bg-[#0A0A0B]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-10 md:mb-12">
                    <div className="col-span-2 sm:col-span-2 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <span className="font-display font-bold text-2xl">
                                Canvix<span className="text-brand-orange">.ai</span>
                            </span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                            The all-in-one AI creative platform for designers, creators, and dreamers.
                            Hand-crafted interfaces for next-gen creation.
                        </p>
                    </div>

                    {[
                        { title: "Product", links: ["Features", "Templates", "Pricing", "API"] },
                        { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
                        { title: "Support", links: ["Help Center", "Contact", "Status", "Terms"] },
                    ].map((col, i) => (
                        <div key={i}>
                            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/60">
                                {col.title}
                            </h4>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5">
                    <p className="text-white/30 text-sm">© 2025 Canvix.ai. All rights reserved.</p>
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                        <Link href="#" className="text-white/30 hover:text-white transition-colors"><Twitter size={20} /></Link>
                        <Link href="#" className="text-white/30 hover:text-white transition-colors"><User size={20} /></Link> {/* Discord placeholder */}
                        <Link href="#" className="text-white/30 hover:text-white transition-colors"><Youtube size={20} /></Link>
                        <Link href="#" className="text-white/30 hover:text-white transition-colors"><Instagram size={20} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
