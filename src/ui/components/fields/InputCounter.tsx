import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface InputCounterProps {
  label: string;
  value: number;
  onUpdate: (val: number) => void; // Veranderd naar onUpdate om matches te voorkomen
  min?: number;
  max?: number;
}

const InputCounter: React.FC<InputCounterProps> = ({ label, value, onUpdate, min = 0, max = 100 }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
      <Text>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => value > min && onUpdate(value - 1)}><Text style={{ fontSize: 25 }}> - </Text></TouchableOpacity>
        <Text style={{ marginHorizontal: 15 }}>{value}</Text>
        <TouchableOpacity onPress={() => value < max && onUpdate(value + 1)}><Text style={{ fontSize: 25 }}> + </Text></TouchableOpacity>
      </View>
    </View>
  );
};

export default InputCounter;