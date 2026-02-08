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

  public logEvent(event: AuditEvent): void {
    // 1. VERTALING
    const translatedMessage = this.translate(event.message);
    
    // Fix: strict-boolean-expression (explicit check)
    if (translatedMessage !== null) {
      event.context = { ...event.context, originalCode: event.message };
      event.message = translatedMessage;
    }

    // 2. ROUTERING
    if (event.message === 'SYSTEM_ERROR' || event.message === 'VALIDATION_CRASH') {
      this.routeToTicketing(event);
      event.level = 'fatal';
    }

    if (event.level === 'error' || event.level === 'warning') {
      this.routeToUI(event);
    }

    // Fix: no-console. We gebruiken console.warn voor de audit-stroom.
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
    // Fix: no-console (alleen warn/error toegestaan)
    console.warn(`[AUDIT]`, payload);
  }

  private routeToUI(_event: AuditEvent): void {
    // Voor de UI componenten
  }

  private routeToTicketing(event: AuditEvent): void {
    console.error('!!! TICKETING/MAIL ALERT !!!', event);
  }

  /**
   * Graaft door validationMessages.
   * Fix: Geen 'any' meer, maar veilig type-scoping.
   */
  private translate(path: string): string | null {
    try {
      // Fix: strict-boolean-expressions
      if (path === '' || typeof path !== 'string') {
        return null;
      }

      const keys = path.split('.');
      // We typen het startpunt als unknown en casten alleen waar strikt nodig
      const result = keys.reduce<unknown>((obj, key) => {
        if (obj !== null && typeof obj === 'object' && key in obj) {
          return (obj as Record<string, unknown>)[key];
        }
        return null;
      }, validationMessages);

      return typeof result === 'string' ? result : null;
    } catch {
      return null;
    }
  }

  public getEventsByLevel(level: AuditEvent['level']): AuditEvent[] {
    return this.eventBuffer.filter(e => e.level === level);
  }

  public clearBuffer(): void {
    this.eventBuffer = [];
  }
}

export const auditLogger = new AuditLoggerAdapter();

/**
 * BACKWARD COMPATIBILITY BRIDGE
 * Fix: 'any' vervangen door 'unknown' of 'Error'
 */
export const Logger = {
  error: (msg: unknown, err?: unknown) => {
    const errorObj = err instanceof Error ? err : new Error(String(msg));
    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: errorObj.message,
      context: { msg: String(msg), stack: errorObj.stack }
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
    auditLogger.logEvent({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: message,
      context: { rawData: second ?? first }
    });
  }
};

export const logger = Logger;
export const AuditLogger = Logger;