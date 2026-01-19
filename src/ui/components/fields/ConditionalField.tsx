import React from 'react';
import { ValueProvider } from '../../../domain/interfaces/ValueProvider';

interface ConditionalFieldProps {
  fieldId: string;
  dependentFieldId: string;
  expectedValue: unknown;
  valueProvider: ValueProvider;
  children: React.ReactNode;
}

export const ConditionalField: React.FC<ConditionalFieldProps> = ({
  dependentFieldId,
  expectedValue,
  valueProvider,
  children
}) => {
  const actualValue = valueProvider.getValue(dependentFieldId);
  const isVisible = actualValue === expectedValue;

  if (!isVisible) return null;
  return <>{children}</>;
};