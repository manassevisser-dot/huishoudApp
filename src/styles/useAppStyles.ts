
// src/styles/useAppStyles.ts — compat-shim naar @ui/styles/useAppStyles

// Importeer de named export uit de nieuwe locatie
import { useAppStyles } from '../ui/styles/useAppStyles';

// Exporteer dezelfde named export
export { useAppStyles };

// Exporteer óók een default dat naar de named export wijst (compat voor oude imports)
export default useAppStyles;

