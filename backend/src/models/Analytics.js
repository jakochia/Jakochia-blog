// ============================================================
// BACKEND src/models/Analytics.js
// ============================================================

import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  type: {
    type: String,
    enum: ['pageview', 'articleview', 'search', 'click', 'reaction'],
    required: true,
  },
  path: {
    type: String,
    trim: true,
  },
  referrer: {
    type: String,
    trim: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  ipAddress: {
    type: String,
    trim: true,
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'tablet', 'mobile', 'unknown'],
    default: 'unknown',
  },
  browser: {
    type: String,
    trim: true,
  },
  os: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  sessionId: {
    type: String,
    trim: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ post: 1, type: 1 });
AnalyticsSchema.index({ type: 1, createdAt: -1 });

export const Analytics = mongoose.model('Analytics', AnalyticsSchema);