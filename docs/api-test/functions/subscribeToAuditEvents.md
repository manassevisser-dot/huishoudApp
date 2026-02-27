[**HuishoudApp API Documentatie**](../README.md)

***

[HuishoudApp API Documentatie](../README.md) / subscribeToAuditEvents

# Function: subscribeToAuditEvents()

> **subscribeToAuditEvents**(`listener`): () => `void`

Defined in: [AuditLoggerAdapter.ts:381](https://github.com/manassevisser-dot/huishoudApp/blob/3f82dabb6443b161e010dad7dcc2559c28526b7f/src/adapters/audit/AuditLoggerAdapter.ts#L381)

Subscribe op audit events voor UI notificaties

## Parameters

### listener

[`AuditListener`](../type-aliases/AuditListener.md)

Callback voor nieuwe events

## Returns

Unsubscribe functie

> (): `void`

### Returns

`void`

## Example

```ts
// In app shell
useEffect(() => {
  const unsubscribe = subscribeToAuditEvents((event) => {
    if (event.level === 'error') {
      showErrorToast(event.message);
    }
  });
  return unsubscribe;
}, []);
```
