**Geëxporteerd:** 4-1-2026, 15:58:44
**Aantal berichten:** 3

---
**User:**

```
Superprompt
```

```
HouseholdSetupOrganism
```

```
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native'; // Voor de iconen

// ====================================================================
// MOCK DEFINITIES (Atoms & Molecules uit Fase 4.2)
// Dit zijn aannames op basis van de gevraagde componentnamen.
// Ze moeten vervangen worden door de daadwerkelijke implementaties.
// ====================================================================

| primary: '#1E90FF' | // Dodger Blue |
| --- | --- |
| secondary: '#6c757d' | // Gray |
| danger: '#dc3545' | // Red |
| border: '#ced4da' | // Light Gray |
| text: '#212529' | // Dark Gray |
| inputBg: '#f8f9fa' | // Very Light Gray |

| label: string |  |
| --- | --- |
| value: number |  |
| onChange: (newValue: number) => void |  |
| minValue?: number |  |
| maxValue?: number |  |
| ) |  |

| question: string |  |
| --- | --- |
| value: boolean \| null |  |
| onAnswer: (answer: boolean) => void |  |
| ) |  |

| title: string |  |
| --- | --- |
| onPress: () => void |  |
| disabled?: boolean |  |
| active?: boolean |  |
| icon?: React.ReactNode |  |
| ) |  |

const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <BaseButton {...props} bgColor={COLORS.primary} textColor="white" />
);

const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <BaseButton {...props} bgColor={COLORS.inputBg} textColor={COLORS.text} />
);

| step: string |  |
| --- | --- |
| title: string |  |
| subtitle: string |  |
| ) |  |

// MOCK STYLES
const mockStyles = StyleSheet.create({
  container: { padding: 20, backgroundColor: 'white', flex: 1 },
  headerContainer: { marginBottom: 20 },
  headerStep: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  headerSubtitle: { fontSize: 16, color: COLORS.text, marginTop: 8 },
  stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stepperLabel: { fontSize: 16, color: COLORS.text },
  stepperControls: { flexDirection: 'row', alignItems: 'center' },
  stepperButton: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 15, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.border, borderRadius: 5, marginHorizontal: 5, color: COLORS.primary },
  stepperValue: { fontSize: 16, fontWeight: '600', minWidth: 20, textAlign: 'center' as 'center', color: COLORS.text },
  card: { padding: 20, borderRadius: 10, backgroundColor: COLORS.inputBg, marginTop: 20, borderWidth: 1, borderColor: COLORS.border },
  cardQuestion: { fontSize: 16, fontWeight: '600', marginBottom: 15, color: COLORS.text },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  button: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, textAlign: 'center' as 'center', fontWeight: '600', borderWidth: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingTop: 15, borderTopWidth: 1, borderTopColor: COLORS.border },
  validationError: { color: COLORS.danger, marginTop: 10, fontWeight: '500' },
});

// ====================================================================
// DATA STRUCTUUR
// ====================================================================

| totalPersons: number |  |
| --- | --- |
| adults: number |  |
| children: number |  |
| details: Array<any> | // Type hier op 'Object' gelaten zoals in de prompt. |
| hasPets: boolean \| null |  |

// ====================================================================
// ORGANISM COMPONENT
// ====================================================================

| totalPersons: 1 |  |
| --- | --- |
| adults: 1 |  |
| children: 0 |  |
| details: [] |  |
| hasPets: null |  |

| const [step | setStep] = useState(1); |
| --- | --- |
| const [householdState | setHouseholdState] = useState<HouseholdState>(INITIAL_STATE); |

| const updateState = useCallback(<K extends keyof HouseholdState>(key: K | value: HouseholdState[K]) => { |
| --- | --- |
| let newState = { ...prevState | [key]: value }; |

| const safeTotalPersons = Math.max(0 | newTotalPersons); |
| --- | --- |
| const safeAdults = Math.max(0 | newAdults); |

        // Herbereken kinderen
        const newChildren = Math.max(0, safeTotalPersons - safeAdults);

| newState = { ...newState, adults: safeTotalPersons, children: 0 } |  |
| --- | --- |
| newState = { ...newState, children: newChildren, totalPersons: safeTotalPersons, adults: safeAdults } |  |

| return newState |  |
| --- | --- |
| }) |  |
| }, []) |  |

| const { totalPersons, adults, children } = householdState |  |
| --- | --- |
| ) |  |
| }, [householdState]) |  |

| return householdState.hasPets !== null |  |
| --- | --- |
| }, [householdState]) |  |

| if (step === 1) return valid_1_1 |  |
| --- | --- |
| if (step === 2) return valid_1_2 |  |
| return false |  |
| }, [step, valid_1_1, valid_1_2]) |  |

| const prev = () => setStep(s => Math.max(1, s - 1)) |  |
| --- | --- |
| setStep(s => s + 1) |  |
| } |  |

| alert(`Setup voltooid! Huishouden State: ${JSON.stringify(householdState, null, 2)}`) |  |
| --- | --- |
| } |  |

| subtitle="Geef het totale aantal personen in het huishouden op | en het aantal volwassenen (18+)." |
| --- | --- |
| onChange={(v) => updateState('totalPersons' | v)} |
| onChange={(v) => updateState('adults' | v)} |

| <View style={{ marginTop: 20 }}> | <View style={{ marginTop: 20 }}> |
| --- | --- |
| <Text style={mockStyles.stepperLabel}> | <Text style={mockStyles.stepperLabel}> |
| Afgeleid: {householdState.children} Kind(eren) | Afgeleid: {householdState.children} Kind(eren) |
| </Text> | </Text> |
| </View> | </View> |

| {/* Validatie feedback */} | {/* Validatie feedback */} |
| --- | --- |
| {!valid_1_1 && householdState.totalPersons > 0 && ( | {!valid_1_1 && householdState.totalPersons > 0 && ( |
| <Text style={mockStyles.validationError}> | <Text style={mockStyles.validationError}> |
| Zorg ervoor dat het aantal volwassenen niet groter is dan het totale aantal personen. | Zorg ervoor dat het aantal volwassenen niet groter is dan het totale aantal personen. |
| </Text> | </Text> |
| )} | )} |
| {householdState.totalPersons < 1 && ( | {householdState.totalPersons < 1 && ( |
| <Text style={mockStyles.validationError}> | <Text style={mockStyles.validationError}> |
| Er moet minimaal 1 persoon in het huishouden zijn. | Er moet minimaal 1 persoon in het huishouden zijn. |
| </Text> | </Text> |
| )} | )} |
| </View> | </View> |
| ); | ); |

| case 2: | case 2: |
| --- | --- |
| return ( | return ( |
| <View> | <View> |
| <FormHeader | <FormHeader |
| step="Stap 1.2" | step="Stap 1.2" |
| title="Huisdieren" | title="Huisdieren" |
| subtitle="Hebben jullie huisdieren in het huishouden?" | subtitle="Hebben jullie huisdieren in het huishouden?" |
| /> | /> |
| <YNQuestionCard | <YNQuestionCard |
| question="Heeft dit huishouden huisdieren?" | question="Heeft dit huishouden huisdieren?" |
| value={householdState.hasPets} | value={householdState.hasPets} |
| onAnswer={(v) => updateState('hasPets', v)} | onAnswer={(v) => updateState('hasPets', v)} |
| /> | /> |
| </View> | </View> |
| ); | ); |

| case 3: | case 3: |
| --- | --- |
| // Optioneel: Dit zou Stap 1.3 zijn (bv. details, zoals vermeld in 'details' state) | // Optioneel: Dit zou Stap 1.3 zijn (bv. details, zoals vermeld in 'details' state) |
| return ( | return ( |
| <View> | <View> |
| <FormHeader | <FormHeader |
| step="Volgende Stappen" | step="Volgende Stappen" |
| title="Setup Voltooid" | title="Setup Voltooid" |
| subtitle="Huishouden Setup is compleet (Stap 1.1 & 1.2)." | subtitle="Huishouden Setup is compleet (Stap 1.1 & 1.2)." |
| /> | /> |
| <Text style={{ fontSize: 16, marginTop: 20, color: COLORS.text }}> | <Text style={{ fontSize: 16, marginTop: 20, color: COLORS.text }}> |
| De volgende fase, zoals het invullen van de 'details' (), zou hier beginnen. | De volgende fase, zoals het invullen van de 'details' (), zou hier beginnen. |
| </Text> | </Text> |
| </View> | </View> |
| ); | ); |

| return <Text style={{ color: COLORS.danger }}>Onbekende stap: {step}</Text> |  |
| --- | --- |
| } |  |

| // RENDERING VAN FOOTER NAVIGATIE | // RENDERING VAN FOOTER NAVIGATIE |
| --- | --- |
| const renderFooter = () => ( | const renderFooter = () => ( |
| <View style={mockStyles.footer}> | <View style={mockStyles.footer}> |
| <SecondaryButton | <SecondaryButton |
| title="Vorige" | title="Vorige" |
| onPress={prev} | onPress={prev} |
| disabled={step === 1} | disabled={step === 1} |
| icon={<ChevronLeft size={18} color={COLORS.text} />} | icon={<ChevronLeft size={18} color={COLORS.text} />} |
| /> | /> |

| {step < 2 ? ( | {step < 2 ? ( |
| --- | --- |
| <PrimaryButton | <PrimaryButton |
| title="Volgende" | title="Volgende" |
| onPress={next} | onPress={next} |
| disabled={!canNext} | disabled={!canNext} |
| icon={<ChevronRight size={18} color="white" />} | icon={<ChevronRight size={18} color="white" />} |
| /> | /> |
| ) : ( | ) : ( |
| <PrimaryButton | <PrimaryButton |
| title="Voltooien" | title="Voltooien" |
| onPress={finishSetup} | onPress={finishSetup} |
| disabled={!canNext} // `canNext` is hier valid_1_2 | disabled={!canNext} // `canNext` is hier valid_1_2 |
| icon={<Check size={18} color="white" />} | icon={<Check size={18} color="white" />} |
| /> | /> |
| )} | )} |
| </View> | </View> |
| ); | ); |

| ) |  |
| --- | --- |
| } |  |

export default HouseholdSetupOrganism;
```

