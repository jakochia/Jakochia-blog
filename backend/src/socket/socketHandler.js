import { ChatMessage } from '../models/ChatMessage.js';

// Track online admins
const onlineAdmins = new Set();

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    // ---------- VISITOR SIDE ----------
    // Visitor joins their conversation room
    socket.on('visitor:join', ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
      console.log(`👤 Visitor joined conversation: ${conversationId}`);
    });

    // Visitor typing
    socket.on('visitor:typing', ({ conversationId, isTyping }) => {
      if (!conversationId) return;
      io.to('admins').emit('visitor:typing', {
        conversationId,
        isTyping,
      });
    });

    // ---------- ADMIN SIDE ----------
    // Admin joins admin room (receives all events)
    socket.on('admin:join', () => {
      socket.join('admins');
      onlineAdmins.add(socket.id);
      console.log('👨‍💼 Admin joined:', socket.id);

      // Notify admins online count changed
      io.to('admins').emit('admins:online', { count: onlineAdmins.size });
    });

    // Admin joins specific conversation room
    socket.on('admin:join_conversation', ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
    });

    // Admin leaves conversation room
    socket.on('admin:leave_conversation', ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(`conversation:${conversationId}`);
    });

    // Admin typing
    socket.on('admin:typing', ({ conversationId, isTyping }) => {
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit('admin:typing', {
        conversationId,
        isTyping,
      });
    });

    // ---------- DISCONNECT ----------
    socket.on('disconnect', () => {
      onlineAdmins.delete(socket.id);
      io.to('admins').emit('admins:online', { count: onlineAdmins.size });
      console.log('🔌 Socket disconnected:', socket.id);
    });
  });
};

// Helper to emit events from routes
export const emitNewMessage = (io, message) => {
  // Send to admin room
  io.to('admins').emit('message:new', message);
  // Send to the specific conversation room (visitor sees it)
  io.to(`conversation:${message.conversationId}`).emit('message:new', message);
};

export const emitConversationUpdate = (io, conversationId) => {
  io.to('admins').emit('conversation:update', { conversationId });
};

export const emitMessageRead = (io, conversationId) => {
  io.to('admins').emit('messages:read', { conversationId });
};