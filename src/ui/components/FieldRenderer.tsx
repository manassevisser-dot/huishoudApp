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
        if (field.visibleIf && !field.visibleIf(state)) {
          return null;
        }

        return (
          <FormField
            key={`${pageId || 'field'}-${field.id}`}
            field={field}
            state={state}
            dispatch={dispatch}
            value={state[field.id]}
          />
        );
      })}
    </>
  );
};

export default FieldRenderer;