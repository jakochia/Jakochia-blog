import express from 'express';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';
import { AIConversation } from '../../models/AIConversation.js';

const router = express.Router();

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_MODEL = 'gemini-2.5-flash';

// ✅ Ordered fallback list — tried in sequence on failure
const MODEL_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-flash-latest',
];

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_TURNS = 10;
const MAX_TITLE_LENGTH = 80;

// ✅ Retry configuration for transient errors (503, 429, 500)
const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [500, 1500, 3000]; // exponential-ish backoff

const SYSTEM_PROMPT = `You are Jakochia AI, the friendly assistant for Newton Asha's blog (Jakochia Blog).

You help visitors understand:
- Blog articles about software engineering, networking, cybersecurity, cloud, and AI
- Projects like MOHI Cisco Portal and Personal Finance Tracker
- Tutorials on Cisco, Node.js, React, MongoDB
- Newton Asha's experience as a Cisco Networking Academy Instructor

Guidelines:
- Be concise, friendly, and professional
- Keep responses under 150 words unless asked for detail
- If asked something unrelated to tech or the blog, politely steer back
- For direct contact, suggest: ombuyanewton@gmail.com
- Use code examples when helpful, but keep them short
- Never make up facts about the author`;

const SUGGESTIONS = [
  'What projects has Newton built?',
  'Explain Cisco VLANs in simple terms.',
  'How do I set up a Node.js + MongoDB API?',
  'What is subnetting and why does it matter?',
  'Tips for learning cybersecurity in 2026?',
  'How does React state management work?',
  'Explain the OSI model in 30 seconds.',
  "What is Newton's tech stack?",
];

// ============================================================
// GEMINI CLIENT
// ============================================================

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ============================================================
// RATE LIMITERS
// ============================================================

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many messages. Please slow down.' },
});

const streamRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  message: { error: 'Too many streaming requests. Please wait.' },
});

const readRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests.' },
});

// ============================================================
// HELPERS
// ============================================================

const validateMessage = (message) => {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return 'Message is required';
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return `Message too long (max ${MAX_MESSAGE_LENGTH} chars)`;
  }
  return null;
};

const buildContents = (history, message) => [
  { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
  ...history
    .slice(-MAX_HISTORY_TURNS)
    .filter((m) => m && m.content)
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
  { role: 'user', parts: [{ text: message }] },
];

const upsertConversation = async (sessionId, userMessage, modelReply, model) => {
  try {
    const convo =
      (await AIConversation.findOne({ sessionId })) ||
      new AIConversation({ sessionId, model });

    convo.messages.push({ role: 'user', content: userMessage });
    convo.messages.push({ role: 'model', content: modelReply });

    await convo.save();
  } catch (error) {
    console.error('[AI] Conversation save failed:', error.message);
  }
};

const logError = (context, error) => {
  const detail = error?.error || error;
  console.error(
    `[AI:${context}] ${detail?.code || ''} ${detail?.message || error.message}`
  );
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
};

/**
 * ✅ Check if an error is transient (retryable).
 * 503 = overloaded, 429 = rate limit, 500 = internal server error
 */
const isRetryableError = (error) => {
  const code = error?.error?.code || error?.status || error?.code;
  return code === 503 || code === 429 || code === 500;
};

/**
 * ✅ Sleep helper for backoff.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * ✅ Generate content with retries + model fallback.
 *    - Tries each model in MODEL_FALLBACKS
 *    - For each model, retries up to MAX_RETRIES times on transient errors
 */
const generateWithFallback = async (contents, preferredModel) => {
  // Build ordered list: preferred first, then fallbacks (deduplicated)
  const modelChain = [
    preferredModel,
    ...MODEL_FALLBACKS.filter((m) => m !== preferredModel),
  ];

  let lastError = null;

  for (const model of modelChain) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log(`[AI] Trying model=${model} attempt=${attempt + 1}`);
        const response = await ai.models.generateContent({ model, contents });
        return { response, model };
      } catch (error) {
        lastError = error;

        // If it's not retryable (e.g., bad request), stop retrying this model
        if (!isRetryableError(error)) {
          logError(`model=${model}`, error);
          break;
        }

        // Otherwise, back off and retry
        const delay = RETRY_DELAYS_MS[attempt] || 3000;
        console.warn(
          `[AI] Transient error on ${model} (attempt ${attempt + 1}). Retrying in ${delay}ms...`
        );
        await sleep(delay);
      }
    }

    console.warn(`[AI] Model ${model} exhausted. Moving to next fallback...`);
  }

  throw lastError || new Error('All models failed');
};

