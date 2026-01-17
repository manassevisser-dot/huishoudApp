// src/app/context/FormContext.tsx
import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { formReducer } from './formReducer';
import { FormState } from '@shared-types/form';

interface FormContextType {
  state: FormState;
  dispatch: Dispatch<any>;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{
  children: ReactNode;
  initialState: FormState;
  mockDispatch?: Dispatch<any>; // ✅ Voeg dit toe voor tests
}> = ({ children, initialState, mockDispatch }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Gebruik de mock als die er is, anders de echte reducer dispatch
  const activeDispatch = mockDispatch || dispatch;

  return (
    <FormContext.Provider value={{ state, dispatch: activeDispatch }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForm must be used within a FormProvider');
  return context;
};
