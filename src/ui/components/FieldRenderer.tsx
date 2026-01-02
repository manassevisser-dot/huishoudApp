import * as React from 'react';
import { FieldConfig, FormState, FormAction } from '@shared-types/form';
import FormField from './fields/FormField';

export interface FieldRendererProps {
  fields: FieldConfig[];
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ fields, state, dispatch }) => {
  return (
    <>
      {fields.map((field) => {
        // ✅ Evalueer zichtbaarheid
        let isVisible = true;

        if (typeof field.visibleIf === 'function') {
          isVisible = field.visibleIf(state);
        } else if (typeof field.visibleIf === 'string') {
          // Check in de setup sectie of het veld 'waar' is
          isVisible = !!(state.data.setup as any)[field.visibleIf];
        }

        if (!isVisible) return null;

        // Phoenix SSOT: Haal de waarde op uit de juiste sectie
        const section = field.section ?? 'setup';
        const value = (state.data[section] as any)[field.fieldId];

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