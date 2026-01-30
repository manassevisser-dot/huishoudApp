import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { InputCounter } from '@/ui/components/fields/InputCounter';
import { placeholderStyles } from '@/ui/styles/modules/placeholderStyles';
import { UI_SECTIONS } from '@/ui/constants/uiSections';

// Explicit interface definitions for type safety (no domain imports!)
interface ValueProvider {
  getValue(fieldId: string): unknown;
}

interface StateWriter {
  updateField(fieldId: string, value: unknown): void;
}

export interface WizardField {
  fieldId: string;
  type: string;
  labelToken: string;
  uiModel?: string;
  requiresVisibilityCheck?: boolean | string;
  requiresConstraint?: boolean | string;
  requiresDerivedValue?: boolean | string;
  options?: unknown[];
  [key: string]: unknown;
}

export interface WizardConfig {
  pageId: string;
  titleToken?: string;
  fields?: WizardField[];
  showBack?: boolean;
  showNext?: boolean;
  isLast?: boolean;
  [key: string]: unknown;
}

interface WizardPageProps {
  config: WizardConfig;
  valueProvider: ValueProvider;
  stateWriter: StateWriter;
  validate: (fieldId: string, value: unknown) => string | null;
}

export const WizardPage: React.FC<WizardPageProps> = (props) => {
  const { config, valueProvider, stateWriter } = props;
  const sectionKey = UI_SECTIONS.WIZARD ?? '[HIER_MOET_NOG_EEN_UX_KEY]';

  const handleDebugReset = () => {
    // P2 Sentinel Compliance: valideer alle velden eenmalig
    config.fields?.forEach(field => {
      const currentValue: unknown = valueProvider.getValue(field.fieldId);
      props.validate(field.fieldId, currentValue);
    });
    stateWriter.updateField('debug_reset', true);
  };

  const title = String(config?.titleToken ?? '[HIER_MOET_NOG_EEN_UX_KEY]');

  return (
    <View style={placeholderStyles.wizardPageContainer} accessibilityLabel={sectionKey}>
      <Text style={placeholderStyles.screenTitle}>{title}</Text>

      {valueProvider.getValue('show_debug') === true && (
        <TouchableOpacity
          style={placeholderStyles.debugButton}
          onPress={handleDebugReset}
          accessibilityRole="button"
          accessibilityLabel="Reset Wizard State"
        >
          <Text style={placeholderStyles.fieldCountText}>Reset Wizard State</Text>
        </TouchableOpacity>
      )}

      <View style={placeholderStyles.fieldsContainer}>
        <Text style={placeholderStyles.fieldCountText}>
          Velden aanwezig: {Array.isArray(config?.fields) ? config.fields.length : 0}
        </Text>
        {/* P3-B1: Field rendering with validation integration */}
        {Array.isArray(config?.fields) && config.fields.map((field) => {
          const currentValue: unknown = valueProvider.getValue(field.fieldId);
          
          if (field.fieldId === 'aantalMensen') {
            return (
              <View key={field.fieldId} style={placeholderStyles.fieldsContainer}>
                <Text style={placeholderStyles.fieldCountText}>
                  {field.labelToken}
                </Text>
                <InputCounter
                  fieldId={field.fieldId}
                  valueProvider={valueProvider}
                  stateWriter={(value) => stateWriter.updateField(field.fieldId, value)}
                  testIdBase="aantalMensen"
                />
                {/* P3-B1: Validatie via externe handler bij interactie */}
                <TouchableOpacity
                  onPress={() => {
                    const newValue = Number(currentValue) + 1;
                    const error = props.validate(field.fieldId, newValue);
                    if (error === null) {
                      stateWriter.updateField(field.fieldId, newValue);
                    } else {
                      console.warn(`Validation error for ${field.fieldId}:`, error);
                    }
                  }}
                  style={{ marginTop: 8 }}
                >
                  <Text style={placeholderStyles.fieldCountText}>+ (validate)</Text>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <View key={field.fieldId} style={placeholderStyles.fieldsContainer}>
              <Text style={placeholderStyles.fieldCountText}>
                {field.labelToken}: {String(currentValue ?? 'N/A')}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={placeholderStyles.screenContainer}>
        {config?.showBack === true && (
          <TouchableOpacity style={placeholderStyles.primaryButton}>
            <Text style={placeholderStyles.fieldCountText}>Vorige</Text>
          </TouchableOpacity>
        )}
        {config?.showNext === true && (
          <TouchableOpacity style={placeholderStyles.primaryButton}>
            <Text style={placeholderStyles.fieldCountText}>
              {config?.isLast === true ? 'Voltooien' : 'Volgende'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WizardPage;