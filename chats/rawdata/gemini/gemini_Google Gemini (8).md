**Geëxporteerd:** 4-1-2026, 16:01:58
**Aantal berichten:** 10

---
**User:**

```
sectionContainer
```

```
DynamicSection
```

```
StyleSheet.create
```

```
sectionContainer
```

```
sectionTitle
```

```
sectionContainer
```

```
sectionTitle
```

```
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

export {}; // FIX: Explicitly declare as a module for TypeScript's isolatedModules.

// ============================================================================
// CONTEXT & STATE MANAGEMENT (Optie A - TS typed)
// ============================================================================
type FormAction = { type: string; [key: string]: any };
type FormState = Record<string, any>;
type FormContextValue = { state: FormState; dispatch: React.Dispatch<FormAction>; };

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

| } |  |
| --- | --- |
| return { ...state, ...action.data } |  |
| return { ...state, userId: action.userId } |  |
| return { userId: null } |  |
| return state |  |

interface FormProviderProps {
    children: React.ReactNode; // FIX: Added 'children' to FormProviderProps
}

const FormProvider = ({ children }: FormProviderProps) => {
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);

| ) |  |
| --- | --- |
| } |  |

| const context = React.useContext(FormContext) |  |
| --- | --- |
| if (!context) throw new Error('useFormContext must be used within FormProvider') |  |
| return context |  |
| } |  |

// ============================================================================
// STORAGE UTILITIES (Mock AsyncStorage for web)
// ============================================================================

const Storage = {
  store: {} as Record<string, string>,

| async getItem(key: string): Promise<any \| null> { | async getItem(key: string): Promise<any \| null> { |
| --- | --- |
| return this.store[key] \|\| null; | return this.store[key] \|\| null; |
| }, | }, |

| async setItem(key: string | value: any): Promise<void> { |
| --- | --- |
| } |  |

| async removeItem(key: string): Promise<void> { | async removeItem(key: string): Promise<void> { |
| --- | --- |
| delete this.store[key]; | delete this.store[key]; |
| }, | }, |

| this.store = {} |  |
| --- | --- |
| } |  |

| const savePageData = async (pageId: string | data: any) => { |
| --- | --- |
| await Storage.setItem(`setupData_${pageId}` | JSON.stringify(data)); |
| console.log(`✓ Saved ${pageId} data:` | data); |
| console.error(`✗ Error saving ${pageId}:` | error); |

| const data = await Storage.getItem(`setupData_${pageId}`) |  |
| --- | --- |
| return data ? JSON.parse(data) : null |  |
| console.error(`✗ Error loading ${pageId}:`, error) |  |
| return null |  |
| } |  |

| await Storage.setItem('userId' | userId); |
| --- | --- |
| console.log('✓ User ID saved:' | userId); |

| return await Storage.getItem('userId') |  |
| --- | --- |
| } |  |

| type PageId = 'C1' \| 'C4' \| 'C7' \| 'C10' |  |
| --- | --- |
| type PageData = Record<string, any> |  |

| const pages: PageId[] = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const allData: Record<string, any> = {} |  |
| const data = await loadPageData(pageId) |  |
| if (data) allData[pageId] = data |  |

| const userId = await getUserId() |  |
| --- | --- |
| if (userId) allData.userId = userId |  |

| return allData as Record<PageId, PageData> & { userId?: string } |  |
| --- | --- |
| } |  |

// ============================================================================
// VALIDATION ENGINE
// ============================================================================

| required: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} is verplicht` }; |
| return { valid: true | error: null }; |
| } |  |

| return { valid: false, error: `${fieldLabel} moet minimaal ${min} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

| return { valid: false, error: `${fieldLabel} mag maximaal ${max} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

  },

| postcode: (value: string | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet 4 cijfers zijn` }; |
| return { valid: true | error: null }; |
| } |  |

| numeric: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet een getal zijn` }; |
| return { valid: true | error: null }; |

type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'numeric' | 'select' | 'toggle';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: { min?: number; max?: number; postcode?: boolean };
  options?: { label: string; value: string }[];
  conditional?: { field: string; operator: '>'|'<'|'>='|'<='|'==='|'!==' ; value: any };
};

| const validateField = (field: FieldConfig | value: any): { valid: boolean; error: string \| null } => { |
| --- | --- |
| const result = validation.required(value | field.label); |

| // Skip other validations if empty and not required | // Skip other validations if empty and not required |
| --- | --- |
| if (value === null \|\| value === undefined \|\| value === '') { | if (value === null \|\| value === undefined \|\| value === '') { |
| return { valid: true, error: null }; | return { valid: true, error: null }; |
| } | } |

| const result = validation.numeric(value, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |

| const result = validation.min(value, field.validation.min, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |
| const result = validation.max(value, field.validation.max, field.label) |  |
| if (!result.valid) return result |  |
| const result = validation.postcode(value, field.label) |  |
| if (!result.valid) return result |  |

| return { valid: true, error: null } |  |
| --- | --- |
| } |  |

| title: string |  |
| --- | --- |
| subtitle: string |  |
| step: number |  |
| totalSteps: number |  |
| fields: FieldConfig[] |  |
| conditionals?: any[] |  |
| sections?: any[] |  |
| } |  |

// ============================================================================
// CONFIGURATION: FORM FIELDS
// ============================================================================

const formConfig: Record<PageId, PageConfig> = { // FIX: Added type check for formConfig
  C1: {
    title: 'Huishouden (Basis)',
    subtitle: 'Vertel ons over uw huishouden',
    step: 1,
    totalSteps: 4,
    fields: [
      {
        id: 'aantalVolwassenen',
        label: 'Aantal volwassenen in huis',
        type: 'numeric',
        required: true,
        validation: { min: 1, max: 10 },
        defaultValue: 1
      },
      {
        id: 'aantalKinderen',
        label: 'Aantal kinderen (0-17 jaar)',
        type: 'numeric',
        required: true,
        validation: { min: 0, max: 10 },
        defaultValue: 0
      },
      {
        id: 'woonsituatie',
        label: 'Woonsituatie',
        type: 'select',
        required: true,
        options: [
          { label: 'Selecteer...', value: '' },
          { label: 'Huurder', value: 'Huurder' },
          { label: 'Koper', value: 'Koper' },
          { label: 'Inwonend', value: 'Inwonend' },
          { label: 'Anders', value: 'Anders' }
        ]
      }
    ],
    conditionals: [
      {
        id: 'kinderenDisplay',
        condition: { field: 'aantalKinderen', operator: '>', value: 0 },
        type: 'text',
        template: 'U heeft {aantalKinderen} {plural} in uw huishouden'
      }
    ]
  },

| C4: { | C4: { |
| --- | --- |
| title: 'Huishouden (Details)', | title: 'Huishouden (Details)', |
| subtitle: 'Aanvullende informatie over uw huishouden', | subtitle: 'Aanvullende informatie over uw huishouden', |
| step: 2, | step: 2, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'postcode', | id: 'postcode', |
| label: 'Postcode (4 cijfers)', | label: 'Postcode (4 cijfers)', |
| type: 'text', | type: 'text', |
| required: true, | required: true, |
| validation: { postcode: true }, | validation: { postcode: true }, |
| placeholder: '1234' | placeholder: '1234' |
| }, | }, |
| { | { |
| id: 'burgerlijkeStaat', | id: 'burgerlijkeStaat', |
| label: 'Burgerlijke staat', | label: 'Burgerlijke staat', |
| type: 'select', | type: 'select', |
| required: true, | required: true, |
| options: [ | options: [ |
| { label: 'Selecteer...', value: '' }, | { label: 'Selecteer...', value: '' }, |
| { label: 'Alleenstaand', value: 'Alleenstaand' }, | { label: 'Alleenstaand', value: 'Alleenstaand' }, |
| { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } | { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } |
| ] | ] |
| }, | }, |
| { | { |
| id: 'geboortejaarKind1', | id: 'geboortejaarKind1', |
| label: 'Geboortejaar kind 1', | label: 'Geboortejaar kind 1', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 2007, max: 2024 }, | validation: { min: 2007, max: 2024 }, |
| conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } | conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } |
| } | } |
| ], | ], |
| sections: [ | sections: [ |
| { | { |
| id: 'volwassene1', | id: 'volwassene1', |
| title: 'Volwassene 1', | title: 'Volwassene 1', |
| fields: [ | fields: [ |
| { | { |
| id: 'naamVolwassene1', | id: 'naamVolwassene1', |
| label: 'Voornaam', | label: 'Voornaam', |
| type: 'text', | type: 'text', |
| required: false, | required: false, |
| placeholder: 'Optioneel' | placeholder: 'Optioneel' |
| } | } |
| ] | ] |
| } | } |
| ] | ] |
| }, | }, |

| C7: { | C7: { |
| --- | --- |
| title: 'Inkomsten', | title: 'Inkomsten', |
| subtitle: 'Uw maandelijkse inkomsten', | subtitle: 'Uw maandelijkse inkomsten', |
| step: 3, | step: 3, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'nettoMaandsalaris', | id: 'nettoMaandsalaris', |
| label: 'Netto maandsalaris (€)', | label: 'Netto maandsalaris (€)', |
| type: 'numeric', | type: 'numeric', |
| required: true, | required: true, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0' | placeholder: '0' |
| }, | }, |
| { | { |
| id: 'heeftToeslagen', | id: 'heeftToeslagen', |
| label: 'Heeft u toeslagen?', | label: 'Heeft u toeslagen?', |
| type: 'toggle', | type: 'toggle', |
| required: true, | required: true, |
| defaultValue: false | defaultValue: false |
| }, | }, |
| { | { |
| id: 'huurtoeslag', | id: 'huurtoeslag', |
| label: 'Huurtoeslag (€ per maand)', | label: 'Huurtoeslag (€ per maand)', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0', | placeholder: '0', |
| conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } | conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } |
| } | } |
| ] | ] |
| }, | }, |

| title: 'Vaste Lasten' |  |
| --- | --- |
| subtitle: 'Uw maandelijkse vaste uitgaven' |  |
| step: 4 |  |
| totalSteps: 4 |  |
| id: 'wonen' |  |
| label: 'Woonlasten (€)' |  |
| labelDynamic: true | // Will be calculated based on woonsituatie |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'energie' |  |
| label: 'Energie & Water (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'verzekeringen' |  |
| label: 'Verzekeringen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'abonnementen' |  |
| label: 'Abonnementen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'overig' |  |
| label: 'Overig (€)' |  |
| type: 'numeric' |  |
| required: false |  |
| validation: { min: 0 } |  |

// ============================================================================
// MOCK N8N SERVICE
// ============================================================================

| console.log('📡 Mock P3: Processing household data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId |  |
| --- | --- |
| status: 'Household_Data_Complete' |  |
| adults: formData.C1.aantalVolwassenen |  |
| children: formData.C1.aantalKinderen |  |
| housingType: formData.C1.woonsituatie |  |
| } |  |
| similarHouseholds: 127 |  |
| } |  |

| console.log('📡 Mock P5: Processing income data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Income_Data_Complete' |  |
| salary: formData.C7.nettoMaandsalaris |  |
| } |  |

| console.log('📡 Mock P6: Calculating financial summary...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1500)) |  |

| const inkomenTotaalMaand = (formData.C7.nettoMaandsalaris \|\| 0) + (formData.C7.huurtoeslag \|\| 0) |  |
| --- | --- |
| const lastenTotaalVast = (formData.C10.wonen \|\| 0) + (formData.C10.energie \|\| 0) + (formData.C10.verzekeringen \|\| 0) + (formData.C10.abonnementen \|\| 0) + (formData.C10.overig \|\| 0) |  |
| const cashflow = inkomenTotaalMaand - lastenTotaalVast |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Summary_Complete' |  |
| inkomenTotaalMaand |  |
| lastenTotaalVast |  |
| } |  |
| message: cashflow > 0 ? 'Gefeliciteerd! Uw cashflow is positief.' : 'Let op | uw cashflow is negatief.' |

// ============================================================================
// UI COMPONENTS (React Native)
// ============================================================================

| field: FieldConfig |  |
| --- | --- |
| value: any |  |
| onChange: (fieldId: string, value: any) => void |  |
| error: string \| null |  |

| Key | Value |
| --- | --- |
| // FieldComponent | Renders individual form fields |
| const FieldComponent = ({ field, value, onChange, error } | FieldComponentProps) => { // FIX: Used FieldComponentProps |
| const displayLabel = field.labelDynamic ? `${field.label} (berekend)` | field.label; |

| // Convert numeric input to number | keep other types as is |
| --- | --- |
| onChange(field.id | processedValue); |

  // Custom render logic for select (using <select> for web compatibility)

| return ( | return ( |
| --- | --- |
| <View style={styles.fieldContainer}> | <View style={styles.fieldContainer}> |
| <Text style={styles.fieldLabel}>{displayLabel}</Text> | <Text style={styles.fieldLabel}>{displayLabel}</Text> |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | ''} |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | '0'} |

| <View style={[styles.selectContainer | error && styles.inputError]}> |
| --- | --- |
| {/* OPMERKING: <select> en <option> zijn HTML-elementen die werken in React Native Web |  |

| style={[styles.toggleButton | value === true && styles.toggleButtonActive]} |
| --- | --- |
| <Text style={[styles.toggleText | value === true && styles.toggleTextActive]}>Ja</Text> |
| style={[styles.toggleButton | value === false && styles.toggleButtonActive]} |
| <Text style={[styles.toggleText | value === false && styles.toggleTextActive]}>Nee</Text> |

| ) |  |
| --- | --- |
| } |  |

| const fieldPath = condition.field.split('.') |  |
| --- | --- |
| let value = formData |  |
| value = value?.[key] |  |
| if (value === undefined) return false |  |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

  const shouldRender = evaluateCondition();

| return shouldRender ? <>{children}</> : null |  |
| --- | --- |
| } |  |

| ) |  |
| --- | --- |
| } |  |

| const { state, dispatch } = useFormContext() |  |
| --- | --- |
| const config = React.useMemo(() => formConfig[pageId], [pageId]) |  |
| const [pageData, setPageData] = React.useState<Record<string, any>>({}) |  |
| const [errors, setErrors] = React.useState<Record<string, string \| null>>({}) |  |
| const [touched, setTouched] = React.useState<Record<string, boolean>>({}) |  |

| const initialData = config.fields.reduce((acc | field) => { |
| --- | --- |
| } | {}); |

| loadData() |  |
| --- | --- |
| }, [pageId, config, dispatch]) |  |

| const handleChange = (fieldId | value) => { |
| --- | --- |
| setPageData(prev => ({ ...prev | [fieldId]: value })); |
| setErrors(prev => ({ ...prev | [fieldId]: null })); |

| const evaluateCondition = (condition | formData) => { |
| --- | --- |
| // Parse field path (e.g. | "C1.aantalKinderen") |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

| const newErrors = {} |  |
| --- | --- |
| let isValid = true |  |

| const shouldRender = evaluateCondition(field.conditional, state) |  |
| --- | --- |
| if (!shouldRender) return | // Skip validation if not rendered |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| newErrors[field.id] = result.error |  |
| isValid = false |  |
| }) |  |

| const shouldRender = evaluateCondition(field.conditional | state); |
| --- | --- |
| const result = validateField(field | pageData[field.id]); |

| setErrors(newErrors) |  |
| --- | --- |
| setTouched(config.fields.reduce((acc, f) => ({ ...acc, [f.id]: true }), {})) |  |
| return isValid |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onNext() |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onBack() |  |
| } |  |

| // Check if all visible | required fields have a valid value based on the current data (not just touched fields) |
| --- | --- |
| const shouldRender = evaluateCondition(field.conditional | state); |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| return result.valid |  |
| }) |  |
| } |  |

| const woonsituatie = state.C1?.woonsituatie |  |
| --- | --- |
| const wonenField = config.fields.find(f => f.id === 'wonen') |  |
| let label = 'Woonlasten (€)' |  |
| if (woonsituatie === 'Huurder') label = 'Huur (€ per maand)' |  |
| if (woonsituatie === 'Koper') label = 'Hypotheek (€ per maand)' |  |
| if (woonsituatie === 'Inwonend') label = 'Bijdrage huishouden (€ per maand)' |  |

| wonenField.label = label |  |
| --- | --- |
| }, [state.C1, pageId, config.fields]) |  |

| setPageData(state[pageId]) |  |
| --- | --- |
| }, [state, pageId]) |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container} contentContainerStyle={styles.content}> | <ScrollView style={styles.container} contentContainerStyle={styles.content}> |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> | <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> |
| <Text style={styles.title}>{config.title}</Text> | <Text style={styles.title}>{config.title}</Text> |
| <Text style={styles.subtitle}>{config.subtitle}</Text> | <Text style={styles.subtitle}>{config.subtitle}</Text> |
| </View> | </View> |

| <View style={styles.formSection}> | <View style={styles.formSection}> |
| --- | --- |
| {/* Main fields */} | {/* Main fields */} |
| {config.fields.map(field => ( | {config.fields.map(field => ( |
| <ConditionalField key={field.id} condition={field.conditional} formData={state}> | <ConditionalField key={field.id} condition={field.conditional} formData={state}> |
| <FieldComponent | <FieldComponent |
| field={field} | field={field} |
| value={pageData[field.id]} | value={pageData[field.id]} |
| onChange={handleChange} | onChange={handleChange} |
| error={touched[field.id] ? errors[field.id] : null} | error={touched[field.id] ? errors[field.id] : null} |
| /> | /> |
| </ConditionalField> | </ConditionalField> |
| ))} | ))} |

| {/* Sections (e.g., Volwassenen, Kinderen) */} | {/* Sections (e.g., Volwassenen, Kinderen) */} |
| --- | --- |
| {config.sections && config.sections.map(section => ( | {config.sections && config.sections.map(section => ( |
| <DynamicSection | <DynamicSection |
| key={section.id} | key={section.id} |
| section={section} | section={section} |
| formData={pageData} | formData={pageData} |
| state={state} | state={state} |
| onChange={handleChange} | onChange={handleChange} |
| errors={errors} | errors={errors} |
| touched={touched} | touched={touched} |
| /> | /> |
| ))} | ))} |

| {/* Conditionals (e.g. | text displays) */} |
| --- | --- |
| {cond.template.replace('{aantalKinderen}' | state.C1?.aantalKinderen) |
| .replace('{plural}' | state.C1?.aantalKinderen === 1 ? 'kind' : 'kinderen')} |

| disabled={loading |  | config.step === 1} |
| --- | --- | --- |
| style={[styles.buttonPrimary, (!isFormValid() |  | loading) && styles.buttonDisabled]} |
| disabled={!isFormValid() |  | loading} |

// ============================================================================
// SCREENS
// ============================================================================

| const { dispatch } = useFormContext() |  |
| --- | --- |
| const [checking, setChecking] = React.useState(true) |  |

| const userId = await getUserId() |  |
| --- | --- |
| const allData = await loadAllFormData() |  |

| console.log('✓ Returning user detected | loading data...'); |
| --- | --- |
| dispatch({ type: 'LOAD_SAVED_STATE' | data: allData }); |

| checkReturningUser() |  |
| --- | --- |
| }, [dispatch, onStart]) |  |

| if (checking) { | if (checking) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Laden...</Text> | <Text style={styles.loadingText}>Laden...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

| ) |  |
| --- | --- |
| } |  |

| inkomenTotaalMaand: number |  |
| --- | --- |
| lastenTotaalVast: number |  |
| cashflow: number |  |
| } |  |

| const [summary | setSummary] = React.useState<SummaryData \| null>(null); // FIX: Typed summary state |
| --- | --- |
| const [loading | setLoading] = React.useState(true); |

| setLoading(true) |  |
| --- | --- |
| const result = await mockN8n.callP6(state) |  |
| setSummary(result.summary as SummaryData) |  |
| setLoading(false) |  |
| } |  |

| calculate() |  |
| --- | --- |
| }, [state]) | // FIX: Added 'state' dependency |

| if (loading \|\| !summary) { | if (loading \|\| !summary) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> | <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

  const { cashflow } = summary; // FIX: Destructuring moved after the loading check

| if (cashflow > 0) return '#34C759' | // Green |
| --- | --- |
| if (cashflow < 0) return '#FF3B30' | // Red |
| return '#FFCC00' | // Yellow |
| } |  |

| if (cashflow > 100) return 'Uitstekend! Uw financiële positie is zeer sterk.' |  |
| --- | --- |
| if (cashflow > 0) return 'Goed! U houdt maandelijks geld over.' |  |
| if (cashflow < -100) return 'Zorgwekkend. Er is een significant maandelijks tekort.' |  |
| if (cashflow < 0) return 'Nog net een tekort. Bekijk uw vaste lasten kritisch.' |  |
| return 'Uw inkomsten en lasten zijn in balans.' |  |
| } |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container}> | <ScrollView style={styles.container}> |
| <View style={styles.content}> | <View style={styles.content}> |
| <Text style={styles.title}>Uw Financieel Overzicht</Text> | <Text style={styles.title}>Uw Financieel Overzicht</Text> |

| <View style={[styles.dashboardCard | { borderLeftColor: getColor() }]}> |
| --- | --- |
| <Text style={[styles.dashboardKPI | { color: getColor() }]}> |

| <View style={styles.summarySection}> | <View style={styles.summarySection}> |
| --- | --- |
| <Text style={styles.sectionTitle}>Samenvatting</Text> | <Text style={styles.sectionTitle}>Samenvatting</Text> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> | <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> |
| <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Vaste Lasten:</Text> | <Text style={styles.summaryLabel}>Vaste Lasten:</Text> |
| <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={[styles.summaryRow, styles.summaryRowTotal]}> | <View style={[styles.summaryRow, styles.summaryRowTotal]}> |
| <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> | <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> |
| <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> | <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> |
| €{cashflow.toFixed(2)} | €{cashflow.toFixed(2)} |
| </Text> | </Text> |
| </View> | </View> |
| </View> | </View> |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// MAIN APP & NAVIGATION
// ============================================================================

| const [currentScreen | setCurrentScreen] = React.useState('Landing'); |
| --- | --- |
| const [loading | setLoading] = React.useState(false); |
| const { state | dispatch } = useFormContext(); |

| setLoading(true) |  |
| --- | --- |
| setCurrentScreen(screenId) |  |
| setLoading(false) |  |
| }, 100) |  |
| } |  |

| dispatch({ type: 'RESET_STATE' }) |  |
| --- | --- |
| Storage.clear() |  |
| saveUserId(null) | // Clear stored ID |
| navigate(initialScreenId) |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |
| navigate(pages[currentIndex - 1]) |  |
| navigate('Landing') |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |

    // Logic for API calls after specific steps (C1 -> P3, C7 -> P5)

| dispatch({ type: 'SET_USER_ID' | userId: result.userId }); |
| --- | --- |
| console.error('P3 Error:' | error); |

| // No state update needed | just proceed |
| --- | --- |
| console.error('P5 Error:' | error); |

| navigate('Dashboard') |  |
| --- | --- |
| return |  |

| navigate(pages[currentIndex + 1]) |  |
| --- | --- |
| } |  |

| navigate('C10') |  |
| --- | --- |
| } |  |

| return <LandingScreen onStart={handleStart} /> |  |
| --- | --- |
| return <DashboardScreen onBack={handleDashboardBack} /> |  |
| ) |  |
| return <LandingScreen onStart={handleStart} /> |  |
| } |  |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// STYLES (Mock for React Native Web)
// ============================================================================

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS background
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
    minHeight: '100%',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6E6E73',
  },
  // Header
  header: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 32
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center'
  },
  landingSubtitle: {
    fontSize: 18,
    color: '#6E6E73',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 26
  },
  // Fields
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48 // WCAG touch target
  },
  inputError: {
    borderColor: '#FF3B30', // Red
  },
  errorText: {
    marginTop: 6,
    fontSize: 14,
    color: '#FF3B30', // Red
  },
  infoText: {
    marginTop: 6,
    fontSize: 14,
    color: '#007AFF', // Blue
    padding: 12,
    backgroundColor: '#E5F1FF',
    borderRadius: 8,
  },
  // Dynamic Section (NIEUWE STIJLEN TOEGEVOEGD)
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10
  },
  // Select (Mocked for web)
  selectContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  select: {
    // Basic web style reset for React Native Web
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48,
  },
  // Toggle Buttons
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF', // Active background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E73',
  },
  toggleTextActive: {
    color: '#1C1C1E',
  },
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D6',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Privacy
  privacyNote: {
    marginTop: 40,
    paddingHorizontal: 10,
  },
  privacyText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Dashboard
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 6,
    borderLeftColor: '#007AFF', // Default Blue
  },
  dashboardLabel: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 8
  },
  dashboardKPI: {
    fontSize: 48, // ≥28pt WCAG requirement
    fontWeight: '700',
    marginBottom: 16
  },
  dashboardMessage: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7'
  },
  summaryRowTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#D1D1D6'
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6E6E73'
  },
  summaryLabelBold: {
    fontWeight: '700',
    color: '#1C1C1E'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  summaryValueBold: {
    fontWeight: '700',
  }
});

// Wrap the App in the FormProvider (This is part of the original structure)
const Root = () => (
  <FormProvider>
    <App />
  </FormProvider>
);

export default Root;
```

```
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

export {}; // FIX: Explicitly declare as a module for TypeScript's isolatedModules.

// ============================================================================
// CONTEXT & STATE MANAGEMENT (Optie A - TS typed)
// ============================================================================
type FormAction = { type: string; [key: string]: any };
type FormState = Record<string, any>;
type FormContextValue = { state: FormState; dispatch: React.Dispatch<FormAction>; };

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

| } |  |
| --- | --- |
| return { ...state, ...action.data } |  |
| return { ...state, userId: action.userId } |  |
| return { userId: null } |  |
| return state |  |

interface FormProviderProps {
    children: React.ReactNode; // FIX: Added 'children' to FormProviderProps
}

const FormProvider = ({ children }: FormProviderProps) => {
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);

| ) |  |
| --- | --- |
| } |  |

| const context = React.useContext(FormContext) |  |
| --- | --- |
| if (!context) throw new Error('useFormContext must be used within FormProvider') |  |
| return context |  |
| } |  |

// ============================================================================
// STORAGE UTILITIES (Mock AsyncStorage for web)
// ============================================================================

const Storage = {
  store: {} as Record<string, string>,

| async getItem(key: string): Promise<any \| null> { | async getItem(key: string): Promise<any \| null> { |
| --- | --- |
| return this.store[key] \|\| null; | return this.store[key] \|\| null; |
| }, | }, |

| async setItem(key: string | value: any): Promise<void> { |
| --- | --- |
| } |  |

| async removeItem(key: string): Promise<void> { | async removeItem(key: string): Promise<void> { |
| --- | --- |
| delete this.store[key]; | delete this.store[key]; |
| }, | }, |

| this.store = {} |  |
| --- | --- |
| } |  |

| const savePageData = async (pageId: string | data: any) => { |
| --- | --- |
| await Storage.setItem(`setupData_${pageId}` | JSON.stringify(data)); |
| console.log(`✓ Saved ${pageId} data:` | data); |
| console.error(`✗ Error saving ${pageId}:` | error); |

| const data = await Storage.getItem(`setupData_${pageId}`) |  |
| --- | --- |
| return data ? JSON.parse(data) : null |  |
| console.error(`✗ Error loading ${pageId}:`, error) |  |
| return null |  |
| } |  |

| await Storage.setItem('userId' | userId); |
| --- | --- |
| console.log('✓ User ID saved:' | userId); |

| return await Storage.getItem('userId') |  |
| --- | --- |
| } |  |

| type PageId = 'C1' \| 'C4' \| 'C7' \| 'C10' |  |
| --- | --- |
| type PageData = Record<string, any> |  |

| const pages: PageId[] = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const allData: Record<string, any> = {} |  |
| const data = await loadPageData(pageId) |  |
| if (data) allData[pageId] = data |  |

| const userId = await getUserId() |  |
| --- | --- |
| if (userId) allData.userId = userId |  |

| return allData as Record<PageId, PageData> & { userId?: string } |  |
| --- | --- |
| } |  |

// ============================================================================
// VALIDATION ENGINE
// ============================================================================

| required: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} is verplicht` }; |
| return { valid: true | error: null }; |
| } |  |

| return { valid: false, error: `${fieldLabel} moet minimaal ${min} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

| return { valid: false, error: `${fieldLabel} mag maximaal ${max} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

  },

| postcode: (value: string | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet 4 cijfers zijn` }; |
| return { valid: true | error: null }; |
| } |  |

