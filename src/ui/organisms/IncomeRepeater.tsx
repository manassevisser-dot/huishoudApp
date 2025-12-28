import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import ChipButton from '@components/ChipButton';
import MoneyField from '@components/fields/MoneyField'; // De nieuwe dispatcher
import { useFormContext } from '@app/context/FormContext';
import {
  IncomeFrequency,
  UitkeringKey,
  UitkeringEntry,
  AndersEntry,
  IncomeCategories,
  IncomeMember,
  HouseholdBenefits,
  VermogenData,
} from 'src/shared-types/income';
import { Member } from 'src/shared-types/form';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

const CATEGORY_OPTIONS: (keyof IncomeCategories)[] = ['geen', 'werk', 'uitkering', 'anders'];
const FREQUENCIES: IncomeFrequency[] = ['week', '4wk', 'month', 'quarter', 'year'];

const UITKERING_KEYS_BASE: UitkeringKey[] = [
  'DUO',
  'Bijstand',
  'WW',
  'ZW',
  'WAO',
  'WGA',
  'WIA',
  'IVA',
  'WAJONG',
  'IOW',
  'anders',
];
const RETIREMENT_KEYS: UitkeringKey[] = ['Pensioen', 'AOW'];

const isAdult = (m: Member) => m.memberType === 'adult';

const IncomeRepeater: React.FC = () => {
  const { state, dispatch } = useFormContext();
  const { styles } = useAppStyles();
  const [toelagenExpanded, setToelagenExpanded] = React.useState<Record<string, boolean>>({});

  const adults = React.useMemo(
    () => ((state.C4?.leden as Member[]) ?? []).filter(isAdult),
    [state.C4?.leden],
  );

  const inkomsten = (state.C7?.inkomsten ?? {}) as Record<string, IncomeMember>;
  const benefits = (state.C7?.householdBenefits ?? {}) as HouseholdBenefits;
  const vermogen = (state.C7?.vermogen ?? { hasVermogen: false }) as VermogenData;

  // Render sectie voor Werk
  const renderWerk = (id: string, rec: IncomeMember, title: string) => {
    if (!rec.categories?.werk) return null;
    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>Inkomen uit werk</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Netto salaris</Text>
          <MoneyField pageId="C7" fieldId={`inkomsten.${id}.nettoSalaris`} placeholder="0,00" />
        </View>

        {/* Toeslagen sectie (Collapsible) */}
        <TouchableOpacity
          onPress={() => setToelagenExpanded((prev) => ({ ...prev, [id]: !prev[id] }))}
          style={styles.fieldContainer}
        >
          <Text style={styles.fieldLabel}>Toeslagen {toelagenExpanded[id] ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {toelagenExpanded[id] && (
          <View style={{ gap: 12 }}>
            <MoneyField
              pageId="C7"
              fieldId={`inkomsten.${id}.toeslagen.zorgtoeslag`}
              placeholder="Zorgtoeslag"
            />
            <MoneyField
              pageId="C7"
              fieldId={`inkomsten.${id}.toeslagen.reiskosten`}
              placeholder="Reiskosten"
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.pageContainer}>
      <Text style={styles.summaryLabelBold}>Toeslagen huishouden</Text>
      <MoneyField pageId="C7" fieldId="householdBenefits.huurtoeslag" placeholder="Huurtoeslag" />

      {adults.map((m, idx) => (
        <View key={m.id} style={styles.dashboardCard}>
          <Text style={styles.summaryLabelBold}>{m.naam || `Volwassene ${idx + 1}`}</Text>
          {renderWerk(
  m.id, 
  inkomsten[m.id] || { 
    id: m.id, 
    categories: { geen: false, werk: false, uitkering: false, anders: false } 
  },
  m.naam || `Volwassene ${idx + 1}`

)}
        </View>
      ))}
    </ScrollView>
  );
};

export default IncomeRepeater;
