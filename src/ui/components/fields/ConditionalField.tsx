import React from 'react';
import { ValueProvider } from '@domain/interfaces';

interface ConditionalFieldProps {
  fieldId: string;
  dependentFieldId: string;
  valueProvider: ValueProvider;
  children: React.ReactNode;
}

export const ConditionalField: React.FC<ConditionalFieldProps> = ({
  dependentFieldId,
  valueProvider,
  children
}) => {
  const dependentValue = valueProvider.getValue(dependentFieldId);
  
  // Alleen renderen als waarde bestaat — de domein-laag bepaalt de data-aanwezigheid
  if (dependentValue === undefined || dependentValue === null) {
    return null;
  }

  return <>{children}</>;
};