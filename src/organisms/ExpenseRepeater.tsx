// src/organisms/ExpenseRepeater.tsx
import * as React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useAppStyles } from '../styles/useAppStyles';
import ChipButton from '../components/ChipButton';
import { useFormContext } from '../context/FormContext';
import { Member, WoningType, AutoCount } from '../types/household';
import { ExpenseItem } from '../types/expenses';
import { onlyDigitsDotsComma } from '../utils/numbers';

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
  const { styles, colors } = useAppStyles();
  const { state, dispatch } = useFormContext();

  const [abonnementenExpanded, setAbonnementenExpanded] = React.useState(false);
  const [verzekeringenExpanded, setVerzekeringenExpanded] = React.useState(false);

  const c4 = state.C4;
  const c10 = state.C10;

  const woning: WoningType | undefined = c4?.woning;
  const auto: AutoCount | undefined = c4?.auto;

  const leden: Member[] = React.useMemo(() => (Array.isArray(c4?.leden) ? c4.leden : []), [c4]);
  const lasten: ExpenseItem[] = Array.isArray(c10?.lasten) ? c10.lasten : [];

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
    const item = idx >= 0 ? { ...next[idx] } : ({ id: itemId } as ExpenseItem);
    item[key] = val;
    if (idx >= 0) next[idx] = item;
    else next.push(item);
    dispatch({ type: 'SET_PAGE_DATA', pageId: 'C10', data: { lasten: next } });
  };

  const getWoningLabel = (woningType: WoningType | undefined) => {
    switch (woningType) {
      case 'Koop':
        return 'lasten bij een koopwoning:';
      case 'Huur':
        return 'lasten bij een huurwoning:';
      case 'Kamer':
        return 'woonlasten';
      case 'Anders':
        return 'Wonen';
      default:
        return 'Wonen';
    }
  };

  const renderWonen = () => {
    const id = 'wonen';
    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>Wonen</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{getWoningLabel(woning)}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Type</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.chipContainer}
            showsHorizontalScrollIndicator={false}
          >
            {(['Koop', 'Huur', 'Kamer', 'Anders'] as WoningType[]).map((w) => (
              <ChipButton
                key={w}
                label={w}
                selected={woning === w}
                // READ-ONLY in C10 (Phase 0.5 UI-decoupling):
                // C10 mag C4 niet meer schrijven. Woningtype wordt gewijzigd op C4;
                // hier tonen we alleen de huidige waarde voor conditionele weergave.
                onPress={() => {}}
              />
            ))}
          </ScrollView>
        </View>

        {woning === 'Huur' &&
          ['kaleHuur', 'servicekosten', 'gemeentebelastingen', 'waterschapsbelasting'].map((k) => (
            <View key={k} style={styles.fieldContainer}>
              <Text style={styles.label}>
                {k === 'kaleHuur'
                  ? 'Kale Huur (€/mnd)'
                  : k === 'servicekosten'
                    ? 'Servicekosten huurhuis (€/mnd)'
                    : k === 'gemeentebelastingen'
                      ? 'Gemeentebelastingen (€/mnd)'
                      : 'Waterschapsbelasting (€/mnd)'}
              </Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, k)?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, k, t)}
                placeholder="0.00"
              />
            </View>
          ))}

        {woning === 'Koop' &&
          ['hypotheekBruto', 'ozb', 'gemeentebelastingen', 'waterschapsbelasting'].map((k) => (
            <View key={k} style={styles.fieldContainer}>
              <Text style={styles.label}>
                {k === 'hypotheekBruto'
                  ? 'Hypotheek (bruto) (€/mnd)'
                  : k === 'ozb'
                    ? 'Onroerende Zaak Belasting (€/mnd)'
                    : k === 'gemeentebelastingen'
                      ? 'Gemeentebelastingen (€/mnd)'
                      : 'Waterschapsbelasting (€/mnd)'}
              </Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, k)?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, k, t)}
                placeholder="0.00"
              />
            </View>
          ))}

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

  const renderNuts = () => {
    const id = 'nuts';
    return (
      <View style={styles.dashboardCard}>
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
          ['energieGas', 'water'].map((k) => (
            <View key={k} style={styles.fieldContainer}>
              <Text style={styles.label}>
                {k === 'energieGas' ? 'Energie/Gas (€/mnd)' : 'Water (€/mnd)'}
              </Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, k)?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, k, t)}
                placeholder="0.00"
              />
            </View>
          ))
        )}
      </View>
    );
  };

  const renderVerzekeringen = () => {
    const id = 'verzekeringen';
    const toggleInsurance = (key: string) =>
      updateExpense(id, `${key}_enabled`, !readField(id, `${key}_enabled`) ? 1 : 0);
    const isEnabled = (key: string) => !!readField(id, `${key}_enabled`);

    return (
      <View style={styles.dashboardCard}>
        <TouchableOpacity
          onPress={() => setVerzekeringenExpanded(!verzekeringenExpanded)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={styles.summaryLabelBold}>Overige verzekeringen</Text>
          <Text style={styles.summaryLabel}>{verzekeringenExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {verzekeringenExpanded &&
          ['aansprakelijkheid', 'reis', 'opstal', 'uitvaart'].map((v) => (
            <View key={v} style={styles.fieldContainer}>
              <Text style={styles.label}>
                {v === 'uitvaart' ? 'Uitvaart/Levens' : v.charAt(0).toUpperCase() + v.slice(1)}
              </Text>
              <ScrollView
                horizontal
                contentContainerStyle={styles.chipContainer}
                showsHorizontalScrollIndicator={false}
              >
                <ChipButton
                  label="Nee"
                  selected={!isEnabled(v)}
                  onPress={() => updateExpense(id, `${v}_enabled`, 0)}
                  accessibilityLabel={`${v}: Nee`}
                />
                <ChipButton
                  label="Ja"
                  selected={isEnabled(v)}
                  onPress={() => toggleInsurance(v)}
                  accessibilityLabel={`${v}: Ja`}
                />
              </ScrollView>
              {isEnabled(v) && (
                <TextInput
                  style={styles.numericInput}
                  value={readField(id, v)?.toString() ?? ''}
                  keyboardType="number-pad"
                  onChangeText={(t) => updateExpense(id, v, t)}
                  placeholder="Premie (€/mnd)"
                />
              )}
            </View>
          ))}
      </View>
    );
  };

  const renderAbonnementen = () => {
    const id = 'abonnementen';
    return (
      <View style={styles.dashboardCard}>
        <TouchableOpacity
          onPress={() => setAbonnementenExpanded(!abonnementenExpanded)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={styles.summaryLabelBold}>Abonnementen</Text>
          <Text style={styles.summaryLabel}>{abonnementenExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {abonnementenExpanded && (
          <>
            {['internetTv', 'sport', 'lezen'].map((k) => (
              <View key={k} style={styles.fieldContainer}>
                <Text style={styles.label}>
                  {k === 'internetTv'
                    ? 'Internet/TV (€/mnd)'
                    : k === 'sport'
                      ? 'Sport (€/mnd)'
                      : 'Lezen (€/mnd)'}
                </Text>
                <TextInput
                  style={styles.numericInput}
                  value={readField(id, k)?.toString() ?? ''}
                  keyboardType="number-pad"
                  onChangeText={(t) => updateExpense(id, k, t)}
                  placeholder="0.00"
                />
              </View>
            ))}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Streaming</Text>
              <ScrollView
                horizontal
                contentContainerStyle={styles.chipContainer}
                showsHorizontalScrollIndicator={false}
              >
                {STREAMING_KEYS.map((p) => (
                  <ChipButton
                    key={p}
                    label={p}
                    selected={!!readField(id, `streaming_${p}_enabled`)}
                    onPress={() =>
                      updateExpense(
                        id,
                        `streaming_${p}_enabled`,
                        readField(id, `streaming_${p}_enabled`) ? 0 : 1,
                      )
                    }
                    accessibilityLabel={`Streaming ${p}`}
                  />
                ))}
              </ScrollView>
            </View>

            {STREAMING_KEYS.map(
              (p) =>
                !!readField(id, `streaming_${p}_enabled`) && (
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
                ),
            )}

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

  const renderPerPerson = () => {
    const adults = leden.filter((m) => m.memberType === 'adult');
    const children = leden.filter((m) => m.memberType === 'child');

    const renderAdultExpenses = (m: Member, idx: number) => {
      const id = `pers-${m.id}`;
      const display = m.naam?.trim() ? m.naam : `Volwassene ${idx + 1}`;
      return (
        <View
          key={id}
          style={
            adults.length > 1
              ? [styles.dashboardCard, { width: CARD_WIDTH, marginRight: 20 }]
              : styles.fieldContainer
          }
        >
          <Text style={styles.summaryLabelBold}>{display}</Text>
          {['ziektekostenPremie', 'telefoon', 'ov'].map((k) => (
            <View key={k} style={styles.fieldContainer}>
              <Text style={styles.label}>
                {k === 'ziektekostenPremie'
                  ? 'Ziektekosten (Premie) (€/mnd)'
                  : k === 'telefoon'
                    ? 'Telefoon (€/mnd)'
                    : 'OV (€/mnd) (optioneel)'}
              </Text>
              {k === 'ziektekostenPremie' && (
                <Text style={styles.summaryDetail}>
                  Eigen risico: €385/jaar wordt automatisch berekend.
                </Text>
              )}
              <TextInput
                style={styles.numericInput}
                value={readField(id, k)?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, k, t)}
                placeholder="0.00"
              />
            </View>
          ))}
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
          {['telefoon', 'ov'].map((k) => (
            <View key={k} style={styles.fieldContainer}>
              <Text style={styles.label}>
                {k === 'telefoon'
                  ? `Telefoon (€/mnd)${isChild15Optional ? ' (optioneel)' : ''}`
                  : 'OV (€/mnd) (optioneel)'}{' '}
                — {display}
              </Text>
              <TextInput
                style={styles.numericInput}
                value={readField(id, k)?.toString() ?? ''}
                keyboardType="number-pad"
                onChangeText={(t) => updateExpense(id, k, t)}
                placeholder="0.00"
              />
            </View>
          ))}
        </View>
      );
    };

    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>Vaste lasten per persoon</Text>
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
        {children.map((m) => renderChildExpenses(m))}
      </View>
    );
  };

  const renderAutoKosten = () => {
    // Bepaal aantal auto's
    const count = auto === 'Één' ? 1 : auto === 'Twee' ? 2 : 0;
    if (count === 0) return null;

    // Velden per auto
    const autoFields: { key: string; label: string; optional?: boolean }[] = [
      { key: 'wegenbelasting', label: 'Wegenbelasting' },
      { key: 'brandstofOfLaden', label: 'Benzine/opladen' },
      { key: 'apk', label: 'APK' },
      { key: 'onderhoudReservering', label: 'Reservering onderhoud', optional: true },
      { key: 'lease', label: 'Leasekosten', optional: true },
      { key: 'afschrijving', label: 'Afschrijving', optional: true },
    ];

    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>Autokosten</Text>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          style={{ marginVertical: 12 }}
        >
          {Array.from({ length: count }).map((_, i) => {
            const idx = i + 1;
            const id = `auto-${idx}`;

            return (
              <View
                key={id}
                style={
                  count > 1
                    ? [styles.dashboardCard, { width: CARD_WIDTH, marginRight: 20 }]
                    : styles.fieldContainer
                }
              >
                {autoFields.map((f) => (
                  <View key={`${id}-${f.key}`} style={styles.fieldContainer}>
                    <Text style={styles.label}>
                      {f.label} (€/mnd){f.optional ? ' (optioneel)' : ''} — Auto {idx}
                    </Text>
                    <TextInput
                      style={styles.numericInput}
                      value={readField(id, f.key)?.toString() ?? ''}
                      keyboardType="number-pad"
                      onChangeText={(t) => updateExpense(id, f.key, t)}
                      placeholder="0.00"
                    />
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
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
