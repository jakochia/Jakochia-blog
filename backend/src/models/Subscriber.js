// ============================================================
// BACKEND src/models/Subscriber.js
// ============================================================

import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active',
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  unsubscribedAt: {
    type: Date,
  },
  ipAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

SubscriberSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

SubscriberSchema.index({ email: 1 });
SubscriberSchema.index({ status: 1 });

export const Subscriber = mongoose.model('Subscriber', SubscriberSchema);