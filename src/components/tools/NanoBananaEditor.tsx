// @ts-nocheck
"use client";
import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';

const PixlrEditorEmbed = lazy(() => import('./PixlrEditorEmbed'));

/**
 * Nano Banana Style AI Image Editor
 * 
 * Chat with AI to edit your images using natural language.
 * Similar to Pixlr's Nano Banana but branded for Canvix.
 */
export default function NanoBananaEditorPage({ user }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [credits, setCredits] = useState(user?.credits?.total - user?.credits?.used || 320);
  const [showPixlrEditor, setShowPixlrEditor] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Example prompts
  const promptExamples = [
    { icon: '🌅', text: 'Change the background to a sunset beach' },
    { icon: '✨', text: 'Make the colors more vibrant' },
    { icon: '🎨', text: 'Apply a vintage film look' },
    { icon: '🔍', text: 'Enhance the details and sharpen' },
    { icon: '👤', text: 'Remove the person in the background' },
    { icon: '🌙', text: 'Convert to a night scene' },
    { icon: '🖼️', text: 'Add a dreamy blur effect' },
    { icon: '🎭', text: 'Make it look like an oil painting' },
  ];

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setEditedImage(e.target.result);
        setEditHistory([e.target.result]);

        // Add system message
        const msg = {
          id: Date.now(),
          type: 'system',
          text: 'Image uploaded! Tell me how you\'d like to edit it.',
        };
        setMessages([msg]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setEditedImage(e.target.result);
        setEditHistory([e.target.result]);

        const msg = {
          id: Date.now(),
          type: 'system',
          text: 'Image uploaded! Tell me how you\'d like to edit it.',
        };
        setMessages([msg]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to B2 and return the URL
  const uploadImageToServer = async (dataUrl) => {
    try {
      const blob = await fetch(dataUrl).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', blob, 'image.png');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success) return json.data.url;
      return null;
    } catch {
      return null;
    }
  };

  // Poll job until done
  const pollJob = async (jobId) => {
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 2000));
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const json = await res.json();
        if (json.success && (json.data.status === 'completed' || json.data.status === 'failed')) {
          return json.data;
        }
      } catch { /* retry */ }
    }
    return { status: 'failed', error: 'Timed out' };
  };

  // Process edit command via real backend
  const processEdit = async (command) => {
    if (!uploadedImage) return;

    setIsProcessing(true);

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: command,
    };
    setMessages(prev => [...prev, userMsg]);

    // Add AI thinking message
    const thinkingMsg = {
      id: Date.now() + 1,
      type: 'assistant',
      text: `I understand! I'll ${command.toLowerCase()}. Processing...`,
      isThinking: true,
    };
    setMessages(prev => [...prev, thinkingMsg]);

    try {
      // Upload current image to get a URL the backend can use
      const imageUrl = await uploadImageToServer(editedImage || uploadedImage);

      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Call edit API
      const res = await fetch('/api/pixlr/edit/instruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, instruction: command }),
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error?.message || 'Edit failed');
      }

      // Poll for result
      const result = await pollJob(json.data.jobId);

      if (result.status === 'completed' && result.result?.url) {
        setEditedImage(result.result.url);
        setEditHistory(prev => [...prev, result.result.url]);

        const resultMsg = {
          id: Date.now() + 2,
          type: 'assistant',
          text: `Done! I've applied the edit: "${command}"\n\nThe changes have been applied to your image. You can:\n• Continue editing with more commands\n• Undo to go back\n• Download when you're happy`,
          hasResult: true,
        };
        setMessages(prev => prev.filter(m => !m.isThinking).concat(resultMsg));
      } else {
        throw new Error(result.error || 'Edit processing failed');
      }
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 2,
        type: 'assistant',
        text: `Sorry, the edit failed: ${error.message}. Please try again.`,
      };
      setMessages(prev => prev.filter(m => !m.isThinking).concat(errorMsg));
    }

    setCredits(prev => prev - 5);
    setIsProcessing(false);
  };

  // Handle send
  const handleSend = () => {
    if (!inputValue.trim()) return;
    processEdit(inputValue);
    setInputValue('');
  };

  // Handle undo
  const handleUndo = () => {
    if (editHistory.length > 1) {
      const newHistory = editHistory.slice(0, -1);
      setEditHistory(newHistory);
      setEditedImage(newHistory[newHistory.length - 1]);

      const msg = {
        id: Date.now(),
        type: 'system',
        text: 'Undid last edit',
      };
      setMessages(prev => [...prev, msg]);
    }
  };

  // Handle example click
  const handleExampleClick = (example) => {
    if (uploadedImage) {
      processEdit(example.text);
    } else {
      setInputValue(example.text);
    }
    setShowExamples(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#18181B',
      color: 'white',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      padding: '16px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#18181B',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    logoIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #FF6B35, #EC4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
    },
    subtitle: {
      fontSize: '13px',
      color: 'rgba(255,255,255,0.5)',
    },
    headerNav: {
      display: 'flex',
      gap: '8px',
    },
    navLink: {
      color: '#22D3EE',
      fontSize: '14px',
      textDecoration: 'none',
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    creditsBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '20px',
      fontSize: '14px',
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      padding: '24px',
    },
    editorLayout: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: uploadedImage ? '1fr 380px' : '1fr',
      gap: '24px',
    },
    imageArea: {
      backgroundColor: '#0D0D0F',
      borderRadius: '16px',
      border: '2px dashed rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '500px',
      position: 'relative',
      overflow: 'hidden',
      cursor: uploadedImage ? 'default' : 'pointer',
    },
    imageAreaActive: {
      border: '2px solid rgba(34,211,238,0.5)',
    },
    uploadPrompt: {
      textAlign: 'center',
      padding: '60px',
    },
    uploadIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'rgba(34,211,238,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      margin: '0 auto 24px',
      border: '2px solid rgba(34,211,238,0.3)',
    },
    uploadTitle: {
      fontSize: '18px',
      fontWeight: '500',
      marginBottom: '8px',
    },
    uploadSubtitle: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.5)',
      marginBottom: '24px',
    },
    browseLink: {
      color: '#22D3EE',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    previewImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
    imageActions: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      display: 'flex',
      gap: '8px',
    },
    imageActionBtn: {
      padding: '8px 12px',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    chatPanel: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0D0D0F',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.08)',
      overflow: 'hidden',
    },
    chatHeader: {
      padding: '16px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chatTitle: {
      fontSize: '15px',
      fontWeight: '600',
    },
    examplesBtn: {
      padding: '6px 12px',
      backgroundColor: 'rgba(34,211,238,0.1)',
      border: '1px solid rgba(34,211,238,0.3)',
      borderRadius: '6px',
      color: '#22D3EE',
      cursor: 'pointer',
      fontSize: '12px',
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    emptyChat: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      color: 'rgba(255,255,255,0.4)',
    },
    message: {
      maxWidth: '90%',
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: 'rgba(34,211,238,0.15)',
      padding: '12px 16px',
      borderRadius: '16px 16px 4px 16px',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    assistantMessage: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.05)',
      padding: '12px 16px',
      borderRadius: '16px 16px 16px 4px',
      fontSize: '14px',
      lineHeight: '1.6',
    },
    systemMessage: {
      alignSelf: 'center',
      color: 'rgba(255,255,255,0.4)',
      fontSize: '12px',
      padding: '8px 16px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '20px',
    },
    thinkingDots: {
      display: 'flex',
      gap: '4px',
      padding: '4px 0',
    },
    dot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: '#22D3EE',
      animation: 'pulse 1.4s ease-in-out infinite',
    },
    inputArea: {
      padding: '16px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    },
    inputWrapper: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden',
    },
    textInput: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '14px',
      outline: 'none',
      resize: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    inputActions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    modeSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    modeBtn: {
      padding: '6px 12px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '6px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    modeActive: {
      backgroundColor: 'rgba(34,211,238,0.15)',
      borderColor: 'rgba(34,211,238,0.3)',
    },
    applyBtn: {
      padding: '10px 20px',
      background: '#22D3EE',
      border: 'none',
      borderRadius: '8px',
      color: '#000',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    disabledBtn: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    creditsInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.4)',
    },
    examplesModal: {
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
    },
    modalContent: {
      position: 'relative',
      backgroundColor: '#1a1a1f',
      borderRadius: '20px',
      padding: '24px',
      maxWidth: '500px',
      width: '100%',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
    },
    closeBtn: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      color: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      fontSize: '18px',
    },
    examplesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    exampleItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 16px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left',
      width: '100%',
      color: 'white',
      fontSize: '14px',
    },
    processingOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '3px solid rgba(255,255,255,0.1)',
      borderTopColor: '#22D3EE',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>C</div>
            <div>
              <div style={styles.title}>Canvix AI Editor</div>
              <div style={styles.subtitle}>Nano Banana Style</div>
            </div>
          </div>
          <div style={styles.headerNav}>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Also see:</span>
            <button style={styles.navLink}>AI Video Generator</button>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <button style={styles.navLink}>AI Image Generator</button>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <button style={styles.navLink}>AI Face Swap</button>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onClick={() => setShowPixlrEditor(true)}
          >
            🎨 Open Pixlr Editor
          </button>
          <div style={styles.creditsBox}>
            <span>🪙</span>
            <span>{credits} remaining</span>
          </div>
        </div>
      </header>

      {/* Pixlr Editor Overlay */}
      {showPixlrEditor && (
        <Suspense fallback={<div style={{ position: 'fixed', inset: 0, backgroundColor: '#0a0a0b', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading Pixlr Editor...</div>}>
          <PixlrEditorEmbed
            onClose={() => setShowPixlrEditor(false)}
            onSave={(file) => {
              // When user saves from Pixlr, show it as the edited image
              const url = URL.createObjectURL(file);
              setEditedImage(url);
              setEditHistory(prev => [...prev, url]);
              setShowPixlrEditor(false);
              const msg = {
                id: Date.now(),
                type: 'system',
                text: 'Image edited with Pixlr Editor and saved!',
              };
              setMessages(prev => [...prev, msg]);
            }}
          />
        </Suspense>
      )}

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.editorLayout}>
          {/* Image Area */}
          <div
            style={styles.imageArea}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !uploadedImage && fileInputRef.current?.click()}
          >
            {!uploadedImage ? (
              <div style={styles.uploadPrompt}>
                <div style={styles.uploadIcon}>⬆️</div>
                <h3 style={styles.uploadTitle}>Drag & drop or <span style={styles.browseLink}>Browse</span></h3>
                <p style={styles.uploadSubtitle}>We'll edit your image with Canvix AI</p>
              </div>
            ) : (
              <>
                <img src={editedImage || uploadedImage} alt="Preview" style={styles.previewImage} />

                {/* Image Actions */}
                <div style={styles.imageActions}>
                  {editHistory.length > 1 && (
                    <button style={styles.imageActionBtn} onClick={handleUndo}>
                      ↩️ Undo
                    </button>
                  )}
                  <button style={styles.imageActionBtn}>
                    ⬇️ Download
                  </button>
                  <button
                    style={styles.imageActionBtn}
                    onClick={() => { setUploadedImage(null); setEditedImage(null); setMessages([]); setEditHistory([]); }}
                  >
                    🔄 New
                  </button>
                </div>

                {/* Processing Overlay */}
                {isProcessing && (
                  <div style={styles.processingOverlay}>
                    <div style={styles.spinner} />
                    <span style={{ color: 'white', fontSize: '14px' }}>Applying edit...</span>
                  </div>
                )}
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          {/* Chat Panel - Only show when image uploaded */}
          {uploadedImage && (
            <div style={styles.chatPanel}>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <span style={styles.chatTitle}>Edit Instructions</span>
                <button style={styles.examplesBtn} onClick={() => setShowExamples(true)}>
                  Show Prompt Examples
                </button>
              </div>

              {/* Messages */}
              <div style={styles.messagesArea}>
                {messages.length === 0 ? (
                  <div style={styles.emptyChat}>
                    <p>Tell me how to edit your image...</p>
                    <p style={{ fontSize: '12px', marginTop: '8px' }}>
                      Try: "Remove background" or "Make it look vintage"
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        ...styles.message,
                        ...(msg.type === 'user' ? styles.userMessage :
                          msg.type === 'system' ? styles.systemMessage :
                            styles.assistantMessage),
                      }}
                    >
                      {msg.isThinking ? (
                        <div style={styles.thinkingDots}>
                          <div className="dot" style={{ ...styles.dot, animationDelay: '0s' }} />
                          <div className="dot" style={{ ...styles.dot, animationDelay: '0.2s' }} />
                          <div className="dot" style={{ ...styles.dot, animationDelay: '0.4s' }} />
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={styles.inputArea}>
                <div style={styles.inputWrapper}>
                  <textarea
                    style={styles.textInput}
                    placeholder="Tell Canvix AI how to edit the image..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={2}
                  />
                  <div style={styles.inputActions}>
                    <div style={styles.modeSelector}>
                      <button style={{ ...styles.modeBtn, ...styles.modeActive }}>
                        ✨ Ultra
                      </button>
                      <span style={styles.creditsInfo}>
                        5 🪙
                      </span>
                    </div>
                    <button
                      style={{
                        ...styles.applyBtn,
                        ...(!inputValue.trim() || isProcessing ? styles.disabledBtn : {}),
                      }}
                      disabled={!inputValue.trim() || isProcessing}
                      onClick={handleSend}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Examples Modal */}
      {showExamples && (
        <div style={styles.examplesModal}>
          <div style={styles.modalBackdrop} onClick={() => setShowExamples(false)} />
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Prompt Examples</h3>
              <button style={styles.closeBtn} onClick={() => setShowExamples(false)}>✕</button>
            </div>
            <div style={styles.examplesList}>
              {promptExamples.map((example, i) => (
                <button
                  key={i}
                  style={styles.exampleItem}
                  onClick={() => handleExampleClick(example)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#22D3EE';
                    e.currentTarget.style.backgroundColor = 'rgba(34,211,238,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{example.icon}</span>
                  <span>{example.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
