import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    imageUrl: string;
    slug: string;
}

export function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <div className="relative h-full flex flex-col rounded-3xl overflow-hidden glass hover:bg-white/10 transition-colors border border-white/10">
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden">
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${post.imageUrl})` }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono uppercase tracking-wider text-brand-orange">
                            {post.category}
                        </span>
                        <span className="text-xs text-white/40 font-mono">
                            {post.date}
                        </span>
                    </div>

                    <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-brand-orange transition-colors">
                        {post.title}
                    </h3>

                    <p className="text-white/60 mb-8 flex-1 leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-bold mt-auto group/btn">
                        Read Article
                        <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
