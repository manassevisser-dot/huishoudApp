// src/adapters/undo/stateful.ts

export type StateUndoResult = { success: boolean; message?: string };

export const undo = (): StateUndoResult | null => {
  // logic
  return { success: true };
};
