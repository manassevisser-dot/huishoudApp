import React from 'react';
import { ValueProvider, StateWriter } from '@domain/interfaces';

interface FieldRendererProps {
  fieldId: string;
  valueProvider: ValueProvider;
  stateWriter: StateWriter;
  type: 'text' | 'number' | 'radio' | 'counter' | 'money';
  label?: string;
  options?: string[];
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  fieldId,
  valueProvider,
  stateWriter,
  type,
  label,
  options
}) => {
  const value = valueProvider.getValue(fieldId);

  const handleChange = (newValue: unknown) => {
    stateWriter.updateField(fieldId, newValue);
  };

  // Render logic remains pure projection based on type
  switch (type) {
    case 'text':
      return <input type="text" value={String(value ?? '')} onChange={(e) => handleChange(e.target.value)} />;
    case 'number':
    case 'counter':
      return <input type="number" value={Number(value) || 0} onChange={(e) => handleChange(Number(e.target.value))} />;
    case 'radio':
      return (
        <div>
          {options?.map(opt => (
            <label key={opt}>
              <input
                type="radio"
                checked={value === opt}
                onChange={() => handleChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    case 'money':
      return <input type="text" value={String(value ?? '')} onChange={(e) => handleChange(e.target.value)} />;
    default:
      return <span>Unknown field type</span>;
  }
};