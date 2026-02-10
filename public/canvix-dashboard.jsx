import React, { useState } from 'react';

export default function CanvixDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const user = {
    name: 'Alex Johnson',
    plan: 'PRO',
    credits: { used: 847, total: 1000 },
  };

  const stats = [
    { label: 'Projects', value: '24', change: '+3 this week', icon: '📁', color: '#FF6B35' },
    { label: 'Images Edited', value: '156', change: '+12 today', icon: '🖼️', color: '#7C3AED' },
    { label: 'AI Generations', value: '847', change: '153 remaining', icon: '✨', color: '#06B6D4' },
    { label: 'Storage Used', value: '2.4 GB', change: 'of 10 GB', icon: '💾', color: '#10B981' },
  ];

  const projects = [
    { id: 1, name: 'Summer Campaign', images: 12, thumbnail: 'linear-gradient(135deg, #FF6B35, #FF8F6B)', updated: '2 hours ago', starred: true },
    { id: 2, name: 'Product Shots', images: 8, thumbnail: 'linear-gradient(135deg, #7C3AED, #A78BFA)', updated: '5 hours ago', starred: false },
    { id: 3, name: 'Social Media Kit', images: 24, thumbnail: 'linear-gradient(135deg, #06B6D4, #22D3EE)', updated: 'Yesterday', starred: true },
    { id: 4, name: 'Brand Assets', images: 6, thumbnail: 'linear-gradient(135deg, #10B981, #34D399)', updated: '3 days ago', starred: false },
  ];

  const templates = [
    { id: 1, name: 'Instagram Post', category: 'Social', size: '1080×1080', color: '#E1306C' },
    { id: 2, name: 'YouTube Thumbnail', category: 'Social', size: '1280×720', color: '#FF0000' },
    { id: 3, name: 'LinkedIn Banner', category: 'Social', size: '1584×396', color: '#0077B5' },
    { id: 4, name: 'Story Template', category: 'Social', size: '1080×1920', color: '#833AB4' },
    { id: 5, name: 'Product Card', category: 'E-commerce', size: '800×800', color: '#FF6B35' },
    { id: 6, name: 'Sale Banner', category: 'Marketing', size: '1200×628', color: '#10B981' },
  ];

  const aiTools = [
    { id: 'generate', name: 'AI Generate', desc: 'Create images from text', icon: '✦', color: '#FF6B35', credits: 10 },
    { id: 'remove-bg', name: 'Remove Background', desc: 'Instant background removal', icon: '◎', color: '#10B981', credits: 2 },
    { id: 'fill', name: 'Generative Fill', desc: 'Add or modify content', icon: '◈', color: '#7C3AED', credits: 5 },
    { id: 'upscale', name: 'AI Upscale', desc: 'Enhance resolution 4x', icon: '◐', color: '#06B6D4', credits: 3 },
  ];

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'projects', icon: '📁', label: 'Projects' },
    { id: 'templates', icon: '📋', label: 'Templates' },
    { id: 'ai-tools', icon: '✨', label: 'AI Tools' },
    { id: 'gallery', icon: '🖼️', label: 'My Images' },
  ];

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0A0A0B',
      color: 'white',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#0D0D0F',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
    },
    logo: {
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #FF6B35, #EC4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '20px',
    },
    logoText: {
      fontSize: '22px',
      fontWeight: '700',
    },
    createBtn: {
      margin: '0 16px 24px',
      padding: '14px 20px',
      background: 'linear-gradient(135deg, #FF6B35, #EC4899)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    nav: {
      flex: 1,
      padding: '0 12px',
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 16px',
      borderRadius: '12px',
      marginBottom: '4px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '500',
      border: 'none',
      width: '100%',
      textAlign: 'left',
    },
    navItemActive: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: 'white',
    },
    navItemInactive: {
      backgroundColor: 'transparent',
      color: 'rgba(255,255,255,0.5)',
    },
    upgradeCard: {
      margin: '16px',
      padding: '20px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))',
      border: '1px solid rgba(124,58,237,0.3)',
    },
    main: {
      flex: 1,
      marginLeft: '260px',
      minHeight: '100vh',
    },
    header: {
      padding: '20px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(10,10,11,0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    },
    searchBox: {
      position: 'relative',
      width: '400px',
    },
    searchInput: {
      width: '100%',
      padding: '14px 20px 14px 48px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '14px',
      outline: 'none',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255,255,255,0.3)',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    creditsBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.06)',
    },
    profileBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px 8px 8px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #FF6B35, #EC4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
    },
    content: {
      padding: '32px',
    },
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '8px',
    },
    subtitle: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '15px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '40px',
    },
    statCard: {
      padding: '24px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      marginBottom: '16px',
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '4px',
    },
    statLabel: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '14px',
    },
    statChange: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: '12px',
      marginTop: '8px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '40px',
    },
    actionCard: {
      padding: '24px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s',
    },
    actionIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      marginBottom: '12px',
    },
    projectsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
    },
    projectCard: {
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
      cursor: 'pointer',
    },
    projectThumb: {
      height: '140px',
      position: 'relative',
    },
    projectInfo: {
      padding: '20px',
    },
    projectName: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    projectMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: 'rgba(255,255,255,0.4)',
      fontSize: '13px',
    },
    templatesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
    },
    templateCard: {
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
      cursor: 'pointer',
    },
    templateThumb: {
      height: '160px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
    },
    templateInfo: {
      padding: '16px',
    },
    aiToolsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
    },
    aiToolCard: {
      padding: '24px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer',
    },
    modal: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    modalBackdrop: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
    },
    modalContent: {
      position: 'relative',
      backgroundColor: '#151518',
      borderRadius: '24px',
      padding: '32px',
      maxWidth: '600px',
      width: '100%',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: '700',
    },
    closeBtn: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '20px',
    },
    modalGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    },
    modalOption: {
      padding: '24px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer',
      textAlign: 'left',
    },
    categoryTabs: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      overflowX: 'auto',
    },
    categoryTab: {
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      whiteSpace: 'nowrap',
    },
    creditsCard: {
      padding: '24px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressBar: {
      height: '8px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '12px',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #FF6B35, #EC4899)',
      borderRadius: '4px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>C</div>
          <span style={styles.logoText}>
            Canvix<span style={{ color: '#FF6B35' }}>.ai</span>
          </span>
        </div>

        <button style={styles.createBtn} onClick={() => setShowCreateModal(true)}>
          <span style={{ fontSize: '18px' }}>+</span>
          Create New
        </button>

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navItem,
                ...(activeTab === item.id ? styles.navItemActive : styles.navItemInactive),
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={styles.upgradeCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span>👑</span>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>Upgrade to Team</span>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
            Unlimited AI credits & team features
          </p>
          <button style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
          }}>
            Upgrade Now
          </button>
        </div>

        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button style={{ ...styles.navItem, ...styles.navItemInactive }}>
            <span style={{ fontSize: '18px' }}>⚙️</span>
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search projects, templates, images..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.headerRight}>
            <div style={styles.creditsBox}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(236,72,153,0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                ⚡
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>AI Credits</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {user.credits.total - user.credits.used} <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>left</span>
                </div>
              </div>
            </div>

            <button style={{
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              cursor: 'pointer',
              position: 'relative',
            }}>
              <span>🔔</span>
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                backgroundColor: '#FF6B35',
                borderRadius: '50%',
              }} />
            </button>

            <div style={styles.profileBtn}>
              <div style={styles.avatar}>A</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#FF6B35' }}>{user.plan} Plan</div>
              </div>
            </div>
          </div>
        </header>

        <div style={styles.content}>
          {/* Home Tab */}
          {activeTab === 'home' && (
            <>
              <div style={styles.pageHeader}>
                <div>
                  <h1 style={styles.title}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
                  <p style={styles.subtitle}>Here's what's happening with your projects</p>
                </div>
                <button style={styles.createBtn} onClick={() => setShowCreateModal(true)}>
                  <span>+</span> New Project
                </button>
              </div>

              <div style={styles.statsGrid}>
                {stats.map((stat, i) => (
                  <div key={i} style={styles.statCard}>
                    <div style={{ ...styles.statIcon, backgroundColor: `${stat.color}20`, color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div style={styles.statValue}>{stat.value}</div>
                    <div style={styles.statLabel}>{stat.label}</div>
                    <div style={styles.statChange}>{stat.change}</div>
                  </div>
                ))}
              </div>

              <h2 style={styles.sectionTitle}>Quick Actions</h2>
              <div style={styles.quickActions}>
                {[
                  { icon: '📤', label: 'Upload Image', color: '#FF6B35' },
                  { icon: '📋', label: 'Use Template', color: '#7C3AED' },
                  { icon: '✨', label: 'AI Generate', color: '#06B6D4' },
                  { icon: '🪄', label: 'Remove BG', color: '#10B981' },
                ].map((action, i) => (
                  <button key={i} style={styles.actionCard}>
                    <div style={{ ...styles.actionIcon, backgroundColor: `${action.color}20`, color: action.color }}>
                      {action.icon}
                    </div>
                    <span style={{ fontWeight: '500' }}>{action.label}</span>
                  </button>
                ))}
              </div>

              <h2 style={styles.sectionTitle}>Recent Projects</h2>
              <div style={styles.projectsGrid}>
                {projects.map((project) => (
                  <div key={project.id} style={styles.projectCard}>
                    <div style={{ ...styles.projectThumb, background: project.thumbnail }}>
                      {project.starred && (
                        <span style={{ position: 'absolute', top: '12px', right: '12px', color: '#FBBF24' }}>★</span>
                      )}
                    </div>
                    <div style={styles.projectInfo}>
                      <div style={styles.projectName}>{project.name}</div>
                      <div style={styles.projectMeta}>
                        <span>{project.images} images</span>
                        <span>•</span>
                        <span>{project.updated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <>
              <div style={styles.pageHeader}>
                <div>
                  <h1 style={styles.title}>My Projects</h1>
                  <p style={styles.subtitle}>{projects.length} projects</p>
                </div>
                <button style={styles.createBtn} onClick={() => setShowCreateModal(true)}>
                  <span>+</span> New Project
                </button>
              </div>

              <div style={{ ...styles.projectsGrid, gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {projects.map((project) => (
                  <div key={project.id} style={styles.projectCard}>
                    <div style={{ ...styles.projectThumb, background: project.thumbnail }}>
                      {project.starred && (
                        <span style={{ position: 'absolute', top: '12px', right: '12px', color: '#FBBF24', fontSize: '18px' }}>★</span>
                      )}
                    </div>
                    <div style={styles.projectInfo}>
                      <div style={styles.projectName}>{project.name}</div>
                      <div style={styles.projectMeta}>
                        <span>{project.images} images</span>
                        <span>•</span>
                        <span>{project.updated}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <>
              <div style={styles.pageHeader}>
                <div>
                  <h1 style={styles.title}>Templates</h1>
                  <p style={styles.subtitle}>Choose from 1000+ professionally designed templates</p>
                </div>
              </div>

              <div style={styles.categoryTabs}>
                {['All', 'Social Media', 'Marketing', 'E-commerce', 'Print'].map((cat, i) => (
                  <button
                    key={cat}
                    style={{
                      ...styles.categoryTab,
                      backgroundColor: i === 0 ? 'white' : 'rgba(255,255,255,0.05)',
                      color: i === 0 ? 'black' : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={styles.templatesGrid}>
                {templates.map((template) => (
                  <div key={template.id} style={styles.templateCard}>
                    <div style={{ ...styles.templateThumb, background: `linear-gradient(135deg, ${template.color}, ${template.color}88)` }}>
                      🖼️
                    </div>
                    <div style={styles.templateInfo}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{template.name}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{template.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* AI Tools Tab */}
          {activeTab === 'ai-tools' && (
            <>
              <div style={styles.pageHeader}>
                <div>
                  <h1 style={styles.title}>AI Tools</h1>
                  <p style={styles.subtitle}>Supercharge your workflow with AI-powered features</p>
                </div>
              </div>

              <div style={styles.creditsCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(236,72,153,0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}>
                    ⚡
                  </div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '700' }}>{user.credits.total - user.credits.used}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)' }}>AI Credits Remaining</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Used this period</div>
                  <div style={{ fontWeight: '600' }}>{user.credits.used} / {user.credits.total}</div>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${(user.credits.used / user.credits.total) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div style={styles.aiToolsGrid}>
                {aiTools.map((tool) => (
                  <div key={tool.id} style={styles.aiToolCard}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        backgroundColor: `${tool.color}20`,
                        color: tool.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                      }}>
                        {tool.icon}
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.5)',
                      }}>
                        {tool.credits} credits
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{tool.name}</h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>{tool.desc}</p>
                    <button style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: `${tool.color}20`,
                      color: tool.color,
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}>
                      Try Now →
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <>
              <div style={styles.pageHeader}>
                <div>
                  <h1 style={styles.title}>My Images</h1>
                  <p style={styles.subtitle}>All your uploaded and generated images</p>
                </div>
                <button style={styles.createBtn}>
                  <span>📤</span> Upload
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '16px',
              }}>
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '16px',
                      background: `linear-gradient(${45 + i * 20}deg, ${['#FF6B35', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B'][i % 5]}, ${['#FF8F6B', '#A78BFA', '#22D3EE', '#34D399', '#FBBF24'][i % 5]})`,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={styles.modal}>
          <div style={styles.modalBackdrop} onClick={() => setShowCreateModal(false)} />
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New</h2>
              <button style={styles.closeBtn} onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <div style={styles.modalGrid}>
              {[
                { icon: '📁', title: 'Blank Project', desc: 'Start with an empty canvas', color: '#FF6B35' },
                { icon: '📋', title: 'From Template', desc: 'Choose from 1000+ templates', color: '#7C3AED' },
                { icon: '📤', title: 'Upload Image', desc: 'Edit an existing image', color: '#06B6D4' },
                { icon: '✨', title: 'AI Generate', desc: 'Create from a text prompt', color: '#10B981' },
              ].map((option, i) => (
                <button
                  key={i}
                  style={styles.modalOption}
                  onClick={() => setShowCreateModal(false)}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: `${option.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    marginBottom: '12px',
                  }}>
                    {option.icon}
                  </div>
                  <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>{option.title}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{option.desc}</p>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>Popular Sizes</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Instagram (1080×1080)', 'Story (1080×1920)', 'YouTube (1280×720)', 'Custom'].map((size) => (
                  <button
                    key={size}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
