# Lyra budget app phase 4 implementation - Claude

**Geëxporteerd:** 4-1-2026, 18:09:45
**Aantal berichten:** 79

---
**Claude:**

| Test Case | Stappen | Verwacht Resultaat |
| --- | --- | --- |
| TC-01: Standaard Weergave | Open TransactionInput scherm | - Bedragveld heeft focus- Datum = vandaag- Type = Uitgave- Categorieën zichtbaar- Opslaan knop disabled |
| TC-02: Bedrag Invoeren | Typ "12,50" in bedragveld | - Tekst verschijnt- Numerieke keyboard actief- € symbool zichtbaar |
| TC-03: Categorie Selecteren | Tap op "Eten & Drinken" chip | - Chip krijgt blauwe border en lichtblauwe achtergrond- Opslaan knop wordt enabled |
| TC-04: Type Toggle | Tap op "Inkomst" knop | - Knop wordt blauw- Header tekst verandert naar "Nieuwe Inkomst" |
| TC-05: Details Uitklappen | Tap op "Details toevoegen" | - Datum, subcategorie, beschrijving velden worden zichtbaar- Toggle tekst toont "▼" |
| TC-06: Touch Target Grootte | Gebruik accessibility inspector | - Alle knoppen/chips minimaal 48x48px |

| Test Case | Input | Verwacht Resultaat |
| --- | --- | --- |
| TV-01: Leeg Bedrag | Bedrag = "", Categorie = "Eten" | Opslaan knop disabled |
| TV-02: Nul Bedrag | Bedrag = "0", Categorie = "Eten" | Opslaan knop disabled |
| TV-03: Negatief Bedrag | Bedrag = "-10", Categorie = "Eten" | Tekst wordt gefilterd (alleen cijfers/komma toegestaan) |
| TV-04: Geen Categorie | Bedrag = "10", Categorie = "" | Opslaan knop disabled |
| TV-05: Valid Input | Bedrag = "25,50", Categorie = "Vervoer" | Opslaan knop enabled en groen |

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TN-01: Succesvolle POST | Webhook antwoordt 200 OK met correct JSON | - Groene toast "Opgeslagen"- Velden resetten- Details klappen dicht |
| TN-02: Netwerkfout | Geen internet / timeout | - Rode toast "Kon niet opslaan..."- Retry 1x automatisch- Bij tweede fout: toast blijft, data niet gewist |
| TN-03: Server Error (500) | Webhook geeft 500 terug | - Retry 1x- Rode toast bij tweede fout- Data behouden |
| TN-04: Verkeerde Response | Webhook geeft 200 maar geen JSON | - Catch block vangt parsing error- Rode toast met foutmelding |
| TN-05: CORS Preflight | OPTIONS request (indien web) | - Server moet 200 OK + CORS headers geven- Daarna volgt POST |

| Test Case | Methode | Verwacht Resultaat |
| --- | --- | --- |
| TA-01: Screen Reader | VoiceOver (iOS) / TalkBack (Android) | - Alle velden hebben duidelijke labels- Focus order: bedrag → categorie → details → opslaan |
| TA-02: Kleurcontrast | Contrast checker tool | - Tekst op achtergrond: minimaal 4.5:1- Grote tekst: minimaal 3:1 |
| TA-03: Keyboard Navigatie | Tab door velden (indien ondersteund) | - Logische volgorde- Focus indicatie zichtbaar |
| TA-04: Haptic Feedback | Tap op opslaan (succes/fout) | - Trillen voelbaar bij feedback (iOS/Android) |

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TE-01: Zeer Groot Bedrag | Bedrag = "999999,99" | - Invoer toegestaan- POST succesvol- Geen UI overflow |
| TE-02: Speciale Karakters | Bedrag = "12€50" of "12.50abc" | - Alleen "12,50" blijft over (filtering) |
| TE-03: Datum in Verleden | Datum = "2020-01-01" | - Toegestaan (gebruiker kan historische data invoeren) |
| TE-04: Snelle Dubbele Tap | Snel 2x op Opslaan tappen | - Loading spinner voorkomt tweede request- Button disabled tijdens saving |

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

```
accessibilityLabel
```

```
accessibilityHint
```

```
Haptics.impactAsync()
```

```
accessibilityLiveRegion="polite"
```

```
prefers-reduced-motion
```

```js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```ts
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```
subcategory
```

```
description
```

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

```yaml
Content-Type: application/json
```

```json
{ "status": "success", "message": "Transaction received." }
```

```
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```ts
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```
useColorScheme()
```

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```
USER_ID_PLACEHOLDER
```

```
WEBHOOK_URL_PLACEHOLDER
```

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

| - 2-Klik Quick Add: Bedrag + Categorie zijn de enige verplichte handelingen | andere velden krijgen slimme defaults (datum = vandaag, type = Uitgave, beschrijving optioneel). |
| --- | --- |
| - Offline Resilience: Eenvoudige retry-logica | toekomstige uitbreiding naar lokale queue. |

| - Snelle Acties: Grote knop "Uitgave Toevoegen" prominent aanwezig | secundaire knop "Inkomst Toevoegen". |
| --- | --- |
| - Recent Overzicht: Laatste 5 transacties in lijst (scroll voor meer) | tap voor details/bewerken. |

| Key | Value |
| --- | --- |
| Header | Maandnaam + jaar, avatar/instellingen icoon rechtsboven. |
| Risicomarge Card | Circular progress of horizontal bar, percentage + bedrag, subtitel "gebaseerd op je gemiddelde patroon". |
| Quick Action Buttons | Primaire (Uitgave), secundaire (Inkomst). |
| Transaction List | Card-based, swipe-to-delete/edit opties. |

- Risicomarge (meest urgent)
- Quick Actions (primaire taak)
- Recente transacties (context)

| Key | Value |
| --- | --- |
| Klik 1 | Gebruiker typt bedrag (numeriek keyboard verschijnt automatisch). |
| Klik 2 | Gebruiker selecteert categorie uit voorgestelde chips. |
| Automatisch opslaan | Direct na categorie-selectie, of expliciete "Opslaan" knop indien gebruiker meer wil invullen. |

| Key | Value |
| --- | --- |
| Scherm opent | Focus op bedragveld, keyboard actief, datum = vandaag (editeerbaar via klein kalenderpictogram). |
| Bedrag invoeren | Grote cijfers, komma/punt voor decimalen, valuta-hint (€). |
| Categorie kiezen | 6-8 meest gebruikte categorieën als grote chips (Eten, Vervoer, Boodschappen, etc.); "Meer..." optie voor volledig menu. |
| Optionele velden uitklappen | "Details toevoegen" knop ontvouwt subcategorie, beschrijving, type-toggle (default = Uitgave). |
| Opslaan | Groen vinkje + haptic feedback + toast "Uitgave opgeslagen". |

- Bedrag mag niet leeg of 0 zijn → disable "Opslaan" knop.
- Categorie vereist → visuele hint (grijs omlijning wordt blauw bij selectie).
- Netwerkfout → rode toast "Kon niet opslaan, probeer opnieuw" + retry-knop.

| Key | Value |
| --- | --- |
| Default | Bedrag leeg, categorie geen selectie, Type = Uitgave. |
| Typing | Bedragveld actief, keyboard zichtbaar. |
| Category Selected | Chip heeft accent-kleur, "Opslaan" knop enabled. |
| Saving | Loading spinner op knop, haptic feedback. |
| Success | Groene checkmark + toast, velden resetten. |
| Error | Rode toast met foutmelding + retry optie. |

| Key | Value |
| --- | --- |
| Primary Blue | #4A90E2 (accentkleur, knoppen, links) |
| Primary Dark | #2E5C8A (hover/pressed states) |

| - Background: #F8F9FA (licht grijs | kalm) |
| --- | --- |
| - Surface: #FFFFFF (cards | invoervelden) |

| Key | Value |
| --- | --- |
| Success | #5CB85C (groen, kalm, niet fel) |
| Warning | #F0AD4E (oranje, neutraal) |
| Error | #D9534F (rood, gedempd) |
| Info | #5BC0DE (lichtblauw) |

| - Text Primary: #2C3E50 (donkergrijs | hoog contrast) |
| --- | --- |
| - Text Secondary: #7F8C8D (lichtgrijs | subtiele info) |

- Van #4A90E2 (blauw, goed) naar #5CB85C (groen, veilig) voor positieve marge.

| Key | Value |
| --- | --- |
| Heading 1 | 28px, weight 700 (bold), line-height 1.2 (Dashboard titel) |
| Heading 2 | 22px, weight 600 (semi-bold), line-height 1.3 (Section headers) |
| Body | 16px, weight 400 (regular), line-height 1.5 (normale tekst) |
| Body Small | 14px, weight 400, line-height 1.4 (subtitels, hints) |
| Caption | 12px, weight 400, line-height 1.3 (timestamps, disclaimers) |
| Button Text | 16px, weight 600, line-height 1.2 (knoppen) |

| Key | Value |
| --- | --- |
| Minimale tekstgrootte 14px (12px alleen voor niet | essentiële info). |
| Contrast ratio minimaal 4.5 | 1 voor normale tekst, 3:1 voor grote tekst (WCAG AA). |

| Key | Value |
| --- | --- |
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| xxl | 48px |

| - Knoppen: min 48px hoog | volle breedte of min 120px breed. |
| --- | --- |
| - Chips: min 48px hoog | padding 16px horizontaal. |

| Key | Value |
| --- | --- |
| Default | Border 1px solid #E1E4E8, background #FFFFFF. |
| Hover (web | only): Border #4A90E2, background #F0F8FF (zeer licht blauw). |
| Pressed | Background #E6F2FF, slight scale down (0.98), haptic feedback. |
| Focused | Border 2px solid #4A90E2, outline for accessibility. |
| Disabled | Background #F8F9FA, text #BDC3C7, border #E1E4E8, opacity 0.6. |
| Error | Border 2px solid #D9534F, background #FFF5F5. |

- Gebruik native Ionicons (via Expo Vector Icons) of SF Symbols/Material Icons.
- Grootte: 24px (default), 20px (small), 32px (large).
- Kleur: matcht tekstkleur of accent.

| - Kleurcontrast: Alle tekst voldoet aan WCAG AA (4.5:1 voor body | 3:1 voor large text). |
| --- | --- |
| - Keyboard Types: Numerieke keyboard voor bedrag | default voor tekst. |
| - Focus Management: Autofocus op bedragveld bij scherm openen | reset focus na opslaan. |

| - : string (optioneel | lege string als niet ingevuld) |
| --- | --- |
| - : string (optioneel | lege string als niet ingevuld) |

- React Native fetch gebruikt native networking, geen browser CORS policies.
- Zorg dat de n8n webhook HTTPS gebruikt voor productie.

- Ho

- Respons moet  header hebben.
- Status 200 OK met JSON body:

| Key | Value |
| --- | --- |
| Netwerkfout (geen internet) | Catch block → rode toast "Geen internetverbinding". |
| Server error (500) | Response niet OK → retry 1x, dan foutmelding. |
| Validatiefout (400) | Parse response JSON voor specifieke foutmelding. |

| Key | Value |
| --- | --- |
| Bedrag veld | Label = "Bedrag", Placeholder = "0,00" |
| Categorie sectie | Label = "Categorie" |
| Subcategorie veld | Label = "Subcategorie", Placeholder = "Bijv. Brandstof, Lunch" |
| Beschrijving veld | Label = "Omschrijving", Placeholder = "Extra notities..." |
| Datum veld | Label = "Datum", Placeholder = "YYYY-MM-DD" |

| Key | Value |
| --- | --- |
| Primaire actie | "💾 Opslaan" |
| Type toggle | "Uitgave" / "Inkomst" |
| Details toggle | "▶ Details toevoegen (optioneel)" / "▼ Details toevoegen (optioneel)" |

- "Opgeslagen" (titel)
- "Je transactie is succesvol opgeslagen!" (body)

- "Validatiefout" (titel)
- "Voer een bedrag en categorie in." (body)

- "Fout bij opslaan" (titel)
- "Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw." (body)

- "Fout bij opslaan" (titel)
- "De server reageert niet correct. Probeer het later opnieuw." (body)

| Key | Value |
| --- | --- |
| Bedrag veld | "Voer het bedrag van de transactie in" |
| Categorie chip | "Selecteer categorie [naam]" |
| Opslaan knop | "Sla de transactie op in je budget" |
| Details toggle | "Toon of verberg extra velden" |

