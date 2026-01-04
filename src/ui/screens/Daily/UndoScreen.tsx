import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TransactionService } from '@services/transactionService';

export const UndoScreen: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      const data = await TransactionService.getAllTransactions();
      setItems(data || []);
    };
    fetchTransactions();
  }, []);

  const handleClearAll = async () => {
    await TransactionService.clearAll?.();
    setItems([]);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>
        Laatste transacties: {items.length}
      </Text>

      {items.length === 0 ? (
        <Text style={{ marginTop: 8 }}>Geen recente transacties</Text>
      ) : (
        <ScrollView style={{ marginTop: 8 }}>
          {items.map((item) => (
            <View key={item.id} style={{ paddingVertical: 4 }}>
              {/* ✅ VOEG DIT TOE: De omschrijving zodat de test deze kan vinden */}
              <Text>{item.description}: € {item.amount}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={handleClearAll}
        accessibilityRole="button"
        style={{ marginTop: 20, backgroundColor: 'red', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Verwijder Alles</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UndoScreen;