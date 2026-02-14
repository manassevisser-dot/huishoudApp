// External façade for consumers outside domain (UI/adapters)
export interface ValueProvider {
  getValue(fieldId: string): unknown;
}