import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'model'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    tokens: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const aiConversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      default: null,
      index: true,
    },
    title: {
      type: String,
      default: 'New conversation',
      maxlength: 120,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    model: {
      type: String,
      default: 'gemini-flash-latest',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-update lastMessageAt, messageCount, and auto-title from first user message
aiConversationSchema.pre('save', function (next) {
  this.lastMessageAt = new Date();
  this.messageCount = this.messages.length;

  if (this.title === 'New conversation' && this.messages.length > 0) {
    const firstUser = this.messages.find((m) => m.role === 'user');
    if (firstUser) {
      const snippet = firstUser.content.slice(0, 60);
      this.title =
        snippet + (firstUser.content.length > 60 ? '…' : '');
    }
  }

  next();
});

// Helpful compound index for "latest conversations for a session"
aiConversationSchema.index({ sessionId: 1, lastMessageAt: -1 });

export const AIConversation = mongoose.model(
  'AIConversation',
  aiConversationSchema
);