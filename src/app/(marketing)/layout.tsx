"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const FULLSCREEN_TOOL_PATHS = ["/tools/chat", "/tools/studio", "/tools/editor"];
const AUTH_PATHS = ["/login", "/signup"];

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isFullscreenTool = FULLSCREEN_TOOL_PATHS.some((p) => pathname === p);
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Auth pages have their own full-screen layout -- no navbar/footer/ambient
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isFullscreenTool) {
    // Chat/Studio pages have their own sidebar with navigation — no extra wrapper needed
    return <>{children}</>;
  }

  return (
    <>
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-violet/10 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-[200px]" />
      </div>

      <Navbar />
      <main className="relative z-10 min-h-screen pt-20">{children}</main>
      <Footer />
    </>
  );
}