```
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native'; // Voor de iconen

// ====================================================================
// MOCK DEFINITIES (Atoms & Molecules uit Fase 4.2)
// Dit zijn aannames op basis van de gevraagde componentnamen.
// Ze moeten vervangen worden door de daadwerkelijke implementaties.
// ====================================================================

| primary: '#1E90FF' | // Dodger Blue |
| --- | --- |
| secondary: '#6c757d' | // Gray |
| danger: '#dc3545' | // Red |
| border: '#ced4da' | // Light Gray |
| text: '#212529' | // Dark Gray |
| inputBg: '#f8f9fa' | // Very Light Gray |

| label: string |  |
| --- | --- |
| value: number |  |
| onChange: (newValue: number) => void |  |
| minValue?: number |  |
| maxValue?: number |  |
| ) |  |

| question: string |  |
| --- | --- |
| value: boolean \| null |  |
| onAnswer: (answer: boolean) => void |  |
| ) |  |

| title: string |  |
| --- | --- |
| onPress: () => void |  |
| disabled?: boolean |  |
| active?: boolean |  |
| icon?: React.ReactNode |  |
| ) |  |

const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <BaseButton {...props} bgColor={COLORS.primary} textColor="white" />
);

const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <BaseButton {...props} bgColor={COLORS.inputBg} textColor={COLORS.text} />
);

| step: string |  |
| --- | --- |
| title: string |  |
| subtitle: string |  |
| ) |  |

// MOCK STYLES
const mockStyles = StyleSheet.create({
  container: { padding: 20, backgroundColor: 'white', flex: 1 },
  headerContainer: { marginBottom: 20 },
  headerStep: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  headerSubtitle: { fontSize: 16, color: COLORS.text, marginTop: 8 },
  stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stepperLabel: { fontSize: 16, color: COLORS.text },
  stepperControls: { flexDirection: 'row', alignItems: 'center' },
  stepperButton: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 15, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.border, borderRadius: 5, marginHorizontal: 5, color: COLORS.primary },
  stepperValue: { fontSize: 16, fontWeight: '600', minWidth: 20, textAlign: 'center' as 'center', color: COLORS.text },
  card: { padding: 20, borderRadius: 10, backgroundColor: COLORS.inputBg, marginTop: 20, borderWidth: 1, borderColor: COLORS.border },
  cardQuestion: { fontSize: 16, fontWeight: '600', marginBottom: 15, color: COLORS.text },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  button: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, textAlign: 'center' as 'center', fontWeight: '600', borderWidth: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingTop: 15, borderTopWidth: 1, borderTopColor: COLORS.border },
  validationError: { color: COLORS.danger, marginTop: 10, fontWeight: '500' },
});

// ====================================================================
// DATA STRUCTUUR
// ====================================================================

| totalPersons: number |  |
| --- | --- |
| adults: number |  |
| children: number |  |
| details: Array<any> | // Type hier op 'Object' gelaten zoals in de prompt. |
| hasPets: boolean \| null |  |

// ====================================================================
// ORGANISM COMPONENT
// ====================================================================

| totalPersons: 1 |  |
| --- | --- |
| adults: 1 |  |
| children: 0 |  |
| details: [] |  |
| hasPets: null |  |

| const [step | setStep] = useState(1); |
| --- | --- |
| const [householdState | setHouseholdState] = useState<HouseholdState>(INITIAL_STATE); |

| const updateState = useCallback(<K extends keyof HouseholdState>(key: K | value: HouseholdState[K]) => { |
| --- | --- |
| let newState = { ...prevState | [key]: value }; |

| const safeTotalPersons = Math.max(0 | newTotalPersons); |
| --- | --- |
| const safeAdults = Math.max(0 | newAdults); |

        // Herbereken kinderen
        const newChildren = Math.max(0, safeTotalPersons - safeAdults);

| newState = { ...newState, adults: safeTotalPersons, children: 0 } |  |
| --- | --- |
| newState = { ...newState, children: newChildren, totalPersons: safeTotalPersons, adults: safeAdults } |  |

| return newState |  |
| --- | --- |
| }) |  |
| }, []) |  |

| const { totalPersons, adults, children } = householdState |  |
| --- | --- |
| ) |  |
| }, [householdState]) |  |

| return householdState.hasPets !== null |  |
| --- | --- |
| }, [householdState]) |  |

| if (step === 1) return valid_1_1 |  |
| --- | --- |
| if (step === 2) return valid_1_2 |  |
| return false |  |
| }, [step, valid_1_1, valid_1_2]) |  |

| const prev = () => setStep(s => Math.max(1, s - 1)) |  |
| --- | --- |
| setStep(s => s + 1) |  |
| } |  |

| alert(`Setup voltooid! Huishouden State: ${JSON.stringify(householdState, null, 2)}`) |  |
| --- | --- |
| } |  |

| subtitle="Geef het totale aantal personen in het huishouden op | en het aantal volwassenen (18+)." |
| --- | --- |
| onChange={(v) => updateState('totalPersons' | v)} |
| onChange={(v) => updateState('adults' | v)} |

| <View style={{ marginTop: 20 }}> | <View style={{ marginTop: 20 }}> |
| --- | --- |
| <Text style={mockStyles.stepperLabel}> | <Text style={mockStyles.stepperLabel}> |
| Afgeleid: {householdState.children} Kind(eren) | Afgeleid: {householdState.children} Kind(eren) |
| </Text> | </Text> |
| </View> | </View> |

| {/* Validatie feedback */} | {/* Validatie feedback */} |
| --- | --- |
| {!valid_1_1 && householdState.totalPersons > 0 && ( | {!valid_1_1 && householdState.totalPersons > 0 && ( |
| <Text style={mockStyles.validationError}> | <Text style={mockStyles.validationError}> |
| Zorg ervoor dat het aantal volwassenen niet groter is dan het totale aantal personen. | Zorg ervoor dat het aantal volwassenen niet groter is dan het totale aantal personen. |
| </Text> | </Text> |
| )} | )} |
| {householdState.totalPersons < 1 && ( | {householdState.totalPersons < 1 && ( |
| <Text style={mockStyles.validationError}> | <Text style={mockStyles.validationError}> |
| Er moet minimaal 1 persoon in het huishouden zijn. | Er moet minimaal 1 persoon in het huishouden zijn. |
| </Text> | </Text> |
| )} | )} |
| </View> | </View> |
| ); | ); |

| case 2: | case 2: |
| --- | --- |
| return ( | return ( |
| <View> | <View> |
| <FormHeader | <FormHeader |
| step="Stap 1.2" | step="Stap 1.2" |
| title="Huisdieren" | title="Huisdieren" |
| subtitle="Hebben jullie huisdieren in het huishouden?" | subtitle="Hebben jullie huisdieren in het huishouden?" |
| /> | /> |
| <YNQuestionCard | <YNQuestionCard |
| question="Heeft dit huishouden huisdieren?" | question="Heeft dit huishouden huisdieren?" |
| value={householdState.hasPets} | value={householdState.hasPets} |
| onAnswer={(v) => updateState('hasPets', v)} | onAnswer={(v) => updateState('hasPets', v)} |
| /> | /> |
| </View> | </View> |
| ); | ); |

| case 3: | case 3: |
| --- | --- |
| // Optioneel: Dit zou Stap 1.3 zijn (bv. details, zoals vermeld in 'details' state) | // Optioneel: Dit zou Stap 1.3 zijn (bv. details, zoals vermeld in 'details' state) |
| return ( | return ( |
| <View> | <View> |
| <FormHeader | <FormHeader |
| step="Volgende Stappen" | step="Volgende Stappen" |
| title="Setup Voltooid" | title="Setup Voltooid" |
| subtitle="Huishouden Setup is compleet (Stap 1.1 & 1.2)." | subtitle="Huishouden Setup is compleet (Stap 1.1 & 1.2)." |
| /> | /> |
| <Text style={{ fontSize: 16, marginTop: 20, color: COLORS.text }}> | <Text style={{ fontSize: 16, marginTop: 20, color: COLORS.text }}> |
| De volgende fase, zoals het invullen van de 'details' (), zou hier beginnen. | De volgende fase, zoals het invullen van de 'details' (), zou hier beginnen. |
| </Text> | </Text> |
| </View> | </View> |
| ); | ); |

| return <Text style={{ color: COLORS.danger }}>Onbekende stap: {step}</Text> |  |
| --- | --- |
| } |  |

| // RENDERING VAN FOOTER NAVIGATIE | // RENDERING VAN FOOTER NAVIGATIE |
| --- | --- |
| const renderFooter = () => ( | const renderFooter = () => ( |
| <View style={mockStyles.footer}> | <View style={mockStyles.footer}> |
| <SecondaryButton | <SecondaryButton |
| title="Vorige" | title="Vorige" |
| onPress={prev} | onPress={prev} |
| disabled={step === 1} | disabled={step === 1} |
| icon={<ChevronLeft size={18} color={COLORS.text} />} | icon={<ChevronLeft size={18} color={COLORS.text} />} |
| /> | /> |

| {step < 2 ? ( | {step < 2 ? ( |
| --- | --- |
| <PrimaryButton | <PrimaryButton |
| title="Volgende" | title="Volgende" |
| onPress={next} | onPress={next} |
| disabled={!canNext} | disabled={!canNext} |
| icon={<ChevronRight size={18} color="white" />} | icon={<ChevronRight size={18} color="white" />} |
| /> | /> |
| ) : ( | ) : ( |
| <PrimaryButton | <PrimaryButton |
| title="Voltooien" | title="Voltooien" |
| onPress={finishSetup} | onPress={finishSetup} |
| disabled={!canNext} // `canNext` is hier valid_1_2 | disabled={!canNext} // `canNext` is hier valid_1_2 |
| icon={<Check size={18} color="white" />} | icon={<Check size={18} color="white" />} |
| /> | /> |
| )} | )} |
| </View> | </View> |
| ); | ); |

| ) |  |
| --- | --- |
| } |  |

export default HouseholdSetupOrganism;
```

