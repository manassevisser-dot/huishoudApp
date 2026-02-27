[**HuishoudApp API Documentatie**](../README.md)

***

[HuishoudApp API Documentatie](../README.md) / AuditLoggerPort

# Interface: AuditLoggerPort

Defined in: [AuditLoggerAdapter.ts:84](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L84)

AuditLoggerPort

## Description

Port interface volgens Hexagonal Architecture

## Method

logEvent - Centrale methode voor verwerken van audit events

## Method

getEventsByLevel - Haal events op voor debugging

## Method

subscribe - Stel UI componenten in staat te luisteren

## Methods

### logEvent()

> **logEvent**(`event`): `void`

Defined in: [AuditLoggerAdapter.ts:85](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L85)

#### Parameters

##### event

[`AuditEventInput`](AuditEventInput.md)

#### Returns

`void`

***

### getEventsByLevel()

> **getEventsByLevel**(`level`): [`AuditEvent`](AuditEvent.md)[]

Defined in: [AuditLoggerAdapter.ts:86](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L86)

#### Parameters

##### level

[`AuditLevel`](../type-aliases/AuditLevel.md)

#### Returns

[`AuditEvent`](AuditEvent.md)[]

***

### subscribe()

> **subscribe**(`listener`): () => `void`

Defined in: [AuditLoggerAdapter.ts:87](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L87)

#### Parameters

##### listener

[`AuditListener`](../type-aliases/AuditListener.md)

#### Returns

> (): `void`

##### Returns

`void`
