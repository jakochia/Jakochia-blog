console.log('GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? '✅ Yes' : '❌ No');
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Initialize the new SDK client
// It will automatically pick up the GEMINI_API_KEY from environment variables,
// but we pass it explicitly for clarity.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Rate limit chat requests (prevent abuse)
const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 messages per minute
  message: { error: 'Too many messages. Please slow down.' },
});

// System prompt – defines chatbot personality
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

router.post('/', chatRateLimiter, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 chars)' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Build the full prompt with history and system instruction
    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      ...history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    // Call the model using the new SDK method
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
    });

    // The response text is directly available
    const reply = response.text;

    res.json({
      success: true,
      reply: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      error: 'Failed to generate response. Please try again.',
    });
  }
});

export default router;