| Key | Value |
| --- | --- |
| Kalm | Geen alarm-taal, geen veroordelende woorden zoals "fout" of "verkeerd" (tenzij technische fout). |
| Motiverend | "Je transactie is opgeslagen" i.p.v. "Transactie opgeslagen". |
| Empathisch | "Controleer je internetverbinding" i.p.v. "Netwerkfout". |
| Helder | Korte zinnen, actieve taal, geen jargon. |

| Key | Value |
| --- | --- |
| Klik 1 | Gebruiker typt bedrag (keyboard verschijnt automatisch bij scherm openen, bedragveld heeft autofocus). |
| Klik 2 | Gebruiker selecteert categorie chip. |

- Minimale Cognitieve Belasting: Alleen de twee meest essentiële velden (bedrag + categorie) zijn verplicht. Andere velden (datum, subcategorie, beschrijving) zijn optioneel en verborgen achter "Details toevoegen".
- Slimme Defaults:

| - Snelle Invoer: Numerieke keyboard verschijnt direct | geen extra tap nodig om keyboard te activeren. |
| --- | --- |
| - Grote Touch Targets: Categorie chips zijn 48px hoog | makkelijk te raken zonder precisie. |
| - Visuele Affordance: Chips veranderen direct van kleur bij selectie | gebruiker ziet meteen dat de actie is geregistreerd. |

| Key | Value |
| --- | --- |
| Datum | Automatisch vandaag (99% van de transacties zijn vandaag). |
| Type | Default "Uitgave" (meeste transacties zijn uitgaven). |
| Beschrijving | Optioneel (niet iedereen wil notities toevoegen). |

- Na categorie-selectie kan de app automatisch opslaan zonder expliciete "Opslaan" knop, maar huidige ontwerp behoudt de knop voor controle en om onbedoelde opslag te voorkomen. Dit is een bewuste trade-off: 3 kliks (bedrag + categorie + opslaan) versus 2 kliks met auto-save risico.

- Leer meest gebruikte categorieën per tijdstip (bijv. "Eten & Drinken" rond lunchtijd) en toon die bovenaan.
- Voice input voor bedrag ("Siri, voeg €12,50 toe aan lunch").

- Lokale SQLite database (via Expo SQLite) om transacties te bufferen wanneer offline.
- Sync-logica: bij netwerk-terugkeer, batch-upload van gebufferde transacties.
- UI indicator: "3 transacties wachten op sync" badge.

- Analyseer gebruikersgedrag: welke categorieën worden het meest gebruikt?
- Toon top 6 categorieën bovenaan, rest in "Meer..." menu.
- Machine learning (optioneel): voorspel categorie op basis van bedrag/tijd/locatie.

| Key | Value |
| --- | --- |
| Toon mini | grafieken op Dashboard: uitgaven per categorie (taartgrafiek), trend over tijd (lijngrafiek). |
| Gebruik React Native Chart libraries (bijv. react | native-chart-kit) of D3.js wrapper. |
| Privacy | first: alle data blijft lokaal tot gebruiker expliciet sync naar cloud. |

- Implementeer  hook (RN/Expo) om systeemthema te detecteren.
- Definieer dark mode kleurenpalet:

| Key | Value |
| --- | --- |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |

| Key | Value |
| --- | --- |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |

- Gebruiker stelt maandbudget in per categorie.
- Push-notificatie (Expo Notifications) bij 80% budget bereikt: "Je hebt nog €50 over voor Eten & Drinken deze maand".
- Kalme toon: geen "WAARSCHUWING" of rood alarm, maar informatief bericht.

- "Terugkerende uitgave toevoegen" optie: huur, abonnementen, etc.
- Auto-fill elke maand op gespecificeerde datum.
- Reminder om te bevestigen (gebruiker kan skippen indien al betaald).

- Vervang  met echte UUID uit Supabase Auth.
- Vervang  met productie n8n webhook URL.
- Test in Expo Go app op iOS/Android.
- Valideer JSON payload in n8n webhook logs.
- Implementeer RLS policies in Supabase (indien nog niet gedaan).
- Deploy naar productie (Expo EAS Build voor standalone app).

### RecentsHide

### Lyra_prompt_fase_4_Claude.txt

# Lyra – Financiële Vrijheid Budget App: FASE 4 Opleverdocument

## 1. Executive Summary

## 2. UX/UI Flow & Wireframes

### 2.1 Dashboard (Analyse)

### 2.2 Dagelijkse Invoer (Quick Add)

## 3. Design System

### 3.1 Kleurenpalet

### 3.2 Typografie

### 3.3 Spacing & Component States

## 4. Accessibility Checklist

## 5. React Native (TypeScript) – TransactionInput Component

## 6. API Integratie & Payload

### 6.1 Voorbeeld JSON Payload

### 6.2 Voorbeeld Fetch Config

### 6.3 CORS Consideraties

## 7. Testplan

### 7.1 UI Tests (Handmatig)

### 7.2 Validatie Tests

### 7.3 Netwerk Tests

### 7.4 Accessibility Tests

### 7.5 Edge Cases

## 8. Copywriting (Microcopy)

### Labels & Placeholders

### Knoppen

### Feedback Meldingen

### Accessibility Hints

### Tone Principes

## 9. Toelichting 2-Klik Quick Add

### Hoe de UI 2-Klik Haalt

## 10. Toekomstige Uitbreidingen

### 10.1 Offline Queue Robuuster

### 10.2 Categorie-Leren (Frequentie)

### 10.3 Lokale Analytics

### 10.4 Themas (Light/Dark Mode)

### 10.5 Budgettering & Meldingen

### 10.6 Recurring Transactions

## BIJLAGE A: Voorbeeld Payload (Nederlands)

## BIJLAGE B: Voorbeeld Fetch (React Native TypeScript)

## EINDE FASE 4 OPLEVERDOCUMENT

New chatChatsProjectsArtifactsCodeAll chatsMManasseFree planLyra budget app phase 4 implementationShare143 linestxt29 nov 2025

Doel Fase 4: Implementatie van een stressarme, toegankelijke mobiele budget-app die gebruikers in staat stelt om financiële transacties met minimale cognitieve belasting in te voeren (2-klik Quick Add) en inzicht te krijgen via een kalm, actiegerichte Dashboard.
Kernbeslissingen:

User Journey:

Componenten:

Informatie Hiërarchie:

ASCII Wireframe:

2-Klik Flow:

Stappen Detail:

Foutpreventie:

States:

ASCII Wireframe:

Primaire Kleuren:

Secundaire & Achtergrond:

Feedback Kleuren:

Tekst:

Risicomarge Gradient (optioneel):

Font Family: System sans-serif (iOS: SF Pro, Android: Roboto).
Sizes & Weights:

Toegankelijkheid:

Spacing Scale (gebaseerd op 8px grid):

Touch Targets:

Component States:

Iconen:

typescript

json
Key Types:

typescript

Client-side (React Native):

| Key | Value |
| --- | --- |
| Server | side (n8n Webhook Response Headers): |
| Continue29 nov 2025hoewel RN geen CORS nodig heeft, voor web | compatibility (toekomstige PWA): |

Error Handling:

Success:

Validatiefout:

Netwerkfout:

Server Error:

Definitie "2 kliks":

Waarom dit stress verlaagt:

Alternatieve Flow (indien gewenst):

Toekomstige Optimalisatie:

Huidig: Eenvoudige retry (1x extra poging bij fout).
Toekomst:

Implementatie:
typescript

json

typescript

Status: Klaar voor implementatie in Expo Snack.
Volgende Stappen:

Contact: Voor vragen of aanpassingen, zie documentatie of open een issue in project repository.Claude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

### RecentsHide

ChatsProjectsArtifactsCodeAll chats

---

**Claude:**

ChatsProjectsArtifactsCode

---

**Claude:**

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

### RecentsHide

All chats

---

**Claude:**

Markdown bestanden combineren met PowerShell

---

**Claude:**

Verbeteringssuggestions gevraagd

---

**Claude:**

Scripts analyseren en verbeteringsadvies

---

**Claude:**

Scripts organiseren en opschonen

---

**Claude:**

Audit-script update en verbeterpunten analyseren

---

**Claude:**

Haakje of puntkomma zoeken in code

---

**Claude:**

Wat is dit?

---

**Claude:**

Protocol en documentenanalyse met validatie

---

**Claude:**

Flow 2 architect prompt evaluation

---

**Claude:**

Flow 6 analyse en optimalisatie

---

**Claude:**

CU-assembler prompt optimalisatie voor WAI-audit

---

**Claude:**

CU-assembler ultimate prompt ophalen

---

**Claude:**

Audit-script optimalisatie voor WAI-001 tot WAI-006

---

**Claude:**

Mappenstructuur aanmaken

---

**Claude:**

Prompt optimization en vergelijking PR2

---

**Claude:**

CSV service parsing and validation improvements

---

**Claude:**

Code analyse en verbeteringsadvies

---

**Claude:**

Identificatie bestanden voor theme-code integratie

---

**Claude:**

Untitled

---

**Claude:**

Resuming project development context

---

**Claude:**

Implementation plan development

---

**Claude:**

Dagelijkse invoer voor transactiebeheer

---

**Claude:**

Applying a specific diff

---

**Claude:**

Analyse, vergelijking en aanbevelingen

---

**Claude:**

React Native app wizard flow implementation

---

**Claude:**

Financial household management app architecture

---

**Claude:**

AI CTO initialization and project planning

---

**Claude:**

Mermaid chart van code

---

**Claude:**

All chats

---

**Claude:**

MManasseFree plan

---

**Claude:**

M

---

**Claude:**

ManasseFree plan

---

**Claude:**

| Test Case | Stappen | Verwacht Resultaat |
| --- | --- | --- |
| TC-01: Standaard Weergave | Open TransactionInput scherm | - Bedragveld heeft focus- Datum = vandaag- Type = Uitgave- Categorieën zichtbaar- Opslaan knop disabled |
| TC-02: Bedrag Invoeren | Typ "12,50" in bedragveld | - Tekst verschijnt- Numerieke keyboard actief- € symbool zichtbaar |
| TC-03: Categorie Selecteren | Tap op "Eten & Drinken" chip | - Chip krijgt blauwe border en lichtblauwe achtergrond- Opslaan knop wordt enabled |
| TC-04: Type Toggle | Tap op "Inkomst" knop | - Knop wordt blauw- Header tekst verandert naar "Nieuwe Inkomst" |
| TC-05: Details Uitklappen | Tap op "Details toevoegen" | - Datum, subcategorie, beschrijving velden worden zichtbaar- Toggle tekst toont "▼" |
| TC-06: Touch Target Grootte | Gebruik accessibility inspector | - Alle knoppen/chips minimaal 48x48px |

| Test Case | Input | Verwacht Resultaat |
| --- | --- | --- |
| TV-01: Leeg Bedrag | Bedrag = "", Categorie = "Eten" | Opslaan knop disabled |
| TV-02: Nul Bedrag | Bedrag = "0", Categorie = "Eten" | Opslaan knop disabled |
| TV-03: Negatief Bedrag | Bedrag = "-10", Categorie = "Eten" | Tekst wordt gefilterd (alleen cijfers/komma toegestaan) |
| TV-04: Geen Categorie | Bedrag = "10", Categorie = "" | Opslaan knop disabled |
| TV-05: Valid Input | Bedrag = "25,50", Categorie = "Vervoer" | Opslaan knop enabled en groen |

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TN-01: Succesvolle POST | Webhook antwoordt 200 OK met correct JSON | - Groene toast "Opgeslagen"- Velden resetten- Details klappen dicht |
| TN-02: Netwerkfout | Geen internet / timeout | - Rode toast "Kon niet opslaan..."- Retry 1x automatisch- Bij tweede fout: toast blijft, data niet gewist |
| TN-03: Server Error (500) | Webhook geeft 500 terug | - Retry 1x- Rode toast bij tweede fout- Data behouden |
| TN-04: Verkeerde Response | Webhook geeft 200 maar geen JSON | - Catch block vangt parsing error- Rode toast met foutmelding |
| TN-05: CORS Preflight | OPTIONS request (indien web) | - Server moet 200 OK + CORS headers geven- Daarna volgt POST |