![TXT-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/plain)

Lyra_Fase4...prompt (1)
TXT

Voer uit

Denkproces tonen

Dit is de gevraagde Organism-component in React Native met TypeScript, gebaseerd op de specificaties uit de -file.

Omdat de Atoms en Molecules uit Fase 4.2 niet zijn gedefinieerd, zijn hieronder mock-interfaces en componenten opgenomen, zodat de functioneel en compileerbaar is.

TypeScript

---

**User:**

```
designAtoms.txt
```

```
designMolecules.txt
```

```
React.CSSProperties
```

```
TouchableOpacity
```

```
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

// ====================================================================
// DESIGN ATOMS (Aangepast voor React Native)
// ====================================================================

| primary: '#00A98F' | // Teal |
| --- | --- |
| secondary: '#FF6B6B' | // Red/Coral |
| background: '#F9F9F9' | // Zeer lichtgrijs |
| text: '#333333' | // Donkergrijs |
| income: '#38A169' |  |
| expense: '#E53E3E' |  |
| lightText: '#666666' |  |
| inputBackground: '#FFFFFF' |  |
| border: '#DDDDDD' |  |
| disabled: '#AAAAAA' |  |
| focusBorder: '#4299E1' |  |

| text: string | // Komt van de `text` prop in designAtoms.txt |
| --- | --- |
| onPress: () => void |  |
| disabled?: boolean |  |
| fullWidth?: boolean |  |
| icon?: React.ReactNode |  |
| active?: boolean | // Toegevoegd voor YNQuestionCard functionaliteit |

const styles = StyleSheet.create({
  // ORGANISM STIJLEN
  organismContainer: { padding: 20, backgroundColor: COLORS.background, flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingTop: 15, borderTopWidth: 1, borderTopColor: COLORS.border },
  validationError: { color: COLORS.secondary, marginTop: 10, fontWeight: '500', fontSize: 13 },
  stepContentContainer: { paddingHorizontal: 5 },

| // ATOM STIJLEN | // ATOM STIJLEN |
| --- | --- |
| buttonBase: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minWidth: 100 }, | buttonBase: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minWidth: 100 }, |
| buttonText: { fontSize: 15, fontWeight: '600', marginLeft: 4 }, | buttonText: { fontSize: 15, fontWeight: '600', marginLeft: 4 }, |
| heading2: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 10 }, | heading2: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 10 }, |
| bodyText: { fontSize: 15, fontWeight: '400', color: COLORS.text, lineHeight: 22 }, | bodyText: { fontSize: 15, fontWeight: '400', color: COLORS.text, lineHeight: 22 }, |

  // MOLECULE STIJLEN
  stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 15 },
  stepperLabel: { fontSize: 15, color: COLORS.text, fontWeight: '600' },
  stepperControls: { flexDirection: 'row', alignItems: 'center' },
  stepperButton: { width: 30, height: 30, backgroundColor: COLORS.inputBackground, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 5 },
  stepperButtonText: { fontSize: 18, color: COLORS.text, fontWeight: 'bold' },
  stepperValue: { fontSize: 15, fontWeight: '600', minWidth: 35, textAlign: 'center', color: COLORS.text },
  cardContainer: { marginBottom: 20, padding: 0 },
  segmentedControlContainer: { flexDirection: 'row', marginTop: 10 },
});

| const bgColor = disabled ? COLORS.disabled : active ? COLORS.primary : COLORS.primary | // Als `active` true is, blijft de kleur Primary |
| --- | --- |
| ] |  |
| ) |  |
| } | // |

| const bgColor = active ? COLORS.primary : COLORS.inputBackground |  |
| --- | --- |
| const textColor = active ? 'white' : COLORS.text |  |
| const borderColor = active ? COLORS.primary : COLORS.border |  |
| ] |  |
| ) |  |
| } | // |

// Aangepaste Heading2 voor React Native
const Heading2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.heading2}>{children}</Text>
); //

// Aangepaste BodyText voor React Native
const BodyText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.bodyText}>{children}</Text>
); //

// ====================================================================
// DESIGN MOLECULES (Aangepast voor React Native)
// ====================================================================

| title: string |  |
| --- | --- |
| currentStep: number |  |
| totalSteps: number |  |
| subtitle: string |  |

const FormHeader: React.FC<FormHeaderProps> = ({ title, currentStep, totalSteps, subtitle }) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>
      STAP {currentStep} VAN {totalSteps}
    </Text>
    <Heading2>{title}</Heading2>
    <BodyText>{subtitle}</BodyText>
  </View>
); //

| label: string |  |
| --- | --- |
| value: number |  |
| onChange: (value: number) => void |  |
| min?: number |  |
| max?: number |  |

| const decrement = () => onChange(Math.max(min, value - 1)) |  |
| --- | --- |
| onChange(value + 1) |  |
| } |  |

| const isMin = value <= min |  |
| --- | --- |
| const isMax = max !== undefined && value >= max |  |

| <TouchableOpacity onPress={decrement} disabled={isMin} style={[styles.stepperButton | { opacity: isMin ? 0.4 : 1 }]}> |
| --- | --- |
| <TouchableOpacity onPress={increment} disabled={isMax} style={[styles.stepperButton | { opacity: isMax ? 0.4 : 1 }]}> |

| question: string |  |
| --- | --- |
| value: boolean \| null | // null is voor onbeantwoord |
| onChange: (answer: boolean) => void | // Komt overeen met `onAnswer` in de vorige versie |
| required?: boolean |  |

const YNQuestionCard: React.FC<YNQuestionCardProps> = ({ question, value, onChange }) => (
  <View style={styles.cardContainer}>
    <Text style={styles.stepperLabel}>{question}</Text>
    <View style={styles.segmentedControlContainer}>
      {/* Gebruikt de PrimaryButton en SecondaryButton Atoms voor de implementatie */}
      <View style={{ flex: 1, marginRight: 8 }}>
        <PrimaryButton text="Ja" onPress={() => onChange(true)} active={value === true} fullWidth={true} />
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <SecondaryButton text="Nee" onPress={() => onChange(false)} active={value === false} fullWidth={true} />
      </View>
    </View>
  </View>
); //

// ====================================================================
// ORGANISM COMPONENT (HouseholdSetupOrganism)
// ====================================================================

| totalPersons: number |  |
| --- | --- |
| adults: number |  |
| children: number |  |
| details: Array<any> |  |
| hasPets: boolean \| null |  |

| totalPersons: 1 |  |
| --- | --- |
| adults: 1 |  |
| children: 0 |  |
| details: [] |  |
| hasPets: null |  |

| const [step | setStep] = useState(1); |
| --- | --- |
| const [householdState | setHouseholdState] = useState<HouseholdState>(INITIAL_STATE); |

| const updateState = useCallback(<K extends keyof HouseholdState>(key: K | value: HouseholdState[K]) => { |
| --- | --- |
| let newState = { ...prevState | [key]: value }; |

| const safeTotalPersons = Math.max(1 | newTotalPersons); // Minimaal 1 persoon |
| --- | --- |
| const safeAdults = Math.max(0 | newAdults); |

        // Voorkom adults > totalPersons. Set adults = totalPersons als dit gebeurt.
        const effectiveAdults = Math.min(safeAdults, safeTotalPersons);

        // Herbereken kinderen
        const newChildren = Math.max(0, safeTotalPersons - effectiveAdults);

        newState = { ...newState, totalPersons: safeTotalPersons, adults: effectiveAdults, children: newChildren };
      }

| return newState |  |
| --- | --- |
| }) |  |
| }, []) |  |

| const { totalPersons | adults } = householdState; |
| --- | --- |
| } | [householdState]); |

| return householdState.hasPets !== null | // Moet beantwoord zijn |
| --- | --- |
| }, [householdState]) |  |

| if (step === 1) return valid_1_1 |  |
| --- | --- |
| if (step === 2) return valid_1_2 |  |
| return false |  |
| }, [step, valid_1_1, valid_1_2]) |  |

| const prev = () => setStep(s => Math.max(1, s - 1)) |  |
| --- | --- |
| setStep(s => s + 1) |  |
| } |  |

| Alert.alert("Setup Voltooid", `Huishouden State: ${JSON.stringify(householdState, null, 2)}`) |  |
| --- | --- |
| } |  |

| subtitle="Geef het totale aantal personen in het huishouden op | en het aantal volwassenen (18+)." |
| --- | --- |
| onChange={(v) => updateState('totalPersons' | v)} |
| onChange={(v) => updateState('adults' | v)} |

| <View style={{ marginTop: 20 }}> | <View style={{ marginTop: 20 }}> |
| --- | --- |
| <BodyText> | <BodyText> |
| Afgeleid aantal kinderen: <Text style={{ fontWeight: 'bold' }}>{householdState.children}</Text> | Afgeleid aantal kinderen: <Text style={{ fontWeight: 'bold' }}>{householdState.children}</Text> |
| </BodyText> | </BodyText> |
| </View> | </View> |

| {/* Validatie feedback */} | {/* Validatie feedback */} |
| --- | --- |
| {!valid_1_1 && householdState.totalPersons >= 1 && ( | {!valid_1_1 && householdState.totalPersons >= 1 && ( |
| <Text style={styles.validationError}> | <Text style={styles.validationError}> |
| Fout: Aantal volwassenen mag niet groter zijn dan het totale aantal personen. | Fout: Aantal volwassenen mag niet groter zijn dan het totale aantal personen. |
| </Text> | </Text> |
| )} | )} |
| </View> | </View> |
| ); | ); |

| case 2: | case 2: |
| --- | --- |
| return ( | return ( |
| <View style={styles.stepContentContainer}> | <View style={styles.stepContentContainer}> |
| <FormHeader | <FormHeader |
| currentStep={2} | currentStep={2} |
| totalSteps={totalSteps} | totalSteps={totalSteps} |
| title="Huisdieren" | title="Huisdieren" |
| subtitle="Hebben jullie huisdieren in het huishouden?" | subtitle="Hebben jullie huisdieren in het huishouden?" |
| /> | /> |
| <YNQuestionCard | <YNQuestionCard |
| question="Heeft dit huishouden huisdieren?" | question="Heeft dit huishouden huisdieren?" |
| value={householdState.hasPets} | value={householdState.hasPets} |
| onChange={(v) => updateState('hasPets', v)} | onChange={(v) => updateState('hasPets', v)} |
| /> | /> |
| </View> | </View> |
| ); | ); |

| // Hier zou Stap 3 (Details, als per Superprompt) of de afronding komen. | // Hier zou Stap 3 (Details, als per Superprompt) of de afronding komen. |
| --- | --- |
| case 3: | case 3: |
| return ( | return ( |
| <View style={styles.stepContentContainer}> | <View style={styles.stepContentContainer}> |
| <FormHeader | <FormHeader |
| currentStep={totalSteps + 1} | currentStep={totalSteps + 1} |
| totalSteps={totalSteps + 1} | totalSteps={totalSteps + 1} |
| title="Setup Voltooid" | title="Setup Voltooid" |
| subtitle="Huishouden Setup is compleet (Stap 1.1 & 1.2)." | subtitle="Huishouden Setup is compleet (Stap 1.1 & 1.2)." |
| /> | /> |
| <BodyText> | <BodyText> |
| Alle verplichte basisvragen zijn beantwoord. U kunt nu het proces afronden. | Alle verplichte basisvragen zijn beantwoord. U kunt nu het proces afronden. |
| </BodyText> | </BodyText> |
| </View> | </View> |
| ); | ); |

| return <Text style={styles.validationError}>Onbekende stap: {step}</Text> |  |
| --- | --- |
| } |  |

| // RENDERING VAN FOOTER NAVIGATIE | // RENDERING VAN FOOTER NAVIGATIE |
| --- | --- |
| const renderFooter = () => ( | const renderFooter = () => ( |
| <View style={styles.footer}> | <View style={styles.footer}> |
| <SecondaryButton | <SecondaryButton |
| text="Vorige" | text="Vorige" |
| onPress={prev} | onPress={prev} |
| disabled={step === 1} | disabled={step === 1} |
| icon={<ChevronLeft size={18} color={COLORS.text} />} | icon={<ChevronLeft size={18} color={COLORS.text} />} |
| fullWidth={false} | fullWidth={false} |
| /> | /> |

| {step < totalSteps ? ( | {step < totalSteps ? ( |
| --- | --- |
| <PrimaryButton | <PrimaryButton |
| text="Volgende" | text="Volgende" |
| onPress={next} | onPress={next} |
| disabled={!canNext} | disabled={!canNext} |
| icon={<ChevronRight size={18} color="white" />} | icon={<ChevronRight size={18} color="white" />} |
| fullWidth={false} | fullWidth={false} |
| /> | /> |
| ) : ( | ) : ( |
| <PrimaryButton | <PrimaryButton |
| text="Voltooien" | text="Voltooien" |
| onPress={finishSetup} | onPress={finishSetup} |
| disabled={!canNext} | disabled={!canNext} |
| icon={<Check size={18} color="white" />} | icon={<Check size={18} color="white" />} |
| fullWidth={false} | fullWidth={false} |
| /> | /> |
| )} | )} |
| </View> | </View> |
| ); | ); |

| ) |  |
| --- | --- |
| } |  |

export default HouseholdSetupOrganism;
```

