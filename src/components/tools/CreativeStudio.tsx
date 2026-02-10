// @ts-nocheck
"use client";
import React, { useState } from 'react';

// Import the individual pages
import CreativeAIChatPage from './CreativeAIChat';
import NanoBananaEditorPage from './NanoBananaEditor';

/**
 * Canvix Creative Studio
 * 
 * Main entry point that combines:
 * 1. Chat-based generation (Gemini style) - for image/video generation
 * 2. Nano Banana Editor - for image editing with chat
 * 
 * User can switch between modes or start fresh.
 */
export default function CreativeStudioPage({ user }) {
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' | 'editor'

  const modes = [
    {
      id: 'chat',
      name: 'Creative Chat',
      icon: '✨',
      description: 'Generate images & videos with AI',
      color: '#FF6B35'
    },
    {
      id: 'editor',
      name: 'AI Editor',
      icon: '🎨',
      description: 'Edit images with natural language',
      color: '#22D3EE'
    },
  ];

  // If a mode is selected, render that page
  if (activeMode === 'chat') {
    return <CreativeAIChatPage user={user} pageMode="studio" onSwitchMode={() => setActiveMode('editor')} />;
  }

  if (activeMode === 'editor') {
    return <NanoBananaEditorPage user={user} onSwitchMode={() => setActiveMode('chat')} />;
  }

  // Mode selector (landing)
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0A0A0B',
      color: 'white',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '48px',
    },
    logoIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #FF6B35, #EC4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '24px',
    },
    logoText: {
      fontSize: '28px',
      fontWeight: '700',
    },
    title: {
      fontSize: '36px',
      fontWeight: '600',
      marginBottom: '12px',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: '16px',
      color: 'rgba(255,255,255,0.5)',
      marginBottom: '48px',
      textAlign: 'center',
    },
    modesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      maxWidth: '700px',
      width: '100%',
    },
    modeCard: {
      padding: '32px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textAlign: 'center',
    },
    modeIcon: {
      width: '72px',
      height: '72px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      margin: '0 auto 20px',
    },
    modeName: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    modeDesc: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.5)',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>C</div>
        <span style={styles.logoText}>Canvix.ai</span>
      </div>

      <h1 style={styles.title}>What would you like to create?</h1>
      <p style={styles.subtitle}>Choose a mode to get started</p>

      <div style={styles.modesGrid}>
        {modes.map((mode) => (
          <div
            key={mode.id}
            style={styles.modeCard}
            onClick={() => setActiveMode(mode.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = mode.color;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ ...styles.modeIcon, backgroundColor: `${mode.color}20` }}>
              {mode.icon}
            </div>
            <h3 style={styles.modeName}>{mode.name}</h3>
            <p style={styles.modeDesc}>{mode.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
