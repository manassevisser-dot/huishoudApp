// src/ui/constants/labelResolver.ts
import WizStrings from '@config/WizStrings';

export function labelFromToken(token: string): string {
  // Probeer in vaste secties:
  if (token in (WizStrings.wizard ?? {}))     return (WizStrings.wizard as Record<string,string>)[token] ?? token;
  if (token in (WizStrings.dashboard ?? {}))  return (WizStrings.dashboard as Record<string,string>)[token] ?? token;
  if (token in (WizStrings.common ?? {}))     return (WizStrings.common as Record<string,string>)[token] ?? token;
  // Fallback
  return token;
}