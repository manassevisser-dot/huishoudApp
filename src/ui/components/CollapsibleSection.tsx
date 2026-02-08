// src/ui/components/CollapsibleSection.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppStyles } from '@styles/useAppStyles';
import { labelFromToken } from '@domain/constants/labelResolver';

interface CollapsibleSectionProps {
  /**
   * Token voor de label (wordt opgelost via labelFromToken)
   * Bijv: 'LABEL_TOESLAGEN' → 'Toeslagen'
   */
  labelToken: string;
  
  /**
   * Of de sectie standaard open staat
   */
  defaultExpanded?: boolean;
  
  /**
   * Child fields die in de sectie gerenderd worden
   */
  children: React.ReactNode;
}

/**
 * CollapsibleSection - Pure presentational component
 * 
 * Verantwoordelijkheden:
 * - Lokale UI state (expanded/collapsed) via useState
 * - Rendering van expand/collapse pattern
 * - Label resolution via labelFromToken
 * - Token-based styling via useAppStyles
 * 
 * Weet NIETS over:
 * - Welke velden erin zitten (krijgt children)
 * - Waarom deze velden bij elkaar horen (krijgt labelToken)
 * - Business logic (krijgt alleen presentational props)
 * 
 * Dit is een DUMB component zoals bedoeld in ADR-04:
 * - Geen orchestrator calls
 * - Geen state mutations
 * - Alleen lokale presentational state (isExpanded)
 */
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  labelToken,
  defaultExpanded = false,
  children,
}) => {
  const { styles } = useAppStyles();
  
  // Lokale presentational state - niet domain state!
  // Dit is pure UI: is de accordion open of dicht?
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Resolve label van token naar menselijke tekst
  const label = labelFromToken(labelToken);

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        accessibilityRole="button"
        accessibilityLabel={`${label} ${isExpanded ? 'inklappen' : 'uitklappen'}`}
        accessibilityState={{ expanded: isExpanded }}
      >
        <Text style={styles.collapsibleLabel}>{label}</Text>
        <Text style={styles.collapsibleIcon}>
          {isExpanded ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.collapsibleContent}>
          {children}
        </View>
      )}
    </View>
  );
};