// src/app/orchestrators/__tests__/orchestrator.contract.test.ts

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { MasterOrchestrator } from '@app/orchestrators/MasterOrchestrator';
import { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator.WIP';
import { VisibilityOrchestrator } from '@app/orchestrators/VisibilityOrchestrator';

// 1) Mock de validator
jest.mock('@adapters/validation/validateAtBoundary', () => ({
  validateAtBoundary: jest.fn(),
}));
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';

// 2) Mock de Data- en Business-bronnen die door managers worden gebruikt
jest.mock('@app/orchestrators/ImportOrchestrator', () => ({
  ImportOrchestrator: {
    processCsvImport: jest.fn(() => ({ transactions: [1, 2, 3], summary: { isDiscrepancy: false } })),
  },
}));
import { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';

jest.mock('@app/orchestrators/FinancialOrchestrator', () => ({
  FinancialOrchestrator: {
    prepareViewModel: jest.fn(() => ({
      totalIncomeDisplay: '€1000',
      totalExpensesDisplay: '€800',
      netDisplay: '€200',
    })),
  },
}));
import { FinancialOrchestrator } from '@app/orchestrators/FinancialOrchestrator';

describe('MasterOrchestrator (façade contract) — huidige ctor & API', () => {
  const fakeState = { data: { household: { members: [] }, setup: {}, transactions: [] } };
  const dispatch = jest.fn();
  const fso = new FormStateOrchestrator(() => fakeState as any, dispatch);

  const research = new ResearchOrchestrator(fso);
  const visibility = new VisibilityOrchestrator(fso);
  const styles = {}; // jouw styles-object; kan later getypt worden

  let master: MasterOrchestrator;

  beforeEach(() => {
    jest.clearAllMocks();
    master = new MasterOrchestrator(fso, research, visibility, styles);
  });

  it('updateField() delegatie: validate → fso.update → financial summary → dispatch', () => {
    // arrange
    (validateAtBoundary as jest.Mock).mockReturnValue({ success: true, data: 123 });

    // act
    master.updateField('nettoSalaris', 123);

    // assert
    expect(validateAtBoundary).toHaveBeenCalledWith('nettoSalaris', 123);
    expect(FinancialOrchestrator.prepareViewModel).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled(); // Master dispatch't na summary
  });

  it('handleCsvImport() delegatie: Import.process → fso.update → financial summary → dispatch', async () => {
    // act
    await master.handleCsvImport('a,b,c');

    // assert
    expect(ImportOrchestrator.processCsvImport).toHaveBeenCalled();
    expect(FinancialOrchestrator.prepareViewModel).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled(); // na fso.update + summary
  });
});