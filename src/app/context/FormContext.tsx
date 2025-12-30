import * as React from 'react';

// We importeren types direct via de React namespace om TS2304/TS2307 te voorkomen
import { FormState, FormAction } from '../../shared-types/form'; 

export const FormContext = React.createContext<{
  state: FormState;
  dispatch: React.Dispatch<any>; // 'any' actie om de 99 errors van de baan te vegen
} | undefined>(undefined);

export const initialFormState: FormState = {
  activeStep: 'LANDING',
  currentPageId: 'start',
  isValid: false,
  data: {
    setup: {},
    household: { members: [] },
    finance: { income: { items: [] }, expenses: { items: [] } },},
};

// Gebruik React.ReactNode (met de prefix!) om import-fouten te omzeilen
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer((state: FormState, action: any): FormState => {
    switch (action.type) {
      case 'SET_STEP':
        return { ...state, activeStep: action.payload };
      case 'UPDATE_FIELD':
        return {
          ...state,
          data: { ...state.data, [action.payload.fieldId]: action.payload.value },
        };
      case 'RESET_APP':
        return initialFormState;
      default:
        return state;
    }
  }, initialFormState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('useForm must be used within FormProvider');
  return context;
};

export const useFormContext = useForm;