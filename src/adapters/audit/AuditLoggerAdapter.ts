import { validationMessages } from '@state/schemas/sections/validationMessages';

// Port Interface (ADR-12)
export interface AuditEvent {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'fatal';
  message: string;
  context?: Record<string, unknown>;
}

export interface AuditLoggerPort {
  logEvent(event: AuditEvent): void;
  getEventsByLevel(level: AuditEvent['level']): AuditEvent[];
}

class AuditLoggerAdapter implements AuditLoggerPort {
  private eventBuffer: AuditEvent[] = [];

  logEvent(event: AuditEvent): void {
    // 1. VERTALING: Kijk of we een menselijke tekst hebben voor deze code
    const translatedMessage = this.translate(event.message);
    if (translatedMessage) {
      event.context = { ...event.context, originalCode: event.message };
      event.message = translatedMessage;
    }

    // 2. ROUTERING: De Luchtverkeerstoren logica
    if (event.message === 'SYSTEM_ERROR' || event.message === 'VALIDATION_CRASH') {
      this.routeToTicketing(event);
      event.level = 'fatal';
    }

    if (event.level === 'error' || event.level === 'warning') {
      this.routeToUI(event);
    }

    this.routeToConsole(event);
    this.eventBuffer.push(event);
  }

  private routeToConsole(event: AuditEvent): void {
    const prefix = `[AUDIT]`;
    const payload = JSON.stringify({
      level: event.level,
      message: event.message,
      timestamp: event.timestamp,
      context: event.context
    });
    console.log(prefix, payload);
  }

  private routeToUI(_event: AuditEvent): void {
    // Voor de UI componenten (underscore voorkomt linter error)
  }

  private routeToTicketing(event: AuditEvent): void {
    console.error('!!! TICKETING/MAIL ALERT !!!', event);
  }

  // Hulpmiddel om door het geneste validationMessages object te graven
  private translate(path: string): string | null {
    try {
      if (!path || typeof path !== 'string') return null;
      return path.split('.').reduce((obj, key) => obj?.[key], validationMessages as any) || null;
    } catch {
      return null;
    }
  }

  getEventsByLevel(level: AuditEvent['level']): AuditEvent[] {
    return this.eventBuffer.filter(e => e.level === level);
  }

  clearBuffer(): void {
    this.eventBuffer = [];
  }
}

export const auditLogger = new AuditLoggerAdapter();

// --- DE HERSTELDE BACKWARD COMPATIBILITY BRIDGE ---
export const Logger = {
  error: (msg: any, err?: any) => {
    const errorObj = err instanceof Error ? err : new Error(String(msg));
    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: errorObj.message,
      context: { msg, stack: errorObj.stack }
    });
  },
  warn: (msg: string, data?: any) => {
    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'warning',
      message: msg,
      context: data
    });
  },
  info: (msg: string, data?: any) => {
    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: msg,
      context: data
    });
  },
  log: (...args: any[]) => {
    const message = String(args[1] || args[0]);
    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: message,
      context: { rawArgs: args }
    });
  }
};

export const logger = Logger;
export const AuditLogger = Logger;