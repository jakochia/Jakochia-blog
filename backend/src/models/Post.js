// ============================================================
// BACKEND src/models/Post.js
// ============================================================

import mongoose from 'mongoose';
import slugify from 'slugify';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'Newton Asha',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  scheduledFor: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  reactionCounts: {
    like: { type: Number, default: 0 },
    fire: { type: Number, default: 0 },
    helpful: { type: Number, default: 0 },
    applause: { type: Number, default: 0 },
  },
  seoTitle: {
    type: String,
    trim: true,
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: 160,
  },
  canonicalUrl: {
    type: String,
    trim: true,
  },
  ogImage: {
    type: String,
    default: '',
  },
  readingTime: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.pre('validate', function (next) {
  this.updatedAt = Date.now();
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // Calculate reading time (approx 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

PostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
PostSchema.index({ slug: 1 });
PostSchema.index({ publishedAt: -1 });
PostSchema.index({ status: 1 });
PostSchema.index({ featured: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });

export const Post = mongoose.model('Post', PostSchema);