| Test Case | Methode | Verwacht Resultaat |
| --- | --- | --- |
| TA-01: Screen Reader | VoiceOver (iOS) / TalkBack (Android) | - Alle velden hebben duidelijke labels- Focus order: bedrag → categorie → details → opslaan |
| TA-02: Kleurcontrast | Contrast checker tool | - Tekst op achtergrond: minimaal 4.5:1- Grote tekst: minimaal 3:1 |
| TA-03: Keyboard Navigatie | Tab door velden (indien ondersteund) | - Logische volgorde- Focus indicatie zichtbaar |
| TA-04: Haptic Feedback | Tap op opslaan (succes/fout) | - Trillen voelbaar bij feedback (iOS/Android) |

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TE-01: Zeer Groot Bedrag | Bedrag = "999999,99" | - Invoer toegestaan- POST succesvol- Geen UI overflow |
| TE-02: Speciale Karakters | Bedrag = "12€50" of "12.50abc" | - Alleen "12,50" blijft over (filtering) |
| TE-03: Datum in Verleden | Datum = "2020-01-01" | - Toegestaan (gebruiker kan historische data invoeren) |
| TE-04: Snelle Dubbele Tap | Snel 2x op Opslaan tappen | - Loading spinner voorkomt tweede request- Button disabled tijdens saving |

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

```
accessibilityLabel
```

```
accessibilityHint
```

```
Haptics.impactAsync()
```

```
accessibilityLiveRegion="polite"
```

```
prefers-reduced-motion
```

```js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```ts
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```
subcategory
```

```
description
```

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

```yaml
Content-Type: application/json
```

```json
{ "status": "success", "message": "Transaction received." }
```

```
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```ts
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```
useColorScheme()
```

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```
USER_ID_PLACEHOLDER
```

```
WEBHOOK_URL_PLACEHOLDER
```

| - 2-Klik Quick Add: Bedrag + Categorie zijn de enige verplichte handelingen | andere velden krijgen slimme defaults (datum = vandaag, type = Uitgave, beschrijving optioneel). |
| --- | --- |
| - Offline Resilience: Eenvoudige retry-logica | toekomstige uitbreiding naar lokale queue. |

| - Snelle Acties: Grote knop "Uitgave Toevoegen" prominent aanwezig | secundaire knop "Inkomst Toevoegen". |
| --- | --- |
| - Recent Overzicht: Laatste 5 transacties in lijst (scroll voor meer) | tap voor details/bewerken. |

| Key | Value |
| --- | --- |
| Header | Maandnaam + jaar, avatar/instellingen icoon rechtsboven. |
| Risicomarge Card | Circular progress of horizontal bar, percentage + bedrag, subtitel "gebaseerd op je gemiddelde patroon". |
| Quick Action Buttons | Primaire (Uitgave), secundaire (Inkomst). |
| Transaction List | Card-based, swipe-to-delete/edit opties. |

- Risicomarge (meest urgent)
- Quick Actions (primaire taak)
- Recente transacties (context)

| Key | Value |
| --- | --- |
| Klik 1 | Gebruiker typt bedrag (numeriek keyboard verschijnt automatisch). |
| Klik 2 | Gebruiker selecteert categorie uit voorgestelde chips. |
| Automatisch opslaan | Direct na categorie-selectie, of expliciete "Opslaan" knop indien gebruiker meer wil invullen. |

| Key | Value |
| --- | --- |
| Scherm opent | Focus op bedragveld, keyboard actief, datum = vandaag (editeerbaar via klein kalenderpictogram). |
| Bedrag invoeren | Grote cijfers, komma/punt voor decimalen, valuta-hint (€). |
| Categorie kiezen | 6-8 meest gebruikte categorieën als grote chips (Eten, Vervoer, Boodschappen, etc.); "Meer..." optie voor volledig menu. |
| Optionele velden uitklappen | "Details toevoegen" knop ontvouwt subcategorie, beschrijving, type-toggle (default = Uitgave). |
| Opslaan | Groen vinkje + haptic feedback + toast "Uitgave opgeslagen". |

- Bedrag mag niet leeg of 0 zijn → disable "Opslaan" knop.
- Categorie vereist → visuele hint (grijs omlijning wordt blauw bij selectie).
- Netwerkfout → rode toast "Kon niet opslaan, probeer opnieuw" + retry-knop.

| Key | Value |
| --- | --- |
| Default | Bedrag leeg, categorie geen selectie, Type = Uitgave. |
| Typing | Bedragveld actief, keyboard zichtbaar. |
| Category Selected | Chip heeft accent-kleur, "Opslaan" knop enabled. |
| Saving | Loading spinner op knop, haptic feedback. |
| Success | Groene checkmark + toast, velden resetten. |
| Error | Rode toast met foutmelding + retry optie. |

| Key | Value |
| --- | --- |
| Primary Blue | #4A90E2 (accentkleur, knoppen, links) |
| Primary Dark | #2E5C8A (hover/pressed states) |

| - Background: #F8F9FA (licht grijs | kalm) |
| --- | --- |
| - Surface: #FFFFFF (cards | invoervelden) |

| Key | Value |
| --- | --- |
| Success | #5CB85C (groen, kalm, niet fel) |
| Warning | #F0AD4E (oranje, neutraal) |
| Error | #D9534F (rood, gedempd) |
| Info | #5BC0DE (lichtblauw) |

| - Text Primary: #2C3E50 (donkergrijs | hoog contrast) |
| --- | --- |
| - Text Secondary: #7F8C8D (lichtgrijs | subtiele info) |

- Van #4A90E2 (blauw, goed) naar #5CB85C (groen, veilig) voor positieve marge.

| Key | Value |
| --- | --- |
| Heading 1 | 28px, weight 700 (bold), line-height 1.2 (Dashboard titel) |
| Heading 2 | 22px, weight 600 (semi-bold), line-height 1.3 (Section headers) |
| Body | 16px, weight 400 (regular), line-height 1.5 (normale tekst) |
| Body Small | 14px, weight 400, line-height 1.4 (subtitels, hints) |
| Caption | 12px, weight 400, line-height 1.3 (timestamps, disclaimers) |
| Button Text | 16px, weight 600, line-height 1.2 (knoppen) |

| Key | Value |
| --- | --- |
| Minimale tekstgrootte 14px (12px alleen voor niet | essentiële info). |
| Contrast ratio minimaal 4.5 | 1 voor normale tekst, 3:1 voor grote tekst (WCAG AA). |

| Key | Value |
| --- | --- |
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| xxl | 48px |

| - Knoppen: min 48px hoog | volle breedte of min 120px breed. |
| --- | --- |
| - Chips: min 48px hoog | padding 16px horizontaal. |

| Key | Value |
| --- | --- |
| Default | Border 1px solid #E1E4E8, background #FFFFFF. |
| Hover (web | only): Border #4A90E2, background #F0F8FF (zeer licht blauw). |
| Pressed | Background #E6F2FF, slight scale down (0.98), haptic feedback. |
| Focused | Border 2px solid #4A90E2, outline for accessibility. |
| Disabled | Background #F8F9FA, text #BDC3C7, border #E1E4E8, opacity 0.6. |
| Error | Border 2px solid #D9534F, background #FFF5F5. |

- Gebruik native Ionicons (via Expo Vector Icons) of SF Symbols/Material Icons.
- Grootte: 24px (default), 20px (small), 32px (large).
- Kleur: matcht tekstkleur of accent.

| - Kleurcontrast: Alle tekst voldoet aan WCAG AA (4.5:1 voor body | 3:1 voor large text). |
| --- | --- |
| - Keyboard Types: Numerieke keyboard voor bedrag | default voor tekst. |
| - Focus Management: Autofocus op bedragveld bij scherm openen | reset focus na opslaan. |

| - : string (optioneel | lege string als niet ingevuld) |
| --- | --- |
| - : string (optioneel | lege string als niet ingevuld) |

- React Native fetch gebruikt native networking, geen browser CORS policies.
- Zorg dat de n8n webhook HTTPS gebruikt voor productie.

- Ho

- Respons moet  header hebben.
- Status 200 OK met JSON body:

| Key | Value |
| --- | --- |
| Netwerkfout (geen internet) | Catch block → rode toast "Geen internetverbinding". |
| Server error (500) | Response niet OK → retry 1x, dan foutmelding. |
| Validatiefout (400) | Parse response JSON voor specifieke foutmelding. |

| Key | Value |
| --- | --- |
| Bedrag veld | Label = "Bedrag", Placeholder = "0,00" |
| Categorie sectie | Label = "Categorie" |
| Subcategorie veld | Label = "Subcategorie", Placeholder = "Bijv. Brandstof, Lunch" |
| Beschrijving veld | Label = "Omschrijving", Placeholder = "Extra notities..." |
| Datum veld | Label = "Datum", Placeholder = "YYYY-MM-DD" |

| Key | Value |
| --- | --- |
| Primaire actie | "💾 Opslaan" |
| Type toggle | "Uitgave" / "Inkomst" |
| Details toggle | "▶ Details toevoegen (optioneel)" / "▼ Details toevoegen (optioneel)" |

- "Opgeslagen" (titel)
- "Je transactie is succesvol opgeslagen!" (body)

- "Validatiefout" (titel)
- "Voer een bedrag en categorie in." (body)

- "Fout bij opslaan" (titel)
- "Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw." (body)

- "Fout bij opslaan" (titel)
- "De server reageert niet correct. Probeer het later opnieuw." (body)

| Key | Value |
| --- | --- |
| Bedrag veld | "Voer het bedrag van de transactie in" |
| Categorie chip | "Selecteer categorie [naam]" |
| Opslaan knop | "Sla de transactie op in je budget" |
| Details toggle | "Toon of verberg extra velden" |

| Key | Value |
| --- | --- |
| Kalm | Geen alarm-taal, geen veroordelende woorden zoals "fout" of "verkeerd" (tenzij technische fout). |
| Motiverend | "Je transactie is opgeslagen" i.p.v. "Transactie opgeslagen". |
| Empathisch | "Controleer je internetverbinding" i.p.v. "Netwerkfout". |
| Helder | Korte zinnen, actieve taal, geen jargon. |

| Key | Value |
| --- | --- |
| Klik 1 | Gebruiker typt bedrag (keyboard verschijnt automatisch bij scherm openen, bedragveld heeft autofocus). |
| Klik 2 | Gebruiker selecteert categorie chip. |

- Minimale Cognitieve Belasting: Alleen de twee meest essentiële velden (bedrag + categorie) zijn verplicht. Andere velden (datum, subcategorie, beschrijving) zijn optioneel en verborgen achter "Details toevoegen".
- Slimme Defaults:

| - Snelle Invoer: Numerieke keyboard verschijnt direct | geen extra tap nodig om keyboard te activeren. |
| --- | --- |
| - Grote Touch Targets: Categorie chips zijn 48px hoog | makkelijk te raken zonder precisie. |
| - Visuele Affordance: Chips veranderen direct van kleur bij selectie | gebruiker ziet meteen dat de actie is geregistreerd. |

| Key | Value |
| --- | --- |
| Datum | Automatisch vandaag (99% van de transacties zijn vandaag). |
| Type | Default "Uitgave" (meeste transacties zijn uitgaven). |
| Beschrijving | Optioneel (niet iedereen wil notities toevoegen). |

- Na categorie-selectie kan de app automatisch opslaan zonder expliciete "Opslaan" knop, maar huidige ontwerp behoudt de knop voor controle en om onbedoelde opslag te voorkomen. Dit is een bewuste trade-off: 3 kliks (bedrag + categorie + opslaan) versus 2 kliks met auto-save risico.

- Leer meest gebruikte categorieën per tijdstip (bijv. "Eten & Drinken" rond lunchtijd) en toon die bovenaan.
- Voice input voor bedrag ("Siri, voeg €12,50 toe aan lunch").

- Lokale SQLite database (via Expo SQLite) om transacties te bufferen wanneer offline.
- Sync-logica: bij netwerk-terugkeer, batch-upload van gebufferde transacties.
- UI indicator: "3 transacties wachten op sync" badge.

- Analyseer gebruikersgedrag: welke categorieën worden het meest gebruikt?
- Toon top 6 categorieën bovenaan, rest in "Meer..." menu.
- Machine learning (optioneel): voorspel categorie op basis van bedrag/tijd/locatie.

