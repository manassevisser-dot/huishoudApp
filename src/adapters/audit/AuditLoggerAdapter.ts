// src/adapters/audit/AuditLoggerAdapter.ts
/**
 * @file_intent Centraal systeem voor event-logging, foutafhandeling en berichtvertaling.
 * @repo_architecture Mobile Industry (MI) - Infrastructure / Adapter Layer.
 * @term_definition Event-Routing = Het proces waarbij op basis van log-niveau (info/fatal) de bestemming (UI/Console/Mail) wordt bepaald.
 * @contract Biedt een stabiele Logger API. Vertaalt technische error-codes naar menselijke taal via 'validationMessages'.
 * @ai_instruction Bevat de kritieke 'translate' methode. Voeg hier GEEN UI-logica toe; gebruik subscribe/routeToUI voor koppeling met de app-shell.
 */
import { validationMessages } from '@state/schemas/sections/validationMessages';

export type AuditLevel = 'info' | 'warning' | 'error' | 'fatal';

export interface AuditEvent {
  timestamp: string;
  level: AuditLevel;
  eventName: string;
  message: string;
  context?: Record<string, unknown>;
}

export interface AuditEventInput {
  timestamp: string;
  level: AuditLevel;
  eventName: string;
  message?: string;
  context?: Record<string, unknown>;
}

export type AuditListener = (event: AuditEvent) => void;

export interface AuditLoggerPort {
  logEvent(event: AuditEventInput): void;
  getEventsByLevel(level: AuditLevel): AuditEvent[];
  subscribe(listener: AuditListener): () => void;
}

const FATAL_EVENT_NAMES = new Set<string>(['SYSTEM_ERROR', 'VALIDATION_CRASH']);

class AuditLoggerAdapter implements AuditLoggerPort {
  private eventBuffer: AuditEvent[] = [];

  private listeners = new Set<AuditListener>();

  public logEvent(input: AuditEventInput): void {
    const event = this.normalizeEvent(input);

    if (event.level === 'fatal') {
      this.routeToTicketing(event);
    }

    if (event.level === 'error' || event.level === 'warning' || event.level === 'fatal') {
      this.routeToUI(event);
    }

    this.routeToConsole(event);
    this.eventBuffer.push(event);
  }

  public subscribe(listener: AuditListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getEventsByLevel(level: AuditLevel): AuditEvent[] {
    return this.eventBuffer.filter((e) => e.level === level);
  }

  public clearBuffer(): void {
    this.eventBuffer = [];
  }

  private normalizeEvent(input: AuditEventInput): AuditEvent {
    const translatedMessage = this.translate(input.eventName);
    const shouldEscalate = FATAL_EVENT_NAMES.has(input.eventName);
    const normalizedLevel: AuditLevel = shouldEscalate ? 'fatal' : input.level;
    const normalizedMessage = translatedMessage ?? input.message ?? input.eventName;

    const normalizedContext = translatedMessage !== null
      ? { ...input.context, originalCode: input.eventName }
      : input.context;

    return {
      timestamp: input.timestamp,
      level: normalizedLevel,
      eventName: input.eventName,
      message: normalizedMessage,
      context: normalizedContext,
    };
  }

  private routeToConsole(event: AuditEvent): void {
    const payload = JSON.stringify({
      level: event.level,
      eventName: event.eventName,
      message: event.message,
      timestamp: event.timestamp,
      context: event.context,
    });
    console.warn('[AUDIT]', payload);
  }

  private routeToUI(event: AuditEvent): void {
    this.listeners.forEach((listener) => {
      listener(event);
    });
  }

  private routeToTicketing(event: AuditEvent): void {
    console.error('!!! TICKETING/MAIL ALERT !!!', event);
  }

  private translate(path: string): string | null {
    if (path.length === 0) {
      return null;
    }

    const keys = path.split('.');
    const result = keys.reduce<unknown>((obj, key) => {
      if (obj !== null && typeof obj === 'object' && key in obj) {
        return (obj as Record<string, unknown>)[key];
      }
      return null;
    }, validationMessages);

    return typeof result === 'string' ? result : null;
  }
}

const toIsoNow = (): string => new Date().toISOString();

const toEventName = (value: unknown): string => String(value);

const parseLevelToken = (value: unknown): AuditLevel | null => {
  const token = String(value).toUpperCase();
  if (token === 'WARN' || token === 'WARNING') {
    return 'warning';
  }
  if (token === 'ERROR') {
    return 'error';
  }
  if (token === 'FATAL') {
    return 'fatal';
  }
  if (token === 'INFO') {
    return 'info';
  }
  return null;
};

export const auditLogger = new AuditLoggerAdapter();

export const Logger = {
  error: (eventName: string | Error, err?: unknown) => {
    const errorObj =
      err instanceof Error
        ? err
        : eventName instanceof Error
          ? eventName
          : new Error(String(eventName));

    const eventNameValue = eventName instanceof Error ? 'UNEXPECTED_ERROR' : eventName;

    const contextFromErr = (err !== null && typeof err === 'object' && !(err instanceof Error))
      ? (err as Record<string, unknown>)
      : undefined;

    auditLogger.logEvent({
      timestamp: toIsoNow(),
      level: 'error',
      eventName: eventNameValue,
      message: errorObj.message,
      context: {
        msg: String(eventName),
        stack: errorObj.stack ?? null,
        ...contextFromErr,
      },
    });
  },

  warn: (eventName: string, data?: Record<string, unknown>) => {
    auditLogger.logEvent({
      timestamp: toIsoNow(),
      level: 'warning',
      eventName,
      context: data,
    });
  },

  info: (eventName: string, data?: Record<string, unknown>) => {
    auditLogger.logEvent({
      timestamp: toIsoNow(),
      level: 'info',
      eventName,
      context: data,
    });
  },

  log: (first: unknown, second?: unknown) => {
    const parsedLevel = parseLevelToken(first);
    const level: AuditLevel = parsedLevel ?? 'info';

    const eventName = parsedLevel === null ? toEventName(first) : toEventName(first);

    let messageValue: string | undefined;
    let contextValue: Record<string, unknown> | undefined;

    if (typeof second === 'string') {
      messageValue = second;
    } else if (second !== null && typeof second === 'object' && !Array.isArray(second)) {
      contextValue = second as Record<string, unknown>;
    } else if (second !== undefined) {
      contextValue = { value: second };
    }

    auditLogger.logEvent({
      timestamp: toIsoNow(),
      level,
      eventName,
      message: messageValue,
      context: contextValue,
    });
  },
};

export const logger = Logger;
export const AuditLogger = Logger;

export const subscribeToAuditEvents = (listener: AuditListener): (() => void) => {
  return auditLogger.subscribe(listener);
};
