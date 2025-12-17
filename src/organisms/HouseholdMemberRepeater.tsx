// src/organisms/HouseholdMemberRepeater.tsx
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFormContext } from '../context/FormContext';
import { Member } from '../types/household';

type HouseholdMemberRepeaterProps = {
  // Props indien nodig
};

const HouseholdMemberRepeater: React.FC<HouseholdMemberRepeaterProps> = () => {
  const { state, dispatch } = useFormContext();

  // Haal data uit state
  const aantalMensen = Number(state.C1?.aantalMensen ?? 0);
  const aantalVolwassen = Number(state.C1?.aantalVolwassen ?? 0);
  const leden = (state.C4?.leden ?? []) as Member[];

  console.log('[C4-REPEATER] intake', {
    aantalMensen,
    aantalVolwassen,
    ledenLen: leden.length,
  });

  // Split in volwassenen en kinderen
  const adults = leden.filter((m) => m.memberType === 'adult');
  const children = leden.filter((m) => m.memberType === 'child');

  console.log('[C4-REPEATER] render cards', {
    adultsLen: adults.length,
    childrenLen: children.length,
  });

  return (
    <View style={styles.container}>
      {/* Volwassenen sectie */}
      {adults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Volwassenen ({adults.length})
          </Text>
          {adults.map((member, idx) => {
            const index = leden.indexOf(member);
            return (
              <MemberCard
                key={`adult-${index}`}
                member={member}
                index={index}
              />
            );
          })}
        </View>
      )}

      {/* Kinderen sectie */}
      {children.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Kinderen ({children.length})
          </Text>
          {children.map((member, idx) => {
            const index = leden.indexOf(member);
            return (
              <MemberCard
                key={`child-${index}`}
                member={member}
                index={index}
              />
            );
          })}
        </View>
      )}

      {/* Debug info (verwijder in productie) */}
      {__DEV__ && (
        <View style={styles.debugBox}>
          <Text style={styles.debugText}>
            Debug: {leden.length} leden totaal
          </Text>
        </View>
      )}
    </View>
  );
};

// ============================================
// MEMBER CARD COMPONENT
// ============================================

type MemberCardProps = {
  member: Member;
  index: number;
};

const MemberCard: React.FC<MemberCardProps> = ({ member: m, index }) => {
  const { dispatch } = useFormContext();

  return (
    <View style={styles.card}>
      {/* Naam veld */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Naam</Text>
        <TextInput
          style={styles.input}
          value={m.naam ?? ''}
          placeholder="Bijv. Jan de Vries"
          onChangeText={(text: string) =>
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

      {/* Geboortedatum veld */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Geboortedatum</Text>
        <TextInput
          style={styles.input}
          value={m.dateOfBirth ?? ''}
          placeholder="DD-MM-YYYY"
          keyboardType="numeric"
          maxLength={10}
          onChangeText={(text: string) =>
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

      


{/* Geslacht veld */}
<View style={styles.fieldContainer}>
  <Text style={styles.label}>Geslacht</Text>
  <View style={styles.buttonGroup}>
    {(['man', 'vrouw', 'anders', 'n.v.t.'] as const).map((g) => {
      const label = g === 'n.v.t.' ? 'n.v.t.' : g.charAt(0).toUpperCase() + g.slice(1);
      return (
        <TouchableOpacity
          key={g}
          style={[styles.button, m.gender === g && styles.buttonActive]}
          onPress={() =>
            dispatch({
              type: 'UPDATE_MEMBER_FIELD',
              payload: { index, field: 'gender', value: g },
            })
          }
        >
          <Text style={[styles.buttonText, m.gender === g && styles.buttonTextActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
</View>


    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  buttonTextActive: {
    color: '#fff',
  },
  debugBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    fontFamily: 'monospace',
  },
});

export default HouseholdMemberRepeater;