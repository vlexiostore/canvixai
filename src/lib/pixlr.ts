/**
 * Pixlr API Server-Side Client
 *
 * The Pixlr API is an embedding/iframe-based editor API, not a REST generation API.
 * Image/video generation is handled by APIMart (see apimart-media.ts).
 *
 * This module provides:
 * - JWT token generation for Pixlr editor embedding (via @pixlrlte/pixlr-sdk)
 * - Webhook signature verification
 */

import jwt from "jsonwebtoken";

const PIXLR_API_KEY = process.env.PIXLR_API_KEY || "";
const PIXLR_API_SECRET = process.env.PIXLR_API_SECRET || "";

// ---- Pixlr JWT Token (for editor embedding) ----

export function generatePixlrToken(options: {
  mode: "embedded" | "http";
  origin?: string;
  openUrl?: string;
  saveUrl?: string;
  settings?: Record<string, unknown>;
}): string {
  const payload: Record<string, unknown> = {
    sub: PIXLR_API_KEY,
    mode: options.mode,
  };

  if (options.mode === "embedded" && options.origin) {
    payload.origin = options.origin;
  }

  if (options.mode === "http") {
    payload.openUrl = options.openUrl;
    payload.saveUrl = options.saveUrl;
  }

  if (options.settings) {
    payload.settings = options.settings;
  }

  return jwt.sign(payload, PIXLR_API_SECRET, { algorithm: "HS256" });
}

// ---- Mock Editing Types ----
// These editing functions remain as mocks until a dedicated editing API is integrated.
// Image/video GENERATION is now handled by APIMart (see apimart-media.ts).

interface MockJobResponse {
  job_id: string;
  status: string;
}

function generateMockJobId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---- Mock Image-to-Video ----

export async function animateImage(params: {
  imageUrl: string;
  motionPrompt?: string;
  duration?: number;
  motionType?: string;
  intensity?: string;
  jobId: string;
}): Promise<MockJobResponse> {
  console.log(`[MOCK] Image-to-video requested for: ${params.imageUrl}`);
  return { job_id: generateMockJobId(), status: "processing" };
}

// ---- Mock Image Editing ----

export async function editImage(params: {
  imageUrl: string;
  instruction: string;
  jobId: string;
}): Promise<MockJobResponse> {
  console.log(`[MOCK] Image edit requested: "${params.instruction}"`);
  return { job_id: generateMockJobId(), status: "processing" };
}

// ---- Mock Background Removal ----

export async function removeBackground(params: {
  imageUrl: string;
  outputType?: string;
  jobId: string;
}): Promise<MockJobResponse> {
  console.log(`[MOCK] Background removal requested`);
  return { job_id: generateMockJobId(), status: "processing" };
}

// ---- Mock Upscale ----

export async function upscaleImage(params: {
  imageUrl: string;
  scale?: number;
  denoise?: string;
  faceEnhance?: boolean;
  jobId: string;
}): Promise<MockJobResponse> {
  console.log(`[MOCK] Upscale requested (${params.scale}x)`);
  return { job_id: generateMockJobId(), status: "processing" };
}

// ---- Mock Generative Fill ----

export async function generativeFill(params: {
  imageUrl: string;
  maskUrl: string;
  prompt: string;
  mode?: string;
  jobId: string;
}): Promise<MockJobResponse> {
  console.log(`[MOCK] Generative fill requested: "${params.prompt}"`);
  return { job_id: generateMockJobId(), status: "processing" };
}

// ---- Mock Expand ----

export async function expandImage(params: {
  imageUrl: string;
  direction?: string;
  amount?: number;
  jobId: string;
}): Promise<MockJobResponse> {
  console.log(`[MOCK] Image expand requested (${params.direction} ${params.amount}%)`);
  return { job_id: generateMockJobId(), status: "processing" };
}

// ---- Webhook signature verification ----

export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.PIXLR_WEBHOOK_SECRET;
  if (!secret) return true;

  const crypto = require("crypto") as typeof import("crypto");
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
