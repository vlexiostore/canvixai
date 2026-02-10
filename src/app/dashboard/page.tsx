"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    MessageSquare,
    Paintbrush,
    ChevronDown,
    LogOut,
    User,
    CreditCard,
    Shield,
    Palette,
    Moon,
    Globe,
    Trash2,
    Save,
    Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false });

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
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('home');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

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

    // Close profile dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Real data from API ──
    const [user, setUser] = useState({ name: 'User', email: '', plan: 'FREE', credits: { used: 0, total: 50 } });
    const [projects, setProjects] = useState<{ id: string | number; name: string; images: number; updated: string; starred: boolean }[]>([]);
    const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
    const [recentMedia, setRecentMedia] = useState<LibraryItem[]>([]);
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
                    email: json.data.email || prev.email,
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

    const fetchLibrary = useCallback(async (filter?: string) => {
        setLibraryLoading(true);
        try {
            const typeParam = (filter || libraryFilter) === 'all' ? '' : `?type=${filter || libraryFilter}`;
            const res = await fetch(`/api/library${typeParam}`);
            const json = await res.json();
            if (json.success) {
                const items = json.data.items || [];
                setLibraryItems(items);
                return items;
            }
        } catch { /* fallback */ }
        setLibraryLoading(false);
        return [];
    }, [libraryFilter]);

    // Fetch recent media for home page
    const fetchRecentMedia = useCallback(async () => {
        try {
            const res = await fetch('/api/library?limit=6');
            const json = await res.json();
            if (json.success) setRecentMedia(json.data.items?.slice(0, 6) || []);
        } catch { /* fallback */ }
    }, []);

    useEffect(() => { fetchCredits(); fetchProjects(); fetchRecentMedia(); }, [fetchCredits, fetchProjects, fetchRecentMedia]);

    useEffect(() => {
        if (activeTab === 'library') {
            fetchLibrary().then(() => setLibraryLoading(false));
        }
    }, [activeTab, fetchLibrary]);

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
        } catch { window.open(url, "_blank"); }
    };

    const stats = [
        { label: 'Projects', value: String(projects.length), change: '', icon: Folder },
        { label: 'Credits Used', value: String(user.credits.used), change: `${user.credits.total - user.credits.used} remaining`, icon: Sparkles },
        { label: 'Plan', value: user.plan, change: '', icon: Star },
        { label: 'Library', value: String(recentMedia.length || libraryItems.length), change: '', icon: Library },
    ];

    const navItems = [
        { id: 'home', icon: LayoutGrid, label: 'Home' },
        { id: 'projects', icon: Folder, label: 'Projects' },
        { id: 'ai-tools', icon: Sparkles, label: 'AI Tools' },
        { id: 'library', icon: Library, label: 'Library' },
    ];

    const toolLinks = [
        { icon: Paintbrush, label: 'Creative Studio', href: '/tools/studio' },
        { icon: MessageSquare, label: 'AI Chat', href: '/tools/chat' },
        { icon: ImageIcon, label: 'Image Gen', href: '/tools/studio' },
        { icon: Video, label: 'Video Gen', href: '/tools/studio' },
    ];

    const handleTabChange = (id: string) => { setActiveTab(id); if (isMobile) setSidebarOpen(false); };

    // ── Settings state ──
    const [settingsSaved, setSettingsSaved] = useState(false);

    const sidebarContent = (
        <aside className={`${isMobile ? 'fixed inset-y-0 left-0 w-[280px] z-50' : 'fixed left-0 top-0 h-screen w-72 z-50'} bg-black border-r border-white/10 flex flex-col`}>
            <div className="p-5 lg:p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg lg:text-xl">C</div>
                    <span className="text-lg lg:text-xl font-bold tracking-tight">Canvix</span>
                </Link>
                {isMobile && <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-white/60 hover:text-white"><X size={20} /></button>}
            </div>

            {/* Create button */}
            <div className="px-4 mb-4">
                <Link href="/tools/studio" className="w-full py-3.5 lg:py-4 px-4 bg-white text-black rounded-xl font-bold text-sm tracking-wide hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group">
                    <Plus size={18} className="group-hover:scale-110 transition-transform" />CREATE NEW
                </Link>
            </div>

            {/* Main nav */}
            <nav className="px-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button key={item.id} onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                            <Icon size={18} className={isActive ? 'text-white' : 'opacity-70'} />{item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Tool shortcuts */}
            <div className="px-4 mt-6">
                <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold px-4 mb-2">Tools</div>
                <div className="space-y-0.5">
                    {toolLinks.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link key={tool.label} href={tool.href}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all">
                                <Icon size={16} className="opacity-60" />{tool.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Bottom: Settings + User card */}
            <div className="mt-auto p-4 border-t border-white/10">
                <button onClick={() => handleTabChange('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                    <Settings size={18} className="opacity-70" />Settings
                </button>
                <div className="mt-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center font-bold text-xs text-white">{user.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">{user.name}</div>
                            <div className="text-[10px] text-white/40">{user.plan} Plan</div>
                        </div>
                    </div>
                    <div className="text-[10px] text-white/40 flex justify-between mb-1"><span>Credits</span><span>{user.credits.total - user.credits.used} left</span></div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-orange-400 rounded-full" style={{ width: `${Math.min((user.credits.used / Math.max(user.credits.total, 1)) * 100, 100)}%` }} />
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
                {/* Aurora ambient background */}
                <div className="fixed inset-0 z-0 opacity-30 pointer-events-none" style={isMobile ? undefined : { left: '18rem' }}>
                    <Aurora colorStops={["#9429ff", "#1a1a2e", "#312b88"]} amplitude={0.8} blend={0.6} speed={0.4} />
                </div>

                {/* ═══ Header with profile dropdown ═══ */}
                <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between gap-3">
                    {isMobile && <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/5 transition-colors shrink-0"><Menu size={22} className="text-white/70" /></button>}
                    <div className="relative flex-1 max-w-sm lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input type="text" placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors" />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button className="p-2.5 rounded-full hover:bg-white/5 transition-colors relative">
                            <Bell size={18} className="text-white/70" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full" />
                        </button>

                        {/* Profile dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-white/5 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-xs font-bold">{user.name.charAt(0)}</div>
                                <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                                <ChevronDown size={14} className={`text-white/50 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                                    >
                                        {/* User info */}
                                        <div className="p-4 border-b border-white/[0.06]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center font-bold text-sm">{user.name.charAt(0)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm truncate">{user.name}</div>
                                                    <div className="text-xs text-white/40 truncate">{user.email || 'user@canvix.ai'}</div>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between text-xs">
                                                <span className="text-white/40">{user.plan} Plan</span>
                                                <span className="text-purple-400 font-medium">{user.credits.total - user.credits.used} credits</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="p-1.5">
                                            <button onClick={() => { handleTabChange('settings'); setProfileOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                                                <User size={16} /> Profile & Settings
                                            </button>
                                            <Link href="/pricing"
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                                                <CreditCard size={16} /> Upgrade Plan
                                            </Link>
                                            <button onClick={() => { handleTabChange('library'); setProfileOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                                                <Library size={16} /> My Library
                                            </button>
                                        </div>

                                        <div className="p-1.5 border-t border-white/[0.06]">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-32 max-w-7xl mx-auto relative z-10">
                    <AnimatePresence mode="wait">
                        {/* ═══════════ Home Tab ═══════════ */}
                        {activeTab === 'home' && (
                            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8 lg:space-y-12">
                                <div><h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">Dashboard</h1><p className="text-sm text-white/50">Welcome back, {user.name.split(' ')[0]}</p></div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                    {stats.map((stat, i) => { const Icon = stat.icon; return (
                                        <div key={i} className="p-4 lg:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="p-2 lg:p-3 rounded-xl bg-white/10 text-white group-hover:bg-white group-hover:text-black transition-colors"><Icon size={18} /></div>
                                                {stat.change && <span className="text-[10px] text-white/40 hidden sm:block">{stat.change}</span>}
                                            </div>
                                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-0.5">{stat.value}</div>
                                            <div className="text-xs text-white/50">{stat.label}</div>
                                        </div>
                                    ); })}
                                </div>

                                {/* Quick Actions */}
                                <section>
                                    <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                        {[
                                            { icon: Paintbrush, label: 'Studio', href: '/tools/studio', color: 'from-purple-500/20 to-purple-600/10' },
                                            { icon: MessageSquare, label: 'AI Chat', href: '/tools/chat', color: 'from-blue-500/20 to-blue-600/10' },
                                            { icon: ImageIcon, label: 'Image Gen', href: '/tools/studio', color: 'from-orange-500/20 to-orange-600/10' },
                                            { icon: Video, label: 'Video Gen', href: '/tools/studio', color: 'from-pink-500/20 to-pink-600/10' },
                                            { icon: Eraser, label: 'Remove BG', href: '/tools/remove-bg', color: 'from-green-500/20 to-green-600/10' },
                                            { icon: Library, label: 'Library', action: () => setActiveTab('library'), color: 'from-cyan-500/20 to-cyan-600/10' },
                                        ].map((action, i) => {
                                            const Icon = action.icon;
                                            const inner = (
                                                <div className={`flex flex-col items-center justify-center p-4 lg:p-6 rounded-2xl bg-gradient-to-b ${action.color} border border-white/[0.06] hover:border-white/20 hover:scale-[1.02] transition-all group gap-2.5 w-full`}>
                                                    <Icon size={22} strokeWidth={1.5} className="text-white/70 group-hover:text-white transition-colors" />
                                                    <span className="font-medium text-xs text-white/70 group-hover:text-white text-center transition-colors">{action.label}</span>
                                                </div>
                                            );
                                            if ('href' in action && action.href) return <Link key={i} href={action.href}>{inner}</Link>;
                                            return <button key={i} onClick={(action as { action: () => void }).action}>{inner}</button>;
                                        })}
                                    </div>
                                </section>

                                {/* Recent Creations (images & videos) */}
                                {recentMedia.length > 0 && (
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-bold">Recent Creations</h2>
                                            <button onClick={() => setActiveTab('library')} className="text-sm font-medium text-white/50 hover:text-white transition-colors">View All</button>
                                        </div>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                                            {recentMedia.map((item) => (
                                                <div key={item.id} className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer aspect-square" onClick={() => setPreviewItem(item)}>
                                                    {item.type === 'image' ? (
                                                        <img src={item.thumbnailUrl} alt={item.prompt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    ) : (
                                                        <>
                                                            <img src={item.thumbnailUrl} alt={item.prompt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                            <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"><Play size={12} className="text-black ml-0.5" /></div></div>
                                                        </>
                                                    )}
                                                    <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="flex items-center gap-1">
                                                            {item.type === 'video' ? <Video size={10} className="text-purple-300" /> : <ImageIcon size={10} className="text-orange-300" />}
                                                            <span className="text-[9px] text-white/80 truncate">{item.prompt || 'Generated'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Recent Projects */}
                                {projects.length > 0 && (
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-bold">Recent Projects</h2>
                                            <button onClick={() => setActiveTab('projects')} className="text-sm font-medium text-white/50 hover:text-white transition-colors">View All</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {projects.slice(0, 4).map((project) => (
                                                <div key={project.id} className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                                                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><div className="text-lg font-bold text-white/20">{project.name.charAt(0)}</div></div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-sm truncate">{project.name}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-white/40"><span>{project.images} images</span><span className="w-1 h-1 rounded-full bg-white/20" /><span>{project.updated}</span></div>
                                                    </div>
                                                    {project.starred && <Star size={14} className="text-white fill-white shrink-0" />}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </motion.div>
                        )}

                        {/* ═══════════ Projects Tab ═══════════ */}
                        {activeTab === 'projects' && (
                            <motion.div key="projects" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
                                <div className="mb-6"><h1 className="text-2xl sm:text-3xl font-bold mb-1">My Projects</h1><p className="text-sm text-white/50">{projects.length} projects</p></div>
                                {projects.length === 0 ? (
                                    <div className="text-center py-20"><Folder size={48} className="mx-auto mb-4 text-white/20" /><h2 className="text-xl font-bold mb-2">No projects yet</h2><p className="text-white/50 mb-6">Create your first project</p><Link href="/tools/studio" className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors inline-block">Start Creating</Link></div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{projects.map((project) => (
                                        <div key={project.id} className="group p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all cursor-pointer">
                                            <div className="aspect-[4/3] rounded-xl bg-white/5 mb-3 relative overflow-hidden">{project.starred && <div className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur rounded-lg"><Star size={12} className="text-white fill-white" /></div>}</div>
                                            <h3 className="font-bold text-sm mb-1">{project.name}</h3>
                                            <div className="flex justify-between text-xs text-white/50"><span>{project.images} items</span><span>{project.updated}</span></div>
                                        </div>
                                    ))}</div>
                                )}
                            </motion.div>
                        )}

                        {/* ═══════════ AI Tools Tab ═══════════ */}
                        {activeTab === 'ai-tools' && (
                            <motion.div key="ai-tools" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
                                <div className="mb-8"><h1 className="text-2xl sm:text-3xl font-bold mb-1">AI Tools</h1><p className="text-sm text-white/50">All creative tools in one place</p></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                    {TOOLS_CATALOG.map((tool) => { const Icon = tool.icon; return (
                                        <Link key={tool.id} href={tool.href} className="block p-5 sm:p-6 lg:p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group relative overflow-hidden">
                                            {tool.credits != null && <div className="absolute top-4 right-4 px-2 py-1 rounded-full border border-white/20 text-[10px] font-mono opacity-50 group-hover:border-black/20 group-hover:text-black/70">{tool.credits} CREDITS</div>}
                                            <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-black/10 transition-colors ${tool.color}`}><Icon size={24} /></div>
                                            <h3 className="text-lg font-bold mb-1">{tool.title}</h3>
                                            <p className="text-sm text-white/50 group-hover:text-black/60 mb-4 max-w-sm">{tool.description}</p>
                                            <div className="flex items-center gap-2 font-bold text-xs">Launch Tool <Wand2 size={14} /></div>
                                        </Link>
                                    ); })}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══════════ Library Tab ═══════════ */}
                        {activeTab === 'library' && (
                            <motion.div key="library" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
                                    <div><h1 className="text-2xl sm:text-3xl font-bold mb-1">Library</h1><p className="text-sm text-white/50">All your generated and uploaded media</p></div>
                                    <div className="flex gap-2">
                                        {(['all', 'image', 'video'] as const).map((f) => (
                                            <button key={f} onClick={() => setLibraryFilter(f)}
                                                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${libraryFilter === f ? 'bg-white text-black border-white' : 'border-white/10 text-white/60 hover:border-white/30'}`}>
                                                {f === 'all' ? 'All' : f === 'image' ? 'Images' : 'Videos'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {libraryLoading ? (
                                    <div className="text-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" /><p className="text-white/50">Loading...</p></div>
                                ) : libraryItems.length === 0 ? (
                                    <div className="text-center py-20"><Library size={48} className="mx-auto mb-4 text-white/20" /><h2 className="text-xl font-bold mb-2">Library is empty</h2><p className="text-white/50 mb-6 max-w-md mx-auto">Generate images or videos and they'll appear here.</p><Link href="/tools/studio" className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors inline-block">Go to AI Studio</Link></div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {libraryItems.map((item) => (
                                            <div key={item.id} className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 transition-all cursor-pointer" onClick={() => setPreviewItem(item)}>
                                                <div className="aspect-square relative overflow-hidden bg-black">
                                                    <img src={item.thumbnailUrl} alt={item.prompt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    {item.type === 'video' && <div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"><Play size={16} className="text-black ml-0.5" /></div></div>}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm" title="Preview"><Eye size={18} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDownload(item.url, `canvix-${item.id}.${item.type === 'video' ? 'mp4' : 'png'}`); }}
                                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm" title="Download"><Download size={18} /></button>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <div className="flex items-center gap-2 mb-1">{item.type === 'video' ? <Video size={12} className="text-purple-400" /> : <ImageIcon size={12} className="text-orange-400" />}<span className="text-[10px] text-white/40 capitalize">{item.source}</span></div>
                                                    <p className="text-xs text-white/60 truncate">{item.prompt || 'Uploaded file'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ═══════════ Settings Tab ═══════════ */}
                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
                                <div className="mb-8"><h1 className="text-2xl sm:text-3xl font-bold mb-1">Settings</h1><p className="text-sm text-white/50">Manage your account and preferences</p></div>

                                <div className="max-w-2xl space-y-6">
                                    {/* Profile Section */}
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                            <User size={18} className="text-white/50" />
                                            <h3 className="font-bold">Profile</h3>
                                        </div>
                                        <div className="p-6 space-y-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-xl font-bold shrink-0">{user.name.charAt(0)}</div>
                                                <div>
                                                    <div className="font-bold">{user.name}</div>
                                                    <div className="text-sm text-white/40">{user.email || 'user@canvix.ai'}</div>
                                                    <button className="text-xs text-purple-400 hover:text-purple-300 mt-1 transition-colors">Change avatar</button>
                                                </div>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-white/40 font-medium block mb-1.5">Display Name</label>
                                                    <input type="text" defaultValue={user.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-white/40 font-medium block mb-1.5">Email</label>
                                                    <input type="email" defaultValue={user.email || 'user@canvix.ai'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors" disabled />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Plan & Credits */}
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                            <CreditCard size={18} className="text-white/50" />
                                            <h3 className="font-bold">Plan & Credits</h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold">{user.plan} Plan</div>
                                                    <div className="text-sm text-white/40">{user.credits.total - user.credits.used} credits remaining</div>
                                                </div>
                                                <Link href="/pricing" className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">Upgrade</Link>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs text-white/40 mb-1"><span>Usage</span><span>{user.credits.used} / {user.credits.total}</span></div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-purple-500 to-orange-400 rounded-full transition-all" style={{ width: `${Math.min((user.credits.used / Math.max(user.credits.total, 1)) * 100, 100)}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preferences */}
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                            <Palette size={18} className="text-white/50" />
                                            <h3 className="font-bold">Preferences</h3>
                                        </div>
                                        <div className="divide-y divide-white/[0.04]">
                                            {[
                                                { icon: Moon, label: 'Dark mode', desc: 'Always dark (default)', toggle: true, defaultOn: true },
                                                { icon: Globe, label: 'Language', desc: 'English (US)', toggle: false },
                                                { icon: Bell, label: 'Notifications', desc: 'Email & push notifications', toggle: true, defaultOn: true },
                                                { icon: Shield, label: 'Private mode', desc: 'Hide creations from public gallery', toggle: true, defaultOn: false },
                                            ].map((pref, i) => {
                                                const Icon = pref.icon;
                                                return (
                                                    <div key={i} className="flex items-center justify-between px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Icon size={18} className="text-white/40" />
                                                            <div>
                                                                <div className="text-sm font-medium">{pref.label}</div>
                                                                <div className="text-xs text-white/40">{pref.desc}</div>
                                                            </div>
                                                        </div>
                                                        {pref.toggle ? (
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input type="checkbox" defaultChecked={pref.defaultOn} className="sr-only peer" />
                                                                <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-purple-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                                                            </label>
                                                        ) : (
                                                            <ChevronDown size={16} className="text-white/30 -rotate-90" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.02] overflow-hidden">
                                        <div className="px-6 py-4 border-b border-red-500/10 flex items-center gap-3">
                                            <Trash2 size={18} className="text-red-400/60" />
                                            <h3 className="font-bold text-red-400/80">Danger Zone</h3>
                                        </div>
                                        <div className="p-6 flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium">Delete Account</div>
                                                <div className="text-xs text-white/40">Permanently delete your account and all data</div>
                                            </div>
                                            <button className="px-4 py-2 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/10 transition-colors">Delete</button>
                                        </div>
                                    </div>

                                    {/* Save button */}
                                    <div className="flex justify-end pt-2">
                                        <button onClick={() => { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2000); }}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                                            {settingsSaved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                                        </button>
                                    </div>
                                </div>
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
                                <button onClick={() => setPreviewItem(null)} className="absolute -top-10 right-0 p-2 text-white/60 hover:text-white"><X size={24} /></button>
                                {previewItem.type === 'image' ? <img src={previewItem.url} alt={previewItem.prompt || 'Preview'} className="max-w-full max-h-[70vh] rounded-2xl object-contain" /> : <video src={previewItem.url} controls autoPlay className="max-w-full max-h-[70vh] rounded-2xl" />}
                                <div className="mt-4 flex items-center gap-4 flex-wrap justify-center">
                                    {previewItem.prompt && <p className="text-sm text-white/60 max-w-md truncate">{previewItem.prompt}</p>}
                                    <button onClick={() => handleDownload(previewItem.url, `canvix-${previewItem.id}.${previewItem.type === 'video' ? 'mp4' : 'png'}`)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shrink-0"><Download size={16} /> Download</button>
                                    <a href={previewItem.url} target="_blank" rel="noopener noreferrer" className="p-2 text-white/60 hover:text-white"><ExternalLink size={18} /></a>
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
                            className="fixed left-3 right-3 top-[10%] sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-2xl p-5 sm:p-8 z-[70] shadow-2xl max-h-[80dvh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">Create New</h2><button onClick={() => setShowCreateModal(false)} className="p-2 rounded-full hover:bg-white/10"><Plus size={20} className="rotate-45" /></button></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { icon: Sparkles, title: 'AI Studio', desc: 'Generate images & videos', href: '/tools/studio' },
                                    { icon: MessageSquare, title: 'AI Chat', desc: 'Chat with Canvix AI', href: '/tools/chat' },
                                    { icon: Eraser, title: 'Remove BG', desc: 'Remove backgrounds', href: '/tools/remove-bg' },
                                    { icon: Download, title: 'Upload', desc: 'Upload your files', href: '/tools/studio' },
                                ].map((opt, i) => { const Icon = opt.icon; return (
                                    <Link key={i} href={opt.href} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group">
                                        <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-black/10 shrink-0"><Icon size={20} /></div>
                                        <div><h3 className="font-bold text-sm mb-0.5">{opt.title}</h3><p className="text-xs opacity-50 group-hover:opacity-70">{opt.desc}</p></div>
                                    </Link>
                                ); })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
