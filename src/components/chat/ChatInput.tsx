// @ts-nocheck
"use client";
import React, { useRef, useEffect } from "react";
import {
  ArrowUp,
  ImagePlus,
  ChevronDown,
  X,
  Sparkles,
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
  // Model selectors
  genModelLabel?: string;
  genModelIcon?: string;
  onGenModelClick?: () => void;
  chatModelLabel?: string;
  chatModelIcon?: string;
  onChatModelClick?: () => void;
  // Ratio selector
  ratioLabel?: string;
  onRatioClick?: () => void;
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
  chatModelLabel,
  chatModelIcon,
  onChatModelClick,
  ratioLabel,
  onRatioClick,
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
        <div className="flex items-center gap-3 mb-2 px-4 py-2 bg-orange-500/5 border border-orange-500/15 rounded-xl">
          <img
            src={referenceImage}
            alt="Reference"
            className="w-9 h-9 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-orange-400">
              Reference image active
            </div>
            <div className="text-[11px] text-gray-500">
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
          <div className="px-4 pt-3">
            <div className="relative inline-block">
              <img
                src={uploadedFile}
                alt="Upload"
                className="w-16 h-16 object-cover rounded-xl"
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
          className="w-full bg-transparent text-white placeholder-gray-500 px-4 pt-4 pb-14 min-h-[56px] max-h-[200px] resize-none focus:outline-none text-[15px] leading-relaxed"
          rows={1}
        />

        {/* Bottom Actions Bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Upload (studio only) */}
            {isStudio && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg"
                  title="Upload image"
                >
                  <ImagePlus size={18} />
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

            {/* Aspect Ratio (studio only) */}
            {isStudio && onRatioClick && (
              <button
                onClick={onRatioClick}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg font-medium"
              >
                <span>{ratioLabel}</span>
                <ChevronDown size={12} />
              </button>
            )}

            {/* Gen Model (studio only) */}
            {isStudio && onGenModelClick && (
              <button
                onClick={onGenModelClick}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg font-medium"
              >
                <span>{genModelIcon}</span>
                <span>{genModelLabel}</span>
                <ChevronDown size={12} />
              </button>
            )}

            {/* Chat Model (always) */}
            {onChatModelClick && (
              <button
                onClick={onChatModelClick}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors rounded-lg font-medium"
              >
                <Sparkles size={12} />
                <span>{chatModelLabel}</span>
                <ChevronDown size={12} />
              </button>
            )}
          </div>

          {/* Send */}
          <button
            onClick={onSend}
            disabled={disabled || (!value.trim() && !uploadedFile)}
            className="p-2 bg-purple-600 text-white hover:bg-purple-500 disabled:bg-[#2a2a2a] disabled:text-gray-500 transition-colors rounded-full disabled:cursor-not-allowed"
          >
            <ArrowUp size={18} />
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
