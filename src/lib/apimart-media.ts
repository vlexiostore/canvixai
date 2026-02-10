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

// ---- Image Models ----

export const IMAGE_MODELS = [
  {
    id: "gemini-2.5-flash-image-preview",
    label: "Canvix Flash",
    description: "Fast generation",
    icon: "⚡",
    resolutions: ["1K"],
  },
  {
    id: "gemini-3-pro-image-preview",
    label: "Canvix Pro",
    description: "High quality",
    icon: "✨",
    resolutions: ["1K", "2K", "4K"],
  },
  {
    id: "doubao-seedance-4-5",
    label: "Canvix HD",
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
    id: "veo3.1-fast",
    label: "Canvix Video Fast",
    description: "8s, up to 4K",
    icon: "🎬",
    durations: [8],
    resolutions: ["720p", "1080p", "4k"],
    aspectRatios: ["16:9", "9:16"],
  },
  {
    id: "wan2.6",
    label: "Canvix Video Pro",
    description: "5-15s, with audio",
    icon: "🎥",
    durations: [5, 10, 15],
    resolutions: ["720p", "1080p"],
    aspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
  },
] as const;

export const DEFAULT_VIDEO_MODEL = "veo3.1-fast";
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

  const response = await fetch(`${APIMART_BASE_URL}/images/generations`, {
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
}): Promise<{ taskId: string }> {
  const body: Record<string, unknown> = {
    model: params.model,
    prompt: params.prompt,
  };

  if (params.model === "veo3.1-fast" || params.model === "veo3.1-quality") {
    body.duration = 8; // VEO3 only supports 8s
    body.aspect_ratio = params.aspectRatio || "16:9";
    body.resolution = params.resolution || "720p";
  } else if (params.model === "wan2.6") {
    body.duration = params.duration || 5;
    body.aspect_ratio = params.aspectRatio || "16:9";
    body.resolution = params.resolution || "720p";
    body.prompt_extend = true;
    body.watermark = false;
  }

  if (params.imageUrls && params.imageUrls.length > 0) {
    body.image_urls = params.imageUrls;
  }

  const response = await fetch(`${APIMART_BASE_URL}/videos/generations`, {
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