| Key | Value |
| --- | --- |
| Toon mini | grafieken op Dashboard: uitgaven per categorie (taartgrafiek), trend over tijd (lijngrafiek). |
| Gebruik React Native Chart libraries (bijv. react | native-chart-kit) of D3.js wrapper. |
| Privacy | first: alle data blijft lokaal tot gebruiker expliciet sync naar cloud. |

- Implementeer  hook (RN/Expo) om systeemthema te detecteren.
- Definieer dark mode kleurenpalet:

| Key | Value |
| --- | --- |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |

| Key | Value |
| --- | --- |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |

- Gebruiker stelt maandbudget in per categorie.
- Push-notificatie (Expo Notifications) bij 80% budget bereikt: "Je hebt nog €50 over voor Eten & Drinken deze maand".
- Kalme toon: geen "WAARSCHUWING" of rood alarm, maar informatief bericht.

- "Terugkerende uitgave toevoegen" optie: huur, abonnementen, etc.
- Auto-fill elke maand op gespecificeerde datum.
- Reminder om te bevestigen (gebruiker kan skippen indien al betaald).

- Vervang  met echte UUID uit Supabase Auth.
- Vervang  met productie n8n webhook URL.
- Test in Expo Go app op iOS/Android.
- Valideer JSON payload in n8n webhook logs.
- Implementeer RLS policies in Supabase (indien nog niet gedaan).
- Deploy naar productie (Expo EAS Build voor standalone app).

### Lyra_prompt_fase_4_Claude.txt

# Lyra – Financiële Vrijheid Budget App: FASE 4 Opleverdocument

## 1. Executive Summary

## 2. UX/UI Flow & Wireframes

### 2.1 Dashboard (Analyse)

### 2.2 Dagelijkse Invoer (Quick Add)

## 3. Design System

### 3.1 Kleurenpalet

### 3.2 Typografie

### 3.3 Spacing & Component States

## 4. Accessibility Checklist

## 5. React Native (TypeScript) – TransactionInput Component

## 6. API Integratie & Payload

### 6.1 Voorbeeld JSON Payload

### 6.2 Voorbeeld Fetch Config

### 6.3 CORS Consideraties

## 7. Testplan

### 7.1 UI Tests (Handmatig)

### 7.2 Validatie Tests

### 7.3 Netwerk Tests

### 7.4 Accessibility Tests

### 7.5 Edge Cases

## 8. Copywriting (Microcopy)

### Labels & Placeholders

### Knoppen

### Feedback Meldingen

### Accessibility Hints

### Tone Principes

## 9. Toelichting 2-Klik Quick Add

### Hoe de UI 2-Klik Haalt

## 10. Toekomstige Uitbreidingen

### 10.1 Offline Queue Robuuster

### 10.2 Categorie-Leren (Frequentie)

### 10.3 Lokale Analytics

### 10.4 Themas (Light/Dark Mode)

### 10.5 Budgettering & Meldingen

### 10.6 Recurring Transactions

## BIJLAGE A: Voorbeeld Payload (Nederlands)

## BIJLAGE B: Voorbeeld Fetch (React Native TypeScript)

## EINDE FASE 4 OPLEVERDOCUMENT

Lyra budget app phase 4 implementationShare143 linestxt29 nov 2025

Doel Fase 4: Implementatie van een stressarme, toegankelijke mobiele budget-app die gebruikers in staat stelt om financiële transacties met minimale cognitieve belasting in te voeren (2-klik Quick Add) en inzicht te krijgen via een kalm, actiegerichte Dashboard.
Kernbeslissingen:

User Journey:

Componenten:

Informatie Hiërarchie:

ASCII Wireframe:

2-Klik Flow:

Stappen Detail:

Foutpreventie:

States:

ASCII Wireframe:

Primaire Kleuren:

Secundaire & Achtergrond:

Feedback Kleuren:

Tekst:

Risicomarge Gradient (optioneel):

Font Family: System sans-serif (iOS: SF Pro, Android: Roboto).
Sizes & Weights:

Toegankelijkheid:

Spacing Scale (gebaseerd op 8px grid):

Touch Targets:

Component States:

Iconen:

typescript

json
Key Types:

typescript

Client-side (React Native):

| Key | Value |
| --- | --- |
| Server | side (n8n Webhook Response Headers): |
| Continue29 nov 2025hoewel RN geen CORS nodig heeft, voor web | compatibility (toekomstige PWA): |

Error Handling:

Success:

Validatiefout:

Netwerkfout:

Server Error:

Definitie "2 kliks":

Waarom dit stress verlaagt:

Alternatieve Flow (indien gewenst):

Toekomstige Optimalisatie:

Huidig: Eenvoudige retry (1x extra poging bij fout).
Toekomst:

Implementatie:
typescript

json

typescript

Status: Klaar voor implementatie in Expo Snack.
Volgende Stappen:

Contact: Voor vragen of aanpassingen, zie documentatie of open een issue in project repository.Claude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Lyra budget app phase 4 implementationShare

---

**Claude:**

Lyra budget app phase 4 implementation

---

**Claude:**

Share

---

**Claude:**

| Test Case | Stappen | Verwacht Resultaat |
| --- | --- | --- |
| TC-01: Standaard Weergave | Open TransactionInput scherm | - Bedragveld heeft focus- Datum = vandaag- Type = Uitgave- Categorieën zichtbaar- Opslaan knop disabled |
| TC-02: Bedrag Invoeren | Typ "12,50" in bedragveld | - Tekst verschijnt- Numerieke keyboard actief- € symbool zichtbaar |
| TC-03: Categorie Selecteren | Tap op "Eten & Drinken" chip | - Chip krijgt blauwe border en lichtblauwe achtergrond- Opslaan knop wordt enabled |
| TC-04: Type Toggle | Tap op "Inkomst" knop | - Knop wordt blauw- Header tekst verandert naar "Nieuwe Inkomst" |
| TC-05: Details Uitklappen | Tap op "Details toevoegen" | - Datum, subcategorie, beschrijving velden worden zichtbaar- Toggle tekst toont "▼" |
| TC-06: Touch Target Grootte | Gebruik accessibility inspector | - Alle knoppen/chips minimaal 48x48px |

| Test Case | Input | Verwacht Resultaat |
| --- | --- | --- |
| TV-01: Leeg Bedrag | Bedrag = "", Categorie = "Eten" | Opslaan knop disabled |
| TV-02: Nul Bedrag | Bedrag = "0", Categorie = "Eten" | Opslaan knop disabled |
| TV-03: Negatief Bedrag | Bedrag = "-10", Categorie = "Eten" | Tekst wordt gefilterd (alleen cijfers/komma toegestaan) |
| TV-04: Geen Categorie | Bedrag = "10", Categorie = "" | Opslaan knop disabled |
| TV-05: Valid Input | Bedrag = "25,50", Categorie = "Vervoer" | Opslaan knop enabled en groen |

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TN-01: Succesvolle POST | Webhook antwoordt 200 OK met correct JSON | - Groene toast "Opgeslagen"- Velden resetten- Details klappen dicht |
| TN-02: Netwerkfout | Geen internet / timeout | - Rode toast "Kon niet opslaan..."- Retry 1x automatisch- Bij tweede fout: toast blijft, data niet gewist |
| TN-03: Server Error (500) | Webhook geeft 500 terug | - Retry 1x- Rode toast bij tweede fout- Data behouden |
| TN-04: Verkeerde Response | Webhook geeft 200 maar geen JSON | - Catch block vangt parsing error- Rode toast met foutmelding |
| TN-05: CORS Preflight | OPTIONS request (indien web) | - Server moet 200 OK + CORS headers geven- Daarna volgt POST |

| Test Case | Methode | Verwacht Resultaat |
| --- | --- | --- |
| TA-01: Screen Reader | VoiceOver (iOS) / TalkBack (Android) | - Alle velden hebben duidelijke labels- Focus order: bedrag → categorie → details → opslaan |
| TA-02: Kleurcontrast | Contrast checker tool | - Tekst op achtergrond: minimaal 4.5:1- Grote tekst: minimaal 3:1 |
| TA-03: Keyboard Navigatie | Tab door velden (indien ondersteund) | - Logische volgorde- Focus indicatie zichtbaar |
| TA-04: Haptic Feedback | Tap op opslaan (succes/fout) | - Trillen voelbaar bij feedback (iOS/Android) |

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TE-01: Zeer Groot Bedrag | Bedrag = "999999,99" | - Invoer toegestaan- POST succesvol- Geen UI overflow |
| TE-02: Speciale Karakters | Bedrag = "12€50" of "12.50abc" | - Alleen "12,50" blijft over (filtering) |
| TE-03: Datum in Verleden | Datum = "2020-01-01" | - Toegestaan (gebruiker kan historische data invoeren) |
| TE-04: Snelle Dubbele Tap | Snel 2x op Opslaan tappen | - Loading spinner voorkomt tweede request- Button disabled tijdens saving |

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

```
accessibilityLabel
```

```
accessibilityHint
```

```
Haptics.impactAsync()
```

```
accessibilityLiveRegion="polite"
```

```
prefers-reduced-motion
```

```js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```ts
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```
subcategory
```

```
description
```

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

```yaml
Content-Type: application/json
```

```json
{ "status": "success", "message": "Transaction received." }
```

```
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```ts
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```
useColorScheme()
```

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```
USER_ID_PLACEHOLDER
```

```
WEBHOOK_URL_PLACEHOLDER
```

| - 2-Klik Quick Add: Bedrag + Categorie zijn de enige verplichte handelingen | andere velden krijgen slimme defaults (datum = vandaag, type = Uitgave, beschrijving optioneel). |
| --- | --- |
| - Offline Resilience: Eenvoudige retry-logica | toekomstige uitbreiding naar lokale queue. |

| - Snelle Acties: Grote knop "Uitgave Toevoegen" prominent aanwezig | secundaire knop "Inkomst Toevoegen". |
| --- | --- |
| - Recent Overzicht: Laatste 5 transacties in lijst (scroll voor meer) | tap voor details/bewerken. |

| Key | Value |
| --- | --- |
| Header | Maandnaam + jaar, avatar/instellingen icoon rechtsboven. |
| Risicomarge Card | Circular progress of horizontal bar, percentage + bedrag, subtitel "gebaseerd op je gemiddelde patroon". |
| Quick Action Buttons | Primaire (Uitgave), secundaire (Inkomst). |
| Transaction List | Card-based, swipe-to-delete/edit opties. |

- Risicomarge (meest urgent)
- Quick Actions (primaire taak)
- Recente transacties (context)

| Key | Value |
| --- | --- |
| Klik 1 | Gebruiker typt bedrag (numeriek keyboard verschijnt automatisch). |
| Klik 2 | Gebruiker selecteert categorie uit voorgestelde chips. |
| Automatisch opslaan | Direct na categorie-selectie, of expliciete "Opslaan" knop indien gebruiker meer wil invullen. |

| Key | Value |
| --- | --- |
| Scherm opent | Focus op bedragveld, keyboard actief, datum = vandaag (editeerbaar via klein kalenderpictogram). |
| Bedrag invoeren | Grote cijfers, komma/punt voor decimalen, valuta-hint (€). |
| Categorie kiezen | 6-8 meest gebruikte categorieën als grote chips (Eten, Vervoer, Boodschappen, etc.); "Meer..." optie voor volledig menu. |
| Optionele velden uitklappen | "Details toevoegen" knop ontvouwt subcategorie, beschrijving, type-toggle (default = Uitgave). |
| Opslaan | Groen vinkje + haptic feedback + toast "Uitgave opgeslagen". |

- Bedrag mag niet leeg of 0 zijn → disable "Opslaan" knop.
- Categorie vereist → visuele hint (grijs omlijning wordt blauw bij selectie).
- Netwerkfout → rode toast "Kon niet opslaan, probeer opnieuw" + retry-knop.

| Key | Value |
| --- | --- |
| Default | Bedrag leeg, categorie geen selectie, Type = Uitgave. |
| Typing | Bedragveld actief, keyboard zichtbaar. |
| Category Selected | Chip heeft accent-kleur, "Opslaan" knop enabled. |
| Saving | Loading spinner op knop, haptic feedback. |
| Success | Groene checkmark + toast, velden resetten. |
| Error | Rode toast met foutmelding + retry optie. |

| Key | Value |
| --- | --- |
| Primary Blue | #4A90E2 (accentkleur, knoppen, links) |
| Primary Dark | #2E5C8A (hover/pressed states) |

| - Background: #F8F9FA (licht grijs | kalm) |
| --- | --- |
| - Surface: #FFFFFF (cards | invoervelden) |

