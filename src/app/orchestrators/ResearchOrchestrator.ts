// src/app/orchestrators/ResearchOrchestrator.ts
/**
 * @file_intent Coördineert de transformatie van reeds geparste transactiedata naar geanonimiseerde onderzoeksdata.
 * @repo_architecture Mobile Industry (MI) - Data Privacy & Analytics Layer.
 * @term_definition PrivacyAirlock = Domein-mechanisme dat garandeert dat er geen PII (Personally Identifiable Information) in de onderzoek-payload lekt.
 * @contract Accepteert een reeds geparste array van transacties (`CsvItem[]`). Bevat GEEN csv-parsing logica meer.
 * @ai_instruction De input voor `processAllData` is nu een `CsvItem[]` array. De `processCsvTransactions` methode is verwijderd omdat die logica nu in de `ImportOrchestrator` leeft.
 */


import { DATA_KEYS } from '@domain/constants/datakeys';
import { dataProcessor, type ResearchSetupData } from '@domain/finance/StatementIntakePipeline';
import {
  RawUIData,
  AnonymizedResearchPayload,
  CsvItem,
  FinancialIncomeSummary,
  ResearchMember,
} from '@core/types/research';
import {
  collectAndDistributeData,
  assertNoPIILeak,
  extractWijkLevelResearch,
} from '@domain/research/PrivacyAirlock';
import { FormStateOrchestrator } from './FormStateOrchestrator';
import { ResearchValidator } from '@adapters/validation/ResearchContractAdapter';

/* ============================================================
 * TYPES & INTERFACES
 * ============================================================ */

interface ProcessedMember {
  localMember: ResearchMember;
  researchPayload: AnonymizedResearchPayload;
}

export interface MasterProcessResult {
  local: {
    [DATA_KEYS.HOUSEHOLD]: { members: ResearchMember[] };
    [DATA_KEYS.FINANCE]: {
      transactions: CsvItem[];
      summary: FinancialIncomeSummary;
      hasMissingCosts: boolean;
    };
  };
  research: {
    memberPayloads: AnonymizedResearchPayload[];
    financialAnalytics: {
      totalIncomeCents: number;
      categoryTotals: Record<string, number>;
      timestamp: string;
      postcodeDigits: string;
    };
  };
}
// ─── Parameter object voor buildLocalResult (fixes max-params) ──
interface BuildLocalResultParams {
  processedMembers: ReadonlyArray<ProcessedMember>;
  csvTransactions: CsvItem[];
  incomeSummary: FinancialIncomeSummary;
  hasMissingCosts: boolean;
}
// ─── Parameter object voor buildResearchData (fixes max-params) ──
interface BuildResearchDataParams {
  processedMembers: ReadonlyArray<ProcessedMember>;
  transactions: ReadonlyArray<CsvItem>;
  incomeSummary: FinancialIncomeSummary;
  postcodeDigits: string;
}

/**
 * ResearchOrchestrator — stateless coördinator voor onderzoeksflow.
 * Werkt nu met een reeds geparste transactie-array.
 */
export class ResearchOrchestrator {
  constructor(private readonly fso: FormStateOrchestrator) {}

  public readonly processAllData = (
    rawMembers: RawUIData[],
    csvTransactions: CsvItem[],
    currentSetup: Record<string, unknown> | null,
  ): MasterProcessResult => {
    const membersToProcess = rawMembers ?? [];
    const processedMembers: ProcessedMember[] = membersToProcess.map((m, i) =>
      collectAndDistributeData(m, i),
    );
    return this.buildFinalResult(processedMembers, csvTransactions, currentSetup);
  };

  private readonly detectMissingHousingCosts = (
    transactions: CsvItem[],
    setup: Record<string, unknown> | null,
  ): boolean => {
    const housingIncluded = (setup as ResearchSetupData)?.housingIncluded;
    return transactions.some(
      (t) => t.category === 'Wonen' && housingIncluded !== true,
    );
  };

  // ─── Helper: berekent category totals (extracted voor max-lines) ─
  private readonly calculateCategoryTotals = (
    transactions: ReadonlyArray<CsvItem>,
  ): Record<string, number> => {
    return transactions.reduce((acc, curr) => {
      const cat = curr.category ?? '';
      const key = cat.length > 0 ? cat : 'Overig';
      const amount = ResearchValidator.validateMoney({
        amount: curr.amount,
        currency: 'EUR',
      }).amount;
      acc[key] = (acc[key] ?? 0) + amount;
      return acc;
    }, {} as Record<string, number>);
  };

  // ─── Method: bouwt research data (refactored: 1 param + helper) ─
  private readonly buildResearchData = (
    params: BuildResearchDataParams,
  ): MasterProcessResult['research'] => {
    const { processedMembers, transactions, incomeSummary, postcodeDigits } = params;
    const categoryTotals = this.calculateCategoryTotals(transactions);

    return {
      memberPayloads: processedMembers.map((p) => p.researchPayload),
      financialAnalytics: {
        totalIncomeCents: ResearchValidator.validateMoney({
          amount: incomeSummary.finalIncome,
          currency: 'EUR',
        }).amount,
        categoryTotals,
        timestamp: new Date().toISOString(),
        postcodeDigits,
      },
    };
  };

  // ─── Helper: extraheert postcode digits uit state (extracted) ───
  private readonly extractPostcodeDigits = (): string => {
    const postcodeRaw = (this.fso.getState().data.setup as Record<string, unknown>)?.postcode ?? '';
    return extractWijkLevelResearch(String(postcodeRaw));
  };

  // ─── Helper: bouwt local result object (extracted voor max-lines) ─
 private readonly buildLocalResult = (
  params: BuildLocalResultParams,
): MasterProcessResult['local'] => ({
  [DATA_KEYS.HOUSEHOLD]: {
    members: params.processedMembers.map((p) => p.localMember),
  },
  [DATA_KEYS.FINANCE]: {
    transactions: params.csvTransactions,
    summary: params.incomeSummary,
    hasMissingCosts: params.hasMissingCosts,
  },
  });

  // ─── Method: bouwt final result (refactored: gebruikt helpers) ──
  private readonly buildFinalResult = (
    processedMembers: ReadonlyArray<ProcessedMember>,
    csvTransactions: CsvItem[],
    currentSetup: Record<string, unknown> | null,
  ): MasterProcessResult => {
    const incomeSummary = dataProcessor.reconcileWithSetup(
      csvTransactions,
      currentSetup ?? {},
    ) as FinancialIncomeSummary;

    const postcodeDigits = this.extractPostcodeDigits();
    
    const researchData = this.buildResearchData({
      processedMembers,
      transactions: csvTransactions,
      incomeSummary,
      postcodeDigits,
    });

    assertNoPIILeak(researchData as unknown as Record<string, unknown>);

    const hasMissingCosts = this.detectMissingHousingCosts(csvTransactions, currentSetup);
    const localData = this.buildLocalResult({
  processedMembers,
  csvTransactions,
  incomeSummary,
  hasMissingCosts,
});

    return { local: localData, research: researchData };
  };
}

export const researchIntakeCoordinator = (fso: FormStateOrchestrator) =>
  new ResearchOrchestrator(fso);

export default ResearchOrchestrator;