```
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';

// ====================================================================
// DESIGN ATOMS (Aangepast voor React Native)
// ====================================================================

| primary: '#00A98F' | // Teal |
| --- | --- |
| secondary: '#FF6B6B' | // Red/Coral |
| background: '#F9F9F9' | // Zeer lichtgrijs |
| text: '#333333' | // Donkergrijs |
| income: '#38A169' |  |
| expense: '#E53E3E' |  |
| lightText: '#666666' |  |
| inputBackground: '#FFFFFF' |  |
| border: '#DDDDDD' |  |
| disabled: '#AAAAAA' |  |
| focusBorder: '#4299E1' |  |

| text: string | // Komt van de `text` prop in designAtoms.txt |
| --- | --- |
| onPress: () => void |  |
| disabled?: boolean |  |
| fullWidth?: boolean |  |
| icon?: React.ReactNode |  |
| active?: boolean | // Toegevoegd voor YNQuestionCard functionaliteit |

const styles = StyleSheet.create({
  // ORGANISM STIJLEN
  organismContainer: { padding: 20, backgroundColor: COLORS.background, flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingTop: 15, borderTopWidth: 1, borderTopColor: COLORS.border },
  validationError: { color: COLORS.secondary, marginTop: 10, fontWeight: '500', fontSize: 13 },
  stepContentContainer: { paddingHorizontal: 5 },

| // ATOM STIJLEN | // ATOM STIJLEN |
| --- | --- |
| buttonBase: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minWidth: 100 }, | buttonBase: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minWidth: 100 }, |
| buttonText: { fontSize: 15, fontWeight: '600', marginLeft: 4 }, | buttonText: { fontSize: 15, fontWeight: '600', marginLeft: 4 }, |
| heading2: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 10 }, | heading2: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 10 }, |
| bodyText: { fontSize: 15, fontWeight: '400', color: COLORS.text, lineHeight: 22 }, | bodyText: { fontSize: 15, fontWeight: '400', color: COLORS.text, lineHeight: 22 }, |

  // MOLECULE STIJLEN
  stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 15 },
  stepperLabel: { fontSize: 15, color: COLORS.text, fontWeight: '600' },
  stepperControls: { flexDirection: 'row', alignItems: 'center' },
  stepperButton: { width: 30, height: 30, backgroundColor: COLORS.inputBackground, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 5 },
  stepperButtonText: { fontSize: 18, color: COLORS.text, fontWeight: 'bold' },
  stepperValue: { fontSize: 15, fontWeight: '600', minWidth: 35, textAlign: 'center', color: COLORS.text },
  cardContainer: { marginBottom: 20, padding: 0 },
  segmentedControlContainer: { flexDirection: 'row', marginTop: 10 },
});

| const bgColor = disabled ? COLORS.disabled : active ? COLORS.primary : COLORS.primary | // Als `active` true is, blijft de kleur Primary |
| --- | --- |
| ] |  |
| ) |  |
| } | // |

| const bgColor = active ? COLORS.primary : COLORS.inputBackground |  |
| --- | --- |
| const textColor = active ? 'white' : COLORS.text |  |
| const borderColor = active ? COLORS.primary : COLORS.border |  |
| ] |  |
| ) |  |
| } | // |

// Aangepaste Heading2 voor React Native
const Heading2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.heading2}>{children}</Text>
); //

// Aangepaste BodyText voor React Native
const BodyText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.bodyText}>{children}</Text>
); //

// ====================================================================
// DESIGN MOLECULES (Aangepast voor React Native)
// ====================================================================

| title: string |  |
| --- | --- |
| currentStep: number |  |
| totalSteps: number |  |
| subtitle: string |  |

const FormHeader: React.FC<FormHeaderProps> = ({ title, currentStep, totalSteps, subtitle }) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>
      STAP {currentStep} VAN {totalSteps}
    </Text>
    <Heading2>{title}</Heading2>
    <BodyText>{subtitle}</BodyText>
  </View>
); //

| label: string |  |
| --- | --- |
| value: number |  |
| onChange: (value: number) => void |  |
| min?: number |  |
| max?: number |  |

| const decrement = () => onChange(Math.max(min, value - 1)) |  |
| --- | --- |
| onChange(value + 1) |  |
| } |  |

| const isMin = value <= min |  |
| --- | --- |
| const isMax = max !== undefined && value >= max |  |

| <TouchableOpacity onPress={decrement} disabled={isMin} style={[styles.stepperButton | { opacity: isMin ? 0.4 : 1 }]}> |
| --- | --- |
| <TouchableOpacity onPress={increment} disabled={isMax} style={[styles.stepperButton | { opacity: isMax ? 0.4 : 1 }]}> |

| question: string |  |
| --- | --- |
| value: boolean \| null | // null is voor onbeantwoord |
| onChange: (answer: boolean) => void | // Komt overeen met `onAnswer` in de vorige versie |
| required?: boolean |  |

const YNQuestionCard: React.FC<YNQuestionCardProps> = ({ question, value, onChange }) => (
  <View style={styles.cardContainer}>
    <Text style={styles.stepperLabel}>{question}</Text>
    <View style={styles.segmentedControlContainer}>
      {/* Gebruikt de PrimaryButton en SecondaryButton Atoms voor de implementatie */}
      <View style={{ flex: 1, marginRight: 8 }}>
        <PrimaryButton text="Ja" onPress={() => onChange(true)} active={value === true} fullWidth={true} />
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <SecondaryButton text="Nee" onPress={() => onChange(false)} active={value === false} fullWidth={true} />
      </View>
    </View>
  </View>
); //

// ====================================================================
// ORGANISM COMPONENT (HouseholdSetupOrganism)
// ====================================================================

| totalPersons: number |  |
| --- | --- |
| adults: number |  |
| children: number |  |
| details: Array<any> |  |
| hasPets: boolean \| null |  |

| totalPersons: 1 |  |
| --- | --- |
| adults: 1 |  |
| children: 0 |  |
| details: [] |  |
| hasPets: null |  |

| const [step | setStep] = useState(1); |
| --- | --- |
| const [householdState | setHouseholdState] = useState<HouseholdState>(INITIAL_STATE); |

| const updateState = useCallback(<K extends keyof HouseholdState>(key: K | value: HouseholdState[K]) => { |
| --- | --- |
| let newState = { ...prevState | [key]: value }; |

| const safeTotalPersons = Math.max(1 | newTotalPersons); // Minimaal 1 persoon |
| --- | --- |
| const safeAdults = Math.max(0 | newAdults); |

        // Voorkom adults > totalPersons. Set adults = totalPersons als dit gebeurt.
        const effectiveAdults = Math.min(safeAdults, safeTotalPersons);

        // Herbereken kinderen
        const newChildren = Math.max(0, safeTotalPersons - effectiveAdults);

        newState = { ...newState, totalPersons: safeTotalPersons, adults: effectiveAdults, children: newChildren };
      }

| return newState |  |
| --- | --- |
| }) |  |
| }, []) |  |

| const { totalPersons | adults } = householdState; |
| --- | --- |
| } | [householdState]); |

| return householdState.hasPets !== null | // Moet beantwoord zijn |
| --- | --- |
| }, [householdState]) |  |

| if (step === 1) return valid_1_1 |  |
| --- | --- |
| if (step === 2) return valid_1_2 |  |
| return false |  |
| }, [step, valid_1_1, valid_1_2]) |  |

| const prev = () => setStep(s => Math.max(1, s - 1)) |  |
| --- | --- |
| setStep(s => s + 1) |  |
| } |  |

| Alert.alert("Setup Voltooid", `Huishouden State: ${JSON.stringify(householdState, null, 2)}`) |  |
| --- | --- |
| } |  |

| subtitle="Geef het totale aantal personen in het huishouden op | en het aantal volwassenen (18+)." |
| --- | --- |
| onChange={(v) => updateState('totalPersons' | v)} |
| onChange={(v) => updateState('adults' | v)} |

| <View style={{ marginTop: 20 }}> | <View style={{ marginTop: 20 }}> |
| --- | --- |
| <BodyText> | <BodyText> |
| Afgeleid aantal kinderen: <Text style={{ fontWeight: 'bold' }}>{householdState.children}</Text> | Afgeleid aantal kinderen: <Text style={{ fontWeight: 'bold' }}>{householdState.children}</Text> |
| </BodyText> | </BodyText> |
| </View> | </View> |

| {/* Validatie feedback */} | {/* Validatie feedback */} |
| --- | --- |
| {!valid_1_1 && householdState.totalPersons >= 1 && ( | {!valid_1_1 && householdState.totalPersons >= 1 && ( |
| <Text style={styles.validationError}> | <Text style={styles.validationError}> |
| Fout: Aantal volwassenen mag niet groter zijn dan het totale aantal personen. | Fout: Aantal volwassenen mag niet groter zijn dan het totale aantal personen. |
| </Text> | </Text> |
| )} | )} |
| </View> | </View> |
| ); | ); |

| case 2: | case 2: |
| --- | --- |
| return ( | return ( |
| <View style={styles.stepContentContainer}> | <View style={styles.stepContentContainer}> |
| <FormHeader | <FormHeader |
| currentStep={2} | currentStep={2} |
| totalSteps={totalSteps} | totalSteps={totalSteps} |
| title="Huisdieren" | title="Huisdieren" |
| subtitle="Hebben jullie huisdieren in het huishouden?" | subtitle="Hebben jullie huisdieren in het huishouden?" |
| /> | /> |
| <YNQuestionCard | <YNQuestionCard |
| question="Heeft dit huishouden huisdieren?" | question="Heeft dit huishouden huisdieren?" |
| value={householdState.hasPets} | value={householdState.hasPets} |
| onChange={(v) => updateState('hasPets', v)} | onChange={(v) => updateState('hasPets', v)} |
| /> | /> |
| </View> | </View> |
| ); | ); |

| // Hier zou Stap 3 (Details, als per Superprompt) of de afronding komen. | // Hier zou Stap 3 (Details, als per Superprompt) of de afronding komen. |
| --- | --- |
| case 3: | case 3: |
| return ( | return ( |
| <View style={styles.stepContentContainer}> | <View style={styles.stepContentContainer}> |
| <FormHeader | <FormHeader |
| currentStep={totalSteps + 1} | currentStep={totalSteps + 1} |
| totalSteps={totalSteps + 1} | totalSteps={totalSteps + 1} |
| title="Setup Voltooid" | title="Setup Voltooid" |
| subtitle="Huishouden Setup is compleet (Stap 1.1 & 1.2)." | subtitle="Huishouden Setup is compleet (Stap 1.1 & 1.2)." |
| /> | /> |
| <BodyText> | <BodyText> |
| Alle verplichte basisvragen zijn beantwoord. U kunt nu het proces afronden. | Alle verplichte basisvragen zijn beantwoord. U kunt nu het proces afronden. |
| </BodyText> | </BodyText> |
| </View> | </View> |
| ); | ); |

| return <Text style={styles.validationError}>Onbekende stap: {step}</Text> |  |
| --- | --- |
| } |  |

| // RENDERING VAN FOOTER NAVIGATIE | // RENDERING VAN FOOTER NAVIGATIE |
| --- | --- |
| const renderFooter = () => ( | const renderFooter = () => ( |
| <View style={styles.footer}> | <View style={styles.footer}> |
| <SecondaryButton | <SecondaryButton |
| text="Vorige" | text="Vorige" |
| onPress={prev} | onPress={prev} |
| disabled={step === 1} | disabled={step === 1} |
| icon={<ChevronLeft size={18} color={COLORS.text} />} | icon={<ChevronLeft size={18} color={COLORS.text} />} |
| fullWidth={false} | fullWidth={false} |
| /> | /> |

| {step < totalSteps ? ( | {step < totalSteps ? ( |
| --- | --- |
| <PrimaryButton | <PrimaryButton |
| text="Volgende" | text="Volgende" |
| onPress={next} | onPress={next} |
| disabled={!canNext} | disabled={!canNext} |
| icon={<ChevronRight size={18} color="white" />} | icon={<ChevronRight size={18} color="white" />} |
| fullWidth={false} | fullWidth={false} |
| /> | /> |
| ) : ( | ) : ( |
| <PrimaryButton | <PrimaryButton |
| text="Voltooien" | text="Voltooien" |
| onPress={finishSetup} | onPress={finishSetup} |
| disabled={!canNext} | disabled={!canNext} |
| icon={<Check size={18} color="white" />} | icon={<Check size={18} color="white" />} |
| fullWidth={false} | fullWidth={false} |
| /> | /> |
| )} | )} |
| </View> | </View> |
| ); | ); |

| ) |  |
| --- | --- |
| } |  |

export default HouseholdSetupOrganism;
```

