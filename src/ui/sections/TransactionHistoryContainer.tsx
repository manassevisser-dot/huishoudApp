// src/ui/sections/TransactionHistoryContainer.tsx
/**
 * @file_intent Container voor het UNDO-scherm: haalt TransactionHistory op uit FormState,
 *   bouwt ViewModel via factory en geeft door aan de presentatie-component.
 * @repo_architecture UI Layer - Container (Connected Component).
 * @contract
 *   - Leest transactionHistory rechtstreeks uit FormState (via useFormState).
 *   - Bouwt ViewModel via TransactionHistoryVMFactory.build().
 *   - Swipe-to-delete dispatcht PUSH_TRANSACTION (vervanging) of toekomstig DELETE_TRANSACTION.
 *   - Geen formattering, geen business-logica in dit bestand.
 * @ai_instruction
 *   Wijzig presentatie in TransactionHistory (de component), niet hier.
 *   Wijzig ViewModel-structuur in TransactionHistoryVMFactory.
 *   Wijzig teksten in WizStrings.undo.
 */
import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useFormState } from '@ui/providers/FormStateProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { TransactionHistoryVMFactory } from '@app/orchestrators/factory/TransactionHistoryVMFactory';
import type { TransactionHistoryVM, TransactionItemVM } from '@app/orchestrators/factory/TransactionHistoryVMFactory';
import type { FormState } from '@core/types/core';

// ─── Helper: transactionHistory veilig ophalen ────────────────────────────────

function getHistory(state: FormState): FormState['data']['transactionHistory'] {
  return state.data.transactionHistory;
}

// ─── Swipe-delete actie ───────────────────────────────────────────────────────

interface DeleteActionProps {
  onPress: () => void;
}

const DeleteAction = memo(({ onPress, testID }: DeleteActionProps & { testID?: string }) => {
  const { styles } = useAppStyles();
  return (
    <TouchableOpacity
      testID={testID}  // ← gebruik de doorgegeven testID
      style={[styles.button, styles.deleteButton, { justifyContent: 'center', paddingHorizontal: 20 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Verwijder transactie"
    >
      <Text style={styles.buttonText}>🗑</Text>
    </TouchableOpacity>
  );
});

// ─── Één transactie-rij ────────────────────────────────────────────────────────

interface TransactionRowProps {
  item: TransactionItemVM;
  onDelete: (id: string) => void;
}

const TransactionRow = memo(({ item, onDelete }: TransactionRowProps) => {
  const { styles } = useAppStyles();
  const handleDelete = useCallback(() => { onDelete(item.id); }, [item.id, onDelete]);

   return (
    <Swipeable
      renderRightActions={() => (
        <DeleteAction 
          onPress={handleDelete} 
          testID={`delete-${item.id}`}  // ← unieke testID per item
        />
      )}
    >
      <View style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.details}>
          {item.amountDisplay} · {item.date}
          {item.category !== '' ? ` · ${item.category}` : ''}
        </Text>
      </View>
    </Swipeable>
  );
});

// ─── Lege staat ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  vm: Pick<TransactionHistoryVM, 'emptyTitle' | 'emptyMessage'>;
}

const EmptyState = memo(({ vm }: EmptyStateProps) => {
  const { styles } = useAppStyles();
  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.screenTitle}>{vm.emptyTitle}</Text>
      <Text style={styles.summaryLabel}>{vm.emptyMessage}</Text>
    </View>
  );
});

// ─── Presentatie ──────────────────────────────────────────────────────────────

interface TransactionHistoryProps {
  vm: TransactionHistoryVM;
  onDeleteItem: (id: string) => void;
}

const TransactionHistory = memo(({ vm, onDeleteItem }: TransactionHistoryProps) => {
  const { styles } = useAppStyles();

  if (vm.isEmpty === true) {
    return <EmptyState vm={vm} />;
  }

  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.screenTitle}>{vm.title}</Text>

      {vm.present !== null && (
        <TransactionRow item={vm.present} onDelete={onDeleteItem} />
      )}

      {vm.pastItems.map((item) => (
        <TransactionRow key={item.id} item={item} onDelete={onDeleteItem} />
      ))}
    </View>
  );
});

// ─── Connected container ──────────────────────────────────────────────────────
  // Swipe-delete: verwijder een transactie uit past of present.
  // Implementatie: filter past + zet present op eerste resterende past-item.
// ─── Helper: bouwt de nieuwe transactionHistory state na delete ─────
function buildUpdatedHistory(
  current: NonNullable<ReturnType<typeof getHistory>>,
  idToDelete: string,
): { past: typeof current.past; present: typeof current.present; future: [] } {
  const newPast = current.past.filter((tx) => tx.id !== idToDelete);
  const isPresent = current.present !== null && current.present.id === idToDelete;

  if (isPresent) {
    // Present wordt verwijderd → meest recente uit past wordt nieuwe present
    const [newPresent = null, ...remainingPast] = [...newPast].reverse();
    return {
      past: remainingPast.reverse(),
      present: newPresent,
      future: [],
    };
  }

  // Alleen uit past verwijderen
  return { past: newPast, present: current.present, future: [] };
}

// ─── Component ──────────────────────────────────────────────────────
export const TransactionHistoryContainer: React.FC = () => {
  const { state, dispatch } = useFormState();
  const history = getHistory(state);
  const vm = TransactionHistoryVMFactory.build(history);

  const handleDeleteItem = useCallback((id: string) => {
    const current = history;
    if (current === undefined) return;

    const updated = buildUpdatedHistory(current, id);
    dispatch({
      type: 'UPDATE_DATA',
      payload: { transactionHistory: updated },
    });
  }, [history, dispatch]);

  return <TransactionHistory vm={vm} onDeleteItem={handleDeleteItem} />;
};
