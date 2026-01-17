import { logger, Logger, AuditLogger } from '../../utils/audit/logger';

describe('audit logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('info method', () => {
    test('logs info message without data', () => {
      const spy = jest.spyOn(console, 'log');
      logger.info('Test info message');
      expect(spy).toHaveBeenCalledWith('Test info message', '');
    });

    test('logs info message with data', () => {
      const spy = jest.spyOn(console, 'log');
      const data = { key: 'value' };
      logger.info('Test info', data);
      expect(spy).toHaveBeenCalledWith('Test info', data);
    });

    test('logs info with undefined data (defaults to empty string)', () => {
      const spy = jest.spyOn(console, 'log');
      logger.info('Message', undefined);
      expect(spy).toHaveBeenCalledWith('Message', '');
    });
  });

  describe('error method', () => {
    test('logs error message without error object', () => {
      const spy = jest.spyOn(console, 'error');
      logger.error('Error occurred');
      expect(spy).toHaveBeenCalledWith('Error occurred', '');
    });

    test('logs error message with error object', () => {
      const spy = jest.spyOn(console, 'error');
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      expect(spy).toHaveBeenCalledWith('Error occurred', error);
    });

    test('logs error with string error', () => {
      const spy = jest.spyOn(console, 'error');
      logger.error('Failed', 'Something went wrong');
      expect(spy).toHaveBeenCalledWith('Failed', 'Something went wrong');
    });

    test('logs error with undefined (defaults to empty string)', () => {
      const spy = jest.spyOn(console, 'error');
      logger.error('Failed', undefined);
      expect(spy).toHaveBeenCalledWith('Failed', '');
    });
  });

  describe('warn method', () => {
    test('logs warning without data', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.warn('Warning message');
      expect(spy).toHaveBeenCalledWith('Warning message', undefined);
    });

    test('logs warning with data', () => {
      const spy = jest.spyOn(console, 'warn');
      const data = { warning: 'details' };
      logger.warn('Warning', data);
      expect(spy).toHaveBeenCalledWith('Warning', data);
    });

    test('logs warning with string data', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.warn('Deprecated', 'Use new API instead');
      expect(spy).toHaveBeenCalledWith('Deprecated', 'Use new API instead');
    });
  });

  describe('log method (audit log)', () => {
    test('logs with level and message', () => {
      const spy = jest.spyOn(console, 'log');
      logger.log('INIT', 'Initialization complete');
      expect(spy).toHaveBeenCalledWith('[AUDIT-INIT]', 'Initialization complete');
    });

    test('logs with level, message and args', () => {
      const spy = jest.spyOn(console, 'log');
      logger.log('UPDATE', 'User updated', { userId: 123 }, 'ADR-5');
      expect(spy).toHaveBeenCalledWith('[AUDIT-UPDATE]', 'User updated', { userId: 123 }, 'ADR-5');
    });

    test('logs with level only (msg defaults to empty string)', () => {
      const spy = jest.spyOn(console, 'log');
      logger.log('ERROR');
      expect(spy).toHaveBeenCalledWith('[AUDIT-ERROR]', '');
    });

    test('logs with multiple args', () => {
      const spy = jest.spyOn(console, 'log');
      logger.log('TRANSACTION', 'Payment', 100, 'USD', { method: 'card' });
      expect(spy).toHaveBeenCalledWith('[AUDIT-TRANSACTION]', 'Payment', 100, 'USD', {
        method: 'card',
      });
    });

    test('logs different audit levels', () => {
      const spy = jest.spyOn(console, 'log');

      logger.log('CREATE', 'Created ADR');
      expect(spy).toHaveBeenCalledWith('[AUDIT-CREATE]', 'Created ADR');

      logger.log('DELETE', 'Deleted ADR');
      expect(spy).toHaveBeenCalledWith('[AUDIT-DELETE]', 'Deleted ADR');

      logger.log('RESTORE', 'Restored ADR');
      expect(spy).toHaveBeenCalledWith('[AUDIT-RESTORE]', 'Restored ADR');

      logger.log('VALIDATION', 'Validation failed');
      expect(spy).toHaveBeenCalledWith('[AUDIT-VALIDATION]', 'Validation failed');
    });
  });

  describe('exports', () => {
    test('logger export works', () => {
      expect(logger).toBeDefined();
      expect(logger.info).toBeInstanceOf(Function);
      expect(logger.error).toBeInstanceOf(Function);
      expect(logger.warn).toBeInstanceOf(Function);
      expect(logger.log).toBeInstanceOf(Function);
    });

    test('Logger export (capitalized) works', () => {
      expect(Logger).toBeDefined();
      expect(Logger).toBe(logger);
    });

    test('AuditLogger export works', () => {
      expect(AuditLogger).toBeDefined();
      expect(AuditLogger).toBe(logger);
    });

    test('all exports reference same instance', () => {
      expect(logger).toBe(Logger);
      expect(Logger).toBe(AuditLogger);
    });
  });

  describe('edge cases', () => {
    test('handles null data in info', () => {
      const spy = jest.spyOn(console, 'log');
      logger.info('Null test', null);
      expect(spy).toHaveBeenCalledWith('Null test', '');
    });

    test('handles null error in error', () => {
      const spy = jest.spyOn(console, 'error');
      logger.error('Null error', null);
      expect(spy).toHaveBeenCalledWith('Null error', '');
    });

    test('handles empty string message', () => {
      const spy = jest.spyOn(console, 'log');
      logger.info('');
      expect(spy).toHaveBeenCalledWith('', '');
    });

    test('handles complex objects', () => {
      const spy = jest.spyOn(console, 'log');
      const complexObj = {
        nested: { deep: { value: 123 } },
        array: [1, 2, 3],
        fn: () => 'test',
      };
      logger.info('Complex', complexObj);
      expect(spy).toHaveBeenCalledWith('Complex', complexObj);
    });

    test('handles arrays as data', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.warn('Array warning', [1, 2, 3, 4]);
      expect(spy).toHaveBeenCalledWith('Array warning', [1, 2, 3, 4]);
    });

    test('log handles no args (rest parameter)', () => {
      const spy = jest.spyOn(console, 'log');
      logger.log('TEST');
      expect(spy).toHaveBeenCalledWith('[AUDIT-TEST]', '');
    });

    test('log handles empty string as message', () => {
      const spy = jest.spyOn(console, 'log');
      logger.log('TEST', '');
      expect(spy).toHaveBeenCalledWith('[AUDIT-TEST]', '');
    });
  });
});
