//=====
// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = '@CashflowWizardState';
export const Storage = {
    async saveState(state) {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
        catch (e) {
            console.error('Failed to save state to storage', e);
        }
    },
    async loadState() {
        try {
            const serializedState = await AsyncStorage.getItem(STORAGE_KEY);
            if (serializedState === null) {
                return null;
            }
            return JSON.parse(serializedState);
        }
        catch (e) {
            console.error('Failed to load state from storage', e);
            return null;
        }
    },
    // NEW P2 method
    async clearAllState() {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        }
        catch (e) {
            console.error('Failed to clear state from storage', e);
        }
    },
};
