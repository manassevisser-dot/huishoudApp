/**
 * @file_intent Definieert de logica voor het transformeren van de interne financiële datastructuur (`FinanceState`) naar een gestandaardiseerd formaat (`UndoResult[]`). Dit formaat is specifiek bedoeld voor consumptie door een externe of legacy "kernel" die een ander data-contract verwacht. Het fungeert als een adapter tussen het moderne domeinmodel en een ouder systeem.
 * @repo_architecture Domain Layer - Business Rules / Data Transformation.
 * @term_definition
 *   - `Data Transformation`: Het proces van het converteren van data van het ene formaat naar het andere. In dit geval, van een gestructureerd `FinanceState`-object naar een platte array van `UndoResult`-objecten.
 *   - `Adapter Pattern`: Een softwareontwerppatroon dat de interface van een klasse laat samenwerken met een andere, incompatibele interface. Dit bestand fungeert als een adapter door de `FinanceState`-structuur te vertalen naar de `UndoResult[]`-structuur die de kernel verwacht.
 *   - `UndoResult`: De doel-datastructuur. De naam suggereert dat het mogelijk wordt gebruikt in een systeem dat transacties of operaties kan terugdraaien, waarbij elke `UndoResult` een individuele, omkeerbare financiële boeking vertegenwoordigt.
 *   - `Kernel`: Een term die vaak wordt gebruikt voor een kernsysteem of een legacy-engine die een specifieke, vaak rigide, data-interface vereist.
 * @contract Dit bestand exporteert de `mapFinanceToUndoResults` functie. Deze functie accepteert een `FinanceState` object en retourneert een array van `UndoResult` objecten. Het is een pure, deterministische transformatie. De functie doorloopt de `income` en `expenses` items, transformeert elk item naar een `UndoResult` met behulp van de interne `mapItemToUndoResult` helper, en combineert ze in één enkele array.
 * @ai_instruction De `mapFinanceToUndoResults` functie wordt aangeroepen door een **orchestrator** (of een data-synchronisatielaag) op het punt waar data naar het externe "kernel"-systeem moet worden gestuurd. De orchestrator is verantwoordelijk voor:
 *   1. Het ophalen van de actuele `FinanceState` uit de applicatiestaat.
 *   2. Het aanroepen van `mapFinanceToUndoResults` om de data te transformeren.
 *   3. Het versturen van de resulterende `UndoResult[]` array naar de desbetreffende API-endpoint van de kernel.
 * Deze aanpak isoleert de complexiteit van de datatransformatie binnen de domeinlaag en houdt de orchestrator schoon. De orchestrator hoeft alleen te weten *wanneer* de data verstuurd moet worden, niet *hoe* deze voorbereid moet worden.
 */

import {
  FinanceState,
  FinanceItem,
  CONTRACT_VERSION,
} from '@core/types/research';

interface UndoResult {
  id: string;
  amount: number;
  currency: 'EUR';
  reason: string;
  timestamp: string;
  schemaVersion: string;
}

/**
 * Zet één FinanceItem om naar een UndoResult
 */
const mapItemToUndoResult = (item: FinanceItem, kind: 'income' | 'expense'): UndoResult => ({
  id: item.id,
  amount: kind === 'expense' ? -item.amountCents : item.amountCents,
  currency: 'EUR',
  reason: kind,
  timestamp: new Date().toISOString(),
  schemaVersion: CONTRACT_VERSION,
});

/**
 * Map de volledige FinanceState naar een array voor de kernel
 */
export const mapFinanceToUndoResults = (finance: FinanceState): UndoResult[] => [
  ...finance.income.items.map((i) => mapItemToUndoResult(i, 'income')),
  ...finance.expenses.items.map((i) => mapItemToUndoResult(i, 'expense')),
];
