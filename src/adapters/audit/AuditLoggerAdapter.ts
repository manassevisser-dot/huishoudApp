// src/adapters/audit/AuditLoggerAdapter.ts
/* eslint-disable */
/**
 * Centrale audit logging adapter voor applicatie-brede event logging.
 * Volledig RFC 5424 compliant met 8 log levels.
 *
 * @module adapters/audit
 * @see {@link ./README.md | AuditLoggerAdapter — Details}
 * @see {@link https://tools.ietf.org/html/rfc5424 | RFC 5424 - The Syslog Protocol}
 *
 * @example
 * Logger.notice('user.completed_wizard', { step: 'household' });
 * Logger.critical('database.corruption_detected', { table: 'transactions' });
 */

import { validationMessages } from '@state/schemas/sections/validationMessages';

/**
 * RFC 5424 log levels met bijbehorende ernst (0 = hoogste, 7 = laagste)
 * 
 * | Level | Naam       | Betekenis                          | UI Actie          |
 * |-------|------------|------------------------------------|-------------------|
 * | 0     | emergency  | Systeem onbruikbaar                | Alert + Reset     |
 * | 1     | alert      | Onmiddellijke actie nodig           | Alert + Recovery  |
 * | 2     | critical   | Kritieke fout                       | Error Modal       |
 * | 3     | error      | Fout, maar app draait door          | Error Toast       |
 * | 4     | warning    | Potentieel probleem                 | Warning Toast     |
 * | 5     | notice     | Normaal, maar significant           | Geen (audit only) |
 * | 6     | info       | Normale operatie                    | Geen              |
 * | 7     | debug      | Debug informatie (alleen DEV)       | Console           |
 */
export type Rfc5424Level = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Menselijke leesbare namen voor RFC 5424 levels */
export const RFC_5424_NAMES: Record<Rfc5424Level, string> = {
  0: 'EMERGENCY',
  1: 'ALERT',
  2: 'CRITICAL',
  3: 'ERROR',
  4: 'WARNING',
  5: 'NOTICE',
  6: 'INFO',
  7: 'DEBUG'
};

type ValidationMessages = typeof validationMessages;
type FlattenedMessages = {
  [K in keyof ValidationMessages]: ValidationMessages[K] extends string 
    ? ValidationMessages[K]
    : never;
};

/** Mapping van oude AuditLevel naar RFC 5424 voor backward compatibility */
const LEGACY_LEVEL_MAP: Record<string, Rfc5424Level> = {
  fatal: 0,      // emergency
  error: 3,
  warning: 4,
  info: 6
};

/**
 * Gestandaardiseerd event object voor alle audit logging (RFC 5424 compliant)
 */
export interface AuditEvent {
  /** ISO 8601 timestamp */
  timestamp: string;
  /** RFC 5424 log level (0-7) */
  level: Rfc5424Level;
  /** Unieke event identifier (domain.action.outcome) */
  eventName: string;
  /** User-facing message (alleen voor levels 0-4) */
  message?: string;
  /** Gestructureerde context data */
  context?: Record<string, unknown>;
  /** Applicatie versie */
  version: string;
  /** ADR referentie(s) */
  adr?: string | string[];
  /** Geanonimiseerde gebruiker ID */
  userId?: string;
  /** Workflow/component source */
  source?: string;
}

/** Input voor logEvent — alle velden optioneel behalve eventName */
export interface AuditEventInput {
  eventName: string;
  level?: Rfc5424Level;
  message?: string;
  context?: Record<string, unknown>;
  adr?: string | string[];
  userId?: string;
  source?: string;
}

export type AuditListener = (event: AuditEvent) => void;

/**
 * Port interface voor audit logging (Hexagonal Architecture)
 * RFC 5424 compliant
 */
