/**
 * Canvix AI API Integration Service
 * 
 * This file handles integration with:
 * 1. APIMart ChatGPT API - For prompt enhancement and conversation
 * 2. Pixlr API - For image/video generation and editing
 */

// APIMart API Configuration
// Docs: https://docs.apimart.ai/en/api-reference/texts/general/chat-completions
const APIMART_CONFIG = {
  baseUrl: 'https://api.apimart.ai/v1',
  apiKey: process.env.NEXT_PUBLIC_APIMART_API_KEY || 'your-api-key',
  model: 'gpt-4', // or 'gpt-3.5-turbo' for faster responses
};

// Pixlr API Configuration
const PIXLR_CONFIG = {
  baseUrl: 'https://pixlr.com/api/v2',
  apiKey: process.env.NEXT_PUBLIC_PIXLR_API_KEY || 'your-pixlr-key',
};

/**
 * System prompts for different modes
 */
const SYSTEM_PROMPTS = {
  general: `You are Canvix AI, a friendly creative assistant that helps users create amazing images and videos.
Your job is to:
1. Understand what the user wants to create or edit
2. Ask clarifying questions if the request is unclear
3. Enhance their prompts for better AI generation results
4. Confirm before proceeding with generation
5. Provide tips and suggestions

Be conversational, helpful, and creative. Use emojis occasionally to be friendly.
When enhancing prompts, add details about: style, lighting, composition, quality keywords.`,

  imageGeneration: `You are Canvix AI, specializing in AI image generation.
Help users create detailed prompts for image generation. When enhancing prompts:
- Add style descriptors (photorealistic, digital art, cinematic, etc.)
- Include lighting details (dramatic lighting, soft light, golden hour, etc.)
- Add quality keywords (8k, highly detailed, professional, masterpiece)
- Suggest composition (close-up, wide angle, bird's eye view, etc.)
- Include mood/atmosphere words

Always confirm the enhanced prompt with the user before generating.`,

  videoGeneration: `You are Canvix AI, specializing in AI video generation.
Help users create prompts for video generation. When enhancing prompts:
- Add motion descriptors (smooth camera movement, slow motion, time-lapse)
- Include scene transitions
- Suggest duration and pacing
- Add cinematic quality keywords
- Consider aspect ratio (16:9, 9:16 for vertical)

Remind users that video generation takes longer and uses more credits.`,

  imageEditing: `You are Canvix AI, specializing in AI-powered image editing.
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

/**
 * ChatGPT API Service (via APIMart)
 */
export const chatGPTService = {
  /**
   * Send a message to ChatGPT and get a response
   * @param {string} userMessage - The user's message
   * @param {string} mode - The current mode (general, imageGeneration, videoGeneration, imageEditing)
   * @param {Array} conversationHistory - Previous messages for context
   * @returns {Promise<Object>} - The AI response
   */
  async sendMessage(userMessage, mode = 'general', conversationHistory = []) {
    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await fetch(`${APIMART_CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APIMART_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          model: APIMART_CONFIG.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      return {
        success: true,
        text: aiResponse,
        // Parse for suggestions if present
        suggestions: extractSuggestions(aiResponse),
        // Check if awaiting confirmation
        awaitingConfirmation: checkForConfirmation(aiResponse),
        // Extract enhanced prompt if present
        enhancedPrompt: extractEnhancedPrompt(aiResponse),
      };
    } catch (error) {
      console.error('ChatGPT API Error:', error);
      return {
        success: false,
        error: error.message,
        text: "I'm having trouble connecting. Please try again.",
      };
    }
  },

  /**
   * Enhance a prompt for image/video generation
   * @param {string} prompt - The original prompt
   * @param {string} type - 'image' or 'video'
   * @returns {Promise<string>} - The enhanced prompt
   */
  async enhancePrompt(prompt, type = 'image') {
    const enhanceRequest = type === 'image' 
      ? `Enhance this image generation prompt for better results. Add style, lighting, quality keywords, and composition details. Keep it under 200 words. Original: "${prompt}"`
      : `Enhance this video generation prompt for better results. Add motion, cinematic quality, and pacing details. Keep it under 200 words. Original: "${prompt}"`;

    const response = await this.sendMessage(enhanceRequest, `${type}Generation`);
    return response.enhancedPrompt || response.text;
  },
};

/**
 * Pixlr API Service
 */
