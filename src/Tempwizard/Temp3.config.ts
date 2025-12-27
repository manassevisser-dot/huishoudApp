// src/tempwizard/TempPages/TempP3.config.ts
import type { TempPageConfig } from 'src/shared-types/temp-form';

const TempP3: TempPageConfig = {
  id: 'TEMP_P3',
  title: 'Stap 3 — Opties',
  fields: [
    { id: 'nieuwsbrief', label: 'Nieuwsbrief', type: 'toggle', defaultValue: false },
    { id: 'pakket', label: 'Pakket', type: 'select', defaultValue: 'Basis' },
  ],
};

export default TempP3;
