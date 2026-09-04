// ============================================================
// BACKEND src/models/AuditLog.js
// ============================================================

import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  action: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
  resourceId: {
    type: String,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ admin: 1 });
AuditLogSchema.index({ action: 1, resource: 1 });

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);