export const pixlrService = {
  /**
   * Get authentication token for Pixlr API
   */
  async getToken() {
    try {
      const response = await fetch('/api/pixlr/token', {
        method: 'POST',
      });
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Failed to get Pixlr token:', error);
      throw error;
    }
  },

  /**
   * Generate an image from a prompt
   * @param {string} prompt - The generation prompt
   * @param {Object} options - Generation options
   */
  async generateImage(prompt, options = {}) {
    const {
      style = 'photorealistic',
      aspectRatio = '1:1',
      quality = 'hd',
      numImages = 1,
    } = options;

    try {
      const token = await this.getToken();

      const response = await fetch(`${PIXLR_CONFIG.baseUrl}/generate/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          style,
          aspect_ratio: aspectRatio,
          quality,
          num_images: numImages,
          webhook_url: `${window.location.origin}/api/pixlr/webhook`,
        }),
      });

      const data = await response.json();
      return {
        success: true,
        jobId: data.job_id,
        status: 'processing',
      };
    } catch (error) {
      console.error('Image generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Generate a video from a prompt
   * @param {string} prompt - The generation prompt
   * @param {Object} options - Generation options
   */
  async generateVideo(prompt, options = {}) {
    const {
      duration = 4,
      resolution = '1080p',
      fps = 24,
      style = 'cinematic',
    } = options;

    try {
      const token = await this.getToken();

      const response = await fetch(`${PIXLR_CONFIG.baseUrl}/generate/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          duration,
          resolution,
          fps,
          style,
          webhook_url: `${window.location.origin}/api/pixlr/webhook`,
        }),
      });

      const data = await response.json();
      return {
        success: true,
        jobId: data.job_id,
        status: 'processing',
        estimatedTime: duration * 10, // Rough estimate in seconds
      };
    } catch (error) {
      console.error('Video generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Image-to-video animation
   * @param {string} imageUrl - The source image URL
   * @param {string} prompt - Motion description
   * @param {Object} options - Animation options
   */
  async imageToVideo(imageUrl, prompt, options = {}) {
    const {
      duration = 4,
      motionType = 'ai',
      intensity = 'medium',
    } = options;

    try {
      const token = await this.getToken();

      const response = await fetch(`${PIXLR_CONFIG.baseUrl}/animate/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          motion_prompt: prompt,
          duration,
          motion_type: motionType,
          intensity,
          webhook_url: `${window.location.origin}/api/pixlr/webhook`,
        }),
      });

      const data = await response.json();
      return {
        success: true,
        jobId: data.job_id,
        status: 'processing',
      };
    } catch (error) {
      console.error('Image-to-video error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Edit an image using natural language (Nano Banana style)
   * @param {string} imageUrl - The source image URL
   * @param {string} instruction - Edit instruction in natural language
   */
  async editImage(imageUrl, instruction) {
    try {
      const token = await this.getToken();

      const response = await fetch(`${PIXLR_CONFIG.baseUrl}/edit/instruct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          instruction,
          webhook_url: `${window.location.origin}/api/pixlr/webhook`,
        }),
      });

      const data = await response.json();
      return {
        success: true,
        jobId: data.job_id,
        status: 'processing',
      };
    } catch (error) {
      console.error('Image edit error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Remove background from an image
   * @param {string} imageUrl - The source image URL
   */
  async removeBackground(imageUrl) {
    try {
      const token = await this.getToken();

      const response = await fetch(`${PIXLR_CONFIG.baseUrl}/edit/remove-bg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          webhook_url: `${window.location.origin}/api/pixlr/webhook`,
        }),
      });

      const data = await response.json();
      return {
        success: true,
        jobId: data.job_id,
        status: 'processing',
      };
    } catch (error) {
      console.error('Remove BG error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Check job status
   * @param {string} jobId - The job ID to check
   */
  async checkStatus(jobId) {
    try {
      const response = await fetch(`/api/pixlr/status/${jobId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Status check error:', error);
      return {
        status: 'error',
        error: error.message,
      };
    }
  },
};

/**
 * Helper functions
 */
function extractSuggestions(text) {
  // Extract suggestions from AI response (look for bullet points or numbered lists)
  const suggestions = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.match(/^[-•*]\s/) || line.match(/^\d+\.\s/)) {
      const suggestion = line.replace(/^[-•*\d.]\s*/, '').trim();
      if (suggestion.length > 0 && suggestion.length < 50) {
        suggestions.push(suggestion);
      }
    }
  }
  
  return suggestions.slice(0, 4); // Max 4 suggestions
}

function checkForConfirmation(text) {
  const confirmationKeywords = [
    'should i',
    'would you like',
    'ready to',
    'shall i',
    'want me to',
    'proceed',
    'generate',
    'confirm',
  ];
  
  const lowerText = text.toLowerCase();
  return confirmationKeywords.some(keyword => lowerText.includes(keyword));
}

function extractEnhancedPrompt(text) {
  // Look for quoted text that might be the enhanced prompt
  const matches = text.match(/"([^"]{20,})"/);
  if (matches && matches[1]) {
    return matches[1];
  }
  
  // Look for text after "Enhanced prompt:" or similar
  const promptMatch = text.match(/enhanced prompt[:\s]*(.+?)(?:\n|$)/i);
  if (promptMatch && promptMatch[1]) {
    return promptMatch[1].trim();
  }
  
  return null;
}

/**
 * Combined workflow service
 */
export const creativeWorkflow = {
  /**
   * Full generation workflow with GPT prompt enhancement
   * @param {string} userPrompt - User's original prompt
   * @param {string} type - 'image' or 'video'
   * @param {Object} options - Generation options
   */
  async generateWithEnhancement(userPrompt, type = 'image', options = {}) {
    // Step 1: Enhance prompt with GPT
    const enhancedPrompt = await chatGPTService.enhancePrompt(userPrompt, type);
    
    // Step 2: Generate with Pixlr
    const result = type === 'image'
      ? await pixlrService.generateImage(enhancedPrompt, options)
      : await pixlrService.generateVideo(enhancedPrompt, options);
    
    return {
      ...result,
      originalPrompt: userPrompt,
      enhancedPrompt,
    };
  },

  /**
   * Edit workflow with GPT understanding
   * @param {string} imageUrl - Source image
   * @param {string} instruction - User's edit instruction
   */
  async editWithUnderstanding(imageUrl, instruction) {
    // Step 1: GPT understands and clarifies the instruction
    const response = await chatGPTService.sendMessage(
      `User wants to edit an image with this instruction: "${instruction}". 
      Rephrase this as a clear, specific editing command for an AI image editor.
      Just output the command, no explanation.`,
      'imageEditing'
    );
    
    const clarifiedInstruction = response.text.replace(/"/g, '');
    
    // Step 2: Send to Pixlr for editing
    const result = await pixlrService.editImage(imageUrl, clarifiedInstruction);
    
    return {
      ...result,
      originalInstruction: instruction,
      clarifiedInstruction,
    };
  },
};

export default {
  chatGPTService,
  pixlrService,
  creativeWorkflow,
};