export interface AuditLoggerPort {
  log(level: Rfc5424Level, eventName: string, context?: Record<string, unknown>, options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>): void;
  emergency(eventName: string, context?: Record<string, unknown>, options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>): void;
  alert(eventName: string, context?: Record<string, unknown>, options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>): void;
  critical(eventName: string, context?: Record<string, unknown>, options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>): void;
  error(eventName: string, context?: Record<string, unknown>, options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>): void;
  warning(eventName: string, context?: Record<string, unknown>, options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>): void;
  notice(eventName: string, context?: Record<string, unknown>, options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>): void;
  info(eventName: string, context?: Record<string, unknown>, options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>): void;
  debug(eventName: string, context?: Record<string, unknown>, options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>): void;
  getEvents(minLevel?: Rfc5424Level, maxLevel?: Rfc5424Level): AuditEvent[];
  subscribe(listener: AuditListener): () => void;
}

/** Events die automatisch naar emergency worden geëscaleerd */
const EMERGENCY_EVENTS = new Set<string>([
  'system.crash',
  'memory.corruption',
  'storage.unrecoverable'
]);

/** Events die automatisch naar critical worden geëscaleerd */
const CRITICAL_EVENTS = new Set<string>([
  'database.corruption',
  'validation.crash',
  'hydration.failed'
]);

/** Events die automatisch naar alert worden geëscaleerd */
const ALERT_EVENTS = new Set<string>([
  'api.timeout',
  'rate.limit.exceeded',
  'security.breach_attempt'
]);

/** Maximale buffer grootte om geheugenlekken te voorkomen */
const MAX_BUFFER_SIZE = 1000;

/**
 * Concrete implementatie van `AuditLoggerPort` met routing naar console, UI en ticketing.
 * RFC 5424 compliant met alle 8 log levels.
 */
class AuditLoggerAdapter implements AuditLoggerPort {
  private eventBuffer: AuditEvent[] = [];
  private listeners = new Set<AuditListener>();
  private readonly VERSION = '2025-02-A'; // RFC 5424 upgrade versie

  public log(
    level: Rfc5424Level,
    eventName: string,
    context?: Record<string, unknown>,
    options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>
  ): void {
    // Alleen debug logs in development
    if (level === 7 && !__DEV__) return;

    const event = this.createEvent(level, eventName, context, options);
    
    // Route based on severity
    this.routeEvent(event);
    
    // Buffer management
    this.eventBuffer.push(event);
    if (this.eventBuffer.length > MAX_BUFFER_SIZE) {
      this.eventBuffer = this.eventBuffer.slice(-MAX_BUFFER_SIZE);
    }
  }

  // Convenience methods voor elk RFC 5424 level
  public emergency(eventName: string, context?: Record<string, unknown>, options?: any): void {
    this.log(0, eventName, context, options);
  }

  public alert(eventName: string, context?: Record<string, unknown>, options?: any): void {
    this.log(1, eventName, context, options);
  }

  public critical(eventName: string, context?: Record<string, unknown>, options?: any): void {
    this.log(2, eventName, context, options);
  }

  public error(eventName: string, context?: Record<string, unknown>, options?: any): void {
    this.log(3, eventName, context, options);
  }

  public warning(eventName: string, context?: Record<string, unknown>, options?: any): void {
    this.log(4, eventName, context, options);
  }

  public notice(eventName: string, context?: Record<string, unknown>, options?: any): void {
    this.log(5, eventName, context, options);
  }

  public info(eventName: string, context?: Record<string, unknown>, options?: any): void {
    this.log(6, eventName, context, options);
  }

  public debug(eventName: string, context?: Record<string, unknown>, options?: any): void {
    this.log(7, eventName, context, options);
  }

  public getEvents(minLevel: Rfc5424Level = 0, maxLevel: Rfc5424Level = 7): AuditEvent[] {
    return this.eventBuffer.filter(e => e.level >= minLevel && e.level <= maxLevel);
  }

