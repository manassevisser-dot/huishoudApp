[**HuishoudApp API Documentatie**](../../../README.md)

***

[HuishoudApp API Documentatie](../../../README.md) / Logger

# Logger

Logger

## Description

Publieke API voor alle logging in de applicatie

## Example

```ts
// Aanbevolen gebruik
Logger.info('USER_ACTION', { screen: 'Home' });
Logger.warn('RATE_LIMIT_NEAR', { currentLoad: 85 });
Logger.error('API_TIMEOUT', error);
```

## Functions

- [error](functions/error.md)
- [warn](functions/warn.md)
- [info](functions/info.md)
- [~~log~~](functions/log.md)
