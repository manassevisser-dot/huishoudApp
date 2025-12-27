// src/tempwizard/TempPages/TempP2.config.ts
import type { TempPageConfig } from 'src/shared-types/temp-form';

const TempP2: TempPageConfig = {
  id: 'TEMP_P2',
  title: 'Stap 2 — Contact',
  fields: [
    { id: 'email', label: 'E-mail', type: 'text' },
    { id: 'telefoon', label: 'Telefoon', type: 'text' },
  ],
};

export default TempP2;
