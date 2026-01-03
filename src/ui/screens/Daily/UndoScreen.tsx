import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// Verwijder de wildcard import als die voor problemen zorgt, 
// of gebruik de named export:
import { TransactionService } from '@services/transactionService';

export const UndoScreen: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Geen 'as any' meer nodig!
    const fetchTransactions = async () => {
      const data = await TransactionService.getAllTransactions();
      setItems(data);
    };
    fetchTransactions();
  }, []);

  const handleClearAll = async () => {
    await TransactionService.clearAll();
    setItems([]); // Update de UI direct
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Laatste transacties: {items.length}</Text>
      
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