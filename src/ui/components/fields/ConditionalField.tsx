import React from 'react';

// ✅ Geen domain imports hier!

interface ConditionalFieldProps {
  parentFieldId: string;
  condition: (value: unknown) => boolean;
  valueProvider: {
    getValue: (id: string) => unknown;
  };
  children: React.ReactNode;
}

export const ConditionalField: React.FC<ConditionalFieldProps> = ({
  parentFieldId,
  condition,
  valueProvider,
  children,
}) => {
  const value = valueProvider.getValue(parentFieldId);

  if (!condition(value)) {
    return null;
  }

  return <>{children}</>;
};

export default ConditionalField;
