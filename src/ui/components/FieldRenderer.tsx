import React from 'react';
import { ValueProvider } from '../../domain/interfaces/ValueProvider';
import { StateWriter } from '../../domain/interfaces/StateWriter';

interface FieldRendererProps {
  fieldId: string;
  valueProvider: ValueProvider;
  stateWriter: StateWriter;
  label?: string;
  type?: 'text' | 'number' | 'date';
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  fieldId,
  valueProvider,
  stateWriter,
  label,
  type = 'text'
}) => {
  // ADR-03: Geen directe state access, alleen via provider
  const value = valueProvider.getValue(fieldId) as string | number;

  const handleChange = (newValue: unknown) => {
    stateWriter.updateField(fieldId, newValue);
  };

  return (
    <div className="field-container">
      {label && <label>{label}</label>}
      <input 
        type={type} 
        value={value ?? ''} 
        onChange={(e) => handleChange(e.target.value)} 
      />
    </div>
  );
};