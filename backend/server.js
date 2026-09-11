import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import { setupSocket } from './src/socket/socketHandler.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Attach Socket.IO
    const io = new Server(server, {
      cors: {
        origin: [
          process.env.FRONTEND_URL,
          'https://blog.jakochia.co.ke',
          'https://jakochia-blog.vercel.app',
          'http://localhost:5173',
        ].filter(Boolean),
        credentials: true,
      },
    });

    // Setup socket handlers
    setupSocket(io);

    // Make io available to routes via app
    app.set('io', io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 API available at http://localhost:${PORT}/api`);
      console.log(`🔌 WebSocket ready`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();