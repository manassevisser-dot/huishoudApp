//=====
// src/screens/Daily/UndoScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/AppStyles';
import { TransactionService } from '../../services/transactionService';
import { DailyTransaction } from '../../types/transaction';
import { formatCurrency } from '../../utils/numbers';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  onClose: () => void;
};

const UndoScreen: React.FC<Props> = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [transactions, setTransactions] = React.useState<DailyTransaction[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const loadTransactions = React.useCallback(async () => {
    setLoading(true);
    const data = await TransactionService.list(5);
    setTransactions(data);
    setSelectedIds([]);
    setLoading(false);
  }, []);
  
  React.useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);
  
  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    
    Alert.alert(
      'Wissen bevestigen',
      `Weet u zeker dat u ${selectedIds.length} transactie(s) wilt verwijderen?`,
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Wissen',
          style: 'destructive',
          onPress: async () => {
            const success = await TransactionService.deleteMultiple(selectedIds);
            if (success) {
              Alert.alert('Success', 'Transacties verwijderd!');
              await loadTransactions();
            } else {
              Alert.alert('Fout', 'Kon transacties niet verwijderen');
            }
          },
        },
      ]
    );
  };
  
  return (
    <View style={theme === 'dark' ? styles.containerDark : styles.container}>
      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}>
          <Text style={styles.pageTitle}>Herstel laatste uitgave</Text>
          
          {loading ? (
            <Text>Laden...</Text>
          ) : transactions.length === 0 ? (
            <View style={styles.dashboardCard}>
              <Text style={styles.summaryDetail}>
                Geen recente transacties gevonden
              </Text>
              <TouchableOpacity 
                style={[styles.button, { marginTop: 16, marginLeft: 0 }]} 
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Terug naar Dashboard</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.summaryDetail}>
                Selecteer 1 of meer transacties om te verwijderen:
              </Text>
              {transactions.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.dashboardCard,
                    { marginBottom: 12 },
                    selectedIds.includes(t.id || '') && { borderColor: '#007AFF', borderWidth: 2 },
                  ]}
                  onPress={() => toggleSelection(t.id || '')}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>{t.category}</Text>
                      <Text style={styles.summaryDetail}>
                        {t.date} • {t.paymentMethod}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>
                        {formatCurrency(t.amount)}
                      </Text>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: selectedIds.includes(t.id || '') ? '#007AFF' : '#D1D1D6',
                          backgroundColor: selectedIds.includes(t.id || '') ? '#007AFF' : '#FFF',
                          marginTop: 8,
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: '#FF3B30', marginTop: 16, marginLeft: 0 },
                  selectedIds.length === 0 && { opacity: 0.5 },
                ]}
                onPress={handleDelete}
                disabled={selectedIds.length === 0}
              >
                <Text style={styles.buttonText}>Wissen ({selectedIds.length})</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
      
      <View style={[styles.buttonContainer, { bottom: insets.bottom, paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Terug naar Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UndoScreen;