
//====
// ./src/screens/DailyInput/DailyInputScreen.tsx
import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '../../styles/useAppStyles';
import ChipButton from '../../components/ChipButton';
import { TransactionService } from '../../services/transactionService';
import { DailyTransaction, PaymentMethod, TransactionCategory } from '../../types/transaction';
import { getCurrentDateISO, getISOWeek } from '../../utils/date';
import { onlyDigitsDotsComma } from '../../utils/numbers';

type Props = {
  onBack: () => void;
};

const CATEGORIES: TransactionCategory[] = [
  'Boodschappen',
  'Vervoer',
  'Horeca',
  'Winkelen',
  'Cadeaus',
  'Overig',
];

const PAYMENT_METHODS: PaymentMethod[] = ['pin', 'contant', 'creditcard'];

const DailyInputScreen: React.FC<Props> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const { styles, colors } = useAppStyles(); // ✅ verplaatst naar binnen

  // Form State
  const [date, setDate] = React.useState(getCurrentDateISO());
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] =
    React.useState<TransactionCategory | null>(null);
  const [subcategory, setSubcategory] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('pin');
  const [isSaving, setIsSaving] = React.useState(false);

  // Derived State
  const isDirty =
    amount !== '' &&
    category !== null &&
    subcategory !== '';

  const handleBack = () => {
    if (isDirty) {
      Alert.alert(
        'Niet opgeslagen wijzigingen',
        'Er staan nog niet opgeslagen gegevens klaar. Weet je zeker dat je terug wilt?',
        [
          { text: 'Annuleren', style: 'cancel' },
          { text: 'Ja, terug', style: 'destructive', onPress: onBack },
        ]
      );
    } else {
      onBack();
    }
  };

  const handleSavePress = () => {
    // Basic Validation
    if (!amount ||
        parseFloat(amount.replace(',', '.')) <= 0) {
      Alert.alert('Fout', 'Vul een geldig bedrag in.');
      return;
    }
    if (!category) {
      Alert.alert('Fout', 'Kies een categorie.');
      return;
    }
    Alert.alert(
      'Opslaan',
      'Data wordt opgeslagen.',
      [
        { text: 'Nee', style: 'cancel' },
        { text: 'Ok', onPress: executeSave },
      ]
    );
  };

  const executeSave = async () => {
    setIsSaving(true);
    const numAmount = parseFloat(amount.replace(',', '.'));
    const d = new Date(date);
    const transaction: DailyTransaction = {
      date: date,
      amount: numAmount,
      category: category!,
      subcategory: subcategory.trim() || undefined,
      paymentMethod: paymentMethod,
      weekNumber: getISOWeek(d),
    };

    const success = await TransactionService.saveTransaction(transaction);
    setIsSaving(false);

    if (success) {
      // Reset form for next entry (Rapid Entry pattern)
      setAmount('');
      setCategory(null);
      setSubcategory('');
      setPaymentMethod('pin');
      // Keep date as is, user might be logging multiple for same day
      // Optional: Toast or simple visual cue could go here.
      // For now, we just rely on the form clearing as feedback.
    } else {
      Alert.alert('Fout', 'Er is iets misgegaan bij het opslaan. Probeer het opnieuw.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>← Terug</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nieuwe Uitgave</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Date Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Datum (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
        </View>

        {/* Amount Field - Highlighted */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bedrag</Text>
          <View style={[styles.numericWrapper, { borderColor: '#007AFF', borderWidth: 2 }]}>
            <Text style={[styles.currencyPrefix, { fontSize: 24, fontWeight: 'bold' }]}>€</Text>
            <TextInput
              style={[styles.numericInput, { fontSize: 24, fontWeight: 'bold', paddingVertical: 12 }]}
              value={amount}
              onChangeText={(t) => setAmount(onlyDigitsDotsComma(t))}
              placeholder="0,00"
              keyboardType="numeric"
              autoFocus
            />
          </View>
        </View>

        {/* Category Grid */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Categorie</Text>
          <View style={styles.gridContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.gridItem,
                  category === cat && styles.gridItemSelected,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.gridItemText,
                    category === cat && styles.gridItemTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Subcategory (Optional) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Omschrijving (Optioneel)</Text>
          <TextInput
            style={styles.input}
            value={subcategory}
            onChangeText={setSubcategory}
            placeholder="Bijv. welke winkel?"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Betaalmethode</Text>
          <ScrollView horizontal contentContainerStyle={styles.chipContainer}>
            {PAYMENT_METHODS.map((m) => (
              <ChipButton
                key={m}
                label={m.charAt(0).toUpperCase() + m.slice(1)}
                selected={paymentMethod === m}
                onPress={() => setPaymentMethod(m)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Footer Action */}
      <View style={[styles.buttonContainer, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <TouchableOpacity
          style={[styles.button, isSaving && { opacity: 0.7 }]}
          onPress={handleSavePress}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Opslaan & Nieuwe</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
   );
};

