import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Koneksi ke MongoDB Atlas
    await connectDB();

    // Jalankan server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 ${env.APP_NAME} running`);
      logger.info(`📡 Environment : ${env.NODE_ENV}`);
      logger.info(`🌐 Port        : ${env.PORT}`);
      logger.info(`🔗 Base URL    : http://localhost:${env.PORT}/api`);
      logger.info(`❤️  Health     : http://localhost:${env.PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.warn(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Promise Rejection:', err.message);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
