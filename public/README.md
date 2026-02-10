# Canvix.ai Chat-Based Creative Studio

A Gemini-style chat interface for AI image/video generation and editing.

## Features

### 1. Creative AI Chat (`CreativeAIChatPage.jsx`)
A conversational interface similar to Gemini where users can:
- Generate images from text prompts
- Generate videos from text prompts
- Get prompt enhancement suggestions from ChatGPT
- View generated results inline in the chat

### 2. Nano Banana Editor (`NanoBananaEditorPage.jsx`)
A chat-based image editor where users can:
- Upload images
- Edit using natural language commands
- See real-time results
- Undo/redo changes
- Download edited images

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌───────────────────┐    ┌───────────────────────────────────┐│
│  │  Creative Chat    │    │      Nano Banana Editor           ││
│  │  (Gemini style)   │    │   (Upload + Chat commands)        ││
│  └─────────┬─────────┘    └───────────────┬───────────────────┘│
└────────────┼──────────────────────────────┼────────────────────┘
             │                              │
             ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Service Layer                         │
│  ┌───────────────────┐    ┌───────────────────────────────────┐│
│  │  chatGPTService   │    │        pixlrService               ││
│  │  (APIMart API)    │    │   (Image/Video Generation)        ││
│  │                   │    │   (Background Removal)            ││
│  │  - Enhance prompts│    │   (Image Editing)                 ││
│  │  - Understand     │    │   (Image-to-Video)                ││
│  │    commands       │    │                                   ││
│  └─────────┬─────────┘    └───────────────┬───────────────────┘│
└────────────┼──────────────────────────────┼────────────────────┘
             │                              │
             ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        External APIs                            │
│  ┌───────────────────┐    ┌───────────────────────────────────┐│
│  │   APIMart API     │    │         Pixlr API                 ││
│  │   (ChatGPT)       │    │    (AI Processing)                ││
│  └───────────────────┘    └───────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## User Flow

### Image Generation Flow:
```
1. User: "Create a sunset over mountains"
2. ChatGPT: Understands and enhances → "A breathtaking sunset over majestic 
   mountains, golden hour lighting, dramatic clouds, 8k resolution, cinematic"
3. System: Confirms enhanced prompt with user
4. User: "Generate now"
5. Pixlr API: Generates image
6. Chat: Shows result with download/edit options
```

### Video Generation Flow:
```
1. User: "Make a video of waves on a beach"
2. ChatGPT: Enhances → "Gentle ocean waves rolling onto a sandy beach, 
   slow motion, cinematic, golden hour, 4k, smooth camera movement"
3. System: Shows settings (duration, quality)
4. User: Confirms
5. Pixlr API: Generates video (async)
6. Chat: Shows progress → result when ready
```

### Image Editing Flow (Nano Banana):
```
1. User: Uploads image
2. User: "Remove the background"
3. ChatGPT: Understands command
4. Pixlr API: Removes background
5. Editor: Shows result with before/after
6. User: "Now make it look vintage"
7. Repeat...
```

## File Structure

```
canvix-chat/
├── CreativeAIChatPage.jsx      # Main chat interface (Gemini style)
├── NanoBananaEditorPage.jsx    # Image editor with chat
├── CreativeStudioPage.jsx      # Mode selector/router
├── services/
│   └── apiService.js           # API integration (ChatGPT + Pixlr)
└── README.md                   # This file
```

## API Integration

### APIMart ChatGPT API
```javascript
// docs: https://docs.apimart.ai/en/api-reference/texts/general/chat-completions

const response = await fetch('https://api.apimart.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
  }),
});
```

### Pixlr API (Example endpoints)
```javascript
// Image Generation
POST /api/pixlr/generate/image
{ prompt, style, aspect_ratio, quality }

// Video Generation
POST /api/pixlr/generate/video
{ prompt, duration, resolution, fps }

// Image Editing
POST /api/pixlr/edit/instruct
{ image_url, instruction }

// Background Removal
POST /api/pixlr/edit/remove-bg
{ image_url }
```

## Environment Variables

```env
NEXT_PUBLIC_APIMART_API_KEY=your-apimart-key
NEXT_PUBLIC_PIXLR_API_KEY=your-pixlr-key
```

## Usage in Next.js

```jsx
// pages/studio.js
import CreativeStudioPage from '@/components/canvix-chat/CreativeStudioPage';

export default function StudioPage() {
  const user = {
    name: 'Alex Johnson',
    credits: { used: 847, total: 1000 },
  };

  return <CreativeStudioPage user={user} />;
}
```

## Key Components

### Message Types
- `user` - User's message (aligned right)
- `assistant` - AI response (aligned left, with avatar)
- `system` - System notifications (centered, muted)

### Suggestion Chips
AI responses can include clickable suggestions for common follow-up actions.

### Generated Content
Results are displayed inline with:
- Download button
- Edit button
- Regenerate option

## Styling

All components use inline styles for portability. Colors follow the Canvix brand:
- Primary: `#FF6B35` (orange)
- Secondary: `#EC4899` (pink)
- Accent: `#22D3EE` (cyan)
- Background: `#0A0A0B` (dark)

## Credits System

Each action consumes credits:
- Image Generation: 10 credits
- Video Generation: 25 credits
- Image Editing: 5 credits
- Background Removal: 2 credits

## Future Enhancements

1. Voice input (mic button)
2. Image upload in chat
3. History/saved generations
4. Share functionality
5. Batch processing
6. Style presets
7. Templates gallery
