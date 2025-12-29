import * as React from 'react';
import { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { useForm } from '@app/context/FormContext';

interface Props {
  pageId: string;
  fieldId: string;
  label: string;
  placeholder?: string;
}

export const MoneyField: React.FC<Props> = ({ pageId, fieldId, label, placeholder }) => {
  const { state, dispatch } = useForm() as any;
  const [value, setValue] = useState(state?.data?.[fieldId] || '');

  const handleChange = (text: string) => {
    setValue(text);
    dispatch({ 
      type: 'UPDATE_FIELD', 
      payload: { fieldId: fieldId, value: text } 
    });
  };

  return (
    <View style={{ padding: 10 }}>
      <Text>{label}</Text>
      <TextInput
        value={String(value)}
        onChangeText={handleChange}
        placeholder={placeholder}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, padding: 5 }}
      />
    </View>
  );
};
