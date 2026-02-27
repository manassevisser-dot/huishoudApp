// src/adapters/audit/AuditLoggerAdapter.ts

/**
 * Centrale audit logging adapter voor applicatie-brede event logging.
 *
 * @module adapters/audit
 * @see {@link ./README.md | AuditLoggerAdapter — Details}
 *
 * @example
 * Logger.info('USER_LOGIN_SUCCESS', { userId: 123 });
 * subscribeToAuditEvents((event) => { if (event.level === 'error') showToast(event.message); });
 */

import { validationMessages } from '@state/schemas/sections/validationMessages';

/** Log levels in oplopende ernst — `info` (geen UI) → `warning`/`error` (UI) → `fatal` (UI + alert). */
export type AuditLevel = 'info' | 'warning' | 'error' | 'fatal';

/**
 * Gestandaardiseerd event object voor alle audit logging.
 *
 * @example
 * { timestamp: '2024-01-15T10:30:00.000Z', level: 'error', eventName: 'VALIDATION_FAILED', message: '...' }
 */
export interface AuditEvent {
  timestamp: string;
  level: AuditLevel;
  eventName: string;
  message: string;
  context?: Record<string, unknown>;
}

/** Input voor `logEvent` — `message` is optioneel en wordt via `validationMessages` vertaald. */
export interface AuditEventInput {
  timestamp: string;
  level: AuditLevel;
  eventName: string;
  message?: string;
  context?: Record<string, unknown>;
}

export type AuditListener = (event: AuditEvent) => void;

/**
 * Port interface voor audit logging (Hexagonal Architecture).
 *
 * @see {@link ./README.md | AuditLoggerAdapter — Details}
 */
export interface AuditLoggerPort {
  logEvent(event: AuditEventInput): void;
  getEventsByLevel(level: AuditLevel): AuditEvent[];
  subscribe(listener: AuditListener): () => void;
}

const FATAL_EVENT_NAMES = new Set<string>(['SYSTEM_ERROR', 'VALIDATION_CRASH']);

/**
 * Concrete implementatie van `AuditLoggerPort` met routing naar console, UI en ticketing.
 *
 * @see {@link validationMessages} voor error code vertalingen
 */
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

  /**
   * Normaliseer een event input naar een volledig AuditEvent
   * @private
   * @description
   * 1. Vertaalt eventName naar menselijke tekst
   * 2. Escaleert naar fatal indien nodig
   * 3. Voegt originele code toe aan context
   */
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

  /** @private Alleen voor fatal events - stuurt alert naar ticketing systeem */
  private routeToTicketing(event: AuditEvent): void {
    console.error('!!! TICKETING/MAIL ALERT !!!', event);
  }

  /** @private Vertaal technische error code via validationMessages */
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

// ===== Helper functies =====

/** @private Huidige tijd in ISO 8601 formaat */
const toIsoNow = (): string => new Date().toISOString();

/** @private Zet elke input om naar string voor eventName */
const toEventName = (value: unknown): string => String(value);

/**
 * @private Zet string tokens om naar AuditLevel enum
 * @example
 * parseLevelToken('WARN') // returns 'warning'
 * parseLevelToken('ERROR') // returns 'error'
 */
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

// ===== Exports =====

/** @private Singleton instantie - gebruik Logger in plaats van direct */
export const auditLogger = new AuditLoggerAdapter();

/**
 * Publieke API voor alle logging in de applicatie.
 *
 * @example
 * Logger.info('USER_ACTION', { screen: 'Home' });
 * Logger.error('API_TIMEOUT', error);
 */
export const Logger = {
  /**
   * Log een error met stack trace
   * @param {string|Error} eventName - Error code of Error object
   * @param {unknown} [err] - Optioneel Error object of context
   * 
   * @example
   * // Met Error object
   * try {
   *   await saveData();
   * } catch (error) {
   *   Logger.error('SAVE_FAILED', error);
   * }
   * 
   * // Met alleen context
   * Logger.error('VALIDATION_ERROR', { field: 'email' });
   */
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

  /**
   * Log een waarschuwing (toont UI notificatie)
   * @param {string} eventName - Waarschuwingscode
   * @param {Record<string, unknown>} [data] - Optionele context
   * 
   * @example
   * Logger.warn('RATE_LIMIT_NEAR', { currentLoad: 85 });
   */
  warn: (eventName: string, data?: Record<string, unknown>) => {
    auditLogger.logEvent({
      timestamp: toIsoNow(),
      level: 'warning',
      eventName,
      context: data,
    });
  },

  /**
   * Log informatie (geen UI notificatie)
   * @param {string} eventName - Informatie code
   * @param {Record<string, unknown>} [data] - Optionele context
   * 
   * @example
   * Logger.info('USER_REGISTERED', { userId: 456, method: 'google' });
   */
  info: (eventName: string, data?: Record<string, unknown>) => {
    auditLogger.logEvent({
      timestamp: toIsoNow(),
      level: 'info',
      eventName,
      context: data,
    });
  },

  /**
   * @deprecated Gebruik specifieke methods (info/warn/error) voor betere type safety
   * @see {@link Logger.info}
   * @see {@link Logger.warn}
   * @see {@link Logger.error}
   */
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

/** @alias Logger */
export const logger = Logger;
/** @alias Logger */
export const AuditLogger = Logger;

/**
 * Subscribe op audit events voor UI notificaties
 * @param {AuditListener} listener - Callback voor nieuwe events
 * @returns {() => void} Unsubscribe functie
 * 
 * @example
 * // In app shell
 * useEffect(() => {
 *   const unsubscribe = subscribeToAuditEvents((event) => {
 *     if (event.level === 'error') {
 *       showErrorToast(event.message);
 *     }
 *   });
 *   return unsubscribe;
 * }, []);
 */
export const subscribeToAuditEvents = (listener: AuditListener): (() => void) => {
  return auditLogger.subscribe(listener);
};