| Key | Value |
| --- | --- |
| Success | #5CB85C (groen, kalm, niet fel) |
| Warning | #F0AD4E (oranje, neutraal) |
| Error | #D9534F (rood, gedempd) |
| Info | #5BC0DE (lichtblauw) |

| - Text Primary: #2C3E50 (donkergrijs | hoog contrast) |
| --- | --- |
| - Text Secondary: #7F8C8D (lichtgrijs | subtiele info) |

- Van #4A90E2 (blauw, goed) naar #5CB85C (groen, veilig) voor positieve marge.

| Key | Value |
| --- | --- |
| Heading 1 | 28px, weight 700 (bold), line-height 1.2 (Dashboard titel) |
| Heading 2 | 22px, weight 600 (semi-bold), line-height 1.3 (Section headers) |
| Body | 16px, weight 400 (regular), line-height 1.5 (normale tekst) |
| Body Small | 14px, weight 400, line-height 1.4 (subtitels, hints) |
| Caption | 12px, weight 400, line-height 1.3 (timestamps, disclaimers) |
| Button Text | 16px, weight 600, line-height 1.2 (knoppen) |

| Key | Value |
| --- | --- |
| Minimale tekstgrootte 14px (12px alleen voor niet | essentiële info). |
| Contrast ratio minimaal 4.5 | 1 voor normale tekst, 3:1 voor grote tekst (WCAG AA). |

| Key | Value |
| --- | --- |
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| xxl | 48px |

| - Knoppen: min 48px hoog | volle breedte of min 120px breed. |
| --- | --- |
| - Chips: min 48px hoog | padding 16px horizontaal. |

| Key | Value |
| --- | --- |
| Default | Border 1px solid #E1E4E8, background #FFFFFF. |
| Hover (web | only): Border #4A90E2, background #F0F8FF (zeer licht blauw). |
| Pressed | Background #E6F2FF, slight scale down (0.98), haptic feedback. |
| Focused | Border 2px solid #4A90E2, outline for accessibility. |
| Disabled | Background #F8F9FA, text #BDC3C7, border #E1E4E8, opacity 0.6. |
| Error | Border 2px solid #D9534F, background #FFF5F5. |

- Gebruik native Ionicons (via Expo Vector Icons) of SF Symbols/Material Icons.
- Grootte: 24px (default), 20px (small), 32px (large).
- Kleur: matcht tekstkleur of accent.

| - Kleurcontrast: Alle tekst voldoet aan WCAG AA (4.5:1 voor body | 3:1 voor large text). |
| --- | --- |
| - Keyboard Types: Numerieke keyboard voor bedrag | default voor tekst. |
| - Focus Management: Autofocus op bedragveld bij scherm openen | reset focus na opslaan. |

| - : string (optioneel | lege string als niet ingevuld) |
| --- | --- |
| - : string (optioneel | lege string als niet ingevuld) |

- React Native fetch gebruikt native networking, geen browser CORS policies.
- Zorg dat de n8n webhook HTTPS gebruikt voor productie.

- Ho

- Respons moet  header hebben.
- Status 200 OK met JSON body:

| Key | Value |
| --- | --- |
| Netwerkfout (geen internet) | Catch block → rode toast "Geen internetverbinding". |
| Server error (500) | Response niet OK → retry 1x, dan foutmelding. |
| Validatiefout (400) | Parse response JSON voor specifieke foutmelding. |

| Key | Value |
| --- | --- |
| Bedrag veld | Label = "Bedrag", Placeholder = "0,00" |
| Categorie sectie | Label = "Categorie" |
| Subcategorie veld | Label = "Subcategorie", Placeholder = "Bijv. Brandstof, Lunch" |
| Beschrijving veld | Label = "Omschrijving", Placeholder = "Extra notities..." |
| Datum veld | Label = "Datum", Placeholder = "YYYY-MM-DD" |

| Key | Value |
| --- | --- |
| Primaire actie | "💾 Opslaan" |
| Type toggle | "Uitgave" / "Inkomst" |
| Details toggle | "▶ Details toevoegen (optioneel)" / "▼ Details toevoegen (optioneel)" |

- "Opgeslagen" (titel)
- "Je transactie is succesvol opgeslagen!" (body)

- "Validatiefout" (titel)
- "Voer een bedrag en categorie in." (body)

- "Fout bij opslaan" (titel)
- "Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw." (body)

- "Fout bij opslaan" (titel)
- "De server reageert niet correct. Probeer het later opnieuw." (body)

| Key | Value |
| --- | --- |
| Bedrag veld | "Voer het bedrag van de transactie in" |
| Categorie chip | "Selecteer categorie [naam]" |
| Opslaan knop | "Sla de transactie op in je budget" |
| Details toggle | "Toon of verberg extra velden" |

| Key | Value |
| --- | --- |
| Kalm | Geen alarm-taal, geen veroordelende woorden zoals "fout" of "verkeerd" (tenzij technische fout). |
| Motiverend | "Je transactie is opgeslagen" i.p.v. "Transactie opgeslagen". |
| Empathisch | "Controleer je internetverbinding" i.p.v. "Netwerkfout". |
| Helder | Korte zinnen, actieve taal, geen jargon. |

| Key | Value |
| --- | --- |
| Klik 1 | Gebruiker typt bedrag (keyboard verschijnt automatisch bij scherm openen, bedragveld heeft autofocus). |
| Klik 2 | Gebruiker selecteert categorie chip. |

- Minimale Cognitieve Belasting: Alleen de twee meest essentiële velden (bedrag + categorie) zijn verplicht. Andere velden (datum, subcategorie, beschrijving) zijn optioneel en verborgen achter "Details toevoegen".
- Slimme Defaults:

| - Snelle Invoer: Numerieke keyboard verschijnt direct | geen extra tap nodig om keyboard te activeren. |
| --- | --- |
| - Grote Touch Targets: Categorie chips zijn 48px hoog | makkelijk te raken zonder precisie. |
| - Visuele Affordance: Chips veranderen direct van kleur bij selectie | gebruiker ziet meteen dat de actie is geregistreerd. |

| Key | Value |
| --- | --- |
| Datum | Automatisch vandaag (99% van de transacties zijn vandaag). |
| Type | Default "Uitgave" (meeste transacties zijn uitgaven). |
| Beschrijving | Optioneel (niet iedereen wil notities toevoegen). |

- Na categorie-selectie kan de app automatisch opslaan zonder expliciete "Opslaan" knop, maar huidige ontwerp behoudt de knop voor controle en om onbedoelde opslag te voorkomen. Dit is een bewuste trade-off: 3 kliks (bedrag + categorie + opslaan) versus 2 kliks met auto-save risico.

- Leer meest gebruikte categorieën per tijdstip (bijv. "Eten & Drinken" rond lunchtijd) en toon die bovenaan.
- Voice input voor bedrag ("Siri, voeg €12,50 toe aan lunch").

- Lokale SQLite database (via Expo SQLite) om transacties te bufferen wanneer offline.
- Sync-logica: bij netwerk-terugkeer, batch-upload van gebufferde transacties.
- UI indicator: "3 transacties wachten op sync" badge.

- Analyseer gebruikersgedrag: welke categorieën worden het meest gebruikt?
- Toon top 6 categorieën bovenaan, rest in "Meer..." menu.
- Machine learning (optioneel): voorspel categorie op basis van bedrag/tijd/locatie.

| Key | Value |
| --- | --- |
| Toon mini | grafieken op Dashboard: uitgaven per categorie (taartgrafiek), trend over tijd (lijngrafiek). |
| Gebruik React Native Chart libraries (bijv. react | native-chart-kit) of D3.js wrapper. |
| Privacy | first: alle data blijft lokaal tot gebruiker expliciet sync naar cloud. |

- Implementeer  hook (RN/Expo) om systeemthema te detecteren.
- Definieer dark mode kleurenpalet:

| Key | Value |
| --- | --- |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |

| Key | Value |
| --- | --- |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |

- Gebruiker stelt maandbudget in per categorie.
- Push-notificatie (Expo Notifications) bij 80% budget bereikt: "Je hebt nog €50 over voor Eten & Drinken deze maand".
- Kalme toon: geen "WAARSCHUWING" of rood alarm, maar informatief bericht.

- "Terugkerende uitgave toevoegen" optie: huur, abonnementen, etc.
- Auto-fill elke maand op gespecificeerde datum.
- Reminder om te bevestigen (gebruiker kan skippen indien al betaald).

- Vervang  met echte UUID uit Supabase Auth.
- Vervang  met productie n8n webhook URL.
- Test in Expo Go app op iOS/Android.
- Valideer JSON payload in n8n webhook logs.
- Implementeer RLS policies in Supabase (indien nog niet gedaan).
- Deploy naar productie (Expo EAS Build voor standalone app).

### Lyra_prompt_fase_4_Claude.txt

# Lyra – Financiële Vrijheid Budget App: FASE 4 Opleverdocument

## 1. Executive Summary

## 2. UX/UI Flow & Wireframes

### 2.1 Dashboard (Analyse)

### 2.2 Dagelijkse Invoer (Quick Add)

## 3. Design System

### 3.1 Kleurenpalet

### 3.2 Typografie

### 3.3 Spacing & Component States

## 4. Accessibility Checklist

## 5. React Native (TypeScript) – TransactionInput Component

## 6. API Integratie & Payload

### 6.1 Voorbeeld JSON Payload

### 6.2 Voorbeeld Fetch Config

### 6.3 CORS Consideraties

## 7. Testplan

### 7.1 UI Tests (Handmatig)

### 7.2 Validatie Tests

### 7.3 Netwerk Tests

### 7.4 Accessibility Tests

### 7.5 Edge Cases

## 8. Copywriting (Microcopy)

### Labels & Placeholders

### Knoppen

### Feedback Meldingen

### Accessibility Hints

### Tone Principes

## 9. Toelichting 2-Klik Quick Add

### Hoe de UI 2-Klik Haalt

## 10. Toekomstige Uitbreidingen

### 10.1 Offline Queue Robuuster

### 10.2 Categorie-Leren (Frequentie)

### 10.3 Lokale Analytics

### 10.4 Themas (Light/Dark Mode)

### 10.5 Budgettering & Meldingen

### 10.6 Recurring Transactions

## BIJLAGE A: Voorbeeld Payload (Nederlands)

## BIJLAGE B: Voorbeeld Fetch (React Native TypeScript)

## EINDE FASE 4 OPLEVERDOCUMENT

143 linestxt29 nov 2025

Doel Fase 4: Implementatie van een stressarme, toegankelijke mobiele budget-app die gebruikers in staat stelt om financiële transacties met minimale cognitieve belasting in te voeren (2-klik Quick Add) en inzicht te krijgen via een kalm, actiegerichte Dashboard.
Kernbeslissingen:

User Journey:

Componenten:

Informatie Hiërarchie:

ASCII Wireframe:

2-Klik Flow:

Stappen Detail:

Foutpreventie:

States:

ASCII Wireframe:

Primaire Kleuren:

Secundaire & Achtergrond:

Feedback Kleuren:

Tekst:

Risicomarge Gradient (optioneel):

Font Family: System sans-serif (iOS: SF Pro, Android: Roboto).
Sizes & Weights:

Toegankelijkheid:

Spacing Scale (gebaseerd op 8px grid):

Touch Targets:

Component States:

Iconen:

typescript

json
Key Types:

typescript

Client-side (React Native):

| Key | Value |
| --- | --- |
| Server | side (n8n Webhook Response Headers): |
| Continue29 nov 2025hoewel RN geen CORS nodig heeft, voor web | compatibility (toekomstige PWA): |

Error Handling:

Success:

Validatiefout:

Netwerkfout:

Server Error:

Definitie "2 kliks":

Waarom dit stress verlaagt:

Alternatieve Flow (indien gewenst):

Toekomstige Optimalisatie:

Huidig: Eenvoudige retry (1x extra poging bij fout).
Toekomst:

Implementatie:
typescript

json

typescript

Status: Klaar voor implementatie in Expo Snack.
Volgende Stappen:

Contact: Voor vragen of aanpassingen, zie documentatie of open een issue in project repository.Claude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

### Lyra_prompt_fase_4_Claude.txt

143 linestxt29 nov 2025

---

**Claude:**

### Lyra_prompt_fase_4_Claude.txt

143 linestxt

