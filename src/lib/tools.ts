import type { LucideIcon } from "lucide-react";
import {
  MessageSquare,
  Wand2,
  Video,
  Film,
  Image as ImageIcon,
  Eraser,
  Sparkles,
  Users,
} from "lucide-react";

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  credits?: number;
}

export const TOOLS_CATALOG: ToolItem[] = [
  {
    id: "canvix-chat",
    title: "Canvix Chat",
    description:
      "Your creative AI assistant. Chat to generate images, videos, and edit content.",
    icon: MessageSquare,
    href: "/tools/chat",
    color: "text-brand-orange",
  },
  {
    id: "studio",
    title: "Creative Studio",
    description:
      "All-in-one creative workspace. Combine multiple AI tools for complex projects.",
    icon: Wand2,
    href: "/tools/studio",
    color: "text-purple-500",
  },
  {
    id: "editor",
    title: "Nano Banana Editor",
    description:
      "Edit images using natural language commands. Simply ask AI to change your image.",
    icon: ImageIcon,
    href: "/tools/editor",
    color: "text-cyan-400",
  },
  {
    id: "image-gen",
    title: "AI Image Generator",
    description:
      "Create stunning visuals from text prompts in seconds. High quality, various styles.",
    icon: ImageIcon,
    href: "/tools/studio",
    color: "text-pink-500",
  },
  {
    id: "video-gen",
    title: "AI Video Generator",
    description:
      "Turn text or images into engaging videos. Perfect for social media and ads.",
    icon: Film,
    href: "/tools/studio",
    color: "text-blue-500",
  },
  {
    id: "img-to-video",
    title: "Image to Video",
    description:
      "Bring static images to life with AI animation. Add motion to your photos.",
    icon: Video,
    href: "/tools/studio",
    color: "text-green-500",
  },
  {
    id: "object-removal",
    title: "Object Removal",
    description:
      "Remove unwanted objects, people, or text from your images instantly.",
    icon: Eraser,
    href: "/tools/editor",
    color: "text-red-400",
  },
  {
    id: "sharpen",
    title: "AI Sharpen",
    description:
      "Enhance image clarity and restore details in blurry photos.",
    icon: Wand2,
    href: "/tools/editor",
    color: "text-yellow-400",
  },
  {
    id: "denoise",
    title: "AI Denoise",
    description:
      "Remove grain and noise from low-light photos while preserving details.",
    icon: Sparkles,
    href: "/tools/editor",
    color: "text-indigo-400",
  },
  {
    id: "face-swap",
    title: "AI Face Swap",
    description:
      "Swap faces in images with high precision and realistic results.",
    icon: Users,
    href: "/tools/editor",
    color: "text-rose-400",
  },
];
