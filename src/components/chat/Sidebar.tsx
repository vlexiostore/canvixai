// @ts-nocheck
"use client";
import React, { useState } from "react";
import {
  PlusCircle,
  PanelLeft,
  MessageSquare,
  Image,
  Video,
  Trash2,
  ArrowLeft,
} from "lucide-react";

interface ConversationItem {
  id: string;
  title: string;
  mode: string;
  updatedAt: string;
}

interface SidebarProps {
  conversations: ConversationItem[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  pageMode: "chat" | "studio";
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  pageMode,
  collapsed,
  onToggle,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "image":
        return <Image size={14} className="text-orange-400" />;
      case "video":
        return <Video size={14} className="text-purple-400" />;
      default:
        return <MessageSquare size={14} className="text-blue-400" />;
    }
  };

  // Group conversations by date
  const today = new Date();
  const todayStr = today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const groups: { label: string; items: ConversationItem[] }[] = [];
  const todayItems: ConversationItem[] = [];
  const yesterdayItems: ConversationItem[] = [];
  const olderItems: ConversationItem[] = [];

  conversations.forEach((c) => {
    const d = new Date(c.updatedAt).toDateString();
    if (d === todayStr) todayItems.push(c);
    else if (d === yesterdayStr) yesterdayItems.push(c);
    else olderItems.push(c);
  });

  if (todayItems.length) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length)
    groups.push({ label: "Yesterday", items: yesterdayItems });
  if (olderItems.length) groups.push({ label: "Previous", items: olderItems });

  if (collapsed) {
    return (
      <aside className="fixed left-0 top-0 h-full w-[52px] bg-[#111111] flex flex-col items-center border-r border-[#222] z-20 py-4 gap-4">
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <PanelLeft size={20} />
        </button>
        <button
          onClick={onNewChat}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <PlusCircle size={20} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#111111] flex flex-col border-r border-[#222] z-20">
      {/* Header */}
      <div className="p-5 flex items-center justify-between">
        <span className="text-xl font-sans font-semibold text-purple-400">
          Canvix
        </span>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      {/* Actions */}
      <div className="px-3 space-y-2">
        <button
          onClick={onNewChat}
          className="flex items-center gap-3 text-white hover:bg-[#1a1a1a] w-full p-2.5 rounded-lg transition-colors"
        >
          <PlusCircle size={18} />
          <span className="text-sm font-medium">New chat</span>
        </button>

        <a
          href="/dashboard"
          className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-[#1a1a1a] w-full p-2.5 rounded-lg transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </a>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto mt-4 px-2 scrollbar-thin">
        {groups.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Start a new chat to begin
            </p>
          </div>
        )}

        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-gray-500 font-medium">
              {group.label}
            </div>
            {group.items.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors group relative ${
                  activeConversationId === conv.id
                    ? "bg-[#1a1a1a] text-white"
                    : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                }`}
              >
                {getModeIcon(conv.mode)}
                <span className="truncate flex-1">
                  {conv.title || "New conversation"}
                </span>
                {hoveredId === conv.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors p-0.5"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#222]">
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-500">
          <div className="w-4 h-4 bg-[#333] rounded flex items-center justify-center text-[9px] font-bold text-white">
            C
          </div>
          <span>Canvix AI</span>
        </div>
      </div>
    </aside>
  );
}
