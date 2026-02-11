// ============================
// Shared TypeScript Types
// ============================

// ---------- User ----------
export type UserPlan = "free" | "basic" | "pro" | "ultimate";

// ---------- Plan Definitions ----------
export interface PlanDefinition {
  name: string;
  imageCredits: number;
  videoCredits: number;
  chatUnlimited: boolean;
  bgRemove: boolean;
  premiumSupport: boolean;
}

export const PLAN_DEFINITIONS: Record<UserPlan, PlanDefinition> = {
  free: { name: "Free", imageCredits: 50, videoCredits: 0, chatUnlimited: false, bgRemove: false, premiumSupport: false },
  basic: { name: "Basic", imageCredits: 3500, videoCredits: 2000, chatUnlimited: true, bgRemove: true, premiumSupport: true },
  pro: { name: "Pro", imageCredits: 8000, videoCredits: 4000, chatUnlimited: true, bgRemove: true, premiumSupport: true },
  ultimate: { name: "Ultimate", imageCredits: 50000, videoCredits: 25000, chatUnlimited: true, bgRemove: true, premiumSupport: true },
};

// ---------- Jobs ----------
export type JobType =
  | "image-gen"
  | "video-gen"
  | "image-to-video"
  | "remove-bg"
  | "upscale"
  | "gen-fill"
  | "expand"
  | "sharpen"
  | "denoise"
  | "face-swap"
  | "object-remove"
  | "bg-change"
  | "edit";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

// ---------- Files ----------
export type FileOrigin = "upload" | "generated" | "edited";
export type FileKind = "image" | "video";

// ---------- Credits ----------
export type CreditTransactionType = "purchase" | "usage" | "refund" | "bonus";

// ---------- Conversations ----------
export type MessageRole = "user" | "assistant" | "system";
export type ConversationMode = "image" | "video" | "edit" | "general";

// ---------- API Request / Response ----------

export interface APISuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type APIResponse<T = unknown> = APISuccessResponse<T> | APIErrorResponse;

// ---------- Chat ----------
export interface ChatCompletionRequest {
  message: string;
  mode: ConversationMode;
  conversationId?: string;
  conversationHistory?: { role: string; content: string }[];
}

export interface ChatCompletionResponse {
  text: string;
  enhancedPrompt?: string;
  suggestions?: string[];
  awaitingConfirmation?: boolean;
  conversationId: string;
}

// ---------- Pixlr Generation ----------
export interface ImageGenRequest {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  quality?: string;
  numImages?: number;
}

export interface VideoGenRequest {
  prompt: string;
  duration?: number;
  resolution?: string;
  fps?: number;
  style?: string;
}

export interface AnimateRequest {
  imageUrl: string;
  motionPrompt?: string;
  duration?: number;
  motionType?: string;
  intensity?: string;
}

// ---------- Pixlr Editing ----------
export interface EditInstructRequest {
  imageUrl: string;
  instruction: string;
}

export interface RemoveBgRequest {
  imageUrl: string;
  outputType?: string;
}

export interface UpscaleRequest {
  imageUrl: string;
  scale?: number;
  denoise?: string;
  faceEnhance?: boolean;
}

export interface GenFillRequest {
  imageUrl: string;
  maskUrl: string;
  prompt: string;
  mode?: string;
}

export interface ExpandRequest {
  imageUrl: string;
  direction?: string;
  amount?: number;
}

// ---------- Job Response ----------
export interface JobResponse {
  jobId: string;
  status: JobStatus;
  type: JobType;
  progress?: number;
  result?: {
    url: string;
    thumbnailUrl?: string;
    metadata?: Record<string, unknown>;
  };
  error?: string;
  createdAt: string;
  completedAt?: string;
}

// ---------- Credits ----------
export interface CreditBalance {
  balance: number;
  used: number;
  plan: UserPlan;
}

export interface CreditHistoryItem {
  id: string;
  amount: number;
  type: CreditTransactionType;
  action?: string;
  description?: string;
  createdAt: string;
}

// ---------- Projects ----------
export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  fileCount: number;
  isStarred: boolean;
  updatedAt: string;
}

// ---------- Credit Costs ----------
export const CREDIT_COSTS: Record<JobType | "chat", number> = {
  "image-gen": 10,
  "video-gen": 25,
  "image-to-video": 15,
  "remove-bg": 2,
  upscale: 3,
  "gen-fill": 5,
  expand: 5,
  sharpen: 2,
  denoise: 2,
  "face-swap": 5,
  "object-remove": 3,
  "bg-change": 4,
  edit: 5,
  chat: 1,
};
