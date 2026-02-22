/**
 * @file_intent Definieert het `UndoScreen`, een UI-component voor het beheren van transactiegeschiedenis. Het stelt gebruikers in staat om acties ongedaan te maken (undo), opnieuw uit te voeren (redo) en alle transacties te wissen.
 * @repo_architecture UI Layer - Screen. Dit scherm volgt het "Dumb UI" principe (ADR-04) en bevat alleen presentatie-logica. Alle state management en business logica worden afgehandeld door de `useTransactionHistory` hook, wat zorgt voor een duidelijke scheiding der machten (ADR-01).
 * @term_definition
 *   - `useTransactionHistory`: Een custom hook die de state en acties voor de transactiegeschiedenis levert (`transactions`, `undo`, `redo`, `clearAll`).
 *   - `_debugAdapterState`: Een state-property die alleen voor debug-doeleinden wordt gebruikt om de interne staat van de onderliggende adapter te inspecteren. Deze wordt niet getoond in test-omgevingen.
 * @contract Het component rendert een lijst van recente transacties. Het toont knoppen voor "Undo", "Redo", en "Verwijder Alles". Deze knoppen worden uitgeschakeld op basis van de state die door de `useTransactionHistory` hook wordt geleverd (bijv. `undo` is uitgeschakeld als er geen acties zijn om ongedaan te maken). Foutmeldingen worden weergegeven als de `error` state is ingesteld.
 * @ai_instruction Om de weergave van transacties aan te passen, wijzig de `map`-functie binnen de JSX. Om de logica te wijzigen (bijv. hoe undo werkt), pas de `useTransactionHistory` hook aan. De debug-sectie wordt automatisch verborgen in `NODE_ENV=test`. Voeg geen business-logica toe aan dit component; plaats die in de `useTransactionHistory` hook of de onderliggende services.
 */
// src/ui/screens/Daily/UndoScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTransactionHistory } from '@app/hooks/useTransactionHistory';
import { useAppStyles } from '@ui/styles/useAppStyles';

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
