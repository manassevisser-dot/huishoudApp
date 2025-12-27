// bv. src/ui/screens/TempWizardScreen.tsx
import React from 'react';
import TempWizardController from '../Tempwizard/TempWizardController';
import { TEMP_PAGES } from '../Tempwizard/index';
import { logger } from '../services/logger';
export default function TempWizardScreen() {
  return (
    <TempWizardController
      pages={TEMP_PAGES}
      initialIndex={0}
      onFinish={() => {
        // tijdelijk: log of navigate
        logger.info('TempWizard klaar!');
      }}
    />
  );
}
