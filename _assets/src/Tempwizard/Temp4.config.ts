// src/tempwizard/TempPages/TempP4.config.ts
import type { TempPageConfig } from 'src/shared-types/temp-form';

const TempP4: TempPageConfig = {
  id: 'TEMP_P4',
  title: 'Stap 4 — Overzicht',
  fields: [{ id: 'opmerking', label: 'Opmerking', type: 'text' }],
};

export default TempP4;
