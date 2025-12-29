// src/ui/screens/Wizard/WizardPage.tsx
import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { FieldRenderer } from '@ui/components/FieldRenderer';
import { useAppStyles } from '@ui/styles/useAppStyles';

interface WizardPageProps {
  config: any;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const WizardPage: React.FC<WizardPageProps & object> = ({ 
  config, 
  onNext, 
  onBack, 
  isFirst, 
  isLast 
}) => {
  const { styles } = useAppStyles();

  return (
    <SafeAreaView style={styles.pageContainer}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Sectie */}
        <View style={{ padding: 20 }}>
          <Text style={styles.summaryLabelBold}>{config.title}</Text>
          <Text style={styles.helperText}>{config.description}</Text>
        </View>

        {/* Dynamische Velden uit de Config */}
        <View style={{ paddingHorizontal: 20 }}>
          {config.fields.map((field: any) => (
            <FieldRenderer 
              key={field.id} 
              field={field} 
              pageId={config.id} 
            />
          ))}
        </View>
      </ScrollView>

      {/* Navigatie Balk onderaan */}
      <View style={[styles.footer, { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee'
      }]}>
        {!isFirst ? (
          <TouchableOpacity onPress={onBack} style={(styles as any).buttonSecondary}>
            <Text>Terug</Text>
          </TouchableOpacity>
        ) : <View />}

        <TouchableOpacity onPress={onNext} style={(styles as any).buttonPrimary}>
          <Text style={{ color: 'white' }}>
            {isLast ? 'Bereken resultaat' : 'Volgende'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};