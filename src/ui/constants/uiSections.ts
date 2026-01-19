export const UI_SECTIONS = {
    HOUSEHOLD_SETUP: 'household_setup',
    HOUSEHOLD_DETAILS: 'household_details',
    INCOME_DETAILS: 'income_details',
    FIXED_EXPENSES: 'fixed_expenses',
    CSV_UPLOAD: 'csv_upload',
  } as const;
  
  export type UISection = keyof typeof UI_SECTIONS;