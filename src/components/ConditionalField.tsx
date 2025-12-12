import React from 'react';
import { useFormContext } from '../context/FormContext';
import { ConditionalConfig } from '../types/form';
import { evaluateCondition } from '../utils/conditions';

export type ConditionalFieldProps = {
  conditional?: ConditionalConfig;
  pageId: string;
  children: React.ReactNode;
};

const ConditionalField: React.FC<ConditionalFieldProps> = ({
  conditional,
  pageId,
  children,
}) => {
  const { state } = useFormContext();
  const visible = evaluateCondition(conditional, state, pageId);

  if (!visible) return null;

  return <>{children}</>;
};

export default ConditionalField;
