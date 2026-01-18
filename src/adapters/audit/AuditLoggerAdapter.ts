// Port Interface (ADR-12)
export interface AuditEvent {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
  action?: string;
}

export interface AuditLoggerPort {
  logEvent(event: AuditEvent): void;
  logError(error: Error, context?: Record<string, unknown>): void;
  logWarning(message: string, context?: Record<string, unknown>): void;
}

// Adapter Implementation with Fail-Safe (Dex R2-H-001)
class AuditLoggerAdapter implements AuditLoggerPort {
  private eventBuffer: AuditEvent[] = [];
  private maxBufferSize = 100;

  logEvent(event: AuditEvent): void {
    try {
      this.writeToAuditLog(event);
    } catch (error) {
      this.bufferEvent(event);
      // AANGEPAST: error meegeven aan console.error
      console.error('[AUDIT_FALLBACK]', JSON.stringify(event), error); 
    }
  }

  logError(error: Error, context?: Record<string, unknown>): void {
    this.logEvent({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      context: { ...context, stack: error.stack },
    });
  }

  logWarning(message: string, context?: Record<string, unknown>): void {
    this.logEvent({
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context,
    });
  }

  private writeToAuditLog(event: AuditEvent): void {
    console.log('[AUDIT]', JSON.stringify(event));
  }

  private bufferEvent(event: AuditEvent): void {
    if (this.eventBuffer.length < this.maxBufferSize) {
      this.eventBuffer.push(event);
    }
  }

  getBufferedEvents(): AuditEvent[] {
    return [...this.eventBuffer];
  }

  clearBuffer(): void {
    this.eventBuffer = [];
  }
}

// Singleton export
export const auditLogger: AuditLoggerPort = new AuditLoggerAdapter();

// --- BACKWARD COMPATIBILITY BRIDGE ---
// Rest parameters (...args: any[]) to handle variable legacy test calls
export const Logger = {
    error: (msg: any, err?: any) => auditLogger.logError(err instanceof Error ? err : new Error(String(msg)), { msg }),
    info: (msg: string, data?: any) => auditLogger.logEvent({ timestamp: new Date().toISOString(), level: 'info', message: msg, context: data }),
    warn: (msg: string, data?: any) => auditLogger.logWarning(msg, data),
    log: (...args: any[]) => auditLogger.logEvent({ 
        timestamp: new Date().toISOString(), 
        level: 'info', 
        message: String(args[1] || args[0]), 
        context: { rawArgs: args } 
    })
};
export const AuditLogger = Logger;
export const logger = Logger;
export default Logger;