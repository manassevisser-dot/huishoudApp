// External façade for consumers outside domain (UI/adapters)
// Accepts string fieldIds, normalizes internally to FieldId
export interface ValueProvider {
  getValue(fieldId: string): unknown;
}