---

**Claude:**

### Lyra_prompt_fase_4_Claude.txt

143 lines

---

**Claude:**

txt

---

**Claude:**

29 nov 2025

---

**Claude:**

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

```
accessibilityLabel
```

```
accessibilityHint
```

```
Haptics.impactAsync()
```

```
accessibilityLiveRegion="polite"
```

```
prefers-reduced-motion
```

```js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```ts
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```
subcategory
```

```
description
```

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

| - 2-Klik Quick Add: Bedrag + Categorie zijn de enige verplichte handelingen | andere velden krijgen slimme defaults (datum = vandaag, type = Uitgave, beschrijving optioneel). |
| --- | --- |
| - Offline Resilience: Eenvoudige retry-logica | toekomstige uitbreiding naar lokale queue. |

| - Snelle Acties: Grote knop "Uitgave Toevoegen" prominent aanwezig | secundaire knop "Inkomst Toevoegen". |
| --- | --- |
| - Recent Overzicht: Laatste 5 transacties in lijst (scroll voor meer) | tap voor details/bewerken. |

| Key | Value |
| --- | --- |
| Header | Maandnaam + jaar, avatar/instellingen icoon rechtsboven. |
| Risicomarge Card | Circular progress of horizontal bar, percentage + bedrag, subtitel "gebaseerd op je gemiddelde patroon". |
| Quick Action Buttons | Primaire (Uitgave), secundaire (Inkomst). |
| Transaction List | Card-based, swipe-to-delete/edit opties. |

- Risicomarge (meest urgent)
- Quick Actions (primaire taak)
- Recente transacties (context)

| Key | Value |
| --- | --- |
| Klik 1 | Gebruiker typt bedrag (numeriek keyboard verschijnt automatisch). |
| Klik 2 | Gebruiker selecteert categorie uit voorgestelde chips. |
| Automatisch opslaan | Direct na categorie-selectie, of expliciete "Opslaan" knop indien gebruiker meer wil invullen. |

| Key | Value |
| --- | --- |
| Scherm opent | Focus op bedragveld, keyboard actief, datum = vandaag (editeerbaar via klein kalenderpictogram). |
| Bedrag invoeren | Grote cijfers, komma/punt voor decimalen, valuta-hint (€). |
| Categorie kiezen | 6-8 meest gebruikte categorieën als grote chips (Eten, Vervoer, Boodschappen, etc.); "Meer..." optie voor volledig menu. |
| Optionele velden uitklappen | "Details toevoegen" knop ontvouwt subcategorie, beschrijving, type-toggle (default = Uitgave). |
| Opslaan | Groen vinkje + haptic feedback + toast "Uitgave opgeslagen". |

- Bedrag mag niet leeg of 0 zijn → disable "Opslaan" knop.
- Categorie vereist → visuele hint (grijs omlijning wordt blauw bij selectie).
- Netwerkfout → rode toast "Kon niet opslaan, probeer opnieuw" + retry-knop.

| Key | Value |
| --- | --- |
| Default | Bedrag leeg, categorie geen selectie, Type = Uitgave. |
| Typing | Bedragveld actief, keyboard zichtbaar. |
| Category Selected | Chip heeft accent-kleur, "Opslaan" knop enabled. |
| Saving | Loading spinner op knop, haptic feedback. |
| Success | Groene checkmark + toast, velden resetten. |
| Error | Rode toast met foutmelding + retry optie. |

| Key | Value |
| --- | --- |
| Primary Blue | #4A90E2 (accentkleur, knoppen, links) |
| Primary Dark | #2E5C8A (hover/pressed states) |

| - Background: #F8F9FA (licht grijs | kalm) |
| --- | --- |
| - Surface: #FFFFFF (cards | invoervelden) |

| Key | Value |
| --- | --- |
| Success | #5CB85C (groen, kalm, niet fel) |
| Warning | #F0AD4E (oranje, neutraal) |
| Error | #D9534F (rood, gedempd) |
| Info | #5BC0DE (lichtblauw) |

| - Text Primary: #2C3E50 (donkergrijs | hoog contrast) |
| --- | --- |
| - Text Secondary: #7F8C8D (lichtgrijs | subtiele info) |

- Van #4A90E2 (blauw, goed) naar #5CB85C (groen, veilig) voor positieve marge.

| Key | Value |
| --- | --- |
| Heading 1 | 28px, weight 700 (bold), line-height 1.2 (Dashboard titel) |
| Heading 2 | 22px, weight 600 (semi-bold), line-height 1.3 (Section headers) |
| Body | 16px, weight 400 (regular), line-height 1.5 (normale tekst) |
| Body Small | 14px, weight 400, line-height 1.4 (subtitels, hints) |
| Caption | 12px, weight 400, line-height 1.3 (timestamps, disclaimers) |
| Button Text | 16px, weight 600, line-height 1.2 (knoppen) |

| Key | Value |
| --- | --- |
| Minimale tekstgrootte 14px (12px alleen voor niet | essentiële info). |
| Contrast ratio minimaal 4.5 | 1 voor normale tekst, 3:1 voor grote tekst (WCAG AA). |

| Key | Value |
| --- | --- |
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| xxl | 48px |

| - Knoppen: min 48px hoog | volle breedte of min 120px breed. |
| --- | --- |
| - Chips: min 48px hoog | padding 16px horizontaal. |

| Key | Value |
| --- | --- |
| Default | Border 1px solid #E1E4E8, background #FFFFFF. |
| Hover (web | only): Border #4A90E2, background #F0F8FF (zeer licht blauw). |
| Pressed | Background #E6F2FF, slight scale down (0.98), haptic feedback. |
| Focused | Border 2px solid #4A90E2, outline for accessibility. |
| Disabled | Background #F8F9FA, text #BDC3C7, border #E1E4E8, opacity 0.6. |
| Error | Border 2px solid #D9534F, background #FFF5F5. |

- Gebruik native Ionicons (via Expo Vector Icons) of SF Symbols/Material Icons.
- Grootte: 24px (default), 20px (small), 32px (large).
- Kleur: matcht tekstkleur of accent.

| - Kleurcontrast: Alle tekst voldoet aan WCAG AA (4.5:1 voor body | 3:1 voor large text). |
| --- | --- |
| - Keyboard Types: Numerieke keyboard voor bedrag | default voor tekst. |
| - Focus Management: Autofocus op bedragveld bij scherm openen | reset focus na opslaan. |

| - : string (optioneel | lege string als niet ingevuld) |
| --- | --- |
| - : string (optioneel | lege string als niet ingevuld) |

- React Native fetch gebruikt native networking, geen browser CORS policies.
- Zorg dat de n8n webhook HTTPS gebruikt voor productie.

- Ho

# Lyra – Financiële Vrijheid Budget App: FASE 4 Opleverdocument

## 1. Executive Summary

## 2. UX/UI Flow & Wireframes

### 2.1 Dashboard (Analyse)

### 2.2 Dagelijkse Invoer (Quick Add)

## 3. Design System

### 3.1 Kleurenpalet

### 3.2 Typografie

### 3.3 Spacing & Component States

## 4. Accessibility Checklist

## 5. React Native (TypeScript) – TransactionInput Component

## 6. API Integratie & Payload

### 6.1 Voorbeeld JSON Payload

### 6.2 Voorbeeld Fetch Config

### 6.3 CORS Consideraties

Doel Fase 4: Implementatie van een stressarme, toegankelijke mobiele budget-app die gebruikers in staat stelt om financiële transacties met minimale cognitieve belasting in te voeren (2-klik Quick Add) en inzicht te krijgen via een kalm, actiegerichte Dashboard.
Kernbeslissingen:

User Journey:

Componenten:

Informatie Hiërarchie:

ASCII Wireframe:

2-Klik Flow:

Stappen Detail:

Foutpreventie:

States:

ASCII Wireframe:

Primaire Kleuren:

Secundaire & Achtergrond:

Feedback Kleuren:

Tekst:

Risicomarge Gradient (optioneel):

Font Family: System sans-serif (iOS: SF Pro, Android: Roboto).
Sizes & Weights:

Toegankelijkheid:

Spacing Scale (gebaseerd op 8px grid):

Touch Targets:

Component States:

Iconen:

typescript

json
Key Types:

typescript

Client-side (React Native):

Server-side (n8n Webhook Response Headers):

---

**Claude:**

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  November 2025          [👤]    │
├─────────────────────────────────┤
│                                 │
│   ╭─────────────────────╮       │
│   │    €450 ruimte      │       │
│   │   ████████░░░ 65%   │       │
│   │ Gebaseerd op je     │       │
│   │ gemiddelde patroon  │       │
│   ╰─────────────────────╯       │
│                                 │
│  ┌──────────────────────────┐  │
│  │  + Uitgave Toevoegen     │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  + Inkomst Toevoegen     │  │
│  └──────────────────────────┘  │
│                                 │
│  Recente Transacties            │
│  ┌─────────────────────────┐   │
│  │ 🍔 Lunch   -€12,50      │   │
│  │ 29 nov • Eten & Drinken │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🚗 Tankbeurt -€65,00    │   │
│  │ 28 nov • Vervoer        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

---

**Claude:**

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  ← Nieuwe Uitgave               │
├─────────────────────────────────┤
│                                 │
│  Bedrag                         │
│  ┌──────────────────────────┐  │
│  │  € 12,50_               │  │  ← Focus, keyboard actief
│  └──────────────────────────┘  │
│                                 │
│  Categorie                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  │🍔  │ │🚗  │ │🛒  │ │🏠  │  │
│  │Eten│ │Ver-│ │Bood│ │Wonen│ │
│  └────┘ └────┘ └────┘ └────┘  │
│  ┌────┐ ┌────┐ ┌──────────┐   │
│  │💡  │ │🎉  │ │  Meer... │   │
│  │Nuts│ │Vrij│ └──────────┘   │
│  └────┘ └────┘                 │
│                                 │
│  📝 Details toevoegen (optie)  │
│                                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │      💾 Opslaan          │  │  ← Grote touch-target
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

---

**Claude:**

```js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```ts
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

typescript

---

**Claude:**

typescript

---

**Claude:**

```js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

```ts
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

type TransactionType = 'Uitgave' | 'Inkomst';

| user_id: string |  |
| --- | --- |
| date: string | // YYYY-MM-DD |
| amount: number |  |
| category: string |  |
| subcategory: string |  |
| description: string |  |
| type: TransactionType |  |

// ============================================================================
// CONFIGURATION
// ============================================================================

| const USER_ID_PLACEHOLDER = 'USER_ID_PLACEHOLDER' |  |
| --- | --- |
| const WEBHOOK_URL_PLACEHOLDER = 'WEBHOOK_URL_PLACEHOLDER' |  |

| { name: 'Eten & Drinken' | emoji: '🍔' } |  |
| --- | --- | --- |
| { name: 'Vervoer' | emoji: '🚗' } |  |
| { name: 'Boodschappen' | emoji: '🛒' } |  |
| { name: 'Wonen' | emoji: '🏠' } |  |
| { name: 'Nutsvoorzieningen' | emoji: '💡' } |  |
| { name: 'Vrije tijd' | emoji: '🎉' } |  |
| { name: 'Zorg' | emoji: '🏥' } |  |
| { name: 'Overig' | emoji: '📦' } |  |

// ============================================================================
// COMPONENT
// ============================================================================

| const [amount | setAmount] = useState<string>(''); |
| --- | --- |
| const [category | setCategory] = useState<string>(''); |
| const [subcategory | setSubcategory] = useState<string>(''); |
| const [description | setDescription] = useState<string>(''); |
| const [type | setType] = useState<TransactionType>('Uitgave'); |
| const [date | setDate] = useState<string>(''); |
| const [showDetails | setShowDetails] = useState<boolean>(false); |
| const [isLoading | setIsLoading] = useState<boolean>(false); |

| const today = new Date() |  |
| --- | --- |
| const formatted = today.toISOString().split('T')[0] | // YYYY-MM-DD |
| setDate(formatted) |  |
| }, []) |  |

  // Validation
  const isValid = amount.trim() !== '' && parseFloat(amount) > 0 && category !== '';

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // HANDLERS | // HANDLERS |
| // ============================================================================ | // ============================================================================ |

| Alert.alert('Validatiefout', 'Voer een bedrag en categorie in.') |  |
| --- | --- |
| return |  |

    setIsLoading(true);

