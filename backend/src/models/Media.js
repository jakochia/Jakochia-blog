// ============================================================
// BACKEND src/models/Media.js
// ============================================================

import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    trim: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  uploadedBy: {
    type: String,
    default: 'admin',
  },
  usedIn: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

MediaSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

MediaSchema.index({ filename: 1 });
MediaSchema.index({ originalName: 'text' });

export const Media = mongoose.model('Media', MediaSchema);