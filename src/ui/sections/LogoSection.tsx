/**
 * @file_intent Rendert het app-logo als een zelfstandige, herbruikbare sectie-component.
 * @repo_architecture UI Layer - Section (statisch, geen entry-pipeline).
 * @term_definition
 *   - `LogoSection`: Statische visuele sectie. Geen fieldIds, geen ViewModel-pipeline.
 *     Bedoeld voor schermen die het logo centraal tonen (LANDING, toekomstige splash).
 *   - `size='small'`: Compact formaat voor hergebruik in headers of kleinere schermen.
 *   - `size='large'`: Volledig gecentreerd logo voor AUTH-schermen (standaard).
 * @contract
 *   - Geen props vereist. `size` is optioneel, default='large'.
 *   - Afhankelijk van `assets/logo.png` via een relatief pad vanuit deze locatie.
 *   - Wordt gerenderd door `LandingScreenRenderer` wanneer section.layout === 'isLogo'.
 * @ai_instruction
 *   - Voeg hier GEEN domein-logica toe. Dit is een pure presentatie-component.
 *   - Voor andere schermen: gebruik `<LogoSection size="small" />` direct in de renderer.
 *   - Stijlvarianten (small/large) uitbreiden via de `SIZE_STYLES` map, niet via inline styles.
 */
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export type LogoSize = 'small' | 'large';

interface LogoSectionProps {
  size?: LogoSize;
}

const SIZE_STYLES: Record<LogoSize, { width: number; height: number }> = {
  small: { width: 80,  height: 80  },
  large: { width: 180, height: 180 },
};

const LOGO_SOURCE = require('../../../assets/logo.png') as number;

export const LogoSection: React.FC<LogoSectionProps> = ({ size = 'large' }) => (
  <View style={styles.container} testID="logo-section">
    <Image
      source={LOGO_SOURCE}
      style={[styles.image, SIZE_STYLES[size]]}
      resizeMode="contain"
      accessibilityLabel="Phoenix logo"
      accessibilityRole="image"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  image: {
    // Breedte/hoogte worden overschreven door SIZE_STYLES.
  },
});
