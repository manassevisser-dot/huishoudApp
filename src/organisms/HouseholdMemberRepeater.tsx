// src/organisms/HouseholdMemberRepeater.tsx
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import { useFormContext } from '../context/FormContext';
import { Member, WoningType } from '../types/household';
import ChipButton from '../components/ChipButton';
import { useAppStyles } from '../styles/useAppStyles';

// ============================================================
// MAIN COMPONENT
// ============================================================

const HouseholdMemberRepeater: React.FC = () => {
  const { state } = useFormContext();
  const { styles } = useAppStyles();

  const woning = (state.C4?.woning ?? null) as WoningType | null;

  const leden = (state.C4?.leden ?? []) as Member[];

  const adults = leden.filter((m) => m.memberType === 'adult');
  const children = leden.filter((m) => m.memberType === 'child');

  return (
    <View style={styles.container}>
      {/* ===================== WONEN ===================== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wonen</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{woning ? `Type: ${woning}` : 'Kies woningtype'}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {(['Koop', 'Huur', 'Kamer', 'Anders'] as WoningType[]).map((w) => (
            <ChipButton
              key={w}
              label={w}
              selected={woning === w}
              onPress={() =>
                state &&
                state.C4 &&
                state.C4 !== undefined &&
                state !== undefined &&
                state !== null &&
                state.C4 !== null &&
                state.C4 !== undefined &&
                state &&
                state !== null &&
                state !== undefined &&
                state.C4 &&
                state.C4 !== null &&
                state.C4 !== undefined &&
                state !== undefined
                  ? state
                  : null
              }
              accessibilityLabel={`Woning: ${w}`}
            />
          ))}
        </ScrollView>
      </View>

      {/* ===================== VOLWASSENEN ===================== */}
      {adults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Volwassenen ({adults.length})</Text>

          {adults.map((member) => (
            <MemberCard
              key={`adult-${leden.indexOf(member)}`}
              member={member}
              index={leden.indexOf(member)}
            />
          ))}
        </View>
      )}

      {/* ===================== KINDEREN ===================== */}
      {children.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kinderen ({children.length})</Text>

          {children.map((member) => (
            <MemberCard
              key={`child-${leden.indexOf(member)}`}
              member={member}
              index={leden.indexOf(member)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default HouseholdMemberRepeater;

// ============================================================
// MEMBER CARD
// ============================================================

type MemberCardProps = {
  member: Member;
  index: number;
};

const MemberCard: React.FC<MemberCardProps> = ({ member: m, index }) => {
  const { dispatch } = useFormContext();
  const { styles } = useAppStyles();

  return (
    <View style={styles.card}>
      {/* Naam */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Naam</Text>
        <TextInput
          style={styles.input}
          value={m.naam ?? ''}
          placeholder="Bijv. Jan de Vries"
          onChangeText={(text) =>
            dispatch({
              type: 'UPDATE_MEMBER_FIELD',
              payload: {
                index,
                field: 'naam',
                value: text,
                meta: { phase: 'change' },
              },
            })
          }
          onBlur={() =>
            dispatch({
              type: 'UPDATE_MEMBER_FIELD',
              payload: {
                index,
                field: 'naam',
                value: m.naam ?? '',
                meta: { phase: 'blur' },
              },
            })
          }
        />
      </View>

      {/* Geboortedatum */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Geboortedatum</Text>
        <TextInput
          style={styles.input}
          value={m.dateOfBirth ?? ''}
          placeholder="DD-MM-YYYY"
          keyboardType="numeric"
          maxLength={10}
          onChangeText={(text) =>
            dispatch({
              type: 'UPDATE_MEMBER_FIELD',
              payload: { index, field: 'dateOfBirth', value: text },
            })
          }
        />
        {m.leeftijd !== undefined && (
          <Text style={styles.helperText}>Leeftijd: {m.leeftijd} jaar</Text>
        )}
      </View>

      {/* Geslacht */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Geslacht</Text>
        <View style={styles.toggleWrapper}>
          {(['man', 'vrouw', 'anders', 'n.v.t.'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.toggleButton,
                m.gender === g ? styles.toggleActive : styles.toggleInactive,
              ]}
              onPress={() =>
                dispatch({
                  type: 'UPDATE_MEMBER_FIELD',
                  payload: { index, field: 'gender', value: g },
                })
              }
            >
              <Text style={styles.toggleText}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};
