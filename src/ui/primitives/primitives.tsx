/**
 * @file_intent Definieert de meest fundamentele, herbruikbare en "domme" UI-bouwstenen (primitives) voor de applicatie, zoals text inputs, buttons en switches.
 * @repo_architecture UI Layer - Primitives/Atoms. Dit is de fundamentele laag van de componenten-hiërarchie, die de basis-elementen levert voor het bouwen van alle andere UI-componenten. Deze componenten zijn volledig losgekoppeld van de domein- of applicatie-state.
 * @term_definition
 *   - `Primitive`: Een stateless, "uncontrolled" React-component dat een core React Native-element omhult. Het ontvangt al zijn data en gedrag via props (`value`, `onAction`) en bevat geen applicatie-specifieke logica.
 * @contract Dit bestand exporteert een set van primitieve componenten (bv. `InputPrimitive`, `TogglePrimitive`). Elk primitief volgt een strikte props-interface. Ze zijn ontworpen om op een hoger niveau te worden samengesteld tot complexere componenten (`Entry`-componenten). Ze halen geen data op, beheren geen applicatie-state en interacteren niet met orchestrators.
 * @ai_instruction Gebruik deze primitives als de bouwstenen voor het creëren van complexere UI-componenten. Wanneer je een nieuw component maakt, controleer dan eerst of het kan worden samengesteld uit deze bestaande primitives. Als een nieuw, echt fundamenteel UI-element nodig is, voeg het dan hier toe. Houd deze componenten eenvoudig, stateless en vrij van applicatie-specifieke logica of complexe styling.
 */
// src/ui/primitives/primitives.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PRIMITIVE_TYPES } from '@ui/kernel';
import type {
  InputPrimitiveProps,
  DatePrimitiveProps,
  CounterPrimitiveProps,
  TogglePrimitiveProps,
  ButtonPrimitiveProps,
  LabelPrimitiveProps,
  ChipPrimitiveProps,
  RadioOptionProps,
} from './primitives.types';
    
  export const RadioOptionPrimitive = ({ label, selected, onSelect }: RadioOptionProps) => (
    <TouchableOpacity onPress={onSelect} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
      <View style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
        <View
          testID="radio-inner-circle"
          style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#000', opacity: selected ? 1 : 0 }}
        />
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
/**
 * PRIMITIVES
 */
export const InputPrimitive = ({ value, onAction, placeholder, keyboardType, style }: InputPrimitiveProps) => (
  <TextInput
    value={value}
    onChangeText={onAction}
    placeholder={placeholder}
    keyboardType={keyboardType}
    style={style}
  />
);
/**
 * TODO:
 *  GEBRUIK MAKEN VAN BESTAANDE DATUM-PRESENTATIE uit domein-laag. De logica bestaat al. 
 * Nu is er duplicatie van datum-formatting tussen deze primitive en de domein-laag. Idealiter zou deze primitive alleen met Date-objecten werken,
 *  en de formatting/parsing zou in de domein-laag moeten gebeuren. Maar dat vereist een aanpassing van hoe de data momenteel door de lagen stroomt. 
 * Dit is een tijdelijke oplossing MAAR WEL VIES.
 */
export const DatePrimitive = ({ value, onDateChange, placeholder, style }: DatePrimitiveProps) => {
    const [show, setShow] = React.useState(false);
    const hasValue = typeof value === 'string' && value.length > 0;
  
    const onChange = (_: DateTimePickerEvent, date?: Date) => {
      setShow(false);
      if (date !== undefined) onDateChange(date.toISOString().split('T')[0]);
    };
  
    return (
      <>
        <TouchableOpacity onPress={() => setShow(true)}>
          <View pointerEvents="none">
            <TextInput
              value={hasValue ? value : ''}
              placeholder={placeholder}
              style={style}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={hasValue ? new Date(value as string) : new Date()}
            mode="date"
            onChange={onChange}
          />
        )}
      </>
    );
  };
export const CounterPrimitive = ({ value, onCounterChange, style }: CounterPrimitiveProps) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
    <TouchableOpacity onPress={() => onCounterChange(value - 1)}><Text>-</Text></TouchableOpacity>
    <Text style={{ marginHorizontal: 15 }}>{value}</Text>
    <TouchableOpacity onPress={() => onCounterChange(value + 1)}><Text>+</Text></TouchableOpacity>
  </View>
);

export const ChipPrimitive = ({ label, selected, onPress, containerStyle, textStyle, accessibilityLabel, testID }: ChipPrimitiveProps) => (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[containerStyle, selected && { opacity: 0.7 }]}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
    >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
export const TogglePrimitive = ({ value, onToggle, style }: TogglePrimitiveProps) => (
  <Switch value={value} onValueChange={onToggle} style={style} />
);

export const ButtonPrimitive = ({ label, onPress, style, textStyle, testID }: ButtonPrimitiveProps) => (
  <TouchableOpacity testID={testID} onPress={onPress} style={style}>
    <Text style={textStyle}>{label}</Text>
  </TouchableOpacity>
);

export const LabelPrimitive = ({ label, value, style, labelStyle, valueStyle }: LabelPrimitiveProps) => (
  <View style={style}>
    <Text style={labelStyle}>{label}</Text>
    <Text style={valueStyle}>{value}</Text>
  </View>
);

type PrimitiveComponent = React.ComponentType<Record<string, unknown>>;

const PRIMITIVE_COMPONENTS: Record<string, PrimitiveComponent> = {
  [PRIMITIVE_TYPES.TEXT]: InputPrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.CURRENCY]: InputPrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.NUMBER]: InputPrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.DATE]: DatePrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.COUNTER]: CounterPrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.TOGGLE]: TogglePrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.CHIP_GROUP]: ChipPrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE]: ChipPrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.RADIO]: RadioOptionPrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.LABEL]: LabelPrimitive as unknown as PrimitiveComponent,
  [PRIMITIVE_TYPES.ACTION]: ButtonPrimitive as unknown as PrimitiveComponent,
};

export const DynamicPrimitive = ({
  primitiveType,
  props,
}: {
  primitiveType: string;
  props: Record<string, unknown>;
}) => {
  const PrimitiveComponent = PRIMITIVE_COMPONENTS[primitiveType];
  if (PrimitiveComponent === undefined) {
    return null;
  }
  return <PrimitiveComponent {...props} />;
};
