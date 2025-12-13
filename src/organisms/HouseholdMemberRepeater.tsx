// src/organisms/HouseholdMemberRepeater.tsx
import * as React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useAppStyles } from '../styles/useAppStyles';
import ChipButton from '../components/ChipButton';
import { useFormContext } from '../context/FormContext';
import { Member, BurgerlijkeStaat, WoningType } from '../types/household';
import { onlyDigits, stripEmojiAndLimit } from '../utils/numbers';
import { parseDDMMYYYYtoISO, calculateAge, formatDate } from '../utils/date';

// P4: Updated GENDER_OPTIONS - 'geen antwoord' → 'n.v.t.'
const GENDER_OPTIONS: Member['gender'][] = [
  'man',
  'vrouw',
  'anders',
  'n.v.t.',
];

const BURGERLIJKE_OPTIONS: Exclude<BurgerlijkeStaat, 'Alleenstaand'>[] = [
  'Gehuwd',
  'Fiscaal Partners',
  'Samenwonend',
  'Bevriend',
  'Anders',
];

const WONING_OPTIONS: WoningType[] = ['Koop', 'Huur', 'Kamer', 'Anders'];

const HouseholdMemberRepeater: React.FC = () => {
  const { styles, colors } = useAppStyles();
  const { state, dispatch } = useFormContext();

// --- DOB auto-format (per lid): we tonen tijdens typen DD-MM-YYYY en zetten bij 8 cijfers ISO in state ---//
const [dobDraft, setDobDraft] = React.useState<Record<string, string>>({});

const formatDigitsToDDMMYYYY = (digits: string): string => {
  const d = digits.slice(0, 8);
  const parts = [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean);
  return parts.join('-');
};




  // Keep C1→C4 sync logic intact (reads C1, writes C4 state)
  React.useEffect(() => {
    const c1Auto = state.C1?.auto;
    const c1Huisdieren = state.C1?.huisdieren;
    const c4Auto = state.C4?.auto;
    const c4Huisdieren = state.C4?.huisdieren;

    if (c1Auto && c1Auto !== c4Auto) {
      dispatch({
        type: 'SET_PAGE_DATA',
        pageId: 'C4',
        data: { auto: c1Auto },
      });
    }
    if (c1Huisdieren && c1Huisdieren !== c4Huisdieren) {
      dispatch({
        type: 'SET_PAGE_DATA',
        pageId: 'C4',
        data: { huisdieren: c1Huisdieren },
      });
    }
  }, [state.C1?.auto, state.C1?.huisdieren, state.C4?.auto, state.C4?.huisdieren, dispatch]);

  const aantalMensen = Math.max(0, Number(state.C1?.aantalMensen ?? 0));
  const aantalVolwassen = Math.max(
    0,
    Math.min(Number(state.C1?.aantalVolwassen ?? 0), aantalMensen)
  );
  const aantalKinderen = Math.max(0, aantalMensen - aantalVolwassen);

  const leden: Member[] = React.useMemo(() => {
    const arr = state.C4?.leden as Member[] | undefined;
    return Array.isArray(arr) ? arr : [];
  }, [state.C4?.leden]);

  const burgerlijkeStaat: BurgerlijkeStaat | undefined = state.C4?.burgerlijkeStaat;
  const woning: WoningType | undefined = state.C4?.woning;
  const postcode: string | undefined = state.C4?.postcode;

  const countLeadingAdults = (arr: Member[]) => {
    let n = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.memberType === 'adult') n++;
      else break;
    }
    return n;
  };

  const computeAligned = React.useCallback(
    (current: Member[]): Member[] => {
      let next = current.map((m) => ({ ...m }));
      const targetLen = aantalMensen;
      const targetAdults = aantalVolwassen;

      if (next.length > targetLen) next = next.slice(0, targetLen);
      else if (next.length < targetLen) {
        let leadingAdults = countLeadingAdults(next);
        while (
          leadingAdults < Math.min(targetAdults, targetLen) &&
          next.length < targetLen
        ) {
          const insertIndex = leadingAdults;
          next.splice(insertIndex, 0, {
            id: `m-${insertIndex}`,
            memberType: 'adult',
            naam: '',
            leeftijd: undefined,
            gender: undefined,
          });
          leadingAdults++;
        }
        while (next.length < targetLen) {
          const idx = next.length;
          next.push({
            id: `m-${idx}`,
            memberType: 'child',
            naam: '',
            leeftijd: undefined,
            gender: undefined,
            dateOfBirth: undefined,
          });
        }
      }

      let leadingAdults = countLeadingAdults(next);
      const deltaAdults = targetAdults - leadingAdults;
      if (deltaAdults > 0) {
        for (let k = 0; k < deltaAdults; k++) {
          const insertIndex = leadingAdults;
          next.splice(insertIndex, 0, {
            id: `m-insA-${insertIndex}-${Date.now()}-${k}`,
            memberType: 'adult',
          } as Member);
          next.pop();
          leadingAdults++;
        }
      } else if (deltaAdults < 0) {
        for (let k = 0; k < Math.abs(deltaAdults); k++) {
          const removeIndex = Math.max(leadingAdults - 1, 0);
          if (next[removeIndex]?.memberType === 'adult') {
            next.splice(removeIndex, 1);
            leadingAdults--;
            next.push({
              id: `m-insC-${next.length}-${Date.now()}-${k}`,
              memberType: 'child',
            } as Member);
          }
        }
      }

      for (let i = 0; i < next.length; i++) {
        const shouldType: Member['memberType'] = i < targetAdults ? 'adult' : 'child';
        if (next[i]?.memberType !== shouldType) {
          next[i] = { ...next[i], memberType: shouldType };
        }
      }
      return next;
    },
    [aantalMensen, aantalVolwassen]
  );

  React.useEffect(() => {
    const aligned = computeAligned(leden);
    const lengthOk = leden.length === aligned.length;
    const typesOk =
      lengthOk &&
      aligned.every((m, i) => leden[i]?.memberType === m.memberType);
    if (!lengthOk || !typesOk) {
      dispatch({
        type: 'SET_PAGE_DATA',
        pageId: 'C4',
        data: { leden: aligned },
      });
    }
  }, [aantalMensen, aantalVolwassen, leden, computeAligned, dispatch]);

  React.useEffect(() => {
    if (aantalVolwassen === 1 && burgerlijkeStaat !== 'Alleenstaand') {
      dispatch({
        type: 'SET_PAGE_DATA',
        pageId: 'C4',
        data: { burgerlijkeStaat: 'Alleenstaand' as BurgerlijkeStaat },
      });
    }
  }, [aantalVolwassen, burgerlijkeStaat, dispatch]);

  const updateMember = (index: number, patch: Partial<Member>) => {
    const current = Array.isArray(state.C4?.leden)
      ? (state.C4!.leden as Member[])
      : [];
    const next = current.map((m, i) => (i === index ? { ...m, ...patch } : m));
    dispatch({ type: 'SET_PAGE_DATA', pageId: 'C4', data: { leden: next } });
  };

  const handleDobChange = (memberId: string, index: number) => (text: string) => {
    // alleen cijfers uit de invoer
    const digits = onlyDigits(text);
    
    const display = formatDigitsToDDMMYYYY(digits);

    // toon draft tijdens typen
    setDobDraft((prev) => ({ ...prev, [memberId]: display }));

    if (digits.length === 8) {
      const iso = parseDDMMYYYYtoISO(display);
      if (iso) {
        const age = calculateAge(iso);
        // schrijf naar state (ISO + afgeleide leeftijd)
        updateMember(index, { dateOfBirth: iso, leeftijd: age ?? undefined });

        // draft opruimen zodat daarna de canonical ISO -> NL via formatDate wordt getoond
        setDobDraft((prev) => {
          const { [memberId]: _, ...rest } = prev;
          return rest;
        });
        return;
      }
    }

    // zolang het geen geldige 8 cijfers zijn, houden we dateOfBirth leeg
    updateMember(index, { dateOfBirth: undefined, leeftijd: undefined });
  };

  const setBurgerlijkeStaat = (val: BurgerlijkeStaat) =>
    dispatch({
      type: 'SET_PAGE_DATA',
      pageId: 'C4',
      data: { burgerlijkeStaat: val },
    });

  const setWoning = (val: WoningType) =>
    dispatch({ type: 'SET_PAGE_DATA', pageId: 'C4', data: { woning: val } });

  const setPostcode = (text: string) => {
    const clean = onlyDigits(text).slice(0, 4);
    dispatch({
      type: 'SET_PAGE_DATA',
      pageId: 'C4',
      data: { postcode: clean },
    });
  };

  let adultDisplayIndex = 0;
  let childDisplayIndex = 0;

  const renderAdultCard = (m: Member, index: number) => {
    const idx = ++adultDisplayIndex;
    const title = m.naam?.trim()
      ? `Volwassene ${idx}: ${m.naam}`
      : `Volwassene ${idx}`;

    let ageError: string | null = null;
    if (typeof m.leeftijd === 'number') {
      if (m.leeftijd < 18)
        ageError =
          'Leeftijd moet ≥ 18 voor volwassenen. Voor leeftijd 17 moet u deze persoon als kind registreren.';
      if (!Number.isInteger(m.leeftijd))
        ageError = 'Leeftijd moet een geheel getal zijn (geen decimalen).';
    }

    return (
      <View key={m.id} style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>{title}</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Naam</Text>
          <TextInput
            style={styles.input}
            value={m.naam ?? ''}
            onChangeText={(text) =>
              updateMember(index, { naam: stripEmojiAndLimit(text, 25) })
            }
            placeholder="naam"
            accessibilityLabel={`Naam voor ${title}`}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Geboortedatum</Text>
          
<TextInput
  style={[styles.input, ageError && styles.inputError]}
  value={
    dobDraft[m.id] ??
    (m.dateOfBirth ? formatDate(m.dateOfBirth, 'dd-mm-yyyy') : '')
  }
  onChangeText={handleDobChange(m.id, index)}
  placeholder="DD-MM-YYYY"
  keyboardType="number-pad"
  maxLength={10}
  accessibilityLabel={`Geboortedatum voor ${title}`}

          />
        </View>


        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.chipContainer}
            showsHorizontalScrollIndicator={false}>
            {GENDER_OPTIONS.map((g) => (
              <ChipButton
                key={g}
                label={g ?? ''}
                selected={m.gender === g}
                onPress={() => updateMember(index, { gender: g })}
                accessibilityLabel={`Gender ${g} voor ${title}`}
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
      if (m.leeftijd >= 18) ageError = 'Leeftijd moet < 18 voor kinderen.';
      if (!Number.isInteger(m.leeftijd))
        ageError = 'Leeftijd moet een geheel getal zijn (geen decimalen).';
    }

    return (
      <View key={m.id} style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>{title}</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Naam</Text>
          <TextInput
            style={styles.input}
            value={m.naam ?? ''}
            onChangeText={(text) =>
              updateMember(index, { naam: stripEmojiAndLimit(text, 25) })
            }
            placeholder="naam"
            accessibilityLabel={`Naam voor ${title}`}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Geboortedatum</Text>
          
<TextInput
  style={[styles.input, ageError && styles.inputError]}
  value={
    dobDraft[m.id] ??
    (m.dateOfBirth ? formatDate(m.dateOfBirth, 'dd-mm-yyyy') : '')
  }
  onChangeText={handleDobChange(m.id, index)}
  placeholder="DD-MM-YYYY"
  keyboardType="number-pad"
  maxLength={10}
  accessibilityLabel={`Geboortedatum voor ${title}`}

          />
        </View>


        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.chipContainer}
            showsHorizontalScrollIndicator={false}>
            {GENDER_OPTIONS.map((g) => (
              <ChipButton
                key={g}
                label={g ?? ''}
                selected={m.gender === g}
                onPress={() => updateMember(index, { gender: g })}
                accessibilityLabel={`Gender ${g} voor ${title}`}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderBurgerlijkeStaat = () => {
    if (aantalVolwassen === 1) return null;
    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>
          Burgerlijke staat (huishouden)
        </Text>
        <View style={styles.fieldContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.chipContainer}
            showsHorizontalScrollIndicator={false}>
            {BURGERLIJKE_OPTIONS.map((opt) => (
              <ChipButton
                key={opt}
                label={opt}
                selected={burgerlijkeStaat === opt}
                onPress={() => setBurgerlijkeStaat(opt)}
                accessibilityLabel={`Burgerlijke staat: ${opt}`}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderWonen = () => (
    <View style={styles.dashboardCard}>
      <Text style={styles.summaryLabelBold}>Wonen</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>soort woning:</Text>
        <ScrollView
          horizontal
          contentContainerStyle={styles.chipContainer}
          showsHorizontalScrollIndicator={false}>
          {WONING_OPTIONS.map((w) => (
            <ChipButton
              key={w}
              label={w}
              selected={woning === w}
              onPress={() => setWoning(w)}
              accessibilityLabel={`Woning: ${w}`}
            />
          ))}
        </ScrollView>
      </View>

      {aantalVolwassen <= 1 && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Postcode (4 cijfers)</Text>
          <TextInput
            style={styles.numericInput}
            value={postcode ?? ''}
            keyboardType="number-pad"
            maxLength={4}
            onChangeText={setPostcode}
            placeholder="1234"
            accessibilityLabel="Postcode (4 cijfers)"
          />
        </View>
      )}
    </View>
  );

  if (aantalMensen <= 0) {
    return (
      <View style={styles.pageContainer}>
        <Text style={styles.summaryDetail}>
          Vul eerst het aantal personen in op C1 om hier de details te beheren.
        </Text>
      </View>
    );
  }

  const currentMembers: Member[] = Array.isArray(state.C4?.leden)
    ? (state.C4!.leden as Member[])
    : [];

  const adults = currentMembers.filter((m) => m.memberType === 'adult');
  const children = currentMembers.filter((m) => m.memberType === 'child');

  return (
    <View style={styles.pageContainer}>
      {renderBurgerlijkeStaat()}
      {renderWonen()}

      {adults.length > 1 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}>
          {adults.map((m) => {
            const originalIndex = currentMembers.findIndex((x) => x.id === m.id);
            return renderAdultCard(m, originalIndex);
          })}
        </ScrollView>
      ) : (
        adults.map((m) => {
          const originalIndex = currentMembers.findIndex((x) => x.id === m.id);
          return renderAdultCard(m, originalIndex);
        })
      )}

      {children.length > 1 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}>
          {children.map((m) => {
            const originalIndex = currentMembers.findIndex((x) => x.id === m.id);
            return renderChildCard(m, originalIndex);
          })}
        </ScrollView>
      ) : (
        children.map((m) => {
          const originalIndex = currentMembers.findIndex((x) => x.id === m.id);
          return renderChildCard(m, originalIndex);
        })
      )}
    </View>
  );
};

export default HouseholdMemberRepeater;
