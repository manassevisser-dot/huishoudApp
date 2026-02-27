[**HuishoudApp API Documentatie**](../../../../README.md)

***

[HuishoudApp API Documentatie](../../../../README.md) / [Logger](../README.md) / error

# Function: error()

> **error**(`eventName`, `err?`): `void`

Defined in: [AuditLoggerAdapter.ts:266](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L266)

Log een error met stack trace

## Parameters

### eventName

Error code of Error object

`string` | `Error`

### err?

`unknown`

Optioneel Error object of context

## Returns

`void`

## Example

```ts
// Met Error object
try {
  await saveData();
} catch (error) {
  Logger.error('SAVE_FAILED', error);
}

// Met alleen context
Logger.error('VALIDATION_ERROR', { field: 'email' });
```
