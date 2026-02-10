"use client";

import CreativeAIChatPage from "@/components/tools/CreativeAIChat";

export default function ChatPage() {
  const user = {
    name: "Guest User",
    credits: { total: 500, used: 0 },
  };

  return <CreativeAIChatPage user={user} pageMode="chat" onSwitchMode={() => {}} />;
}
