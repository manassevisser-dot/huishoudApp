import type { FieldId, DomainValueProvider } from '@domain/core';
import { ValueProvider } from '@domain/interfaces/ValueProvider';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';

/**
 * ADAPTER LAYER: FormState → ValueProvider Façade
 * CU-F-MAP-Adapter: Normalisatie ZONDER domain FieldId explosie
 * Finance bedragen → items[] lookup via orchestrator
 */
export class FormStateValueProvider implements ValueProvider {
  constructor(private readonly domainProvider: DomainValueProvider) {}

  getValue(fieldId: string): unknown {
    const normalizedFieldId = this.normalizeFieldId(fieldId);
    if (normalizedFieldId === null) {
      Logger.warn('ADAPTER_UNKNOWN_FIELD_ID', { fieldId });
      return undefined;
    }
    return this.domainProvider.getValue(normalizedFieldId);
  }

  private normalizeFieldId(raw: string): FieldId | null {
    // 1. Strip 'data.'
    const clean = raw.replace(/^data\./, '');
    
    if (this.isFinanceItemKey(clean)) return null;
  
    // 2. Valideer of het in een bekende sectie zit OF een uitzondering is
    const isException = ['huurtoeslag', 'zorgtoeslag'].includes(clean);
    const hasValidSection = /^(setup|household|finance)\./.test(clean);
  
    if (isException || hasValidSection) {
      // 3. STRIP de sectie-prefix voor het domein ('setup.aantal' -> 'aantal')
      // Dit matcht nu met je FIELD_CONSTRAINTS_REGISTRY
      const flatFieldId = clean.replace(/^(setup|household|finance)\./, '');
      return flatFieldId as FieldId;
    }
    
    Logger.warn('ADAPTER_REJECTED_INVALID_PATH', { received: raw });
    return null;
  }

  /**
   * CU-F-MAP: Detect finance item keys (income/expenses)
   */
  private isFinanceItemKey(raw: string): boolean {
    const financeKeys = [
      'nettoSalaris', 'werkFrequentie',
      'wegenbelasting', 'lease', 'afschrijving',
      'kaleHuur', 'servicekosten', 'ozb', 'energieGas', 'water',
      'premie', 'ziektekostenPremie', 'telefoon', 'ov'
    ];
    
    return financeKeys.includes(raw) ||
           raw.startsWith('streaming_') ||
           raw.startsWith('uitkeringen.') ||
           raw.startsWith('toeslagen.');
  }
}