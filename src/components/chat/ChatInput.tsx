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
} from "lucide-react";

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
  referenceImage?: string | null;
  onRemoveReference?: () => void;
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
  referenceImage,
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

  return (
    <div className="w-full max-w-[720px] mx-auto relative group">
      {/* Reference Image Indicator */}
      {isStudio && referenceImage && !uploadedFile && (
        <div className="flex items-center gap-2 sm:gap-3 mb-2 px-3 sm:px-4 py-2 bg-orange-500/5 border border-orange-500/15 rounded-xl">
          <img
            src={referenceImage}
            alt="Reference"
            className="w-8 h-8 sm:w-9 sm:h-9 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-orange-400">
              Reference image active
            </div>
            <div className="text-[10px] sm:text-[11px] text-gray-500">
              Will be used for next generation
            </div>
          </div>
          <button
            onClick={onRemoveReference}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <X size={14} />
          </button>
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
                  title="Upload image"
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
