// src/services/logger.ts

// Check omgevingen
const isDev = __DEV__; 
const isTest = process.env.NODE_ENV === 'test';

const LoggerInstance = {
  info: (message: string, data?: any) => {
    // Stop als we in productie zitten OF als we een test draaien
    if (!isDev || isTest) return; 
    
    // Specifieke filter voor VM-ruis
    if (data === undefined && message.includes('generated undefined')) return;
    
    console.log(message, data ?? '');
  },

  error: (message: string, error?: any) => {
    // Fouten loggen we meestal wel, tenzij we in een test zitten en de output schoon willen houden
    if (isTest) return;
    console.error(message, error ?? '');
  },

  warn: (msg: string, data?: any) => {
    if (isDev && !isTest) {
      console.warn(msg, data);
    }
  },

  log: (level: string, msg: string, ...args: any[]) => {
    if (isDev && !isTest) {
      console.log(`[${level}]`, msg, ...args);
    }
  },
};

export const logger = LoggerInstance;
export const Logger = LoggerInstance;
export default LoggerInstance;