| subcategory: subcategory |  | '', |
| --- | --- | --- |
| description: description |  | '', |

| const response = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| const retryResponse = await fetch(WEBHOOK_URL_PLACEHOLDER | { |
| method: 'POST' |  |
| headers: { 'Content-Type': 'application/json' } |  |
| body: JSON.stringify(payload) |  |

| Alert.alert('Opgeslagen' | 'Je transactie is succesvol opgeslagen!'); |
| --- | --- |
| 'Fout bij opslaan' |  |
| 'Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw.' |  |
| console.error('Save error:' | error); |

| setCategory(categoryName) |  |
| --- | --- |
| } |  |

| const cleaned = text.replace(/[^0-9.,]/g, '') |  |
| --- | --- |
| setAmount(cleaned) |  |
| } |  |

| // ============================================================================ | // ============================================================================ |
| --- | --- |
| // RENDER | // RENDER |
| // ============================================================================ | // ============================================================================ |

| return ( | return ( |
| --- | --- |
| <KeyboardAvoidingView | <KeyboardAvoidingView |
| style={styles.container} | style={styles.container} |
| behavior={Platform.OS === 'ios' ? 'padding' : 'height'} | behavior={Platform.OS === 'ios' ? 'padding' : 'height'} |
| > | > |
| <ScrollView | <ScrollView |
| contentContainerStyle={styles.scrollContent} | contentContainerStyle={styles.scrollContent} |
| keyboardShouldPersistTaps="handled" | keyboardShouldPersistTaps="handled" |
| > | > |
| {/* Header */} | {/* Header */} |
| <View style={styles.header}> | <View style={styles.header}> |
| <Text style={styles.headerTitle}>Nieuwe {type}</Text> | <Text style={styles.headerTitle}>Nieuwe {type}</Text> |
| </View> | </View> |

| styles.typeButton |  |
| --- | --- |
| type === 'Uitgave' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Uitgave' && styles.typeButtonTextActive |  |
| styles.typeButton |  |
| type === 'Inkomst' && styles.typeButtonActive |  |
| styles.typeButtonText |  |
| type === 'Inkomst' && styles.typeButtonTextActive |  |

| {/* Amount Input */} | {/* Amount Input */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Bedrag</Text> | <Text style={styles.label}>Bedrag</Text> |
| <View style={styles.amountInputContainer}> | <View style={styles.amountInputContainer}> |
| <Text style={styles.currencySymbol}>€</Text> | <Text style={styles.currencySymbol}>€</Text> |
| <TextInput | <TextInput |
| style={styles.amountInput} | style={styles.amountInput} |
| value={amount} | value={amount} |
| onChangeText={handleAmountChange} | onChangeText={handleAmountChange} |
| keyboardType="decimal-pad" | keyboardType="decimal-pad" |
| placeholder="0,00" | placeholder="0,00" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| autoFocus | autoFocus |
| accessibilityLabel="Bedrag invoeren" | accessibilityLabel="Bedrag invoeren" |
| accessibilityHint="Voer het bedrag van de transactie in" | accessibilityHint="Voer het bedrag van de transactie in" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |

| styles.categoryChip |  |
| --- | --- |
| category === cat.name && styles.categoryChipSelected |  |
| styles.categoryText |  |
| category === cat.name && styles.categoryTextSelected |  |

| {/* Details Toggle */} | {/* Details Toggle */} |
| --- | --- |
| <TouchableOpacity | <TouchableOpacity |
| style={styles.detailsToggle} | style={styles.detailsToggle} |
| onPress={() => setShowDetails(!showDetails)} | onPress={() => setShowDetails(!showDetails)} |
| accessibilityLabel="Details toevoegen" | accessibilityLabel="Details toevoegen" |
| accessibilityHint="Toon of verberg extra velden" | accessibilityHint="Toon of verberg extra velden" |
| > | > |
| <Text style={styles.detailsToggleText}> | <Text style={styles.detailsToggleText}> |
| {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) | {showDetails ? '▼' : '▶'} Details toevoegen (optioneel) |
| </Text> | </Text> |
| </TouchableOpacity> | </TouchableOpacity> |

| {/* Optional Details */} | {/* Optional Details */} |
| --- | --- |
| {showDetails && ( | {showDetails && ( |
| <View style={styles.detailsContainer}> | <View style={styles.detailsContainer}> |
| {/* Date */} | {/* Date */} |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Datum</Text> | <Text style={styles.label}>Datum</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={date} | value={date} |
| onChangeText={setDate} | onChangeText={setDate} |
| placeholder="YYYY-MM-DD" | placeholder="YYYY-MM-DD" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Datum van transactie" | accessibilityLabel="Datum van transactie" |
| /> | /> |
| </View> | </View> |

| {/* Subcategory */} | {/* Subcategory */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Subcategorie</Text> | <Text style={styles.label}>Subcategorie</Text> |
| <TextInput | <TextInput |
| style={styles.textInput} | style={styles.textInput} |
| value={subcategory} | value={subcategory} |
| onChangeText={setSubcategory} | onChangeText={setSubcategory} |
| placeholder="Bijv. Brandstof, Lunch" | placeholder="Bijv. Brandstof, Lunch" |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| accessibilityLabel="Subcategorie" | accessibilityLabel="Subcategorie" |
| /> | /> |
| </View> | </View> |

| {/* Description */} | {/* Description */} |
| --- | --- |
| <View style={styles.inputGroup}> | <View style={styles.inputGroup}> |
| <Text style={styles.label}>Omschrijving</Text> | <Text style={styles.label}>Omschrijving</Text> |
| <TextInput | <TextInput |
| style={[styles.textInput, styles.textInputMultiline]} | style={[styles.textInput, styles.textInputMultiline]} |
| value={description} | value={description} |
| onChangeText={setDescription} | onChangeText={setDescription} |
| placeholder="Extra notities..." | placeholder="Extra notities..." |
| placeholderTextColor="#BDC3C7" | placeholderTextColor="#BDC3C7" |
| multiline | multiline |
| numberOfLines={3} | numberOfLines={3} |
| accessibilityLabel="Omschrijving van transactie" | accessibilityLabel="Omschrijving van transactie" |
| /> | /> |
| </View> | </View> |
| </View> | </View> |
| )} | )} |

| disabled={!isValid |  | isLoading} |
| --- | --- | --- |
| accessibilityState={{ disabled: !isValid |  | isLoading }} |

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  categoryChipSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E6F2FF',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  categoryTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  detailsToggleText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 48,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

---

**Claude:**

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

json

---

**Claude:**

json

---

**Claude:**

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

---

**Claude:**

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

typescript

---

**Claude:**

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Bijv: https://jouw-domein.com/webhook/transactions

| user_id: "USER_ID_PLACEHOLDER" |  |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('Success:', data.message);
  } else {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

---

**Claude:**

Continue29 nov 2025

---

**Claude:**

Continue

---

**Claude:**

| Test Case | Stappen | Verwacht Resultaat |
| --- | --- | --- |
| TC-01: Standaard Weergave | Open TransactionInput scherm | - Bedragveld heeft focus- Datum = vandaag- Type = Uitgave- Categorieën zichtbaar- Opslaan knop disabled |
| TC-02: Bedrag Invoeren | Typ "12,50" in bedragveld | - Tekst verschijnt- Numerieke keyboard actief- € symbool zichtbaar |
| TC-03: Categorie Selecteren | Tap op "Eten & Drinken" chip | - Chip krijgt blauwe border en lichtblauwe achtergrond- Opslaan knop wordt enabled |
| TC-04: Type Toggle | Tap op "Inkomst" knop | - Knop wordt blauw- Header tekst verandert naar "Nieuwe Inkomst" |
| TC-05: Details Uitklappen | Tap op "Details toevoegen" | - Datum, subcategorie, beschrijving velden worden zichtbaar- Toggle tekst toont "▼" |
| TC-06: Touch Target Grootte | Gebruik accessibility inspector | - Alle knoppen/chips minimaal 48x48px |

| Test Case | Input | Verwacht Resultaat |
| --- | --- | --- |
| TV-01: Leeg Bedrag | Bedrag = "", Categorie = "Eten" | Opslaan knop disabled |
| TV-02: Nul Bedrag | Bedrag = "0", Categorie = "Eten" | Opslaan knop disabled |
| TV-03: Negatief Bedrag | Bedrag = "-10", Categorie = "Eten" | Tekst wordt gefilterd (alleen cijfers/komma toegestaan) |
| TV-04: Geen Categorie | Bedrag = "10", Categorie = "" | Opslaan knop disabled |
| TV-05: Valid Input | Bedrag = "25,50", Categorie = "Vervoer" | Opslaan knop enabled en groen |

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TN-01: Succesvolle POST | Webhook antwoordt 200 OK met correct JSON | - Groene toast "Opgeslagen"- Velden resetten- Details klappen dicht |
| TN-02: Netwerkfout | Geen internet / timeout | - Rode toast "Kon niet opslaan..."- Retry 1x automatisch- Bij tweede fout: toast blijft, data niet gewist |
| TN-03: Server Error (500) | Webhook geeft 500 terug | - Retry 1x- Rode toast bij tweede fout- Data behouden |
| TN-04: Verkeerde Response | Webhook geeft 200 maar geen JSON | - Catch block vangt parsing error- Rode toast met foutmelding |
| TN-05: CORS Preflight | OPTIONS request (indien web) | - Server moet 200 OK + CORS headers geven- Daarna volgt POST |

| Test Case | Methode | Verwacht Resultaat |
| --- | --- | --- |
| TA-01: Screen Reader | VoiceOver (iOS) / TalkBack (Android) | - Alle velden hebben duidelijke labels- Focus order: bedrag → categorie → details → opslaan |
| TA-02: Kleurcontrast | Contrast checker tool | - Tekst op achtergrond: minimaal 4.5:1- Grote tekst: minimaal 3:1 |
| TA-03: Keyboard Navigatie | Tab door velden (indien ondersteund) | - Logische volgorde- Focus indicatie zichtbaar |
| TA-04: Haptic Feedback | Tap op opslaan (succes/fout) | - Trillen voelbaar bij feedback (iOS/Android) |

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TE-01: Zeer Groot Bedrag | Bedrag = "999999,99" | - Invoer toegestaan- POST succesvol- Geen UI overflow |
| TE-02: Speciale Karakters | Bedrag = "12€50" of "12.50abc" | - Alleen "12,50" blijft over (filtering) |
| TE-03: Datum in Verleden | Datum = "2020-01-01" | - Toegestaan (gebruiker kan historische data invoeren) |
| TE-04: Snelle Dubbele Tap | Snel 2x op Opslaan tappen | - Loading spinner voorkomt tweede request- Button disabled tijdens saving |

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

```yaml
Content-Type: application/json
```

```json
{ "status": "success", "message": "Transaction received." }
```

```
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```ts
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```
useColorScheme()
```

```json
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```js
{
  "user_id": "USER_ID_PLACEHOLDER",
  "date": "2025-11-29",
  "amount": 99.95,
  "category": "Vervoer",
  "subcategory": "Brandstof",
  "description": "Tankbeurt aan de pomp",
  "type": "Uitgave"
}
```

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```
USER_ID_PLACEHOLDER
```

```
WEBHOOK_URL_PLACEHOLDER
```

- Respons moet  header hebben.
- Status 200 OK met JSON body:

| Key | Value |
| --- | --- |
| Netwerkfout (geen internet) | Catch block → rode toast "Geen internetverbinding". |
| Server error (500) | Response niet OK → retry 1x, dan foutmelding. |
| Validatiefout (400) | Parse response JSON voor specifieke foutmelding. |

| Key | Value |
| --- | --- |
| Bedrag veld | Label = "Bedrag", Placeholder = "0,00" |
| Categorie sectie | Label = "Categorie" |
| Subcategorie veld | Label = "Subcategorie", Placeholder = "Bijv. Brandstof, Lunch" |
| Beschrijving veld | Label = "Omschrijving", Placeholder = "Extra notities..." |
| Datum veld | Label = "Datum", Placeholder = "YYYY-MM-DD" |

| Key | Value |
| --- | --- |
| Primaire actie | "💾 Opslaan" |
| Type toggle | "Uitgave" / "Inkomst" |
| Details toggle | "▶ Details toevoegen (optioneel)" / "▼ Details toevoegen (optioneel)" |

- "Opgeslagen" (titel)
- "Je transactie is succesvol opgeslagen!" (body)

- "Validatiefout" (titel)
- "Voer een bedrag en categorie in." (body)

- "Fout bij opslaan" (titel)
- "Kon de transactie niet opslaan. Controleer je internetverbinding en probeer opnieuw." (body)

- "Fout bij opslaan" (titel)
- "De server reageert niet correct. Probeer het later opnieuw." (body)

| Key | Value |
| --- | --- |
| Bedrag veld | "Voer het bedrag van de transactie in" |
| Categorie chip | "Selecteer categorie [naam]" |
| Opslaan knop | "Sla de transactie op in je budget" |
| Details toggle | "Toon of verberg extra velden" |

| Key | Value |
| --- | --- |
| Kalm | Geen alarm-taal, geen veroordelende woorden zoals "fout" of "verkeerd" (tenzij technische fout). |
| Motiverend | "Je transactie is opgeslagen" i.p.v. "Transactie opgeslagen". |
| Empathisch | "Controleer je internetverbinding" i.p.v. "Netwerkfout". |
| Helder | Korte zinnen, actieve taal, geen jargon. |

| Key | Value |
| --- | --- |
| Klik 1 | Gebruiker typt bedrag (keyboard verschijnt automatisch bij scherm openen, bedragveld heeft autofocus). |
| Klik 2 | Gebruiker selecteert categorie chip. |

- Minimale Cognitieve Belasting: Alleen de twee meest essentiële velden (bedrag + categorie) zijn verplicht. Andere velden (datum, subcategorie, beschrijving) zijn optioneel en verborgen achter "Details toevoegen".
- Slimme Defaults:

| - Snelle Invoer: Numerieke keyboard verschijnt direct | geen extra tap nodig om keyboard te activeren. |
| --- | --- |
| - Grote Touch Targets: Categorie chips zijn 48px hoog | makkelijk te raken zonder precisie. |
| - Visuele Affordance: Chips veranderen direct van kleur bij selectie | gebruiker ziet meteen dat de actie is geregistreerd. |

| Key | Value |
| --- | --- |
| Datum | Automatisch vandaag (99% van de transacties zijn vandaag). |
| Type | Default "Uitgave" (meeste transacties zijn uitgaven). |
| Beschrijving | Optioneel (niet iedereen wil notities toevoegen). |

- Na categorie-selectie kan de app automatisch opslaan zonder expliciete "Opslaan" knop, maar huidige ontwerp behoudt de knop voor controle en om onbedoelde opslag te voorkomen. Dit is een bewuste trade-off: 3 kliks (bedrag + categorie + opslaan) versus 2 kliks met auto-save risico.

- Leer meest gebruikte categorieën per tijdstip (bijv. "Eten & Drinken" rond lunchtijd) en toon die bovenaan.
- Voice input voor bedrag ("Siri, voeg €12,50 toe aan lunch").

- Lokale SQLite database (via Expo SQLite) om transacties te bufferen wanneer offline.
- Sync-logica: bij netwerk-terugkeer, batch-upload van gebufferde transacties.
- UI indicator: "3 transacties wachten op sync" badge.

- Analyseer gebruikersgedrag: welke categorieën worden het meest gebruikt?
- Toon top 6 categorieën bovenaan, rest in "Meer..." menu.
- Machine learning (optioneel): voorspel categorie op basis van bedrag/tijd/locatie.

| Key | Value |
| --- | --- |
| Toon mini | grafieken op Dashboard: uitgaven per categorie (taartgrafiek), trend over tijd (lijngrafiek). |
| Gebruik React Native Chart libraries (bijv. react | native-chart-kit) of D3.js wrapper. |
| Privacy | first: alle data blijft lokaal tot gebruiker expliciet sync naar cloud. |

- Implementeer  hook (RN/Expo) om systeemthema te detecteren.
- Definieer dark mode kleurenpalet:

| Key | Value |
| --- | --- |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |

| Key | Value |
| --- | --- |
| Background | #1E1E1E |
| Surface | #2C2C2C |
| Text Primary | #FFFFFF |
| Primary Blue | blijft #4A90E2 (voldoende contrast op donker) |

- Gebruiker stelt maandbudget in per categorie.
- Push-notificatie (Expo Notifications) bij 80% budget bereikt: "Je hebt nog €50 over voor Eten & Drinken deze maand".
- Kalme toon: geen "WAARSCHUWING" of rood alarm, maar informatief bericht.

- "Terugkerende uitgave toevoegen" optie: huur, abonnementen, etc.
- Auto-fill elke maand op gespecificeerde datum.
- Reminder om te bevestigen (gebruiker kan skippen indien al betaald).

- Vervang  met echte UUID uit Supabase Auth.
- Vervang  met productie n8n webhook URL.
- Test in Expo Go app op iOS/Android.
- Valideer JSON payload in n8n webhook logs.
- Implementeer RLS policies in Supabase (indien nog niet gedaan).
- Deploy naar productie (Expo EAS Build voor standalone app).

## 7. Testplan

### 7.1 UI Tests (Handmatig)

### 7.2 Validatie Tests

### 7.3 Netwerk Tests

### 7.4 Accessibility Tests

### 7.5 Edge Cases

## 8. Copywriting (Microcopy)

### Labels & Placeholders

### Knoppen

### Feedback Meldingen

### Accessibility Hints

### Tone Principes

## 9. Toelichting 2-Klik Quick Add

### Hoe de UI 2-Klik Haalt

## 10. Toekomstige Uitbreidingen

### 10.1 Offline Queue Robuuster

### 10.2 Categorie-Leren (Frequentie)

### 10.3 Lokale Analytics

### 10.4 Themas (Light/Dark Mode)

### 10.5 Budgettering & Meldingen

### 10.6 Recurring Transactions

## BIJLAGE A: Voorbeeld Payload (Nederlands)

## BIJLAGE B: Voorbeeld Fetch (React Native TypeScript)

## EINDE FASE 4 OPLEVERDOCUMENT

hoewel RN geen CORS nodig heeft, voor web-compatibility (toekomstige PWA):

Error Handling:

Success:

Validatiefout:

Netwerkfout:

Server Error:

Definitie "2 kliks":

Waarom dit stress verlaagt:

Alternatieve Flow (indien gewenst):

Toekomstige Optimalisatie:

Huidig: Eenvoudige retry (1x extra poging bij fout).
Toekomst:

Implementatie:
typescript

json

typescript

Status: Klaar voor implementatie in Expo Snack.
Volgende Stappen:

Contact: Voor vragen of aanpassingen, zie documentatie of open een issue in project repository.

---

**Claude:**

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

```yaml
Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
```

---

**Claude:**

| Test Case | Stappen | Verwacht Resultaat |
| --- | --- | --- |
| TC-01: Standaard Weergave | Open TransactionInput scherm | - Bedragveld heeft focus- Datum = vandaag- Type = Uitgave- Categorieën zichtbaar- Opslaan knop disabled |
| TC-02: Bedrag Invoeren | Typ "12,50" in bedragveld | - Tekst verschijnt- Numerieke keyboard actief- € symbool zichtbaar |
| TC-03: Categorie Selecteren | Tap op "Eten & Drinken" chip | - Chip krijgt blauwe border en lichtblauwe achtergrond- Opslaan knop wordt enabled |
| TC-04: Type Toggle | Tap op "Inkomst" knop | - Knop wordt blauw- Header tekst verandert naar "Nieuwe Inkomst" |
| TC-05: Details Uitklappen | Tap op "Details toevoegen" | - Datum, subcategorie, beschrijving velden worden zichtbaar- Toggle tekst toont "▼" |
| TC-06: Touch Target Grootte | Gebruik accessibility inspector | - Alle knoppen/chips minimaal 48x48px |

---

**Claude:**

| Test Case | Input | Verwacht Resultaat |
| --- | --- | --- |
| TV-01: Leeg Bedrag | Bedrag = "", Categorie = "Eten" | Opslaan knop disabled |
| TV-02: Nul Bedrag | Bedrag = "0", Categorie = "Eten" | Opslaan knop disabled |
| TV-03: Negatief Bedrag | Bedrag = "-10", Categorie = "Eten" | Tekst wordt gefilterd (alleen cijfers/komma toegestaan) |
| TV-04: Geen Categorie | Bedrag = "10", Categorie = "" | Opslaan knop disabled |
| TV-05: Valid Input | Bedrag = "25,50", Categorie = "Vervoer" | Opslaan knop enabled en groen |

---

**Claude:**

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TN-01: Succesvolle POST | Webhook antwoordt 200 OK met correct JSON | - Groene toast "Opgeslagen"- Velden resetten- Details klappen dicht |
| TN-02: Netwerkfout | Geen internet / timeout | - Rode toast "Kon niet opslaan..."- Retry 1x automatisch- Bij tweede fout: toast blijft, data niet gewist |
| TN-03: Server Error (500) | Webhook geeft 500 terug | - Retry 1x- Rode toast bij tweede fout- Data behouden |
| TN-04: Verkeerde Response | Webhook geeft 200 maar geen JSON | - Catch block vangt parsing error- Rode toast met foutmelding |
| TN-05: CORS Preflight | OPTIONS request (indien web) | - Server moet 200 OK + CORS headers geven- Daarna volgt POST |

---

**Claude:**

| Test Case | Methode | Verwacht Resultaat |
| --- | --- | --- |
| TA-01: Screen Reader | VoiceOver (iOS) / TalkBack (Android) | - Alle velden hebben duidelijke labels- Focus order: bedrag → categorie → details → opslaan |
| TA-02: Kleurcontrast | Contrast checker tool | - Tekst op achtergrond: minimaal 4.5:1- Grote tekst: minimaal 3:1 |
| TA-03: Keyboard Navigatie | Tab door velden (indien ondersteund) | - Logische volgorde- Focus indicatie zichtbaar |
| TA-04: Haptic Feedback | Tap op opslaan (succes/fout) | - Trillen voelbaar bij feedback (iOS/Android) |

---

**Claude:**

| Test Case | Scenario | Verwacht Resultaat |
| --- | --- | --- |
| TE-01: Zeer Groot Bedrag | Bedrag = "999999,99" | - Invoer toegestaan- POST succesvol- Geen UI overflow |
| TE-02: Speciale Karakters | Bedrag = "12€50" of "12.50abc" | - Alleen "12,50" blijft over (filtering) |
| TE-03: Datum in Verleden | Datum = "2020-01-01" | - Toegestaan (gebruiker kan historische data invoeren) |
| TE-04: Snelle Dubbele Tap | Snel 2x op Opslaan tappen | - Loading spinner voorkomt tweede request- Button disabled tijdens saving |

---

**Claude:**

```
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```ts
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

typescript

---

**Claude:**

```
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

```ts
// Pseudo-code
if (navigator.onLine) {
  await postToWebhook(transaction);
} else {
  await saveToLocalDB(transaction);
  showToast('Opgeslagen lokaal, wordt gesynchroniseerd zodra je online bent');
}
```

---

**Claude:**

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

typescript

---

**Claude:**

```
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

```ts
const WEBHOOK_URL = "WEBHOOK_URL_PLACEHOLDER"; // Vervang met jouw productie endpoint

| user_id: "USER_ID_PLACEHOLDER" | // Vervang met echte user UUID |
| --- | --- |
| date: "2025-11-29" |  |
| amount: 99.95 |  |
| category: "Vervoer" |  |
| subcategory: "Brandstof" |  |
| description: "Tankbeurt aan de pomp" |  |

| const response = await fetch(WEBHOOK_URL | { |
| --- | --- |
| method: 'POST' |  |
| 'Content-Type': 'application/json' |  |
| } |  |
| body: JSON.stringify(payload) |  |

  if (response.ok) {
    const data = await response.json();
    // Verwacht: { status: "success", message: "Transaction received." }
    console.log('✅ Success:', data.message);
    // Toon groene toast
  } else {
    console.error('❌ HTTP Error:', response.status);
    // Toon rode toast
  }
} catch (error) {
  console.error('❌ Network Error:', error);
  // Retry 1x of toon foutmelding
}
```

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade Sonnet 4.5

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade

---

**Claude:**

You are out of free messages until 4:00 PM

---

**Claude:**

Upgrade

---

**Claude:**

Sonnet 4.5

---

**Claude:**

Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Export (MD)Export (JSON)✅ Lazy-load klaar (0 blokken)

---

**Claude:**

✅ Lazy-load klaar (0 blokken)