![TXT-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/plain)

![TXT-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/plain)

designAtoms
TXT
designMolecules
TXT

Pas deze atoms en molecules toe

Denkproces tonen

Dit is de bijgewerkte HouseholdSetupOrganism component, waarbij de logica van de vorige versie is geïntegreerd met een React Native-vertaling van de componenten uit en .

Omdat de Atoms en Molecules oorspronkelijk in web-specifieke syntax (div, h2, button, ) waren gedefinieerd, zijn ze hieronder vertaald naar hun functionele equivalenten in React Native (View, Text, , StyleSheet).

TypeScript

---

**User:**

| Testgeval | Input/Actie | Verwacht Resultaat |
| --- | --- | --- |
| Minimum Personen | Set "Totaal aantal personen" op 0. | De state dwingt de waarde terug naar 1. |
| Volwassenen > Totaal | Set "Totaal personen" op 2, dan "Aantal volwassenen" op 3. | De logica moet "Aantal volwassenen" limiteren tot 2. |
| Afgeleide Kinderen | Totaal = 5, Volwassenen = 2. | "Afgeleid aantal kinderen" moet 3 zijn. |
| Navigatie Disabled | Blijf op Stap 1.1, maar met ongeldige staat (bv. Volwassen > Totaal). | De knop "Volgende" moet disabled zijn. |
| Navigatie Validatie | Ga naar Stap 1.2. Selecteer geen optie voor Huisdieren. | De knop "Voltooien" (of "Volgende" als er meer stappen komen) moet disabled zijn. |
| Progressive Disclosure | Zet "Totaal personen" op 1, "Volwassenen" op 1 (Kinderen: 0). | De UI mag geen velden voor kinderen tonen in de volgende stappen (relevant voor de v2-implementatie in de changelog). |

