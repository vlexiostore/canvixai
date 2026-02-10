"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TOOLS_CATALOG } from '@/lib/tools';
import {
    LayoutGrid,
    Folder,
    FileText,
    Sparkles,
    Image as ImageIcon,
    Settings,
    Search,
    Bell,
    Plus,
    MoreVertical,
    Download,
    Wand2,
    Maximize2,
    Eraser,
    Layers,
    Zap,
    Star,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('home');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Real data from API (with fallback defaults)
    const [user, setUser] = useState({
        name: 'User',
        plan: 'FREE',
        credits: { used: 0, total: 50 },
    });
    const [projects, setProjects] = useState<{ id: string | number; name: string; images: number; updated: string; starred: boolean }[]>([]);

    // Fetch user credits from API
    const fetchCredits = useCallback(async () => {
        try {
            const res = await fetch('/api/credits/balance');
            const json = await res.json();
            if (json.success) {
                setUser(prev => ({
                    ...prev,
                    plan: json.data.plan?.toUpperCase() || prev.plan,
                    credits: {
                        used: json.data.used,
                        total: json.data.used + json.data.balance,
                    },
                }));
            }
        } catch { /* use defaults */ }
    }, []);

    // Fetch projects from API
    const fetchProjects = useCallback(async () => {
        try {
            const res = await fetch('/api/projects');
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                setProjects(json.data.map((p: { id: string; name: string; fileCount: number; updatedAt: string; isStarred: boolean }) => ({
                    id: p.id,
                    name: p.name,
                    images: p.fileCount,
                    updated: new Date(p.updatedAt).toLocaleDateString(),
                    starred: p.isStarred,
                })));
            }
        } catch { /* use defaults */ }
    }, []);

    useEffect(() => {
        fetchCredits();
        fetchProjects();
    }, [fetchCredits, fetchProjects]);

    const stats = [
        { label: 'Projects', value: String(projects.length), change: '', icon: Folder },
        { label: 'Credits Used', value: String(user.credits.used), change: `${user.credits.total - user.credits.used} remaining`, icon: Sparkles },
        { label: 'Plan', value: user.plan, change: '', icon: Star },
        { label: 'Storage', value: '-', change: '', icon: Download },
    ];

    const templates = [
        { id: 1, name: 'Instagram Post', category: 'Social', size: '1080×1080' },
        { id: 2, name: 'YouTube Thumbnail', category: 'Social', size: '1280×720' },
        { id: 3, name: 'LinkedIn Banner', category: 'Social', size: '1584×396' },
        { id: 4, name: 'Story Template', category: 'Social', size: '1080×1920' },
        { id: 5, name: 'Product Card', category: 'E-commerce', size: '800×800' },
        { id: 6, name: 'Sale Banner', category: 'Marketing', size: '1200×628' },
    ];

    const navItems = [
        { id: 'home', icon: LayoutGrid, label: 'Home' },
        { id: 'projects', icon: Folder, label: 'Projects' },
        { id: 'templates', icon: FileText, label: 'Templates' },
        { id: 'ai-tools', icon: Sparkles, label: 'AI Tools' },
        { id: 'gallery', icon: ImageIcon, label: 'My Images' },
    ];

    return (
        <div className="flex min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-72 bg-black border-r border-white/10 flex flex-col z-50">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xl">C</div>
                    <span className="text-xl font-bold tracking-tight">Canvix</span>
                </div>

                <div className="px-4 mb-6">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="w-full py-4 px-4 bg-white text-black rounded-xl font-bold text-sm tracking-wide hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Plus size={18} className="group-hover:scale-110 transition-transform" />
                        CREATE NEW
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'opacity-70'} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all">
                        <Settings size={20} className="opacity-70" />
                        Settings
                    </button>
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">A</div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate">{user.name}</div>
                                <div className="text-xs text-white/50">{user.plan} Plan</div>
                            </div>
                        </div>
                        <div className="text-xs text-white/40 flex justify-between mb-1">
                            <span>Credits</span>
                            <span>{user.credits.total - user.credits.used} left</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full"
                                style={{ width: `${(user.credits.used / user.credits.total) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 min-h-screen bg-black relative">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-8 py-5 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-3 rounded-full hover:bg-white/5 transition-colors relative">
                            <Bell size={20} className="text-white/70" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full" />
                        </button>
                    </div>
                </header>

                <div className="p-8 pb-32 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {/* Home Tab */}
                        {activeTab === 'home' && (
                            <motion.div
                                key="home"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-12"
                            >
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                                        <p className="text-white/50">Welcome back, {user.name.split(' ')[0]}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {stats.map((stat, i) => {
                                        const Icon = stat.icon;
                                        return (
                                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="p-3 rounded-xl bg-white/10 text-white group-hover:bg-white group-hover:text-black transition-colors">
                                                        <Icon size={24} />
                                                    </div>
                                                    <span className="text-xs font-medium text-white/40">{stat.change}</span>
                                                </div>
                                                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                                <div className="text-sm text-white/50">{stat.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold">Quick Actions</h2>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { icon: Download, label: 'Upload Image' },
                                            { icon: FileText, label: 'Use Template' },
                                            { icon: Sparkles, label: 'AI Generate' },
                                            { icon: Eraser, label: 'Remove BG' },
                                        ].map((action, i) => {
                                            const Icon = action.icon;
                                            return (
                                                <button key={i} className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group gap-4">
                                                    <Icon size={32} strokeWidth={1.5} className="opacity-70 group-hover:opacity-100" />
                                                    <span className="font-bold text-sm">{action.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold">Recent Projects</h2>
                                        <button onClick={() => setActiveTab('projects')} className="text-sm font-medium text-white/50 hover:text-white transition-colors">View All</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {projects.map((project) => (
                                            <div key={project.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                                                <div className="w-24 h-24 rounded-xl bg-white/5 relative overflow-hidden flex items-center justify-center">
                                                    {/* Placeholder for project thumbnail */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-50 group-hover:scale-110 transition-transform" />
                                                    <div className="text-2xl font-bold text-white/20">{project.name.charAt(0)}</div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-bold group-hover:text-white transition-colors">{project.name}</h3>
                                                        {project.starred && <Star size={16} className="text-white fill-white" />}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-white/40">
                                                        <span>{project.images} images</span>
                                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                                        <span>{project.updated}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-end justify-between mb-8">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">My Projects</h1>
                                        <p className="text-white/50">{projects.length} active projects</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projects.map((project) => (
                                        <div key={project.id} className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all cursor-pointer">
                                            <div className="aspect-[4/3] rounded-xl bg-white/5 mb-4 relative overflow-hidden group-hover:shadow-2xl transition-all">
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                                                {project.starred && (
                                                    <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-lg">
                                                        <Star size={14} className="text-white fill-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg mb-1">{project.name}</h3>
                                                <div className="flex items-center justify-between text-sm text-white/50">
                                                    <span>{project.images} items</span>
                                                    <span>{project.updated}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Add New Placeholder */}
                                    <button onClick={() => setShowCreateModal(true)} className="flex flex-col items-center justify-center aspect-[4/3] rounded-2xl border border-dashed border-white/20 hover:border-white hover:bg-white/5 transition-all gap-4 text-white/50 hover:text-white group">
                                        <div className="p-4 rounded-full bg-white/5 group-hover:scale-110 transition-transform">
                                            <Plus size={24} />
                                        </div>
                                        <span className="font-medium">Create New Project</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* AI Tools - same catalog as /tools */}
                        {activeTab === 'ai-tools' && (
                            <motion.div
                                key="ai-tools"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-end justify-between mb-12">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">AI Tools</h1>
                                        <p className="text-white/50">All creative tools in one place</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {TOOLS_CATALOG.map((tool) => {
                                        const Icon = tool.icon;
                                        return (
                                            <Link
                                                key={tool.id}
                                                href={tool.href}
                                                className="block p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group cursor-pointer relative overflow-hidden"
                                            >
                                                {tool.credits != null && (
                                                    <div className="absolute top-6 right-6 px-3 py-1 rounded-full border border-white/20 text-xs font-mono opacity-50 group-hover:border-black/20 group-hover:text-black/70">
                                                        {tool.credits} CREDITS
                                                    </div>
                                                )}
                                                <div className={`w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-black/10 transition-colors ${tool.color}`}>
                                                    <Icon size={32} />
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2">{tool.title}</h3>
                                                <p className="text-white/50 group-hover:text-black/60 mb-8 max-w-sm">{tool.description}</p>
                                                <div className="flex items-center gap-2 font-bold text-sm">
                                                    Launch Tool <Wand2 size={16} />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Templates Tab */}
                        {activeTab === 'templates' && (
                            <motion.div
                                key="templates"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-end justify-between mb-8">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">Templates</h1>
                                        <p className="text-white/50">Start with a professional design</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                                    {['All', 'Social Media', 'Marketing', 'E-commerce', 'Print'].map((cat, i) => (
                                        <button
                                            key={cat}
                                            className={`px-6 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${i === 0
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent text-white/70 border-white/10 hover:border-white/50 hover:text-white'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {templates.map((template) => (
                                        <div key={template.id} className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-white/30 transition-all">
                                            <div className="aspect-[4/5] bg-white/5 flex items-center justify-center relative">
                                                <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 opacity-50 transition-opacity">
                                                    <Maximize2 size={32} className="text-white/20" />
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-sm mb-1">{template.name}</h3>
                                                <p className="text-xs text-white/50">{template.size}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Gallery Tab (Placeholder) */}
                        {activeTab === 'gallery' && (
                            <motion.div
                                key="gallery"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <ImageIcon size={40} className="opacity-50" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Your Gallery is Empty</h2>
                                <p className="text-white/50 mb-8 max-w-md">Upload images or generate new ones using our AI tools to start building your collection.</p>
                                <button onClick={() => setShowCreateModal(true)} className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                                    Upload Images
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-3xl p-8 z-[70] shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold">Create New</h2>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { icon: Folder, title: 'Blank Project', desc: 'Start from scratch' },
                                    { icon: FileText, title: 'From Template', desc: 'Browse templates' },
                                    { icon: Download, title: 'Upload Image', desc: 'Edit existing file' },
                                    { icon: Sparkles, title: 'AI Generate', desc: 'Text to image' },
                                ].map((option, i) => {
                                    const Icon = option.icon;
                                    return (
                                        <button key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all text-left group">
                                            <div className="p-3 rounded-xl bg-white/10 group-hover:bg-black/10 transition-colors">
                                                <Icon size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-1">{option.title}</h3>
                                                <p className="text-sm opacity-50 group-hover:opacity-70">{option.desc}</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h3 className="text-sm font-bold opacity-50 mb-4 uppercase tracking-wider">Common Sizes</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Instagram Post', 'Story', 'YouTube', 'Facebook Cover', 'A4 Print', 'Custom Size'].map((size) => (
                                        <button key={size} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white hover:text-black transition-all">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
