// @ts-nocheck
"use client";
import React from "react";
import { Check } from "lucide-react";

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
  grouped?: boolean; // if true, group by "type" field
}

export function ModelDropdown({
  options,
  selectedId,
  onSelect,
  onClose,
  grouped = false,
}: ModelDropdownProps) {
  // Build groups
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
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] border border-[#333] rounded-xl p-1.5 min-w-[240px] shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <div className="px-3 pt-2 pb-1.5 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                {group.label}
              </div>
            )}
            {group.items.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  selectedId === opt.id
                    ? "bg-purple-500/10 text-white"
                    : "text-gray-300 hover:bg-[#222] hover:text-white"
                }`}
              >
                <span className="text-base w-6 text-center">{opt.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[13px]">{opt.label}</div>
                  <div className="text-[11px] text-gray-500">
                    {opt.description}
                  </div>
                </div>
                {selectedId === opt.id && (
                  <Check size={14} className="text-purple-400 shrink-0" />
                )}
              </button>
            ))}
            {gi < groups.length - 1 && (
              <div className="h-px bg-[#2a2a2a] mx-3 my-1" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