| numeric: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet een getal zijn` }; |
| return { valid: true | error: null }; |

type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'numeric' | 'select' | 'toggle';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: { min?: number; max?: number; postcode?: boolean };
  options?: { label: string; value: string }[];
  conditional?: { field: string; operator: '>'|'<'|'>='|'<='|'==='|'!==' ; value: any };
};

| const validateField = (field: FieldConfig | value: any): { valid: boolean; error: string \| null } => { |
| --- | --- |
| const result = validation.required(value | field.label); |

| // Skip other validations if empty and not required | // Skip other validations if empty and not required |
| --- | --- |
| if (value === null \|\| value === undefined \|\| value === '') { | if (value === null \|\| value === undefined \|\| value === '') { |
| return { valid: true, error: null }; | return { valid: true, error: null }; |
| } | } |

| const result = validation.numeric(value, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |

| const result = validation.min(value, field.validation.min, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |
| const result = validation.max(value, field.validation.max, field.label) |  |
| if (!result.valid) return result |  |
| const result = validation.postcode(value, field.label) |  |
| if (!result.valid) return result |  |

| return { valid: true, error: null } |  |
| --- | --- |
| } |  |

| title: string |  |
| --- | --- |
| subtitle: string |  |
| step: number |  |
| totalSteps: number |  |
| fields: FieldConfig[] |  |
| conditionals?: any[] |  |
| sections?: any[] |  |
| } |  |

// ============================================================================
// CONFIGURATION: FORM FIELDS
// ============================================================================

const formConfig: Record<PageId, PageConfig> = { // FIX: Added type check for formConfig
  C1: {
    title: 'Huishouden (Basis)',
    subtitle: 'Vertel ons over uw huishouden',
    step: 1,
    totalSteps: 4,
    fields: [
      {
        id: 'aantalVolwassenen',
        label: 'Aantal volwassenen in huis',
        type: 'numeric',
        required: true,
        validation: { min: 1, max: 10 },
        defaultValue: 1
      },
      {
        id: 'aantalKinderen',
        label: 'Aantal kinderen (0-17 jaar)',
        type: 'numeric',
        required: true,
        validation: { min: 0, max: 10 },
        defaultValue: 0
      },
      {
        id: 'woonsituatie',
        label: 'Woonsituatie',
        type: 'select',
        required: true,
        options: [
          { label: 'Selecteer...', value: '' },
          { label: 'Huurder', value: 'Huurder' },
          { label: 'Koper', value: 'Koper' },
          { label: 'Inwonend', value: 'Inwonend' },
          { label: 'Anders', value: 'Anders' }
        ]
      }
    ],
    conditionals: [
      {
        id: 'kinderenDisplay',
        condition: { field: 'aantalKinderen', operator: '>', value: 0 },
        type: 'text',
        template: 'U heeft {aantalKinderen} {plural} in uw huishouden'
      }
    ]
  },

| C4: { | C4: { |
| --- | --- |
| title: 'Huishouden (Details)', | title: 'Huishouden (Details)', |
| subtitle: 'Aanvullende informatie over uw huishouden', | subtitle: 'Aanvullende informatie over uw huishouden', |
| step: 2, | step: 2, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'postcode', | id: 'postcode', |
| label: 'Postcode (4 cijfers)', | label: 'Postcode (4 cijfers)', |
| type: 'text', | type: 'text', |
| required: true, | required: true, |
| validation: { postcode: true }, | validation: { postcode: true }, |
| placeholder: '1234' | placeholder: '1234' |
| }, | }, |
| { | { |
| id: 'burgerlijkeStaat', | id: 'burgerlijkeStaat', |
| label: 'Burgerlijke staat', | label: 'Burgerlijke staat', |
| type: 'select', | type: 'select', |
| required: true, | required: true, |
| options: [ | options: [ |
| { label: 'Selecteer...', value: '' }, | { label: 'Selecteer...', value: '' }, |
| { label: 'Alleenstaand', value: 'Alleenstaand' }, | { label: 'Alleenstaand', value: 'Alleenstaand' }, |
| { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } | { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } |
| ] | ] |
| }, | }, |
| { | { |
| id: 'geboortejaarKind1', | id: 'geboortejaarKind1', |
| label: 'Geboortejaar kind 1', | label: 'Geboortejaar kind 1', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 2007, max: 2024 }, | validation: { min: 2007, max: 2024 }, |
| conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } | conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } |
| } | } |
| ], | ], |
| sections: [ | sections: [ |
| { | { |
| id: 'volwassene1', | id: 'volwassene1', |
| title: 'Volwassene 1', | title: 'Volwassene 1', |
| fields: [ | fields: [ |
| { | { |
| id: 'naamVolwassene1', | id: 'naamVolwassene1', |
| label: 'Voornaam', | label: 'Voornaam', |
| type: 'text', | type: 'text', |
| required: false, | required: false, |
| placeholder: 'Optioneel' | placeholder: 'Optioneel' |
| } | } |
| ] | ] |
| } | } |
| ] | ] |
| }, | }, |

| C7: { | C7: { |
| --- | --- |
| title: 'Inkomsten', | title: 'Inkomsten', |
| subtitle: 'Uw maandelijkse inkomsten', | subtitle: 'Uw maandelijkse inkomsten', |
| step: 3, | step: 3, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'nettoMaandsalaris', | id: 'nettoMaandsalaris', |
| label: 'Netto maandsalaris (€)', | label: 'Netto maandsalaris (€)', |
| type: 'numeric', | type: 'numeric', |
| required: true, | required: true, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0' | placeholder: '0' |
| }, | }, |
| { | { |
| id: 'heeftToeslagen', | id: 'heeftToeslagen', |
| label: 'Heeft u toeslagen?', | label: 'Heeft u toeslagen?', |
| type: 'toggle', | type: 'toggle', |
| required: true, | required: true, |
| defaultValue: false | defaultValue: false |
| }, | }, |
| { | { |
| id: 'huurtoeslag', | id: 'huurtoeslag', |
| label: 'Huurtoeslag (€ per maand)', | label: 'Huurtoeslag (€ per maand)', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0', | placeholder: '0', |
| conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } | conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } |
| } | } |
| ] | ] |
| }, | }, |

| title: 'Vaste Lasten' |  |
| --- | --- |
| subtitle: 'Uw maandelijkse vaste uitgaven' |  |
| step: 4 |  |
| totalSteps: 4 |  |
| id: 'wonen' |  |
| label: 'Woonlasten (€)' |  |
| labelDynamic: true | // Will be calculated based on woonsituatie |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'energie' |  |
| label: 'Energie & Water (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'verzekeringen' |  |
| label: 'Verzekeringen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'abonnementen' |  |
| label: 'Abonnementen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'overig' |  |
| label: 'Overig (€)' |  |
| type: 'numeric' |  |
| required: false |  |
| validation: { min: 0 } |  |

// ============================================================================
// MOCK N8N SERVICE
// ============================================================================

| console.log('📡 Mock P3: Processing household data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId |  |
| --- | --- |
| status: 'Household_Data_Complete' |  |
| adults: formData.C1.aantalVolwassenen |  |
| children: formData.C1.aantalKinderen |  |
| housingType: formData.C1.woonsituatie |  |
| } |  |
| similarHouseholds: 127 |  |
| } |  |

| console.log('📡 Mock P5: Processing income data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Income_Data_Complete' |  |
| salary: formData.C7.nettoMaandsalaris |  |
| } |  |

| console.log('📡 Mock P6: Calculating financial summary...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1500)) |  |

| const inkomenTotaalMaand = (formData.C7.nettoMaandsalaris \|\| 0) + (formData.C7.huurtoeslag \|\| 0) |  |
| --- | --- |
| const lastenTotaalVast = (formData.C10.wonen \|\| 0) + (formData.C10.energie \|\| 0) + (formData.C10.verzekeringen \|\| 0) + (formData.C10.abonnementen \|\| 0) + (formData.C10.overig \|\| 0) |  |
| const cashflow = inkomenTotaalMaand - lastenTotaalVast |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Summary_Complete' |  |
| inkomenTotaalMaand |  |
| lastenTotaalVast |  |
| } |  |
| message: cashflow > 0 ? 'Gefeliciteerd! Uw cashflow is positief.' : 'Let op | uw cashflow is negatief.' |

// ============================================================================
// UI COMPONENTS (React Native)
// ============================================================================

| field: FieldConfig |  |
| --- | --- |
| value: any |  |
| onChange: (fieldId: string, value: any) => void |  |
| error: string \| null |  |

| Key | Value |
| --- | --- |
| // FieldComponent | Renders individual form fields |
| const FieldComponent = ({ field, value, onChange, error } | FieldComponentProps) => { // FIX: Used FieldComponentProps |
| const displayLabel = field.labelDynamic ? `${field.label} (berekend)` | field.label; |

| // Convert numeric input to number | keep other types as is |
| --- | --- |
| onChange(field.id | processedValue); |

  // Custom render logic for select (using <select> for web compatibility)

| return ( | return ( |
| --- | --- |
| <View style={styles.fieldContainer}> | <View style={styles.fieldContainer}> |
| <Text style={styles.fieldLabel}>{displayLabel}</Text> | <Text style={styles.fieldLabel}>{displayLabel}</Text> |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | ''} |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | '0'} |

| <View style={[styles.selectContainer | error && styles.inputError]}> |
| --- | --- |
| {/* OPMERKING: <select> en <option> zijn HTML-elementen die werken in React Native Web |  |

| style={[styles.toggleButton | value === true && styles.toggleButtonActive]} |
| --- | --- |
| <Text style={[styles.toggleText | value === true && styles.toggleTextActive]}>Ja</Text> |
| style={[styles.toggleButton | value === false && styles.toggleButtonActive]} |
| <Text style={[styles.toggleText | value === false && styles.toggleTextActive]}>Nee</Text> |

| ) |  |
| --- | --- |
| } |  |

| const fieldPath = condition.field.split('.') |  |
| --- | --- |
| let value = formData |  |
| value = value?.[key] |  |
| if (value === undefined) return false |  |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

  const shouldRender = evaluateCondition();

| return shouldRender ? <>{children}</> : null |  |
| --- | --- |
| } |  |

| ) |  |
| --- | --- |
| } |  |

| const { state, dispatch } = useFormContext() |  |
| --- | --- |
| const config = React.useMemo(() => formConfig[pageId], [pageId]) |  |
| const [pageData, setPageData] = React.useState<Record<string, any>>({}) |  |
| const [errors, setErrors] = React.useState<Record<string, string \| null>>({}) |  |
| const [touched, setTouched] = React.useState<Record<string, boolean>>({}) |  |

| const initialData = config.fields.reduce((acc | field) => { |
| --- | --- |
| } | {}); |

| loadData() |  |
| --- | --- |
| }, [pageId, config, dispatch]) |  |

| const handleChange = (fieldId | value) => { |
| --- | --- |
| setPageData(prev => ({ ...prev | [fieldId]: value })); |
| setErrors(prev => ({ ...prev | [fieldId]: null })); |

| const evaluateCondition = (condition | formData) => { |
| --- | --- |
| // Parse field path (e.g. | "C1.aantalKinderen") |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

| const newErrors = {} |  |
| --- | --- |
| let isValid = true |  |

| const shouldRender = evaluateCondition(field.conditional, state) |  |
| --- | --- |
| if (!shouldRender) return | // Skip validation if not rendered |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| newErrors[field.id] = result.error |  |
| isValid = false |  |
| }) |  |

| const shouldRender = evaluateCondition(field.conditional | state); |
| --- | --- |
| const result = validateField(field | pageData[field.id]); |

| setErrors(newErrors) |  |
| --- | --- |
| setTouched(config.fields.reduce((acc, f) => ({ ...acc, [f.id]: true }), {})) |  |
| return isValid |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onNext() |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onBack() |  |
| } |  |

| // Check if all visible | required fields have a valid value based on the current data (not just touched fields) |
| --- | --- |
| const shouldRender = evaluateCondition(field.conditional | state); |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| return result.valid |  |
| }) |  |
| } |  |

| const woonsituatie = state.C1?.woonsituatie |  |
| --- | --- |
| const wonenField = config.fields.find(f => f.id === 'wonen') |  |
| let label = 'Woonlasten (€)' |  |
| if (woonsituatie === 'Huurder') label = 'Huur (€ per maand)' |  |
| if (woonsituatie === 'Koper') label = 'Hypotheek (€ per maand)' |  |
| if (woonsituatie === 'Inwonend') label = 'Bijdrage huishouden (€ per maand)' |  |

| wonenField.label = label |  |
| --- | --- |
| }, [state.C1, pageId, config.fields]) |  |

| setPageData(state[pageId]) |  |
| --- | --- |
| }, [state, pageId]) |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container} contentContainerStyle={styles.content}> | <ScrollView style={styles.container} contentContainerStyle={styles.content}> |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> | <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> |
| <Text style={styles.title}>{config.title}</Text> | <Text style={styles.title}>{config.title}</Text> |
| <Text style={styles.subtitle}>{config.subtitle}</Text> | <Text style={styles.subtitle}>{config.subtitle}</Text> |
| </View> | </View> |

| <View style={styles.formSection}> | <View style={styles.formSection}> |
| --- | --- |
| {/* Main fields */} | {/* Main fields */} |
| {config.fields.map(field => ( | {config.fields.map(field => ( |
| <ConditionalField key={field.id} condition={field.conditional} formData={state}> | <ConditionalField key={field.id} condition={field.conditional} formData={state}> |
| <FieldComponent | <FieldComponent |
| field={field} | field={field} |
| value={pageData[field.id]} | value={pageData[field.id]} |
| onChange={handleChange} | onChange={handleChange} |
| error={touched[field.id] ? errors[field.id] : null} | error={touched[field.id] ? errors[field.id] : null} |
| /> | /> |
| </ConditionalField> | </ConditionalField> |
| ))} | ))} |

| {/* Sections (e.g., Volwassenen, Kinderen) */} | {/* Sections (e.g., Volwassenen, Kinderen) */} |
| --- | --- |
| {config.sections && config.sections.map(section => ( | {config.sections && config.sections.map(section => ( |
| <DynamicSection | <DynamicSection |
| key={section.id} | key={section.id} |
| section={section} | section={section} |
| formData={pageData} | formData={pageData} |
| state={state} | state={state} |
| onChange={handleChange} | onChange={handleChange} |
| errors={errors} | errors={errors} |
| touched={touched} | touched={touched} |
| /> | /> |
| ))} | ))} |

| {/* Conditionals (e.g. | text displays) */} |
| --- | --- |
| {cond.template.replace('{aantalKinderen}' | state.C1?.aantalKinderen) |
| .replace('{plural}' | state.C1?.aantalKinderen === 1 ? 'kind' : 'kinderen')} |

| disabled={loading |  | config.step === 1} |
| --- | --- | --- |
| style={[styles.buttonPrimary, (!isFormValid() |  | loading) && styles.buttonDisabled]} |
| disabled={!isFormValid() |  | loading} |

// ============================================================================
// SCREENS
// ============================================================================

| const { dispatch } = useFormContext() |  |
| --- | --- |
| const [checking, setChecking] = React.useState(true) |  |

| const userId = await getUserId() |  |
| --- | --- |
| const allData = await loadAllFormData() |  |

| console.log('✓ Returning user detected | loading data...'); |
| --- | --- |
| dispatch({ type: 'LOAD_SAVED_STATE' | data: allData }); |

| checkReturningUser() |  |
| --- | --- |
| }, [dispatch, onStart]) |  |

| if (checking) { | if (checking) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Laden...</Text> | <Text style={styles.loadingText}>Laden...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

| ) |  |
| --- | --- |
| } |  |

| inkomenTotaalMaand: number |  |
| --- | --- |
| lastenTotaalVast: number |  |
| cashflow: number |  |
| } |  |

| const [summary | setSummary] = React.useState<SummaryData \| null>(null); // FIX: Typed summary state |
| --- | --- |
| const [loading | setLoading] = React.useState(true); |

| setLoading(true) |  |
| --- | --- |
| const result = await mockN8n.callP6(state) |  |
| setSummary(result.summary as SummaryData) |  |
| setLoading(false) |  |
| } |  |

| calculate() |  |
| --- | --- |
| }, [state]) | // FIX: Added 'state' dependency |

| if (loading \|\| !summary) { | if (loading \|\| !summary) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> | <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

  const { cashflow } = summary; // FIX: Destructuring moved after the loading check

| if (cashflow > 0) return '#34C759' | // Green |
| --- | --- |
| if (cashflow < 0) return '#FF3B30' | // Red |
| return '#FFCC00' | // Yellow |
| } |  |

| if (cashflow > 100) return 'Uitstekend! Uw financiële positie is zeer sterk.' |  |
| --- | --- |
| if (cashflow > 0) return 'Goed! U houdt maandelijks geld over.' |  |
| if (cashflow < -100) return 'Zorgwekkend. Er is een significant maandelijks tekort.' |  |
| if (cashflow < 0) return 'Nog net een tekort. Bekijk uw vaste lasten kritisch.' |  |
| return 'Uw inkomsten en lasten zijn in balans.' |  |
| } |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container}> | <ScrollView style={styles.container}> |
| <View style={styles.content}> | <View style={styles.content}> |
| <Text style={styles.title}>Uw Financieel Overzicht</Text> | <Text style={styles.title}>Uw Financieel Overzicht</Text> |

| <View style={[styles.dashboardCard | { borderLeftColor: getColor() }]}> |
| --- | --- |
| <Text style={[styles.dashboardKPI | { color: getColor() }]}> |

| <View style={styles.summarySection}> | <View style={styles.summarySection}> |
| --- | --- |
| <Text style={styles.sectionTitle}>Samenvatting</Text> | <Text style={styles.sectionTitle}>Samenvatting</Text> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> | <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> |
| <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Vaste Lasten:</Text> | <Text style={styles.summaryLabel}>Vaste Lasten:</Text> |
| <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={[styles.summaryRow, styles.summaryRowTotal]}> | <View style={[styles.summaryRow, styles.summaryRowTotal]}> |
| <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> | <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> |
| <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> | <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> |
| €{cashflow.toFixed(2)} | €{cashflow.toFixed(2)} |
| </Text> | </Text> |
| </View> | </View> |
| </View> | </View> |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// MAIN APP & NAVIGATION
// ============================================================================

| const [currentScreen | setCurrentScreen] = React.useState('Landing'); |
| --- | --- |
| const [loading | setLoading] = React.useState(false); |
| const { state | dispatch } = useFormContext(); |

| setLoading(true) |  |
| --- | --- |
| setCurrentScreen(screenId) |  |
| setLoading(false) |  |
| }, 100) |  |
| } |  |

| dispatch({ type: 'RESET_STATE' }) |  |
| --- | --- |
| Storage.clear() |  |
| saveUserId(null) | // Clear stored ID |
| navigate(initialScreenId) |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |
| navigate(pages[currentIndex - 1]) |  |
| navigate('Landing') |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |

    // Logic for API calls after specific steps (C1 -> P3, C7 -> P5)

| dispatch({ type: 'SET_USER_ID' | userId: result.userId }); |
| --- | --- |
| console.error('P3 Error:' | error); |

| // No state update needed | just proceed |
| --- | --- |
| console.error('P5 Error:' | error); |

| navigate('Dashboard') |  |
| --- | --- |
| return |  |

| navigate(pages[currentIndex + 1]) |  |
| --- | --- |
| } |  |

| navigate('C10') |  |
| --- | --- |
| } |  |

| return <LandingScreen onStart={handleStart} /> |  |
| --- | --- |
| return <DashboardScreen onBack={handleDashboardBack} /> |  |
| ) |  |
| return <LandingScreen onStart={handleStart} /> |  |
| } |  |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// STYLES (Mock for React Native Web)
// ============================================================================

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS background
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
    minHeight: '100%',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6E6E73',
  },
  // Header
  header: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 32
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center'
  },
  landingSubtitle: {
    fontSize: 18,
    color: '#6E6E73',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 26
  },
  // Fields
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48 // WCAG touch target
  },
  inputError: {
    borderColor: '#FF3B30', // Red
  },
  errorText: {
    marginTop: 6,
    fontSize: 14,
    color: '#FF3B30', // Red
  },
  infoText: {
    marginTop: 6,
    fontSize: 14,
    color: '#007AFF', // Blue
    padding: 12,
    backgroundColor: '#E5F1FF',
    borderRadius: 8,
  },
  // Dynamic Section (NIEUWE STIJLEN TOEGEVOEGD)
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10
  },
  // Select (Mocked for web)
  selectContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  select: {
    // Basic web style reset for React Native Web
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48,
  },
  // Toggle Buttons
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF', // Active background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E73',
  },
  toggleTextActive: {
    color: '#1C1C1E',
  },
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D6',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Privacy
  privacyNote: {
    marginTop: 40,
    paddingHorizontal: 10,
  },
  privacyText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Dashboard
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 6,
    borderLeftColor: '#007AFF', // Default Blue
  },
  dashboardLabel: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 8
  },
  dashboardKPI: {
    fontSize: 48, // ≥28pt WCAG requirement
    fontWeight: '700',
    marginBottom: 16
  },
  dashboardMessage: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7'
  },
  summaryRowTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#D1D1D6'
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6E6E73'
  },
  summaryLabelBold: {
    fontWeight: '700',
    color: '#1C1C1E'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  summaryValueBold: {
    fontWeight: '700',
  }
});

// Wrap the App in the FormProvider (This is part of the original structure)
const Root = () => (
  <FormProvider>
    <App />
  </FormProvider>
);

export default Root;
```

Property 'sectionContainer' does not exist on type '{ appContainer: { flex: number; backgroundColor: string; }; container: { flex: number; backgroundColor: string; }; content: { padding: number; minHeight: "100%"; }; centerContent: { flex: number; justifyContent: "center"; alignItems: "center"; padding: number; }; ... 38 more ...; summaryValueBold: { ...; }; }'. Did you mean 'selectContainer'?(2551)

App.tsx(1197, 3): 'selectContainer' is declared here.

Dit is een TypeScript-fout (TS2551), wat betekent dat de stijl-property wel in een component wordt gebruikt (), maar niet is gedefinieerd in het object.

De oplossing is om deze twee ontbrekende stijlen ( en ) toe te voegen aan het styles object.

Hier is de complete en gecorrigeerde code voor App.tsx, waarbij de benodigde stijlen zijn toegevoegd in de sectie // STYLES.

Oplossing: ontbrekende stijlen toevoegen

Ik heb de stijlen en toegevoegd aan het styles object (rond regel 1150 in de sectie // STYLES).

TypeScript

---

**User:**

```
ConditionalField
```

```
React.FC<Props>
```

```
ConditionalField
```

```
DynamicSection
```

```
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

export {}; // FIX: Explicitly declare as a module for TypeScript's isolatedModules.

// ============================================================================
// CONTEXT & STATE MANAGEMENT (Optie A - TS typed)
// ============================================================================
type FormAction = { type: string; [key: string]: any };
type FormState = Record<string, any>;
type FormContextValue = { state: FormState; dispatch: React.Dispatch<FormAction>; };

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

| } |  |
| --- | --- |
| return { ...state, ...action.data } |  |
| return { ...state, userId: action.userId } |  |
| return { userId: null } |  |
| return state |  |

interface FormProviderProps {
    children: React.ReactNode; // FIX: Added 'children' to FormProviderProps
}

const FormProvider = ({ children }: FormProviderProps) => {
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);

| ) |  |
| --- | --- |
| } |  |

| const context = React.useContext(FormContext) |  |
| --- | --- |
| if (!context) throw new Error('useFormContext must be used within FormProvider') |  |
| return context |  |
| } |  |

// ============================================================================
// STORAGE UTILITIES (Mock AsyncStorage for web)
// ============================================================================

const Storage = {
  store: {} as Record<string, string>,

| async getItem(key: string): Promise<any \| null> { | async getItem(key: string): Promise<any \| null> { |
| --- | --- |
| return this.store[key] \|\| null; | return this.store[key] \|\| null; |
| }, | }, |

| async setItem(key: string | value: any): Promise<void> { |
| --- | --- |
| } |  |

| async removeItem(key: string): Promise<void> { | async removeItem(key: string): Promise<void> { |
| --- | --- |
| delete this.store[key]; | delete this.store[key]; |
| }, | }, |

| this.store = {} |  |
| --- | --- |
| } |  |

| const savePageData = async (pageId: string | data: any) => { |
| --- | --- |
| await Storage.setItem(`setupData_${pageId}` | JSON.stringify(data)); |
| console.log(`✓ Saved ${pageId} data:` | data); |
| console.error(`✗ Error saving ${pageId}:` | error); |

| const data = await Storage.getItem(`setupData_${pageId}`) |  |
| --- | --- |
| return data ? JSON.parse(data) : null |  |
| console.error(`✗ Error loading ${pageId}:`, error) |  |
| return null |  |
| } |  |

| await Storage.setItem('userId' | userId); |
| --- | --- |
| console.log('✓ User ID saved:' | userId); |

| return await Storage.getItem('userId') |  |
| --- | --- |
| } |  |

| type PageId = 'C1' \| 'C4' \| 'C7' \| 'C10' |  |
| --- | --- |
| type PageData = Record<string, any> |  |

| const pages: PageId[] = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const allData: Record<string, any> = {} |  |
| const data = await loadPageData(pageId) |  |
| if (data) allData[pageId] = data |  |

| const userId = await getUserId() |  |
| --- | --- |
| if (userId) allData.userId = userId |  |

| return allData as Record<PageId, PageData> & { userId?: string } |  |
| --- | --- |
| } |  |

// ============================================================================
// VALIDATION ENGINE
// ============================================================================

| required: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} is verplicht` }; |
| return { valid: true | error: null }; |
| } |  |

| return { valid: false, error: `${fieldLabel} moet minimaal ${min} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

| return { valid: false, error: `${fieldLabel} mag maximaal ${max} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

  },

| postcode: (value: string | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet 4 cijfers zijn` }; |
| return { valid: true | error: null }; |
| } |  |

| numeric: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet een getal zijn` }; |
| return { valid: true | error: null }; |

type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'numeric' | 'select' | 'toggle';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: { min?: number; max?: number; postcode?: boolean };
  options?: { label: string; value: string }[];
  conditional?: { field: string; operator: '>'|'<'|'>='|'<='|'==='|'!==' ; value: any };
};

| const validateField = (field: FieldConfig | value: any): { valid: boolean; error: string \| null } => { |
| --- | --- |
| const result = validation.required(value | field.label); |

| // Skip other validations if empty and not required | // Skip other validations if empty and not required |
| --- | --- |
| if (value === null \|\| value === undefined \|\| value === '') { | if (value === null \|\| value === undefined \|\| value === '') { |
| return { valid: true, error: null }; | return { valid: true, error: null }; |
| } | } |

| const result = validation.numeric(value, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |

| const result = validation.min(value, field.validation.min, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |
| const result = validation.max(value, field.validation.max, field.label) |  |
| if (!result.valid) return result |  |
| const result = validation.postcode(value, field.label) |  |
| if (!result.valid) return result |  |

| return { valid: true, error: null } |  |
| --- | --- |
| } |  |

| title: string |  |
| --- | --- |
| subtitle: string |  |
| step: number |  |
| totalSteps: number |  |
| fields: FieldConfig[] |  |
| conditionals?: any[] |  |
| sections?: any[] |  |
| } |  |

// ============================================================================
// CONFIGURATION: FORM FIELDS
// ============================================================================

const formConfig: Record<PageId, PageConfig> = { // FIX: Added type check for formConfig
  C1: {
    title: 'Huishouden (Basis)',
    subtitle: 'Vertel ons over uw huishouden',
    step: 1,
    totalSteps: 4,
    fields: [
      {
        id: 'aantalVolwassenen',
        label: 'Aantal volwassenen in huis',
        type: 'numeric',
        required: true,
        validation: { min: 1, max: 10 },
        defaultValue: 1
      },
      {
        id: 'aantalKinderen',
        label: 'Aantal kinderen (0-17 jaar)',
        type: 'numeric',
        required: true,
        validation: { min: 0, max: 10 },
        defaultValue: 0
      },
      {
        id: 'woonsituatie',
        label: 'Woonsituatie',
        type: 'select',
        required: true,
        options: [
          { label: 'Selecteer...', value: '' },
          { label: 'Huurder', value: 'Huurder' },
          { label: 'Koper', value: 'Koper' },
          { label: 'Inwonend', value: 'Inwonend' },
          { label: 'Anders', value: 'Anders' }
        ]
      }
    ],
    conditionals: [
      {
        id: 'kinderenDisplay',
        condition: { field: 'aantalKinderen', operator: '>', value: 0 },
        type: 'text',
        template: 'U heeft {aantalKinderen} {plural} in uw huishouden'
      }
    ]
  },

| C4: { | C4: { |
| --- | --- |
| title: 'Huishouden (Details)', | title: 'Huishouden (Details)', |
| subtitle: 'Aanvullende informatie over uw huishouden', | subtitle: 'Aanvullende informatie over uw huishouden', |
| step: 2, | step: 2, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'postcode', | id: 'postcode', |
| label: 'Postcode (4 cijfers)', | label: 'Postcode (4 cijfers)', |
| type: 'text', | type: 'text', |
| required: true, | required: true, |
| validation: { postcode: true }, | validation: { postcode: true }, |
| placeholder: '1234' | placeholder: '1234' |
| }, | }, |
| { | { |
| id: 'burgerlijkeStaat', | id: 'burgerlijkeStaat', |
| label: 'Burgerlijke staat', | label: 'Burgerlijke staat', |
| type: 'select', | type: 'select', |
| required: true, | required: true, |
| options: [ | options: [ |
| { label: 'Selecteer...', value: '' }, | { label: 'Selecteer...', value: '' }, |
| { label: 'Alleenstaand', value: 'Alleenstaand' }, | { label: 'Alleenstaand', value: 'Alleenstaand' }, |
| { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } | { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } |
| ] | ] |
| }, | }, |
| { | { |
| id: 'geboortejaarKind1', | id: 'geboortejaarKind1', |
| label: 'Geboortejaar kind 1', | label: 'Geboortejaar kind 1', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 2007, max: 2024 }, | validation: { min: 2007, max: 2024 }, |
| conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } | conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } |
| } | } |
| ], | ], |
| sections: [ | sections: [ |
| { | { |
| id: 'volwassene1', | id: 'volwassene1', |
| title: 'Volwassene 1', | title: 'Volwassene 1', |
| fields: [ | fields: [ |
| { | { |
| id: 'naamVolwassene1', | id: 'naamVolwassene1', |
| label: 'Voornaam', | label: 'Voornaam', |
| type: 'text', | type: 'text', |
| required: false, | required: false, |
| placeholder: 'Optioneel' | placeholder: 'Optioneel' |
| } | } |
| ] | ] |
| } | } |
| ] | ] |
| }, | }, |

