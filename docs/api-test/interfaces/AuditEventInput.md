[**HuishoudApp API Documentatie**](../README.md)

***

[HuishoudApp API Documentatie](../README.md) / AuditEventInput

# Interface: AuditEventInput

Defined in: [AuditLoggerAdapter.ts:66](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L66)

AuditEventInput

## Description

Input formaat voor logEvent (message optioneel, wordt vertaald)

## Properties

### timestamp

> **timestamp**: `string`

Defined in: [AuditLoggerAdapter.ts:67](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L67)

***

### level

> **level**: [`AuditLevel`](../type-aliases/AuditLevel.md)

Defined in: [AuditLoggerAdapter.ts:68](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L68)

***

### eventName

> **eventName**: `string`

Defined in: [AuditLoggerAdapter.ts:69](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L69)

***

### message?

> `optional` **message**: `string`

Defined in: [AuditLoggerAdapter.ts:70](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L70)

***

### context?

> `optional` **context**: `Record`\<`string`, `unknown`\>

Defined in: [AuditLoggerAdapter.ts:71](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L71)
