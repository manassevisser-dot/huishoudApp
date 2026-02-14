import { validationMessages } from '@state/schemas/sections/validationMessages';

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

  public logEvent(event: AuditEvent): void {
    const translatedMessage = this.translate(event.message);

    if (translatedMessage !== null) {
      event.context = { ...event.context, originalCode: event.message };
      event.message = translatedMessage;
    }

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
    const payload = JSON.stringify({
      level: event.level,
      message: event.message,
      timestamp: event.timestamp,
      context: event.context
    });
    console.warn('[AUDIT]', payload);
  }

  private routeToUI(_event: AuditEvent): void {
    // nothing
  }

  private routeToTicketing(event: AuditEvent): void {
    console.error('!!! TICKETING/MAIL ALERT !!!', event);
  }

  private translate(path: string): string | null {
    if (path.length === 0) return null;

    const keys = path.split('.');
    const result = keys.reduce<unknown>((obj, key) => {
      if (obj !== null && typeof obj === 'object' && key in obj) {
        return (obj as Record<string, unknown>)[key];
      }
      return null;
    }, validationMessages);

    return typeof result === 'string' ? result : null;
  }

  public getEventsByLevel(level: AuditEvent['level']): AuditEvent[] {
    return this.eventBuffer.filter(e => e.level === level);
  }

  public clearBuffer(): void {
    this.eventBuffer = [];
  }
}

export const auditLogger = new AuditLoggerAdapter();

export const Logger = {
  error: (msg: string | Error, err?: unknown) => {
    const errorObj =
      err instanceof Error
        ? err
        : msg instanceof Error
        ? msg
        : new Error(String(msg));

    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: errorObj.message,
      context: {
        msg: String(msg),
        stack: errorObj.stack ?? null
      }
    });
  },

  warn: (msg: string, data?: Record<string, unknown>) => {
    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'warning',
      message: msg,
      context: data
    });
  },

  info: (msg: string, data?: Record<string, unknown>) => {
    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: msg,
      context: data
    });
  },

  log: (first: unknown, second?: unknown) => {
    const message = typeof second === 'string' ? second : String(first);
    const rawData = second !== undefined ? second : first;

    let contextValue: Record<string, unknown> | undefined;

    if (rawData !== null && typeof rawData === 'object' && !Array.isArray(rawData)) {
      contextValue = rawData as Record<string, unknown>;
    } else if (rawData !== undefined) {
      contextValue = { value: rawData };
    }

    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context: contextValue
    });
  }
};

export const logger = Logger;
export const AuditLogger = Logger;