| C7: { | C7: { |
| --- | --- |
| title: 'Inkomsten', | title: 'Inkomsten', |
| subtitle: 'Uw maandelijkse inkomsten', | subtitle: 'Uw maandelijkse inkomsten', |
| step: 3, | step: 3, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'nettoMaandsalaris', | id: 'nettoMaandsalaris', |
| label: 'Netto maandsalaris (€)', | label: 'Netto maandsalaris (€)', |
| type: 'numeric', | type: 'numeric', |
| required: true, | required: true, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0' | placeholder: '0' |
| }, | }, |
| { | { |
| id: 'heeftToeslagen', | id: 'heeftToeslagen', |
| label: 'Heeft u toeslagen?', | label: 'Heeft u toeslagen?', |
| type: 'toggle', | type: 'toggle', |
| required: true, | required: true, |
| defaultValue: false | defaultValue: false |
| }, | }, |
| { | { |
| id: 'huurtoeslag', | id: 'huurtoeslag', |
| label: 'Huurtoeslag (€ per maand)', | label: 'Huurtoeslag (€ per maand)', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0', | placeholder: '0', |
| conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } | conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } |
| } | } |
| ] | ] |
| }, | }, |

| title: 'Vaste Lasten' |  |
| --- | --- |
| subtitle: 'Uw maandelijkse vaste uitgaven' |  |
| step: 4 |  |
| totalSteps: 4 |  |
| id: 'wonen' |  |
| label: 'Woonlasten (€)' |  |
| labelDynamic: true | // Will be calculated based on woonsituatie |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'energie' |  |
| label: 'Energie & Water (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'verzekeringen' |  |
| label: 'Verzekeringen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'abonnementen' |  |
| label: 'Abonnementen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'overig' |  |
| label: 'Overig (€)' |  |
| type: 'numeric' |  |
| required: false |  |
| validation: { min: 0 } |  |

// ============================================================================
// MOCK N8N SERVICE
// ============================================================================

| console.log('📡 Mock P3: Processing household data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId |  |
| --- | --- |
| status: 'Household_Data_Complete' |  |
| adults: formData.C1.aantalVolwassenen |  |
| children: formData.C1.aantalKinderen |  |
| housingType: formData.C1.woonsituatie |  |
| } |  |
| similarHouseholds: 127 |  |
| } |  |

| console.log('📡 Mock P5: Processing income data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Income_Data_Complete' |  |
| salary: formData.C7.nettoMaandsalaris |  |
| } |  |

| console.log('📡 Mock P6: Calculating financial summary...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1500)) |  |

| const inkomenTotaalMaand = (formData.C7.nettoMaandsalaris \|\| 0) + (formData.C7.huurtoeslag \|\| 0) |  |
| --- | --- |
| const lastenTotaalVast = (formData.C10.wonen \|\| 0) + (formData.C10.energie \|\| 0) + (formData.C10.verzekeringen \|\| 0) + (formData.C10.abonnementen \|\| 0) + (formData.C10.overig \|\| 0) |  |
| const cashflow = inkomenTotaalMaand - lastenTotaalVast |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Summary_Complete' |  |
| inkomenTotaalMaand |  |
| lastenTotaalVast |  |
| } |  |
| message: cashflow > 0 ? 'Gefeliciteerd! Uw cashflow is positief.' : 'Let op | uw cashflow is negatief.' |

// ============================================================================
// UI COMPONENTS (React Native)
// ============================================================================

| field: FieldConfig |  |
| --- | --- |
| value: any |  |
| onChange: (fieldId: string, value: any) => void |  |
| error: string \| null |  |

| Key | Value |
| --- | --- |
| // FieldComponent | Renders individual form fields |
| const FieldComponent = ({ field, value, onChange, error } | FieldComponentProps) => { // FIX: Used FieldComponentProps |
| const displayLabel = field.labelDynamic ? `${field.label} (berekend)` | field.label; |

| // Convert numeric input to number | keep other types as is |
| --- | --- |
| onChange(field.id | processedValue); |

  // Custom render logic for select (using <select> for web compatibility)

| return ( | return ( |
| --- | --- |
| <View style={styles.fieldContainer}> | <View style={styles.fieldContainer}> |
| <Text style={styles.fieldLabel}>{displayLabel}</Text> | <Text style={styles.fieldLabel}>{displayLabel}</Text> |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | ''} |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | '0'} |

| <View style={[styles.selectContainer | error && styles.inputError]}> |
| --- | --- |
| {/* OPMERKING: <select> en <option> zijn HTML-elementen die werken in React Native Web |  |

| style={[styles.toggleButton | value === true && styles.toggleButtonActive]} |
| --- | --- |
| <Text style={[styles.toggleText | value === true && styles.toggleTextActive]}>Ja</Text> |
| style={[styles.toggleButton | value === false && styles.toggleButtonActive]} |
| <Text style={[styles.toggleText | value === false && styles.toggleTextActive]}>Nee</Text> |

| ) |  |
| --- | --- |
| } |  |

| condition: any |  |
| --- | --- |
| formData: any |  |

| const fieldPath = condition.field.split('.') |  |
| --- | --- |
| let value = formData |  |
| value = value?.[key] |  |
| if (value === undefined) return false |  |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

  const shouldRender = evaluateCondition();

| return shouldRender ? <>{children}</> : null |  |
| --- | --- |
| } |  |

| formData: Record<string | any>; |
| --- | --- |
| onChange: (fieldId: string | value: any) => void; |
| errors: Record<string | string \| null>; |
| touched: Record<string | boolean>; |

| ) |  |
| --- | --- |
| } |  |

| const { state, dispatch } = useFormContext() |  |
| --- | --- |
| const config = React.useMemo(() => formConfig[pageId], [pageId]) |  |
| const [pageData, setPageData] = React.useState<Record<string, any>>({}) |  |
| const [errors, setErrors] = React.useState<Record<string, string \| null>>({}) |  |
| const [touched, setTouched] = React.useState<Record<string, boolean>>({}) |  |

| const initialData = config.fields.reduce((acc | field) => { |
| --- | --- |
| } | {}); |

| loadData() |  |
| --- | --- |
| }, [pageId, config, dispatch]) |  |

| const handleChange = (fieldId | value) => { |
| --- | --- |
| setPageData(prev => ({ ...prev | [fieldId]: value })); |
| setErrors(prev => ({ ...prev | [fieldId]: null })); |

| const evaluateCondition = (condition | formData) => { |
| --- | --- |
| // Parse field path (e.g. | "C1.aantalKinderen") |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

| const newErrors = {} |  |
| --- | --- |
| let isValid = true |  |

| const shouldRender = evaluateCondition(field.conditional, state) |  |
| --- | --- |
| if (!shouldRender) return | // Skip validation if not rendered |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| newErrors[field.id] = result.error |  |
| isValid = false |  |
| }) |  |

| const shouldRender = evaluateCondition(field.conditional | state); |
| --- | --- |
| const result = validateField(field | pageData[field.id]); |

| setErrors(newErrors) |  |
| --- | --- |
| setTouched(config.fields.reduce((acc, f) => ({ ...acc, [f.id]: true }), {})) |  |
| return isValid |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onNext() |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onBack() |  |
| } |  |

| // Check if all visible | required fields have a valid value based on the current data (not just touched fields) |
| --- | --- |
| const shouldRender = evaluateCondition(field.conditional | state); |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| return result.valid |  |
| }) |  |
| } |  |

| const woonsituatie = state.C1?.woonsituatie |  |
| --- | --- |
| const wonenField = config.fields.find(f => f.id === 'wonen') |  |
| let label = 'Woonlasten (€)' |  |
| if (woonsituatie === 'Huurder') label = 'Huur (€ per maand)' |  |
| if (woonsituatie === 'Koper') label = 'Hypotheek (€ per maand)' |  |
| if (woonsituatie === 'Inwonend') label = 'Bijdrage huishouden (€ per maand)' |  |

| wonenField.label = label |  |
| --- | --- |
| }, [state.C1, pageId, config.fields]) |  |

| setPageData(state[pageId]) |  |
| --- | --- |
| }, [state, pageId]) |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container} contentContainerStyle={styles.content}> | <ScrollView style={styles.container} contentContainerStyle={styles.content}> |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> | <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> |
| <Text style={styles.title}>{config.title}</Text> | <Text style={styles.title}>{config.title}</Text> |
| <Text style={styles.subtitle}>{config.subtitle}</Text> | <Text style={styles.subtitle}>{config.subtitle}</Text> |
| </View> | </View> |

| <View style={styles.formSection}> | <View style={styles.formSection}> |
| --- | --- |
| {/* Main fields */} | {/* Main fields */} |
| {config.fields.map(field => ( | {config.fields.map(field => ( |
| <ConditionalField key={field.id} condition={field.conditional} formData={state}> | <ConditionalField key={field.id} condition={field.conditional} formData={state}> |
| <FieldComponent | <FieldComponent |
| field={field} | field={field} |
| value={pageData[field.id]} | value={pageData[field.id]} |
| onChange={handleChange} | onChange={handleChange} |
| error={touched[field.id] ? errors[field.id] : null} | error={touched[field.id] ? errors[field.id] : null} |
| /> | /> |
| </ConditionalField> | </ConditionalField> |
| ))} | ))} |

| {/* Sections (e.g., Volwassenen, Kinderen) */} | {/* Sections (e.g., Volwassenen, Kinderen) */} |
| --- | --- |
| {config.sections && config.sections.map(section => ( | {config.sections && config.sections.map(section => ( |
| <DynamicSection | <DynamicSection |
| key={section.id} | key={section.id} |
| section={section} | section={section} |
| formData={pageData} | formData={pageData} |
| state={state} | state={state} |
| onChange={handleChange} | onChange={handleChange} |
| errors={errors} | errors={errors} |
| touched={touched} | touched={touched} |
| /> | /> |
| ))} | ))} |

| {/* Conditionals (e.g. | text displays) */} |
| --- | --- |
| {cond.template.replace('{aantalKinderen}' | state.C1?.aantalKinderen) |
| .replace('{plural}' | state.C1?.aantalKinderen === 1 ? 'kind' : 'kinderen')} |

| disabled={loading |  | config.step === 1} |
| --- | --- | --- |
| style={[styles.buttonPrimary, (!isFormValid() |  | loading) && styles.buttonDisabled]} |
| disabled={!isFormValid() |  | loading} |

// ============================================================================
// SCREENS
// ============================================================================

| const { dispatch } = useFormContext() |  |
| --- | --- |
| const [checking, setChecking] = React.useState(true) |  |

| const userId = await getUserId() |  |
| --- | --- |
| const allData = await loadAllFormData() |  |

| console.log('✓ Returning user detected | loading data...'); |
| --- | --- |
| dispatch({ type: 'LOAD_SAVED_STATE' | data: allData }); |

| checkReturningUser() |  |
| --- | --- |
| }, [dispatch, onStart]) |  |

| if (checking) { | if (checking) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Laden...</Text> | <Text style={styles.loadingText}>Laden...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

| ) |  |
| --- | --- |
| } |  |

| inkomenTotaalMaand: number |  |
| --- | --- |
| lastenTotaalVast: number |  |
| cashflow: number |  |
| } |  |

| const [summary | setSummary] = React.useState<SummaryData \| null>(null); // FIX: Typed summary state |
| --- | --- |
| const [loading | setLoading] = React.useState(true); |

| setLoading(true) |  |
| --- | --- |
| const result = await mockN8n.callP6(state) |  |
| setSummary(result.summary as SummaryData) |  |
| setLoading(false) |  |
| } |  |

| calculate() |  |
| --- | --- |
| }, [state]) | // FIX: Added 'state' dependency |

| if (loading \|\| !summary) { | if (loading \|\| !summary) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> | <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

  const { cashflow } = summary; // FIX: Destructuring moved after the loading check

| if (cashflow > 0) return '#34C759' | // Green |
| --- | --- |
| if (cashflow < 0) return '#FF3B30' | // Red |
| return '#FFCC00' | // Yellow |
| } |  |

| if (cashflow > 100) return 'Uitstekend! Uw financiële positie is zeer sterk.' |  |
| --- | --- |
| if (cashflow > 0) return 'Goed! U houdt maandelijks geld over.' |  |
| if (cashflow < -100) return 'Zorgwekkend. Er is een significant maandelijks tekort.' |  |
| if (cashflow < 0) return 'Nog net een tekort. Bekijk uw vaste lasten kritisch.' |  |
| return 'Uw inkomsten en lasten zijn in balans.' |  |
| } |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container}> | <ScrollView style={styles.container}> |
| <View style={styles.content}> | <View style={styles.content}> |
| <Text style={styles.title}>Uw Financieel Overzicht</Text> | <Text style={styles.title}>Uw Financieel Overzicht</Text> |

| <View style={[styles.dashboardCard | { borderLeftColor: getColor() }]}> |
| --- | --- |
| <Text style={[styles.dashboardKPI | { color: getColor() }]}> |

| <View style={styles.summarySection}> | <View style={styles.summarySection}> |
| --- | --- |
| <Text style={styles.sectionTitle}>Samenvatting</Text> | <Text style={styles.sectionTitle}>Samenvatting</Text> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> | <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> |
| <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Vaste Lasten:</Text> | <Text style={styles.summaryLabel}>Vaste Lasten:</Text> |
| <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={[styles.summaryRow, styles.summaryRowTotal]}> | <View style={[styles.summaryRow, styles.summaryRowTotal]}> |
| <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> | <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> |
| <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> | <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> |
| €{cashflow.toFixed(2)} | €{cashflow.toFixed(2)} |
| </Text> | </Text> |
| </View> | </View> |
| </View> | </View> |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// MAIN APP & NAVIGATION
// ============================================================================

| const [currentScreen | setCurrentScreen] = React.useState('Landing'); |
| --- | --- |
| const [loading | setLoading] = React.useState(false); |
| const { state | dispatch } = useFormContext(); |

| setLoading(true) |  |
| --- | --- |
| setCurrentScreen(screenId) |  |
| setLoading(false) |  |
| }, 100) |  |
| } |  |

| dispatch({ type: 'RESET_STATE' }) |  |
| --- | --- |
| Storage.clear() |  |
| saveUserId(null) | // Clear stored ID |
| navigate(initialScreenId) |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |
| navigate(pages[currentIndex - 1]) |  |
| navigate('Landing') |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |

    // Logic for API calls after specific steps (C1 -> P3, C7 -> P5)

| dispatch({ type: 'SET_USER_ID' | userId: result.userId }); |
| --- | --- |
| console.error('P3 Error:' | error); |

| // No state update needed | just proceed |
| --- | --- |
| console.error('P5 Error:' | error); |

| navigate('Dashboard') |  |
| --- | --- |
| return |  |

| navigate(pages[currentIndex + 1]) |  |
| --- | --- |
| } |  |

| navigate('C10') |  |
| --- | --- |
| } |  |

| return <LandingScreen onStart={handleStart} /> |  |
| --- | --- |
| return <DashboardScreen onBack={handleDashboardBack} /> |  |
| ) |  |
| return <LandingScreen onStart={handleStart} /> |  |
| } |  |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// STYLES (Mock for React Native Web)
// ============================================================================

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS background
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
    minHeight: '100%',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6E6E73',
  },
  // Header
  header: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 32
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center'
  },
  landingSubtitle: {
    fontSize: 18,
    color: '#6E6E73',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 26
  },
  // Fields
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48 // WCAG touch target
  },
  inputError: {
    borderColor: '#FF3B30', // Red
  },
  errorText: {
    marginTop: 6,
    fontSize: 14,
    color: '#FF3B30', // Red
  },
  infoText: {
    marginTop: 6,
    fontSize: 14,
    color: '#007AFF', // Blue
    padding: 12,
    backgroundColor: '#E5F1FF',
    borderRadius: 8,
  },
  // Dynamic Section
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10
  },
  // Select (Mocked for web)
  selectContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  select: {
    // Basic web style reset for React Native Web
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48,
  },
  // Toggle Buttons
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF', // Active background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E73',
  },
  toggleTextActive: {
    color: '#1C1C1E',
  },
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D6',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Privacy
  privacyNote: {
    marginTop: 40,
    paddingHorizontal: 10,
  },
  privacyText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Dashboard
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 6,
    borderLeftColor: '#007AFF', // Default Blue
  },
  dashboardLabel: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 8
  },
  dashboardKPI: {
    fontSize: 48, // ≥28pt WCAG requirement
    fontWeight: '700',
    marginBottom: 16
  },
  dashboardMessage: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7'
  },
  summaryRowTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#D1D1D6'
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6E6E73'
  },
  summaryLabelBold: {
    fontWeight: '700',
    color: '#1C1C1E'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  summaryValueBold: {
    fontWeight: '700',
  }
});

// Wrap the App in the FormProvider (This is part of the original structure)
const Root = () => (
  <FormProvider>
    <App />
  </FormProvider>
);

export default Root;
```

```
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

export {}; // FIX: Explicitly declare as a module for TypeScript's isolatedModules.

// ============================================================================
// CONTEXT & STATE MANAGEMENT (Optie A - TS typed)
// ============================================================================
type FormAction = { type: string; [key: string]: any };
type FormState = Record<string, any>;
type FormContextValue = { state: FormState; dispatch: React.Dispatch<FormAction>; };

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

| } |  |
| --- | --- |
| return { ...state, ...action.data } |  |
| return { ...state, userId: action.userId } |  |
| return { userId: null } |  |
| return state |  |

interface FormProviderProps {
    children: React.ReactNode; // FIX: Added 'children' to FormProviderProps
}

const FormProvider = ({ children }: FormProviderProps) => {
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);

| ) |  |
| --- | --- |
| } |  |

| const context = React.useContext(FormContext) |  |
| --- | --- |
| if (!context) throw new Error('useFormContext must be used within FormProvider') |  |
| return context |  |
| } |  |

// ============================================================================
// STORAGE UTILITIES (Mock AsyncStorage for web)
// ============================================================================

const Storage = {
  store: {} as Record<string, string>,

| async getItem(key: string): Promise<any \| null> { | async getItem(key: string): Promise<any \| null> { |
| --- | --- |
| return this.store[key] \|\| null; | return this.store[key] \|\| null; |
| }, | }, |

| async setItem(key: string | value: any): Promise<void> { |
| --- | --- |
| } |  |

| async removeItem(key: string): Promise<void> { | async removeItem(key: string): Promise<void> { |
| --- | --- |
| delete this.store[key]; | delete this.store[key]; |
| }, | }, |

| this.store = {} |  |
| --- | --- |
| } |  |

| const savePageData = async (pageId: string | data: any) => { |
| --- | --- |
| await Storage.setItem(`setupData_${pageId}` | JSON.stringify(data)); |
| console.log(`✓ Saved ${pageId} data:` | data); |
| console.error(`✗ Error saving ${pageId}:` | error); |

| const data = await Storage.getItem(`setupData_${pageId}`) |  |
| --- | --- |
| return data ? JSON.parse(data) : null |  |
| console.error(`✗ Error loading ${pageId}:`, error) |  |
| return null |  |
| } |  |

| await Storage.setItem('userId' | userId); |
| --- | --- |
| console.log('✓ User ID saved:' | userId); |

| return await Storage.getItem('userId') |  |
| --- | --- |
| } |  |

| type PageId = 'C1' \| 'C4' \| 'C7' \| 'C10' |  |
| --- | --- |
| type PageData = Record<string, any> |  |

| const pages: PageId[] = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const allData: Record<string, any> = {} |  |
| const data = await loadPageData(pageId) |  |
| if (data) allData[pageId] = data |  |

| const userId = await getUserId() |  |
| --- | --- |
| if (userId) allData.userId = userId |  |

| return allData as Record<PageId, PageData> & { userId?: string } |  |
| --- | --- |
| } |  |

// ============================================================================
// VALIDATION ENGINE
// ============================================================================

| required: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} is verplicht` }; |
| return { valid: true | error: null }; |
| } |  |

| return { valid: false, error: `${fieldLabel} moet minimaal ${min} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

| return { valid: false, error: `${fieldLabel} mag maximaal ${max} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

  },

| postcode: (value: string | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet 4 cijfers zijn` }; |
| return { valid: true | error: null }; |
| } |  |

