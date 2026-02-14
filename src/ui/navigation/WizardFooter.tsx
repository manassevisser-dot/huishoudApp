import { View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormContext } from '@app/context/FormContext';
import { useAppStyles } from '@ui/styles/useAppStyles';

export const WizardFooter = () => {
  const insets = useSafeAreaInsets();
  const { styles, Tokens } = useAppStyles();
  const { state, orchestrator } = useFormContext();

  const canGoNext = orchestrator.canNavigateNext(state.currentPageId);
  const bottomSpace = Math.max(insets.bottom, Tokens.Space.lg);

  return (
    <View style={[styles.buttonRow, { paddingBottom: bottomSpace }]}>
      <TouchableOpacity
        onPress={() => orchestrator.onNavigateBack()}
        style={[styles.button, styles.secondaryButton]}
      >
        <Text style={styles.secondaryButtonText}>Terug</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => orchestrator.onNavigateNext()}
        disabled={!canGoNext}
        style={[
          styles.button,
          !canGoNext && styles.buttonDisabled
        ]}
      >
        <Text style={styles.buttonText}>Verder</Text>
      </TouchableOpacity>
    </View>
  );
};