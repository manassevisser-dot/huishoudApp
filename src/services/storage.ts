import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormState } from '../context/FormContext';

const STORAGE_KEY = '@CashflowWizardState';

export const Storage = {
  async saveState(state: FormState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to storage', e);
    }
  },
  async loadState(): Promise<FormState | null> {
    try {
      const serializedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (serializedState === null) {
        return null;
      }
      return JSON.parse(serializedState);
    } catch (e) {
      console.error('Failed to load state from storage', e);
      return null;
    }
  },
};
