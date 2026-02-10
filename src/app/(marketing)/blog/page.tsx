import { Section } from "@/components/ui/section";
import { BlogCard } from "@/components/blog/blog-card";

const MOCK_POSTS = [
    {
        id: "1",
        title: "The Future of AI Image Generation",
        excerpt: "Exploring how generative AI is reshaping the landscape of digital art and design workflows.",
        date: "Oct 12, 2023",
        category: "AI Trends",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
        slug: "future-of-ai-image-gen"
    },
    {
        id: "2",
        title: "Mastering Photo Composition",
        excerpt: "Tips and tricks from professional photographers on how to frame the perfect shot every time.",
        date: "Oct 08, 2023",
        category: "Photography",
        imageUrl: "https://images.unsplash.com/photo-1552168324-d612d3882543?q=80&w=2070&auto=format&fit=crop",
        slug: "mastering-photo-composition"
    },
    {
        id: "3",
        title: "5 Tools to Boost Your Creativity",
        excerpt: "A curated list of digital tools that will help you overcome creative block and produce your best work.",
        date: "Sep 25, 2023",
        category: "Productivity",
        imageUrl: "https://images.unsplash.com/photo-1499750310159-5420f76b245d?q=80&w=1965&auto=format&fit=crop",
        slug: "5-tools-boost-creativity"
    },
    {
        id: "4",
        title: "Design Systems 101",
        excerpt: "Everything you need to know about building scalable and consistent design systems for your products.",
        date: "Sep 15, 2023",
        category: "Design",
        imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e0b7a9?q=80&w=2070&auto=format&fit=crop",
        slug: "design-systems-101"
    },
    {
        id: "5",
        title: "From Concept to Reality",
        excerpt: "A case study on how we used AI to prototype and launch a new product feature in record time.",
        date: "Sep 01, 2023",
        category: "Case Study",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
        slug: "concept-to-reality"
    },
    {
        id: "6",
        title: "Understanding Color Theory",
        excerpt: "How to use color psychology to evoke emotion and create more impactful visual designs.",
        date: "Aug 20, 2023",
        category: "Design Theory",
        imageUrl: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?q=80&w=2070&auto=format&fit=crop",
        slug: "color-theory"
    }
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-[#0A0A0B] text-white">
            {/* Blog Hero */}
            <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="font-display font-extrabold text-5xl md:text-7xl mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                            Canvix Blog
                        </span>
                    </h1>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        Insights, tutorials, and news from the world of AI creativity.
                    </p>
                </div>

                {/* Decorative Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand-violet/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
            </section>

            {/* Blog Grid */}
            <Section className="py-20" theme="dark">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MOCK_POSTS.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </Section>

            {/* Newsletter / CTA */}
            <section className="py-32 px-6 lg:px-12 border-t border-white/10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display font-bold text-4xl mb-4">Stay in the loop</h2>
                    <p className="text-white/50 mb-8">Get the latest updates and tips directly to your inbox.</p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/50 transition-colors"
                        />
                        <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
