import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import songsRouter from './routes/song.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3009;
const MONGODB_URI =
  'mongodb+srv://Chibueze:Pass!Word1@nodeexpressprojects.2wvdg.mongodb.net/wedding?retryWrites=true&w=majority&appName=NodeExpressProjects';

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    // origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/songs', songsRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Zubby Music API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
  });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Global error handler:', err);
    res.status(500).json({
      error: 'Internal server error',
      message:
        process.env['NODE_ENV'] === 'development'
          ? err.message
          : 'Something went wrong',
    });
  }
);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`🎵 API endpoint: http://localhost:${PORT}/api/songs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();

export default app;