// ============================================================
// POST /api/ai/chat — standard JSON response
// ============================================================

router.post('/', chatRateLimiter, async (req, res) => {
  const { message, history = [], sessionId } = req.body;

  const err = validateMessage(message);
  if (err) return res.status(400).json({ error: err });

  if (!process.env.GEMINI_API_KEY) {
    console.error('[AI:chat] GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'AI service not configured' });
  }

  try {
    const contents = buildContents(history, message);
    const { response, model } = await generateWithFallback(
      contents,
      DEFAULT_MODEL
    );
    const reply = response.text;

    if (sessionId) {
      upsertConversation(sessionId, message, reply, model);
    }

    res.json({
      success: true,
      reply,
      model,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logError('chat', error);

    // ✅ Friendly message for 503 overload
    const code = error?.error?.code || error?.status;
    const userMessage =
      code === 503
        ? 'Jakochia AI is temporarily busy. Please try again in a moment.'
        : 'Failed to generate response. Please try again.';

    res.status(503).json({
      error: userMessage,
      debug:
        process.env.NODE_ENV === 'development'
          ? error?.error?.message || error.message
          : undefined,
    });
  }
});

// ============================================================
// POST /api/ai/chat/stream — Server-Sent Events streaming
// ============================================================

router.post('/stream', streamRateLimiter, async (req, res) => {
  const { message, history = [], sessionId } = req.body;

  const err = validateMessage(message);
  if (err) return res.status(400).json({ error: err });

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  let fullReply = '';
  const contents = buildContents(history, message);

  try {
    // Try each model in order until one streams successfully
    let stream = null;
    let usedModel = null;
    let lastError = null;

    for (const model of MODEL_FALLBACKS) {
      try {
        console.log(`[AI:stream] Trying model=${model}`);
        stream = await ai.models.generateContentStream({ model, contents });
        usedModel = model;
        break;
      } catch (error) {
        lastError = error;
        if (!isRetryableError(error)) break;
        await sleep(500);
      }
    }

    if (!stream) throw lastError || new Error('All models failed');

    for await (const chunk of stream) {
      const text = chunk.text || '';
      if (!text) continue;
      fullReply += text;
      res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true, reply: fullReply })}\n\n`);
    res.end();

    if (sessionId) {
      upsertConversation(sessionId, message, fullReply, usedModel);
    }
  } catch (error) {
    logError('stream', error);
    res.write(
      `data: ${JSON.stringify({
        error: 'AI is temporarily busy. Please try again in a moment.',
      })}\n\n`
    );
    res.end();
  }
});

// ============================================================
// GET /api/ai/chat/suggestions
// ============================================================

router.get('/suggestions', readRateLimiter, (_req, res) => {
  res.json({ suggestions: SUGGESTIONS });
});

// ============================================================
// GET /api/ai/chat/conversations
// ============================================================

router.get('/conversations', readRateLimiter, async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    const conversations = await AIConversation.find({ sessionId })
      .select('title messageCount lastMessageAt createdAt')
      .sort({ lastMessageAt: -1 })
      .limit(limit);

    res.json({ conversations });
  } catch (error) {
    logError('list-conversations', error);
    res.status(500).json({ error: 'Failed to load conversations.' });
  }
});

// ============================================================
// GET /api/ai/chat/conversations/:id
// ============================================================

router.get('/conversations/:id', readRateLimiter, async (req, res) => {
  try {
    const convo = await AIConversation.findById(req.params.id);
    if (!convo) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ conversation: convo });
  } catch (error) {
    logError('get-conversation', error);
    res.status(500).json({ error: 'Failed to load conversation.' });
  }
});

// ============================================================
// DELETE /api/ai/chat/conversations/:id
// ============================================================

router.delete('/conversations/:id', readRateLimiter, async (req, res) => {
  try {
    const deleted = await AIConversation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ success: true });
  } catch (error) {
    logError('delete-conversation', error);
    res.status(500).json({ error: 'Failed to delete conversation.' });
  }
});

// ============================================================
// POST /api/ai/chat/conversations/:id/rename
// ============================================================

router.post('/conversations/:id/rename', readRateLimiter, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title required' });
    }

    const convo = await AIConversation.findByIdAndUpdate(
      req.params.id,
      { title: title.trim().slice(0, MAX_TITLE_LENGTH) },
      { new: true }
    );

    if (!convo) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ success: true, title: convo.title });
  } catch (error) {
    logError('rename-conversation', error);
    res.status(500).json({ error: 'Failed to rename conversation.' });
  }
});

export default router;