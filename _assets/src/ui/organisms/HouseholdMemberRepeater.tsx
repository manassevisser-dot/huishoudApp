// src/organisms/HouseholdMemberRepeater.tsx
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

import { useFormContext } from '@a../a../a../a../a../a../a../a../a../a../a../a../a../a../a../app/context/FormContext';
import { Member, WoningType, AutoCount } from 'src/shared-types/form';
import ChipButton from '@components/ChipButton';
import { useAppStyles } from '@ui/styles/useAppStyles';

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

  const total = leden.length;
  // Reuse the established swipe pattern from Expense/Income:
  // CARD_WIDTH = SCREEN_WIDTH * 0.85; snapToInterval = CARD_WIDTH + 20; paddingRight: 20
  const SCREEN_WIDTH = Dimensions.get('window').width;
  // Iets groter: ~90% van schermbreedte
  const CARD_WIDTH = SCREEN_WIDTH * 0.9;
  const CARD_GAP = 20; // tussenruimte zoals in Expense/Income

  return (
    <View style={styles.container}>
      {/* ===================== VOLWASSENEN ===================== */}
      {adults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Volwassenen ({adults.length})</Text>

          {adults.length > 1 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: CARD_GAP }}
              snapToInterval={CARD_WIDTH + CARD_GAP}
              snapToAlignment="start"
              decelerationRate="fast"
              style={{ marginVertical: 12 }}
            >
              {adults.map((member) => {
                const idx = leden.indexOf(member);
                return (
                  <View
                    key={`adult-${idx}`}
                    style={[styles.card, { width: CARD_WIDTH, marginRight: 20 }]}
                  >
                    {/* Nummerbadge linksboven */}
                    <Text style={styles.cardBadge}>{idx + 1}</Text>
                    <MemberCard member={member} index={idx} />
                    {idx < total - 1 && total > 1 && (
                      <Text style={[styles.navigationHint, styles.hintOverlayBottomRight]}>
                        ----&gt; volgende
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            adults.map((member) => (
              <MemberCard
                key={`adult-${leden.indexOf(member)}`}
                member={member}
                index={leden.indexOf(member)}
              />
            ))
          )}
        </View>
      )}

      {/* ===================== KINDEREN ===================== */}
      {children.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kinderen ({children.length})</Text>

          {children.length > 1 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: CARD_GAP }}
              snapToInterval={CARD_WIDTH + CARD_GAP}
              snapToAlignment="start"
              decelerationRate="fast"
              style={{ marginVertical: 12 }}
            >
              {children.map((member) => {
                const idx = leden.indexOf(member);
                return (
                  <View
                    key={`child-${idx}`}
                    style={[styles.card, { width: CARD_WIDTH, marginRight: 20 }]}
                  >
                    {/* Nummerbadge linksboven */}
                    <Text style={styles.cardBadge}>{idx + 1}</Text>
                    <MemberCard member={member} index={idx} />
                    {idx < total - 1 && total > 1 && (
                      <Text style={[styles.navigationHint, styles.hintOverlayBottomRight]}>
                        ----&gt; volgende
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            children.map((member) => (
              <MemberCard
                key={`child-${leden.indexOf(member)}`}
                member={member}
                index={leden.indexOf(member)}
              />
            ))
          )}
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
        <Text style={styles.fieldLabel}>Naam</Text>
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
        <Text style={styles.fieldLabel}>Geboortedatum</Text>
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
        <Text style={styles.fieldLabel}>Geslacht</Text>
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