| Wat u wilt bereiken | Taal om te gebruiken (voorbeeld) | Gerelateerde Code Termen |
| --- | --- | --- |
| Meer/Minder ruimte (verticaal) | "Verhoog de margin-bottom van de FormHeader naar 30px." / "Verminder de vertical padding van de HouseholdSetupOrganism container naar 16px." | paddingVertical, marginTop, marginBottom, gap |
| Meer/Minder ruimte (horizontaal) | "Voeg meer spacing toe tussen de knoppen in de YNQuestionCard." | marginRight, marginLeft, paddingHorizontal, flex: 1 |
| Element uitlijnen | "Lijn de tekst in de BodyText component uit naar het midden (textAlign: 'center')." | justifyContent, alignItems, textAlign |

```
HouseholdSetupOrganism_v2.txt
```

```
DesignMolecules.tsx
```

```
NumberStepper
```

```
HouseholdSetupOrganism
```

```
Superprompt
```

```
NumberStepper
```

```
NumberStepper
```

```
opacity: 0.4
```

```
YNQuestionCard
```

```
COLORS.primary
```

```
validationError
```

```
PrimaryButton
```

```
SecondaryButton
```

```
borderRadius
```

```
paddingVertical
```

```
COLORS.focusBorder
```

```
SecondaryButton
```

