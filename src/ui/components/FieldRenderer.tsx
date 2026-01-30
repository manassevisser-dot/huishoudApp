import React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '@styles/useAppStyles';

// Explicit interface definition for type safety
interface ValueProvider {
  getValue(fieldId: string): unknown;
}

interface FieldRendererProps {
  fieldId: string;
  valueProvider: ValueProvider;
}

/**
 * P3 UI Decoupling: Field Renderer Component
 * 
 * ADR-01 Enforcement: Imports types from @app, not @domain directly
 * ADR-04 Enforcement: Dumb component - no business logic, only rendering
 * 
 * @param fieldId - Field identifier
 * @param valueProvider - Provider for reading field values
 */
export const FieldRenderer: React.FC<FieldRendererProps> = ({
  fieldId,
  valueProvider,
}) => {
  const { styles } = useAppStyles();
  
  // Read value from provider (no business logic here!)
  const value: unknown = valueProvider.getValue(fieldId);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.description}>
        {String(value ?? '')}
      </Text>
    </View>
  );
};