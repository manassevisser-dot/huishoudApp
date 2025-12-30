import * as React from 'react';
import { FieldConfig, FormState, FormAction } from '@shared-types/form';
import FormField from './fields/FormField';

export interface FieldRendererProps {
  fields: FieldConfig[];
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  pageId?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ 
  fields, 
  state, 
  dispatch, 
  pageId 
}) => {
  return (
    <>
      {fields.map((field) => {
        // View logic: check visibility
        const isVisible = typeof field.visibleIf === 'function' 
  ? field.visibleIf(state) 
  : field.visibleIf 
    ? !!state.data.setup[field.visibleIf] // Als het een string is, check of die waarde bestaat
    : true;

        return (
          <FormField
            key={`${pageId || 'field'}-${field.fieldId}`}
            field={field}
            state={state}
            dispatch={dispatch}
            value={state[field.fieldId]}
          />
        );
      })}
    </>
  );
};

export default FieldRenderer;