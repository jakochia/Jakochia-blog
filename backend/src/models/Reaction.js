// ============================================================
// BACKEND src/models/Reaction.js
// ============================================================

import mongoose from 'mongoose';

const ReactionSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'fire', 'helpful', 'applause'],
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReactionSchema.index({ post: 1, identifier: 1, type: 1 }, { unique: true });
ReactionSchema.index({ post: 1, type: 1 });

export const Reaction = mongoose.model('Reaction', ReactionSchema);