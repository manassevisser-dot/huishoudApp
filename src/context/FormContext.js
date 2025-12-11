import * as React from 'react';
import { Storage } from '../services/storage';
// ============================================================================
// REDUCER
// ============================================================================
const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PAGE_DATA':
            return {
                ...state,
                [action.pageId]: { ...(state[action.pageId] ?? {}), ...action.data },
            };
        case 'LOAD_SAVED_STATE':
            return { ...state, ...action.data };
        case 'SET_USER_ID':
            return { ...state, userId: action.userId };
        case 'RESET_STATE':
            return { userId: null };
        default:
            return state;
    }
};
// ============================================================================
// CONTEXT & PROVIDER
// ============================================================================
const FormContext = React.createContext(undefined);
export const FormProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(formReducer, {});
    // Centralized persistence side-effect: save on any state change
    React.useEffect(() => {
        Storage.saveState(state);
    }, [state]);
    return (<FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>);
};
export const useFormContext = () => {
    const context = React.useContext(FormContext);
    if (!context)
        throw new Error('useFormContext must be used within FormProvider');
    return context;
};
