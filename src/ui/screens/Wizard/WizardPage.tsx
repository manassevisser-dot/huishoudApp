// src/ui/screens/Wizard/WizardPage.tsx
import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';
import FormField from '@ui/components/fields/FormField';
import ConditionalField from '@components/ConditionalField';
import { useFormContext } from '@app/context/FormContext';
import { validateField } from '@utils/validation';
import { evaluateCondition } from '@utils/conditions';
import { PageConfig } from 'src/shared-types/form';
import { showWizardProgress } from '@config/features';
import ChipButton from '../../components/ChipButton';
import { Member, WoningType, AutoCount } from 'src/shared-types/form';
// Nieuw: progress-indicator props (aangeleverd door WizardController)
type PageProps = {
  page: PageConfig;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  totalPages?: number;
  currentPageIndex?: number;
};

const WizardPage: React.FC<PageProps> = ({
  page,
  onNext,
  onPrev,
  isFirst,
  isLast,
  totalPages,
  currentPageIndex,
}) => {
  const insets = useSafeAreaInsets();
  const { styles, colors } = useAppStyles();
  const { state, dispatch } = useFormContext();
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const currentPageData = state[page.id] ?? {};
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Ensure aantalVolwassen <= aantalMensen & max 7
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
    const field = page.fields.find((f) => f.id === fieldId)!;
    newErrors[fieldId] = validateField(field, value, state);
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
      if (evaluateCondition(field.conditional, state, page.id)) {
        const value = currentPageData[field.id];
        const error = validateField(field, value, state);
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
    } else if (!hasError) {
      onNext();
    }
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>{page.title}</Text>

      {/* C4 — Wonen chips boven 'Leden van het huishouden' */}
      {page.id === 'C4' && (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.summaryLabelBold}>Wonen</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {typeof state.C4?.woning === 'string'
                ? `Type: ${state.C4?.woning}`
                : 'Kies woningtype'}
            </Text>
          </View>
          <View style={styles.chipContainer}>
            {(['Koop', 'Huur', 'Kamer', 'Anders'] as WoningType[]).map((w) => (
              <ChipButton
                key={w}
                label={w}
                selected={state.C4?.woning === w}
                onPress={() => {
                  dispatch({ type: 'SET_PAGE_DATA', pageId: 'C4', data: { woning: w } });
                }}
                accessibilityLabel={`Woning: ${w}`}
              />
            ))}
          </View>
        </View>
      )}

      {/*
        TODO(feature-flag): Onderstaande indicator conditioneel maken via features.showWizardProgress
        zodra er een features.ts bestaat. Voor nu: render indien props aanwezig zijn.
      */}

      {showWizardProgress &&
        typeof totalPages === 'number' &&
        typeof currentPageIndex === 'number' &&
        totalPages > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <View
                // Stabiele key op index; het is een vaste reeks punten (geen data-id)
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 4,
                  backgroundColor: i === currentPageIndex ? colors.primary : colors.border,
                }}
                accessibilityLabel={`Wizard stap ${i + 1} van ${totalPages}${i === currentPageIndex ? ' (actief)' : ''}`}
                accessible
              />
            ))}
          </View>
        )}

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
      >
        {page.fields.map((field) => (
          <React.Fragment key={field.id}>
            <ConditionalField conditional={field.conditional} pageId={page.id}>
              <FormField
                pageId={page.id}
                field={field}
                value={currentPageData[field.id] ?? field.defaultValue ?? ''}
                onChange={(fieldId, value) => handleChange(fieldId, value)}
                error={errors[field.id]}
                state={state}
              />
            </ConditionalField>

            {/* Waarschuwingen C1 */}
            {page.id === 'C1' && evaluateCondition(field.conditional, state, page.id) && (
              <>
                {(field.id === 'aantalMensen' || field.id === 'aantalVolwassen') &&
                  (() => {
                    const val = Number(currentPageData[field.id] ?? 0);
                    if (
                      (field.id === 'aantalMensen' && val >= 10) ||
                      (field.id === 'aantalVolwassen' && val >= 7)
                    ) {
                      return (
                        <Text style={styles.alertErrorText}>maximaal aantal personen bereikt</Text>
                      );
                    }
                    if (
                      (field.id === 'aantalMensen' && val >= 7) ||
                      (field.id === 'aantalVolwassen' && val >= 5)
                    ) {
                      return (
                        <Text style={styles.alertWarningText}>u nadert het maximaal aantal</Text>
                      );
                    }
                    return null;
                  })()}

                {/* Totaal aantal kinderen */}
                {field.id === 'aantalVolwassen' &&
                  (() => {
                    const mensen = Number(currentPageData.aantalMensen ?? 0);
                    const volwassen = Number(currentPageData.aantalVolwassen ?? 0);
                    const kinderen = Math.max(0, mensen - volwassen);
                    return kinderen > 0 ? (
                      <View style={styles.fieldContainer}>
                        <Text style={styles.summaryLabelBold}>
                          Totaal aantal kinderen: {kinderen}
                        </Text>
                      </View>
                    ) : null;
                  })()}
              </>
            )}
          </React.Fragment>
        ))}
      </ScrollView>

      <View
        style={[
          styles.buttonRow,
          {
            bottom: insets.bottom,
            paddingBottom: Math.max(20, insets.bottom + 8),
          },
        ]}
      >
        {!isFirst && (
          <TouchableOpacity style={[styles.primary, styles.secondary]} onPress={onPrev}>
            <Text style={styles.secondaryText}>Vorige</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.primary} onPress={handleNext}>
          <Text style={styles.primaryText}>{isLast ? 'Bekijk Resultaat' : 'Volgende'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WizardPage;
