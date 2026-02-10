"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TOOLS_CATALOG } from '@/lib/tools';
import {
    LayoutGrid,
    Folder,
    Sparkles,
    Settings,
    Search,
    Bell,
    Plus,
    Download,
    Wand2,
    Eraser,
    Star,
    Menu,
    X,
    Library,
    Image as ImageIcon,
    Video,
    Play,
    Eye,
    ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LibraryItem {
    id: string;
    source: string;
    type: 'image' | 'video';
    url: string;
    thumbnailUrl: string;
    prompt: string;
    model: string;
    createdAt: string;
}

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('home');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(false);
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // ── Real data from API ──
    const [user, setUser] = useState({ name: 'User', plan: 'FREE', credits: { used: 0, total: 50 } });
    const [projects, setProjects] = useState<{ id: string | number; name: string; images: number; updated: string; starred: boolean }[]>([]);
    const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
    const [libraryFilter, setLibraryFilter] = useState<'all' | 'image' | 'video'>('all');
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);

    const fetchCredits = useCallback(async () => {
        try {
            const res = await fetch('/api/credits/balance');
            const json = await res.json();
            if (json.success) {
                setUser(prev => ({
                    ...prev,
                    name: json.data.name || prev.name,
                    plan: json.data.plan?.toUpperCase() || prev.plan,
                    credits: { used: json.data.used, total: json.data.used + json.data.balance },
                }));
            }
        } catch { /* fallback */ }
    }, []);

    const fetchProjects = useCallback(async () => {
        try {
            const res = await fetch('/api/projects');
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                setProjects(json.data.map((p: { id: string; name: string; fileCount: number; updatedAt: string; isStarred: boolean }) => ({
                    id: p.id, name: p.name, images: p.fileCount,
                    updated: new Date(p.updatedAt).toLocaleDateString(), starred: p.isStarred,
                })));
            }
        } catch { /* fallback */ }
    }, []);

    const fetchLibrary = useCallback(async () => {
        setLibraryLoading(true);
        try {
            const typeParam = libraryFilter === 'all' ? '' : `?type=${libraryFilter}`;
            const res = await fetch(`/api/library${typeParam}`);
            const json = await res.json();
            if (json.success) setLibraryItems(json.data.items || []);
        } catch { /* fallback */ }
        setLibraryLoading(false);
    }, [libraryFilter]);

    useEffect(() => { fetchCredits(); fetchProjects(); }, [fetchCredits, fetchProjects]);
    useEffect(() => { if (activeTab === 'library') fetchLibrary(); }, [activeTab, fetchLibrary]);

    const handleDownload = async (url: string, filename: string) => {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        } catch {
            window.open(url, "_blank");
        }
    };

    const stats = [
        { label: 'Projects', value: String(projects.length), change: '', icon: Folder },
        { label: 'Credits Used', value: String(user.credits.used), change: `${user.credits.total - user.credits.used} remaining`, icon: Sparkles },
        { label: 'Plan', value: user.plan, change: '', icon: Star },
        { label: 'Library', value: String(libraryItems.length), change: '', icon: Library },
    ];

    const navItems = [
        { id: 'home', icon: LayoutGrid, label: 'Home' },
        { id: 'projects', icon: Folder, label: 'Projects' },
        { id: 'ai-tools', icon: Sparkles, label: 'AI Tools' },
        { id: 'library', icon: Library, label: 'Library' },
    ];

    const handleTabChange = (id: string) => { setActiveTab(id); if (isMobile) setSidebarOpen(false); };

    const sidebarContent = (
        <aside className={`${isMobile ? 'fixed inset-y-0 left-0 w-[280px] z-50' : 'fixed left-0 top-0 h-screen w-72 z-50'} bg-black border-r border-white/10 flex flex-col`}>
            <div className="p-5 lg:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg lg:text-xl">C</div>
                    <span className="text-lg lg:text-xl font-bold tracking-tight">Canvix</span>
                </div>
                {isMobile && <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-white/60 hover:text-white"><X size={20} /></button>}
            </div>
            <div className="px-4 mb-6">
                <Link href="/tools/studio" className="w-full py-3.5 lg:py-4 px-4 bg-white text-black rounded-xl font-bold text-sm tracking-wide hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group">
                    <Plus size={18} className="group-hover:scale-110 transition-transform" />CREATE NEW
                </Link>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button key={item.id} onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                            <Icon size={20} className={isActive ? 'text-white' : 'opacity-70'} />{item.label}
                        </button>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all">
                    <Settings size={20} className="opacity-70" />Settings
                </button>
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">{user.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">{user.name}</div>
                            <div className="text-xs text-white/50">{user.plan} Plan</div>
                        </div>
                    </div>
                    <div className="text-xs text-white/40 flex justify-between mb-1"><span>Credits</span><span>{user.credits.total - user.credits.used} left</span></div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${Math.min((user.credits.used / Math.max(user.credits.total, 1)) * 100, 100)}%` }} />
                    </div>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="flex min-h-[100dvh] bg-black text-white font-sans selection:bg-white selection:text-black">
            {!isMobile && sidebarContent}
            {isMobile && sidebarOpen && (<><div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />{sidebarContent}</>)}

            <main className={`flex-1 ${isMobile ? '' : 'ml-72'} min-h-[100dvh] bg-black relative`}>
                <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex items-center justify-between gap-3">
                    {isMobile && <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/5 transition-colors shrink-0"><Menu size={22} className="text-white/70" /></button>}
                    <div className="relative flex-1 max-w-sm lg:max-w-md xl:w-96">
                        <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input type="text" placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-full pl-9 lg:pl-12 pr-4 lg:pr-6 py-2.5 lg:py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <button className="p-2.5 lg:p-3 rounded-full hover:bg-white/5 transition-colors relative">
                            <Bell size={18} className="text-white/70" /><span className="absolute top-2.5 right-2.5 lg:top-3 lg:right-3 w-2 h-2 bg-white rounded-full" />
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-32 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {/* ═══ Home Tab ═══ */}
                        {activeTab === 'home' && (
                            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8 lg:space-y-12">
                                <div><h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 lg:mb-2">Dashboard</h1><p className="text-sm lg:text-base text-white/50">Welcome back, {user.name.split(' ')[0]}</p></div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                    {stats.map((stat, i) => { const Icon = stat.icon; return (
                                        <div key={i} className="p-4 lg:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                            <div className="flex items-start justify-between mb-3 lg:mb-4">
                                                <div className="p-2 lg:p-3 rounded-xl bg-white/10 text-white group-hover:bg-white group-hover:text-black transition-colors"><Icon size={20} /></div>
                                                {stat.change && <span className="text-[10px] lg:text-xs font-medium text-white/40 hidden sm:block">{stat.change}</span>}
                                            </div>
                                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-0.5 lg:mb-1">{stat.value}</div>
                                            <div className="text-xs lg:text-sm text-white/50">{stat.label}</div>
                                        </div>
                                    ); })}
                                </div>
                                <section>
                                    <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Quick Actions</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                                        {[
                                            { icon: Sparkles, label: 'AI Studio', href: '/tools/studio' },
                                            { icon: Wand2, label: 'AI Chat', href: '/tools/chat' },
                                            { icon: Eraser, label: 'Remove BG', href: '/tools/remove-bg' },
                                            { icon: Library, label: 'My Library', action: () => setActiveTab('library') },
                                        ].map((action, i) => {
                                            const Icon = action.icon;
                                            const inner = (
                                                <div className="flex flex-col items-center justify-center p-5 lg:p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group gap-3 lg:gap-4 w-full">
                                                    <Icon size={24} strokeWidth={1.5} className="opacity-70 group-hover:opacity-100" />
                                                    <span className="font-bold text-xs lg:text-sm text-center">{action.label}</span>
                                                </div>
                                            );
                                            if (action.href) return <Link key={i} href={action.href}>{inner}</Link>;
                                            return <button key={i} onClick={action.action}>{inner}</button>;
                                        })}
                                    </div>
                                </section>
                                {projects.length > 0 && (
                                    <section>
                                        <div className="flex items-center justify-between mb-4 lg:mb-6">
                                            <h2 className="text-lg lg:text-xl font-bold">Recent Projects</h2>
                                            <button onClick={() => setActiveTab('projects')} className="text-sm font-medium text-white/50 hover:text-white transition-colors">View All</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            {projects.slice(0, 4).map((project) => (
                                                <div key={project.id} className="group flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                                                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><div className="text-lg lg:text-2xl font-bold text-white/20">{project.name.charAt(0)}</div></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1"><h3 className="font-bold text-sm lg:text-base truncate">{project.name}</h3>{project.starred && <Star size={14} className="text-white fill-white shrink-0 ml-2" />}</div>
                                                        <div className="flex items-center gap-2 text-xs text-white/40"><span>{project.images} images</span><span className="w-1 h-1 rounded-full bg-white/20" /><span>{project.updated}</span></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </motion.div>
                        )}

                        {/* ═══ Projects Tab ═══ */}
                        {activeTab === 'projects' && (
                            <motion.div key="projects" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
                                <div className="mb-6 lg:mb-8"><h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">My Projects</h1><p className="text-sm text-white/50">{projects.length} projects</p></div>
                                {projects.length === 0 ? (
                                    <div className="text-center py-20"><Folder size={48} className="mx-auto mb-4 text-white/20" /><h2 className="text-xl font-bold mb-2">No projects yet</h2><p className="text-white/50 mb-6">Create a project to get started</p><Link href="/tools/studio" className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors inline-block">Start Creating</Link></div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                        {projects.map((project) => (
                                            <div key={project.id} className="group p-3 lg:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all cursor-pointer">
                                                <div className="aspect-[4/3] rounded-xl bg-white/5 mb-3 lg:mb-4 relative overflow-hidden">{project.starred && <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-lg"><Star size={14} className="text-white fill-white" /></div>}</div>
                                                <h3 className="font-bold text-base mb-1">{project.name}</h3>
                                                <div className="flex items-center justify-between text-xs text-white/50"><span>{project.images} items</span><span>{project.updated}</span></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ═══ AI Tools Tab ═══ */}
                        {activeTab === 'ai-tools' && (
                            <motion.div key="ai-tools" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
                                <div className="mb-8 lg:mb-12"><h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">AI Tools</h1><p className="text-sm text-white/50">All creative tools in one place</p></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                    {TOOLS_CATALOG.map((tool) => { const Icon = tool.icon; return (
                                        <Link key={tool.id} href={tool.href} className="block p-5 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group cursor-pointer relative overflow-hidden">
                                            {tool.credits != null && <div className="absolute top-4 right-4 lg:top-6 lg:right-6 px-2 lg:px-3 py-1 rounded-full border border-white/20 text-[10px] lg:text-xs font-mono opacity-50 group-hover:border-black/20 group-hover:text-black/70">{tool.credits} CREDITS</div>}
                                            <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-black/10 transition-colors ${tool.color}`}><Icon size={24} /></div>
                                            <h3 className="text-lg lg:text-2xl font-bold mb-1 lg:mb-2">{tool.title}</h3>
                                            <p className="text-sm text-white/50 group-hover:text-black/60 mb-4 lg:mb-8 max-w-sm">{tool.description}</p>
                                            <div className="flex items-center gap-2 font-bold text-xs lg:text-sm">Launch Tool <Wand2 size={14} /></div>
                                        </Link>
                                    ); })}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ Library Tab ═══ */}
                        {activeTab === 'library' && (
                            <motion.div key="library" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 lg:mb-8 gap-4">
                                    <div><h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">Library</h1><p className="text-sm text-white/50">All your generated and uploaded media</p></div>
                                    <div className="flex gap-2">
                                        {(['all', 'image', 'video'] as const).map((f) => (
                                            <button key={f} onClick={() => setLibraryFilter(f)}
                                                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all capitalize ${libraryFilter === f ? 'bg-white text-black border-white' : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'}`}>
                                                {f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {libraryLoading ? (
                                    <div className="text-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" /><p className="text-white/50">Loading library...</p></div>
                                ) : libraryItems.length === 0 ? (
                                    <div className="text-center py-20">
                                        <Library size={48} className="mx-auto mb-4 text-white/20" />
                                        <h2 className="text-xl font-bold mb-2">Library is empty</h2>
                                        <p className="text-white/50 mb-6 max-w-md mx-auto">Generate images or videos using the AI Studio and they'll show up here for you to preview and download.</p>
                                        <Link href="/tools/studio" className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors inline-block">Go to AI Studio</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                                        {libraryItems.map((item) => (
                                            <div key={item.id} className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 transition-all cursor-pointer" onClick={() => setPreviewItem(item)}>
                                                <div className="aspect-square relative overflow-hidden bg-black">
                                                    {item.type === 'image' ? (
                                                        <img src={item.thumbnailUrl} alt={item.prompt || 'Generated'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    ) : (
                                                        <div className="w-full h-full relative">
                                                            <img src={item.thumbnailUrl} alt={item.prompt || 'Generated'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                            <div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"><Play size={16} className="text-black ml-0.5" /></div></div>
                                                        </div>
                                                    )}
                                                    {/* Hover overlay */}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors" title="Preview"><Eye size={18} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); const ext = item.type === 'video' ? 'mp4' : 'png'; handleDownload(item.url, `canvix-${item.id}.${ext}`); }}
                                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors" title="Download"><Download size={18} /></button>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {item.type === 'video' ? <Video size={12} className="text-purple-400" /> : <ImageIcon size={12} className="text-orange-400" />}
                                                        <span className="text-[10px] text-white/40 capitalize">{item.source}</span>
                                                    </div>
                                                    <p className="text-xs text-white/60 truncate">{item.prompt || 'Uploaded file'}</p>
                                                    <p className="text-[10px] text-white/30 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* ═══ Preview Modal ═══ */}
            <AnimatePresence>
                {previewItem && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewItem(null)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60]" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 sm:inset-8 lg:inset-16 z-[70] flex flex-col items-center justify-center">
                            <div className="relative max-w-4xl w-full max-h-full flex flex-col items-center">
                                <button onClick={() => setPreviewItem(null)} className="absolute -top-10 right-0 p-2 text-white/60 hover:text-white transition-colors"><X size={24} /></button>
                                {previewItem.type === 'image' ? (
                                    <img src={previewItem.url} alt={previewItem.prompt || 'Preview'} className="max-w-full max-h-[70vh] rounded-2xl object-contain" />
                                ) : (
                                    <video src={previewItem.url} controls autoPlay className="max-w-full max-h-[70vh] rounded-2xl" />
                                )}
                                <div className="mt-4 flex items-center gap-4">
                                    {previewItem.prompt && <p className="text-sm text-white/60 max-w-md truncate">{previewItem.prompt}</p>}
                                    <button onClick={() => { const ext = previewItem.type === 'video' ? 'mp4' : 'png'; handleDownload(previewItem.url, `canvix-${previewItem.id}.${ext}`); }}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shrink-0"><Download size={16} /> Download</button>
                                    <a href={previewItem.url} target="_blank" rel="noopener noreferrer" className="p-2 text-white/60 hover:text-white transition-colors"><ExternalLink size={18} /></a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ═══ Create Modal ═══ */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-3 right-3 top-[10%] sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 z-[70] shadow-2xl max-h-[80dvh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl lg:text-3xl font-bold">Create New</h2><button onClick={() => setShowCreateModal(false)} className="p-2 rounded-full hover:bg-white/10"><Plus size={20} className="rotate-45" /></button></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {[
                                    { icon: Sparkles, title: 'AI Studio', desc: 'Generate images & videos', href: '/tools/studio' },
                                    { icon: Wand2, title: 'AI Chat', desc: 'Chat with Canvix AI', href: '/tools/chat' },
                                    { icon: Eraser, title: 'Remove BG', desc: 'Remove backgrounds', href: '/tools/remove-bg' },
                                    { icon: Download, title: 'Upload', desc: 'Upload your files', href: '/tools/studio' },
                                ].map((option, i) => {
                                    const Icon = option.icon;
                                    return <Link key={i} href={option.href} className="flex items-start gap-3 p-4 lg:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all text-left group">
                                        <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-black/10 shrink-0"><Icon size={20} /></div>
                                        <div><h3 className="font-bold text-sm mb-0.5">{option.title}</h3><p className="text-xs opacity-50 group-hover:opacity-70">{option.desc}</p></div>
                                    </Link>;
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
