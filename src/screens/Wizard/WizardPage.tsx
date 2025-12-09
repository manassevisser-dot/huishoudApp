import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/AppStyles';
import FormField from '../../components/FormField';
import ConditionalField from '../../components/ConditionalField';
import { useFormContext } from '../../context/FormContext';
import { validateField } from '../../utils/validation';
import { evaluateCondition } from '../../utils/conditions';
import { PageConfig } from '../../types/form';

type PageProps = {
  page: PageConfig;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
};

const WizardPage: React.FC<PageProps> = ({
  page,
  onNext,
  onPrev,
  isFirst,
  isLast,
}) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useFormContext();
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const currentPageData = state[page.id] ?? {};
  const currentPageState = state;

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (page.id !== 'C1') return;
    const mensen = Number(state.C1?.aantalMensen ?? 0);
    const volwassen = Number(state.C1?.aantalVolwassen ?? 0);
    if (volwassen > mensen) {
      dispatch({
        type: 'SET_PAGE_DATA',
        pageId: 'C1',
        data: { aantalVolwassen: mensen },
      });
    } else if (volwassen > 7) {
      dispatch({
        type: 'SET_PAGE_DATA',
        pageId: 'C1',
        data: { aantalVolwassen: 7 },
      });
    }
  }, [page.id, state.C1?.aantalMensen, state.C1?.aantalVolwassen, dispatch]);

  const handleChange = (fieldId: string, value: any) => {
    const newErrors = { ...errors };
    const validationError = validateField(
      page.fields.find((f) => f.id === fieldId)!,
      value,
      state
    );
    newErrors[fieldId] = validationError;
    setErrors(newErrors);
    dispatch({
      type: 'SET_PAGE_DATA',
      pageId: page.id,
      data: { [fieldId]: value },
    });
  };

  const handleNext = () => {
    let hasError = false;
    const newErrors: Record<string, string | null> = {};
    page.fields.forEach((field) => {
      if (evaluateCondition(field.conditional, currentPageState, page.id)) {
        const value = currentPageData[field.id];
        const error = validateField(field, value, currentPageState);
        if (error) {
          newErrors[field.id] = error;
          hasError = true;
        } else {
          newErrors[field.id] = null;
        }
      }
    });
    setErrors(newErrors);
    
    if (hasError && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
    
    if (!hasError) {
      onNext();
    }
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>{page.title}</Text>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
        ]}>
        {page.fields.map((field) => (
          <React.Fragment key={field.id}>
            <ConditionalField
              conditional={field.conditional}
              pageId={page.id}>
              <FormField
                pageId={page.id}
                field={field}
                value={currentPageData[field.id] ?? field.defaultValue ?? ''}
                onChange={handleChange}
                error={errors[field.id]}
                state={state}
              />
            </ConditionalField>

            {page.id === 'C1' && field.id === 'aantalVolwassen' && (() => {
              const mensen = Number(currentPageData.aantalMensen ?? 0);
              const volwassen = Number(currentPageData.aantalVolwassen ?? 0);
              const kinderen = Math.max(0, mensen - volwassen);
              const showChildren = kinderen > 0;
              return showChildren ? (
                <View style={styles.fieldContainer}>
                  <Text style={styles.summaryLabelBold}>
                    Totaal aantal kinderen: {kinderen}
                  </Text>
                </View>
              ) : null;
            })()}
          </React.Fragment>
        ))}
      </ScrollView>
      <View
        style={[
          styles.buttonContainer,
          {
            bottom: insets.bottom,
            paddingBottom: Math.max(20, insets.bottom + 8),
          },
        ]}>
        {!isFirst && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onPrev}>
            <Text style={styles.secondaryButtonText}>Vorige</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          disabled={false}>
          <Text style={styles.buttonText}>
            {isLast ? 'Bekijk Resultaat' : 'Volgende'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WizardPage;
