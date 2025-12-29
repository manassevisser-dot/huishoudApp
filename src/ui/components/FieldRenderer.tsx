import * as React from 'react';
import { View, Text, TextInput, ScrollView, Dimensions } from 'react-native';
import { useForm } from '@app/context/FormContext';
import { WIZARD_KEYS, WizardPageId } from '@domain/constants/datakeys';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { calculateAge } from '@utils/date';

// Jouw "Gouden Standaard" componenten [cite: 31, 25]
import InputCounter from '@fields/InputCounter';
import DateField from '@fields/DateField';
import MoneyInput from '@fields/MoneyInput';
import ChipButton from '@fields/ChipButton';
import ToggleSwitch from '@fields/ToggleSwitch';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_GAP = 20;

export const FieldRenderer: React.FC<FieldRendererProps & {children?: React.ReactNode}> = (props) => {
  const { state, dispatch } = useForm() as any;
  const { styles, colors } = useAppStyles() as any; // Gebruikt jouw centrale stijlen [cite: 3, 4]

  // 1. Zichtbaarheid check (UI-Logica)
  if (field.visibleIf && !field.visibleIf(state)) {
    return null;
  }

  // 2. Data mapping naar SSOT
  const storageKey = WIZARD_KEYS[pageId as WizardPageId] || pageId;
  const value = state[storageKey]?.[field.id] ?? field.defaultValue;

  // 3. Render logica per type
  switch (field.type) {
    case 'counter':
      return (
        <InputCounter
          label={field.label}
          value={value}
          onValueChange={(newVal) => dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: pageId, value: field.id, newVal } })} // Koppeling naar onValueChange [cite: 25]
          min={field.min}
          max={field.max ?? (field.maxGetter ? field.maxGetter(state) : 10)}
        />
      );

    case 'text':
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={value}
            placeholder={field.placeholder}
            onChangeText={(text) => dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: pageId, value: field.id, text } })}
          />
        </View>
      );

    case 'date-input':
      return (
        <DateField // Gebruikt jouw DateField + useDobInput masking 
          label={field.label}
          value={value}
          onChange={(text) => dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: pageId, value: field.id, text } })}
        />
      );

    case 'money':
      return (
        <MoneyInput // Jouw "Gouden Standaard" voor valuta [cite: 31, 32]
          label={field.label}
          value={value}
          onChange={(val) => dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: pageId, value: field.id, val } })}
          placeholder={field.placeholder}
        />
      );

    case 'radio-chips':
      return (
        <ChipButton
          label={field.label}
          options={field.options}
          selected={value}
          onSelect={(val) => dispatch({ type: 'UPDATE_FIELD', payload: { fieldId: pageId, value: field.id, val } })}
        />
      );

    case 'derived-label':
      return (
        <View style={styles.section}>
          <Text style={[styles.helperText, { fontWeight: 'bold' }]}>
            {field.label}: {field.valueGetter(state)}
          </Text>
        </View>
      );

    case 'repeater': {
      // De swipe-logica uit je HouseholdMemberRepeater [cite: 9, 10, 11]
      const items = state[storageKey]?.[field.id] || [];
      return (
        <ScrollView
          horizontal
          pagingEnabled
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: CARD_GAP }}
        >
          {items.map((item: any, index: number) => (
            <View key={item.id || index} style={[styles.card, { width: CARD_WIDTH, marginRight: CARD_GAP }]}>
              <Text style={styles.cardBadge}>{index + 1}</Text>
              
              {/* Render de sub-velden voor elk lid (Naam, DOB, etc) */}
              {field.fields.map((subField: any) => (
                <View key={subField.id} style={{ marginBottom: 15 }}>
                   <SubFieldRenderer 
                      field={subField} 
                      pageId={pageId} 
                      index={index} 
                      itemValue={item[subField.id]}
                      storageKey={storageKey}
                      arrayId={field.id}
                   />
                </View>
              ))}
              
              {/* Leeftijd helper (uit jouw date.ts)  */}
              {item.dateOfBirth && (
                <Text style={styles.helperText}>
                  Berekende leeftijd: {calculateAge(item.dateOfBirth)} jaar
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      );
    }

    default:
      return null;
  }
};

/**
 * Helper component voor velden binnen een repeater/array.
 * Gebruikt UPDATE_ARRAY_ITEM om specifiek één item aan te passen.
 */
const SubFieldRenderer = ({ field, pageId, index, itemValue, storageKey, arrayId }: any) => {
  const { dispatch } = useForm() as any;
  
  const handleChange = (newValue: any) => {
    dispatch({
      type: 'UPDATE_ARRAY_ITEM',
      payload: {
        storageKey,
        field: arrayId, // bijv. 'leden'
        index,
        value: { [field.id]: newValue }
      }
    });
  };

  // Hergebruik de logica van de hoofdrenderer maar met de dispatch
  // (In een echte app zou je dit nog verder abstraheren, maar voor nu houdt dit het simpel)
  if (field.type === 'text') {
    return <TextInput value={itemValue} onChangeText={handleChange} placeholder={field.placeholder} style={{ borderBottomWidth: 1 }} />;
  }
  if (field.type === 'date-input') {
    return <DateField value={itemValue} onChange={handleChange} label={field.label} />;
  }
  // ... voeg andere sub-types toe naar behoefte
  return null;
};