```
NumberStepper
```

```
NumberStepper
```

```
stepperValue
```

```
NumberStepper
```

```
styles.stepperButton
```

```
NumberStepper
```

```
alignItems: 'flex-start'
```

```
COLORS.primary
```

```
COLORS.lightText
```

```
progressBar
```

| - Responsiviteit: Test de component op een kleine smartphone (bv. iPhone SE) en een grote tablet (bv. iPad). De fullWidth knoppen moeten zich aanpassen aan de container | en de moet zijn lay-out behouden. |
| --- | --- |
| - Toegankelijkheid (A11y): Controleer of de knoppen een duidelijke focus-state krijgen bij gebruik (bijvoorbeeld via een fysiek toetsenbord of screenreader). In React Native is dit vaak de standaard | maar een visuele controle is belangrijk. |
| - Feedback: Controleer of de validatie foutmeldingen ( in de code | rood gekleurd) verschijnen en verdwijnen op het juiste moment (bv. direct nadat een onjuiste invoer wordt gedetecteerd). |

| Key | Value |
| --- | --- |
| disabled | De Primary/Secondary knoppen in de footer en de steppers moeten duidelijk een gedimde () stijl hebben. |
| active | De geselecteerde Ja/Nee-optie in de moet opvallen (gebruik van ). |

