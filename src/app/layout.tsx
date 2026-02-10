import type { Metadata } from "next";
import { DM_Sans, Syne, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-sans" });
const syne = Syne({ subsets: ["latin"], weight: ["400", "700", "800"], variable: "--font-display" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Canvix.ai - Create Anything, Imagine Everything",
  description: "The all-in-one AI creative platform for designers, creators, and dreamers.",
};

const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkSec = process.env.CLERK_SECRET_KEY ?? "";
const hasClerk =
  clerkPub.startsWith("pk_") &&
  clerkSec.startsWith("sk_") &&
  clerkSec.length > 10;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className={`${dmSans.variable} ${syne.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#0A0A0B] text-white">
        {children}
      </body>
    </html>
  );

  if (hasClerk) {
    return <ClerkProvider publishableKey={clerkPub}>{content}</ClerkProvider>;
  }

  return content;
}
