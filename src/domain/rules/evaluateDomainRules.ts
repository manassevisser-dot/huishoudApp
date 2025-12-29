// Geen import van 'crypto' meer voor React Native
export const evaluateRules = (data: any) => {
  // Simpele fallback voor UUID/ID generatie
  const mockId = Math.random().toString(36).substring(7);
  
  return {
    id: mockId,
    timestamp: Date.now(),
    isValid: true
  };
};