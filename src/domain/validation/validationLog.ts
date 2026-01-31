import { validateField } from './fieldValidator';

export type ValidationResult = {
  message: string | null;
  severity: 'error' | 'warning' | null;
  isValid: boolean;
};

export function getValidationLog(activeFields: string[], formData: any): Record<string, ValidationResult> {
  const log: Record<string, ValidationResult> = {};

  activeFields.forEach(path => {
    const value = getValueByPath(formData, path);
    const errorMessage = validateField(path, value);

    // Bepaal de status
    const isRequiredButEmpty = (value === '' || value === 'vul in' || value === null);
    
    log[path] = {
      message: errorMessage, 
      severity: errorMessage ? (errorMessage.includes('Let op') ? 'warning' : 'error') : null,
      isValid: !errorMessage && !isRequiredButEmpty
    };
  });

  return log;
}

function getValueByPath(obj: any, path: string) {
  return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
}