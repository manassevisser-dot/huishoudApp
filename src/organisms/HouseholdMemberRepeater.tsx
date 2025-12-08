import * as React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import styles from '../styles/AppStyles';
import ChipButton from '../components/ChipButton';
import { useFormContext } from '../context/FormContext';
import { Member, BurgerlijkeStaat, WoningType, HuisdierenYesNo, AutoCount } from '../types/household';
import { onlyDigits, stripEmojiAndLimit } from '../utils/numbers';

// Constants kept local or could be in utils/constants.ts. 
// For now, keeping them here as they are tightly coupled to the form UI options.
const GENDER_OPTIONS: Member['gender'][] = [
  'man',
  'vrouw',
  'anders',
  'geen antwoord',
];
const BURGERLIJKE_OPTIONS: Exclude<BurgerlijkeStaat, 'Alleenstaand'>[] = [
  'Gehuwd',
  'Fiscaal Partners',
  'Samenwonend',
  'Bevriend',
  'Anders',
];
const WONING_OPTIONS: WoningType[] = ['Koop', 'Huur', 'Kamer', 'Anders'];
const JA_NEE: HuisdierenYesNo[] = ['Ja', 'Nee'];
const AUTO_OPTIONS: AutoCount[] = ['Nee', 'Één', 'Twee'];

const HouseholdMemberRepeater: React.FC = () => {
  const { state, dispatch } = useFormContext();

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

  const leden: Member[] = Array.isArray(state.C4?.leden)
    ? (state.C4!.leden as Member[])
    : [];

  const burgerlijkeStaat: BurgerlijkeStaat | undefined =
    state.C4?.burgerlijkeStaat;
  const woning: WoningType | undefined = state.C4?.woning;
  const postcode: string | undefined = state.C4?.postcode;
  const huisdieren: HuisdierenYesNo | undefined = state.C4?.huisdieren;
  const auto: AutoCount | undefined = state.C4?.auto;

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
            geboortejaar: undefined,
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
        const shouldType: Member['memberType'] =
          i < targetAdults ? 'adult' : 'child';
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

  const setHuisdieren = (val: HuisdierenYesNo) =>
    dispatch({
      type: 'SET_PAGE_DATA',
      pageId: 'C4',
      data: { huisdieren: val },
    });

  const setAuto = (val: AutoCount) =>
    dispatch({ type: 'SET_PAGE_DATA', pageId: 'C4', data: { auto: val } });

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
          <Text style={styles.label}>Leeftijd</Text>
          <TextInput
            style={
              ageError
                ? [styles.numericInput, styles.inputError]
                : styles.numericInput
            }
            value={
              m.leeftijd !== undefined && m.leeftijd !== null
                ? String(m.leeftijd)
                : ''
            }
            keyboardType="number-pad"
            maxLength={2}
            onChangeText={(text) => {
              const clean = onlyDigits(text).slice(0, 2);
              const n = clean.length ? Number(clean) : undefined;
              updateMember(index, { leeftijd: n });
            }}
            placeholder="18 of ouder"
            accessibilityLabel={`Leeftijd voor ${title}`}
          />
          {ageError && <Text style={styles.errorText}>{ageError}</Text>}
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
                label={g}
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
          <Text style={styles.label}>Leeftijd</Text>
          <TextInput
            style={
              ageError
                ? [styles.numericInput, styles.inputError]
                : styles.numericInput
            }
            value={
              m.leeftijd !== undefined && m.leeftijd !== null
                ? String(m.leeftijd)
                : ''
            }
            keyboardType="number-pad"
            maxLength={2}
            onChangeText={(text) => {
              const clean = onlyDigits(text).slice(0, 2);
              const n = clean.length ? Number(clean) : undefined;
              updateMember(index, { leeftijd: n });
            }}
            placeholder="Jonger dan 18"
            accessibilityLabel={`Leeftijd voor ${title}`}
          />
          {ageError && <Text style={styles.errorText}>{ageError}</Text>}
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
                label={g}
                selected={m.gender === g}
                onPress={() => updateMember(index, { gender: g })}
                accessibilityLabel={`Gender ${g} voor ${title}`}
              />
            ))}
          </ScrollView>
        </View>

        {aantalKinderen > 0 && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Geboortejaar</Text>
            <TextInput
              style={styles.numericInput}
              value={
                m.geboortejaar !== undefined && m.geboortejaar !== null
                  ? String(m.geboortejaar)
                  : ''
              }
              keyboardType="number-pad"
              maxLength={4}
              onChangeText={(text) => {
                const clean = onlyDigits(text).slice(0, 4);
                const n = clean.length ? Number(clean) : undefined;
                updateMember(index, { geboortejaar: n });
              }}
              placeholder="YYYY"
              accessibilityLabel={`Geboortejaar voor ${title}`}
            />
          </View>
        )}
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
        <Text style={styles.label}>Woning</Text>
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

      {/* PHASE 3: Postcode only shown when aantalVolwassen <= 1 */}
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

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Huisdier(en)</Text>
        <ScrollView
          horizontal
          contentContainerStyle={styles.chipContainer}
          showsHorizontalScrollIndicator={false}>
          {JA_NEE.map((v) => (
            <ChipButton
              key={v}
              label={v}
              selected={huisdieren === v}
              onPress={() => setHuisdieren(v)}
              accessibilityLabel={`Huisdier(en): ${v}`}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Auto</Text>
        <ScrollView
          horizontal
          contentContainerStyle={styles.chipContainer}
          showsHorizontalScrollIndicator={false}>
          {AUTO_OPTIONS.map((a) => (
            <ChipButton
              key={a}
              label={a}
              selected={auto === a}
              onPress={() => setAuto(a)}
              accessibilityLabel={`Auto: ${a}`}
            />
          ))}
        </ScrollView>
      </View>
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
