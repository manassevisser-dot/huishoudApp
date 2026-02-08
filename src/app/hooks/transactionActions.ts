// src/app/hooks/transactionActions.ts
import { MoneySchema } from '@core/types/research';
import { StatefulTransactionAdapter } from '@adapters/transaction/stateful';

export const executeUpdateAction = (
  adapter: StatefulTransactionAdapter,
  inputValue: number,
  parts: number
): void => {
  MoneySchema.parse({ amount: inputValue, currency: 'EUR' });

  const distribution = adapter.calculateDistribution(inputValue, parts);
  const current = adapter.getCurrentState() ?? {};

  adapter.push({ 
    ...current, 
    distribution, 
    lastUpdated: new Date().toISOString() 
  }, 'USER_UPDATE');
};