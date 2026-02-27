[**HuishoudApp API Documentatie**](../README.md)

***

[HuishoudApp API Documentatie](../README.md) / AuditEvent

# Interface: AuditEvent

Defined in: [AuditLoggerAdapter.ts:54](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L54)

AuditEvent

## Description

Gestandaardiseerd event object voor alle audit logging

## Example

```ts
{
 *   timestamp: '2024-01-15T10:30:00.000Z',
 *   level: 'error',
 *   eventName: 'VALIDATION_FAILED',
 *   message: 'Email adres is ongeldig',
 *   context: { field: 'email' }
 * }
```

## Properties

### timestamp

> **timestamp**: `string`

Defined in: [AuditLoggerAdapter.ts:55](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L55)

ISO 8601 timestamp van het event

***

### level

> **level**: [`AuditLevel`](../type-aliases/AuditLevel.md)

Defined in: [AuditLoggerAdapter.ts:56](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L56)

Ernst van het event

***

### eventName

> **eventName**: `string`

Defined in: [AuditLoggerAdapter.ts:57](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L57)

Unieke identifier (bijv. 'USER_LOGIN_FAILED')

***

### message

> **message**: `string`

Defined in: [AuditLoggerAdapter.ts:58](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L58)

Menselijke leesbare beschrijving

***

### context?

> `optional` **context**: `Record`\<`string`, `unknown`\>

Defined in: [AuditLoggerAdapter.ts:59](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L59)

Optionele extra metadata
