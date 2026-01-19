import React from 'react';
import { UI_SECTIONS } from '@ui/constants/uiSections';
import { FieldRenderer } from '@ui/components/FieldRenderer';
import type { ValueProvider, StateWriter } from '@domain/interfaces';

interface WizardPageProps {
  sectionId: keyof typeof UI_SECTIONS;
  fields: Array<{ fieldId: string, type: any, label?: string, options?: string[] }>;
  valueProvider: ValueProvider;
  stateWriter: StateWriter;
}

export const WizardPage: React.FC<WizardPageProps> = ({
  sectionId,
  fields,
  valueProvider,
  stateWriter
}) => {
  return (
    <div>
      <h2>{UI_SECTIONS[sectionId]}</h2>
      {fields.map(field => (
        <FieldRenderer
          key={field.fieldId}
          fieldId={field.fieldId}
          type={field.type}
          label={field.label}
          options={field.options}
          valueProvider={valueProvider}
          stateWriter={stateWriter}
        />
      ))}
    </div>
  );
};