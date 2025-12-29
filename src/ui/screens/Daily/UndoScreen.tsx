import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TransactionService } from '../../../services/transactionService';

export const UndoScreen: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Gebruik de nieuwe method name
    TransactionService.getAllTransactions().then(setItems);
  }, []);

  const handleClearAll = () => {
    TransactionService.clearAll();
    setItems([]);
  };

  return (
    <View>
      <Text>Laatste transacties: {items.length}</Text>
      <TouchableOpacity onPress={handleClearAll}>
        <Text>Verwijder alles</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UndoScreen;