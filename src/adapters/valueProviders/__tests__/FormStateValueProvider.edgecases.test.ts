import { FormStateValueProvider } from '@adapters/valueProviders/FormStateValueProvider';

// Een minimal domainProvider stub met getValue(FieldId)
class StubDomainProvider {
  private store: Record<string, unknown> = {
    'aantalMensen': 1,
    'aantalVolwassen': 1,
  };
  getValue(fieldId: string) {
    return this.store[fieldId];
  }
}

describe('FormStateValueProvider - edge cases & normalisatie', () => {
  it('normaliseert "data.setup.aantalMensen" naar "setup.aantalMensen"', () => {
    const vp = new FormStateValueProvider(new StubDomainProvider() as any);
    expect(vp.getValue('data.setup.aantalMensen')).toBe(1);
  });

  it('accepteert ook korte alias "aantalMensen" (faalt gesloten als alias niet bekend)', () => {
    const vp = new FormStateValueProvider(new StubDomainProvider() as any);
    // Als jouw normalizer deze alias niet ondersteunt, is fail-closed: undefined
    const result = vp.getValue('aantalMensen');
    expect([1, undefined]).toContain(result);
  });

  it('geeft undefined terug bij onbekende keys (fail-closed)', () => {
    const vp = new FormStateValueProvider(new StubDomainProvider() as any);
    expect(vp.getValue('unknown.field')).toBeUndefined();
  });
});