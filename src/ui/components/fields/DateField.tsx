// src/ui/components/fields/DateField.tsx
import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { DateViewModel } from '@ui/types/viewModels';

interface DateFieldProps {
  viewModel: DateViewModel;
}

const DateField: React.FC<DateFieldProps> = ({ viewModel }) => {
  const [show, setShow] = React.useState(false);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (event.type === 'dismissed' || date === undefined || date === null) {
      return;
    }
    
    viewModel.onChange(date);
  };

  // We gebruiken de toLocaleDateString omdat displayValue (nog) niet in de registry interface staat
  const displayString = (viewModel.value !== undefined && viewModel.value !== null) 
  ? viewModel.value.toLocaleDateString('nl-NL') 
  : 'Kies een datum';

  return (
    <View style={viewModel.containerStyle}>
      <Text style={viewModel.labelStyle}>{viewModel.label}</Text>
      
      <Pressable
        onPress={() => setShow(true)}
        // We plakken de containerStyle ook op de pressable voor de omlijning/padding
        style={viewModel.containerStyle}
      >
        <Text>
          {displayString}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          mode="date"
          // De orchestrator garandeert dat viewModel.value een Date is of een fallback heeft
          value={viewModel.value ?? new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Optionele error weergave op basis van de Base interface */}
      {(viewModel.error !== null && viewModel.error !== undefined && viewModel.error !== '') ? (
  <Text style={viewModel.errorStyle}>{viewModel.error}</Text>
) : null}
    </View>
  );
};

export default DateField;