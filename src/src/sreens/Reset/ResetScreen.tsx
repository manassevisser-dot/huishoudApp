// src/screens/Reset/ResetScreen.tsx
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/AppStyles';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  onClose: () => void;
  onWissen: () => void;
  onHerstel: () => void;
};

const ResetScreen: React.FC<Props> = ({ onClose, onWissen, onHerstel }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const handleWissen = () => {
    Alert.alert(
      'WISSEN - Alle data verwijderen',
      'Dit verwijdert ALLE data inclusief setup, transacties en instellingen. Deze actie kan niet ongedaan worden gemaakt.',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'WISSEN',
          style: 'destructive',
          onPress: onWissen,
        },
      ]
    );
  };
  
  const handleHerstel = () => {
    Alert.alert(
      'HERSTEL - Setup opnieuw doorlopen',
      'Dit reset de setup wizard naar lege velden. Uw transacties en instellingen blijven behouden.',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'HERSTEL',
          onPress: onHerstel,
        },
      ]
    );
  };
  
  return (
    <View style={theme === 'dark' ? styles.containerDark : styles.container}>
      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}>
          <Text style={styles.pageTitle}>Reset Opties</Text>
          
          <View style={[styles.dashboardCard, { marginBottom: 24 }]}>
            <Text style={[styles.label, { marginBottom: 8 }]}>WISSEN</Text>
            <Text style={styles.summaryDetail}>
              Verwijdert ALLE data: setup, transacties, en instellingen. U moet de app opnieuw instellen.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#FF3B30', marginTop: 16, marginLeft: 0 }]}
              onPress={handleWissen}
            >
              <Text style={styles.buttonText}>WISSEN</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.dashboardCard, { marginBottom: 24 }]}>
            <Text style={[styles.label, { marginBottom: 8 }]}>HERSTEL</Text>
            <Text style={styles.summaryDetail}>
              Reset alleen de setup wizard naar lege velden. Transacties en instellingen blijven behouden.
            </Text>
            <TouchableOpacity
              style={[styles.button, { marginTop: 16, marginLeft: 0 }]}
              onPress={handleHerstel}
            >
              <Text style={styles.buttonText}>HERSTEL</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
      <View style={[styles.buttonContainer, { bottom: insets.bottom, paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Terug naar Options</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetScreen;
