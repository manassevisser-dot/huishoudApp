const LoggerInstance = {
  info: (msg: string, data?: any) => console.log(msg, data),
  error: (msg: string, err?: any) => console.error(msg, err),
  warn: (msg: string, data?: any) => console.warn(msg, data),
  log: (level: string, msg: string, ...args: any[]) => console.log(`[${level}]`, msg, ...args),
};

export const logger = LoggerInstance;
export const Logger = LoggerInstance; // Zorgt dat beide imports werken
export default LoggerInstance;