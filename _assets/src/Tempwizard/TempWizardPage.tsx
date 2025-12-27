// src/tempwizard/TempPages/TempWizardPage.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { TempPageConfig } from 'src/shared-types/temp-form';

type TempWizardPageProps = {
  page: TempPageConfig;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  totalPages?: number;
  currentPageIndex?: number;
};

const TempWizardPage: React.FC<TempWizardPageProps> = ({
  page,
  onNext,
  onPrev,
  isFirst,
  isLast,
  totalPages,
  currentPageIndex,
}) => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{page.title}</Text>

      {/* Placeholder velden weergave */}
      {page.fields?.map((f) => (
        <View key={f.id} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16 }}>
            {f.label} ({f.type})
          </Text>
        </View>
      ))}

      {/* Eenvoudige voortgangspunten (optioneel) */}
      {typeof totalPages === 'number' && typeof currentPageIndex === 'number' && totalPages > 1 && (
        <View style={{ flexDirection: 'row', marginVertical: 16 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <View
              key={i}
              accessibilityLabel={`Wizard stap ${i + 1} van ${totalPages}${i === currentPageIndex ? ' (actief)' : ''}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginRight: 6,
                backgroundColor: i === currentPageIndex ? '#2B6CB0' : '#CBD5E0',
              }}
            />
          ))}
        </View>
      )}

      {/* Navigatieknoppen */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {!isFirst && (
          <TouchableOpacity
            onPress={onPrev}
            style={{ padding: 12, backgroundColor: '#EDF2F7', borderRadius: 6 }}
          >
            <Text>Vorige</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onNext}
          style={{ padding: 12, backgroundColor: '#2B6CB0', borderRadius: 6 }}
        >
          <Text style={{ color: 'white' }}>{isLast ? 'Voltooien' : 'Volgende'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TempWizardPage;
