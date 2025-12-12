//=====
// src/screens/CSV/CsvUploadScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { csvService } from '../../services/csvService';
import { TransactionService } from '../../services/transactionService';
import { getISOWeek } from '../../utils/date';
import { useAppStyles } from '../../styles/useAppStyles';
type Props = {
  onClose: () => void;
};

const CsvUploadScreen: React.FC<Props> = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const styles = useAppStyles();
  const [csvText, setCsvText] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  
  const handleUpload = async () => {
    try {
      const rows = csvService.parse(csvText);
      
      if (rows.length === 0) {
        Alert.alert('Fout', 'Geen geldige rijen gevonden in CSV');
        return;
      }
      
      if (!csvService.validateRange(rows)) {
        Alert.alert(
          'Datum validatie fout',
          'De datum range in uw CSV overschrijdt de maximale 62 dagen'
        );
        return;
      }
      
      Alert.alert(
        'CSV Uploaden',
        `${rows.length} transacties gevonden. Weet u zeker dat u deze wilt uploaden?`,
        [
          { text: 'Annuleren', style: 'cancel' },
          {
            text: 'Uploaden',
            onPress: async () => {
              setIsUploading(true);
              await csvService.postToN8N({ rows, count: rows.length });
              
              // Mock: Add to local storage
              for (const row of rows) {
                if (row.date && row.amount) {
                  await TransactionService._mockLocalSave({
                    date: row.date,
                    amount: row.amount,
                    category: 'Overig',
                    paymentMethod: 'pin',
                    weekNumber: getISOWeek(new Date(row.date)),
                  });
                }
              }
              
              setIsUploading(false);
              Alert.alert('Success', 'CSV geüpload!', [{ text: 'OK', onPress: onClose }]);
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Parse Error', error.message || 'Ongeldige CSV formaat');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}>
          <Text style={styles.pageTitle}>CSV Upload</Text>
          
          <Text style={styles.label}>Plak uw CSV hier (format: date,amount,note)</Text>
          <TextInput
            style={[styles.input, { height: 200, textAlignVertical: 'top' }]}
            multiline
            placeholder={`date,amount,note\n2024-12-01,25.50,Groceries\n2024-12-02,15.00,Coffee`}
            value={csvText}
            onChangeText={setCsvText}
          />
          
          <TouchableOpacity
            style={[styles.button, { marginTop: 16, marginLeft: 0 }]}
            onPress={handleUpload}
            disabled={isUploading || !csvText.trim()}
          >
            <Text style={styles.buttonText}>
              {isUploading ? 'Uploaden...' : 'Uploaden'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <View style={[styles.buttonContainer, { bottom: insets.bottom, paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Terug</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default CsvUploadScreen
