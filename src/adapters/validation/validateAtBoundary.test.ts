// ---- SUT import (pad aanpassen indien nodig) ----
import {
    validateAtBoundary,
    validateAtBoundaryBatch,
    safeParseAtBoundary,
  } from '@adapters/validation/validateAtBoundary'; // <= wijzig dit pad indien je test elders staat
  
  // Zod wordt gebruikt in de mock
  import { z } from 'zod';
  
  // ---- Mocks ----

  // Mock de schema-collectie precies zoals SUT het importeert
  jest.mock('@adapters/validation/formStateSchema', () => {
    const { z } = jest.requireActual('zod');
    return {
      FieldSchemas: {
        // Succes: string → int ≥ 0
        aantalMensen: z.coerce.number().int().min(0, { message: 'Waarde moet een getal ≥ 0 zijn.' }),
        // Succes: trim + required
        naam: z.string().trim().min(1, { message: 'Naam is verplicht.' }),
        // Altijd ZodError (nummer minimaal 10)
        alwaysInvalid: z.number({ required_error: 'Nummer verplicht' }).min(10, { message: 'Minimaal 10' }),
        // Niet-Zod error
        faulty: { parse: () => { throw new Error('NonZod boom'); } },
      },
    };
  });
  
  // Mock de logger precies zoals SUT het importeert
  const mockWarnSpy = jest.fn();
  const mockErrorSpy = jest.fn();
  
  jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
    Logger: {
      // Gebruik nu de variabelen met de 'mock' prefix
      warn: (...args: any[]) => mockWarnSpy(...args),
      error: (...args: any[]) => mockErrorSpy(...args),
    },
  }));
  
  describe('validateAtBoundary module', () => {
    beforeEach(() => {
      mockWarnSpy.mockClear();
      mockErrorSpy.mockClear();
    });
  
    describe('validateAtBoundary', () => {
      it('geeft success met geparste data (coercion & int)', () => {
        const result = validateAtBoundary<number>('aantalMensen', '5');
        expect(result).toEqual({ success: true, data: 5 });
        expect(mockWarnSpy).not.toHaveBeenCalled();
        expect(mockErrorSpy).not.toHaveBeenCalled();
      });
  
      it('trimt strings via schema en valideert', () => {
        const result = validateAtBoundary<string>('naam', '  Manasse  ');
        expect(result).toEqual({ success: true, data: 'Manasse' });
        expect(mockWarnSpy).not.toHaveBeenCalled();
        expect(mockErrorSpy).not.toHaveBeenCalled();
      });
  
      it('onbekend veld: logt warn en passt waarde door', () => {
        const payload = { x: 1 };
        const result = validateAtBoundary<typeof payload>('onbekendVeld', payload);
        expect(result).toEqual({ success: true, data: payload });
        expect(mockWarnSpy).toHaveBeenCalledWith('BOUNDARY_NO_SCHEMA', {
          fieldId: 'onbekendVeld',
          value: payload,
        });
        expect(mockErrorSpy).not.toHaveBeenCalled();
      });
  
      it('ZodError: pakt eerste issue message, logt warn met issues', () => {
        const result = validateAtBoundary<number>('alwaysInvalid', 3);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe('Minimaal 10');
        }
        expect(mockWarnSpy).toHaveBeenCalledTimes(1);
        const [event, details] = mockWarnSpy.mock.calls[0];
        expect(event).toBe('BOUNDARY_VALIDATION_FAILED');
        expect(details.fieldId).toBe('alwaysInvalid');
        expect(Array.isArray(details.issues)).toBe(true);
        expect(mockErrorSpy).not.toHaveBeenCalled();
      });
  
      it('onverwachte fout (geen ZodError): logt error en geeft generieke boodschap', () => {
        const result = validateAtBoundary<never>('faulty', 'any');
        expect(result).toEqual({ success: false, error: 'Onverwachte validatie fout' });
        expect(mockErrorSpy).toHaveBeenCalledWith('BOUNDARY_UNEXPECTED_ERROR', {
          fieldId: 'faulty',
          value: 'any',
          error: expect.any(Error),
        });
        expect(mockWarnSpy).not.toHaveBeenCalled();
      });
    });
  
    describe('validateAtBoundaryBatch', () => {
      it('valideert meerdere velden en geeft geparste map terug', () => {
        const result = validateAtBoundaryBatch({ aantalMensen: '7', naam: '  Test  ' });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({ aantalMensen: 7, naam: 'Test' });
        }
        expect(mockWarnSpy).not.toHaveBeenCalled();
        expect(mockErrorSpy).not.toHaveBeenCalled();
      });
  
      it('stopt bij eerste fout en voegt fieldId toe aan foutboodschap', () => {
        const result = validateAtBoundaryBatch({
          naam: '  ',           // -> "Naam is verplicht."
          aantalMensen: '9',    // zou slagen, maar komt hier niet meer
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe('naam: Naam is verplicht.');
        }
        expect(mockWarnSpy).toHaveBeenCalledTimes(1);
      });
    });
  
    describe('safeParseAtBoundary', () => {
      it('geeft de geparste waarde terug bij succes', () => {
        const v = safeParseAtBoundary<number>('aantalMensen', '12');
        expect(v).toBe(12);
      });
  
      it('geeft undefined bij fout', () => {
        const v = safeParseAtBoundary<number>('alwaysInvalid', 1);
        expect(v).toBeUndefined();
      });
  
      it('onbekend veld: geeft originele waarde terug en logt warn', () => {
        const v = safeParseAtBoundary<any>('nietBekend', { a: 1 });
        expect(v).toEqual({ a: 1 });
        expect(mockWarnSpy).toHaveBeenCalledWith('BOUNDARY_NO_SCHEMA', {
          fieldId: 'nietBekend',
          value: { a: 1 },
        });
      });
    });
  });