# CODE — Thema-overzicht
Automatische clustering van regels uit `MIJN_CODE.code.txt`.

## Aliases & Config (223 regels)
- alias: {
- // @alias-start
- const TAG = "@alias-start";
- const END_TAG = "@alias-end";
- jest:     { start: `// ${TAG}`, end: `// ${END_TAG}` },
- Als ik naar je stacktrace kijk, zie ik dat Babel struikelt over een ] die waarschijnlijk dubbel is of op de verkeerde plek staat na de @alias-end.
- > jest --coverage --watchAll=false
- 4 | import ChipButton from '@components/ChipButton';
- > 5 | import MoneyField from '@components/fields/MoneyField'; // De nieuwe dispatcher
- > 3 | import { MoneyField } from '@fields/MoneyField';
- Korte termijn fix (om door te kunnen): Verlaag tijdelijk de coverage drempel in je package.json of jest.config.js:
- Open src/ui/organisms/IncomeRepeater.tsx en kijk naar regel 5. Verander deze naar het absolute pad (alias) of het juiste relatieve pad.
- Probeer dit (als je aliassen gebruikt):
- import MoneyField from '@components/fields/MoneyField';
- import MoneyField from '@ui/components/fields/MoneyField';
- "^@fields/(.*)$": "<rootDir>/src/ui/components/fields/$1",
- "^@components/(.*)$": "<rootDir>/src/ui/components/$1"
- moduleNameMapper: {
- // Map de oude aliassen naar de nieuwe /ui/ structuur
- '^@components/(.*)$': '<rootDir>/src/ui/components/$1',

## Logger & Bridge (157 regels)
- 💡 Remove console.*; use Logger
- De Phoenix audit geeft aan dat er nog 4 console-statements in je code staan (voornamelijk in useAppOrchestration.ts). Hoewel dit geen "fail" is voor de build, is het advies om deze te vervangen door je eigen Logger service om de "Grade A" naar een "Grade A+" te trekken.
- Door (indien je Logger al hebt):
- import { Logger } from '../../services/logger'; // Check pad
- import { Logger } from '@services/logger'; // <--- De artiest binnenlaten
- Logger.info('Orchestrator', 'ℹ️ No saved state found, redirection to onboarding');
- // Het kunstwerk: Geef de Zod error details mee aan de Logger
- Logger.error('Orchestrator', '❌ Validation failed for persisted state', parse.error);
- Logger.info('Orchestrator', '✨ Special status calculated', { special });
- Logger.warn('Orchestrator', '⚠️ Shadow flag calculation skipped', e);
- Logger.info('Orchestrator', '✅ Hydration complete. App Ready.');
- Logger.error('Orchestrator', '🚨 FATAL hydration error', err);
- Je vraagt naar de brug. In onze architectuur is "De Brug" (The Bridge) waarschijnlijk de log_bridge.sh of de logica in de Logger-service die de brug slaat tussen:
- import { Logger } from '@services/logger';
- import { PHOENIX_KEYS } from '@constants/phoenix-keys'; // Jouw dictionary
- Logger.info('Orchestrator', PHOENIX_KEYS.AUDIT_STAT_HOUSEHOLD);
- Logger.warn('Orchestrator', PHOENIX_KEYS.STEP_FAIL('Shadow Flag Calculation'), e);
- Logger.error('Orchestrator', PHOENIX_KEYS.ADR_SAFETY_LIMIT, err);
- node -e "const l=require('${PROJECT_ROOT}/scripts/utils/logger'); $1"
- log_ok()   { log_node "l.ok('$1')"; }

## Wizard & Pages (247 regels)
- src/screens/Wizard/WizardController.tsx:49:    // console.log({ id: page?.id, pageIndex: currentPageIndex, totalPages }); // Opti
- Dit is een klassieke React Native testfout. De WizardPage gebruikt de hook useSafeAreaInsets(), maar in de testomgeving bestaat de "Safe Area Context" niet.
- <WizardPage page={mockPage} />
- Je bent er bijna! Deze foutmelding vertelt je dat de WizardPage component meer verwacht dan alleen de page data. De component heeft ook functies nodig om te navigeren (onNext, onPrev) en status-vlaggen (isFirst, isLast).
- <WizardPage
- import WizardPage from '../WizardPage';
- Absoluut! Met de Brug in handen en de Dictionary als wetboek, kunnen we de WizardOrchestrator (of WizardController) transformeren van een "black box" naar een transparant meesterwerk.
- // WizardOrchestrator.tsx
- Extractie: We trekken de navigatie-logica uit de "lompe" WizardPage en verplaatsen die naar de WizardOrchestrator. De WizardPage wordt dan een Pure Component (geen eigen state, alleen props).
- B) De Orchestrator Refactor: De WizardOrchestrator in de Tempwizard map echt strak trekken met de nieuwe Logger-logica.
- Zullen we de WizardOrchestrator nu even "openleggen" om te kijken hoe we die navigatie-logica (die nu waarschijnlijk overal verspreid zit) centraal kunnen stellen?
- Je lijst met dubbelingen (OptionsScreen, WizardController, C1.config) is een directe waarschuwing dat de "oude wereld" (src/screens) de "nieuwe wereld" (src/ui/screens) in de weg zit.
- Waarom? Je find-dupes.sh stopt met gillen (want het staat niet meer in src), maar je kunt nog steeds diffen als je in de nieuwe WizardOrchestrator een conditie mist.
- // Tempwizard/WizardOrchestrator.tsx
- Slimme componenten: De Button en ToggleSwitch die je nu niet gebruikt, moeten in de WizardPage (de renderer) komen te staan. De config zegt alleen: type: 'toggle'. De WizardPage denkt dan: "Oh, een toggle? Dan pak ik die goede ToggleSwitch component erbij."
- import { WizardPageConfig } from '../types';
- export const HouseholdBasicsConfig: WizardPageConfig = {
- // src/ui/screens/Wizard/pages/Household.config.ts (voorheen C1)
- // src/ui/screens/Wizard/pages/HouseholdBasics.config.ts
- Nu die ToggleSwitch in de juiste map staat, kunnen we de C1.config.ts (die we nu HouseholdBasics.config.ts noemen) definitief invullen.

## FormContext & Reducer (327 regels)
- 5 | import * as FormContextModule from '@context/FormContext';
- 38 |   const { state, dispatch } = useFormContext();
- 63 |   const context = useContext(FormContext);
- > 64 |   if (!context) throw new Error('useFormContext must be used within FormProvider');
- import { FormProvider } from '../../../app/context/FormContext'; // Importeer deze!
- <FormProvider>
- import { useFormContext } from '@context/FormContext';
- const { state, dispatch } = useFormContext();
- dispatch({ type: 'RESET_STATE' });
- dispatch({ type: 'SET_SPECIAL_STATUS', payload: special });
- dispatch({ type: 'LOAD_SAVED_STATE', payload: validatedData } as any);
- dispatch({
- onToggle={(val) => updateField(field.id, val)}
- const { state, updateField } = useContext(WizardContext);
- onChange={(id, val) => updateField(id, val)}
- import { useFormContext } from '@app/context/FormContext';
- dispatch({ type: 'ALIGN_HOUSEHOLD_MEMBERS', payload: { ... } });
- import { useFormContext } from '@app/context/FormContext'; // Voor de dispatch
- const { state, dispatch } = useFormContext(); // De GM-logica leunt hierop
- WizardContext.Provider>                                                                                      src/app/context/FormContext.tsx:    <FormContext.Provider value={{ state, dispatch, updateField, isRefreshing

## Repeater & Members (191 regels)
- Open src/ui/organisms/IncomeRepeater.tsx en kijk naar regel 5. Verander deze naar het absolute pad (alias) of het juiste relatieve pad.
- IncomeRepeater.tsx	src/ui/organisms/	Het herhaalt groepen fields (Organism).
- import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
- <ScrollView style={{ padding: 16, flex: 1 }}>
- </ScrollView>
- │   ├── household.ts               <-- Logica voor gezinsleden (o.a. de 'Align' logica)
- C4: { leden: [] },
- const huidigeLeden = prev.C4?.leden || [];
- let nieuweLeden = [...huidigeLeden];
- if (nieuweLeden.length < aantalMensen) {
- const extra = Array(aantalMensen - nieuweLeden.length).fill({ naam: '', rol: '' });
- nieuweLeden = [...nieuweLeden, ...extra];
- } else if (nieuweLeden.length > aantalMensen) {
- nieuweLeden = nieuweLeden.slice(0, aantalMensen);
- leden: HouseholdMember[];
- gender?: string;
- dateOfBirth?: string;
- leden: Member[];
- inkomstenLeden: IncomeMember[];
- Omdat we te maken hebben met simpele waarden (counters) én complexe waarden (arrays van gezinsleden met inkomsten), hebben we een Universele Dispatch nodig in het Brein.

## Finance & Cents (423 regels)
- Open src/ui/organisms/IncomeRepeater.tsx en kijk naar regel 5. Verander deze naar het absolute pad (alias) of het juiste relatieve pad.
- IncomeRepeater.tsx	src/ui/organisms/	Het herhaalt groepen fields (Organism).
- import TempP3 from './3incomeDetails.config';
- import TempP4 from './4fixedExpenses.config';
- 3incomeDetails.config.ts (was temp3.conf) + goudmijn is c1.config
- 4fixedExpenses.config.ts (was temp4.conf) + goudmijn is c1.config
- Dat is een interessante puzzel! Als ik het goed begrijp, heb je nu vier nieuwe schermen (Setup, Details, Income, Expenses), maar in je Goudmijn verwezen ze alle vier naar de data/logica van de oorspronkelijke C1.config.
- expenses: any; // Moeten we nog invullen vanuit Tweede-expenses
- items: Transaction[];
- householdBenefits?: any;
- vermogen?: any;
- export type IncomeFrequency = 'week' | '4wk' | 'month' | 'quarter' | 'year';
- frequentie?: IncomeFrequency;
- categories: IncomeCategories;
- hasVermogen: boolean;
- // ./src/types/transaction.ts
- category: TransactionCategory;
- inkomstenLeden: IncomeMember[];
- householdBenefits?: HouseholdBenefits;
- vermogen?: VermogenData;
