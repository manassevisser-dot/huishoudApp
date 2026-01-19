import * as React from 'react';
import { FieldConfig, FormState, FormAction } from '@shared-types/form';
import FormField from '@fields/FormField';
import { evaluateVisibleIf } from '../../utils/fieldVisibility';

export interface FieldRendererProps {
  fields: FieldConfig[];
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ fields, state, dispatch }) => {
  return (
    <>
      {fields.map((field) => {
        if (!evaluateVisibleIf(field.visibleIf, state)) {
          return null;
        }

        const section = (field.section ?? 'setup') as keyof FormState['data'];
        const value = (state.data[section] as Record<string, any>)[field.fieldId];

        return (
          <FormField
            key={field.fieldId}
            field={field}
            state={state}
            dispatch={dispatch}
            value={value}
          />
        );
      })}
    </>
  );
};

export default FieldRenderer;