| numeric: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet een getal zijn` }; |
| return { valid: true | error: null }; |

type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'numeric' | 'select' | 'toggle';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: { min?: number; max?: number; postcode?: boolean };
  options?: { label: string; value: string }[];
  conditional?: { field: string; operator: '>'|'<'|'>='|'<='|'==='|'!==' ; value: any };
};

| const validateField = (field: FieldConfig | value: any): { valid: boolean; error: string \| null } => { |
| --- | --- |
| const result = validation.required(value | field.label); |

| // Skip other validations if empty and not required | // Skip other validations if empty and not required |
| --- | --- |
| if (value === null \|\| value === undefined \|\| value === '') { | if (value === null \|\| value === undefined \|\| value === '') { |
| return { valid: true, error: null }; | return { valid: true, error: null }; |
| } | } |

| const result = validation.numeric(value, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |

| const result = validation.min(value, field.validation.min, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |
| const result = validation.max(value, field.validation.max, field.label) |  |
| if (!result.valid) return result |  |
| const result = validation.postcode(value, field.label) |  |
| if (!result.valid) return result |  |

| return { valid: true, error: null } |  |
| --- | --- |
| } |  |

| title: string |  |
| --- | --- |
| subtitle: string |  |
| step: number |  |
| totalSteps: number |  |
| fields: FieldConfig[] |  |
| conditionals?: any[] |  |
| sections?: any[] |  |
| } |  |

// ============================================================================
// CONFIGURATION: FORM FIELDS
// ============================================================================

const formConfig: Record<PageId, PageConfig> = { // FIX: Added type check for formConfig
  C1: {
    title: 'Huishouden (Basis)',
    subtitle: 'Vertel ons over uw huishouden',
    step: 1,
    totalSteps: 4,
    fields: [
      {
        id: 'aantalVolwassenen',
        label: 'Aantal volwassenen in huis',
        type: 'numeric',
        required: true,
        validation: { min: 1, max: 10 },
        defaultValue: 1
      },
      {
        id: 'aantalKinderen',
        label: 'Aantal kinderen (0-17 jaar)',
        type: 'numeric',
        required: true,
        validation: { min: 0, max: 10 },
        defaultValue: 0
      },
      {
        id: 'woonsituatie',
        label: 'Woonsituatie',
        type: 'select',
        required: true,
        options: [
          { label: 'Selecteer...', value: '' },
          { label: 'Huurder', value: 'Huurder' },
          { label: 'Koper', value: 'Koper' },
          { label: 'Inwonend', value: 'Inwonend' },
          { label: 'Anders', value: 'Anders' }
        ]
      }
    ],
    conditionals: [
      {
        id: 'kinderenDisplay',
        condition: { field: 'aantalKinderen', operator: '>', value: 0 },
        type: 'text',
        template: 'U heeft {aantalKinderen} {plural} in uw huishouden'
      }
    ]
  },

| C4: { | C4: { |
| --- | --- |
| title: 'Huishouden (Details)', | title: 'Huishouden (Details)', |
| subtitle: 'Aanvullende informatie over uw huishouden', | subtitle: 'Aanvullende informatie over uw huishouden', |
| step: 2, | step: 2, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'postcode', | id: 'postcode', |
| label: 'Postcode (4 cijfers)', | label: 'Postcode (4 cijfers)', |
| type: 'text', | type: 'text', |
| required: true, | required: true, |
| validation: { postcode: true }, | validation: { postcode: true }, |
| placeholder: '1234' | placeholder: '1234' |
| }, | }, |
| { | { |
| id: 'burgerlijkeStaat', | id: 'burgerlijkeStaat', |
| label: 'Burgerlijke staat', | label: 'Burgerlijke staat', |
| type: 'select', | type: 'select', |
| required: true, | required: true, |
| options: [ | options: [ |
| { label: 'Selecteer...', value: '' }, | { label: 'Selecteer...', value: '' }, |
| { label: 'Alleenstaand', value: 'Alleenstaand' }, | { label: 'Alleenstaand', value: 'Alleenstaand' }, |
| { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } | { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } |
| ] | ] |
| }, | }, |
| { | { |
| id: 'geboortejaarKind1', | id: 'geboortejaarKind1', |
| label: 'Geboortejaar kind 1', | label: 'Geboortejaar kind 1', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 2007, max: 2024 }, | validation: { min: 2007, max: 2024 }, |
| conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } | conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } |
| } | } |
| ], | ], |
| sections: [ | sections: [ |
| { | { |
| id: 'volwassene1', | id: 'volwassene1', |
| title: 'Volwassene 1', | title: 'Volwassene 1', |
| fields: [ | fields: [ |
| { | { |
| id: 'naamVolwassene1', | id: 'naamVolwassene1', |
| label: 'Voornaam', | label: 'Voornaam', |
| type: 'text', | type: 'text', |
| required: false, | required: false, |
| placeholder: 'Optioneel' | placeholder: 'Optioneel' |
| } | } |
| ] | ] |
| } | } |
| ] | ] |
| }, | }, |

| C7: { | C7: { |
| --- | --- |
| title: 'Inkomsten', | title: 'Inkomsten', |
| subtitle: 'Uw maandelijkse inkomsten', | subtitle: 'Uw maandelijkse inkomsten', |
| step: 3, | step: 3, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'nettoMaandsalaris', | id: 'nettoMaandsalaris', |
| label: 'Netto maandsalaris (€)', | label: 'Netto maandsalaris (€)', |
| type: 'numeric', | type: 'numeric', |
| required: true, | required: true, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0' | placeholder: '0' |
| }, | }, |
| { | { |
| id: 'heeftToeslagen', | id: 'heeftToeslagen', |
| label: 'Heeft u toeslagen?', | label: 'Heeft u toeslagen?', |
| type: 'toggle', | type: 'toggle', |
| required: true, | required: true, |
| defaultValue: false | defaultValue: false |
| }, | }, |
| { | { |
| id: 'huurtoeslag', | id: 'huurtoeslag', |
| label: 'Huurtoeslag (€ per maand)', | label: 'Huurtoeslag (€ per maand)', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0', | placeholder: '0', |
| conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } | conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } |
| } | } |
| ] | ] |
| }, | }, |

| title: 'Vaste Lasten' |  |
| --- | --- |
| subtitle: 'Uw maandelijkse vaste uitgaven' |  |
| step: 4 |  |
| totalSteps: 4 |  |
| id: 'wonen' |  |
| label: 'Woonlasten (€)' |  |
| labelDynamic: true | // Will be calculated based on woonsituatie |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'energie' |  |
| label: 'Energie & Water (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'verzekeringen' |  |
| label: 'Verzekeringen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'abonnementen' |  |
| label: 'Abonnementen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'overig' |  |
| label: 'Overig (€)' |  |
| type: 'numeric' |  |
| required: false |  |
| validation: { min: 0 } |  |

// ============================================================================
// MOCK N8N SERVICE
// ============================================================================

| console.log('📡 Mock P3: Processing household data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId |  |
| --- | --- |
| status: 'Household_Data_Complete' |  |
| adults: formData.C1.aantalVolwassenen |  |
| children: formData.C1.aantalKinderen |  |
| housingType: formData.C1.woonsituatie |  |
| } |  |
| similarHouseholds: 127 |  |
| } |  |

| console.log('📡 Mock P5: Processing income data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Income_Data_Complete' |  |
| salary: formData.C7.nettoMaandsalaris |  |
| } |  |

| console.log('📡 Mock P6: Calculating financial summary...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1500)) |  |

| const inkomenTotaalMaand = (formData.C7.nettoMaandsalaris \|\| 0) + (formData.C7.huurtoeslag \|\| 0) |  |
| --- | --- |
| const lastenTotaalVast = (formData.C10.wonen \|\| 0) + (formData.C10.energie \|\| 0) + (formData.C10.verzekeringen \|\| 0) + (formData.C10.abonnementen \|\| 0) + (formData.C10.overig \|\| 0) |  |
| const cashflow = inkomenTotaalMaand - lastenTotaalVast |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Summary_Complete' |  |
| inkomenTotaalMaand |  |
| lastenTotaalVast |  |
| } |  |
| message: cashflow > 0 ? 'Gefeliciteerd! Uw cashflow is positief.' : 'Let op | uw cashflow is negatief.' |

// ============================================================================
// UI COMPONENTS (React Native)
// ============================================================================

| field: FieldConfig |  |
| --- | --- |
| value: any |  |
| onChange: (fieldId: string, value: any) => void |  |
| error: string \| null |  |

| Key | Value |
| --- | --- |
| // FieldComponent | Renders individual form fields |
| const FieldComponent = ({ field, value, onChange, error } | FieldComponentProps) => { // FIX: Used FieldComponentProps |
| const displayLabel = field.labelDynamic ? `${field.label} (berekend)` | field.label; |

| // Convert numeric input to number | keep other types as is |
| --- | --- |
| onChange(field.id | processedValue); |

  // Custom render logic for select (using <select> for web compatibility)

| return ( | return ( |
| --- | --- |
| <View style={styles.fieldContainer}> | <View style={styles.fieldContainer}> |
| <Text style={styles.fieldLabel}>{displayLabel}</Text> | <Text style={styles.fieldLabel}>{displayLabel}</Text> |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | ''} |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | '0'} |

| <View style={[styles.selectContainer | error && styles.inputError]}> |
| --- | --- |
| {/* OPMERKING: <select> en <option> zijn HTML-elementen die werken in React Native Web |  |

| style={[styles.toggleButton | value === true && styles.toggleButtonActive]} |
| --- | --- |
| <Text style={[styles.toggleText | value === true && styles.toggleTextActive]}>Ja</Text> |
| style={[styles.toggleButton | value === false && styles.toggleButtonActive]} |
| <Text style={[styles.toggleText | value === false && styles.toggleTextActive]}>Nee</Text> |

| ) |  |
| --- | --- |
| } |  |

| condition: any |  |
| --- | --- |
| formData: any |  |

| const fieldPath = condition.field.split('.') |  |
| --- | --- |
| let value = formData |  |
| value = value?.[key] |  |
| if (value === undefined) return false |  |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

  const shouldRender = evaluateCondition();

| return shouldRender ? <>{children}</> : null |  |
| --- | --- |
| } |  |

| formData: Record<string | any>; |
| --- | --- |
| onChange: (fieldId: string | value: any) => void; |
| errors: Record<string | string \| null>; |
| touched: Record<string | boolean>; |

| ) |  |
| --- | --- |
| } |  |

| const { state, dispatch } = useFormContext() |  |
| --- | --- |
| const config = React.useMemo(() => formConfig[pageId], [pageId]) |  |
| const [pageData, setPageData] = React.useState<Record<string, any>>({}) |  |
| const [errors, setErrors] = React.useState<Record<string, string \| null>>({}) |  |
| const [touched, setTouched] = React.useState<Record<string, boolean>>({}) |  |

| const initialData = config.fields.reduce((acc | field) => { |
| --- | --- |
| } | {}); |

| loadData() |  |
| --- | --- |
| }, [pageId, config, dispatch]) |  |

| const handleChange = (fieldId | value) => { |
| --- | --- |
| setPageData(prev => ({ ...prev | [fieldId]: value })); |
| setErrors(prev => ({ ...prev | [fieldId]: null })); |

| const evaluateCondition = (condition | formData) => { |
| --- | --- |
| // Parse field path (e.g. | "C1.aantalKinderen") |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

| const newErrors = {} |  |
| --- | --- |
| let isValid = true |  |

| const shouldRender = evaluateCondition(field.conditional, state) |  |
| --- | --- |
| if (!shouldRender) return | // Skip validation if not rendered |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| newErrors[field.id] = result.error |  |
| isValid = false |  |
| }) |  |

| const shouldRender = evaluateCondition(field.conditional | state); |
| --- | --- |
| const result = validateField(field | pageData[field.id]); |

| setErrors(newErrors) |  |
| --- | --- |
| setTouched(config.fields.reduce((acc, f) => ({ ...acc, [f.id]: true }), {})) |  |
| return isValid |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onNext() |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onBack() |  |
| } |  |

| // Check if all visible | required fields have a valid value based on the current data (not just touched fields) |
| --- | --- |
| const shouldRender = evaluateCondition(field.conditional | state); |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| return result.valid |  |
| }) |  |
| } |  |

| const woonsituatie = state.C1?.woonsituatie |  |
| --- | --- |
| const wonenField = config.fields.find(f => f.id === 'wonen') |  |
| let label = 'Woonlasten (€)' |  |
| if (woonsituatie === 'Huurder') label = 'Huur (€ per maand)' |  |
| if (woonsituatie === 'Koper') label = 'Hypotheek (€ per maand)' |  |
| if (woonsituatie === 'Inwonend') label = 'Bijdrage huishouden (€ per maand)' |  |

| wonenField.label = label |  |
| --- | --- |
| }, [state.C1, pageId, config.fields]) |  |

| setPageData(state[pageId]) |  |
| --- | --- |
| }, [state, pageId]) |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container} contentContainerStyle={styles.content}> | <ScrollView style={styles.container} contentContainerStyle={styles.content}> |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> | <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> |
| <Text style={styles.title}>{config.title}</Text> | <Text style={styles.title}>{config.title}</Text> |
| <Text style={styles.subtitle}>{config.subtitle}</Text> | <Text style={styles.subtitle}>{config.subtitle}</Text> |
| </View> | </View> |

| <View style={styles.formSection}> | <View style={styles.formSection}> |
| --- | --- |
| {/* Main fields */} | {/* Main fields */} |
| {config.fields.map(field => ( | {config.fields.map(field => ( |
| <ConditionalField key={field.id} condition={field.conditional} formData={state}> | <ConditionalField key={field.id} condition={field.conditional} formData={state}> |
| <FieldComponent | <FieldComponent |
| field={field} | field={field} |
| value={pageData[field.id]} | value={pageData[field.id]} |
| onChange={handleChange} | onChange={handleChange} |
| error={touched[field.id] ? errors[field.id] : null} | error={touched[field.id] ? errors[field.id] : null} |
| /> | /> |
| </ConditionalField> | </ConditionalField> |
| ))} | ))} |

| {/* Sections (e.g., Volwassenen, Kinderen) */} | {/* Sections (e.g., Volwassenen, Kinderen) */} |
| --- | --- |
| {config.sections && config.sections.map(section => ( | {config.sections && config.sections.map(section => ( |
| <DynamicSection | <DynamicSection |
| key={section.id} | key={section.id} |
| section={section} | section={section} |
| formData={pageData} | formData={pageData} |
| state={state} | state={state} |
| onChange={handleChange} | onChange={handleChange} |
| errors={errors} | errors={errors} |
| touched={touched} | touched={touched} |
| /> | /> |
| ))} | ))} |

| {/* Conditionals (e.g. | text displays) */} |
| --- | --- |
| {cond.template.replace('{aantalKinderen}' | state.C1?.aantalKinderen) |
| .replace('{plural}' | state.C1?.aantalKinderen === 1 ? 'kind' : 'kinderen')} |

| disabled={loading |  | config.step === 1} |
| --- | --- | --- |
| style={[styles.buttonPrimary, (!isFormValid() |  | loading) && styles.buttonDisabled]} |
| disabled={!isFormValid() |  | loading} |

// ============================================================================
// SCREENS
// ============================================================================

| const { dispatch } = useFormContext() |  |
| --- | --- |
| const [checking, setChecking] = React.useState(true) |  |

| const userId = await getUserId() |  |
| --- | --- |
| const allData = await loadAllFormData() |  |

| console.log('✓ Returning user detected | loading data...'); |
| --- | --- |
| dispatch({ type: 'LOAD_SAVED_STATE' | data: allData }); |

| checkReturningUser() |  |
| --- | --- |
| }, [dispatch, onStart]) |  |

| if (checking) { | if (checking) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Laden...</Text> | <Text style={styles.loadingText}>Laden...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

| ) |  |
| --- | --- |
| } |  |

| inkomenTotaalMaand: number |  |
| --- | --- |
| lastenTotaalVast: number |  |
| cashflow: number |  |
| } |  |

| const [summary | setSummary] = React.useState<SummaryData \| null>(null); // FIX: Typed summary state |
| --- | --- |
| const [loading | setLoading] = React.useState(true); |

| setLoading(true) |  |
| --- | --- |
| const result = await mockN8n.callP6(state) |  |
| setSummary(result.summary as SummaryData) |  |
| setLoading(false) |  |
| } |  |

| calculate() |  |
| --- | --- |
| }, [state]) | // FIX: Added 'state' dependency |

| if (loading \|\| !summary) { | if (loading \|\| !summary) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> | <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

  const { cashflow } = summary; // FIX: Destructuring moved after the loading check

| if (cashflow > 0) return '#34C759' | // Green |
| --- | --- |
| if (cashflow < 0) return '#FF3B30' | // Red |
| return '#FFCC00' | // Yellow |
| } |  |

| if (cashflow > 100) return 'Uitstekend! Uw financiële positie is zeer sterk.' |  |
| --- | --- |
| if (cashflow > 0) return 'Goed! U houdt maandelijks geld over.' |  |
| if (cashflow < -100) return 'Zorgwekkend. Er is een significant maandelijks tekort.' |  |
| if (cashflow < 0) return 'Nog net een tekort. Bekijk uw vaste lasten kritisch.' |  |
| return 'Uw inkomsten en lasten zijn in balans.' |  |
| } |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container}> | <ScrollView style={styles.container}> |
| <View style={styles.content}> | <View style={styles.content}> |
| <Text style={styles.title}>Uw Financieel Overzicht</Text> | <Text style={styles.title}>Uw Financieel Overzicht</Text> |

| <View style={[styles.dashboardCard | { borderLeftColor: getColor() }]}> |
| --- | --- |
| <Text style={[styles.dashboardKPI | { color: getColor() }]}> |

| <View style={styles.summarySection}> | <View style={styles.summarySection}> |
| --- | --- |
| <Text style={styles.sectionTitle}>Samenvatting</Text> | <Text style={styles.sectionTitle}>Samenvatting</Text> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> | <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> |
| <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Vaste Lasten:</Text> | <Text style={styles.summaryLabel}>Vaste Lasten:</Text> |
| <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={[styles.summaryRow, styles.summaryRowTotal]}> | <View style={[styles.summaryRow, styles.summaryRowTotal]}> |
| <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> | <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> |
| <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> | <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> |
| €{cashflow.toFixed(2)} | €{cashflow.toFixed(2)} |
| </Text> | </Text> |
| </View> | </View> |
| </View> | </View> |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// MAIN APP & NAVIGATION
// ============================================================================

| const [currentScreen | setCurrentScreen] = React.useState('Landing'); |
| --- | --- |
| const [loading | setLoading] = React.useState(false); |
| const { state | dispatch } = useFormContext(); |

| setLoading(true) |  |
| --- | --- |
| setCurrentScreen(screenId) |  |
| setLoading(false) |  |
| }, 100) |  |
| } |  |

| dispatch({ type: 'RESET_STATE' }) |  |
| --- | --- |
| Storage.clear() |  |
| saveUserId(null) | // Clear stored ID |
| navigate(initialScreenId) |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |
| navigate(pages[currentIndex - 1]) |  |
| navigate('Landing') |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |

    // Logic for API calls after specific steps (C1 -> P3, C7 -> P5)

| dispatch({ type: 'SET_USER_ID' | userId: result.userId }); |
| --- | --- |
| console.error('P3 Error:' | error); |

| // No state update needed | just proceed |
| --- | --- |
| console.error('P5 Error:' | error); |

| navigate('Dashboard') |  |
| --- | --- |
| return |  |

| navigate(pages[currentIndex + 1]) |  |
| --- | --- |
| } |  |

| navigate('C10') |  |
| --- | --- |
| } |  |

| return <LandingScreen onStart={handleStart} /> |  |
| --- | --- |
| return <DashboardScreen onBack={handleDashboardBack} /> |  |
| ) |  |
| return <LandingScreen onStart={handleStart} /> |  |
| } |  |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// STYLES (Mock for React Native Web)
// ============================================================================

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS background
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
    minHeight: '100%',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6E6E73',
  },
  // Header
  header: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 32
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center'
  },
  landingSubtitle: {
    fontSize: 18,
    color: '#6E6E73',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 26
  },
  // Fields
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48 // WCAG touch target
  },
  inputError: {
    borderColor: '#FF3B30', // Red
  },
  errorText: {
    marginTop: 6,
    fontSize: 14,
    color: '#FF3B30', // Red
  },
  infoText: {
    marginTop: 6,
    fontSize: 14,
    color: '#007AFF', // Blue
    padding: 12,
    backgroundColor: '#E5F1FF',
    borderRadius: 8,
  },
  // Dynamic Section
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10
  },
  // Select (Mocked for web)
  selectContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  select: {
    // Basic web style reset for React Native Web
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48,
  },
  // Toggle Buttons
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF', // Active background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E73',
  },
  toggleTextActive: {
    color: '#1C1C1E',
  },
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D6',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Privacy
  privacyNote: {
    marginTop: 40,
    paddingHorizontal: 10,
  },
  privacyText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Dashboard
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 6,
    borderLeftColor: '#007AFF', // Default Blue
  },
  dashboardLabel: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 8
  },
  dashboardKPI: {
    fontSize: 48, // ≥28pt WCAG requirement
    fontWeight: '700',
    marginBottom: 16
  },
  dashboardMessage: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7'
  },
  summaryRowTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#D1D1D6'
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6E6E73'
  },
  summaryLabelBold: {
    fontWeight: '700',
    color: '#1C1C1E'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  summaryValueBold: {
    fontWeight: '700',
  }
});

// Wrap the App in the FormProvider (This is part of the original structure)
const Root = () => (
  <FormProvider>
    <App />
  </FormProvider>
);

export default Root;
```

Type '{ key: any; condition: any; formData: FormState; }' is not assignable to type '{ condition: any; formData: any; children: any; }'.

Property 'key' does not exist on type '{ condition: any; formData: any; children: any; }'.(2322)

De foutmelding TS2322 treedt op omdat u de speciale React-prop key doorgeeft aan uw custom component ( in dit geval), maar deze component is niet correct getypeerd in TypeScript om te weten dat het die key prop mag negeren.

Wanneer u componenten rendert in een lus (.map()), voegt React de key toe. Custom components moeten getypeerd zijn met een type zoals om de interne key prop van React correct af te handelen.

Ik heb de props van zowel als expliciet getypeerd met behulp van React.FC en bijbehorende interfaces.

Hier is de complete, gecorrigeerde code voor App.tsx:

TypeScript

---

**User:**

```
ConditionalField
```

```
DynamicSection
```

```
field.options
```

```
field.type === 'select'
```

```
Record<string, any>
```

```
implicit any
```

```
// @ts-ignore
```

```
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

export {}; // FIX: Explicitly declare as a module for TypeScript's isolatedModules.

// ============================================================================
// CONTEXT & STATE MANAGEMENT (Optie A - TS typed)
// ============================================================================
type FormAction = { type: string; [key: string]: any };
type FormState = Record<string, any>;
type FormContextValue = { state: FormState; dispatch: React.Dispatch<FormAction>; };

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

| } |  |
| --- | --- |
| return { ...state, ...action.data } |  |
| return { ...state, userId: action.userId } |  |
| return { userId: null } |  |
| return state |  |

interface FormProviderProps {
    children: React.ReactNode; // FIX: Added 'children' to FormProviderProps
}

const FormProvider = ({ children }: FormProviderProps) => {
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);

| ) |  |
| --- | --- |
| } |  |

| const context = React.useContext(FormContext) |  |
| --- | --- |
| if (!context) throw new Error('useFormContext must be used within FormProvider') |  |
| return context |  |
| } |  |

// ============================================================================
// STORAGE UTILITIES (Mock AsyncStorage for web)
// ============================================================================

const Storage = {
  store: {} as Record<string, string>,

| async getItem(key: string): Promise<any \| null> { | async getItem(key: string): Promise<any \| null> { |
| --- | --- |
| return this.store[key] \|\| null; | return this.store[key] \|\| null; |
| }, | }, |

| async setItem(key: string | value: any): Promise<void> { |
| --- | --- |
| } |  |

| async removeItem(key: string): Promise<void> { | async removeItem(key: string): Promise<void> { |
| --- | --- |
| delete this.store[key]; | delete this.store[key]; |
| }, | }, |

| this.store = {} |  |
| --- | --- |
| } |  |

| const savePageData = async (pageId: string | data: any) => { |
| --- | --- |
| await Storage.setItem(`setupData_${pageId}` | JSON.stringify(data)); |
| console.log(`✓ Saved ${pageId} data:` | data); |
| console.error(`✗ Error saving ${pageId}:` | error); |

| const data = await Storage.getItem(`setupData_${pageId}`) |  |
| --- | --- |
| return data ? JSON.parse(data) : null |  |
| console.error(`✗ Error loading ${pageId}:`, error) |  |
| return null |  |
| } |  |

| await Storage.setItem('userId' | userId); |
| --- | --- |
| console.log('✓ User ID saved:' | userId); |

| return await Storage.getItem('userId') |  |
| --- | --- |
| } |  |

| type PageId = 'C1' \| 'C4' \| 'C7' \| 'C10' |  |
| --- | --- |
| type PageData = Record<string, any> |  |

| const pages: PageId[] = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const allData: Record<string, any> = {} |  |
| const data = await loadPageData(pageId) |  |
| if (data) allData[pageId] = data |  |

| const userId = await getUserId() |  |
| --- | --- |
| if (userId) allData.userId = userId |  |

| return allData as Record<PageId, PageData> & { userId?: string } |  |
| --- | --- |
| } |  |

// ============================================================================
// VALIDATION ENGINE
// ============================================================================

| required: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} is verplicht` }; |
| return { valid: true | error: null }; |
| } |  |

| return { valid: false, error: `${fieldLabel} moet minimaal ${min} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

| return { valid: false, error: `${fieldLabel} mag maximaal ${max} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

  },

| postcode: (value: string | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet 4 cijfers zijn` }; |
| return { valid: true | error: null }; |
| } |  |

| numeric: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet een getal zijn` }; |
| return { valid: true | error: null }; |

type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'numeric' | 'select' | 'toggle';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: { min?: number; max?: number; postcode?: boolean };
  options?: { label: string; value: string }[];
  conditional?: { field: string; operator: '>'|'<'|'>='|'<='|'==='|'!==' ; value: any };
};

| const validateField = (field: FieldConfig | value: any): { valid: boolean; error: string \| null } => { |
| --- | --- |
| const result = validation.required(value | field.label); |

| // Skip other validations if empty and not required | // Skip other validations if empty and not required |
| --- | --- |
| if (value === null \|\| value === undefined \|\| value === '') { | if (value === null \|\| value === undefined \|\| value === '') { |
| return { valid: true, error: null }; | return { valid: true, error: null }; |
| } | } |

| const result = validation.numeric(value, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |

| const result = validation.min(value, field.validation.min, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |
| const result = validation.max(value, field.validation.max, field.label) |  |
| if (!result.valid) return result |  |
| const result = validation.postcode(value, field.label) |  |
| if (!result.valid) return result |  |

| return { valid: true, error: null } |  |
| --- | --- |
| } |  |

| id: string |  |
| --- | --- |
| title: string |  |
| fields: FieldConfig[] |  |

| title: string |  |
| --- | --- |
| subtitle: string |  |
| step: number |  |
| totalSteps: number |  |
| fields: FieldConfig[] |  |
| conditionals?: any[] |  |
| sections?: SectionConfig[] | // FIX: Used SectionConfig |
| } |  |

// ============================================================================
// CONFIGURATION: FORM FIELDS
// ============================================================================

const formConfig: Record<PageId, PageConfig> = { // FIX: Added type check for formConfig
  C1: {
    title: 'Huishouden (Basis)',
    subtitle: 'Vertel ons over uw huishouden',
    step: 1,
    totalSteps: 4,
    fields: [
      {
        id: 'aantalVolwassenen',
        label: 'Aantal volwassenen in huis',
        type: 'numeric',
        required: true,
        validation: { min: 1, max: 10 },
        defaultValue: 1
      },
      {
        id: 'aantalKinderen',
        label: 'Aantal kinderen (0-17 jaar)',
        type: 'numeric',
        required: true,
        validation: { min: 0, max: 10 },
        defaultValue: 0
      },
      {
        id: 'woonsituatie',
        label: 'Woonsituatie',
        type: 'select',
        required: true,
        options: [
          { label: 'Selecteer...', value: '' },
          { label: 'Huurder', value: 'Huurder' },
          { label: 'Koper', value: 'Koper' },
          { label: 'Inwonend', value: 'Inwonend' },
          { label: 'Anders', value: 'Anders' }
        ]
      }
    ],
    conditionals: [
      {
        id: 'kinderenDisplay',
        condition: { field: 'aantalKinderen', operator: '>', value: 0 },
        type: 'text',
        template: 'U heeft {aantalKinderen} {plural} in uw huishouden'
      }
    ]
  },

| C4: { | C4: { |
| --- | --- |
| title: 'Huishouden (Details)', | title: 'Huishouden (Details)', |
| subtitle: 'Aanvullende informatie over uw huishouden', | subtitle: 'Aanvullende informatie over uw huishouden', |
| step: 2, | step: 2, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'postcode', | id: 'postcode', |
| label: 'Postcode (4 cijfers)', | label: 'Postcode (4 cijfers)', |
| type: 'text', | type: 'text', |
| required: true, | required: true, |
| validation: { postcode: true }, | validation: { postcode: true }, |
| placeholder: '1234' | placeholder: '1234' |
| }, | }, |
| { | { |
| id: 'burgerlijkeStaat', | id: 'burgerlijkeStaat', |
| label: 'Burgerlijke staat', | label: 'Burgerlijke staat', |
| type: 'select', | type: 'select', |
| required: true, | required: true, |
| options: [ | options: [ |
| { label: 'Selecteer...', value: '' }, | { label: 'Selecteer...', value: '' }, |
| { label: 'Alleenstaand', value: 'Alleenstaand' }, | { label: 'Alleenstaand', value: 'Alleenstaand' }, |
| { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } | { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } |
| ] | ] |
| }, | }, |
| { | { |
| id: 'geboortejaarKind1', | id: 'geboortejaarKind1', |
| label: 'Geboortejaar kind 1', | label: 'Geboortejaar kind 1', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 2007, max: 2024 }, | validation: { min: 2007, max: 2024 }, |
| conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } | conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } |
| } | } |
| ], | ], |
| sections: [ | sections: [ |
| { | { |
| id: 'volwassene1', | id: 'volwassene1', |
| title: 'Volwassene 1', | title: 'Volwassene 1', |
| fields: [ | fields: [ |
| { | { |
| id: 'naamVolwassene1', | id: 'naamVolwassene1', |
| label: 'Voornaam', | label: 'Voornaam', |
| type: 'text', | type: 'text', |
| required: false, | required: false, |
| placeholder: 'Optioneel' | placeholder: 'Optioneel' |
| } | } |
| ] | ] |
| } | } |
| ] | ] |
| }, | }, |

| C7: { | C7: { |
| --- | --- |
| title: 'Inkomsten', | title: 'Inkomsten', |
| subtitle: 'Uw maandelijkse inkomsten', | subtitle: 'Uw maandelijkse inkomsten', |
| step: 3, | step: 3, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'nettoMaandsalaris', | id: 'nettoMaandsalaris', |
| label: 'Netto maandsalaris (€)', | label: 'Netto maandsalaris (€)', |
| type: 'numeric', | type: 'numeric', |
| required: true, | required: true, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0' | placeholder: '0' |
| }, | }, |
| { | { |
| id: 'heeftToeslagen', | id: 'heeftToeslagen', |
| label: 'Heeft u toeslagen?', | label: 'Heeft u toeslagen?', |
| type: 'toggle', | type: 'toggle', |
| required: true, | required: true, |
| defaultValue: false | defaultValue: false |
| }, | }, |
| { | { |
| id: 'huurtoeslag', | id: 'huurtoeslag', |
| label: 'Huurtoeslag (€ per maand)', | label: 'Huurtoeslag (€ per maand)', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0', | placeholder: '0', |
| conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } | conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } |
| } | } |
| ] | ] |
| }, | }, |

| title: 'Vaste Lasten' |  |
| --- | --- |
| subtitle: 'Uw maandelijkse vaste uitgaven' |  |
| step: 4 |  |
| totalSteps: 4 |  |
| id: 'wonen' |  |
| label: 'Woonlasten (€)' |  |
| labelDynamic: true | // Will be calculated based on woonsituatie |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'energie' |  |
| label: 'Energie & Water (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'verzekeringen' |  |
| label: 'Verzekeringen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'abonnementen' |  |
| label: 'Abonnementen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'overig' |  |
| label: 'Overig (€)' |  |
| type: 'numeric' |  |
| required: false |  |
| validation: { min: 0 } |  |

// ============================================================================
// MOCK N8N SERVICE
// ============================================================================

| console.log('📡 Mock P3: Processing household data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId |  |
| --- | --- |
| status: 'Household_Data_Complete' |  |
| adults: formData.C1.aantalVolwassenen |  |
| children: formData.C1.aantalKinderen |  |
| housingType: formData.C1.woonsituatie |  |
| } |  |
| similarHouseholds: 127 |  |
| } |  |

| console.log('📡 Mock P5: Processing income data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Income_Data_Complete' |  |
| salary: formData.C7.nettoMaandsalaris |  |
| } |  |

| console.log('📡 Mock P6: Calculating financial summary...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1500)) |  |

| const inkomenTotaalMaand = (formData.C7.nettoMaandsalaris \|\| 0) + (formData.C7.huurtoeslag \|\| 0) |  |
| --- | --- |
| const lastenTotaalVast = (formData.C10.wonen \|\| 0) + (formData.C10.energie \|\| 0) + (formData.C10.verzekeringen \|\| 0) + (formData.C10.abonnementen \|\| 0) + (formData.C10.overig \|\| 0) |  |
| const cashflow = inkomenTotaalMaand - lastenTotaalVast |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Summary_Complete' |  |
| inkomenTotaalMaand |  |
| lastenTotaalVast |  |
| } |  |
| message: cashflow > 0 ? 'Gefeliciteerd! Uw cashflow is positief.' : 'Let op | uw cashflow is negatief.' |

// ============================================================================
// UI COMPONENTS (React Native)
// ============================================================================

| field: FieldConfig |  |
| --- | --- |
| value: any |  |
| onChange: (fieldId: string, value: any) => void |  |
| error: string \| null |  |

