// src/shared-types/temp-form.ts

/** Mogelijke veldtypes voor de tijdelijke wizard */
export type TempFieldType = 'text' | 'number' | 'select' | 'date' | 'toggle' | 'currency';

/** Configuratie van één invoerveld */
export interface TempFieldConfig {
  id: string; // unieke sleutel van het veld
  label: string; // zichtbaar label
  type: TempFieldType; // type van input
  defaultValue?: string | number | boolean | null;
  required?: boolean; // optioneel: validatie
}

/** Configuratie van één wizardpagina */
export interface TempPageConfig {
  id: string; // unieke pagina-id (bv. 'TEMP_P1')
  title: string; // titel van de pagina
  fields: TempFieldConfig[]; // lijst met velden
  description?: string; // optioneel extra info
}
