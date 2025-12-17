import * as React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useAppStyles } from '../styles/useAppStyles';
import ChipButton from '../components/ChipButton';
import { useFormContext } from '../context/FormContext';
import { Member, GENDER_OPTIONS } from '../types/household';
import { stripEmojiAndLimit } from '../utils/numbers';
import { calculateAge, getAdultMaxISO, getChildMinISO, getChildMaxISO } from '../utils/date';
import DateField from '../components/DateField';

const HouseholdMemberRepeater: React.FC = () => {
  const { styles } = useAppStyles();
  const { state, dispatch } = useFormContext();

  // ---- C1 → C4 sync ----
  React.useEffect(() => {
    if (state.C1?.auto && state.C1.auto !== state.C4?.auto) {
      dispatch({
        type: 'SET_PAGE_DATA',
        pageId: 'C4',
        data: { auto: state.C1.auto },
      });
    }
    if (state.C1?.huisdieren && state.C1.huisdieren !== state.C4?.huisdieren) {
      dispatch({
        type: 'SET_PAGE_DATA',
        pageId: 'C4',
        data: { huisdieren: state.C1.huisdieren },
      });
    }
  }, [state.C1?.auto, state.C1?.huisdieren, state.C4?.auto, state.C4?.huisdieren, dispatch]);

  const aantalMensen = Math.max(0, Number(state.C1?.aantalMensen ?? 0));

  const rawVolwassen = state.C1?.aantalVolwassen;
  const volwassenDefault = aantalMensen > 0 && rawVolwassen == null ? 1 : 0;

  const aantalVolwassen = Math.max(
    0,
    Math.min(Number(rawVolwassen ?? volwassenDefault), aantalMensen),
  );

  const aantalKinderen = Math.max(0, aantalMensen - aantalVolwassen);

  const leden: Member[] = Array.isArray(state.C4?.leden) ? (state.C4!.leden as Member[]) : [];

  const updateMember = (index: number, patch: Partial<Member>) => {
    const next = leden.map((m, i) => (i === index ? { ...m, ...patch } : m));
    dispatch({ type: 'SET_PAGE_DATA', pageId: 'C4', data: { leden: next } });
  };
  console.log('[C4-REPEATER] intake', {
    aantalMensen,
    aantalVolwassen,
    aantalKinderen,
    ledenLen: Array.isArray(leden) ? leden.length : 0,
  });

  // ---- render helpers ----
  let adultDisplayIndex = 0;
  let childDisplayIndex = 0;

  const renderAdultCard = (m: Member, index: number) => {
    const idx = ++adultDisplayIndex;
    const title = m.naam?.trim() ? `Volwassene ${idx}: ${m.naam}` : `Volwassene ${idx}`;

    let ageError: string | null = null;
    if (typeof m.leeftijd === 'number') {
      if (m.leeftijd < 18) {
        ageError = 'Leeftijd moet ≥ 18 voor volwassenen. Registreer deze persoon anders als kind.';
      } else if (!Number.isInteger(m.leeftijd)) {
        ageError = 'Leeftijd moet een geheel getal zijn.';
      }
    }

    return (
      <View key={m.id} style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>{title}</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Naam</Text>
          <TextInput
            style={styles.input}
            value={m.naam ?? ''}
            onChangeText={(text) => updateMember(index, { naam: stripEmojiAndLimit(text, 25) })}
          />
        </View>

        <DateField
          label="Geboortedatum"
          valueISO={m.dateOfBirth}
          minISO="1920-01-01"
          maxISO={getAdultMaxISO()}
          onChangeISO={(iso) => {
            if (iso) {
              updateMember(index, {
                dateOfBirth: iso,
                leeftijd: calculateAge(iso) ?? undefined,
              });
            } else {
              updateMember(index, {
                dateOfBirth: undefined,
                leeftijd: undefined,
              });
            }
          }}
          errorText={ageError}
        />

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender</Text>
          <ScrollView horizontal contentContainerStyle={styles.chipContainer}>
            {GENDER_OPTIONS.map((g) => (
              <ChipButton
                key={g}
                label={g ?? ''}
                selected={m.gender === g}
                onPress={() => updateMember(index, { gender: g })}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderChildCard = (m: Member, index: number) => {
    const idx = ++childDisplayIndex;
    const title = m.naam?.trim() ? `Kind ${idx}: ${m.naam}` : `Kind ${idx}`;

    let ageError: string | null = null;
    if (typeof m.leeftijd === 'number') {
      if (m.leeftijd >= 18) {
        ageError = 'Leeftijd moet < 18 voor kinderen.';
      } else if (!Number.isInteger(m.leeftijd)) {
        ageError = 'Leeftijd moet een geheel getal zijn.';
      }
    }

    return (
      <View key={m.id} style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>{title}</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Naam</Text>
          <TextInput
            style={styles.input}
            value={m.naam ?? ''}
            onChangeText={(text) => updateMember(index, { naam: stripEmojiAndLimit(text, 25) })}
          />
        </View>

        <DateField
          label="Geboortedatum"
          valueISO={m.dateOfBirth}
          minISO={getChildMinISO()}
          maxISO={getChildMaxISO()}
          onChangeISO={(iso) => {
            if (iso) {
              updateMember(index, {
                dateOfBirth: iso,
                leeftijd: calculateAge(iso) ?? undefined,
              });
            } else {
              updateMember(index, {
                dateOfBirth: undefined,
                leeftijd: undefined,
              });
            }
          }}
          errorText={ageError}
        />

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender</Text>
          <ScrollView horizontal contentContainerStyle={styles.chipContainer}>
            {GENDER_OPTIONS.map((g) => (
              <ChipButton
                key={g}
                label={g ?? ''}
                selected={m.gender === g}
                onPress={() => updateMember(index, { gender: g })}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  if (aantalMensen <= 0) {
    console.log('[C4-REPEATER] early return — C1.aantalMensen <= 0');

    return (
      <View style={styles.pageContainer}>
        <Text style={styles.summaryDetail}>Vul eerst het aantal personen in op C1.</Text>
      </View>
    );
  }

  const adults = leden.filter((m) => m.memberType === 'adult');
  const children = leden.filter((m) => m.memberType === 'child');
  console.log('[C4-REPEATER] render cards', {
    adultsLen: adults.length,
    childrenLen: children.length,
  });

  return (
    <View style={styles.pageContainer}>
      {adults.map((m, i) => renderAdultCard(m, i))}
      {children.map((m, i) => renderChildCard(m, i))}
    </View>
  );
};

export default HouseholdMemberRepeater;
