// @ts-nocheck
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestionCards } from "@/components/chat/SuggestionCards";
import { ModelDropdown } from "@/components/chat/ModelDropdown";

/**
 * Canvix AI — dual-purpose interface
 *
 * pageMode="chat"   → General AI chat only. No image/video generation. Chat model selector shown.
 * pageMode="studio" → Direct generation: user types prompt → generates image/video. NO chat. No GPT model selector.
 */
export default function CreativeAIChatPage({ user, pageMode = "studio", onSwitchMode }) {
  const isStudio = pageMode === "studio";

  // ─── State ──────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [selectedMode, setSelectedMode] = useState(isStudio ? "image" : "general");
  const [conversationId, setConversationId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Models — Chat (only used in chat mode)
  const [selectedModel, setSelectedModel] = useState("gpt-5-mini");
  // Generation models — separate for image and video
  const [selectedImageModel, setSelectedImageModel] = useState("gemini-2.5-flash-image-preview");
  const [selectedVideoModel, setSelectedVideoModel] = useState("veo3.1-fast");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  // Generation mode toggle (studio only)
  const [generationMode, setGenerationMode] = useState("image");

  // Dropdowns
  const [showChatModelDropdown, setShowChatModelDropdown] = useState(false);
  const [showImageModelDropdown, setShowImageModelDropdown] = useState(false);
  const [showVideoModelDropdown, setShowVideoModelDropdown] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);

  // History
  const [conversations, setConversations] = useState([]);

  const messagesEndRef = useRef(null);

  // ─── Model Definitions ──────────────────────────────────
  const chatModels = [
    { id: "gpt-5", label: "Canvix 2.0", description: "Balanced", icon: "⚡" },
    { id: "gpt-5-chat-latest", label: "Canvix 2.5 RC", description: "Latest", icon: "🧪" },
    { id: "gpt-5-mini", label: "Canvix Mini", description: "Fast & efficient", icon: "🚀" },
    { id: "gpt-5-nano", label: "Canvix Nano", description: "Ultra-fast", icon: "💨" },
    { id: "gpt-5-pro", label: "Canvix Ultra", description: "Maximum quality", icon: "👑" },
  ];

  const imageGenModels = [
    { id: "gemini-2.5-flash-image-preview", label: "Canvix Flash", description: "Fast image gen", icon: "⚡" },
    { id: "gemini-3-pro-image-preview", label: "Canvix Pro", description: "High quality", icon: "✨" },
    { id: "doubao-seedance-4-5", label: "Canvix HD", description: "Ultra HD", icon: "💎" },
  ];

  const videoGenModels = [
    { id: "veo3.1-fast", label: "Canvix Video Fast", description: "8s, up to 4K", icon: "🎬" },
    { id: "wan2.6", label: "Canvix Video Pro", description: "5-15s, audio", icon: "🎥" },
  ];

  const currentImageModel = imageGenModels.find((m) => m.id === selectedImageModel) || imageGenModels[0];
  const currentVideoModel = videoGenModels.find((m) => m.id === selectedVideoModel) || videoGenModels[0];
  const currentChatModel = chatModels.find((m) => m.id === selectedModel) || chatModels[2];

  const ratioOptions = [
    { id: "1:1", label: "1:1", description: "Square", icon: "⬜" },
    { id: "16:9", label: "16:9", description: "Landscape", icon: "🖥️" },
    { id: "9:16", label: "9:16", description: "Portrait", icon: "📱" },
    { id: "4:3", label: "4:3", description: "Classic", icon: "🖼️" },
  ];

  // ─── Scroll & History ───────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      const json = await res.json();
      if (json.success) setConversations(json.data || []);
    } catch (e) {
      console.error("Failed to load conversations:", e);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadConversation = async (id) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const json = await res.json();
      if (json.success) {
        setConversationId(id);
        setSelectedMode(json.data.mode || (isStudio ? "image" : "general"));
        setMessages(
          (json.data.messages || []).map((m, i) => ({
            id: Date.now() + i,
            type: m.role,
            text: m.content,
            suggestions: m.metadata?.suggestions,
            enhancedPrompt: m.metadata?.enhancedPrompt,
            timestamp: m.createdAt,
          }))
        );
      }
    } catch (e) {
      console.error("Failed to load conversation:", e);
    }
  };

  const deleteConversation = async (id) => {
    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }
    } catch (e) {
      console.error("Failed to delete conversation:", e);
    }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setReferenceImage(null);
    setUploadedFile(null);
    setInputValue("");
    setSelectedMode(isStudio ? "image" : "general");
  };

  // ─── API: Chat Completion (CHAT MODE ONLY) ────────────────
  const getGPTResponse = async (userMessage, context) => {
    try {
      const mode = context.mode || "general";
      const history = messages
        .filter((m) => m.type === "user" || m.type === "assistant")
        .map((m) => ({ role: m.type, content: m.text || "" }))
        .filter((m) => m.content.length > 0);

      const res = await fetch("/api/chat/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          mode,
          model: selectedModel,
          conversationId,
          conversationHistory: history,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        return { text: json.error?.message || "Something went wrong.", suggestions: ["Try again"] };
      }

      if (json.data.conversationId) {
        setConversationId(json.data.conversationId);
        loadConversations();
      }

      return {
        text: json.data.text,
        suggestions: json.data.suggestions || [],
        awaitingConfirmation: json.data.awaitingConfirmation,
        enhancedPrompt: json.data.enhancedPrompt,
      };
    } catch (error) {
      console.error("Chat API error:", error);
      return { text: "I'm having trouble connecting. Please try again.", suggestions: ["Try again"] };
    }
  };

  // ─── API: Job Polling ───────────────────────────────────
  const pollJobStatus = async (jobId, maxAttempts = 120) => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const json = await res.json();
        if (!json.success) continue;

        const progress = json.data.progress;
        if (progress !== undefined && progress > 0) {
          setMessages((prev) =>
            prev.map((m) => (m.isGenerating ? { ...m, text: `Generating... ${progress}%` } : m))
          );
        }
        if (json.data.status === "completed") return json.data;
        if (json.data.status === "failed") return json.data;
      } catch (e) {
        console.error("Poll error:", e);
      }
    }
    return { status: "failed", error: "Timed out" };
  };

  // ─── API: Content Generation (STUDIO MODE) ────────────────
  const generateContent = async (prompt, type, refImage = null) => {
    try {
      const isVideo = type === "video";
      const model = isVideo ? selectedVideoModel : selectedImageModel;
      const endpoint = isVideo ? "/api/pixlr/generate/video" : "/api/pixlr/generate/image";

      const body = isVideo
        ? { prompt, model, duration: 8, style: "cinematic", aspectRatio: selectedRatio, resolution: "720p" }
        : { prompt, model, style: "photorealistic", quality: "hd", aspectRatio: selectedRatio };

      if (refImage || referenceImage) body.imageUrls = [refImage || referenceImage];

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!json.success) return { success: false, error: json.error?.message || "Generation failed" };

      if (json.data.status === "completed" && json.data.result?.url) {
        return { success: true, type, url: json.data.result.url, prompt };
      }

      const result = await pollJobStatus(json.data.jobId);
      return {
        success: result.status === "completed",
        type,
        url: result.result?.url || "",
        prompt,
        error: result.error,
      };
    } catch (error) {
      console.error("Generation error:", error);
      return { success: false, error: "Generation failed" };
    }
  };

  // ─── Chat-mode: detect generation requests ──────────────
  const isGenerationRequest = (text) => {
    const lower = text.toLowerCase();
    const kw = [
      "generate an image", "generate image", "create an image", "create image",
      "make an image", "make image", "draw", "paint", "illustrate",
      "generate a video", "generate video", "create a video", "create video",
      "make a video", "make video", "generate a picture", "create a picture",
    ];
    return kw.some((k) => lower.includes(k));
  };

  // ─── Handle Send ────────────────────────────────────────
  const handleSend = async () => {
    if (!inputValue.trim() && !uploadedFile) return;

    const hasImage = !!uploadedFile;
    let messageText = inputValue.trim();

    // ═══ STUDIO MODE: Direct generation (no chat) ═══
    if (isStudio) {
      // Image-only upload → save as reference
      if (!messageText && hasImage) {
        const userMsg = { id: Date.now(), type: "user", text: "Uploaded a reference image.", image: uploadedFile, timestamp: new Date() };
        setMessages((prev) => [...prev, userMsg]);

        const hostedUrl = await uploadReferenceImage(uploadedFile);
        setReferenceImage(hostedUrl || uploadedFile);
        setUploadedFile(null);
        setInputValue("");

        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          type: "assistant",
          text: hostedUrl
            ? "Got your reference image! Type a prompt and I'll use it as reference for generation."
            : "Saved your reference image. Type a prompt to generate.",
          suggestions: ["🗑️ Remove reference"],
          timestamp: new Date(),
        }]);
        return;
      }

      if (!messageText && hasImage) messageText = "Generate from reference image.";
      if (hasImage) {
        const hostedUrl = await uploadReferenceImage(uploadedFile);
        setReferenceImage(hostedUrl || uploadedFile);
      }

      // Show user message
      const userMsg = { id: Date.now(), type: "user", text: messageText, image: hasImage ? uploadedFile : undefined, timestamp: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setUploadedFile(null);
      setIsLoading(true);

      // Go directly to generation — no ChatGPT
      const genType = generationMode;
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        type: "assistant",
        text: `Generating your ${genType}${referenceImage ? " (with reference)" : ""}...`,
        isGenerating: true,
        timestamp: new Date(),
      }]);

      const result = await generateContent(messageText, genType);

      if (result.success) {
        setMessages((prev) => prev.filter((m) => !m.isGenerating).concat({
          id: Date.now() + 2,
          type: "assistant",
          text: `Here's your ${genType}!`,
          generatedContent: { type: genType, url: result.url, prompt: messageText },
          suggestions: ["Download", "Create another"],
          timestamp: new Date(),
        }));
      } else {
        setMessages((prev) => prev.filter((m) => !m.isGenerating).concat({
          id: Date.now() + 2,
          type: "assistant",
          text: `Generation failed: ${result.error || "Unknown error"}. Please try again.`,
          suggestions: ["Try again", "Change model"],
          timestamp: new Date(),
        }));
      }
      setIsLoading(false);
      return;
    }

    // ═══ CHAT MODE: AI conversation ═══
    if (!messageText && hasImage) messageText = "I uploaded an image.";

    const userMsg = { id: Date.now(), type: "user", text: messageText, image: hasImage ? uploadedFile : undefined, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setUploadedFile(null);
    setIsLoading(true);

    try {
      // Block generation requests in chat mode
      if (isGenerationRequest(messageText)) {
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          type: "assistant",
          text: "I can't generate images or videos here. Head over to the **Creative Studio** to create with AI!\n\nI can help you brainstorm ideas and refine prompts here though.",
          suggestions: ["Go to Creative Studio", "Help me brainstorm", "Enhance my prompt"],
          timestamp: new Date(),
        }]);
        setIsLoading(false);
        return;
      }

      const response = await getGPTResponse(messageText, { mode: "general", hasImage, previousMessages: messages });

      const aiMsg = {
        id: Date.now() + 1,
        type: "assistant",
        text: response.text,
        suggestions: response.suggestions || [],
        awaitingConfirmation: response.awaitingConfirmation,
        enhancedPrompt: response.enhancedPrompt,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Handle Suggestion Click ────────────────────────────
  const handleSuggestionClick = async (suggestion) => {
    const lower = suggestion.toLowerCase();

    if (lower.includes("go to creative studio")) { window.location.href = "/tools/studio"; return; }
    if (lower.includes("remove reference")) { setReferenceImage(null); setMessages((prev) => [...prev, { id: Date.now(), type: "system", text: "Reference image removed" }]); return; }

    // Download
    if (lower === "download") {
      const lastGen = [...messages].reverse().find((m) => m.generatedContent?.url);
      if (lastGen?.generatedContent) {
        const ext = lastGen.generatedContent.type === "video" ? "mp4" : "png";
        handleDownload(lastGen.generatedContent.url, `canvix-${Date.now()}.${ext}`);
      }
      return;
    }

    // Studio: "try again" or "create another"
    if (isStudio && (lower.includes("try again") || lower.includes("create another"))) {
      const lastUser = [...messages].reverse().find((m) => m.type === "user");
      if (lastUser?.text) {
        setInputValue(lastUser.text);
      }
      return;
    }

    if (lower.includes("change model")) {
      if (generationMode === "video") setShowVideoModelDropdown(true);
      else setShowImageModelDropdown(true);
      return;
    }

    // Default: set as input
    setInputValue(suggestion);
  };

  // ─── Handle Suggestion Card Click ──────────────────────
  const handleCardAction = (action) => {
    if (isStudio) {
      if (action === "video") {
        setGenerationMode("video");
        setSelectedMode("video");
        setMessages((prev) => [...prev, { id: Date.now(), type: "system", text: "Switched to Video mode" }]);
      } else if (action === "image") {
        setGenerationMode("image");
        setSelectedMode("image");
        setMessages((prev) => [...prev, { id: Date.now(), type: "system", text: "Switched to Image mode" }]);
      } else if (action === "edit") {
        setMessages((prev) => [...prev, {
          id: Date.now(), type: "assistant",
          text: "Upload an image and describe what you'd like to change. I'll generate an edited version.",
          timestamp: new Date(),
        }]);
      } else if (action === "image-to-video") {
        setGenerationMode("video");
        setSelectedMode("video");
        setMessages((prev) => [...prev, {
          id: Date.now(), type: "assistant",
          text: "Upload an image and I'll animate it into a video. Or just describe what video you want.",
          timestamp: new Date(),
        }]);
      }
    } else {
      // Chat mode cards
      setSelectedMode(action);
      const labels = { brainstorm: "Brainstorm", enhance: "Enhance prompt", explain: "Explain", write: "Write content" };
      setMessages((prev) => [...prev, { id: Date.now(), type: "system", text: `Mode: ${labels[action] || action}` }]);
    }
  };

  // ─── File Upload ────────────────────────────────────────
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedFile(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadReferenceImage = async (dataUrl) => {
    try {
      const res = await fetch("/api/upload/reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const json = await res.json();
      if (json.success) return json.data.url;
      console.error("Reference upload failed:", json.error);
      return null;
    } catch (e) {
      console.error("Reference upload error:", e);
      return null;
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename || "canvix-download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, "_blank");
    }
  };

  // ─── Sidebar width ─────────────────────────────────────
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 52 : 260;

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="flex h-[100dvh] bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30 overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onNewChat={startNewChat}
        onSelectConversation={loadConversation}
        onDeleteConversation={deleteConversation}
        pageMode={pageMode}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className="flex-1 flex flex-col h-[100dvh] transition-all duration-200"
        style={{ marginLeft: sidebarWidth }}
      >
        {messages.length === 0 ? (
          /* ═══ Welcome / Empty State ═══ */
          <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 pb-6 sm:pb-8">
            <div className="text-center mb-6 sm:mb-10 space-y-3 sm:space-y-4 mt-12 md:mt-0">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-medium text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                Canvix
              </h1>
              <p className="text-base sm:text-xl md:text-2xl font-semibold text-white/80 px-4">
                {isStudio ? "What should we create?" : "Ready when you are."}
              </p>
              {isStudio && (
                <p className="text-sm text-white/40">
                  Type a prompt → get {generationMode === "video" ? "a video" : "an image"} instantly
                </p>
              )}
            </div>

            <div className="w-full px-2 sm:px-4">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
                disabled={isLoading}
                placeholder={isStudio ? (generationMode === "video" ? "Describe the video you want to create..." : "Describe the image you want to create...") : "Ask me anything..."}
                isStudio={isStudio}
                uploadedFile={uploadedFile}
                onUpload={handleFileUpload}
                onRemoveUpload={() => setUploadedFile(null)}
                referenceImage={referenceImage}
                onRemoveReference={() => setReferenceImage(null)}
                // Image model (studio only)
                genModelLabel={currentImageModel.label}
                genModelIcon={currentImageModel.icon}
                onGenModelClick={() => setShowImageModelDropdown(true)}
                // Video model (studio only)
                videoModelLabel={currentVideoModel.label}
                videoModelIcon={currentVideoModel.icon}
                onVideoModelClick={() => setShowVideoModelDropdown(true)}
                // Chat model (chat only — not passed in studio)
                chatModelLabel={!isStudio ? currentChatModel.label : undefined}
                chatModelIcon={!isStudio ? currentChatModel.icon : undefined}
                onChatModelClick={!isStudio ? () => setShowChatModelDropdown(true) : undefined}
                // Ratio
                ratioLabel={selectedRatio}
                onRatioClick={() => setShowRatioDropdown(true)}
                // Mode toggle (studio only)
                generationMode={generationMode}
                onModeToggle={(mode) => {
                  setGenerationMode(mode);
                  setSelectedMode(mode);
                }}
              />
              <SuggestionCards pageMode={pageMode} onSelect={handleCardAction} />
            </div>
          </div>
        ) : (
          /* ═══ Messages ═══ */
          <>
            <div className="flex-1 overflow-y-auto pt-12 md:pt-0">
              <div className="max-w-[720px] mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {/* User */}
                    {msg.type === "user" && (
                      <div className="flex justify-end gap-2 sm:gap-3">
                        <div className="max-w-[85%] sm:max-w-[75%]">
                          {msg.image && (
                            <img src={msg.image} alt="Uploaded" className="max-w-[200px] rounded-xl mb-2 ml-auto" />
                          )}
                          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl rounded-br-sm px-4 py-3 text-[15px] leading-relaxed">
                            {msg.text}
                          </div>
                        </div>
                        <div className="w-7 h-7 shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                      </div>
                    )}

                    {/* Assistant */}
                    {msg.type === "assistant" && (
                      <div className="flex gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-[10px] sm:text-xs">
                          ✦
                        </div>
                        <div className="max-w-[90%] sm:max-w-[80%] space-y-3">
                          {msg.isGenerating ? (
                            <div className="space-y-2">
                              <p className="text-[15px] text-gray-300">{msg.text}</p>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className="text-[15px] leading-relaxed text-gray-200 prose prose-invert prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: (msg.text || "")
                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                    .replace(/\n/g, "<br/>"),
                                }}
                              />

                              {/* Generated Content */}
                              {msg.generatedContent && (
                                <div className="rounded-xl overflow-hidden border border-[#2a2a2a] relative group/media">
                                  {msg.generatedContent.type === "image" ? (
                                    msg.generatedContent.url ? (
                                      <img src={msg.generatedContent.url} alt={msg.generatedContent.prompt || "Generated"} className="w-full max-w-[400px] rounded-xl" />
                                    ) : (
                                      <div className="w-full max-w-[400px] aspect-square bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-5xl">🖼️</div>
                                    )
                                  ) : msg.generatedContent.url ? (
                                    <video src={msg.generatedContent.url} controls className="w-full max-w-[500px] rounded-xl" />
                                  ) : (
                                    <div className="w-full max-w-[500px] aspect-video bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-2xl">▶</div>
                                    </div>
                                  )}
                                  {msg.generatedContent.url && (
                                    <button
                                      onClick={() => {
                                        const ext = msg.generatedContent.type === "video" ? "mp4" : "png";
                                        handleDownload(msg.generatedContent.url, `canvix-${Date.now()}.${ext}`);
                                      }}
                                      className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg text-white opacity-0 group-hover/media:opacity-100 transition-opacity"
                                      title="Download"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Suggestions */}
                              {msg.suggestions?.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {msg.suggestions.map((s, i) => (
                                    <button
                                      key={i}
                                      onClick={() => handleSuggestionClick(s)}
                                      className="px-3.5 py-1.5 text-[13px] bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/40 hover:bg-[#1f1f1f] text-gray-300 hover:text-white rounded-full transition-all"
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* System */}
                    {msg.type === "system" && (
                      <div className="flex justify-center">
                        <span className="text-xs text-gray-500 bg-[#111] px-3 py-1 rounded-full">{msg.text}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading */}
                {isLoading && !messages.some((m) => m.isGenerating) && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-xs">✦</div>
                    <div className="flex gap-1 py-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ═══ Input (sticky bottom) ═══ */}
            <div className="shrink-0 px-2 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a]">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
                disabled={isLoading}
                placeholder={isStudio ? (generationMode === "video" ? "Describe the video..." : "Describe the image...") : "Type a message..."}
                isStudio={isStudio}
                uploadedFile={uploadedFile}
                onUpload={handleFileUpload}
                onRemoveUpload={() => setUploadedFile(null)}
                referenceImage={referenceImage}
                onRemoveReference={() => setReferenceImage(null)}
                genModelLabel={currentImageModel.label}
                genModelIcon={currentImageModel.icon}
                onGenModelClick={() => setShowImageModelDropdown(true)}
                videoModelLabel={currentVideoModel.label}
                videoModelIcon={currentVideoModel.icon}
                onVideoModelClick={() => setShowVideoModelDropdown(true)}
                chatModelLabel={!isStudio ? currentChatModel.label : undefined}
                chatModelIcon={!isStudio ? currentChatModel.icon : undefined}
                onChatModelClick={!isStudio ? () => setShowChatModelDropdown(true) : undefined}
                ratioLabel={selectedRatio}
                onRatioClick={() => setShowRatioDropdown(true)}
                generationMode={generationMode}
                onModeToggle={(mode) => {
                  setGenerationMode(mode);
                  setSelectedMode(mode);
                }}
              />
            </div>
          </>
        )}
      </main>

      {/* ═══ Dropdowns ═══ */}
      {/* Chat model dropdown (chat mode only) */}
      {showChatModelDropdown && !isStudio && (
        <div className="fixed z-50 bottom-20 left-3 right-3 md:left-auto md:right-auto" style={isMobile ? {} : { left: sidebarWidth + 16, right: 16, bottom: 80 }}>
          <div className="max-w-[720px] mx-auto relative">
            <ModelDropdown
              options={chatModels}
              selectedId={selectedModel}
              onSelect={setSelectedModel}
              onClose={() => setShowChatModelDropdown(false)}
            />
          </div>
        </div>
      )}

      {/* Image model dropdown (studio only) */}
      {showImageModelDropdown && isStudio && (
        <div className="fixed z-50 bottom-20 left-3 right-3 md:left-auto md:right-auto" style={isMobile ? {} : { left: sidebarWidth + 16, right: 16, bottom: 80 }}>
          <div className="max-w-[720px] mx-auto relative">
            <ModelDropdown
              options={imageGenModels}
              selectedId={selectedImageModel}
              onSelect={setSelectedImageModel}
              onClose={() => setShowImageModelDropdown(false)}
            />
          </div>
        </div>
      )}

      {/* Video model dropdown (studio only) */}
      {showVideoModelDropdown && isStudio && (
        <div className="fixed z-50 bottom-20 left-3 right-3 md:left-auto md:right-auto" style={isMobile ? {} : { left: sidebarWidth + 16, right: 16, bottom: 80 }}>
          <div className="max-w-[720px] mx-auto relative">
            <ModelDropdown
              options={videoGenModels}
              selectedId={selectedVideoModel}
              onSelect={setSelectedVideoModel}
              onClose={() => setShowVideoModelDropdown(false)}
            />
          </div>
        </div>
      )}

      {/* Ratio dropdown */}
      {showRatioDropdown && (
        <div className="fixed z-50 bottom-20 left-3 right-3 md:left-auto md:right-auto" style={isMobile ? {} : { left: sidebarWidth + 16, right: 16, bottom: 80 }}>
          <div className="max-w-[720px] mx-auto relative">
            <ModelDropdown
              options={ratioOptions}
              selectedId={selectedRatio}
              onSelect={setSelectedRatio}
              onClose={() => setShowRatioDropdown(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
