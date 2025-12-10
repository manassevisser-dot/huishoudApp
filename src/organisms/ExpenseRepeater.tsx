// src/organisms/ExpenseRepeater.tsx
import * as React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import styles from '../styles/AppStyles';
import ChipButton from '../components/ChipButton';
import { useFormContext } from '../context/FormContext';
import { Member, WoningType, AutoCount } from '../types/household';
import { ExpenseItem } from '../types/expenses';
import { onlyDigitsDotsComma } from '../utils/numbers';

// P4: Card dimensions for swipe
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

const STREAMING_KEYS = [
  'videoland',
  'hbo',
  'netflix',
  'npostart',
  'kijk',
  'disneyPlus',
  'ytPremium',
] as const;

const isChildUnder15 = (m: Member) =>
  m.memberType === 'child' && typeof m.leeftijd === 'number' && m.leeftijd < 15;

const ExpenseRepeater: React.FC = () => {
  const { state, dispatch } = useFormContext();

  // P4: Collapsible states
  const [abonnementenExpanded, setAbonnementenExpanded] = React.useState(false);
  const [verzekeringenExpanded, setVerzekeringenExpanded] = React.useState(false);

  const c4 = state.C4;
  const c10 = state.C10;

  const woning: WoningType | undefined = c4?.woning;
  const auto: AutoCount | undefined = c4?.auto;

  const leden: Member[] = React.useMemo(() => {
    const arr = c4?.leden as Member[] | undefined;
    return Array.isArray(arr) ? arr : [];
  }, [c4]);

  const lasten: ExpenseItem[] = Array.isArray(c10?.lasten) ? (c10!.lasten as ExpenseItem[]) : [];

  const readField = (itemId: string, key: string): number | undefined => {
    const it = lasten.find((x) => x.id === itemId);
    const v = it?.[key];
    return typeof v === 'number' && !isNaN(v) ? v : undefined;
  };

  const updateExpense = (itemId: string, key: string, raw: string | number | undefined) => {
    const val =
      typeof raw === 'string'
        ? onlyDigitsDotsComma(raw).length
          ? Number(onlyDigitsDotsComma(raw))
          : undefined
        : raw;

    const next = [...lasten];
    const idx = next.findIndex((x) => x.id === itemId);
    const item = idx >= 0 ? { ...next[idx] } : { id: itemId } as ExpenseItem;
    item[key] = val;

    if (idx >= 0) next[idx] = item;
    else next.push(item);

    dispatch({ type: 'SET_PAGE_DATA', pageId: 'C10', data: { lasten: next } });
  };

  // P4: Dynamic woning label helper
  const getWoningLabel = (woningType: WoningType | undefined): string => {
    switch (woningType) {
      case 'Koop': return 'lasten bij een koopwoning:';
      case 'Huur': return 'lasten bij een huurwoning:';
      case 'Kamer': return 'woonlasten';
      case 'Anders': return 'Wonen';
      default: return 'Wonen';
    }
  };

  const renderWonen = () => {
    const id = 'wonen';
    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>Wonen</Text>

        {/* P4: Dynamic woning label based on C4.woning */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{getWoningLabel(woning)}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Type</Text>
          <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
            {(['Koop', 'Huur', 'Kamer', 'Anders'] as WoningType[]).map((w) => (
              <ChipButton
                key={w}
                label={w}
                selected={woning === w}
                onPress={() => dispatch({ type: 'SET_PAGE_DATA', pageId: 'C4', data: { woning: w } })}
                accessibilityLabel={`Woning: ${w}`}
              />
            ))}
          </ScrollView>
        </View>

        {woning === 'Huur' && (
          <>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Kale Huur (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'kaleHuur')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'kaleHuur', t)}
                placeholder="0.00"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Servicekosten huurhuis (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'servicekosten')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'servicekosten', t)}
                placeholder="0.00"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Gemeentebelastingen (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'gemeentebelastingen')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'gemeentebelastingen', t)}
                placeholder="0.00"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Waterschapsbelasting (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'waterschapsbelasting')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'waterschapsbelasting', t)}
                placeholder="0.00"
              />
            </View>
          </>
        )}

        {woning === 'Koop' && (
          <>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Hypotheek (bruto) (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'hypotheekBruto')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'hypotheekBruto', t)}
                placeholder="0.00"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Onroerende Zaak Belasting (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'ozb')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'ozb', t)}
                placeholder="0.00"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Gemeentebelastingen (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'gemeentebelastingen')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'gemeentebelastingen', t)}
                placeholder="0.00"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Waterschapsbelasting (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'waterschapsbelasting')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'waterschapsbelasting', t)}
                placeholder="0.00"
              />
            </View>
          </>
        )}

        {woning === 'Kamer' && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Huur kamer (€/mnd)</Text>
            <TextInput
              style={styles.numericInput}
              value={readField(id, 'kostgeld')?.toString() ?? ''}
              keyboardType="number-pad"
              onChangeText={(t) => updateExpense(id, 'kostgeld', t)}
              placeholder="0.00"
            />
          </View>
        )}

        {woning === 'Anders' && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Woonlasten (€/mnd)</Text>
            <TextInput
              style={styles.numericInput}
              value={readField(id, 'woonlasten')?.toString() ?? ''}
              keyboardType="number-pad"
              onChangeText={(t) => updateExpense(id, 'woonlasten', t)}
              placeholder="0.00"
            />
          </View>
        )}
      </View>
    );
  };

  // P4: Nuts - NO LABEL (removed Nutsvoorzieningen text)
  const renderNuts = () => {
    const id = 'nuts';
    return (
      <View style={styles.dashboardCard}>
        {/* P4: NO LABEL - just fields */}
        {woning === 'Kamer' ? (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mijn bijdrage voor Energie/Gas/Water (€/mnd)</Text>
            <TextInput
              style={styles.numericInput}
              value={readField(id, 'bijdrageEGW')?.toString() ?? ''}
              keyboardType="number-pad"
              onChangeText={(t) => updateExpense(id, 'bijdrageEGW', t)}
              placeholder="0.00"
            />
          </View>
        ) : (
          <>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Energie/Gas (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'energieGas')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'energieGas', t)}
                placeholder="0.00"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Water (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'water')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'water', t)}
                placeholder="0.00"
              />
            </View>
          </>
        )}
      </View>
    );
  };

  // Continue in Part 2...
  // ExpenseRepeater.tsx - Part 2: Verzekeringen, Abonnementen, Per Persoon, Auto
