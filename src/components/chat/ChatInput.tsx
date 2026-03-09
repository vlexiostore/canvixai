// @ts-nocheck
"use client";
import React, { useRef, useEffect, useCallback } from "react";
import {
  ArrowRight,
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
  Paperclip,
  Check,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  isStudio?: boolean;
  uploadedFile?: string | null;
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveUpload?: () => void;
  referenceImages?: string[];
  onRemoveReference?: (index?: number) => void;
  genModelLabel?: string;
  genModelIcon?: string;
  onGenModelClick?: () => void;
  videoModelLabel?: string;
  videoModelIcon?: string;
  onVideoModelClick?: () => void;
  chatModelLabel?: string;
  chatModelIcon?: string;
  onChatModelClick?: () => void;
  ratioLabel?: string;
  onRatioClick?: () => void;
  generationMode?: "image" | "video";
  onModeToggle?: (mode: "image" | "video") => void;
  videoDuration?: number;
  onDurationClick?: () => void;
  videoResolution?: string;
  onResolutionClick?: () => void;
  videoAudio?: boolean;
  onAudioToggle?: () => void;
  currentVideoModelDef?: VideoModelDef;
}

function useAutoResizeTextarea(minHeight: number, maxHeight: number) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
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
  const { textareaRef, adjustHeight } = useAutoResizeTextarea(56, 300);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { adjustHeight(); }, [value, adjustHeight]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || uploadedFile) {
        onSend();
        adjustHeight(true);
      }
    }
  };

  const hasRefs = referenceImages.length > 0;

  const activeModelLabel =
    isStudio
      ? generationMode === "video"
        ? videoModelLabel
        : genModelLabel
      : chatModelLabel;

  const activeModelIcon =
    isStudio
      ? generationMode === "video"
        ? videoModelIcon
        : genModelIcon
      : chatModelIcon;

  const activeModelClick =
    isStudio
      ? generationMode === "video"
        ? onVideoModelClick
        : onGenModelClick
      : onChatModelClick;

  return (
    <div className="w-full max-w-[720px] mx-auto relative group">
      {/* Reference Images */}
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
                <img src={img} alt={`Reference ${i + 1}`} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border border-white/10" />
                <button onClick={() => onRemoveReference?.(i)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover/ref:opacity-100 transition-opacity">
                  <X size={8} />
                </button>
                <div className="absolute bottom-0 right-0 bg-black/70 text-[8px] text-white/80 px-1 rounded-tl-md rounded-br-lg">{i + 1}</div>
              </div>
            ))}
            {referenceImages.length < 14 && (
              <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg border border-dashed border-white/20 hover:border-orange-400/50 flex items-center justify-center text-white/30 hover:text-orange-400 transition-colors" title="Add another reference">
                <ImagePlus size={16} />
              </button>
            )}
          </div>
          <div className="text-[10px] text-gray-500 mt-1.5">Will be used for next generation</div>
        </div>
      )}

      {/* Main Input Container — animated-ai-input style */}
      <div className="bg-white/[0.03] rounded-2xl p-1.5 border border-white/[0.06] transition-colors focus-within:border-white/[0.12]">
        <div className="relative flex flex-col">
          {/* Upload Preview */}
          {uploadedFile && (
            <div className="px-3 sm:px-4 pt-3">
              <div className="relative inline-block">
                <img src={uploadedFile} alt="Upload" className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl" />
                <button onClick={onRemoveUpload} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors">
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Textarea */}
          <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
            <Textarea
              value={value}
              placeholder={placeholder}
              className={cn(
                "w-full rounded-xl rounded-b-none px-4 py-3 bg-white/[0.03] border-none text-white placeholder:text-white/40 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "min-h-[56px] text-[15px] leading-relaxed"
              )}
              ref={textareaRef}
              onKeyDown={handleKeyDown}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>

          {/* Bottom Actions Bar */}
          <div className="h-12 bg-white/[0.03] rounded-b-xl flex items-center">
            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
              <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto scrollbar-none">
                {/* Model selector */}
                {activeModelClick && (
                  <button
                    onClick={activeModelClick}
                    className="flex items-center gap-1.5 h-8 px-2.5 text-xs rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors font-medium shrink-0"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeModelLabel}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1.5"
                      >
                        {isStudio ? (
                          <span className="text-sm">{activeModelIcon}</span>
                        ) : (
                          <Sparkles size={12} />
                        )}
                        <span className="hidden sm:inline">{activeModelLabel}</span>
                        <ChevronDown size={10} className="opacity-50" />
                      </motion.div>
                    </AnimatePresence>
                  </button>
                )}

                <div className="h-4 w-px bg-white/[0.08] mx-0.5 shrink-0" />

                {/* Upload (studio only) */}
                {isStudio && (
                  <>
                    <label
                      className="rounded-lg p-2 cursor-pointer text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
                      aria-label={hasRefs ? `Add reference (${referenceImages.length}/14)` : "Upload image"}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="w-4 h-4 transition-colors" />
                    </label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
                  </>
                )}

                {/* Mode Toggle: Image / Video (studio only) */}
                {isStudio && onModeToggle && (
                  <div className="flex items-center bg-white/[0.03] rounded-lg border border-white/[0.06] overflow-hidden shrink-0">
                    <button
                      onClick={() => onModeToggle("image")}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium transition-all",
                        generationMode === "image" ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"
                      )}
                    >
                      <ImageIcon size={11} />
                      <span className="hidden sm:inline">Image</span>
                    </button>
                    <button
                      onClick={() => onModeToggle("video")}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium transition-all",
                        generationMode === "video" ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"
                      )}
                    >
                      <Video size={11} />
                      <span className="hidden sm:inline">Video</span>
                    </button>
                  </div>
                )}

                {/* Aspect Ratio (studio only) */}
                {isStudio && onRatioClick && (
                  <button onClick={onRatioClick} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors rounded-lg font-medium shrink-0">
                    <span>{ratioLabel}</span>
                    <ChevronDown size={10} />
                  </button>
                )}

                {/* Duration (studio + video mode) */}
                {isStudio && generationMode === "video" && onDurationClick && (
                  <button onClick={onDurationClick} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors rounded-lg font-medium shrink-0" title="Video duration">
                    <Clock size={10} />
                    <span>{videoDuration}s</span>
                    <ChevronDown size={10} />
                  </button>
                )}

                {/* Resolution (studio + video mode) */}
                {isStudio && generationMode === "video" && onResolutionClick && (
                  <button onClick={onResolutionClick} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors rounded-lg font-medium shrink-0" title="Video resolution">
                    <Monitor size={10} />
                    <span>{videoResolution}</span>
                    <ChevronDown size={10} />
                  </button>
                )}

                {/* Audio toggle (studio + video mode, model supports it & 1080p) */}
                {isStudio && generationMode === "video" && onAudioToggle && currentVideoModelDef?.supportsAudio && videoResolution === "1080p" && (
                  <button
                    onClick={onAudioToggle}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium transition-colors rounded-lg shrink-0",
                      videoAudio ? "text-purple-300 bg-purple-500/20 border border-purple-500/30" : "text-white/40 hover:text-white hover:bg-white/[0.06]"
                    )}
                    title={videoAudio ? "Audio enabled" : "Enable audio"}
                  >
                    {videoAudio ? <Volume2 size={10} /> : <VolumeX size={10} />}
                    <span className="hidden sm:inline">{videoAudio ? "Audio" : "Muted"}</span>
                  </button>
                )}

                {/* Reference count badge */}
                {isStudio && hasRefs && (
                  <span className="px-2 py-1 text-[10px] text-orange-400 bg-orange-500/10 rounded-lg font-medium shrink-0">
                    {referenceImages.length} ref{referenceImages.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Send */}
              <button
                type="button"
                onClick={() => {
                  if (value.trim() || uploadedFile) {
                    onSend();
                    adjustHeight(true);
                  }
                }}
                disabled={disabled || (!value.trim() && !uploadedFile)}
                className={cn(
                  "rounded-lg p-2 transition-all shrink-0",
                  value.trim() || uploadedFile
                    ? "bg-purple-600 text-white hover:bg-purple-500"
                    : "bg-white/[0.04] text-white/20"
                )}
                aria-label="Send message"
              >
                <ArrowRight className={cn("w-4 h-4 transition-opacity duration-200", value.trim() || uploadedFile ? "opacity-100" : "opacity-30")} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient bar */}
      <div className="absolute -bottom-[2px] left-[2px] right-[2px] h-[3px] rounded-b-2xl overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-60 blur-[1px]" />
      </div>
      <div className="absolute -bottom-4 left-10 right-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-10 blur-2xl -z-10" />
    </div>
  );
}
