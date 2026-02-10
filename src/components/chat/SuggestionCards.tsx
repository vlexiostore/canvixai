// @ts-nocheck
"use client";
import React from "react";
import { ChevronRight } from "lucide-react";

interface Card {
  title: string;
  description: string;
  action: string;
}

interface SuggestionCardsProps {
  pageMode: "chat" | "studio";
  onSelect: (action: string) => void;
}

const chatCards: Card[] = [
  {
    title: "Brainstorm ideas",
    description: "Get creative suggestions for your next project",
    action: "brainstorm",
  },
  {
    title: "Enhance a prompt",
    description: "Improve your prompt for better AI results",
    action: "enhance",
  },
  {
    title: "Explain something",
    description: "Get a clear explanation on any topic",
    action: "explain",
  },
  {
    title: "Write content",
    description: "Help with copywriting, captions, scripts",
    action: "write",
  },
];

const studioCards: Card[] = [
  {
    title: "Create an image",
    description: "Generate stunning AI images from text",
    action: "image",
  },
  {
    title: "Create a video",
    description: "Generate AI videos from prompts",
    action: "video",
  },
  {
    title: "Edit an image",
    description: "Transform images with natural language",
    action: "edit",
  },
  {
    title: "Animate an image",
    description: "Turn a still image into a video",
    action: "image-to-video",
  },
];

export function SuggestionCards({ pageMode, onSelect }: SuggestionCardsProps) {
  const cards = pageMode === "studio" ? studioCards : chatCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-[720px] mx-auto mt-6">
      {cards.map((card) => (
        <button
          key={card.action}
          onClick={() => onSelect(card.action)}
          className="text-left group bg-[#1a1a1a] hover:bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#333] rounded-xl p-4 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm text-white">
              {card.title}
            </span>
            <ChevronRight
              size={14}
              className="text-gray-600 group-hover:translate-x-1 group-hover:text-gray-400 transition-all"
            />
          </div>
          <p className="text-xs text-gray-500">{card.description}</p>
        </button>
      ))}
    </div>
  );
}
