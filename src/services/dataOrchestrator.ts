import { DATA_KEYS } from '@domain/constants/datakeys';
import { csvService } from './csvService';
import { dataProcessor } from './dataProcessor';
import {
  Member,
  RawUIData,
  ResearchPayload,
  CsvItem,
  FinancialIncomeSummary
} from '@domain/types';
import {
  collectAndDistributeData,
  assertNoPIILeak
} from '@services/privacyHelpers';

/* ============================================================
 * TYPES & INTERFACES
 * ============================================================ */

export interface MasterProcessResult {
  /** Laag A: Voor de UI (Lokaal, bevat PII) */
  local: {
    [DATA_KEYS.HOUSEHOLD]: {
      members: Member[];
    };
    [DATA_KEYS.FINANCE]: {
      transactions: CsvItem[];
      summary: FinancialIncomeSummary;
      hasMissingCosts: boolean;
    };
  };
  /** Laag B: Voor onderzoek (Geanonimiseerd, VEILIG) */
  research: {
    memberPayloads: ResearchPayload[];
    financialAnalytics: {
      totalIncomeCents: number;
      categoryTotals: Record<string, number>;
      timestamp: string;
    };
  };
}

/* ============================================================
 * MASTER ORCHESTRATOR
 * ============================================================ */

export const dataOrchestrator = {
  /**
   * Verwerkt zowel handmatige input (leden) als bank-CSV data.
   * Past de 'Wasstraat-methode' toe: Filteren -> Strippen -> Categoriseren.
   */
  processAllData: (
    rawMembers: RawUIData[],
    rawCsv: string,
    currentSetup: any
  ): MasterProcessResult => {

    // --- 1. VERWERK LEDEN (Privacy Sluis) ---
    const processedMembers = (rawMembers || []).map((m, i) =>
      collectAndDistributeData(m, i)
    );

    // --- 2. VERWERK CSV (Met Kwaliteitsfilter & PII Strip) ---
    let csvTransactions: CsvItem[] = [];

    try {
      // Haal ruwe mapping uit de service
      const mapped = (csvService.mapToInternalModel(rawCsv) || []) as CsvItem[];

      csvTransactions = mapped
        .map((item: CsvItem) => ({
          ...item,
          // Garandeer datagegevens en anonimiteit
          date: item.date || new Date().toISOString(),
          description: dataProcessor.stripPII(item.description || 'Geen omschrijving'),
          category: dataProcessor.categorize(item.description || '')
        }))
        // HET KWALITEITSFILTER: Verwijder lege regels of 0-euro ruis
        .filter(tx => {
          const hasAmount = tx.amount !== 0;
          const hasValidDesc = tx.description !== 'Geen omschrijving' && tx.description.trim() !== '';
          return hasAmount && hasValidDesc;
        });

    } catch (e) {
      console.error('CSV Mapping failed in Orchestrator', e);
      csvTransactions = [];
    }

    // --- 3. RECONCILIATIE & ANALYSE ---
    // Cast naar FinancialIncomeSummary om TS 'string vs "CSV"|"Setup"' error te fixen
    const incomeSummary = dataProcessor.reconcileWithSetup(
      csvTransactions,
      currentSetup
    ) as FinancialIncomeSummary;

    // Check op gemiste vaste lasten
    const hasMissingCosts = csvTransactions.some(
      t => t.category === 'Wonen' && !currentSetup?.housingIncluded
    );

    // --- 4. RESEARCH PAYLOAD (Anoniem) ---
    const categoryTotals = csvTransactions.reduce((acc, curr) => {
      const key = curr.category || 'Overig';
      acc[key] = (acc[key] || 0) + (curr.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    const researchData: MasterProcessResult['research'] = {
      memberPayloads: processedMembers.map(p => p.researchPayload),
      financialAnalytics: {
        totalIncomeCents: incomeSummary.finalIncome || 0,
        categoryTotals,
        timestamp: new Date().toISOString()
      }
    };

    // De ultieme check: mag deze data naar de cloud?
    assertNoPIILeak(researchData as unknown as Record<string, unknown>);

    // --- 5. FINALE OUTPUT ---
    return {
      local: {
        [DATA_KEYS.HOUSEHOLD]: {
          members: processedMembers.map(p => p.localMember)
        },
        [DATA_KEYS.FINANCE]: {
          transactions: csvTransactions,
          summary: incomeSummary,
          hasMissingCosts
        }
      },
      research: researchData
    };
  }
};

export default dataOrchestrator;