// (This continues from Part 1 - add these methods to the component)

  // P4: Verzekeringen - COLLAPSIBLE + renamed to "Overige verzekeringen"
  const renderVerzekeringen = () => {
    const id = 'verzekeringen';
    
    const toggleInsurance = (key: string) => {
      const current = readField(id, `${key}_enabled`);
      updateExpense(id, `${key}_enabled`, current ? 0 : 1);
    };

    const isEnabled = (key: string) => !!readField(id, `${key}_enabled`);

    return (
      <View style={styles.dashboardCard}>
        {/* P4: Collapsible header + renamed label */}
        <TouchableOpacity 
          onPress={() => setVerzekeringenExpanded(!verzekeringenExpanded)}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
        >
          <Text style={styles.summaryLabelBold}>Overige verzekeringen</Text>
          <Text style={styles.summaryLabel}>{verzekeringenExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {verzekeringenExpanded && (
          <>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Aansprakelijkheid</Text>
              <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
                <ChipButton
                  label="Nee"
                  selected={!isEnabled('aansprakelijkheid')}
                  onPress={() => updateExpense(id, 'aansprakelijkheid_enabled', 0)}
                  accessibilityLabel="Aansprakelijkheid: Nee"
                />
                <ChipButton
                  label="Ja"
                  selected={isEnabled('aansprakelijkheid')}
                  onPress={() => toggleInsurance('aansprakelijkheid')}
                  accessibilityLabel="Aansprakelijkheid: Ja"
                />
              </ScrollView>
              {isEnabled('aansprakelijkheid') && (
                <TextInput
                  style={styles.numericInput}
                  value={readField(id, 'aansprakelijkheid')?.toString() ?? ''}
                  keyboardType="number-pad"
                  onChangeText={(t) => updateExpense(id, 'aansprakelijkheid', t)}
                  placeholder="Premie (€/mnd)"
                />
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Reis</Text>
              <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
                <ChipButton
                  label="Nee"
                  selected={!isEnabled('reis')}
                  onPress={() => updateExpense(id, 'reis_enabled', 0)}
                  accessibilityLabel="Reis: Nee"
                />
                <ChipButton
                  label="Ja"
                  selected={isEnabled('reis')}
                  onPress={() => toggleInsurance('reis')}
                  accessibilityLabel="Reis: Ja"
                />
              </ScrollView>
              {isEnabled('reis') && (
                <TextInput
                  style={styles.numericInput}
                  value={readField(id, 'reis')?.toString() ?? ''}
                  keyboardType="number-pad"
                  onChangeText={(t) => updateExpense(id, 'reis', t)}
                  placeholder="Premie (€/mnd)"
                />
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Opstal</Text>
              <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
                <ChipButton
                  label="Nee"
                  selected={!isEnabled('opstal')}
                  onPress={() => updateExpense(id, 'opstal_enabled', 0)}
                  accessibilityLabel="Opstal: Nee"
                />
                <ChipButton
                  label="Ja"
                  selected={isEnabled('opstal')}
                  onPress={() => toggleInsurance('opstal')}
                  accessibilityLabel="Opstal: Ja"
                />
              </ScrollView>
              {isEnabled('opstal') && (
                <TextInput
                  style={styles.numericInput}
                  value={readField(id, 'opstal')?.toString() ?? ''}
                  keyboardType="number-pad"
                  onChangeText={(t) => updateExpense(id, 'opstal', t)}
                  placeholder="Premie (€/mnd)"
                />
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Uitvaart/Levens</Text>
              <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
                <ChipButton
                  label="Nee"
                  selected={!isEnabled('uitvaart')}
                  onPress={() => updateExpense(id, 'uitvaart_enabled', 0)}
                  accessibilityLabel="Uitvaart/Levens: Nee"
                />
                <ChipButton
                  label="Ja"
                  selected={isEnabled('uitvaart')}
                  onPress={() => toggleInsurance('uitvaart')}
                  accessibilityLabel="Uitvaart/Levens: Ja"
                />
              </ScrollView>
              {isEnabled('uitvaart') && (
                <TextInput
                  style={styles.numericInput}
                  value={readField(id, 'uitvaart')?.toString() ?? ''}
                  keyboardType="number-pad"
                  onChangeText={(t) => updateExpense(id, 'uitvaart', t)}
                  placeholder="Premie (€/mnd)"
                />
              )}
            </View>
          </>
        )}
      </View>
    );
  };

  // P4: Abonnementen - COLLAPSIBLE
  const renderAbonnementen = () => {
    const id = 'abonnementen';
    return (
      <View style={styles.dashboardCard}>
        {/* P4: Collapsible header */}
        <TouchableOpacity 
          onPress={() => setAbonnementenExpanded(!abonnementenExpanded)}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
        >
          <Text style={styles.summaryLabelBold}>Abonnementen</Text>
          <Text style={styles.summaryLabel}>{abonnementenExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {abonnementenExpanded && (
          <>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Internet/TV (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'internetTv')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'internetTv', t)}
                placeholder="0.00"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Sport (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'sport')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'sport', t)}
                placeholder="0.00"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Lezen (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'lezen')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'lezen', t)}
                placeholder="0.00"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Streaming</Text>
              <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
                {STREAMING_KEYS.map((p) => (
                  <ChipButton
                    key={p}
                    label={p}
                    selected={!!readField(id, `streaming_${p}_enabled`)}
                    onPress={() =>
                      updateExpense(id, `streaming_${p}_enabled`, (readField(id, `streaming_${p}_enabled`) ? 0 : 1))
                    }
                    accessibilityLabel={`Streaming ${p}`}
                  />
                ))}
              </ScrollView>
            </View>

            {STREAMING_KEYS.map((p) => {
              const enabled = !!readField(id, `streaming_${p}_enabled`);
              if (!enabled) return null;
              return (
                <View key={`streaming_${p}`} style={styles.fieldContainer}>
                  <Text style={styles.label}>{p} (€/mnd)</Text>
                  <TextInput
                    style={styles.numericInput}
                    value={readField(id, `streaming_${p}_amount`)?.toString() ?? ''}
                    keyboardType="number-pad"
                    onChangeText={(t) => updateExpense(id, `streaming_${p}_amount`, t)}
                    placeholder="0.00"
                  />
                </View>
              );
            })}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Contributie vereniging (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'contributie')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'contributie', t)}
                placeholder="0.00"
              />
            </View>
          </>
        )}
      </View>
    );
  };

  // P4: Per Persoon - SWIPE PATTERN + renamed to "Vaste lasten per persoon"
  const renderPerPerson = () => {
    const adults = leden.filter(m => m.memberType === 'adult');
    const children = leden.filter(m => m.memberType === 'child');
    
    const renderAdultExpenses = (m: Member, idx: number) => {
      const id = `pers-${m.id}`;
      const display = m.naam?.trim() ? m.naam : `Volwassene ${idx + 1}`;

      return (
        <View key={id} style={adults.length > 1 ? [styles.dashboardCard, { width: CARD_WIDTH, marginRight: 20 }] : styles.fieldContainer}>
          <Text style={styles.summaryLabelBold}>{display}</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Ziektekosten (Premie) (€/mnd)</Text>
            <Text style={styles.summaryDetail}>Eigen risico: €385/jaar wordt automatisch berekend.</Text>
            <TextInput
              style={styles.numericInput}
              value={readField(id, 'ziektekostenPremie')?.toString() ?? ''}
              keyboardType="number-pad"
              onChangeText={(t) => updateExpense(id, 'ziektekostenPremie', t)}
              placeholder="0.00"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Telefoon (€/mnd)</Text>
            <TextInput
              style={styles.numericInput}
              value={readField(id, 'telefoon')?.toString() ?? ''}
              keyboardType="number-pad"
              onChangeText={(t) => updateExpense(id, 'telefoon', t)}
              placeholder="0.00"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>OV (€/mnd) (optioneel)</Text>
            <TextInput
              style={styles.numericInput}
              value={readField(id, 'ov')?.toString() ?? ''}
              keyboardType="number-pad"
              onChangeText={(t) => updateExpense(id, 'ov', t)}
              placeholder="0.00"
            />
          </View>

          {/* P4: Navigation hint (not on last adult) */}
          {adults.length > 1 && idx < adults.length - 1 && (
            <Text style={styles.navigationHint}>volgende →</Text>
          )}
        </View>
      );
    };

    const renderChildExpenses = (m: Member) => {
      const id = `pers-${m.id}`;
      const isChild15Optional = isChildUnder15(m);
      const display = m.naam?.trim() ? m.naam : 'Kind';

      return (
        <View key={id} style={styles.fieldContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Telefoon (€/mnd){isChild15Optional ? ' (optioneel)' : ''} — {display}</Text>
            <TextInput
              style={styles.numericInput}
              value={readField(id, 'telefoon')?.toString() ?? ''}
              keyboardType="number-pad"
              onChangeText={(t) => updateExpense(id, 'telefoon', t)}
              placeholder="0.00"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>OV (€/mnd) (optioneel) — {display}</Text>
            <TextInput
              style={styles.numericInput}
              value={readField(id, 'ov')?.toString() ?? ''}
              keyboardType="number-pad"
              onChangeText={(t) => updateExpense(id, 'ov', t)}
              placeholder="0.00"
            />
          </View>
        </View>
      );
    };

    return (
      <View style={styles.dashboardCard}>
        {/* P4: Updated label */}
        <Text style={styles.summaryLabelBold}>Vaste lasten per persoon</Text>
        
        {/* P4: SWIPE PATTERN FOR ADULTS (if > 1 adult) */}
        {adults.length > 1 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
            style={{ marginVertical: 12 }}
          >
            {adults.map((m, idx) => renderAdultExpenses(m, idx))}
          </ScrollView>
        ) : (
          adults.map((m, idx) => renderAdultExpenses(m, idx))
        )}

        {/* Children - no swipe */}
        {children.map((m) => renderChildExpenses(m))}
      </View>
    );
  };

  const renderAutoKosten = () => {
    const count = auto === 'Één' ? 1 : auto === 'Twee' ? 2 : 0;
    if (count === 0) return null;

    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>Autokosten</Text>
        {Array.from({ length: count }).map((_, i) => {
          const idx = i + 1;
          const id = `auto-${idx}`;
          return (
            <View key={id} style={styles.fieldContainer}>
              <Text style={styles.label}>Wegenbelasting (€/mnd) — Auto {idx}</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'wegenbelasting')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'wegenbelasting', t)}
                placeholder="0.00"
              />

              <Text style={styles.label}>Benzine/opladen (€/mnd) — Auto {idx}</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'brandstofOfLaden')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'brandstofOfLaden', t)}
                placeholder="0.00"
              />

              <Text style={styles.label}>APK (€/mnd) — Auto {idx}</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'apk')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'apk', t)}
                placeholder="0.00"
              />

              <Text style={styles.label}>Reservering onderhoud (€/mnd) — Auto {idx} (optioneel)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'onderhoudReservering')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'onderhoudReservering', t)}
                placeholder="0.00"
              />

              <Text style={styles.label}>Leasekosten (€/mnd) — Auto {idx} (optioneel)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'lease')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'lease', t)}
                placeholder="0.00"
              />

              <Text style={styles.label}>Afschrijving (€/mnd) — Auto {idx} (optioneel)</Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, 'afschrijving')?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, 'afschrijving', t)}
                placeholder="0.00"
              />
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.pageContainer}>
      {renderWonen()}
      {renderNuts()}
      {renderVerzekeringen()}
      {renderAbonnementen()}
      {renderPerPerson()}
      {renderAutoKosten()}
    </View>
  );
};

export default ExpenseRepeater;