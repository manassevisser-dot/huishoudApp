[**HuishoudApp API Documentatie**](../../../../README.md)

***

[HuishoudApp API Documentatie](../../../../README.md) / [Logger](../README.md) / warn

# Function: warn()

> **warn**(`eventName`, `data?`): `void`

Defined in: [AuditLoggerAdapter.ts:301](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L301)

Log een waarschuwing (toont UI notificatie)

## Parameters

### eventName

`string`

Waarschuwingscode

### data?

`Record`\<`string`, `unknown`\>

Optionele context

## Returns

`void`

## Example

```ts
Logger.warn('RATE_LIMIT_NEAR', { currentLoad: 85 });
```
