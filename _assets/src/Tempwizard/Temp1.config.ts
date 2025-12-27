// src/tempwizard/TempPages/TempP1.config.ts
import type { TempPageConfig } from 'src/shared-types/temp-form';

const TempP1: TempPageConfig = {
  id: 'TEMP_P1',
  title: 'Stap 1 — Basis',
  fields: [
    { id: 'naam', label: 'Naam', type: 'text' },
    { id: 'leeftijd', label: 'Leeftijd', type: 'number' },
  ],
};

export default TempP1;