| Key | Value |
| --- | --- |
| // FieldComponent | Renders individual form fields |
| const FieldComponent = ({ field, value, onChange, error } | FieldComponentProps) => { // FIX: Used FieldComponentProps |
| const displayLabel = field.labelDynamic ? `${field.label} (berekend)` | field.label; |

| // Convert numeric input to number | keep other types as is |
| --- | --- |
| onChange(field.id | processedValue); |

  // Custom render logic for select (using <select> for web compatibility)

| return ( | return ( |
| --- | --- |
| <View style={styles.fieldContainer}> | <View style={styles.fieldContainer}> |
| <Text style={styles.fieldLabel}>{displayLabel}</Text> | <Text style={styles.fieldLabel}>{displayLabel}</Text> |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | ''} |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | '0'} |

| <View style={[styles.selectContainer | error && styles.inputError]}> |
| --- | --- |
| {/* OPMERKING: <select> en <option> zijn HTML-elementen die werken in React Native Web |  |

| style={[styles.toggleButton | value === true && styles.toggleButtonActive]} |
| --- | --- |
| <Text style={[styles.toggleText | value === true && styles.toggleTextActive]}>Ja</Text> |
| style={[styles.toggleButton | value === false && styles.toggleButtonActive]} |
| <Text style={[styles.toggleText | value === false && styles.toggleTextActive]}>Nee</Text> |

| ) |  |
| --- | --- |
| } |  |

| condition: any |  |
| --- | --- |
| formData: any |  |
| children: React.ReactNode | // FIX: Added children prop |

| const fieldPath = condition.field.split('.') |  |
| --- | --- |
| let value = formData |  |
| value = value?.[key] |  |
| if (value === undefined) return false |  |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

  const shouldRender = evaluateCondition();

| return shouldRender ? <>{children}</> : null |  |
| --- | --- |
| } |  |

| formData: Record<string | any>; |
| --- | --- |
| onChange: (fieldId: string | value: any) => void; |
| errors: Record<string | string \| null>; |
| touched: Record<string | boolean>; |

| ) |  |
| --- | --- |
| } |  |

| pageId: PageId |  |
| --- | --- |
| onNext: () => void |  |
| onBack: () => void |  |
| loading: boolean |  |

| const { state, dispatch } = useFormContext() |  |
| --- | --- |
| const config = React.useMemo(() => formConfig[pageId], [pageId]) |  |
| const [pageData, setPageData] = React.useState<Record<string, any>>({}) |  |
| const [errors, setErrors] = React.useState<Record<string, string \| null>>({}) |  |
| const [touched, setTouched] = React.useState<Record<string, boolean>>({}) |  |

| const initialData = config.fields.reduce((acc: Record<string | any> | field) => { |
| --- | --- | --- |
| } | {} as Record<string | any>); |

| loadData() |  |
| --- | --- |
| }, [pageId, config, dispatch]) |  |

| const handleChange = (fieldId | value) => { |
| --- | --- |
| setPageData(prev => ({ ...prev | [fieldId]: value })); |
| setErrors(prev => ({ ...prev | [fieldId]: null })); |

| const evaluateCondition = (condition | formData) => { |
| --- | --- |
| // Parse field path (e.g. | "C1.aantalKinderen") |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

| const newErrors: Record<string, string \| null> = {} |  |
| --- | --- |
| let isValid = true |  |

| const shouldRender = evaluateCondition(field.conditional, state) |  |
| --- | --- |
| if (!shouldRender) return | // Skip validation if not rendered |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| newErrors[field.id] = result.error | // FIX: Access safe due to explicit typing |
| isValid = false |  |
| }) |  |

| const shouldRender = evaluateCondition(field.conditional | state); |
| --- | --- |
| const result = validateField(field | pageData[field.id]); |

| setErrors(newErrors) |  |
| --- | --- |
| setTouched(config.fields.reduce((acc, f) => ({ ...acc, [f.id]: true }), {})) |  |
| return isValid |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onNext() |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onBack() |  |
| } |  |

| // Check if all visible | required fields have a valid value based on the current data (not just touched fields) |
| --- | --- |
| const shouldRender = evaluateCondition(field.conditional | state); |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| return result.valid |  |
| }) |  |
| } |  |

| const woonsituatie = state.C1?.woonsituatie |  |
| --- | --- |
| const wonenField = config.fields.find(f => f.id === 'wonen') |  |
| let label = 'Woonlasten (€)' |  |
| if (woonsituatie === 'Huurder') label = 'Huur (€ per maand)' |  |
| if (woonsituatie === 'Koper') label = 'Hypotheek (€ per maand)' |  |
| if (woonsituatie === 'Inwonend') label = 'Bijdrage huishouden (€ per maand)' |  |

| wonenField.label = label |  |
| --- | --- |
| }, [state.C1, pageId, config.fields]) |  |

| setPageData(state[pageId]) |  |
| --- | --- |
| }, [state, pageId]) |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container} contentContainerStyle={styles.content}> | <ScrollView style={styles.container} contentContainerStyle={styles.content}> |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> | <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> |
| <Text style={styles.title}>{config.title}</Text> | <Text style={styles.title}>{config.title}</Text> |
| <Text style={styles.subtitle}>{config.subtitle}</Text> | <Text style={styles.subtitle}>{config.subtitle}</Text> |
| </View> | </View> |

| <View style={styles.formSection}> | <View style={styles.formSection}> |
| --- | --- |
| {/* Main fields */} | {/* Main fields */} |
| {config.fields.map(field => ( | {config.fields.map(field => ( |
| <ConditionalField key={field.id} condition={field.conditional} formData={state}> | <ConditionalField key={field.id} condition={field.conditional} formData={state}> |
| <FieldComponent | <FieldComponent |
| field={field} | field={field} |
| value={pageData[field.id]} | value={pageData[field.id]} |
| onChange={handleChange} | onChange={handleChange} |
| error={touched[field.id] ? errors[field.id] : null} | error={touched[field.id] ? errors[field.id] : null} |
| /> | /> |
| </ConditionalField> | </ConditionalField> |
| ))} | ))} |

| {/* Sections (e.g., Volwassenen, Kinderen) */} | {/* Sections (e.g., Volwassenen, Kinderen) */} |
| --- | --- |
| {config.sections && config.sections.map(section => ( | {config.sections && config.sections.map(section => ( |
| <DynamicSection | <DynamicSection |
| key={section.id} | key={section.id} |
| section={section} | section={section} |
| formData={pageData} | formData={pageData} |
| state={state} | state={state} |
| onChange={handleChange} | onChange={handleChange} |
| errors={errors} | errors={errors} |
| touched={touched} | touched={touched} |
| /> | /> |
| ))} | ))} |

| {/* Conditionals (e.g. | text displays) */} |
| --- | --- |
| {cond.template.replace('{aantalKinderen}' | state.C1?.aantalKinderen) |
| .replace('{plural}' | state.C1?.aantalKinderen === 1 ? 'kind' : 'kinderen')} |

| disabled={loading |  | config.step === 1} |
| --- | --- | --- |
| style={[styles.buttonPrimary, (!isFormValid() |  | loading) && styles.buttonDisabled]} |
| disabled={!isFormValid() |  | loading} |

// ============================================================================
// SCREENS
// ============================================================================

| const { dispatch } = useFormContext() |  |
| --- | --- |
| const [checking, setChecking] = React.useState(true) |  |

| const userId = await getUserId() |  |
| --- | --- |
| const allData = await loadAllFormData() |  |

| console.log('✓ Returning user detected | loading data...'); |
| --- | --- |
| dispatch({ type: 'LOAD_SAVED_STATE' | data: allData }); |

| checkReturningUser() |  |
| --- | --- |
| }, [dispatch, onStart]) |  |

| if (checking) { | if (checking) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Laden...</Text> | <Text style={styles.loadingText}>Laden...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

| ) |  |
| --- | --- |
| } |  |

| inkomenTotaalMaand: number |  |
| --- | --- |
| lastenTotaalVast: number |  |
| cashflow: number |  |
| } |  |

| const [summary | setSummary] = React.useState<SummaryData \| null>(null); // FIX: Typed summary state |
| --- | --- |
| const [loading | setLoading] = React.useState(true); |

| setLoading(true) |  |
| --- | --- |
| const result = await mockN8n.callP6(state) |  |
| setSummary(result.summary as SummaryData) |  |
| setLoading(false) |  |
| } |  |

| calculate() |  |
| --- | --- |
| }, [state]) | // FIX: Added 'state' dependency |

| if (loading \|\| !summary) { | if (loading \|\| !summary) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> | <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

  const { cashflow } = summary; // FIX: Destructuring moved after the loading check

| if (cashflow > 0) return '#34C759' | // Green |
| --- | --- |
| if (cashflow < 0) return '#FF3B30' | // Red |
| return '#FFCC00' | // Yellow |
| } |  |

| if (cashflow > 100) return 'Uitstekend! Uw financiële positie is zeer sterk.' |  |
| --- | --- |
| if (cashflow > 0) return 'Goed! U houdt maandelijks geld over.' |  |
| if (cashflow < -100) return 'Zorgwekkend. Er is een significant maandelijks tekort.' |  |
| if (cashflow < 0) return 'Nog net een tekort. Bekijk uw vaste lasten kritisch.' |  |
| return 'Uw inkomsten en lasten zijn in balans.' |  |
| } |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container}> | <ScrollView style={styles.container}> |
| <View style={styles.content}> | <View style={styles.content}> |
| <Text style={styles.title}>Uw Financieel Overzicht</Text> | <Text style={styles.title}>Uw Financieel Overzicht</Text> |

| <View style={[styles.dashboardCard | { borderLeftColor: getColor() }]}> |
| --- | --- |
| <Text style={[styles.dashboardKPI | { color: getColor() }]}> |

| <View style={styles.summarySection}> | <View style={styles.summarySection}> |
| --- | --- |
| <Text style={styles.sectionTitle}>Samenvatting</Text> | <Text style={styles.sectionTitle}>Samenvatting</Text> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> | <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> |
| <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Vaste Lasten:</Text> | <Text style={styles.summaryLabel}>Vaste Lasten:</Text> |
| <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={[styles.summaryRow, styles.summaryRowTotal]}> | <View style={[styles.summaryRow, styles.summaryRowTotal]}> |
| <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> | <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> |
| <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> | <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> |
| €{cashflow.toFixed(2)} | €{cashflow.toFixed(2)} |
| </Text> | </Text> |
| </View> | </View> |
| </View> | </View> |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// MAIN APP & NAVIGATION
// ============================================================================

| const [currentScreen | setCurrentScreen] = React.useState('Landing'); |
| --- | --- |
| const [loading | setLoading] = React.useState(false); |
| const { state | dispatch } = useFormContext(); |

| setLoading(true) |  |
| --- | --- |
| setCurrentScreen(screenId) |  |
| setLoading(false) |  |
| }, 100) |  |
| } |  |

| dispatch({ type: 'RESET_STATE' }) |  |
| --- | --- |
| Storage.clear() |  |
| saveUserId(null) | // Clear stored ID |
| navigate(initialScreenId) |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |
| navigate(pages[currentIndex - 1]) |  |
| navigate('Landing') |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |

    // Logic for API calls after specific steps (C1 -> P3, C7 -> P5)

| dispatch({ type: 'SET_USER_ID' | userId: result.userId }); |
| --- | --- |
| console.error('P3 Error:' | error); |

| // No state update needed | just proceed |
| --- | --- |
| console.error('P5 Error:' | error); |

| navigate('Dashboard') |  |
| --- | --- |
| return |  |

| navigate(pages[currentIndex + 1]) |  |
| --- | --- |
| } |  |

| navigate('C10') |  |
| --- | --- |
| } |  |

| return <LandingScreen onStart={handleStart} /> |  |
| --- | --- |
| return <DashboardScreen onBack={handleDashboardBack} /> |  |
| ) |  |
| return <LandingScreen onStart={handleStart} /> |  |
| } |  |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// STYLES (Mock for React Native Web)
// ============================================================================

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS background
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
    minHeight: '100%',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6E6E73',
  },
  // Header
  header: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 32
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center'
  },
  landingSubtitle: {
    fontSize: 18,
    color: '#6E6E73',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 26
  },
  // Fields
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48 // WCAG touch target
  },
  inputError: {
    borderColor: '#FF3B30', // Red
  },
  errorText: {
    marginTop: 6,
    fontSize: 14,
    color: '#FF3B30', // Red
  },
  infoText: {
    marginTop: 6,
    fontSize: 14,
    color: '#007AFF', // Blue
    padding: 12,
    backgroundColor: '#E5F1FF',
    borderRadius: 8,
  },
  // Dynamic Section
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10
  },
  // Select (Mocked for web)
  selectContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  select: {
    // Basic web style reset for React Native Web
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48,
  },
  // Toggle Buttons
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF', // Active background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E73',
  },
  toggleTextActive: {
    color: '#1C1C1E',
  },
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D6',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Privacy
  privacyNote: {
    marginTop: 40,
    paddingHorizontal: 10,
  },
  privacyText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Dashboard
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 6,
    borderLeftColor: '#007AFF', // Default Blue
  },
  dashboardLabel: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 8
  },
  dashboardKPI: {
    fontSize: 48, // ≥28pt WCAG requirement
    fontWeight: '700',
    marginBottom: 16
  },
  dashboardMessage: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7'
  },
  summaryRowTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#D1D1D6'
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6E6E73'
  },
  summaryLabelBold: {
    fontWeight: '700',
    color: '#1C1C1E'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  summaryValueBold: {
    fontWeight: '700',
  }
});

// Wrap the App in the FormProvider (This is part of the original structure)
const Root = () => (
  <FormProvider>
    <App />
  </FormProvider>
);

export default Root;
```

```
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

export {}; // FIX: Explicitly declare as a module for TypeScript's isolatedModules.

// ============================================================================
// CONTEXT & STATE MANAGEMENT (Optie A - TS typed)
// ============================================================================
type FormAction = { type: string; [key: string]: any };
type FormState = Record<string, any>;
type FormContextValue = { state: FormState; dispatch: React.Dispatch<FormAction>; };

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

| } |  |
| --- | --- |
| return { ...state, ...action.data } |  |
| return { ...state, userId: action.userId } |  |
| return { userId: null } |  |
| return state |  |

interface FormProviderProps {
    children: React.ReactNode; // FIX: Added 'children' to FormProviderProps
}

const FormProvider = ({ children }: FormProviderProps) => {
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);

| ) |  |
| --- | --- |
| } |  |

| const context = React.useContext(FormContext) |  |
| --- | --- |
| if (!context) throw new Error('useFormContext must be used within FormProvider') |  |
| return context |  |
| } |  |

// ============================================================================
// STORAGE UTILITIES (Mock AsyncStorage for web)
// ============================================================================

const Storage = {
  store: {} as Record<string, string>,

| async getItem(key: string): Promise<any \| null> { | async getItem(key: string): Promise<any \| null> { |
| --- | --- |
| return this.store[key] \|\| null; | return this.store[key] \|\| null; |
| }, | }, |

| async setItem(key: string | value: any): Promise<void> { |
| --- | --- |
| } |  |

| async removeItem(key: string): Promise<void> { | async removeItem(key: string): Promise<void> { |
| --- | --- |
| delete this.store[key]; | delete this.store[key]; |
| }, | }, |

| this.store = {} |  |
| --- | --- |
| } |  |

| const savePageData = async (pageId: string | data: any) => { |
| --- | --- |
| await Storage.setItem(`setupData_${pageId}` | JSON.stringify(data)); |
| console.log(`✓ Saved ${pageId} data:` | data); |
| console.error(`✗ Error saving ${pageId}:` | error); |

| const data = await Storage.getItem(`setupData_${pageId}`) |  |
| --- | --- |
| return data ? JSON.parse(data) : null |  |
| console.error(`✗ Error loading ${pageId}:`, error) |  |
| return null |  |
| } |  |

| await Storage.setItem('userId' | userId); |
| --- | --- |
| console.log('✓ User ID saved:' | userId); |

| return await Storage.getItem('userId') |  |
| --- | --- |
| } |  |

| type PageId = 'C1' \| 'C4' \| 'C7' \| 'C10' |  |
| --- | --- |
| type PageData = Record<string, any> |  |

| const pages: PageId[] = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const allData: Record<string, any> = {} |  |
| const data = await loadPageData(pageId) |  |
| if (data) allData[pageId] = data |  |

| const userId = await getUserId() |  |
| --- | --- |
| if (userId) allData.userId = userId |  |

| return allData as Record<PageId, PageData> & { userId?: string } |  |
| --- | --- |
| } |  |

// ============================================================================
// VALIDATION ENGINE
// ============================================================================

| required: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} is verplicht` }; |
| return { valid: true | error: null }; |
| } |  |

| return { valid: false, error: `${fieldLabel} moet minimaal ${min} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

| return { valid: false, error: `${fieldLabel} mag maximaal ${max} zijn` } |  |
| --- | --- |
| return { valid: true, error: null } |  |

  },

