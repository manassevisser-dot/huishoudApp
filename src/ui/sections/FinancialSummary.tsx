/**
 * @file_intent Een gespecialiseerd sectie-component voor het weergeven van een financieel overzicht, inclusief inkomsten, uitgaven en netto resultaat. Het is puur een presentatie-component.
 * @repo_architecture UI Layer - View/Component (Section). Dit is een herbruikbaar UI-blok dat bedoeld is om binnen een `UniversalScreen` te worden gebruikt. Het ontvangt zijn data via props en is verantwoordelijk voor de visuele weergave van die data.
 * @term_definition
 *   - `FinancialSummary`: Dit component. Het rendert de UI voor het financiële overzicht.
 *   - `FinancialSummaryData`: De data-structuur (props) die dit component verwacht, met de opgemaakte strings voor weergave.
 *   - `SummaryRow`: Een intern, kleiner component voor het weergeven van een enkele rij (label + waarde) binnen het overzicht.
 * @contract Dit component verwacht een `data`-prop van het type `FinancialSummaryData`. Het rendert de waarden uit dit object. Het bevat zelf geen bedrijfslogica; de berekeningen en opmaak van de data moeten gebeuren in de laag die dit component aanroept (bijv. een `Orchestrator` of een `ViewModel-builder`).
 * @ai_instruction Om dit component te gebruiken, moet je het de `FinancialSummaryData` prop doorgeven. De data moet vooraf berekend en geformatteerd zijn. Als je het uiterlijk van het financieel overzicht wilt aanpassen, moet je dit bestand bewerken. Als je de onderliggende data of berekeningen wilt wijzigen, moet je dit doen in de `MasterOrchestrator` of de relevante `ViewModel`-builder die de `FinancialSummaryData` voorbereidt.
 */
import * as React from 'react';
import { View, Text, ColorValue } from 'react-native';
import { useAppStyles, AppStyles } from '@ui/styles/useAppStyles';
/**
 * TODO: Replace logic in SectionRegistry AND sections.tsx for DashBoardScreen
 */
interface FinancialSummaryData {
  totalIncomeDisplay: string;
  totalExpensesDisplay: string;
  netDisplay: string;
}

interface SummaryRowProps {
  label: string;
  value: string;
  valueColor: ColorValue; // Verplicht maken voorkomt boolean-fouten
  styles: AppStyles;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, valueColor, styles }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, { color: valueColor, fontWeight: '700' }]}>
      {value}
    </Text>
  </View>
);

export const FinancialSummary: React.FC<{ data: FinancialSummaryData }> = ({ data }) => {
  const { styles, colors, Tokens } = useAppStyles();

  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.screenTitle}>Financieel Overzicht</Text>

      <SummaryRow label="Totaal Inkomsten:" value={data.totalIncomeDisplay} valueColor={colors.success} styles={styles} />
      <SummaryRow label="Totaal Uitgaven:" value={data.totalExpensesDisplay} valueColor={colors.error} styles={styles} />

      <View style={styles.summaryRowTotal}>
        <Text style={styles.summaryLabelBold}>Netto resultaat:</Text>
        <Text style={styles.summaryValueBold}>{data.netDisplay}</Text>
      </View>

      <View style={{ height: Tokens.Space.md }} />
    </View>
  );
};