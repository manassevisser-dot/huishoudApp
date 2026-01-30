// src/types/common.ts

// Replace 'any' in generic functions
export type AnyObject = Record<string, unknown>;
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

// For storage/serialization
export type Serializable = JsonValue;

// For event handlers
export type VoidFunction = () => void;
export type Callback<T = void> = (value: T) => void;

// For validation results
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

// For async operations
export type AsyncResult<T> = Promise<{ success: boolean; data?: T; error?: string }>;