// src/utils/logger.js
// Simple logger utility

import { env } from '../config/env.js';

const timestamp = () => new Date().toISOString();

export const logger = {
  info: (message, meta = '') => {
    if (!env.IS_PRODUCTION) {
      console.log(`[${timestamp()}] INFO: ${message}`, meta);
    }
  },
  warn: (message, meta = '') => {
    console.warn(`[${timestamp()}] WARN: ${message}`, meta);
  },
  error: (message, meta = '') => {
    console.error(`[${timestamp()}] ERROR: ${message}`, meta);
  },
  debug: (message, meta = '') => {
    if (env.IS_DEVELOPMENT) {
      console.debug(`[${timestamp()}] DEBUG: ${message}`, meta);
    }
  },
};