| - "Maak d | e van de knoppen scherper/ronder (bv. van 8 naar 4 of 12)." |
| --- | --- |
| - "Vergro | ot de van de knoppen, zodat ze hoger worden." |
| - "Gebrui | k als de randkleur bij de :active staat voor de ." |

| - "Verklein de fontSize van de waarde in de (de ) | van 36px naar 28px." |
| --- | --- |
| - "Lijn het label van de meer uit met de waarde controls | gebruik ." |

- "Wijzig de kleur van de stap-indicator ('STAP 1 VAN 2') van  naar ."
- "Maak de  dikker (height) of verhoog de gap tussen de segmenten."

![TSX-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/code)

![TXT-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/plain)

DesignMolecules
TSX
CHANGELOG_...rganism_v2
TXT

Lees en analyseer. Pas niks aan. Geef tips en trics om te testen en geef mij taal of woorden die ik kan gebruiken om jou dingen aan te laten passen in de code, om de layout perfect te krijgen

Allereerst, goed werk! U heeft nu zowel de basiscomponenten (Atoms/Molecules) als een geavanceerd changelog voor de volledige Organism-component (). De bevat een bruikbare React Native implementatie van de moleculen, inclusief een mooie voortgangsbalk in de FormHeader en duidelijke, grotere knoppen in de .

De analyse bevestigt dat de laatst geleverde code een goede basis is, maar nog uitgebreid moet worden naar de v2-specificatie uit het changelog (dynamische velden voor personen).

Hier zijn de tips voor testen en de taal om de layout aan te passen.

1. Tips & Tricks voor het Testen van de Component

Het testen van een stateful en progressieve component als de vereist aandacht voor zowel de UI/UX als de bedrijfslogica.

A. Logica & Functionele Testen (Bedrijfslogica)

Test de component op de grensgevallen die zijn afgeleid van de en de interne logica.

Exporteren naar Spreadsheets
B. UI/UX & Visuele Testen (Layout)

Focus op hoe de component eruitziet en aanvoelt op verschillende apparaten.

2. Taal en Woorden voor Layout Aanpassingen

Om de layout "perfect" te krijgen, kunt u de volgende taal en termen gebruiken bij het aanvragen van aanpassingen, waarbij u verwijst naar de specifieke Atoms en Molecules in de code.

A. Algemene Vormgeving & Spatiëring

Gebruik de volgende termen om afstanden en uitlijning te regelen:

Exporteren naar Spreadsheets
B. Aanpassingen per Component

Gebruik de exacte componentnaam en de specifieke eigenschap (prop/style):

/
FormHeader

Door deze specifieke terminologie te gebruiken, kan ik de code direct en nauwkeurig aanpassen op basis van uw visuele feedback.