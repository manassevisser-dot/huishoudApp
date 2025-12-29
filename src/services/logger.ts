const Logger = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data),
  error: (msg: string, err?: any) => console.error(`[ERROR] ${msg}`, err),
  log: (level: string, msg: string, ...args: any[]) => console.log(`[${level}] ${msg}`, ...args)
};

export default Logger;
export const logger = Logger;