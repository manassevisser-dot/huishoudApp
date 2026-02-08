import { DATA_KEYS } from '@domain/constants/datakeys';
import { csvService } from '@adapters/csv/csvService';
import { dataProcessor } from '@domain/finance/StatementIntakePipeline.WIP'; 
import { Member } from '@core/types/core';
import {
  RawUIData,
  AnonymizedResearchPayload, // De nieuwe naam
  CsvItem,
  FinancialIncomeSummary,
} from '@core/types/research';
import {
  collectAndDistributeData,
  assertNoPIILeak,
} from '@domain/research/PrivacyAirlock.WIP'; 
import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import { FormStateOrchestrator } from './FormStateOrchestrator';

/* ============================================================
 * TYPES & INTERFACES
 * ============================================================ */

// Punt 3 audit: Herstel typing van processed members
type ProcessedMember = ReturnType<typeof collectAndDistributeData>;

export interface MasterProcessResult {
  local: {
    [DATA_KEYS.HOUSEHOLD]: { members: Member[] };
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
    };
  };
}

/**
 * ResearchOrchestrator — stateless coördinator voor onderzoeksflow.
 * Punt 4 audit: DI van fso is gereserveerd voor toekomstige state-checks (WIP).
 */
export class ResearchOrchestrator {
  constructor(private readonly fso: FormStateOrchestrator) {}

  public readonly processAllData = (
    rawMembers: RawUIData[],
    rawCsv: string,
    currentSetup: Record<string, unknown> | null,
  ): MasterProcessResult => {
    const membersToProcess = rawMembers ?? [];
    // Punt 3: Expliciete typing ipv any
    const processedMembers: ProcessedMember[] = membersToProcess.map((m, i) => 
      collectAndDistributeData(m, i)
    );
    const csvTransactions = this.processCsvTransactions(rawCsv);

    return this.buildFinalResult(processedMembers, csvTransactions, currentSetup);
  };

  private readonly processCsvTransactions = (rawCsv: string): CsvItem[] => {
    if (rawCsv.length === 0 || rawCsv.trim() === '') {
      return [];
    }

    try {
      const rawMapped = csvService.mapToInternalModel(rawCsv);
      const mapped = (rawMapped ?? []) as CsvItem[];

      return mapped.map((item) => {
        const rawDate = item.date ?? '';
        const date = rawDate.length > 0 ? rawDate : new Date().toISOString();
        
        const rawDesc = item.description ?? '';
        const description = dataProcessor.stripPII(
          rawDesc.length > 0 ? rawDesc : 'Geen omschrijving'
        );
        
        return {
          ...item,
          date,
          description,
          // Punt 6 audit: Categoriseer op de gestripte description voor consistentie
          category: dataProcessor.categorize(description),
        };
      }).filter((tx) => tx.amount !== 0);
    } catch (e) {
      Logger.error('CSV Mapping failed in ResearchOrchestrator', e);
      return [];
    }
  };

  private readonly detectMissingHousingCosts = (
    transactions: CsvItem[],
    setup: Record<string, unknown> | null,
  ): boolean => {
    const housingIncluded = setup?.housingIncluded;
    return transactions.some(
      (t) => t.category === 'Wonen' && housingIncluded !== true,
    );
  };

  private readonly buildResearchData = (
    processedMembers: ReadonlyArray<ProcessedMember>,
    transactions: ReadonlyArray<CsvItem>,
    incomeSummary: FinancialIncomeSummary,
  ): MasterProcessResult['research'] => {
    const categoryTotals = transactions.reduce((acc, curr) => {
      const cat = curr.category ?? '';
      const key = cat.length > 0 ? cat : 'Overig';
      const amount = typeof curr.amount === 'number' ? curr.amount : 0;
      acc[key] = (acc[key] ?? 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      memberPayloads: processedMembers.map((p) => p.researchPayload),
      financialAnalytics: {
        totalIncomeCents: typeof incomeSummary.finalIncome === 'number' ? incomeSummary.finalIncome : 0,
        categoryTotals,
        timestamp: new Date().toISOString(),
      },
    };
  };

  private readonly buildFinalResult = (
    processedMembers: ReadonlyArray<ProcessedMember>,
    csvTransactions: CsvItem[],
    currentSetup: Record<string, unknown> | null
  ): MasterProcessResult => {
    const incomeSummary = dataProcessor.reconcileWithSetup(
      csvTransactions,
      currentSetup ?? {},
    ) as FinancialIncomeSummary;

    const researchData = this.buildResearchData(processedMembers, csvTransactions, incomeSummary);

    assertNoPIILeak(researchData as unknown as Record<string, unknown>);

    return {
      local: {
        [DATA_KEYS.HOUSEHOLD]: {
          members: processedMembers.map((p) => p.localMember),
        },
        [DATA_KEYS.FINANCE]: {
          transactions: csvTransactions,
          summary: incomeSummary,
          hasMissingCosts: this.detectMissingHousingCosts(csvTransactions, currentSetup),
        },
      },
      research: researchData,
    };
  };
}

/* ============================================================
 * PUNT 2 AUDIT: COMPATIBILITY LAYER
 * ============================================================ */

/**
 * Factory voor zachte migratie (Option A uit audit).
 * Voorkomt dat bestaande tests/orchestrators direct omvallen.
 */
export const researchIntakeCoordinator = (fso: FormStateOrchestrator) => 
  new ResearchOrchestrator(fso);

// Named export voor de klasse zelf
export default ResearchOrchestrator;