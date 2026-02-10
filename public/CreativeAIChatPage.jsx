import React, { useState, useRef, useEffect } from 'react';

/**
 * Canvix AI Chat - Creative Assistant
 * 
 * A Gemini-style chat interface that:
 * 1. Helps users craft prompts via ChatGPT API
 * 2. Generates images/videos via Pixlr API
 * 3. Edits images with Nano Banana style commands
 */
export default function CreativeAIChatPage({ user }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null); // 'image', 'video', 'edit', 'image-to-video'
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [modelSpeed, setModelSpeed] = useState('balanced'); // 'fast', 'balanced', 'quality'
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick action buttons
  const quickActions = [
    { id: 'image', icon: '🎨', label: 'Create image', color: '#FF6B35' },
    { id: 'video', icon: '🎬', label: 'Create a video', color: '#7C3AED' },
    { id: 'edit', icon: '✨', label: 'Edit an image', color: '#10B981' },
    { id: 'image-to-video', icon: '📽️', label: 'Animate image', color: '#06B6D4' },
    { id: 'enhance', icon: '🚀', label: 'Enhance prompt', color: '#F59E0B' },
  ];

  // Simulated GPT response for prompt enhancement
  const getGPTResponse = async (userMessage, context) => {
    // In real implementation, call APIMart ChatGPT API
    // https://docs.apimart.ai/en/api-reference/texts/general/chat-completions
    
    const systemPrompt = `You are Canvix AI, a creative assistant that helps users create amazing images and videos. 
    Your job is to:
    1. Understand what the user wants to create
    2. Ask clarifying questions if needed
    3. Enhance their prompts for better results
    4. Confirm before generating
    
    Current mode: ${context.mode || 'not selected'}
    Has uploaded image: ${context.hasImage ? 'yes' : 'no'}`;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return mock responses based on context
    if (!context.mode) {
      return {
        text: "Hi! I'm Canvix AI, your creative assistant. What would you like to create today?\n\nI can help you with:\n• **Generate images** from text descriptions\n• **Create videos** from prompts or images\n• **Edit images** using natural language\n• **Animate images** into short videos\n\nJust tell me what you have in mind, or use the quick actions below!",
        suggestions: ['Create a stunning landscape', 'Make a product video', 'Edit my photo']
      };
    }

    if (context.mode === 'image' && !context.promptConfirmed) {
      return {
        text: `Great choice! I'll help you create an amazing image.\n\nBased on your idea: "${userMessage}"\n\nHere's an enhanced prompt I suggest:\n\n**"${enhancePrompt(userMessage, 'image')}"**\n\nThis adds:\n✓ Style details\n✓ Lighting information\n✓ Quality keywords\n\nShould I generate with this enhanced prompt, or would you like to modify it?`,
        suggestions: ['Generate now', 'Make it more cinematic', 'Add more details', 'Use my original prompt'],
        awaitingConfirmation: true,
        enhancedPrompt: enhancePrompt(userMessage, 'image')
      };
    }

    if (context.mode === 'video' && !context.promptConfirmed) {
      return {
        text: `Awesome! Let's create a video.\n\nYour idea: "${userMessage}"\n\nEnhanced prompt for video:\n\n**"${enhancePrompt(userMessage, 'video')}"**\n\nVideo settings I recommend:\n• Duration: 4 seconds\n• Style: Cinematic\n• Motion: Smooth\n\nReady to generate, or want to adjust anything?`,
        suggestions: ['Generate video', 'Make it longer', 'Change style', 'Modify prompt'],
        awaitingConfirmation: true,
        enhancedPrompt: enhancePrompt(userMessage, 'video')
      };
    }

    if (context.mode === 'edit' && context.hasImage) {
      return {
        text: `I see your image! What would you like me to do with it?\n\nI can:\n• Remove or change the background\n• Add or remove objects\n• Enhance quality (upscale, sharpen)\n• Apply artistic styles\n• Fix imperfections\n\nJust describe what you want in natural language!`,
        suggestions: ['Remove background', 'Make it brighter', 'Add sunset sky', 'Remove that object']
      };
    }

    return {
      text: "I understand! Let me help you with that. Could you tell me more about what you're looking for?",
      suggestions: ['Show examples', 'Start over', 'Help me decide']
    };
  };

  // Enhance prompt helper
  const enhancePrompt = (prompt, type) => {
    const imageEnhancements = ', highly detailed, professional photography, 8k resolution, dramatic lighting, cinematic composition';
    const videoEnhancements = ', smooth camera movement, cinematic quality, 4k resolution, professional color grading';
    
    if (type === 'image') {
      return prompt + imageEnhancements;
    } else if (type === 'video') {
      return prompt + videoEnhancements;
    }
    return prompt;
  };

  // Simulate Pixlr generation
  const generateContent = async (prompt, type) => {
    // In real implementation, call Pixlr API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      success: true,
      type: type,
      url: 'generated-content-url',
      prompt: prompt
    };
  };

  // Handle send message
  const handleSend = async () => {
    if (!inputValue.trim() && !uploadedFile) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      image: uploadedFile,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFile(null);
    setIsLoading(true);

    try {
      // Get context for GPT
      const context = {
        mode: selectedMode,
        hasImage: !!uploadedFile,
        previousMessages: messages,
        promptConfirmed: false,
      };

      // Get GPT response
      const response = await getGPTResponse(inputValue, context);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: response.text,
        suggestions: response.suggestions,
        awaitingConfirmation: response.awaitingConfirmation,
        enhancedPrompt: response.enhancedPrompt,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick action click
  const handleQuickAction = (action) => {
    setSelectedMode(action.id);
    
    const systemMessage = {
      id: Date.now(),
      type: 'system',
      text: `Mode switched to: ${action.label}`,
      icon: action.icon,
    };

    setMessages(prev => [...prev, systemMessage]);

    // Auto-prompt based on mode
    if (action.id === 'edit' || action.id === 'image-to-video') {
      const promptMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: action.id === 'edit' 
          ? "Please upload an image you'd like to edit. You can drag & drop or click the + button."
          : "Upload an image you'd like to animate into a video.",
        requestUpload: true,
      };
      setMessages(prev => [...prev, promptMessage]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = async (suggestion) => {
    if (suggestion === 'Generate now' || suggestion === 'Generate video') {
      // Find the last enhanced prompt
      const lastAiMessage = [...messages].reverse().find(m => m.enhancedPrompt);
      if (lastAiMessage) {
        setIsLoading(true);
        
        const generatingMessage = {
          id: Date.now(),
          type: 'assistant',
          text: `✨ Generating your ${selectedMode === 'video' ? 'video' : 'image'}...`,
          isGenerating: true,
        };
        setMessages(prev => [...prev, generatingMessage]);

        // Simulate generation
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Add result
        const resultMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          text: `Here's your ${selectedMode === 'video' ? 'video' : 'image'}! 🎉`,
          generatedContent: {
            type: selectedMode === 'video' ? 'video' : 'image',
            prompt: lastAiMessage.enhancedPrompt,
          },
          suggestions: ['Create another', 'Edit this', 'Download', 'Share'],
        };
        
        // Remove generating message and add result
        setMessages(prev => prev.filter(m => !m.isGenerating).concat(resultMessage));
        setIsLoading(false);
      }
    } else {
      // Send suggestion as user message
      setInputValue(suggestion);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFile(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0A0A0B',
      color: 'white',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      padding: '16px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
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
      fontSize: '18px',
    },
    logoText: {
      fontSize: '20px',
      fontWeight: '700',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    creditsDisplay: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '20px',
      fontSize: '14px',
    },
    profileBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FF6B35, #EC4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      color: 'white',
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%',
      padding: '0 24px',
    },
    welcomeSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
    },
    welcomeIcon: {
      fontSize: '32px',
      marginBottom: '16px',
    },
    welcomeTitle: {
      fontSize: '32px',
      fontWeight: '400',
      marginBottom: '8px',
      color: 'rgba(255,255,255,0.9)',
    },
    welcomeSubtitle: {
      fontSize: '40px',
      fontWeight: '600',
      marginBottom: '40px',
      background: 'linear-gradient(135deg, #FF6B35, #EC4899, #7C3AED)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px 0',
    },
    messageWrapper: {
      marginBottom: '24px',
    },
    userMessage: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
    },
    userBubble: {
      maxWidth: '70%',
      padding: '16px 20px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '20px 20px 4px 20px',
      fontSize: '15px',
      lineHeight: '1.5',
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FF6B35, #EC4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      flexShrink: 0,
    },
    assistantMessage: {
      display: 'flex',
      gap: '12px',
    },
    assistantAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      flexShrink: 0,
    },
    assistantBubble: {
      maxWidth: '80%',
    },
    assistantText: {
      fontSize: '15px',
      lineHeight: '1.7',
      color: 'rgba(255,255,255,0.9)',
    },
    systemMessage: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '8px 16px',
      fontSize: '13px',
      color: 'rgba(255,255,255,0.5)',
    },
    suggestions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '16px',
    },
    suggestionBtn: {
      padding: '10px 18px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px',
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    generatedContent: {
      marginTop: '16px',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    generatedImage: {
      width: '100%',
      maxWidth: '400px',
      aspectRatio: '1',
      background: 'linear-gradient(135deg, #FF6B35, #7C3AED, #06B6D4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
    },
    generatedVideo: {
      width: '100%',
      maxWidth: '500px',
      aspectRatio: '16/9',
      background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    playButton: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      cursor: 'pointer',
    },
    loadingDots: {
      display: 'flex',
      gap: '4px',
      padding: '12px 0',
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#7C3AED',
      animation: 'bounce 1.4s ease-in-out infinite',
    },
    inputSection: {
      padding: '24px 0',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    inputWrapper: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '12px',
    },
    inputTop: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    textInput: {
      flex: 1,
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '16px',
      padding: '8px 12px',
      outline: 'none',
      resize: 'none',
      minHeight: '24px',
      maxHeight: '120px',
      fontFamily: 'inherit',
    },
    inputBottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '8px',
      paddingTop: '8px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    inputActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    inputBtn: {
      padding: '8px 12px',
      backgroundColor: 'transparent',
      border: 'none',
      color: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      transition: 'all 0.2s',
    },
    toolsBtn: {
      padding: '8px 16px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
    },
    sendBtn: {
      padding: '10px 20px',
      background: 'linear-gradient(135deg, #FF6B35, #EC4899)',
      border: 'none',
      borderRadius: '20px',
      color: 'white',
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
    quickActionsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '16px',
    },
    quickActionBtn: {
      padding: '12px 20px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      transition: 'all 0.2s',
    },
    uploadPreview: {
      position: 'relative',
      marginBottom: '12px',
    },
    uploadedImage: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '12px',
    },
    removeUpload: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#EF4444',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
    },
    modeIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      backgroundColor: 'rgba(124,58,237,0.2)',
      borderRadius: '12px',
      fontSize: '12px',
      color: '#A78BFA',
    },
    speedSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    speedBtn: {
      padding: '6px 12px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      color: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      fontSize: '13px',
      transition: 'all 0.2s',
    },
    banner: {
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      backgroundColor: 'rgba(30,30,35,0.95)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
    },
    bannerClose: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      padding: '4px',
    },
    bannerBtn: {
      padding: '8px 16px',
      backgroundColor: 'rgba(124,58,237,0.2)',
      border: 'none',
      borderRadius: '8px',
      color: '#A78BFA',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>C</div>
          <span style={styles.logoText}>Canvix</span>
        </div>
        <div style={styles.headerRight}>
          {selectedMode && (
            <div style={styles.modeIndicator}>
              {quickActions.find(a => a.id === selectedMode)?.icon}
              {quickActions.find(a => a.id === selectedMode)?.label}
            </div>
          )}
          <div style={styles.creditsDisplay}>
            <span>🪙</span>
            <span>{user?.credits?.total - user?.credits?.used || 320} remaining</span>
          </div>
          <button style={styles.profileBtn}>
            {user?.name?.charAt(0) || 'U'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div style={styles.welcomeSection}>
            <div style={styles.welcomeIcon}>✨</div>
            <h1 style={styles.welcomeTitle}>Hi {user?.name?.split(' ')[0] || 'Creator'}</h1>
            <h2 style={styles.welcomeSubtitle}>What should we create?</h2>

            {/* Quick Actions */}
            <div style={styles.quickActionsRow}>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  style={styles.quickActionBtn}
                  onClick={() => handleQuickAction(action)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = action.color;
                    e.currentTarget.style.backgroundColor = `${action.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div style={styles.messagesContainer}>
            {messages.map((message) => (
              <div key={message.id} style={styles.messageWrapper}>
                {message.type === 'user' && (
                  <div style={styles.userMessage}>
                    <div style={styles.userBubble}>
                      {message.image && (
                        <img 
                          src={message.image} 
                          alt="Uploaded" 
                          style={{ maxWidth: '200px', borderRadius: '12px', marginBottom: '8px' }}
                        />
                      )}
                      {message.text}
                    </div>
                    <div style={styles.userAvatar}>
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                )}

                {message.type === 'assistant' && (
                  <div style={styles.assistantMessage}>
                    <div style={styles.assistantAvatar}>✨</div>
                    <div style={styles.assistantBubble}>
                      {message.isGenerating ? (
                        <div style={styles.loadingDots}>
                          <div className="dot" style={{ ...styles.dot, animationDelay: '0s' }} />
                          <div className="dot" style={{ ...styles.dot, animationDelay: '0.2s' }} />
                          <div className="dot" style={{ ...styles.dot, animationDelay: '0.4s' }} />
                        </div>
                      ) : (
                        <>
                          <div 
                            style={styles.assistantText}
                            dangerouslySetInnerHTML={{ 
                              __html: message.text
                                .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#FF6B35">$1</strong>')
                                .replace(/\n/g, '<br/>') 
                            }}
                          />

                          {/* Generated Content */}
                          {message.generatedContent && (
                            <div style={styles.generatedContent}>
                              {message.generatedContent.type === 'image' ? (
                                <div style={styles.generatedImage}>🖼️</div>
                              ) : (
                                <div style={styles.generatedVideo}>
                                  <div style={styles.playButton}>▶</div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.suggestions && (
                            <div style={styles.suggestions}>
                              {message.suggestions.map((suggestion, i) => (
                                <button
                                  key={i}
                                  style={styles.suggestionBtn}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.borderColor = '#FF6B35';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                  }}
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {message.type === 'system' && (
                  <div style={styles.systemMessage}>
                    <span>{message.icon}</span>
                    <span>{message.text}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && !messages.some(m => m.isGenerating) && (
              <div style={styles.assistantMessage}>
                <div style={styles.assistantAvatar}>✨</div>
                <div style={styles.loadingDots}>
                  <div className="dot" style={{ ...styles.dot, animationDelay: '0s' }} />
                  <div className="dot" style={{ ...styles.dot, animationDelay: '0.2s' }} />
                  <div className="dot" style={{ ...styles.dot, animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Section */}
        <div style={styles.inputSection}>
          <div style={styles.inputWrapper}>
            {/* Upload Preview */}
            {uploadedFile && (
              <div style={styles.uploadPreview}>
                <img src={uploadedFile} alt="Upload" style={styles.uploadedImage} />
                <button 
                  style={styles.removeUpload}
                  onClick={() => setUploadedFile(null)}
                >
                  ✕
                </button>
              </div>
            )}

            <div style={styles.inputTop}>
              <textarea
                style={styles.textInput}
                placeholder={
                  selectedMode === 'edit' 
                    ? "Tell Canvix how to edit the image..."
                    : selectedMode === 'image'
                    ? "Describe the image you want to create..."
                    : selectedMode === 'video'
                    ? "Describe the video you want to generate..."
                    : "Ask Canvix anything..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
              />
            </div>

            <div style={styles.inputBottom}>
              <div style={styles.inputActions}>
                {/* Upload Button */}
                <button 
                  style={styles.inputBtn}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>➕</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                {/* Tools Button */}
                <button 
                  style={styles.toolsBtn}
                  onClick={() => setShowModeSelector(!showModeSelector)}
                >
                  <span>🎛️</span>
                  Tools
                </button>

                {/* Speed Selector */}
                <div style={styles.speedSelector}>
                  {['Fast', 'Balanced', 'Quality'].map((speed) => (
                    <button
                      key={speed}
                      style={{
                        ...styles.speedBtn,
                        backgroundColor: modelSpeed === speed.toLowerCase() ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: modelSpeed === speed.toLowerCase() ? 'white' : 'rgba(255,255,255,0.5)',
                      }}
                      onClick={() => setModelSpeed(speed.toLowerCase())}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <button
                style={{
                  ...styles.sendBtn,
                  ...(!inputValue.trim() && !uploadedFile ? styles.disabledBtn : {}),
                }}
                disabled={!inputValue.trim() && !uploadedFile}
                onClick={handleSend}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Quick Actions (when no messages) */}
          {messages.length === 0 && (
            <div style={{ ...styles.quickActionsRow, marginTop: '16px' }}>
              {quickActions.slice(0, 3).map((action) => (
                <button
                  key={action.id}
                  style={{
                    ...styles.quickActionBtn,
                    padding: '10px 16px',
                    fontSize: '13px',
                  }}
                  onClick={() => handleQuickAction(action)}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Feature Banner */}
      <div style={styles.banner}>
        <button style={styles.bannerClose}>✕</button>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          New! Video generation just got better with AI 2.0
        </span>
        <button style={styles.bannerBtn}>Try now</button>
      </div>
    </div>
  );
}
