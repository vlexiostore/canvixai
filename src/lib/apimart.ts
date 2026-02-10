/**
 * APIMart ChatGPT Server-Side Client
 * Docs: https://docs.apimart.ai/en/api-reference/texts/general/chat-completions
 */

const APIMART_BASE_URL =
  process.env.APIMART_BASE_URL || "https://api.apimart.ai/v1";
const APIMART_API_KEY = process.env.APIMART_API_KEY!;

// ---- System prompts per mode ----

const SYSTEM_PROMPTS: Record<string, string> = {
  general: `You are Canvix AI, a friendly creative assistant that helps users create amazing images and videos.
Your job is to:
1. Understand what the user wants to create or edit
2. Ask clarifying questions if the request is unclear
3. Enhance their prompts for better AI generation results
4. Confirm before proceeding with generation
5. Provide tips and suggestions

Be conversational, helpful, and creative. Use emojis occasionally to be friendly.
When enhancing prompts, add details about: style, lighting, composition, quality keywords.`,

  image: `You are Canvix AI, specializing in AI image generation.
Help users create detailed prompts for image generation. When enhancing prompts:
- Add style descriptors (photorealistic, digital art, cinematic, etc.)
- Include lighting details (dramatic lighting, soft light, golden hour, etc.)
- Add quality keywords (8k, highly detailed, professional, masterpiece)
- Suggest composition (close-up, wide angle, bird's eye view, etc.)
- Include mood/atmosphere words

Always confirm the enhanced prompt with the user before generating.
When you provide an enhanced prompt, wrap it in double quotes so it can be extracted.`,

  video: `You are Canvix AI, specializing in AI video generation.
Help users create prompts for video generation. When enhancing prompts:
- Add motion descriptors (smooth camera movement, slow motion, time-lapse)
- Include scene transitions
- Suggest duration and pacing
- Add cinematic quality keywords
- Consider aspect ratio (16:9, 9:16 for vertical)

Remind users that video generation takes longer and uses more credits.
When you provide an enhanced prompt, wrap it in double quotes so it can be extracted.`,

  edit: `You are Canvix AI, specializing in AI-powered image editing.
Help users edit their images using natural language. You can help with:
- Background removal/replacement
- Object removal
- Style transfer
- Enhancement (sharpen, denoise, upscale)
- Color adjustments
- Adding/removing elements

Understand the user's intent and translate it into specific editing operations.
Ask for clarification if the request is ambiguous.`,
};

// ---- Available models ----

export const AVAILABLE_MODELS = [
  { id: "gpt-5", label: "Canvix 2.0", description: "Balanced performance" },
  { id: "gpt-5-chat-latest", label: "Canvix 2.5 RC", description: "Latest chat model" },
  { id: "gpt-5-mini", label: "Canvix Mini", description: "Fast & cost-effective" },
  { id: "gpt-5-nano", label: "Canvix Nano", description: "Ultra-fast, lightweight" },
  { id: "gpt-5-pro", label: "Canvix Ultra", description: "Maximum quality" },
] as const;

export const DEFAULT_MODEL = "gpt-5-mini";

export const VALID_MODEL_IDS = AVAILABLE_MODELS.map((m) => m.id);

// ---- Types ----

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionResult {
  text: string;
  suggestions: string[];
  enhancedPrompt: string | null;
  awaitingConfirmation: boolean;
}

// ---- Main API call ----

export async function sendChatCompletion(
  userMessage: string,
  mode: string,
  conversationHistory: { role: string; content: string }[] = [],
  model: string = DEFAULT_MODEL
): Promise<ChatCompletionResult> {
  // Validate model — fall back to default if invalid
  const useModel = VALID_MODEL_IDS.includes(model as any) ? model : DEFAULT_MODEL;

  const systemPrompt = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.general;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: (msg.role === "user" ? "user" : "assistant") as
        | "user"
        | "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  const response = await fetch(`${APIMART_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${APIMART_API_KEY}`,
    },
    body: JSON.stringify({
      model: useModel,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`APIMart API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const aiText: string = data.choices[0].message.content;

  return {
    text: aiText,
    suggestions: extractSuggestions(aiText),
    enhancedPrompt: extractEnhancedPrompt(aiText),
    awaitingConfirmation: checkForConfirmation(aiText),
  };
}

// ---- Prompt enhancement shortcut ----

export async function enhancePrompt(
  prompt: string,
  type: "image" | "video" = "image"
): Promise<string> {
  const request =
    type === "image"
      ? `Enhance this image generation prompt for better results. Add style, lighting, quality keywords, and composition details. Keep it under 200 words. Wrap the final prompt in double quotes. Original: "${prompt}"`
      : `Enhance this video generation prompt for better results. Add motion, cinematic quality, and pacing details. Keep it under 200 words. Wrap the final prompt in double quotes. Original: "${prompt}"`;

  const result = await sendChatCompletion(request, type);
  return result.enhancedPrompt || result.text;
}

// ---- Helpers ----

function extractSuggestions(text: string): string[] {
  const suggestions: string[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    if (line.match(/^[-•*]\s/) || line.match(/^\d+\.\s/)) {
      const suggestion = line.replace(/^[-•*\d.]\s*/, "").trim();
      if (suggestion.length > 0 && suggestion.length < 50) {
        suggestions.push(suggestion);
      }
    }
  }

  return suggestions.slice(0, 4);
}

function checkForConfirmation(text: string): boolean {
  const keywords = [
    "should i",
    "would you like",
    "ready to",
    "shall i",
    "want me to",
    "proceed",
    "generate",
    "confirm",
  ];
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function extractEnhancedPrompt(text: string): string | null {
  // Look for quoted text (enhanced prompt)
  const matches = text.match(/"([^"]{20,})"/);
  if (matches?.[1]) return matches[1];

  // Look for "Enhanced prompt:" pattern
  const promptMatch = text.match(/enhanced prompt[:\s]*(.+?)(?:\n|$)/i);
  if (promptMatch?.[1]) return promptMatch[1].trim();

  return null;
}
