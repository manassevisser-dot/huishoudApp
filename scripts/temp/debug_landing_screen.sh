#!/bin/bash
set -e

echo "🐛 Debugging LandingScreen..."

# We maken een super simpele versie die GEEN hooks gebruikt
# Als dit werkt, weten we dat het aan de hooks/context ligt
cat > src/ui/screens/Wizard/LandingScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const LandingScreen = ({ onSignup }: any) => {
  return (
    <View testID="landing-screen">
      <Text>Welkom</Text>
      <TouchableOpacity onPress={onSignup} testID="btn-aanmelden">
        <Text>Aanmelden</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LandingScreen;
EOF

echo "✅ LandingScreen versimpeld."
echo "👉 Draai nu: npm test src/__tests__/WAI009_FocusManagement.test.tsx"