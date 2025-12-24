import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import MoneyField from '@components/fields/MoneyField';
import { useFormContext } from '@context/FormContext';
import { AutoCount } from '@shared-types/form';
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

const STREAMING_KEYS = [
  'videoland', 'hbo', 'netflix', 'npostart', 'kijk', 'disneyPlus', 'ytPremium',
] as const;

const ExpenseRepeater: React.FC = () => {
  const { styles } = useAppStyles();
  const { state, dispatch } = useFormContext();

  const [abonnementenExpanded, setAbonnementenExpanded] = React.useState(false);
  const [verzekeringenExpanded, setVerzekeringenExpanded] = React.useState(false);

  // Hulpmiddel om te bepalen of er auto's zijn
  const autoCount: AutoCount = (state.C4?.autoCount ?? 'Nee') as AutoCount;
  const hasAutos = autoCount !== 'Nee';
  // Forceer het type even met 'as AutoCount' om de mismatch op te lossen


  // Helper voor sectie headers (zoals in baseline)
  const renderSectionHeader = (title: string, expanded?: boolean, onToggle?: () => void) => (
    <TouchableOpacity 
      style={styles.fieldContainer} 
      onPress={onToggle}
      disabled={!onToggle}
    >
      <Text style={styles.summaryLabelBold}>
        {title} {onToggle ? (expanded ? '▼' : '▶') : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.pageContainer}>
      {/* SECTIE: WONEN (C10.wonen) */}
      <View style={styles.dashboardCard}>
        {renderSectionHeader('Wonen')}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Huur / Hypotheek (€/mnd)</Text>
          <MoneyField pageId="C10" fieldId="wonen.bedrag" placeholder="0,00" />
        </View>
      </View>

      {/* SECTIE: VERZEKERINGEN (Collapsible) */}
      <View style={styles.dashboardCard}>
        {renderSectionHeader(
          'Verzekeringen', 
          verzekeringenExpanded, 
          () => setVerzekeringenExpanded(!verzekeringenExpanded)
        )}
        {verzekeringenExpanded && (
          <View style={{ gap: 12, marginTop: 12 }}>
            <Text style={styles.fieldLabel}>Zorgverzekering (€/mnd)</Text>
            <MoneyField pageId="C10" fieldId="verzekeringen.zorg" placeholder="0,00" />
            
            <Text style={styles.fieldLabel}>Inboedel / Opstal (€/mnd)</Text>
            <MoneyField pageId="C10" fieldId="verzekeringen.wonen" placeholder="0,00" />
          </View>
        )}
      </View>

      {/* SECTIE: AUTO'S (Indien van toepassing) */}
      {hasAutos && (
        <View style={styles.dashboardCard}>
          {renderSectionHeader('Vervoer (Auto)')}
          {Array.from({ length: Number(autoCount) }).map((_, i) => (
            <View key={`auto-${i}`} style={{ marginBottom: 16 }}>
              <Text style={styles.fieldLabel}>Verzekering + Belasting Auto {i + 1}</Text>
              <MoneyField pageId="C10" fieldId={`vervoer.auto_${i}.vast`} placeholder="0,00" />
              <Text style={styles.fieldLabel}>Brandstof / Laden Auto {i + 1}</Text>
              <MoneyField pageId="C10" fieldId={`vervoer.auto_${i}.brandstof`} placeholder="0,00" />
            </View>
          ))}
        </View>
      )}

      {/* SECTIE: STREAMING & ABONNEMENTEN */}
      <View style={styles.dashboardCard}>
        {renderSectionHeader(
          'Abonnementen', 
          abonnementenExpanded, 
          () => setAbonnementenExpanded(!abonnementenExpanded)
        )}
        {abonnementenExpanded && (
          <View style={{ gap: 12, marginTop: 12 }}>
            {STREAMING_KEYS.map(key => (
              <View key={key}>
                <Text style={styles.fieldLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <MoneyField pageId="C10" fieldId={`abonnementen.${key}`} placeholder="0,00" />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ExpenseRepeater;