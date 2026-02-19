// src/ui/screens/Daily/UndoScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTransactionHistory } from '@app/hooks/useTransactionHistory';
import { useAppStyles } from '@ui/styles/useAppStyles';

/**
 * UndoScreen - Transaction Management UI
 *
 * @architecture
 * - ADR-01 (SoC): Alleen presentatie logica, geen business rules
 * - ADR-04 (Dumb UI): Pure projector section (State in → View uit)
 */
export const UndoScreen: React.FC = () => {
  const { styles } = useAppStyles();
  const { transactions, undo, redo, clearAll, updateTransaction, error, _debugAdapterState } =
    useTransactionHistory();

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Transaction Undo/Redo</Text>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Laatste transacties: {safeTransactions.length}</Text>
          {safeTransactions.length === 0 ? (
            <Text style={styles.emptyText}>Geen recente transacties</Text>
          ) : (
            <View style={styles.dashboardCard}>
              {' '}
              {/* Gebruik bestaande card als container */}
              {safeTransactions.map((tx) => (
                <View key={tx.id} style={{ paddingVertical: 8 }}>
                  <Text style={styles.description}>{tx.description}</Text>
                  <Text style={styles.details}>
                    {tx.currency} {(tx.amount / 100).toFixed(2)} • {tx.date}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
            <TouchableOpacity
              onPress={undo}
              style={styles.button}
              testID="undo-button"
              disabled={!undo}
            >
              <Text style={styles.buttonText}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={redo}
              style={styles.button}
              testID="redo-button"
              disabled={!redo}
            >
              <Text style={styles.buttonText}>Redo</Text>
            </TouchableOpacity>
            {safeTransactions.length > 0 && (
              <TouchableOpacity
                onPress={clearAll}
                accessibilityRole="button"
                accessibilityLabel="Verwijder Alles"
                testID="delete-all-button"
                style={[styles.button, styles.deleteButton]}
                disabled={!clearAll}
              >
                <Text style={styles.buttonText}>Verwijder Alles</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Debug Section — alleen buiten tests */}
          {process.env.NODE_ENV !== 'test' && _debugAdapterState && (
            <View style={styles.dashboardCard}>
              <Text style={styles.subtitle}>Debug Info</Text>
              <Text style={styles.details}>{JSON.stringify(_debugAdapterState, null, 2)}</Text>
              <TouchableOpacity
                onPress={() => updateTransaction && updateTransaction(100.5, 2)}
                style={{ marginTop: 12 }}
                testID="float-test-button"
                disabled={!updateTransaction}
              >
                <Text style={styles.navigationHint}>Test Float Violation (100.5)</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
