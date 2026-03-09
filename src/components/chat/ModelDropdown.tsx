// @ts-nocheck
"use client";
import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModelOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  type?: string;
}

interface ModelDropdownProps {
  options: ModelOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  grouped?: boolean;
}

export function ModelDropdown({
  options,
  selectedId,
  onSelect,
  onClose,
  grouped = false,
}: ModelDropdownProps) {
  const groups: { label: string; items: ModelOption[] }[] = [];
  if (grouped) {
    const imageItems = options.filter((o) => o.type === "image");
    const videoItems = options.filter((o) => o.type === "video");
    const otherItems = options.filter(
      (o) => o.type !== "image" && o.type !== "video"
    );
    if (imageItems.length)
      groups.push({ label: "Image Models", items: imageItems });
    if (videoItems.length)
      groups.push({ label: "Video Models", items: videoItems });
    if (otherItems.length)
      groups.push({ label: "Models", items: otherItems });
  } else {
    groups.push({ label: "", items: options });
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "absolute bottom-full left-0 right-0 sm:right-auto mb-2 z-50",
          "min-w-[260px] sm:w-auto w-full max-h-[60dvh] overflow-y-auto",
          "rounded-xl border border-white/[0.08] p-1.5 shadow-2xl backdrop-blur-xl",
          "bg-gradient-to-b from-[#1a1a1e] via-[#141418] to-[#0f0f12]"
        )}
      >
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <div className="px-3 pt-2.5 pb-1.5 text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                {group.label}
              </div>
            )}
            {group.items.map((opt) => {
              const isSelected = selectedId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelect(opt.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-150",
                    isSelected
                      ? "bg-purple-500/10 text-white"
                      : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <span className="text-base w-6 text-center shrink-0">{opt.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[13px]">{opt.label}</div>
                    <div className="text-[11px] text-white/30">{opt.description}</div>
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-purple-400 shrink-0" />
                  )}
                </button>
              );
            })}
            {gi < groups.length - 1 && (
              <div className="h-px bg-white/[0.06] mx-3 my-1" />
            )}
          </div>
        ))}
      </motion.div>
    </>
  );
}