  public subscribe(listener: AuditListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public clearBuffer(): void {
    this.eventBuffer = [];
  }

  /**
   * Creëer een RFC 5424 compliant AuditEvent
   */
  private createEvent(
    level: Rfc5424Level,
    eventName: string,
    context?: Record<string, unknown>,
    options?: Omit<AuditEventInput, 'eventName' | 'level' | 'context'>
  ): AuditEvent {
    // Automatische escalation op basis van eventName
    const escalatedLevel = this.escalateLevel(level, eventName);
    
    // Vertaal eventName naar user-facing message
    const message = options?.message ?? this.translate(eventName);
    
    return {
      timestamp: new Date().toISOString(),
      level: escalatedLevel,
      eventName,
      message,
      context,
      version: this.VERSION,
      adr: options?.adr,
      userId: options?.userId,
      source: options?.source
    };
  }

  /**
   * Escaleer level op basis van event name indien nodig
   */
  private escalateLevel(originalLevel: Rfc5424Level, eventName: string): Rfc5424Level {
    if (EMERGENCY_EVENTS.has(eventName)) return 0;
    if (CRITICAL_EVENTS.has(eventName)) return 2;
    if (ALERT_EVENTS.has(eventName)) return 1;
    return originalLevel;
  }

  /**
   * Route event naar juiste output channels based on severity
   */
  private routeEvent(event: AuditEvent): void {
    // Altijd naar console
    this.routeToConsole(event);
    
    // Levels 0-4 gaan naar UI
    if (event.level <= 4) {
      this.routeToUI(event);
    }
    
    // Levels 0-2 gaan naar ticketing/alert systemen
    if (event.level <= 2) {
      this.routeToTicketing(event);
    }
    
    // Levels 0-1 triggeren emergency procedures
    if (event.level <= 1) {
      this.triggerEmergencyProtocol(event);
    }
  }

  private routeToConsole(event: AuditEvent): void {
    const levelName = RFC_5424_NAMES[event.level];
    const prefix = `[${levelName}] ${event.eventName}`;
    
    const payload = {
      timestamp: event.timestamp,
      message: event.message,
      context: event.context,
      version: event.version,
      adr: event.adr,
      userId: event.userId,
      source: event.source
    };

    switch (event.level) {
      case 0: case 1: case 2:
        console.error(prefix, payload);
        break;
      case 3:
        console.error(prefix, payload);
        break;
      case 4:
        console.warn(prefix, payload);
        break;
      case 5: case 6:
        console.log(prefix, payload);
        break;
      case 7:
        console.debug(prefix, payload);
        break;
    }
  }

  private routeToUI(event: AuditEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        console.error('Audit listener failed', e);
      }
    });
  }

  private routeToTicketing(event: AuditEvent): void {
    // Integreer met Sentry/Bugsnag/etc.
    if (event.level <= 2) {
      console.error('!!! TICKETING/MAIL ALERT !!!', {
        level: RFC_5424_NAMES[event.level],
        event: event.eventName,
        message: event.message,
        timestamp: event.timestamp
      });
    }
  }

  private triggerEmergencyProtocol(event: AuditEvent): void {
    // Bij emergency/alert: probeer app te resetten of recovery
    if (event.level === 0) {
      // Forceer volledige reset
      console.error('EMERGENCY - Initiële volledige reset');
      // dispatch({ type: 'EMERGENCY_RESET' });
    } else if (event.level === 1) {
      // Probeer graceful recovery
      console.error('ALERT - Initiële recovery procedure');
      // dispatch({ type: 'ATTEMPT_RECOVERY' });
    }
  }

  /**
   * Vertaal eventName naar user-facing message via validationMessages
   * Ondersteunt zowel dot.notatie als SCREAMING_SNAKE
   */
  private translate(eventName: string): string | undefined {
  if (!eventName) return undefined;

  // Probeer directe match (voor event names zonder dots)
  const directMatch = validationMessages[eventName as keyof typeof validationMessages];
  if (typeof directMatch === 'string') return directMatch;

  // Probeer dot-notatie (event.name → event.name)
  const keys = eventName.split('.');
  let result: unknown = validationMessages;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      result = undefined;
      break;
    }
  }
  
  return typeof result === 'string' ? result : undefined;
}
}

