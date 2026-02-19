import { logger, Logger, AuditLogger, auditLogger } from '@adapters/audit/AuditLoggerAdapter';

describe('audit logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('info method', () => {
    test('logs info message without data', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.info('Test info message');

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"Test info message"')
      );
      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"level":"info"')
      );
    });

    test('logs info message with data', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.info('Test info', { key: 'value' });

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"key":"value"')
      );
    });

    test('logs info with undefined data', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.info('Message', undefined);

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"Message"')
      );
    });
  });

  describe('error method', () => {
    test('logs error message without error object', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.error('Error occurred');

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"level":"error"')
      );
    });

    test('logs error message with Error object', () => {
      const spy = jest.spyOn(console, 'warn');
      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"Test error"')
      );
      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"stack":')
      );
    });

    test('logs error with string as second arg', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.error('Failed', 'Something went wrong');

      // Bridge: err is not an Error, msg is not an Error, so errorObj = new Error(String(msg))
      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"Failed"')
      );
      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"msg":"Failed"')
      );
    });

    test('logs error with undefined', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.error('Failed', undefined);

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"Failed"')
      );
    });

    test('logs error with Error as first arg', () => {
      const spy = jest.spyOn(console, 'warn');
      const error = new Error('Direct error');
      logger.error(error);

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"Direct error"')
      );
    });
  });

  describe('warn method', () => {
    test('logs warning without data', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.warn('Warning message');

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"level":"warning"')
      );
      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"Warning message"')
      );
    });

    test('logs warning with data object', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.warn('Warning', { warning: 'details' });

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"warning":"details"')
      );
    });
  });

  describe('log method', () => {
    test('logs with single argument', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.log('ERROR');

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"ERROR"')
      );
    });

    test('logs with string and string', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.log('INIT', 'Initialization complete');

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"Initialization complete"')
      );
    });

    test('logs with string and object', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.log('UPDATE', { userId: 123, action: 'save' });

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"userId":123')
      );
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
    test('handles empty string message', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.info('');

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":""')
      );
    });

    test('handles complex nested objects', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.info('Complex', {
        nested: { deep: { value: 123 } },
        array: [1, 2, 3],
      });

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"value":123')
      );
      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('[1,2,3]')
      );
    });
    test('getEventsByLevel filters by level', () => {
      auditLogger.clearBuffer();
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');
    
      const warnings = auditLogger.getEventsByLevel('warning');
      expect(warnings).toHaveLength(1);
      expect(warnings[0].message).toBe('warn message');
    });
    
    test('clearBuffer empties the event buffer', () => {
      logger.info('something');
      auditLogger.clearBuffer();
    
      const events = auditLogger.getEventsByLevel('info');
      expect(events).toHaveLength(0);
    });
    test('routes SYSTEM_ERROR to ticketing and upgrades to fatal', () => {
      const warnSpy = jest.spyOn(console, 'warn');
      const errorSpy = jest.spyOn(console, 'error');
      
      logger.error('SYSTEM_ERROR');
    
      expect(errorSpy).toHaveBeenCalledWith(
        '!!! TICKETING/MAIL ALERT !!!',
        expect.objectContaining({ level: 'fatal' })
      );
      expect(warnSpy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"level":"fatal"')
      );
    });
    test('translates known validation message path', () => {
      const spy = jest.spyOn(console, 'warn');
      logger.info('setup.aantalMensen.required');
    
      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"originalCode":"setup.aantalMensen.required"')
      );
      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"vul in"')
      );
    });

    test('handles error with null via unknown type', () => {
      const spy = jest.spyOn(console, 'warn');
      // error() accepteert unknown als tweede arg
      logger.error('Null error', null);

      expect(spy).toHaveBeenCalledWith(
        '[AUDIT]',
        expect.stringContaining('"message":"Null error"')
      );
    });
  });
});