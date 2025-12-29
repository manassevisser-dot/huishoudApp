import * as React from 'react';

import { FieldConfig } from '@shared-types/form';
import { evaluateCondition } from '@utils/conditions';
import FormField from './FormField';

// We definiëren de vorm lokaal zodat de TS-error direct verdwijnt
interface LocalConditionalProps {
  field: FieldConfig & {
    condition?: {
      fieldId: string;
      operator: 'eq' | 'neq' | 'gt' | 'lt';
      value: any;
    };
  };
  state: any;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error: string | null;
}

const ConditionalField: React.FC<LocalConditionalProps> = ({
  field,
  state,
  value,
  onChange,
  error,
}) => {
  // Gebruik de utility om te bepalen of we dit veld moeten tonen
  const isVisible = field.condition 
    ? evaluateCondition(field.condition, state) 
    : true;

  if (!isVisible) return null;

  return (
    <FormField
      field={field}
      value={value}
      onChange={onChange}
      error={error}
      state={state}
    />
  );
};

export default ConditionalField;