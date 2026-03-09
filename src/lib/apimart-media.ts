/**
 * APIMart Image & Video Generation Client
 *
 * Image generation: POST https://api.apimart.ai/v1/images/generations
 * Video generation: POST https://api.apimart.ai/v1/videos/generations
 * Task polling:     GET  https://api.apimart.ai/v1/tasks/{task_id}
 *
 * All generation APIs are async -- they return a task_id which must be polled.
 */

const APIMART_BASE_URL =
  process.env.APIMART_BASE_URL || "https://api.apimart.ai/v1";
const APIMART_API_KEY = process.env.APIMART_API_KEY!;

// ---- Retry Helper ----

/**
 * Fetch with automatic retry on 429 (rate-limited) responses.
 * Waits the `retry_after` value from the response, or uses exponential backoff.
 * Up to 3 retries.
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, init);

    if (response.status !== 429) {
      return response;
    }

    // Rate limited — extract retry_after or use backoff
    if (attempt >= maxRetries) {
      return response; // Return the 429 on final attempt
    }

    let waitMs = (attempt + 1) * 5000; // 5s, 10s, 15s default backoff

    try {
      const body = await response.clone().json();
      if (body?.detail && typeof body.retry_after === "number") {
        waitMs = (body.retry_after + 1) * 1000; // Add 1s buffer
      } else if (body?.error?.message?.includes("retry")) {
        // Try to parse retry_after from error message
        const match = body.error.message.match(/(\d+)s/);
        if (match) waitMs = (parseInt(match[1]) + 1) * 1000;
      }
    } catch {
      // Ignore parse errors, use default backoff
    }

    console.log(`APIMart 429 rate limited. Retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})...`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    lastError = new Error(`Rate limited after ${attempt + 1} retries`);
  }

  throw lastError || new Error("Rate limited");
}

// ---- Image Models ----

export const IMAGE_MODELS = [
  {
    id: "gemini-2.5-flash-image-preview",
    label: "Gemini 2.5 Flash",
    description: "Fast generation",
    icon: "⚡",
    resolutions: ["1K"],
  },
  {
    id: "gemini-3-pro-image-preview",
    label: "Gemini 3 Pro",
    description: "High quality",
    icon: "✨",
    resolutions: ["1K", "2K", "4K"],
  },
  {
    id: "doubao-seedance-4-5",
    label: "Seedream 4.5",
    description: "Ultra HD, multi-mode",
    icon: "💎",
    resolutions: ["2K", "4K"],
  },
] as const;

export const DEFAULT_IMAGE_MODEL = "gemini-2.5-flash-image-preview";
export const VALID_IMAGE_MODEL_IDS = IMAGE_MODELS.map((m) => m.id);

// ---- Video Models ----

export const VIDEO_MODELS = [
  {
    id: "kling-v2-6",
    label: "Kling v2.6",
    description: "5-10s, 1080p pro, image-to-video, audio",
    icon: "👑",
    durations: [5, 10],
    resolutions: ["720p", "1080p"],
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsImageRef: true,
    supportsAudio: true,
  },
  {
    id: "wan2.6",
    label: "Wan 2.6",
    description: "5-15s, image-to-video supported",
    icon: "🎥",
    durations: [5, 10, 15],
    resolutions: ["720p", "1080p"],
    aspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    supportsImageRef: true,
    supportsAudio: false,
  },
  {
    id: "veo3.1-fast",
    label: "Veo 3.1 Fast",
    description: "8s, up to 4K, text-to-video, audio",
    icon: "🎬",
    durations: [8],
    resolutions: ["720p", "1080p", "4k"],
    aspectRatios: ["16:9", "9:16"],
    supportsImageRef: false,
    supportsAudio: false,
  },
  {
    id: "veo3.1-quality",
    label: "Veo 3.1 Quality",
    description: "8s, 1080p, premium cinematic output",
    icon: "🎞️",
    durations: [8],
    resolutions: ["720p", "1080p"],
    aspectRatios: ["16:9", "9:16"],
    supportsImageRef: false,
    supportsAudio: false,
  },
  {
    id: "doubao-seedance-1-0-pro-fast",
    label: "Seedance 1.0 Pro Fast",
    description: "Fast turbo mode, image-to-video",
    icon: "🌱",
    durations: [5, 10],
    resolutions: ["720p", "1080p"],
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsImageRef: true,
    supportsAudio: false,
  },
  {
    id: "doubao-seedance-1-5-pro",
    label: "Seedance 1.5 Pro",
    description: "Smoother motion, ultra-clear, image-to-video, audio",
    icon: "🌿",
    durations: [5, 10],
    resolutions: ["720p", "1080p"],
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsImageRef: true,
    supportsAudio: true,
  },
  {
    id: "sora-2-pro",
    label: "Sora 2 Pro",
    description: "Up to 25s, 1024p, cinematic, audio",
    icon: "🎥",
    durations: [5, 10, 15, 20, 25],
    resolutions: ["720p", "1080p"],
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsImageRef: true,
    supportsAudio: true,
  },
] as const;

export const DEFAULT_VIDEO_MODEL = "kling-v2-6";
export const VALID_VIDEO_MODEL_IDS = VIDEO_MODELS.map((m) => m.id);

// ---- Types ----

interface ApimartSubmitResponse {
  code: number;
  data: { status: string; task_id: string }[];
  error?: { code: number; message: string; type: string };
}

export interface ApimartTaskStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  progress: number;
  result?: {
    images?: { url: string[]; expires_at: number }[];
    videos?: { url: string; expires_at: number; thumbnail_url?: string }[];
    thumbnail_url?: string;
  };
  created: number;
  completed?: number;
  estimated_time?: number;
  actual_time?: number;
  error?: { code: number; message: string; type: string };
}

// ---- Image Generation ----

export async function submitImageGeneration(params: {
  model: string;
  prompt: string;
  size?: string;
  resolution?: string;
  n?: number;
  imageUrls?: string[];
}): Promise<{ taskId: string }> {
  const body: Record<string, unknown> = {
    model: params.model,
    prompt: params.prompt,
    size: params.size || "1:1",
    n: params.n || 1,
  };

  // Resolution depends on model
  if (params.model === "doubao-seedance-4-5") {
    body.resolution = params.resolution || "2K";
  } else {
    body.resolution = params.resolution || "1K";
  }

  if (params.imageUrls && params.imageUrls.length > 0) {
    body.image_urls = params.imageUrls;
  }

  const response = await fetchWithRetry(`${APIMART_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${APIMART_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `APIMart image generation error (${response.status}): ${errorText}`
    );
  }

  const data: ApimartSubmitResponse = await response.json();

  if (data.error) {
    throw new Error(`APIMart error: ${data.error.message}`);
  }

  if (!data.data?.[0]?.task_id) {
    throw new Error("APIMart did not return a task_id");
  }

  return { taskId: data.data[0].task_id };
}

// ---- Video Generation ----

export async function submitVideoGeneration(params: {
  model: string;
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  resolution?: string;
  imageUrls?: string[];
  negativePrompt?: string;
  audio?: boolean;
}): Promise<{ taskId: string }> {
  // If reference images are provided, auto-switch from models that don't support it
  let model = params.model;
  const hasRefs = params.imageUrls && params.imageUrls.length > 0;

  // Models that don't support image refs — auto-switch to kling-v2-6
  const noRefModels = ["veo3.1-fast", "veo3.1-quality"];
  if (hasRefs && noRefModels.includes(model)) {
    console.log(`Image-to-video: switching from ${model} to kling-v2-6 (supports image refs)`);
    model = "kling-v2-6";
  }

  const body: Record<string, unknown> = {
    model,
    prompt: params.prompt,
  };

  if (model === "kling-v2-6") {
    const isPro = params.resolution === "1080p";
    body.mode = isPro ? "pro" : "std";
    body.duration = params.duration === 10 ? 10 : 5;
    body.aspect_ratio = params.aspectRatio || "16:9";
    if (params.negativePrompt) body.negative_prompt = params.negativePrompt;
    if (isPro && params.audio && (!hasRefs || params.imageUrls!.length <= 1)) body.audio = true;
    body.watermark = false;
  } else if (model === "veo3.1-fast" || model === "veo3.1-quality") {
    body.duration = 8;
    body.aspect_ratio = params.aspectRatio || "16:9";
    body.resolution = params.resolution || "720p";
  } else if (model === "wan2.6") {
    body.duration = params.duration || 5;
    body.aspect_ratio = params.aspectRatio || "16:9";
    body.resolution = params.resolution || "720p";
    body.prompt_extend = true;
    body.watermark = false;
  } else if (model === "doubao-seedance-1-0-pro-fast" || model === "doubao-seedance-1-0-pro-quality") {
    body.duration = params.duration || 5;
    body.aspect_ratio = params.aspectRatio || "16:9";
    body.resolution = params.resolution || "720p";
  } else if (model === "doubao-seedance-1-5-pro") {
    body.duration = params.duration || 5;
    body.aspect_ratio = params.aspectRatio || "16:9";
    body.resolution = params.resolution || "720p";
    if (params.audio) body.audio = true;
  } else if (model === "sora-2-pro" || model === "sora-2-pro-preview") {
    body.duration = params.duration || 10;
    body.aspect_ratio = params.aspectRatio || "16:9";
  }

  if (hasRefs) {
    if (model === "kling-v2-6") {
      body.image_urls = params.imageUrls!.slice(0, 2);
    } else if (model === "doubao-seedance-1-5-pro") {
      body.image_urls = params.imageUrls!.slice(0, 2);
    } else {
      body.image_urls = params.imageUrls;
    }
  }

  const response = await fetchWithRetry(`${APIMART_BASE_URL}/videos/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${APIMART_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `APIMart video generation error (${response.status}): ${errorText}`
    );
  }

  const data: ApimartSubmitResponse = await response.json();

  if (data.error) {
    throw new Error(`APIMart error: ${data.error.message}`);
  }

  if (!data.data?.[0]?.task_id) {
    throw new Error("APIMart did not return a task_id");
  }

  return { taskId: data.data[0].task_id };
}

// ---- Task Status Polling ----

export async function getApimartTaskStatus(
  taskId: string
): Promise<ApimartTaskStatus> {
  const response = await fetch(
    `${APIMART_BASE_URL}/tasks/${taskId}?language=en`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${APIMART_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `APIMart task status error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`APIMart error: ${data.error.message}`);
  }

  return data.data as ApimartTaskStatus;
}

// ---- Helpers ----

/**
 * Extract the result URL from a completed task.
 * Images: result.images[0].url[0]
 * Videos: result.videos[0].url
 */
export function extractResultUrl(task: ApimartTaskStatus): string | null {
  if (task.status !== "completed" || !task.result) return null;

  if (task.result.images?.[0]?.url?.[0]) {
    return task.result.images[0].url[0];
  }

  if (task.result.videos?.[0]?.url) {
    return task.result.videos[0].url;
  }

  return null;
}

/**
 * Map frontend quality names to APIMart resolution values.
 */
export function qualityToResolution(
  quality: string,
  model: string
): string {
  if (model === "doubao-seedance-4-5") {
    // Seedream doesn't support 1K
    if (quality === "ultra-hd") return "4K";
    return "2K";
  }
  if (quality === "ultra-hd") return "4K";
  if (quality === "hd") return "2K";
  return "1K";
}
