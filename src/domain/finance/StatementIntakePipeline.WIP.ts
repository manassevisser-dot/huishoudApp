/**
 * @file_intent (WIP) Biedt een set functies voor het verwerken van ongestructureerde financiële transactiedata (zoals uit een CSV-bestand). Dit omvat het opschonen, categoriseren en reconciliëren van data.
 * @repo_architecture Domain Layer - Finance (Business Logic).
 * @term_definition Pipeline = Een reeks van dataverwerkingsstappen. PII = Personally Identifiable Information (persoonlijk identificeerbare informatie). Reconciliatie = Het vergelijken en afstemmen van data uit verschillende bronnen (bv. CSV vs. handmatige invoer).
 * @contract Dit bestand exporteert een `dataProcessor` object met methoden: `stripPII` (verwijdert IBANs), `categorize` (wijst een categorie toe o.b.v. keywords), en `reconcileWithSetup` (vergelijkt CSV-inkomen met opgegeven inkomen). Het definieert ook de datastructuren `ResearchCsvItem` en `ResearchSetupData`.
 * @ai_instruction LET OP: Dit is een "Work In Progress" (WIP) bestand. De categorisatie is momenteel een simpele, op regels gebaseerde aanpak. Bij uitbreiding, focus op het verfijnen van `CATEGORY_RULES` en de `categorize` functie zonder de cyclomatische complexiteit significant te verhogen. De PII-stripping is cruciaal voor privacy.
 */
// src/domain/finance/StatementIntakePipeline.WIP.ts
import { toCents } from '@domain/helpers/numbers';

export type ResearchSetupData = {
  maandelijksInkomen?: number;
  housingIncluded?: boolean;
};

export type ResearchCsvItem = {
  amount: number;
  description: string;
  date: string;
  original: Record<string, unknown>;
  category?: string;
};

// 1. Definieer de regels buiten de methode (houdt de functie clean)
const CATEGORY_RULES: Record<string, string[]> = {
  Wonen: ['huur', 'hypotheek', 'woon'],
  Zorgverzekering: ['zorg', 'zilveren', 'vgz', 'cz'],
  Boodschappen: ['supermarkt', 'ah ', 'jumbo', 'lidl'],
  Inkomen: ['salaris', 'loon', 'stipendium'],
};

export const dataProcessor = {
  stripPII: (description: string): string => {
    const ibanRegex = /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7,}\b/gi;
    return description.replace(ibanRegex, 'NL** [REDACTED]');
  },

  // 2. FIX: Categoriseren met lage complexiteit
  categorize: (description: string): string => {
    const desc = description.toLowerCase();

    // We lopen door de regels heen. Dit telt als slechts 1 logisch pad in de complexiteits-meting.
    for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
      if (keywords.some((keyword) => desc.includes(keyword))) {
        return category;
      }
    }

    return 'Overig';
  },

  reconcileWithSetup: (csvData: ResearchCsvItem[], setupData: ResearchSetupData) => {
    const THRESHOLD_CENTS = 5000;

    const csvIncome = csvData
      .filter((d) => dataProcessor.categorize(d.description) === 'Inkomen')
      .reduce((acc, curr) => acc + (Number.isFinite(curr.amount) ? curr.amount : 0), 0);

    const setupIncomeCents = toCents(setupData.maandelijksInkomen ?? 0);
    const finalIncome = csvIncome > 0 ? csvIncome : setupIncomeCents;
    const source = csvIncome > 0 ? 'CSV' : 'Setup';
    const diff = csvIncome - setupIncomeCents;
    const isDiscrepancy = csvIncome > 0 && Math.abs(diff) > THRESHOLD_CENTS;

    return { finalIncome, source, isDiscrepancy, diff };
  },
};