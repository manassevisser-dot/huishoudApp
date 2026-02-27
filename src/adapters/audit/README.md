# Audit Logging Systeem

## 🎯 Verantwoordelijkheid

Centrale adapter voor applicatie-brede event logging. Biedt een gestandaardiseerde interface voor alle logging, zorgt voor consistente formatting, routing naar console/UI/ticketing, en vertaling van technische event-codes naar gebruikersberichten via `validationMessages`.

---

## 🏗️ Architectuur

- **Layer**: Adapter (Infrastructure)
- **Pattern**: Pub/Sub + Port-Adapter (Hexagonal Architecture)
- **Dependencies**: `validationMessages` (foutvertaling) ← geen domein-logica
- **Singleton**: `auditLogger` (intern); consumenten gebruiken altijd `Logger`

```
Component
  └── Logger.info / .warn / .error
        └── AuditLoggerAdapter.logEvent()
              ├── normalizeEvent()  ← vertaalt code + escaleert naar fatal
              ├── routeToConsole()  ← altijd
              ├── routeToUI()       ← warning / error / fatal
              └── routeToTicketing()← fatal only
```

### Routing per level

| Level | Console | Buffer | UI-notificatie | Ticketing |
|---|---|---|---|---|
| `info` | ✅ | ✅ | ❌ | ❌ |
| `warning` | ✅ | ✅ | ✅ toast | ❌ |
| `error` | ✅ | ✅ | ✅ modal | ❌ |
| `fatal` | ✅ | ✅ | ✅ modal | ✅ mail |

`FATAL_EVENT_NAMES` (`SYSTEM_ERROR`, `VALIDATION_CRASH`) escaleren automatisch naar `fatal`, ongeacht het meegegeven level.

---

## 📋 Contract / API

### Publieke exports

| Export | Type | Beschrijving |
|---|---|---|
| `Logger` | namespace | Primaire API — gebruik altijd dit |
| `Logger.info(eventName, data?)` | method | Gebruikersacties, geen UI-notificatie |
| `Logger.warn(eventName, data?)` | method | Niet-kritieke waarschuwingen, toont UI |
| `Logger.error(eventName, err?)` | method | Herstelbare fouten met stack trace |
| `Logger.log(...)` | method | **@deprecated** — gebruik specifieke methoden |
| `subscribeToAuditEvents(listener)` | function | Registreert UI-listener; geeft unsubscribe terug |
| `AuditLevel` | type | `'info' \| 'warning' \| 'error' \| 'fatal'` |
| `AuditEvent` | interface | Genormaliseerd event-object |
| `AuditLoggerPort` | interface | Port-contract voor dependency injection |
| `auditLogger` | instance | Singleton — niet direct gebruiken |

### Term-definities

- **`AuditEvent`**: Genormaliseerd object met `timestamp`, `level`, `eventName`, `message` en optionele `context`. De SSOT voor alle log-output.
- **`normalizeEvent`**: Interne stap die event-codes vertaalt via `validationMessages`, fatale codes escaleert, en `originalCode` toevoegt aan context.
- **`eventBuffer`**: In-memory opslag van alle events — bruikbaar in tests via `auditLogger.getEventsByLevel()`.

---

## 💡 Best Practices

**Do's**
- Gebruik `Logger.error()` altijd met een `Error`-object voor stack traces
- Voeg altijd context toe: `Logger.info('USER_LOGIN', { userId: 123 })`
- Stel `subscribeToAuditEvents` in de app shell in (App.tsx) voor UI-notificaties
- Gebruik `auditLogger.clearBuffer()` in test `beforeEach`

**Don'ts**
- Gebruik geen `console.log` direct (ESLint-grens)
- Gebruik `Logger.log()` niet in nieuwe code (legacy)
- Log geen gevoelige data (passwords, tokens) in `context`
- Gebruik `auditLogger` nooit direct buiten tests

---

## 🧩 Voorbeelden

```typescript
// Logging
Logger.info('USER_LOGIN_SUCCESS', { userId: 123, method: 'google' });
Logger.warn('RATE_LIMIT_NEAR', { currentLoad: 85 });
Logger.error('API_CALL_FAILED', error);

// UI-notificaties instellen (App.tsx)
useEffect(() => {
  return subscribeToAuditEvents((event) => {
    if (event.level === 'error' || event.level === 'fatal') showErrorModal(event.message);
    if (event.level === 'warning') showWarningToast(event.message);
  });
}, []);

// Testen
import { auditLogger } from './AuditLoggerAdapter';
beforeEach(() => { auditLogger.clearBuffer(); });
test('logs error on failure', () => {
  Logger.error('VALIDATION_FAILED', new Error('invalid'));
  expect(auditLogger.getEventsByLevel('error')).toHaveLength(1);
});
```

---

## 🔗 Gerelateerd

- [`validationMessages`](../../state/schemas/sections/validationMessages.ts) — event-code vertaaltabel
- [`AuditLoggerPort`](./AuditLoggerAdapter.ts) — port-interface voor DI
- Toekomstig: Sentry.io koppeling voor `error`/`fatal` events
