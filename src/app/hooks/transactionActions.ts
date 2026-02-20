// src/app/hooks/transactionActions.ts
/**
 * @file_intent Handelt specifieke UI-transacties af door validatie, berekening en state-mutatie te orchestreren.
 * @repo_architecture Mobile Industry (MI) - Business Logic / Hook Layer.
 * @term_definition distribution = De verdeling van een totaalbedrag over meerdere termijnen. executeUpdateAction = Een command-pattern actie die de tijdlijn van de transactie bijwerkt.
 * @contract Verbindt de ResearchValidator met de StatefulTransactionAdapter. Dwingt validatie af voordat een nieuwe state naar de geschiedenis-stack wordt gepusht.
 * @ai_instruction Deze hook is verantwoordelijk voor het 'USER_UPDATE' event-type. Zorg ervoor dat alle numerieke invoer eerst door de validateMoney check gaat om integriteit in de transaction-stack te waarborgen.
 */
import { ResearchValidator } from '@adapters/validation/ResearchContractAdapter';
import { StatefulTransactionAdapter } from '@adapters/transaction/stateful';

export const executeUpdateAction = (
  adapter: StatefulTransactionAdapter,
  inputValue: number,
  parts: number
): void => {
  ResearchValidator.validateMoney({ amount: inputValue, currency: 'EUR' });

  const distribution = adapter.calculateDistribution(inputValue, parts);
  const current = adapter.getCurrentState() ?? {};

  adapter.push({ 
    ...current, 
    distribution, 
    lastUpdated: new Date().toISOString() 
  }, 'USER_UPDATE');
};