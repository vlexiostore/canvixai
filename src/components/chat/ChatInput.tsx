// @ts-nocheck
"use client";
import React, { useRef, useEffect } from "react";
import {
  ArrowUp,
  ImagePlus,
  ChevronDown,
  X,
  Sparkles,
  Image as ImageIcon,
  Video,
  Clock,
  Monitor,
  Volume2,
  VolumeX,
} from "lucide-react";

interface VideoModelDef {
  id: string;
  label: string;
  description: string;
  icon: string;
  durations: readonly number[] | number[];
  resolutions: readonly string[] | string[];
  supportsImageRef: boolean;
  supportsAudio: boolean;
}

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  // Studio-only props
  isStudio?: boolean;
  uploadedFile?: string | null;
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveUpload?: () => void;
  // Multiple reference images
  referenceImages?: string[];
  onRemoveReference?: (index?: number) => void;
  // Generation model selectors (studio only)
  genModelLabel?: string;
  genModelIcon?: string;
  onGenModelClick?: () => void;
  // Separate video model selector (studio only)
  videoModelLabel?: string;
  videoModelIcon?: string;
  onVideoModelClick?: () => void;
  // Chat model selector (chat only)
  chatModelLabel?: string;
  chatModelIcon?: string;
  onChatModelClick?: () => void;
  // Ratio selector (studio only)
  ratioLabel?: string;
  onRatioClick?: () => void;
  // Mode toggle (studio only)
  generationMode?: "image" | "video";
  onModeToggle?: (mode: "image" | "video") => void;
  // Video settings (studio + video mode only)
  videoDuration?: number;
  onDurationClick?: () => void;
  videoResolution?: string;
  onResolutionClick?: () => void;
  videoAudio?: boolean;
  onAudioToggle?: () => void;
  currentVideoModelDef?: VideoModelDef;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Ask me anything...",
  isStudio = false,
  uploadedFile,
  onUpload,
  onRemoveUpload,
  referenceImages = [],
  onRemoveReference,
  genModelLabel,
  genModelIcon,
  onGenModelClick,
  videoModelLabel,
  videoModelIcon,
  onVideoModelClick,
  chatModelLabel,
  chatModelIcon,
  onChatModelClick,
  ratioLabel,
  onRatioClick,
  generationMode,
  onModeToggle,
  videoDuration,
  onDurationClick,
  videoResolution,
  onResolutionClick,
  videoAudio,
  onAudioToggle,
  currentVideoModelDef,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const hasRefs = referenceImages.length > 0;

  return (
    <div className="w-full max-w-[720px] mx-auto relative group">
      {/* Reference Images Indicator — shows all active references */}
      {isStudio && hasRefs && !uploadedFile && (
        <div className="mb-2 px-3 sm:px-4 py-2.5 bg-orange-500/5 border border-orange-500/15 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-orange-400">
              {referenceImages.length} reference image{referenceImages.length > 1 ? "s" : ""} active
            </div>
            <button
              onClick={() => onRemoveReference?.()}
              className="text-[10px] text-gray-500 hover:text-red-400 transition-colors px-2 py-0.5 rounded-md hover:bg-red-500/10"
            >
              Remove all
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {referenceImages.map((img, i) => (
              <div key={i} className="relative shrink-0 group/ref">
                <img
                  src={img}
                  alt={`Reference ${i + 1}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border border-white/10"
                />
                <button
                  onClick={() => onRemoveReference?.(i)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover/ref:opacity-100 transition-opacity"
                >
                  <X size={8} />
                </button>
                <div className="absolute bottom-0 right-0 bg-black/70 text-[8px] text-white/80 px-1 rounded-tl-md rounded-br-lg">
                  {i + 1}
                </div>
              </div>
            ))}
            {referenceImages.length < 14 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg border border-dashed border-white/20 hover:border-orange-400/50 flex items-center justify-center text-white/30 hover:text-orange-400 transition-colors"
                title="Add another reference"
              >
                <ImagePlus size={16} />
              </button>
            )}
          </div>
          <div className="text-[10px] text-gray-500 mt-1.5">
            Will be used for next generation • {14 - referenceImages.length} slots remaining
          </div>
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative bg-[#1a1a1a] border border-[#333] rounded-2xl overflow-hidden transition-colors focus-within:border-[#444]">
        {/* Upload Preview */}
        {uploadedFile && (
          <div className="px-3 sm:px-4 pt-3">
            <div className="relative inline-block">
              <img
                src={uploadedFile}
                alt="Upload"
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl"
              />
              <button
                onClick={onRemoveUpload}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-white placeholder-gray-500 px-3 sm:px-4 pt-3 sm:pt-4 pb-14 min-h-[52px] sm:min-h-[56px] max-h-[200px] resize-none focus:outline-none text-sm sm:text-[15px] leading-relaxed"
          rows={1}
        />

        {/* Bottom Actions Bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0 overflow-hidden">
            {/* Upload (studio only) */}
            {isStudio && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 sm:p-2 text-gray-500 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg shrink-0"
                  title={hasRefs ? `Add reference (${referenceImages.length}/14)` : "Upload image"}
                >
                  <ImagePlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  className="hidden"
                />
              </>
            )}

            {/* Mode Toggle: Image / Video (studio only) */}
            {isStudio && onModeToggle && (
              <div className="flex items-center bg-[#111] rounded-lg border border-[#2a2a2a] overflow-hidden shrink-0">
                <button
                  onClick={() => onModeToggle("image")}
                  className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
                    generationMode === "image"
                      ? "bg-purple-600 text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <ImageIcon size={11} className="sm:w-3 sm:h-3" />
                  <span className="hidden xs:inline sm:inline">Image</span>
                </button>
                <button
                  onClick={() => onModeToggle("video")}
                  className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
                    generationMode === "video"
                      ? "bg-purple-600 text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <Video size={11} className="sm:w-3 sm:h-3" />
                  <span className="hidden xs:inline sm:inline">Video</span>
                </button>
              </div>
            )}

            {/* Aspect Ratio (studio only) */}
            {isStudio && onRatioClick && (
              <button
                onClick={onRatioClick}
                className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg font-medium shrink-0"
              >
                <span>{ratioLabel}</span>
                <ChevronDown size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}

            {/* Image Model (studio only, image mode) */}
            {isStudio && onGenModelClick && generationMode === "image" && (
              <button
                onClick={onGenModelClick}
                className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg font-medium shrink-0"
              >
                <span>{genModelIcon}</span>
                <span className="hidden xs:inline sm:inline">{genModelLabel}</span>
                <ChevronDown size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}

            {/* Video Model (studio only, video mode) */}
            {isStudio && onVideoModelClick && generationMode === "video" && (
              <button
                onClick={onVideoModelClick}
                className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg font-medium shrink-0"
              >
                <span>{videoModelIcon}</span>
                <span className="hidden xs:inline sm:inline">{videoModelLabel}</span>
                <ChevronDown size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}

            {/* Duration (studio + video mode) */}
            {isStudio && generationMode === "video" && onDurationClick && (
              <button
                onClick={onDurationClick}
                className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg font-medium shrink-0"
                title="Video duration"
              >
                <Clock size={10} className="sm:w-3 sm:h-3" />
                <span>{videoDuration}s</span>
                <ChevronDown size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}

            {/* Resolution (studio + video mode) */}
            {isStudio && generationMode === "video" && onResolutionClick && (
              <button
                onClick={onResolutionClick}
                className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg font-medium shrink-0"
                title="Video resolution"
              >
                <Monitor size={10} className="sm:w-3 sm:h-3" />
                <span>{videoResolution}</span>
                <ChevronDown size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}

            {/* Audio toggle (studio + video mode, only if model supports it & resolution is pro/1080p) */}
            {isStudio && generationMode === "video" && onAudioToggle && currentVideoModelDef?.supportsAudio && videoResolution === "1080p" && (
              <button
                onClick={onAudioToggle}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-medium transition-colors rounded-lg shrink-0 ${
                  videoAudio
                    ? "text-purple-300 bg-purple-500/20 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                }`}
                title={videoAudio ? "Audio enabled (Pro mode)" : "Enable auto audio (Pro mode)"}
              >
                {videoAudio ? <Volume2 size={10} className="sm:w-3 sm:h-3" /> : <VolumeX size={10} className="sm:w-3 sm:h-3" />}
                <span className="hidden xs:inline sm:inline">{videoAudio ? "Audio" : "Muted"}</span>
              </button>
            )}

            {/* Reference count badge (studio, compact) */}
            {isStudio && hasRefs && (
              <span className="px-2 py-1 text-[10px] sm:text-[11px] text-orange-400 bg-orange-500/10 rounded-lg font-medium shrink-0">
                {referenceImages.length} ref{referenceImages.length > 1 ? "s" : ""}
              </span>
            )}

            {/* Chat Model (chat mode only — NOT shown in studio) */}
            {!isStudio && onChatModelClick && (
              <button
                onClick={onChatModelClick}
                className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg font-medium shrink-0"
              >
                <Sparkles size={10} className="sm:w-3 sm:h-3" />
                <span className="hidden xs:inline sm:inline">{chatModelLabel}</span>
                <ChevronDown size={10} className="sm:w-3 sm:h-3" />
              </button>
            )}
          </div>

          {/* Send */}
          <button
            onClick={onSend}
            disabled={disabled || (!value.trim() && !uploadedFile)}
            className="p-1.5 sm:p-2 bg-purple-600 text-white hover:bg-purple-500 disabled:bg-[#2a2a2a] disabled:text-gray-500 transition-colors rounded-full disabled:cursor-not-allowed shrink-0"
          >
            <ArrowUp size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      {/* Gradient Bar with Glow */}
      <div className="absolute -bottom-[2px] left-[2px] right-[2px] h-[3px] rounded-b-2xl overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-80 blur-[1px]" />
      </div>

      {/* Ambient Glow */}
      <div className="absolute -bottom-4 left-10 right-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-15 blur-2xl -z-10" />
    </div>
  );
}
