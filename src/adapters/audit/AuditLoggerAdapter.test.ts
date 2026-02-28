import { Logger, auditLogger } from '@adapters/audit/AuditLoggerAdapter';

describe('audit Logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    auditLogger.clearBuffer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // =========================================================================
  // info method — RFC level 6 → console.log('[INFO] eventName', payload)
  // =========================================================================

  describe('info method', () => {
    test('logs info message without data', () => {
      const spy = jest.spyOn(console, 'log');
      Logger.info('test.info_message');

      expect(spy).toHaveBeenCalledWith(
        '[INFO] test.info_message',
        expect.objectContaining({ version: '2025-02-A' })
      );
    });

    test('logs info message with data', () => {
      const spy = jest.spyOn(console, 'log');
      Logger.info('test.info', { key: 'value' });

      expect(spy).toHaveBeenCalledWith(
        '[INFO] test.info',
        expect.objectContaining({ context: { key: 'value' } })
      );
    });

    test('logs info with undefined data', () => {
      const spy = jest.spyOn(console, 'log');
      Logger.info('test.message', undefined);

      expect(spy).toHaveBeenCalledWith(
        '[INFO] test.message',
        expect.objectContaining({ version: '2025-02-A' })
      );
    });
  });

  // =========================================================================
  // error method — RFC level 3 → console.error('[ERROR] eventName', payload)
  // =========================================================================

  describe('error method', () => {
    test('logs error message without error object', () => {
      const spy = jest.spyOn(console, 'error');
      Logger.error('error.occurred');

      expect(spy).toHaveBeenCalledWith(
        '[ERROR] error.occurred',
        expect.objectContaining({ version: '2025-02-A' })
      );
    });

    test('logs error message with Error object', () => {
      const spy = jest.spyOn(console, 'error');
      const error = new Error('Test error');
      Logger.error('test.error_occurred', { error });

      expect(spy).toHaveBeenCalledWith(
        '[ERROR] test.error_occurred',
        expect.objectContaining({ context: { error } })
      );
    });

    test('logs error with context object', () => {
      const spy = jest.spyOn(console, 'error');
      Logger.error('test.failed', { message: 'Something went wrong' });

      expect(spy).toHaveBeenCalledWith(
        '[ERROR] test.failed',
        expect.objectContaining({ context: { message: 'Something went wrong' } })
      );
    });

    test('logs error with undefined context', () => {
      const spy = jest.spyOn(console, 'error');
      Logger.error('test.failed', undefined);

      expect(spy).toHaveBeenCalledWith(
        '[ERROR] test.failed',
        expect.any(Object)
      );
    });

    test('logs error with Error as first arg', () => {
      const spy = jest.spyOn(console, 'error');
      const error = new Error('Direct error');
      Logger.error('direct.error', { message: error.message });

      expect(spy).toHaveBeenCalledWith(
        '[ERROR] direct.error',
        expect.objectContaining({ context: { message: 'Direct error' } })
      );
    });
  });

  // =========================================================================
  // warn method — RFC level 4 → console.warn('[WARNING] eventName', payload)
  // =========================================================================

  describe('warn method', () => {
    test('logs warning without data', () => {
      const spy = jest.spyOn(console, 'warn');
      Logger.warning('test.warning_message');

      expect(spy).toHaveBeenCalledWith(
        '[WARNING] test.warning_message',
        expect.objectContaining({ version: '2025-02-A' })
      );
    });

    test('logs warning with data object', () => {
      const spy = jest.spyOn(console, 'warn');
      Logger.warning('test.warning', { warning: 'details' });

      expect(spy).toHaveBeenCalledWith(
        '[WARNING] test.warning',
        expect.objectContaining({ context: { warning: 'details' } })
      );
    });
  });

  // =========================================================================
  // log method — level string wordt geconverteerd via toRfc5424Level
  // =========================================================================

  describe('log method', () => {
    test('logs with single argument', () => {
      const spy = jest.spyOn(console, 'error');
      // eslint-disable-next-line no-restricted-properties
      Logger.log('error', 'test.error_event');

      expect(spy).toHaveBeenCalledWith(
        '[ERROR] test.error_event',
        expect.any(Object)
      );
    });

    test('logs with string and string', () => {
      const spy = jest.spyOn(console, 'log');
      // eslint-disable-next-line no-restricted-properties
      Logger.log('info', 'test.init_complete');

      expect(spy).toHaveBeenCalledWith(
        '[INFO] test.init_complete',
        expect.any(Object)
      );
    });

    test('logs with string and object', () => {
      const spy = jest.spyOn(console, 'log');
      // eslint-disable-next-line no-restricted-properties
      Logger.log('info', 'user.update', { userId: 123, action: 'save' });

      expect(spy).toHaveBeenCalledWith(
        '[INFO] user.update',
        expect.objectContaining({ context: { userId: 123, action: 'save' } })
      );
    });
  });

  // =========================================================================
  // Exports
  // =========================================================================

  describe('exports', () => {
    test('logger export works', () => {
      expect(Logger).toBeDefined();
      expect(Logger.info).toBeInstanceOf(Function);
      expect(Logger.error).toBeInstanceOf(Function);
      expect(Logger.warning).toBeInstanceOf(Function);
      // eslint-disable-next-line no-restricted-properties
      expect(Logger.log).toBeInstanceOf(Function);
    });

    test('Logger export (capitalized) works', () => {
      expect(Logger).toBeDefined();
      expect(Logger).toBe(Logger);
    });

    test('Logger export works', () => {
      expect(Logger).toBeDefined();
      expect(Logger).toBe(Logger);
    });

    test('all exports reference same instance', () => {
      expect(Logger).toBe(Logger);
      expect(Logger).toBe(Logger);
    });
  });

  // =========================================================================
  // Edge cases
  // =========================================================================

  describe('edge cases', () => {
    test('handles empty string message', () => {
      const spy = jest.spyOn(console, 'log');
      Logger.info('');

      // prefix = '[INFO] ' (lege eventName), payload bevat version
      expect(spy).toHaveBeenCalledWith(
        '[INFO] ',
        expect.objectContaining({ version: '2025-02-A' })
      );
    });

    test('handles complex nested objects', () => {
      const spy = jest.spyOn(console, 'log');
      Logger.info('test.complex', {
        nested: { deep: { value: 123 } },
        array: [1, 2, 3],
      });

      expect(spy).toHaveBeenCalledWith(
        '[INFO] test.complex',
        expect.objectContaining({
          context: expect.objectContaining({
            nested: expect.objectContaining({ deep: { value: 123 } }),
          }),
        })
      );
    });

    test('getEvents filters by level', () => {
      auditLogger.clearBuffer();
      Logger.info('test.info', { message: 'info message' });
      Logger.warning('test.warning', { message: 'warn message' });
      Logger.error('test.error', { message: 'error message' });

      const warnings = auditLogger.getEvents(4, 4); // RFC 5424: warning = level 4
      expect(warnings).toHaveLength(1);
      expect(warnings[0].eventName).toBe('test.warning');
    });

    test('clearBuffer empties the event buffer', () => {
      Logger.info('test.something');
      auditLogger.clearBuffer();

      const events = auditLogger.getEvents(6, 6); // RFC 5424: info = level 6
      expect(events).toHaveLength(0);
    });

    test('routes SYSTEM_ERROR to console.error (level 3)', () => {
      const errorSpy = jest.spyOn(console, 'error');
      Logger.error('SYSTEM_ERROR');

      expect(errorSpy).toHaveBeenCalledWith(
        '[ERROR] SYSTEM_ERROR',
        expect.objectContaining({ version: '2025-02-A' })
      );
    });

    test('includes version in all log payloads', () => {
      const spy = jest.spyOn(console, 'log');
      Logger.info('test.version_check');

      expect(spy).toHaveBeenCalledWith(
        '[INFO] test.version_check',
        expect.objectContaining({ version: '2025-02-A' })
      );
    });

    test('handles error with null via unknown type', () => {
      const spy = jest.spyOn(console, 'error');
      Logger.error('test.null_error', undefined);

      expect(spy).toHaveBeenCalledWith(
        '[ERROR] test.null_error',
        expect.any(Object)
      );
    });
  });
});