// ===== Backward compatibility voor legacy events =====

/** Convert legacy string level naar RFC 5424 */
const toRfc5424Level = (level: string | number): Rfc5424Level => {
  if (typeof level === 'number') {
    return Math.min(7, Math.max(0, level)) as Rfc5424Level;
  }
  const normalized = level.toLowerCase();
  return LEGACY_LEVEL_MAP[normalized] ?? 6; // default info
};

// ===== Exports =====

/** Singleton instantie */
export const auditLogger = new AuditLoggerAdapter();

/**
 * RFC 5424 Compliant Logger API
 * 
 * @example
 * // Level-specific methods
 * Logger.emergency('system.crash', { reason: 'OOM' });
 * Logger.critical('database.corruption', { table: 'transactions' });
 * Logger.error('validation.failed', { field: 'email', value: input });
 * Logger.warning('rate.limit.near', { currentLoad: 85 });
 * Logger.notice('user.completed_wizard', { step: 'household' });
 * Logger.info('user.action', { screen: 'dashboard', action: 'click' });
 * Logger.debug('render.performance', { durationMs: 42 });
 * 
 * // Met ADR referenties
 * Logger.notice('csv.import.completed', { rowCount: 150 }, { adr: 'ADR-13' });
 * 
 * // Met user context
 * Logger.error('payment.failed', { amount: 1250 }, { userId: 'anon_123' });
 */
export const Logger = {
  // RFC 5424 level methods
  emergency: auditLogger.emergency.bind(auditLogger),
  alert: auditLogger.alert.bind(auditLogger),
  critical: auditLogger.critical.bind(auditLogger),
  error: auditLogger.error.bind(auditLogger),
  warning: auditLogger.warning.bind(auditLogger),
  notice: auditLogger.notice.bind(auditLogger),
  info: auditLogger.info.bind(auditLogger),
  debug: auditLogger.debug.bind(auditLogger),
  
  // Generieke log method (voor compatibiliteit)
  log: (level: Rfc5424Level | string, eventName: string, context?: Record<string, unknown>, options?: any) => {
    const numericLevel = typeof level === 'string' ? toRfc5424Level(level) : level;
    auditLogger.log(numericLevel, eventName, context, options);
  },
  
  // Legacy methods (deprecated)
  /** @deprecated Gebruik Logger.error() */
  legacyError: (eventName: string, err?: unknown) => {
    const context = err instanceof Error 
      ? { message: err.message, stack: err.stack }
      : { value: err };
    auditLogger.error(eventName, context);
  }
};

/** @alias Logger */
export const logger = Logger;

/** @alias Logger */
export const AuditLogger = Logger;

/**
 * Subscribe op audit events voor UI notificaties
 * @param listener - Callback voor nieuwe events (alleen levels 0-4 worden gestuurd)
 * @returns Unsubscribe functie
 * 
 * @example
 * useEffect(() => {
 *   const unsubscribe = subscribeToAuditEvents((event) => {
 *     if (event.level <= 2) {
 *       showCriticalErrorModal(event.message);
 *     } else if (event.level === 3) {
 *       showErrorToast(event.message);
 *     } else if (event.level === 4) {
 *       showWarningToast(event.message);
 *     }
 *   });
 *   return unsubscribe;
 * }, []);
 */
export const subscribeToAuditEvents = (listener: AuditListener): (() => void) => {
  return auditLogger.subscribe(listener);
};

/**
 * Haal opgeslagen events op voor analyse
 * @param minLevel - Minimum RFC level (0-7, default 0)
 * @param maxLevel - Maximum RFC level (0-7, default 7)
 */
export const getAuditEvents = (minLevel?: Rfc5424Level, maxLevel?: Rfc5424Level): AuditEvent[] => {
  return auditLogger.getEvents(minLevel, maxLevel);
};