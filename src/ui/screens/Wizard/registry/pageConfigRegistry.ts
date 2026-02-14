// src/ui/screens/Wizard/pageConfigRegistry.ts
import { setupHouseholdConfig }  from '@ui/screens/Wizard/pages/1setupHousehold.config';
import { detailsHouseholdConfig } from '@ui/screens/Wizard/pages/2detailsHousehold.config';
import { incomeDetailsConfig }    from '@ui/screens/Wizard/pages/3incomeDetails.config';
import { fixedExpensesConfig }    from '@ui/screens/Wizard/pages/4fixedExpenses.config';
import type { WizardPageConfig }  from '@ui/screens/Wizard/WizardPage';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';

const PAGE_CONFIGS: Record<string, WizardPageConfig> = {
  '1setupHousehold':   setupHouseholdConfig,
  '2detailsHousehold': detailsHouseholdConfig,
  '3incomeDetails':    incomeDetailsConfig,
  '4fixedExpenses':    fixedExpensesConfig,
};

export const getPageConfig = (pageId: string): WizardPageConfig => {
    const config = PAGE_CONFIGS[pageId];
    if (config === undefined) {
      Logger.warn('PAGE_CONFIG_MISS', { pageId });
    }
    return config ?? PAGE_CONFIGS['1setupHousehold'];
  };