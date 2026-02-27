[**HuishoudApp API Documentatie**](../../../../README.md)

***

[HuishoudApp API Documentatie](../../../../README.md) / [Logger](../README.md) / info

# Function: info()

> **info**(`eventName`, `data?`): `void`

Defined in: [AuditLoggerAdapter.ts:318](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L318)

Log informatie (geen UI notificatie)

## Parameters

### eventName

`string`

Informatie code

### data?

`Record`\<`string`, `unknown`\>

Optionele context

## Returns

`void`

## Example

```ts
Logger.info('USER_REGISTERED', { userId: 456, method: 'google' });
```
