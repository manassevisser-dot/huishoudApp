
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TransactionService } from '@services/transactionService';

export const UndoScreen: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      const data = await TransactionService.getAllTransactions();
      setItems(data);
    };
    fetchTransactions();
  }, []);

  const handleClearAll = async () => {
    await TransactionService.clearAll?.();
    setItems([]); // direct UI updaten
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Laatste transacties: {items.length}</Text>

      {items.length === 0 ? (
        <Text accessibilityRole="text" style={{ marginTop: 8 }}>
          Geen recente transacties
        </Text>
      ) : (
        <View testID="tx-list" style={{ marginTop: 8 }}>
          {items.map((item) => (
            <Text key={item.id}>{item.description}</Text>
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={handleClearAll}
        style={{ marginTop: 20, backgroundColor: 'red', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Verwijder alles</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UndoScreen;
