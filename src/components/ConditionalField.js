import React from 'react';
import { useFormContext } from '../context/FormContext';
import { evaluateCondition } from '../utils/conditions';
const ConditionalField = ({ conditional, pageId, children, }) => {
    const { state } = useFormContext();
    const visible = evaluateCondition(conditional, state, pageId);
    if (!visible)
        return null;
    return <>{children}</>;
};
export default ConditionalField;