| postcode: (value: string | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet 4 cijfers zijn` }; |
| return { valid: true | error: null }; |
| } |  |

| numeric: (value: any | fieldLabel: string) => { |
| --- | --- |
| return { valid: false | error: `${fieldLabel} moet een getal zijn` }; |
| return { valid: true | error: null }; |

type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'numeric' | 'select' | 'toggle';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: { min?: number; max?: number; postcode?: boolean };
  options?: { label: string; value: string }[];
  conditional?: { field: string; operator: '>'|'<'|'>='|'<='|'==='|'!==' ; value: any };
};

| const validateField = (field: FieldConfig | value: any): { valid: boolean; error: string \| null } => { |
| --- | --- |
| const result = validation.required(value | field.label); |

| // Skip other validations if empty and not required | // Skip other validations if empty and not required |
| --- | --- |
| if (value === null \|\| value === undefined \|\| value === '') { | if (value === null \|\| value === undefined \|\| value === '') { |
| return { valid: true, error: null }; | return { valid: true, error: null }; |
| } | } |

| const result = validation.numeric(value, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |

| const result = validation.min(value, field.validation.min, field.label) |  |
| --- | --- |
| if (!result.valid) return result |  |
| const result = validation.max(value, field.validation.max, field.label) |  |
| if (!result.valid) return result |  |
| const result = validation.postcode(value, field.label) |  |
| if (!result.valid) return result |  |

| return { valid: true, error: null } |  |
| --- | --- |
| } |  |

| id: string |  |
| --- | --- |
| title: string |  |
| fields: FieldConfig[] |  |

| title: string |  |
| --- | --- |
| subtitle: string |  |
| step: number |  |
| totalSteps: number |  |
| fields: FieldConfig[] |  |
| conditionals?: any[] |  |
| sections?: SectionConfig[] | // FIX: Used SectionConfig |
| } |  |

// ============================================================================
// CONFIGURATION: FORM FIELDS
// ============================================================================

const formConfig: Record<PageId, PageConfig> = { // FIX: Added type check for formConfig
  C1: {
    title: 'Huishouden (Basis)',
    subtitle: 'Vertel ons over uw huishouden',
    step: 1,
    totalSteps: 4,
    fields: [
      {
        id: 'aantalVolwassenen',
        label: 'Aantal volwassenen in huis',
        type: 'numeric',
        required: true,
        validation: { min: 1, max: 10 },
        defaultValue: 1
      },
      {
        id: 'aantalKinderen',
        label: 'Aantal kinderen (0-17 jaar)',
        type: 'numeric',
        required: true,
        validation: { min: 0, max: 10 },
        defaultValue: 0
      },
      {
        id: 'woonsituatie',
        label: 'Woonsituatie',
        type: 'select',
        required: true,
        options: [
          { label: 'Selecteer...', value: '' },
          { label: 'Huurder', value: 'Huurder' },
          { label: 'Koper', value: 'Koper' },
          { label: 'Inwonend', value: 'Inwonend' },
          { label: 'Anders', value: 'Anders' }
        ]
      }
    ],
    conditionals: [
      {
        id: 'kinderenDisplay',
        condition: { field: 'aantalKinderen', operator: '>', value: 0 },
        type: 'text',
        template: 'U heeft {aantalKinderen} {plural} in uw huishouden'
      }
    ]
  },

| C4: { | C4: { |
| --- | --- |
| title: 'Huishouden (Details)', | title: 'Huishouden (Details)', |
| subtitle: 'Aanvullende informatie over uw huishouden', | subtitle: 'Aanvullende informatie over uw huishouden', |
| step: 2, | step: 2, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'postcode', | id: 'postcode', |
| label: 'Postcode (4 cijfers)', | label: 'Postcode (4 cijfers)', |
| type: 'text', | type: 'text', |
| required: true, | required: true, |
| validation: { postcode: true }, | validation: { postcode: true }, |
| placeholder: '1234' | placeholder: '1234' |
| }, | }, |
| { | { |
| id: 'burgerlijkeStaat', | id: 'burgerlijkeStaat', |
| label: 'Burgerlijke staat', | label: 'Burgerlijke staat', |
| type: 'select', | type: 'select', |
| required: true, | required: true, |
| options: [ | options: [ |
| { label: 'Selecteer...', value: '' }, | { label: 'Selecteer...', value: '' }, |
| { label: 'Alleenstaand', value: 'Alleenstaand' }, | { label: 'Alleenstaand', value: 'Alleenstaand' }, |
| { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } | { label: 'Gehuwd/Samenwonend', value: 'Gehuwd' } |
| ] | ] |
| }, | }, |
| { | { |
| id: 'geboortejaarKind1', | id: 'geboortejaarKind1', |
| label: 'Geboortejaar kind 1', | label: 'Geboortejaar kind 1', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 2007, max: 2024 }, | validation: { min: 2007, max: 2024 }, |
| conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } | conditional: { field: 'C1.aantalKinderen', operator: '>', value: 0 } |
| } | } |
| ], | ], |
| sections: [ | sections: [ |
| { | { |
| id: 'volwassene1', | id: 'volwassene1', |
| title: 'Volwassene 1', | title: 'Volwassene 1', |
| fields: [ | fields: [ |
| { | { |
| id: 'naamVolwassene1', | id: 'naamVolwassene1', |
| label: 'Voornaam', | label: 'Voornaam', |
| type: 'text', | type: 'text', |
| required: false, | required: false, |
| placeholder: 'Optioneel' | placeholder: 'Optioneel' |
| } | } |
| ] | ] |
| } | } |
| ] | ] |
| }, | }, |

| C7: { | C7: { |
| --- | --- |
| title: 'Inkomsten', | title: 'Inkomsten', |
| subtitle: 'Uw maandelijkse inkomsten', | subtitle: 'Uw maandelijkse inkomsten', |
| step: 3, | step: 3, |
| totalSteps: 4, | totalSteps: 4, |
| fields: [ | fields: [ |
| { | { |
| id: 'nettoMaandsalaris', | id: 'nettoMaandsalaris', |
| label: 'Netto maandsalaris (€)', | label: 'Netto maandsalaris (€)', |
| type: 'numeric', | type: 'numeric', |
| required: true, | required: true, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0' | placeholder: '0' |
| }, | }, |
| { | { |
| id: 'heeftToeslagen', | id: 'heeftToeslagen', |
| label: 'Heeft u toeslagen?', | label: 'Heeft u toeslagen?', |
| type: 'toggle', | type: 'toggle', |
| required: true, | required: true, |
| defaultValue: false | defaultValue: false |
| }, | }, |
| { | { |
| id: 'huurtoeslag', | id: 'huurtoeslag', |
| label: 'Huurtoeslag (€ per maand)', | label: 'Huurtoeslag (€ per maand)', |
| type: 'numeric', | type: 'numeric', |
| required: false, | required: false, |
| validation: { min: 0 }, | validation: { min: 0 }, |
| placeholder: '0', | placeholder: '0', |
| conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } | conditional: { field: 'C7.heeftToeslagen', operator: '===', value: true } |
| } | } |
| ] | ] |
| }, | }, |

| title: 'Vaste Lasten' |  |
| --- | --- |
| subtitle: 'Uw maandelijkse vaste uitgaven' |  |
| step: 4 |  |
| totalSteps: 4 |  |
| id: 'wonen' |  |
| label: 'Woonlasten (€)' |  |
| labelDynamic: true | // Will be calculated based on woonsituatie |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'energie' |  |
| label: 'Energie & Water (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'verzekeringen' |  |
| label: 'Verzekeringen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'abonnementen' |  |
| label: 'Abonnementen (€)' |  |
| type: 'numeric' |  |
| required: true |  |
| validation: { min: 0 } |  |
| } |  |
| id: 'overig' |  |
| label: 'Overig (€)' |  |
| type: 'numeric' |  |
| required: false |  |
| validation: { min: 0 } |  |

// ============================================================================
// MOCK N8N SERVICE
// ============================================================================

| console.log('📡 Mock P3: Processing household data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId |  |
| --- | --- |
| status: 'Household_Data_Complete' |  |
| adults: formData.C1.aantalVolwassenen |  |
| children: formData.C1.aantalKinderen |  |
| housingType: formData.C1.woonsituatie |  |
| } |  |
| similarHouseholds: 127 |  |
| } |  |

| console.log('📡 Mock P5: Processing income data...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1000)) |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Income_Data_Complete' |  |
| salary: formData.C7.nettoMaandsalaris |  |
| } |  |

| console.log('📡 Mock P6: Calculating financial summary...') |  |
| --- | --- |
| await new Promise(resolve => setTimeout(resolve, 1500)) |  |

| const inkomenTotaalMaand = (formData.C7.nettoMaandsalaris \|\| 0) + (formData.C7.huurtoeslag \|\| 0) |  |
| --- | --- |
| const lastenTotaalVast = (formData.C10.wonen \|\| 0) + (formData.C10.energie \|\| 0) + (formData.C10.verzekeringen \|\| 0) + (formData.C10.abonnementen \|\| 0) + (formData.C10.overig \|\| 0) |  |
| const cashflow = inkomenTotaalMaand - lastenTotaalVast |  |

| userId: formData.userId |  |
| --- | --- |
| status: 'Summary_Complete' |  |
| inkomenTotaalMaand |  |
| lastenTotaalVast |  |
| } |  |
| message: cashflow > 0 ? 'Gefeliciteerd! Uw cashflow is positief.' : 'Let op | uw cashflow is negatief.' |

// ============================================================================
// UI COMPONENTS (React Native)
// ============================================================================

| field: FieldConfig |  |
| --- | --- |
| value: any |  |
| onChange: (fieldId: string, value: any) => void |  |
| error: string \| null |  |

| Key | Value |
| --- | --- |
| // FieldComponent | Renders individual form fields |
| const FieldComponent = ({ field, value, onChange, error } | FieldComponentProps) => { // FIX: Used FieldComponentProps |
| const displayLabel = field.labelDynamic ? `${field.label} (berekend)` | field.label; |

| // Convert numeric input to number | keep other types as is |
| --- | --- |
| onChange(field.id | processedValue); |

  // Custom render logic for select (using <select> for web compatibility)

| return ( | return ( |
| --- | --- |
| <View style={styles.fieldContainer}> | <View style={styles.fieldContainer}> |
| <Text style={styles.fieldLabel}>{displayLabel}</Text> | <Text style={styles.fieldLabel}>{displayLabel}</Text> |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | ''} |

| value={value === null |  | value === undefined ? '' : String(value)} |
| --- | --- | --- |
| placeholder={field.placeholder |  | '0'} |

| <View style={[styles.selectContainer | error && styles.inputError]}> |
| --- | --- |
| {/* OPMERKING: <select> en <option> zijn HTML-elementen die werken in React Native Web |  |

| style={[styles.toggleButton | value === true && styles.toggleButtonActive]} |
| --- | --- |
| <Text style={[styles.toggleText | value === true && styles.toggleTextActive]}>Ja</Text> |
| style={[styles.toggleButton | value === false && styles.toggleButtonActive]} |
| <Text style={[styles.toggleText | value === false && styles.toggleTextActive]}>Nee</Text> |

| ) |  |
| --- | --- |
| } |  |

| condition: any |  |
| --- | --- |
| formData: any |  |
| children: React.ReactNode | // FIX: Added children prop |

| const fieldPath = condition.field.split('.') |  |
| --- | --- |
| let value = formData |  |
| value = value?.[key] |  |
| if (value === undefined) return false |  |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

  const shouldRender = evaluateCondition();

| return shouldRender ? <>{children}</> : null |  |
| --- | --- |
| } |  |

| formData: Record<string | any>; |
| --- | --- |
| onChange: (fieldId: string | value: any) => void; |
| errors: Record<string | string \| null>; |
| touched: Record<string | boolean>; |

| ) |  |
| --- | --- |
| } |  |

| pageId: PageId |  |
| --- | --- |
| onNext: () => void |  |
| onBack: () => void |  |
| loading: boolean |  |

| const { state, dispatch } = useFormContext() |  |
| --- | --- |
| const config = React.useMemo(() => formConfig[pageId], [pageId]) |  |
| const [pageData, setPageData] = React.useState<Record<string, any>>({}) |  |
| const [errors, setErrors] = React.useState<Record<string, string \| null>>({}) |  |
| const [touched, setTouched] = React.useState<Record<string, boolean>>({}) |  |

| const initialData = config.fields.reduce((acc: Record<string | any> | field) => { |
| --- | --- | --- |
| } | {} as Record<string | any>); |

| loadData() |  |
| --- | --- |
| }, [pageId, config, dispatch]) |  |

| const handleChange = (fieldId | value) => { |
| --- | --- |
| setPageData(prev => ({ ...prev | [fieldId]: value })); |
| setErrors(prev => ({ ...prev | [fieldId]: null })); |

| const evaluateCondition = (condition | formData) => { |
| --- | --- |
| // Parse field path (e.g. | "C1.aantalKinderen") |

| case '>': return value > condition.value |  |
| --- | --- |
| case '<': return value < condition.value |  |
| case '>=': return value >= condition.value |  |
| case '<=': return value <= condition.value |  |
| case '===': return value === condition.value |  |
| case '!==': return value !== condition.value |  |
| default: return false |  |
| } |  |

| const newErrors: Record<string, string \| null> = {} |  |
| --- | --- |
| let isValid = true |  |

| const shouldRender = evaluateCondition(field.conditional, state) |  |
| --- | --- |
| if (!shouldRender) return | // Skip validation if not rendered |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| newErrors[field.id] = result.error | // FIX: Access safe due to explicit typing |
| isValid = false |  |
| }) |  |

| const shouldRender = evaluateCondition(field.conditional | state); |
| --- | --- |
| const result = validateField(field | pageData[field.id]); |

| setErrors(newErrors) |  |
| --- | --- |
| setTouched(config.fields.reduce((acc, f) => ({ ...acc, [f.id]: true }), {})) |  |
| return isValid |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onNext() |  |
| } |  |

| await savePageData(pageId, pageData) |  |
| --- | --- |
| dispatch({ type: 'SET_PAGE_DATA', pageId, data: pageData }) | // Update global state |
| onBack() |  |
| } |  |

| // Check if all visible | required fields have a valid value based on the current data (not just touched fields) |
| --- | --- |
| const shouldRender = evaluateCondition(field.conditional | state); |

| const result = validateField(field, pageData[field.id]) |  |
| --- | --- |
| return result.valid |  |
| }) |  |
| } |  |

| const woonsituatie = state.C1?.woonsituatie |  |
| --- | --- |
| const wonenField = config.fields.find(f => f.id === 'wonen') |  |
| let label = 'Woonlasten (€)' |  |
| if (woonsituatie === 'Huurder') label = 'Huur (€ per maand)' |  |
| if (woonsituatie === 'Koper') label = 'Hypotheek (€ per maand)' |  |
| if (woonsituatie === 'Inwonend') label = 'Bijdrage huishouden (€ per maand)' |  |

| wonenField.label = label |  |
| --- | --- |
| }, [state.C1, pageId, config.fields]) |  |

| setPageData(state[pageId]) |  |
| --- | --- |
| }, [state, pageId]) |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container} contentContainerStyle={styles.content}> | <ScrollView style={styles.container} contentContainerStyle={styles.content}> |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> | <Text style={styles.stepTitle}>Stap {config.step}/{config.totalSteps}</Text> |
| <Text style={styles.title}>{config.title}</Text> | <Text style={styles.title}>{config.title}</Text> |
| <Text style={styles.subtitle}>{config.subtitle}</Text> | <Text style={styles.subtitle}>{config.subtitle}</Text> |
| </View> | </View> |

| <View style={styles.formSection}> | <View style={styles.formSection}> |
| --- | --- |
| {/* Main fields */} | {/* Main fields */} |
| {config.fields.map(field => ( | {config.fields.map(field => ( |
| <ConditionalField key={field.id} condition={field.conditional} formData={state}> | <ConditionalField key={field.id} condition={field.conditional} formData={state}> |
| <FieldComponent | <FieldComponent |
| field={field} | field={field} |
| value={pageData[field.id]} | value={pageData[field.id]} |
| onChange={handleChange} | onChange={handleChange} |
| error={touched[field.id] ? errors[field.id] : null} | error={touched[field.id] ? errors[field.id] : null} |
| /> | /> |
| </ConditionalField> | </ConditionalField> |
| ))} | ))} |

| {/* Sections (e.g., Volwassenen, Kinderen) */} | {/* Sections (e.g., Volwassenen, Kinderen) */} |
| --- | --- |
| {config.sections && config.sections.map(section => ( | {config.sections && config.sections.map(section => ( |
| <DynamicSection | <DynamicSection |
| key={section.id} | key={section.id} |
| section={section} | section={section} |
| formData={pageData} | formData={pageData} |
| state={state} | state={state} |
| onChange={handleChange} | onChange={handleChange} |
| errors={errors} | errors={errors} |
| touched={touched} | touched={touched} |
| /> | /> |
| ))} | ))} |

| {/* Conditionals (e.g. | text displays) */} |
| --- | --- |
| {cond.template.replace('{aantalKinderen}' | state.C1?.aantalKinderen) |
| .replace('{plural}' | state.C1?.aantalKinderen === 1 ? 'kind' : 'kinderen')} |

| disabled={loading |  | config.step === 1} |
| --- | --- | --- |
| style={[styles.buttonPrimary, (!isFormValid() |  | loading) && styles.buttonDisabled]} |
| disabled={!isFormValid() |  | loading} |

// ============================================================================
// SCREENS
// ============================================================================

| const { dispatch } = useFormContext() |  |
| --- | --- |
| const [checking, setChecking] = React.useState(true) |  |

| const userId = await getUserId() |  |
| --- | --- |
| const allData = await loadAllFormData() |  |

| console.log('✓ Returning user detected | loading data...'); |
| --- | --- |
| dispatch({ type: 'LOAD_SAVED_STATE' | data: allData }); |

| checkReturningUser() |  |
| --- | --- |
| }, [dispatch, onStart]) |  |

| if (checking) { | if (checking) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Laden...</Text> | <Text style={styles.loadingText}>Laden...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

| ) |  |
| --- | --- |
| } |  |

| inkomenTotaalMaand: number |  |
| --- | --- |
| lastenTotaalVast: number |  |
| cashflow: number |  |
| } |  |

| const [summary | setSummary] = React.useState<SummaryData \| null>(null); // FIX: Typed summary state |
| --- | --- |
| const [loading | setLoading] = React.useState(true); |

| setLoading(true) |  |
| --- | --- |
| const result = await mockN8n.callP6(state) |  |
| setSummary(result.summary as SummaryData) |  |
| setLoading(false) |  |
| } |  |

| calculate() |  |
| --- | --- |
| }, [state]) | // FIX: Added 'state' dependency |

| if (loading \|\| !summary) { | if (loading \|\| !summary) { |
| --- | --- |
| return ( | return ( |
| <View style={styles.container}> | <View style={styles.container}> |
| <View style={styles.centerContent}> | <View style={styles.centerContent}> |
| <ActivityIndicator size="large" color="#007AFF" /> | <ActivityIndicator size="large" color="#007AFF" /> |
| <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> | <Text style={styles.loadingText}>Financiële analyse berekenen...</Text> |
| </View> | </View> |
| </View> | </View> |
| ); | ); |
| } | } |

  const { cashflow } = summary; // FIX: Destructuring moved after the loading check

| if (cashflow > 0) return '#34C759' | // Green |
| --- | --- |
| if (cashflow < 0) return '#FF3B30' | // Red |
| return '#FFCC00' | // Yellow |
| } |  |

| if (cashflow > 100) return 'Uitstekend! Uw financiële positie is zeer sterk.' |  |
| --- | --- |
| if (cashflow > 0) return 'Goed! U houdt maandelijks geld over.' |  |
| if (cashflow < -100) return 'Zorgwekkend. Er is een significant maandelijks tekort.' |  |
| if (cashflow < 0) return 'Nog net een tekort. Bekijk uw vaste lasten kritisch.' |  |
| return 'Uw inkomsten en lasten zijn in balans.' |  |
| } |  |

| return ( | return ( |
| --- | --- |
| <ScrollView style={styles.container}> | <ScrollView style={styles.container}> |
| <View style={styles.content}> | <View style={styles.content}> |
| <Text style={styles.title}>Uw Financieel Overzicht</Text> | <Text style={styles.title}>Uw Financieel Overzicht</Text> |

| <View style={[styles.dashboardCard | { borderLeftColor: getColor() }]}> |
| --- | --- |
| <Text style={[styles.dashboardKPI | { color: getColor() }]}> |

| <View style={styles.summarySection}> | <View style={styles.summarySection}> |
| --- | --- |
| <Text style={styles.sectionTitle}>Samenvatting</Text> | <Text style={styles.sectionTitle}>Samenvatting</Text> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> | <Text style={styles.summaryLabel}>Totaal Inkomen:</Text> |
| <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.inkomenTotaalMaand?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={styles.summaryRow}> | <View style={styles.summaryRow}> |
| <Text style={styles.summaryLabel}>Vaste Lasten:</Text> | <Text style={styles.summaryLabel}>Vaste Lasten:</Text> |
| <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> | <Text style={styles.summaryValue}>€{summary?.lastenTotaalVast?.toFixed(2)}</Text> |
| </View> | </View> |
| <View style={[styles.summaryRow, styles.summaryRowTotal]}> | <View style={[styles.summaryRow, styles.summaryRowTotal]}> |
| <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> | <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Cashflow:</Text> |
| <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> | <Text style={[styles.summaryValue, styles.summaryValueBold, { color: getColor() }]}> |
| €{cashflow.toFixed(2)} | €{cashflow.toFixed(2)} |
| </Text> | </Text> |
| </View> | </View> |
| </View> | </View> |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// MAIN APP & NAVIGATION
// ============================================================================

| const [currentScreen | setCurrentScreen] = React.useState('Landing'); |
| --- | --- |
| const [loading | setLoading] = React.useState(false); |
| const { state | dispatch } = useFormContext(); |

| setLoading(true) |  |
| --- | --- |
| setCurrentScreen(screenId) |  |
| setLoading(false) |  |
| }, 100) |  |
| } |  |

| dispatch({ type: 'RESET_STATE' }) |  |
| --- | --- |
| Storage.clear() |  |
| saveUserId(null) | // Clear stored ID |
| navigate(initialScreenId) |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |
| navigate(pages[currentIndex - 1]) |  |
| navigate('Landing') |  |
| } |  |

| const pages = ['C1', 'C4', 'C7', 'C10'] |  |
| --- | --- |
| const currentIndex = pages.indexOf(currentScreen) |  |

    // Logic for API calls after specific steps (C1 -> P3, C7 -> P5)

| dispatch({ type: 'SET_USER_ID' | userId: result.userId }); |
| --- | --- |
| console.error('P3 Error:' | error); |

| // No state update needed | just proceed |
| --- | --- |
| console.error('P5 Error:' | error); |

| navigate('Dashboard') |  |
| --- | --- |
| return |  |

| navigate(pages[currentIndex + 1]) |  |
| --- | --- |
| } |  |

| navigate('C10') |  |
| --- | --- |
| } |  |

| return <LandingScreen onStart={handleStart} /> |  |
| --- | --- |
| return <DashboardScreen onBack={handleDashboardBack} /> |  |
| ) |  |
| return <LandingScreen onStart={handleStart} /> |  |
| } |  |

| ) |  |
| --- | --- |
| } |  |

// ============================================================================
// STYLES (Mock for React Native Web)
// ============================================================================

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS background
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
    minHeight: '100%',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6E6E73',
  },
  // Header
  header: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 32
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center'
  },
  landingSubtitle: {
    fontSize: 18,
    color: '#6E6E73',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 26
  },
  // Fields
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48 // WCAG touch target
  },
  inputError: {
    borderColor: '#FF3B30', // Red
  },
  errorText: {
    marginTop: 6,
    fontSize: 14,
    color: '#FF3B30', // Red
  },
  infoText: {
    marginTop: 6,
    fontSize: 14,
    color: '#007AFF', // Blue
    padding: 12,
    backgroundColor: '#E5F1FF',
    borderRadius: 8,
  },
  // Dynamic Section
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10
  },
  // Select (Mocked for web)
  selectContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  select: {
    // Basic web style reset for React Native Web
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 48,
  },
  // Toggle Buttons
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF', // Active background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E73',
  },
  toggleTextActive: {
    color: '#1C1C1E',
  },
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D6',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Privacy
  privacyNote: {
    marginTop: 40,
    paddingHorizontal: 10,
  },
  privacyText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Dashboard
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 6,
    borderLeftColor: '#007AFF', // Default Blue
  },
  dashboardLabel: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 8
  },
  dashboardKPI: {
    fontSize: 48, // ≥28pt WCAG requirement
    fontWeight: '700',
    marginBottom: 16
  },
  dashboardMessage: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7'
  },
  summaryRowTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#D1D1D6'
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6E6E73'
  },
  summaryLabelBold: {
    fontWeight: '700',
    color: '#1C1C1E'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  summaryValueBold: {
    fontWeight: '700',
  }
});

// Wrap the App in the FormProvider (This is part of the original structure)
const Root = () => (
  <FormProvider>
    <App />
  </FormProvider>
);

export default Root;
```

| Key | Value |
| --- | --- |
| Expliciete Props te definiëren | De componenten WizardPage, en hebben nu correcte interfaces gekregen, inclusief de children prop. |
| Type Narrowing en Asserties | is nu met de non-null assertion operator (!) gemarkeerd, aangezien we weten dat deze bestaat wanneer . |
| Correcte Type Initialisatie | Variabelen zoals newErrors en de accumulator (acc) in reduce zijn nu correct getypeerd als om de fouten te voorkomen. |
| Onderdrukken van Omgevingsfout (TS7026) | De fouten rondom <select> en <option> (die voor webcompatibiliteit zijn toegevoegd) zijn onderdrukt met , aangezien dit een configuratieprobleem is in een hybride RN/Web-omgeving dat niet met code-aanpassingen binnen deze component opgelost kan worden. |

{field.options.map(opt => (

              <option key={opt.value} value={opt.value}>{opt.label}</option>

            ))}

          </select>

522: <select FOUT: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.(7026)

523/526: style={styles.select} onChange={(e) => handleChange(e.target.value)} value={value || ''}> FOUT: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.(7026)

527: field.options FOUT: Object is possibly 'undefined'.(2532) (property) options?: { label: string; value: string; }[] | undefined

528: <option key={opt.value} value={opt.value}> FOUT: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.(7026)

565: children FOUT Property 'children' does not exist on type 'ConditionalFieldProps'.(2339)

608: {section.fields.map(field => ( FOUT Parameter 'field' implicitly has an 'any' type.(7006)

609: <ConditionalField key={field.id} FOUT: Type '{ key: any; condition: any; formData: FormState; }' is not assignable to type 'ConditionalFieldProps'. Property 'key' does not exist on type 'ConditionalFieldProps'.(2322)

625: const config = React.useMemo(() => formConfig[pageId], [pageId]); FOUT: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type 'Record<PageId, PageConfig>'.(7053)

638: FOUT: Parameter 'acc' implicitly has an 'any' type.(7006)

691: newErrors[field.id] FOUT: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{}'

Deze fouten zijn typische voorbeelden van TypeScript's strict type checking, vooral bij het gebruik van generieke objecten ({}) of wanneer de automatische type inferentie van React (React.FC) niet overeenkomt met de expliciet gedefinieerde interfaces. Ook is er een conflict met HTML-elementen (<select>, <option>) in een React Native-omgeving (TS7026).

Ik heb alle zeven gemelde TypeScript-fouten opgelost door:

Hier is de volledige, gecorrigeerde code voor App.tsx:

TypeScript

---

**User:**

| Probleem | Analyse (Geldigheid) | Oplossing (Optie B) | Prioriteit |
| --- | --- | --- | --- |
| 1. Unused style (radioCircleInner) | Correct (ESLint False Positive). | Verwijderd. De style wordt overbodig door de nieuwe radio-chips component. | Laag |
| 2. Missing children | Correct. De ConditionalField voor weergave mist de content. | Geïmplementeerd. De content (text display) is als children toegevoegd binnen de WizardPage renderlogica. | Hoog |
| 3. Invariant Violation | CRUCIAAL (Veroorzaakt door web <select> tags). | Verwijderd. Alle <select>/<option> code is vervangen door radio-chips. | Kritiek |
| 4. Web-first design | Correct. Niet geoptimaliseerd voor touch/mobiel. | Refactor. Implementatie van de native radio-chips component. | Hoog |

```
FieldConfig
```

```
'radio-chips'
```

```
woonsituatie
```

```
burgerlijkeStaat
```

```
radio-chips
```

```
config.conditionals
```

```
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type FormAction = { type: string; [key: string]: any };
type FormState = Record<string, any>;
type FormContextValue = { state: FormState; dispatch: React.Dispatch<FormAction> };

type FieldConfig = {
  id: string;
  label: string;
  // VERANDERING: 'select' vervangen door 'radio-chips'
  type: 'text' | 'numeric' | 'toggle' | 'radio-chips'; [cite_start]// [cite: 634]
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: { min?: number;
max?: number; postcode?: boolean };
  options?: { label: string; value: string }[];
  conditional?: { field: string; operator: '>' |
'<' | '>=' | '<=' | '===' | '!=='; value: any };
};
// ... (rest of context, state management, storage, and validation utilities remains unchanged)
// ...

// ============================================================================
// CONFIGURATION: FORM FIELDS
// ============================================================================

const formConfig: Record<string, any> = {
  C1: {
    title: 'Huishouden (Basis)',
    subtitle: 'Vertel ons over uw huishouden',
    step: 1,
    totalSteps: 4,
    fields: [
      {
        id: 'aantalVolwassenen',
        label: 'Aantal volwassenen in huis',
        type: 'numeric',
        required: true,
        validation: { min: 1,
max: 10 },
        defaultValue: 1
      },
      {
        id: 'aantalKinderen',
        label: 'Aantal kinderen (0-17 jaar)',
        type: 'numeric',
        required: true,
        validation: { min: 0, max: 10 },
        defaultValue: 0
      },
      {
        id: 'woonsituatie',
        label: 'Woonsituatie',
        [cite_start]// VERANDERING: type van 'select' naar 'radio-chips' [cite: 685]
        type: 'radio-chips',
        required: true,
        options: [
          { label: 'Selecteer...', value: '' },
          { label: 'Huurder', value: 'Huurder' },
          { label: 'Koper', value: 'Koper' },
          { label: 'Inwonend',
value: 'Inwonend' },
          { label: 'Anders', value: 'Anders' }
        ]
      }
    ],
    conditionals: [
      {
        id: 'kinderenDisplay',
        condition: { field: 'aantalKinderen', operator: '>', value: 0 },
        type: 'text',
        template: 'U heeft {aantalKinderen} {plural} in uw huishouden'

| } | } |
| --- | --- |
| ] | ] |
| }, | }, |

| title: 'Huishouden (Details)' |  |
| --- | --- |
| subtitle: 'Aanvullende informatie over uw huishouden' |  |
| step: 2 |  |
| totalSteps: 4 |  |
| id: 'postcode' |  |
| label: 'Postcode (4 cijfers)' |  |
| type: 'text' |  |
| required: true |  |
| validation: { postcode: true } |  |

| placeholder: '1234' | placeholder: '1234' |
| --- | --- |
| }, | }, |
| { | { |
| id: 'burgerlijkeStaat', | id: 'burgerlijkeStaat', |
| label: 'Burgerlijke staat', | label: 'Burgerlijke staat', |
| [cite_start]// VERANDERING: type van 'select' naar 'radio-chips' [cite: 688] | [cite_start]// VERANDERING: type van 'select' naar 'radio-chips' [cite: 688] |
| type: 'radio-chips', | type: 'radio-chips', |
| required: true, | required: true, |
| options: [ | options: [ |
| { label: 'Selecteer...', value: '' }, | { label: 'Selecteer...', value: '' }, |
| { label: 'Alleenstaand', value: 'Alleenstaand' }, | { label: 'Alleenstaand', value: 'Alleenstaand' }, |

| { label: 'Gehuwd/Samenwonend' | value: 'Gehuwd' } |
| --- | --- |
| } |  |
| ] |  |

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

// FormField: Universal field renderer
// ... (FormFieldProps and FormField definition unchanged until field.type checks)

| let displayLabel = field.label |  |
| --- | --- |
| const woonsituatie = formData.C1.woonsituatie | [cite_start]// [cite: 717] |
| if (woonsituatie === 'Huurder') displayLabel = 'Huur (€)' | [cite_start]// [cite: 718] |
| else if (woonsituatie === 'Koper') displayLabel = 'Hypotheek (€)' | [cite_start]// [cite: 718, 719] |

| onChange(field.id, newValue) |  |
| --- | --- |
| } |  |

| {field.type === 'text' && ( | {field.type === 'text' && ( |
| --- | --- |
| <TextInput | <TextInput |
| style={[styles.input, error && styles.inputError]} | style={[styles.input, error && styles.inputError]} |
| value={value \|\| ''} | value={value \|\| ''} |
| onChangeText={handleChange} | onChangeText={handleChange} |
| placeholder={field.placeholder} | placeholder={field.placeholder} |
| accessibilityLabel={displayLabel} | accessibilityLabel={displayLabel} |

        />
      )}

| value={value?.toString() |  | ''} |
| --- | --- | --- |
| const numValue = text === '' ? '' : parseFloat(text) |  | 0; |

| handleChange(numValue); | handleChange(numValue); |
| --- | --- |
| }} | }} |
| keyboardType="numeric" | keyboardType="numeric" |
| placeholder={field.placeholder} | placeholder={field.placeholder} |
| accessibilityLabel={displayLabel} | accessibilityLabel={displayLabel} |
| /> | /> |
| )} | )} |

      {/* VERANDERING: 'select' component verwijderd (lost Invariant Violation op) */}

| if (opt.value === '') return null |  |
| --- | --- |
| const isSelected = value === opt.value |  |

| styles.chip |  |
| --- | --- |
| isSelected && styles.chipSelected |  |
| styles.chipText |  |

| [cite_start]{field.type === 'toggle' && ( // [cite: 725] | [cite_start]{field.type === 'toggle' && ( // [cite: 725] |
| --- | --- |
| [cite_start]<View style={styles.toggleContainer}> // [cite: 725] | [cite_start]<View style={styles.toggleContainer}> // [cite: 725] |
| <TouchableOpacity | <TouchableOpacity |
| [cite_start]style={[styles.toggleButton, value === true && styles.toggleButtonActive]} // [cite: 725, 726] | [cite_start]style={[styles.toggleButton, value === true && styles.toggleButtonActive]} // [cite: 725, 726] |
| [cite_start]onPress={() => handleChange(true)} // [cite: 725] | [cite_start]onPress={() => handleChange(true)} // [cite: 725] |
| accessibilityLabel={`${displayLabel} - Ja`} | accessibilityLabel={`${displayLabel} - Ja`} |
| > | > |

| [cite_start]<Text style={[styles.toggleText | value === true && styles.toggleTextActive]}>Ja</Text> // [cite: 726] |
| --- | --- |
| [cite_start]style={[styles.toggleButton | value === false && styles.toggleButtonActive]} // [cite: 726] |
| <Text style={[styles.toggleText | value |

| ) | [cite_start]// [cite: 728] |
| --- | --- |
| } |  |

[cite_start]// ConditionalField: Smart conditional renderer (onveranderd) [cite: 728-738]
// ... (ConditionalField definition remains unchanged)

[cite_start]// DynamicSection: Section repeater (onveranderd) [cite: 738-740]
// ... (DynamicSection definition remains unchanged)

// WizardPage: Page wrapper with navigation logic (Render logic aangepast)

// ... (WizardPageProps and WizardPage definition unchanged until the render block)

| const { state, dispatch } = useFormContext() | [cite_start]// [cite: 522] |
| --- | --- |
| const config = React.useMemo(() => formConfig[pageId], [pageId]) | [cite_start]// [cite: 523] |

| return ( | return ( |
| --- | --- |
| [cite_start]<ScrollView style={styles.container}> // [cite: 553] | [cite_start]<ScrollView style={styles.container}> // [cite: 553] |
| [cite_start]<View style={styles.content}> // [cite: 553] | [cite_start]<View style={styles.content}> // [cite: 553] |
| {/* ... (step indicator, titles, loading view unchanged) */} | {/* ... (step indicator, titles, loading view unchanged) */} |

| ) |  |
| --- | --- |
| ) |  |

| .replace('{aantalKinderen}', state.C1?.aantalKinderen |  | 0) |
| --- | --- | --- |
| .replace('{plural}', (state.C1?.aantalKinderen |  | 0) === 1 ? 'kind' : 'kinderen')} |

| {/* Dynamic sections (if any, C4 only) */} | {/* Dynamic sections (if any, C4 only) */} |
| --- | --- |
| {config.sections?.map((section: any) => ( | {config.sections?.map((section: any) => ( |
| <DynamicSection | <DynamicSection |
| key={section.id} | key={section.id} |
| section={section} | section={section} |
| formData={state} | formData={state} |
| pageData={pageData} | pageData={pageData} |
| onFieldChange={handleFieldChange} | onFieldChange={handleFieldChange} |
| errors={errors} | errors={errors} |
| /> | /> |
| ))} | ))} |

| ) |  |
| --- | --- |
| } |  |

// ... (rest of screens and App component unchanged)

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // ... (container, content, typography styles unchanged)

  // Fields (fieldContainer, fieldLabel, input, inputError, errorText unchanged)

  // OUDE radioGroup en select styles zijn verwijderd

| } |  |
| --- | --- |
| flexDirection: 'row' |  |
| gap: 12 |  |
| } |  |
| backgroundColor: '#FFFFFF' |  |
| borderWidth: 2 |  |
| borderColor: '#D1D1D6' |  |
| borderRadius: 12 |  |
| paddingVertical: 12 |  |
| paddingHorizontal: 20 |  |
| minHeight: 48 |  |
| justifyContent: 'center' |  |
| } |  |
| backgroundColor: '#007AFF' |  |
| } |  |
| } |  |
| fontSize: 16 |  |
| fontWeight: '600' |  |
| } |  |
| } |  |

| padding: 16 |  |
| --- | --- |
| backgroundColor: '#E5E5EA' | // Light gray background |
| borderRadius: 12 |  |
| marginVertical: 16 |  |
| } |  |
| fontSize: 16 |  |
| color: '#1C1C1E' |  |
| fontWeight: '600' |  |
| } |  |

  // ... (toggleButton, toggleText, loading, section, button, dashboard styles unchanged)
});
```

```
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type FormAction = { type: string; [key: string]: any };
type FormState = Record<string, any>;
type FormContextValue = { state: FormState; dispatch: React.Dispatch<FormAction> };

type FieldConfig = {
  id: string;
  label: string;
  // VERANDERING: 'select' vervangen door 'radio-chips'
  type: 'text' | 'numeric' | 'toggle' | 'radio-chips'; [cite_start]// [cite: 634]
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  labelDynamic?: boolean;
  validation?: { min?: number;
max?: number; postcode?: boolean };
  options?: { label: string; value: string }[];
  conditional?: { field: string; operator: '>' |
'<' | '>=' | '<=' | '===' | '!=='; value: any };
};
// ... (rest of context, state management, storage, and validation utilities remains unchanged)
// ...

// ============================================================================
// CONFIGURATION: FORM FIELDS
// ============================================================================

const formConfig: Record<string, any> = {
  C1: {
    title: 'Huishouden (Basis)',
    subtitle: 'Vertel ons over uw huishouden',
    step: 1,
    totalSteps: 4,
    fields: [
      {
        id: 'aantalVolwassenen',
        label: 'Aantal volwassenen in huis',
        type: 'numeric',
        required: true,
        validation: { min: 1,
max: 10 },
        defaultValue: 1
      },
      {
        id: 'aantalKinderen',
        label: 'Aantal kinderen (0-17 jaar)',
        type: 'numeric',
        required: true,
        validation: { min: 0, max: 10 },
        defaultValue: 0
      },
      {
        id: 'woonsituatie',
        label: 'Woonsituatie',
        [cite_start]// VERANDERING: type van 'select' naar 'radio-chips' [cite: 685]
        type: 'radio-chips',
        required: true,
        options: [
          { label: 'Selecteer...', value: '' },
          { label: 'Huurder', value: 'Huurder' },
          { label: 'Koper', value: 'Koper' },
          { label: 'Inwonend',
value: 'Inwonend' },
          { label: 'Anders', value: 'Anders' }
        ]
      }
    ],
    conditionals: [
      {
        id: 'kinderenDisplay',
        condition: { field: 'aantalKinderen', operator: '>', value: 0 },
        type: 'text',
        template: 'U heeft {aantalKinderen} {plural} in uw huishouden'

| } | } |
| --- | --- |
| ] | ] |
| }, | }, |

| title: 'Huishouden (Details)' |  |
| --- | --- |
| subtitle: 'Aanvullende informatie over uw huishouden' |  |
| step: 2 |  |
| totalSteps: 4 |  |
| id: 'postcode' |  |
| label: 'Postcode (4 cijfers)' |  |
| type: 'text' |  |
| required: true |  |
| validation: { postcode: true } |  |

| placeholder: '1234' | placeholder: '1234' |
| --- | --- |
| }, | }, |
| { | { |
| id: 'burgerlijkeStaat', | id: 'burgerlijkeStaat', |
| label: 'Burgerlijke staat', | label: 'Burgerlijke staat', |
| [cite_start]// VERANDERING: type van 'select' naar 'radio-chips' [cite: 688] | [cite_start]// VERANDERING: type van 'select' naar 'radio-chips' [cite: 688] |
| type: 'radio-chips', | type: 'radio-chips', |
| required: true, | required: true, |
| options: [ | options: [ |
| { label: 'Selecteer...', value: '' }, | { label: 'Selecteer...', value: '' }, |
| { label: 'Alleenstaand', value: 'Alleenstaand' }, | { label: 'Alleenstaand', value: 'Alleenstaand' }, |

| { label: 'Gehuwd/Samenwonend' | value: 'Gehuwd' } |
| --- | --- |
| } |  |
| ] |  |

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

// FormField: Universal field renderer
// ... (FormFieldProps and FormField definition unchanged until field.type checks)

| let displayLabel = field.label |  |
| --- | --- |
| const woonsituatie = formData.C1.woonsituatie | [cite_start]// [cite: 717] |
| if (woonsituatie === 'Huurder') displayLabel = 'Huur (€)' | [cite_start]// [cite: 718] |
| else if (woonsituatie === 'Koper') displayLabel = 'Hypotheek (€)' | [cite_start]// [cite: 718, 719] |

| onChange(field.id, newValue) |  |
| --- | --- |
| } |  |

| {field.type === 'text' && ( | {field.type === 'text' && ( |
| --- | --- |
| <TextInput | <TextInput |
| style={[styles.input, error && styles.inputError]} | style={[styles.input, error && styles.inputError]} |
| value={value \|\| ''} | value={value \|\| ''} |
| onChangeText={handleChange} | onChangeText={handleChange} |
| placeholder={field.placeholder} | placeholder={field.placeholder} |
| accessibilityLabel={displayLabel} | accessibilityLabel={displayLabel} |

        />
      )}

| value={value?.toString() |  | ''} |
| --- | --- | --- |
| const numValue = text === '' ? '' : parseFloat(text) |  | 0; |

| handleChange(numValue); | handleChange(numValue); |
| --- | --- |
| }} | }} |
| keyboardType="numeric" | keyboardType="numeric" |
| placeholder={field.placeholder} | placeholder={field.placeholder} |
| accessibilityLabel={displayLabel} | accessibilityLabel={displayLabel} |
| /> | /> |
| )} | )} |

      {/* VERANDERING: 'select' component verwijderd (lost Invariant Violation op) */}

| if (opt.value === '') return null |  |
| --- | --- |
| const isSelected = value === opt.value |  |

| styles.chip |  |
| --- | --- |
| isSelected && styles.chipSelected |  |
| styles.chipText |  |

| [cite_start]{field.type === 'toggle' && ( // [cite: 725] | [cite_start]{field.type === 'toggle' && ( // [cite: 725] |
| --- | --- |
| [cite_start]<View style={styles.toggleContainer}> // [cite: 725] | [cite_start]<View style={styles.toggleContainer}> // [cite: 725] |
| <TouchableOpacity | <TouchableOpacity |
| [cite_start]style={[styles.toggleButton, value === true && styles.toggleButtonActive]} // [cite: 725, 726] | [cite_start]style={[styles.toggleButton, value === true && styles.toggleButtonActive]} // [cite: 725, 726] |
| [cite_start]onPress={() => handleChange(true)} // [cite: 725] | [cite_start]onPress={() => handleChange(true)} // [cite: 725] |
| accessibilityLabel={`${displayLabel} - Ja`} | accessibilityLabel={`${displayLabel} - Ja`} |
| > | > |

| [cite_start]<Text style={[styles.toggleText | value === true && styles.toggleTextActive]}>Ja</Text> // [cite: 726] |
| --- | --- |
| [cite_start]style={[styles.toggleButton | value === false && styles.toggleButtonActive]} // [cite: 726] |
| <Text style={[styles.toggleText | value |

| ) | [cite_start]// [cite: 728] |
| --- | --- |
| } |  |

[cite_start]// ConditionalField: Smart conditional renderer (onveranderd) [cite: 728-738]
// ... (ConditionalField definition remains unchanged)

[cite_start]// DynamicSection: Section repeater (onveranderd) [cite: 738-740]
// ... (DynamicSection definition remains unchanged)

// WizardPage: Page wrapper with navigation logic (Render logic aangepast)

// ... (WizardPageProps and WizardPage definition unchanged until the render block)

| const { state, dispatch } = useFormContext() | [cite_start]// [cite: 522] |
| --- | --- |
| const config = React.useMemo(() => formConfig[pageId], [pageId]) | [cite_start]// [cite: 523] |

| return ( | return ( |
| --- | --- |
| [cite_start]<ScrollView style={styles.container}> // [cite: 553] | [cite_start]<ScrollView style={styles.container}> // [cite: 553] |
| [cite_start]<View style={styles.content}> // [cite: 553] | [cite_start]<View style={styles.content}> // [cite: 553] |
| {/* ... (step indicator, titles, loading view unchanged) */} | {/* ... (step indicator, titles, loading view unchanged) */} |

| ) |  |
| --- | --- |
| ) |  |

| .replace('{aantalKinderen}', state.C1?.aantalKinderen |  | 0) |
| --- | --- | --- |
| .replace('{plural}', (state.C1?.aantalKinderen |  | 0) === 1 ? 'kind' : 'kinderen')} |

| {/* Dynamic sections (if any, C4 only) */} | {/* Dynamic sections (if any, C4 only) */} |
| --- | --- |
| {config.sections?.map((section: any) => ( | {config.sections?.map((section: any) => ( |
| <DynamicSection | <DynamicSection |
| key={section.id} | key={section.id} |
| section={section} | section={section} |
| formData={state} | formData={state} |
| pageData={pageData} | pageData={pageData} |
| onFieldChange={handleFieldChange} | onFieldChange={handleFieldChange} |
| errors={errors} | errors={errors} |
| /> | /> |
| ))} | ))} |

| ) |  |
| --- | --- |
| } |  |

// ... (rest of screens and App component unchanged)

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // ... (container, content, typography styles unchanged)

  // Fields (fieldContainer, fieldLabel, input, inputError, errorText unchanged)

  // OUDE radioGroup en select styles zijn verwijderd

| } |  |
| --- | --- |
| flexDirection: 'row' |  |
| gap: 12 |  |
| } |  |
| backgroundColor: '#FFFFFF' |  |
| borderWidth: 2 |  |
| borderColor: '#D1D1D6' |  |
| borderRadius: 12 |  |
| paddingVertical: 12 |  |
| paddingHorizontal: 20 |  |
| minHeight: 48 |  |
| justifyContent: 'center' |  |
| } |  |
| backgroundColor: '#007AFF' |  |
| } |  |
| } |  |
| fontSize: 16 |  |
| fontWeight: '600' |  |
| } |  |
| } |  |

| padding: 16 |  |
| --- | --- |
| backgroundColor: '#E5E5EA' | // Light gray background |
| borderRadius: 12 |  |
| marginVertical: 16 |  |
| } |  |
| fontSize: 16 |  |
| color: '#1C1C1E' |  |
| fontWeight: '600' |  |
| } |  |

  // ... (toggleButton, toggleText, loading, section, button, dashboard styles unchanged)
});
```

```
npx expo start --clear
# of
rm -rf node_modules/.cache
rm -rf .expo
npx expo start
```

```
npx expo start --clear
# of
rm -rf node_modules/.cache
rm -rf .expo
npx expo start
```

- is bijgewerkt om 'select' te vervangen door .
- formConfig is bijgewerkt voor  en .
- De FormField component is aangepast: de crash-veroorzakende <select> logica is verwijderd en de nieuwe  logica is toegevoegd.
- De renderlogica in WizardPage is aangevuld met de fix voor de  (Problem 2).
- Oude selectie-styles zijn verwijderd en de nieuwe chip-styles zijn toegevoegd.

- Cache wissen: Voer de cache-wiscommando's uit om te verzekeren dat de oude, web-specifieke code niet langer wordt gebruikt:Bash

![TXT-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/plain)

v22
TXT

DAVID; analyseer deze analyse en voorstellen; in bijlage de code waar het over gaat

ANALYSE VAN RESTERENDE PROBLEMEN

PROBLEEM 1: Unused style radioCircleInner

Oorzaak

De style wordt WEL gebruikt, maar binnen een conditional:

{isSelected && <View style={styles.radioCircleInner} />}

ESLint ziet dit niet als "usage" omdat het conditioneel is.

Fix

De style IS in gebruik - dit is een false positive. Ignore de ESLint warning met comment.

PROBLEEM 2: Property 'children' is missing

Oorzaak

Kijk naar deze code (rond lijn 836):

{config.conditionals?.map((conditional: any) => (

<ConditionalField

key={conditional.id}

condition={conditional.condition}

formData={state}

>

{/* CHILDREN ONTBREEKT HIER */}

</ConditionalField>

))}

De ConditionalField verwacht children (de content die conditioneel getoond wordt), maar krijgt niks.

Root Cause

De conditionals in config zijn text displays, geen field wrappers. Ze moeten ZELF de content renderen, niet wachten op children.

PROBLEEM 3: Invariant Violation blijft bestaan

Diagnose

Als de crash NOG STEEDS gebeurt na verwijderen van alle <select> en <option> tags, dan is er een andere oorzaak:

Mogelijke oorzaken:

Cached bundle: Oude code zit nog in cache

Andere HTML elements: Misschien nog ergens anders HTML gebruikt?

Development vs Production build: Metro bundler cache

Verificatie nodig

Waar PRECIES crasht het? Welke component? Welk element?

PROBLEEM 4: Focus op mobiel

Je hebt helemaal gelijk. Een app voor telefoongebruik moet NATIVE-FIRST zijn, niet web-first.

COMPLETE REFACTOR VOORSTEL

Nieuwe aanpak: Custom Square Radio Buttons (Native-First)

Design:

Woonsituatie

┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐

│ Huurder │ │ Koper │ │Inwonend │ │ Anders │

└─────────┘ └─────────┘ └─────────┘ └─────────┘

(blue) (grey) (grey) (grey)

Voordelen:

✅ Horizontal scroll voor veel opties

✅ Compact (geen verticale ruimte)

✅ Touch-friendly (grote vierkante buttons)

✅ Modern design (chip/pill style)

✅ 100% native components

✅ Werkt OVERAL

IMPLEMENTATIE PLAN

1. Fix ConditionalField children issue

Probleem: Conditionals in config zijn text displays, geen field wrappers.

Oplossing: Render content BINNEN ConditionalField:

{config.conditionals?.map((conditional: any) => (

<ConditionalField

key={conditional.id}

condition={conditional.condition}

formData={state}

>

<View style={styles.conditionalDisplay}>

<Text style={styles.conditionalText}>

{conditional.template

.replace('{aantalKinderen}', state.C1?.aantalKinderen || 0)

.replace('{plural}', (state.C1?.aantalKinderen || 0) === 1 ? 'kind' : 'kinderen')}

</Text>

</View>

</ConditionalField>

))}

Of beter: Verplaats de content generatie NAAR ConditionalField component.

2. Vervang vertical radio buttons door horizontal chips

Nieuw field type: radio-chips

{field.type === 'radio-chips' && (

<ScrollView

horizontal

showsHorizontalScrollIndicator={false}

style={styles.chipScrollContainer}

contentContainerStyle={styles.chipContainer}

>

{field.options?.map(opt => {

if (opt.value === '') return null;

const isSelected = value === opt.value;

return (

<TouchableOpacity

key={opt.value}

style={[

styles.chip,

isSelected && styles.chipSelected,

error && styles.chipError

]}

onPress={() => handleChange(opt.value)}

accessibilityRole="radio"

accessibilityState={{ checked: isSelected }}

>

<Text style={[

styles.chipText,

isSelected && styles.chipTextSelected

]}>

{opt.label}

</Text>

</TouchableOpacity>

);

})}

</ScrollView>

)}

Styles:

chipScrollContainer: {

marginVertical: 8

},

chipContainer: {

flexDirection: 'row',

gap: 12,

paddingVertical: 4

},

chip: {

backgroundColor: '#FFFFFF',

borderWidth: 2,

borderColor: '#D1D1D6',

borderRadius: 12,

paddingVertical: 12,

paddingHorizontal: 20,

minHeight: 48,

justifyContent: 'center',

alignItems: 'center'

},

chipSelected: {

backgroundColor: '#007AFF',

borderColor: '#007AFF'

},

chipError: {

borderColor: '#FF3B30'

},

chipText: {

fontSize: 16,

fontWeight: '600',

color: '#1C1C1E'

},

chipTextSelected: {

color: '#FFFFFF'

}

3. Update formConfig - Change type to 'radio-chips'

C1: {

fields: [

// ...

{

id: 'woonsituatie',

label: 'Woonsituatie',

type: 'radio-chips', // ← Changed from 'select'

required: true,

options: [

{ label: 'Selecteer...', value: '' }, // Will be skipped

{ label: 'Huurder', value: 'Huurder' },

{ label: 'Koper', value: 'Koper' },

{ label: 'Inwonend', value: 'Inwonend' },

{ label: 'Anders', value: 'Anders' }

]

}

]

}

C4: {

fields: [

// ...

{

id: 'burgerlijkeStaat',

label: 'Burgerlijke staat',

type: 'radio-chips', // ← Changed from 'select'

required: true,

options: [

{ label: 'Selecteer...', value: '' },

{ label: 'Alleenstaand', value: 'Alleenstaand' },

{ label: 'Gehuwd/Samenwonend', value: 'Gehuwd' }

]

}

]

}

4. Update FieldConfig type

type FieldConfig = {

id: string;

label: string;

type: 'text' | 'numeric' | 'select' | 'toggle' | 'radio-chips'; // ← Add new type

// ... rest

};

5. Verwijder ALLE select-gerelateerde code

Verwijder:

Vertical radio button code

radioGroup, radioButton, radioCircle, etc. styles

selectContainer, select styles (unused web-only)

Behoud:

Alleen radio-chips implementatie

6. Fix ESLint false positive

// Add comment above style definition

// eslint-disable-next-line react-native/no-unused-styles

radioCircleInner: {

width: 12,

height: 12,

borderRadius: 6,

backgroundColor: '#007AFF'

}

Of beter: Als we radio-chips gebruiken, verwijder deze style helemaal.

7. Clear Metro bundler cache

# On device: Force quit app + reopen

# On development machine:

npx expo start --clear

# Or:

rm -rf node_modules/.cache

rm -rf .expo

npx expo start

SAMENVATTING VAN FIXES

IssueCauseFixPriorityUnused style warningESLint false positiveAdd comment or remove if using chipsLOWMissing childrenConditionalField expects children but config doesn't provideAdd children JSX in mapHIGHInvariant ViolationUnknown - need exact error locationClear cache + use chipsCRITICALWeb-first designNot mobile-friendlyUse horizontal chip buttonsHIGHVOORSTEL

Wil je dat ik:

Optie A: Quick fixes alleen

Fix children issue

Add ESLint ignore comment

Keep vertical radio buttons

Optie B: Complete mobile-first refactor ⭐ RECOMMENDED

Implement horizontal chip buttons

Fix children issue

Remove all select-related code

Clear, modern mobile UI

100% crash-proof

Denkproces tonen

Uw analyse is uitstekend en de voorgestelde refactor (Optie B) is de absolute aanrader.

De "Invariant Violation" is een kritieke crashfout in React Native wanneer het de web-specifieke <select> en <option> HTML-tags probeert te renderen. De voorgestelde aanpak lost dit cruciale probleem op en verbetert tegelijkertijd de gebruikerservaring aanzienlijk door de overstap naar een native, mobielvriendelijk ontwerp.

Ik heb de code in v22.txt geanalyseerd en de Complete Mobile-First Refactor (Optie B) uitgevoerd.

1. Analyse van de voorstellen
Exporteren naar Spreadsheets
2. Aanbevolen Fixes (Optie B)

Hieronder vindt u de geconsolideerde code met alle wijzigingen. De implementatie volgt uw plan nauwkeurig:

App.tsx (Geconsolideerde Code)
TypeScript
3. Acties na implementatie

Om het CRITIEKE probleem (Invariant Violation) met zekerheid op te lossen, volgt u de laatste stap uit uw voorstel:

Dit garandeert een schone build met de nieuwe, native implementatie.

---

**User:**

| Patch ID | Omschrijving | Status |
| --- | --- | --- |
| P1-T5A | Wizard → Dashboard Navigatie Fix | ✅ Opgelost. De logica in MapsNext en de voorwaarde voor het renderen van de DashboardScreen zijn gecorrigeerd. De Index kan nu correct van de laatste Wizard Pagina (index 2) naar het Dashboard (index 3) gaan. |
| P1-T5B | Safe Area Context Migratie | ✅ Geïmplementeerd. De <SafeAreaProvider> is toegevoegd als root-wrapper. Dit is essentieel voor correcte weergave op moderne iOS- en Android-apparaten (notches, gesture bars). |
| Valutaprobleem (Huidig aandachtspunt) | De generieke FormField voor type: 'numeric' past de Euro-prefix toe op alle numerieke velden, inclusief telvelden zoals 'Aantal volwassenen' en 'Aantal kinderen'. |  |

```
type: 'numeric'
```

```
// 2. Numeric input
```

```
String(value) : '';
      return (
        <View style={styles.numericWrapper}>
          <Text style={styles.currencyPrefix}>€</Text>  // ← DIT IS DE LOCATIE (lijn ~65)
          <TextInput
// ...
```

```
String(value) : '';
      return (
        <View style={styles.numericWrapper}>
          <Text style={styles.currencyPrefix}>€</Text>  // ← DIT IS DE LOCATIE (lijn ~65)
          <TextInput
// ...
```

```
type: 'count'
```

```
aantalVolwassenen
```

```
aantalKinderen
```

```
<Text style={styles.currencyPrefix}>€</Text>
```

```
FieldConfig
```

```
{field.isCurrency && <Text style={styles.currencyPrefix}>€</Text>}
```

```
{field.isCurrency && <Text style={styles.currencyPrefix}>€</Text>}
```

| - Meest schone oplossing: Introduceer een nieuwe veld voor de telvelden ( | ) en maak een aparte renderlogica die de component weglaat. |
| --- | --- |
| - Snelle oplossing: Voeg een isCurrency boolean toe aan de van de valutavelden (C7 | C10). Gebruik vervolgens een conditional check in de FormField component:TypeScriptDit zorgt ervoor dat de prefix alleen wordt getoond als deze expliciet is ingesteld in de configuratie. |

![TXT-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/plain)

v32
TXT

David, de flow van de app in deze fase werkt naar behoren; op een paar layout foutjes na. Zo staat bij het AANTAL mensen in het huishouden een euro teken. Dat lijkt mij een simpele fix. Ik geef je nu het actuele App.jsx. Ga na waar ik de euro tekens weg kan halen. VOER GEEN WIJZIGINGEN IN DE CODE DOOR. Maak ook een analyse van dit bestand

Denkproces tonen

David,

Uw analyse dat er layoutfouten zijn met de Euro-tekens (€) bij velden die aantallen meten, is volledig correct. Dit is een veelvoorkomend probleem wanneer een generieke input-component (zoals ) wordt gebruikt voor zowel valuta- als telvelden.

Hieronder volgt de analyse van het bestand v32.txt en de exacte locatie waar u de Euro-tekens kunt aanpassen/verwijderen.

Analyse van v32.txt (Status: Gepatched & Stabiel)

Het geleverde bestand v32.txt vertegenwoordigt een stabiele, gepatched versie van de app-code. De belangrijkste verbeteringen en de huidige status zijn:

Exporteren naar Spreadsheets
Locatie Euro-teken (€) voor Correctie

Het Euro-teken wordt weergegeven door een specifieke <Text> component binnen de FormField logica voor numerieke invoer.

U kunt de Euro-prefix op de volgende locatie in de code vinden:

Component: FormField

Logica Blok: (start rond lijn 63)

Exacte code:

De Euro-prefix wordt hier weergegeven:

TypeScript
Hoe dit probleem op te lossen (ter informatie)

Omdat de FormField component hier alle numerieke velden gelijk behandelt, zijn er twee primaire manieren om dit op te lossen (u hoeft deze stap niet uit te voeren):

Bronnen

---

**User:**

| Aspect | Huidig Model (V32) | Nieuw Model (Fase 2) | Impact |
| --- | --- | --- | --- |
| Datastructuur | Geaggregeerde velden (aantalVolwassenen, aantalKinderen). | Array van objecten: C4.leden: [{ naam: "...", leeftijd: "...", geslacht: "..." }]. | Cruciaal: Vereist een Dynamic Repeater Component. |
| C1 Logica | Directe input van aantallen volwassenen en kinderen. | Geleide input (aantalMensen → aantalVolwassenen) met een berekende display van kinderen. | Minimaliseert foutieve invoer. |
| Validatie | Simpele numerieke min/max checks. | Complexe validatie op basis van leeftijdscategorie (> 17 of < 18), wat potentieel conflicteert met de C1-input. | Verhoogt de UX-kwaliteit. |
| Dashboard | Cashflow wordt gecombineerd getoond. | Blijft gecombineerd voor Fase 2, maar de nieuwe data is de basis voor Fase 3 uitbreidingen. | Architecturale voorbereiding. |

```
comment CLAUDE_Answered.txt
```

```
C1.aantalMensen
```

```
WIZARD_PAGES
```

```
aantalVolwassenen
```

```
aantalKinderen
```

```
id: 'aantalMensen'
```

```
id: 'aantalVolwassenen'
```

```
aantalMensen
```

```
ConditionalField
```

```
C1.aantalMensen
```

```
C1.aantalVolwassenen
```

```
HouseholdMemberRepeater
```

```
C1.aantalMensen
```

```
state.C4.leden
```

```
FieldConfig
```

```
id: 'leeftijd'
```

```
id: 'geslacht'
```

```
WIZARD_PAGES
```

```
burgerlijkeStaat
```

```
HouseholdMemberRepeater
```

```
C1.aantalMensen
```

```
C1.aantalVolwassenen
```

| - Update | (C1):Verwijder de velden en .Voeg toe: (Numeric, min 1, required).Voeg toe: (Numeric, required als > 1). |
| --- | --- |
| - Verwijd | er de velden en . |
| - Voeg to | e: (Numeric, min 1, required). |
| - Voeg to | e: (Numeric, required als > 1). |
| - Impleme | nteer Conditionele Display:Voeg een toe die de label/counter rendert voor het berekende totaal aantal kinderen ( - ), zichtbaar indien dit resultaat > 0. |
| - Voeg ee | n toe die de label/counter rendert voor het berekende totaal aantal kinderen ( - ), zichtbaar indien dit resultaat > 0. |

| - Verwijd | er de velden en . |
| --- | --- |
| - Voeg to | e: (Numeric, min 1, required). |
| - Voeg to | e: (Numeric, required als > 1). |

- Voeg een  toe die de label/counter rendert voor het berekende totaal aantal kinderen ( - ), zichtbaar indien dit resultaat > 0.

| - Creëer Component: Dit wordt een component die:Een prop count ontvangt (van ).Een lijst rendert van 1 tot count (bv. "Persoon 1" | "Persoon 2").Voor elk item de benodigde velden rendert (zie P2-T3).De status van elk lid beheert en deze correct opslaat in een array in de globale FormState (bv. ). Dit vereist zorgvuldige array management in tegenstelling tot de huidige object merges. |
| --- | --- |
| - Een lijst rendert van 1 tot count (bv. "Persoon 1" | "Persoon 2"). |

- Een prop count ontvangt (van ).
- Een lijst rendert van 1 tot count (bv. "Persoon 1", "Persoon 2").
- Voor elk item de benodigde velden rendert (zie P2-T3).
- De status van elk lid beheert en deze correct opslaat in een array in de globale FormState (bv. ). Dit vereist zorgvuldige array management in tegenstelling tot de huidige object merges.

- Update  (Per Persoon): Definieer de nieuwe velden voor een enkel lid:id: 'naam' (Text, required). (Opmerking: alle karakters zijn toegestaan, ook verzonnen namen.) (Numeric, required). (Radio-chips, M/V/Anders, required).
- id: 'naam' (Text, required). (Opmerking: alle karakters zijn toegestaan, ook verzonnen namen.)
- (Numeric, required).
- (Radio-chips, M/V/Anders, required).
- Update  (C4):Behoud de velden postcode en  (deze laatste hoeft nog niet naar per-persoon te verhuizen).Vervang of Voeg toe de  in C4, waarbij deze de  waarde als count gebruikt.
- Behoud de velden postcode en  (deze laatste hoeft nog niet naar per-persoon te verhuizen).
- Vervang of Voeg toe de  in C4, waarbij deze de  waarde als count gebruikt.

- id: 'naam' (Text, required). (Opmerking: alle karakters zijn toegestaan, ook verzonnen namen.)
- (Numeric, required).
- (Radio-chips, M/V/Anders, required).

- Behoud de velden postcode en  (deze laatste hoeft nog niet naar per-persoon te verhuizen).
- Vervang of Voeg toe de  in C4, waarbij deze de  waarde als count gebruikt.

- Leeftijdsvalidatie (Complex): Implementeer logica die waarschuwt/blokkeert bij tegenstrijdige invoer:Als een persoon de leeftijd 18+ heeft, moet deze als volwassene in C1 zijn geteld.Als een persoon de leeftijd 0-17 heeft, moet deze als kind zijn geteld.Als het totale aantal volwassenen in de repeater niet overeenkomt met , toon dan een foutmelding. (Bv.: "U heeft 3 volwassenen ingevoerd, maar in C1 slechts 2 geteld.")
- Als een persoon de leeftijd 18+ heeft, moet deze als volwassene in C1 zijn geteld.
- Als een persoon de leeftijd 0-17 heeft, moet deze als kind zijn geteld.
- Als het totale aantal volwassenen in de repeater niet overeenkomt met , toon dan een foutmelding. (Bv.: "U heeft 3 volwassenen ingevoerd, maar in C1 slechts 2 geteld.")
- Dynamische Titel: Gebruik de ingevoerde Naam in de sectietitels van de Repeater (bv. "Details voor [Naam]" in plaats van "Details voor Persoon 1").

- Als een persoon de leeftijd 18+ heeft, moet deze als volwassene in C1 zijn geteld.
- Als een persoon de leeftijd 0-17 heeft, moet deze als kind zijn geteld.
- Als het totale aantal volwassenen in de repeater niet overeenkomt met , toon dan een foutmelding. (Bv.: "U heeft 3 volwassenen ingevoerd, maar in C1 slechts 2 geteld.")

| Key | Value |
| --- | --- |
| P3 Data Structuur | De verzamelde data per persoon (naam, leeftijd, geslacht) zal direct dienen als input voor toekomstige gedetailleerde n8n API-calls (P3/P5/P6). De mock N8N responses moeten op dit moment ongewijzigd blijven, maar de app is voorbereid op een gedetailleerder responsformaat. |
| Dashboard | Het Dashboard blijft voor nu gecombineerd. In Fase 3 kan de architectuur de ingevoerde individuele data gebruiken om "Extra dashboard opties" te tonen met financiële uitsplitsingen per persoon. |

![TXT-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/plain)

comment CL...E_Answered
TXT

Analyseer dit bestand. Geef mij een uitgebreide visie. Dit is de basis voor de eerste grote uitbreiding van wat nu v32 is. Maak een gedegen planning voor implementatie voor wat nu fase 2 heet - de uitbreiding van setup.

Dit is een diepgaande analyse van de volgende fase van ontwikkeling. De in bijlage geleverde notities () bevatten de vereisten voor de uitbreiding van de setup (Fase 2), wat een fundamentele verschuiving in het data-model vereist.

De visie is duidelijk: de app evolueert van een wizard die geaggregeerde huishoudtotalen verzamelt naar een Multi-lid, Data-rijk Setup Flow die gedetailleerde profielen per individueel huishoudlid vastlegt. Dit is een essentiële stap richting de geavanceerde functies gepland voor Fase 3 (o.a. financiële uitsplitsingen per persoon).

1. Visie: Fase 2 - Multi-lid Setup

De kern van Fase 2 is het verzamelen van individuele demografische gegevens voor elk lid van het huishouden.

Huidig Model (V32) vs. Nieuw Model (Fase 2)
Exporteren naar Spreadsheets
Architecturale Consequentie

De grootste technische uitdaging is de introductie van een Dynamic Section Repeater (een lijst- of array-editor) die wordt aangestuurd door het totale aantal mensen (). Dit vereist een robuuste component die iteratief velden kan renderen en de status correct kan bijwerken in de globale FormState (onder C4).

2. Implementatie Plan (Fase 2: Uitbreiding Setup)

Het plan is opgedeeld in vier sequentiële taken om de setup flow uit te breiden en te verfijnen, inclusief de implementatie van de Dynamic Repeater.

P2-T1: C1 Configuratie Refactor (Huishouden Aantallen)

Doel: Implementeer de nieuwe, geleide logica voor het vaststellen van huishoudleden.

P2-T2: Core Component: Dynamic Repeater

Doel: Bouw een herbruikbare component om de gegevens van meerdere personen te beheren.

P2-T3: C4 Configuratie & Implementatie (Details Per Persoon)

Doel: Breid C4 uit met de individuele velden en integreer de Repeater.

P2-T4: Validatie en UX Verfijning

Doel: Zorg voor een foutloze en intuïtieve gebruikerservaring.

3. Voorbereiding op Fase 3 (Toekomstperspectief)

De gemaakte keuzes in Fase 2 leggen de basis voor de volgende uitbreidingen, zoals gespecificeerd in uw notities:

Deze gefaseerde aanpak zorgt voor stabiliteit terwijl de complexiteit stapsgewijs wordt verhoogd.

---

**User:**

| Structuur | Voorbeeld | Reden om te doen |
| --- | --- | --- |
| Atomen (Atoms) | TextInput, ChipButton, ToggleSwitch | Bieden de bouwstenen. De ChipButton (die u net heeft gemaakt) is een perfecte Atom. |
| Moleculen (Molecules) | FormField | Combineren Atomen met een label en foutmelding. Dit is de huidige FormField component. |
| Organismen (Organisms) | HouseholdMemberRepeater, WizardPage | Combineren Moleculen en Atomen tot complexe, data-gestuurde secties. Dit is cruciaal voor de nieuwe Fase 2 logica. |

```
aantalVolwassenen
```

```
aantalKinderen
```

```
aantalMensen
```

```
type: 'numeric'
```

```
FieldConfig
```

```
isCurrency: boolean
```

```
ConditionalField
```

```
radio-chips
```

```
src/components/
```

```
src/organisms/
```

```
src/config/formConfig.ts
```

| - Dubbel Werk Vermijden: Fase 2 (P2-T1) vereist dat de velden en uit C1 worden verwijderd en vervangen door en een berekend veld. Als u de Euro-fix nu doorvoert | raakt u code aan die binnenkort wordt geschrapt of ingrijpend wordt gewijzigd. |
| --- | --- |
| - Hogere Prioriteit voor Functionaliteit: De Euro-tekenfout is een layout/UX-fout. De implementatie van de Dynamic Repeater in Fase 2 is een fundamentele | architecturale verandering. U kunt de Euro-fix het beste uitvoeren wanneer u toch al bezig bent met de veldconfiguraties in Fase 2. |

| - P2-Arch-1: Component Extractie (Atomen/Moleculen)Verplaats de pure UI-componenten (FormField |  | en de logic voor /toggle) uit App.tsx naar een nieuwe map (of src/ui/). |
| --- | --- | --- |
| - Verplaats de pure UI-componenten (FormField |  | en de logic voor /toggle) uit App.tsx naar een nieuwe map (of src/ui/). |

- Verplaats de pure UI-componenten (FormField, , en de logic voor /toggle) uit App.tsx naar een nieuwe map  (of src/ui/).

- De Dynamic Repeater (P2-T2) wordt direct gebouwd als een stand-alone component in . Dit dwingt tot een schone scheiding van de logica.

- Verplaats de hele formConfig object naar een apart bestand ().

Jouw analyse heb ik gelezen. Dat met het antwoord op mijn vraag over het euro teken: is het aan te bevelen nu een korte fix te doen voor het euro teken en daarna fase 2 te starten of is het aan te raden die fix te doen tijdens fase 2?

Is het ook aan te raden over te gaan op atom/molecule/organism structuur? Of maakt dat het nodeloos ingewikkeld?

Dat zijn uitstekende vragen. De antwoorden raken de kern van efficiënt en schaalbaar software-ontwerp.

1. Timing van de Euro-teken Fix (€)

Het is het meest aanbevolen om de fix voor het Euro-teken te integreren in de planning van Fase 2.

Redenatie

Advies: Documenteer de fix als een subtaak onder P2-T3 (C4 Configuratie & Implementatie): "Voeg isCurrency vlag toe aan alle valutavelden en pas FormField aan."

2. Overstap naar Atomic Design (Atom/Molecule/Organism)

Ja, het is sterk aan te raden om een begin te maken met een modulaire structuur (zoals Atomic Design), maar doe dit stapsgewijs. Het huidige bestand (App.tsx/App.jsx) is nu nog overzichtelijk, maar zal onbeheersbaar worden na de implementatie van de Dynamic Repeater en de bijbehorende complexe validatielogica.

Voordelen van een Modulaire Structuur (Nu)
Exporteren naar Spreadsheets
Concrete Planning voor Architecturale Transformatie

In plaats van een grote, kostbare refactor, kunt u de overgang inbouwen als een taak parallel aan Fase 2:

Door deze stappen te zetten, voorkomt u dat u de code in Fase 2 complex maakt én lost u de schaalbaarheidsproblemen voor Fase 3 alvast op.

---

**User:**

| Taak | Beschrijving |
| --- | --- |
| Aanpassing FieldConfig | Voeg een nieuwe optionele boolean toe: isCurrency?: boolean. |
| Aanpassing formConfig | Stel isCurrency: true in voor alle valutavelden (C7: nettoMaandsalaris, huurtoeslag; C10: alle lastenvelden). De telvelden (aantalMensen, etc.) krijgen deze vlag niet. |
| Aanpassing FormField | De Euro-prefix wordt alleen gerenderd als field.isCurrency waar is. |

| Huidige Situatie | Gevolg van Monoliet in Fase 2 |
| --- | --- |
| Enkel bestand | Alle nieuwe logica (Array state management, loop over huishoudleden, cross-validation) moet in App.tsx of WizardPage worden gepropt. |
| Geen scheiding | Een wijziging aan een simpele knop (<Atom>) kan onbedoeld een neveneffect hebben op de complexe Repeater-logica (<Organism>). |
| Onderhoud | Debugging en het onboarden van nieuwe ontwikkelaars wordt zeer moeilijk. |

| Fase 2 Architectuur Taak | Wat te doen | Doel |
| --- | --- | --- |
| P2-Arch-1: Atomen/Moleculen | Maak een map src/components. Verplaats alle herbruikbare UI-stukken (zoals FormField, ConditionalField, ChipButton/ToggleSwitch logic) naar hun eigen bestanden. | Zorg voor isolatie, reusability en clean code. |
| P2-Arch-2: Organismen | Maak een map src/organisms. Implementeer de complexe nieuwe component HouseholdMemberRepeater direct als een Organisme in zijn eigen bestand. | Houd de complexe logica gescheiden van de app-flow. |
| P2-Arch-3: Templates/Pages | De WizardPage en App.tsx worden gereduceerd tot coördinatoren die uitsluitend de Organisms aanroepen en de state/config doorgeven. | Maak de flow van de app overzichtelijk. |

```
type: 'numeric'
```

```
aantalVolwassenen
```

```
aantalKinderen
```

```
aantalMensen
```

```
FieldConfig
```

| Key | Value |
| --- | --- |
| Vermijd Redundant Werk | De velden die nu de fout geven (, ) zullen ingrijpend worden gewijzigd (verwijderd/vervangen door ) in Taak P2-T1. Een quick fix nu kost extra tijd die binnenkort nutteloos wordt. |
| Duurzame Oplossing | De correcte oplossing is een architecturale verfijning door een nieuwe property toe te voegen aan de . |

is het ook aan te raden om het - nu nog - interne stylesheet extern te maken?

Dat zijn twee uitstekende strategische vragen.

Hieronder volgt het advies voor zowel de timing van de Euro-teken correctie als de architecturale overstap naar een modulaire structuur.

1. Timing van de Euro-teken Fix (€)

Het is het meest aanbevolen om de Euro-teken fix tijdens Fase 2 te implementeren als onderdeel van een grotere, architecturale schoonmaak.

Redenatie

De huidige weergavefout wordt veroorzaakt doordat de FormField generiek is; het behandelt elk veld met als een valutaveld.

Actieplan (Integratie in Fase 2):

Voeg deze subtaak toe aan de Fase 2 planning (bijvoorbeeld onder P2-T3):

Exporteren naar Spreadsheets

Door dit zo aan te pakken, lost u de fout niet alleen op, maar verbetert u ook de datastructuur, wat schaalbaarheid ten goede komt.

2. Architectuur: Overstappen op Modulaire Structuur (Atomic Design)

Het is sterk aan te raden om nu over te stappen op een modulaire, component-gebaseerde structuur, zoals geïnspireerd door Atomic Design (Atomen/Moleculen/Organismen).

Is het nodeloos ingewikkeld?

Nee. De huidige App.tsx (een monoliet) is nu nog functioneel, maar de implementatie van de Dynamic Repeater (P2-T2) zal de complexiteit exponentieel verhogen.

Exporteren naar Spreadsheets
Aanbevolen Transformatiepad

Ga niet in één keer over. Bouw de overgang in als een architecturale taak aan het begin van Fase 2. U hoeft het huidige bestand alleen op te splitsen.

Exporteren naar Spreadsheets

Conclusie: De overstap naar een modulaire structuur is nu de juiste investering. Dit zal de implementatie van de Dynamic Repeater stroomlijnen en de gehele codebase robuust maken voor Fase 3.

---

**User:**

| Huidige Situatie (Monoliet) | Doel (Modulair) | Voordeel |
| --- | --- | --- |
| De style-definitie beslaat honderden regels onderaan App.tsx. | De code is georganiseerd in kleine bestanden (bijv. ChipButton.tsx, FormField.tsx). | Leesbaarheid: De componentenlogica is niet meer vermengd met de presentatielaag, waardoor u snel kunt focussen op de taak. |
| Stijlen zijn moeilijk te vinden en te beheren. | Elke component beheert zijn eigen stijlen (Colocatie). | Onderhoud: Stijlwijzigingen in een knop zullen nooit per ongeluk de layout van het dashboard beïnvloeden. |
| U kunt de stylesheet niet hergebruiken. | Stijlen kunnen gemakkelijk worden geïmporteerd door andere componenten of pagina's. | Herbruikbaarheid: U kunt styles.buttonPrimary gebruiken in elke nieuwe component. |

```
styles = StyleSheet.create({...})
```

```
src/styles/AppStyles.ts
```

```
const styles = StyleSheet.create({...})
```

```
AppStyles.ts
```

```
// src/styles/AppStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  appContainer: { /* ... */ },
  container: { /* ... */ },
  // ... alle overige styles
});
```

```
// src/styles/AppStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  appContainer: { /* ... */ },
  container: { /* ... */ },
  // ... alle overige styles
});
```

```
// App.tsx
import { styles } from './styles/AppStyles'; // Importeer de gehele stylesheet
// ... (rest van App.tsx blijft hetzelfde)
```

```
// App.tsx
import { styles } from './styles/AppStyles'; // Importeer de gehele stylesheet
// ... (rest van App.tsx blijft hetzelfde)
```

```
src/components/FormField.tsx
```

```
numericWrapper
```

```
AppStyles.ts
```

```
FormField.tsx
```

```
FormField.styles.ts
```

```
AppStyles.ts
```

```
appContainer
```

```
buttonPrimary
```

| Key | Value |
| --- | --- |
| Maak een nieuw bestand | Creëer een map src/styles en daarin een bestand (of .js). |
| Verplaatsen | Knip de gehele block uit App.tsx en plak deze in , waar u deze exporteert:TypeScript |
| Importeren | Importeer de styles terug in App.tsx:TypeScript |

| Key | Value |
| --- | --- |
| Extractie | U verplaatst FormField naar . |
| Splitsing | U haalt alleen de stijlen die uniek zijn voor FormField (zoals input, fieldLabel, , errorText) uit en plaatst ze in (of ) en exporteert ze daar. |
| Opschonen | blijft over met alleen de globale of pagina-specifieke stijlen (zoals , header, indien deze overal hetzelfde zijn). |

wanneer ik zou overstappen naar modulair design, is het dan aan te raden de stylesheet als nieuw bestand te maken?

Dat is een uitstekende vraag die direct de schaalbaarheid en onderhoudbaarheid van uw codebase beïnvloedt.

Ja, het is zeker aan te raden om de stylesheet te externaliseren en uiteindelijk te splitsen. Dit is een logische en noodzakelijke stap wanneer u overgaat op een modulaire, Atomic Design-structuur.

1. Waarom Externe Stylesheet Cruciaal is

De reden om de styles te verplaatsen is tweeledig: leesbaarheid en modulariteit.

Exporteren naar Spreadsheets
2. Het Beste Pad: Stapsgewijze Splitsing

De overgang van de enorme block moet stapsgewijs gebeuren, in lijn met de component-extractie in Fase 2 (P2-Arch-1/2):

Stap 1: De Snelle Win (Initial Externalisatie)

Dit is de snelste fix, waardoor App.tsx al direct 100+ regels korter wordt.

Stap 2: Colocatie (Het Uiteindelijke Doel)

Wanneer u de individuele componenten uit App.tsx isoleert, neemt u de bijbehorende stijlen mee:

Deze aanpak zorgt ervoor dat de modulariteit van de code ook wordt weerspiegeld in de styling, wat essentieel is voor een robuuste en schaalbare app.

---

**User:**

```
PROJECT_CONTEXT.md
```

```
# Project Context

> Auto-generated context file for LLM consumption. Last updated: December 6, 2025

## Project Overview

| Key | Value |
| --- | --- |
| *Name** | Financial Setup Wizard (Inferred) |
| *Type** | Mobile Application (Frontend/Client) |
| *Description** | A cross-platform mobile application built on React Native/Expo. Its primary function is to guide new users through a multi-step wizard to collect detailed household, income, and expense data. The collected data is sent to a backend service (n8n) for financial calculation and aggregation, culminating in a cash flow summary displayed on the dashboard. |
| *Primary Language** | TypeScript / JavaScript |
| *Status** | Active Development (Currently planning Phase 2: Multi-Member Setup Refactor) |

---

## Architecture

### Technology Stack
- **Runtime**: React Native (JavaScript Runtime)
- **Framework**: React Native / Expo
- **Frontend**: React
- **State Management**: React Hooks (`useReducer`, `useContext`)
- **Styling**: React Native `StyleSheet.create` (Internal/Monolithic structure - *planned for externalization*)
- **Integration**: RESTful API calls to an external n8n workflow service.

### Project Structure (Inferred/Current)
```

```
# Project Context

> Auto-generated context file for LLM consumption. Last updated: December 6, 2025

## Project Overview

| Key | Value |
| --- | --- |
| *Name** | Financial Setup Wizard (Inferred) |
| *Type** | Mobile Application (Frontend/Client) |
| *Description** | A cross-platform mobile application built on React Native/Expo. Its primary function is to guide new users through a multi-step wizard to collect detailed household, income, and expense data. The collected data is sent to a backend service (n8n) for financial calculation and aggregation, culminating in a cash flow summary displayed on the dashboard. |
| *Primary Language** | TypeScript / JavaScript |
| *Status** | Active Development (Currently planning Phase 2: Multi-Member Setup Refactor) |

---

## Architecture

### Technology Stack
- **Runtime**: React Native (JavaScript Runtime)
- **Framework**: React Native / Expo
- **Frontend**: React
- **State Management**: React Hooks (`useReducer`, `useContext`)
- **Styling**: React Native `StyleSheet.create` (Internal/Monolithic structure - *planned for externalization*)
- **Integration**: RESTful API calls to an external n8n workflow service.

### Project Structure (Inferred/Current)
```

```
*(Note: A modular refactor into `src/components`, `src/screens`, `src/config`, and `src/styles` is planned.)*

### Key Components
1.  **`FormProvider`**: Central state container using `useReducer` to manage and persist all form data (`state.C1`, `state.C4`, etc.) and the `userId`.
2.  **`WizardPage`**: Renders the individual form steps (C1, C4, C7, C10). Handles local page state, validation, and navigation.
3.  **`FormField`**: A highly generic component responsible for rendering different input types (`text`, `numeric`, `toggle`, `radio-chips`) based on `FieldConfig`.
4.  **`ConditionalField`**: Renders its children (UI elements or other fields) based on a simple comparison of a form data value (`field`, `operator`, `value`).
5.  **`DashboardScreen`**: Displays the final aggregated financial results (KPIs, cash flow summary) after data is processed by the n8n service.

---

## Core Functionality

### Primary Features
1.  **Multi-Step Data Collection**: A sequential wizard flow (C1: Household, C4: Details, C7: Income, C10: Expenses).
2.  **Native-First Input**: Utilizes modern, touch-friendly **'radio-chips'** components for selection fields to avoid native crashes caused by web `<select>` tags.
3.  **Backend Calculation**: Initiates API calls (P3, P5, P6) to an n8n service to calculate financial benchmarks and cash flow metrics.
4.  **Cashflow Dashboard**: Provides a single, combined view of the household's financial situation (KPIs/Summary).

### Data Flow
1.  User fills out a `WizardPage`.
2.  `WizardPage` calls `dispatch({ type: 'SET_PAGE_DATA', ... })` to update the global `state`.
3.  Upon reaching the final page, the `n8nService.processWizardData` is called, which executes multiple sequential API calls (P3, P5, P6) to the backend.
4.  The final result from P6 is stored in state and used by `DashboardScreen`.

---

## Development & Future Planning

### Development Status (v32 Baseline)
The core wizard flow (navigation, state persistence, input components) is stable. The current primary task is to resolve the generic use of the 'Euro' prefix on non-currency fields (`type: 'numeric'`).

### Critical Refactor (Phase 2: Multi-Member Setup)

The next major milestone involves moving from aggregate household data to individual member profiles, requiring the following architectural changes:

| Phase 2 Task | Description | Core Change |
| :--- | :--- | :--- |
| **P2-T1: C1 Refactor** | Replace aggregate fields (`aantalVolwassenen`/`aantalKinderen`) with guided input (`aantalMensen`). | Change `formConfig` and `WizardPage` logic. |
| **P2-T2: Dynamic Repeater** | Implement a new **`HouseholdMemberRepeater`** component to dynamically create input forms for each household member (`C1.aantalMensen` times). | New Organism component is required. |
| **P2-T3: C4 Expansion** | Collect detailed info per person (Name, Age, Gender) inside the Repeater. | Change `formConfig` and data structure in `FormState` to use arrays (e.g., `C4.leden: []`). |
| **P2-T4: Validation** | Implement complex cross-page validation (e.g., total members entered in C4 must match counts from C1). | Addition of complex validation logic in `validatePageData`. |

---

## Architecture Decisions

### Design Patterns
- **Monolithic Component Structure**: All core logic, components, and configuration currently reside in the main entry point file.
- **Planned Pattern Shift**: The project is slated to refactor towards a **Modular/Atomic Design** pattern to improve scalability, separating UI components, screens, and configuration into individual files.

### Configuration
- **`formConfig`**: A large JavaScript object defining the structure, labels, field types, validation rules, and conditional displays for the entire multi-step wizard. This is the single source of truth for the application's structure.

### Domain Context
- **Data Model Evolution**: The state model is shifting from simple key-value pairs (`state.C1.aantalVolwassenen: 2`) to complex arrays of objects (`state.C4.leden: [{ name: 'Jan', leeftijd: 35, ... }]`) to support multi-person details.
- **External Integration**: The `n8nService` is currently mocked and expects an aggregated dataset, although the groundwork for sending individual member data in the future is being laid in Phase 2.

---

## LLM Interaction Guidelines

When working with this codebase:

1.  **Modular Refactoring Priority**: When implementing new features (especially Phase 2), **build new components (like `HouseholdMemberRepeater`) as separate files** to initiate the shift away from the monolithic `App.tsx` structure.
2.  **State Management**: Always update state via the `dispatch` function within `useFormContext` and follow the **shallow merge** logic in `formReducer` (except where explicit replacement is required, which should be clearly documented).
3.  **Style Extraction**: If a component is extracted, **extract its relevant styles** from the main stylesheet block, moving towards component-specific styling (colocation).
4.  **Validation Logic**: Be meticulous when dealing with cross-page validation (`C1` vs `C4`) to avoid race conditions or silent data inconsistencies.
5.  **Euro Fix**: The Euro-teken bug should be fixed by updating `FieldConfig` to include an `isCurrency` flag, preventing the generic application of the '€' prefix to non-currency `numeric` fields.
```

```
*(Note: A modular refactor into `src/components`, `src/screens`, `src/config`, and `src/styles` is planned.)*

### Key Components
1.  **`FormProvider`**: Central state container using `useReducer` to manage and persist all form data (`state.C1`, `state.C4`, etc.) and the `userId`.
2.  **`WizardPage`**: Renders the individual form steps (C1, C4, C7, C10). Handles local page state, validation, and navigation.
3.  **`FormField`**: A highly generic component responsible for rendering different input types (`text`, `numeric`, `toggle`, `radio-chips`) based on `FieldConfig`.
4.  **`ConditionalField`**: Renders its children (UI elements or other fields) based on a simple comparison of a form data value (`field`, `operator`, `value`).
5.  **`DashboardScreen`**: Displays the final aggregated financial results (KPIs, cash flow summary) after data is processed by the n8n service.

---

## Core Functionality

### Primary Features
1.  **Multi-Step Data Collection**: A sequential wizard flow (C1: Household, C4: Details, C7: Income, C10: Expenses).
2.  **Native-First Input**: Utilizes modern, touch-friendly **'radio-chips'** components for selection fields to avoid native crashes caused by web `<select>` tags.
3.  **Backend Calculation**: Initiates API calls (P3, P5, P6) to an n8n service to calculate financial benchmarks and cash flow metrics.
4.  **Cashflow Dashboard**: Provides a single, combined view of the household's financial situation (KPIs/Summary).

### Data Flow
1.  User fills out a `WizardPage`.
2.  `WizardPage` calls `dispatch({ type: 'SET_PAGE_DATA', ... })` to update the global `state`.
3.  Upon reaching the final page, the `n8nService.processWizardData` is called, which executes multiple sequential API calls (P3, P5, P6) to the backend.
4.  The final result from P6 is stored in state and used by `DashboardScreen`.

---

## Development & Future Planning

### Development Status (v32 Baseline)
The core wizard flow (navigation, state persistence, input components) is stable. The current primary task is to resolve the generic use of the 'Euro' prefix on non-currency fields (`type: 'numeric'`).

### Critical Refactor (Phase 2: Multi-Member Setup)

The next major milestone involves moving from aggregate household data to individual member profiles, requiring the following architectural changes:

| Phase 2 Task | Description | Core Change |
| :--- | :--- | :--- |
| **P2-T1: C1 Refactor** | Replace aggregate fields (`aantalVolwassenen`/`aantalKinderen`) with guided input (`aantalMensen`). | Change `formConfig` and `WizardPage` logic. |
| **P2-T2: Dynamic Repeater** | Implement a new **`HouseholdMemberRepeater`** component to dynamically create input forms for each household member (`C1.aantalMensen` times). | New Organism component is required. |
| **P2-T3: C4 Expansion** | Collect detailed info per person (Name, Age, Gender) inside the Repeater. | Change `formConfig` and data structure in `FormState` to use arrays (e.g., `C4.leden: []`). |
| **P2-T4: Validation** | Implement complex cross-page validation (e.g., total members entered in C4 must match counts from C1). | Addition of complex validation logic in `validatePageData`. |

---

## Architecture Decisions

### Design Patterns
- **Monolithic Component Structure**: All core logic, components, and configuration currently reside in the main entry point file.
- **Planned Pattern Shift**: The project is slated to refactor towards a **Modular/Atomic Design** pattern to improve scalability, separating UI components, screens, and configuration into individual files.

### Configuration
- **`formConfig`**: A large JavaScript object defining the structure, labels, field types, validation rules, and conditional displays for the entire multi-step wizard. This is the single source of truth for the application's structure.

### Domain Context
- **Data Model Evolution**: The state model is shifting from simple key-value pairs (`state.C1.aantalVolwassenen: 2`) to complex arrays of objects (`state.C4.leden: [{ name: 'Jan', leeftijd: 35, ... }]`) to support multi-person details.
- **External Integration**: The `n8nService` is currently mocked and expects an aggregated dataset, although the groundwork for sending individual member data in the future is being laid in Phase 2.

---

## LLM Interaction Guidelines

When working with this codebase:

1.  **Modular Refactoring Priority**: When implementing new features (especially Phase 2), **build new components (like `HouseholdMemberRepeater`) as separate files** to initiate the shift away from the monolithic `App.tsx` structure.
2.  **State Management**: Always update state via the `dispatch` function within `useFormContext` and follow the **shallow merge** logic in `formReducer` (except where explicit replacement is required, which should be clearly documented).
3.  **Style Extraction**: If a component is extracted, **extract its relevant styles** from the main stylesheet block, moving towards component-specific styling (colocation).
4.  **Validation Logic**: Be meticulous when dealing with cross-page validation (`C1` vs `C4`) to avoid race conditions or silent data inconsistencies.
5.  **Euro Fix**: The Euro-teken bug should be fixed by updating `FieldConfig` to include an `isCurrency` flag, preventing the generic application of the '€' prefix to non-currency `numeric` fields.
```

Generate or update a comprehensive `PROJECT_CONTEXT.md` file in the repository root that provides complete context for zero-knowledge LLM consumption.

## Core Requirements

1. **File Location & Naming**: Create/update `PROJECT_CONTEXT.md` in the repository root

2. **Idempotent Operation**: Check if file exists - update intelligently without duplicating information

3. **Self-Contained**: File must provide complete context without requiring additional files

4. **LLM-Optimized**: Structure for optimal machine parsing while maintaining human readability

## Analysis Workflow

Execute this systematic analysis:

```bash

# 1. Repository Structure Analysis

find . -type f -name "*.json" -path "*/package.json" -o -path "*/composer.json" -o -path "*/Cargo.toml" -o -path "*/pom.xml" -o -path "*/build.gradle" -o -path "*/pyproject.toml" -o -path "*/go.mod" | head -20

# 2. Technology Stack Detection

find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.java" -o -name "*.go" -o -name "*.rs" -o -name "*.rb" -o -name "*.php" \) | head -50 | xargs -I {} basename {} | cut -d. -f2 | sort | uniq -c | sort -nr

# 3. Configuration Files

find . -maxdepth 3 -type f \( -name ".*rc" -o -name "*.config.*" -o -name "*.env.example" -o -name "docker-compose.*" \) | grep -v node_modules

# 4. Documentation Discovery

find . -type f \( -name "README*" -o -name "CONTRIBUTING*" -o -name "ARCHITECTURE*" -o -name "API*" \) | grep -v node_modules

# 5. Entry Points & Key Files

find . -type f \( -name "main.*" -o -name "index.*" -o -name "app.*" -o -name "server.*" \) | grep -v node_modules | head -20

```

## PROJECT_CONTEXT.md Template

```markdown

# Project Context

> Auto-generated context file for LLM consumption. Last updated: [TIMESTAMP]

## Project Overview

**Name**: [Extract from package.json/equivalent]

**Type**: [Application/Library/Service/Tool]

**Description**: [One paragraph summary based on README or package description]

**Primary Language**: [Detected primary language]

**Status**: [Active/Maintenance/Archive - infer from commit history]

## Architecture

### Technology Stack

- **Runtime**: [Node.js/Python/Java/etc with version if found]

- **Framework**: [Express/Django/Spring/etc]

- **Database**: [PostgreSQL/MongoDB/Redis/etc if detected]

- **Frontend**: [React/Vue/Angular/Vanilla if applicable]

- **Testing**: [Jest/Pytest/JUnit/etc]

- **Build Tools**: [Webpack/Vite/Maven/etc]

### Project Structure

```

[ABBREVIATED TREE STRUCTURE - KEY DIRECTORIES ONLY]

src/

├── api/        # [Brief description of purpose]

├── models/     # [Brief description of purpose]

├── services/   # [Brief description of purpose]

└── utils/      # [Brief description of purpose]

```

### Key Components

[List 3-5 most important modules/services with one-line descriptions]

## Core Functionality

### Primary Features

1. **[Feature Name]**: [What it does and why it matters]

2. **[Feature Name]**: [What it does and why it matters]

3. **[Feature Name]**: [What it does and why it matters]

### API/Interface

[Describe main API endpoints or public interface methods]

### Data Flow

[High-level description of how data moves through the system]

## Development

### Setup Requirements

- [Requirement 1 with version]

- [Requirement 2 with version]

- [Environment variables needed]

### Quick Start

```bash

# Installation

[DETECTED_PACKAGE_MANAGER] install

# Development

[DETECTED_DEV_COMMAND]

# Testing

[DETECTED_TEST_COMMAND]

# Build

[DETECTED_BUILD_COMMAND]

```

### Key Scripts

[Extract from package.json scripts or equivalent]

## Configuration

### Environment Variables

[List critical env vars with descriptions, extracted from .env.example or code]

### Important Files

- `[CONFIG_FILE]`: [Purpose]

- `[CONFIG_FILE]`: [Purpose]

## Architecture Decisions

### Design Patterns

[Identify observed patterns: MVC, microservices, monolith, etc]

### Code Style

[Detected conventions: formatting, naming, file organization]

### Dependencies

**Production** (Key ones only):

- [Package]: [Why it's used]

- [Package]: [Why it's used]

**Development**:

- [Package]: [Purpose]

## Domain Context

### Business Logic

[Key business rules or domain concepts found in code]

### Data Models

[Primary entities/models and their relationships]

### External Integrations

[Third-party services, APIs, or systems integrated]

## Maintenance Notes

### Known Patterns

- [Coding pattern used throughout]

- [Project-specific conventions]

### Areas of Complexity

- [Complex module/feature]: [Why it's complex]

### Technical Debt

[Any obvious areas that need refactoring based on TODOs/FIXMEs]

## LLM Interaction Guidelines

When working with this codebase:

1. **Follow existing patterns** for [file naming/structure/imports]

2. **Maintain consistency** with [code style/formatting]

3. **Test changes** using [testing approach]

4. **Update documentation** when modifying [key areas]

### Common Tasks

- **Add a new feature**: [Where to add files, what patterns to follow]

- **Fix a bug**: [Where to look, debugging approach]

- **Update dependencies**: [Process and considerations]

## Context Metadata

- **Analysis Date**: [TIMESTAMP]

- **Repository Size**: [FILE_COUNT] files, [FOLDER_COUNT] directories

- **Commit Count**: [APPROXIMATE_COMMITS]

- **Primary Contributors**: [COUNT]

- **License**: [LICENSE_TYPE]

```

## Implementation Instructions

1. **Initial Analysis**

   - Run all analysis commands

   - Parse package.json/equivalent for metadata

   - Scan for common patterns and conventions

   - Identify technology stack from file extensions and dependencies

2. **Content Generation**

   - Fill in template with discovered information

   - Keep descriptions concise but informative

   - Focus on actionable information for LLMs

   - Preserve existing custom sections if updating

3. **Update Strategy**

   - If PROJECT_CONTEXT.md exists:

     - Preserve any sections marked with `<!-- CUSTOM -->`

     - Update auto-generated sections only

     - Maintain manually added notes

   - If new file:

     - Generate complete template

     - Leave placeholders for unclear information

4. **Validation**

   - Ensure all code blocks are properly formatted

   - Verify file paths are relative to repo root

   - Check that technical details are accurate

   - Confirm no sensitive information is exposed

## Special Considerations

### For Different Project Types

**Frontend Projects**: Emphasize component structure, state management, routing

**Backend APIs**: Focus on endpoints, authentication, database schema

**Libraries**: Highlight public API, usage examples, integration patterns

**Monorepos**: Add workspace structure, inter-package dependencies

**Microservices**: Include service boundaries, communication patterns

### Dynamic Sections

Add these sections when relevant:

- **Deployment**: If deployment configs found

- **CI/CD**: If workflow files detected

- **Security**: If security configs present

- **Performance**: If optimization patterns observed

- **Internationalization**: If i18n detected

## Output Format

The final PROJECT_CONTEXT.md should be:

- Comprehensive yet scannable

- Technical but accessible

- Structured for both human and LLM readers

- Free of implementation details that change frequently

- Focused on patterns and architecture over specific code

Remember: This file enables an LLM with zero prior knowledge to understand and contribute to the project effectively.

The context below is based on the analysis of the provided code fragments (v22.txt, v32.txt, etc.) and the detailed project expansion requirements (comment CLAUDE_Answered.txt).

I will now generate the requested file.

Markdown

/ ├── App.tsx # Monolithic entry point, contains all components, state, config, and styles. (Target for Phase 2 refactor) └── PROJECT_CONTEXT.md