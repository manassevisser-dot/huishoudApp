import { getISOWeek } from '@domain/helpers/DateHydrator';
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dataOrchestrator } from '@services/dataOrchestrator';
import * as TransactionService from '@services/transactionService';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { DATA_KEYS } from '@domain/constants/datakeys'; // Toegevoegd voor de juiste mapping
import { Logger } from '@/adapters/audit/AuditLoggerAdapter';

type Props = {
  onClose: () => void;
  // We verwachten nu de volledige household members en de setup
  members: any[];
  setupData: any;
};

const CsvUploadScreen: React.FC<Props> = ({ onClose, members, setupData }) => {
  const insets = useSafeAreaInsets();
  const { styles, colors } = useAppStyles();

  const [csvText, setCsvText] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);

  const handleUpload = async () => {
    try {
      setIsUploading(true);

      // --- 1. DE NIEUWE WASSTRAAT (processAllData) ---
      // We geven de bestaande members mee voor de privacy mapping
      const result = dataOrchestrator.processAllData(members || [], csvText, setupData || {});

      // Gebruik de DATA_KEYS om de gefilterde lokale data op te halen

      const financeData = result.local[DATA_KEYS.FINANCE];

      if (financeData.transactions.length === 0) {
        Alert.alert('Fout', 'Geen geldige transacties gevonden. Controleer het formaat.');
        setIsUploading(false);
        return;
      }

      // --- 2. SAMENVATTING / SIGNALEN ---
      const { summary: income, hasMissingCosts } = financeData;

      let message =
        `${financeData.transactions.length} transacties verwerkt.\n\n` +
        `Inkomen bron: ${income.source}\n` +
        `Inkomen (centen): ${income.finalIncome}\n\n`;

      if (income.isDiscrepancy) {
        message +=
          `⚠️ We zien een afwijkend inkomen tussen CSV en Setup.\n` +
          `Verschil: formatCurrency(x)\n\n`;
      }

      if (hasMissingCosts) {
        message += `🏠 We vonden woonlasten in de CSV die niet in je setup stonden.\n\n`;
      }

      Alert.alert('Bevestig Upload', message + 'Wil je deze data opslaan?', [
        { text: 'Annuleren', style: 'cancel', onPress: () => setIsUploading(false) },
        {
          text: 'Opslaan',
          onPress: async () => {
            // --- 3. (ANONIEM) RESEARCH PAYLOAD NAAR ANALYTICS ---
            // Je kunt result.research direct doorsturen naar een API/n8n
            Logger.info('Sending to research:', result.research);

            // --- 4. OPSLAAN NAAR LOKALE STORAGE ---
            for (const tx of financeData.transactions) {
              await (TransactionService as any)._mockLocalSave({
                date: tx.date,
                amount: tx.amount,
                description: tx.description, // Al geanonimiseerd door orchestrator
                category: tx.category,
                paymentMethod: 'pin',
                weekNumber: getISOWeek(new Date(tx.date)),
              });
            }

            setIsUploading(false);
            Alert.alert('Succes', 'Je dashboard is bijgewerkt!', [
              { text: 'OK', onPress: onClose },
            ]);
          },
        },
      ]);
    } catch (e: any) {
      setIsUploading(false);
      Alert.alert('Fout', e?.message ?? 'Onbekende fout bij verwerken van CSV');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageContainer}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        >
          <Text style={styles.pageTitle}>Bankafschrift Importeren</Text>

          <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
            Plak hier je bank-export. Persoonsgegevens en IBANs worden automatisch geanonimiseerd.
          </Text>

          <TextInput
            style={[styles.input, { height: 240, textAlignVertical: 'top', fontFamily: 'Courier' }]}
            multiline
            placeholder="Plak hier uw CSV regels..."
            value={csvText}
            onChangeText={setCsvText}
            editable={!isUploading}
          />

          <TouchableOpacity
            style={[
              styles.button,
              {
                marginTop: 16,
                marginLeft: 0,
                backgroundColor: isUploading ? colors.secondary : colors.primary,
              },
            ]}
            onPress={handleUpload}
            disabled={isUploading || !csvText.trim()}
          >
            {isUploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Analyseer CSV</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default CsvUploadScreen;
