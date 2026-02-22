/**
 * @file_intent Centraliseert de fundamentele design tokens (spacing, typografie, radius, etc.) die de basis vormen van het design system.
 * @repo_architecture Domain Layer - Constants.
 * @term_definition Design Token = Een primitieve, benoemde waarde voor een visueel designattribuut (bijv. `Space.sm` = 8). Dit zijn de atomaire bouwstenen.
 * @contract Dit bestand exporteert `Tokens`, een `as const` object dat alle design tokens groepeert (`Space`, `Type`, `Radius`, `Sizes`, `Shadows`, `Opacity`). Het zorgt voor een centrale, onveranderlijke bron van waarheid voor de visuele stijl.
 * @ai_instruction Wees terughoudend met het toevoegen van nieuwe tokens. Het doel is een beperkte, consistente set. Bij het aanpassen, overweeg de impact op de gehele app. Deze waarden moeten onafhankelijk zijn van thema (light/dark).
 */
// src/domain/constants/Tokens.ts
export const Space = { xs: 4, sm: 8, badge: 6, md: 12, lg: 16, xl: 20, xxl: 24 } as const;
export const Type = { xs: 12, sm: 14, md: 16, lg: 17, xl: 18, h2: 28, kpi: 48 } as const;
export const Radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  round: 20,
  circle: 999,
  pill: 20,
} as const;
export const Sizes = { 
  inputHeight: 48, 
  checkbox: 24, 
  toggleWidth: 80, 
  hitTarget: 44, 
  counterValue: 48 
} as const;

// Definieer eerst losse shadows (sm/md/lg), maak daarna alias level1/2/3
const shadowSm = { ios: { y: 1, radius: 2, opacity: 0.05 }, android: { elevation: 2 } };
const shadowMd = { ios: { y: 2, radius: 4, opacity: 0.1 }, android: { elevation: 3 } };
const shadowLg = { ios: { y: 2, radius: 8, opacity: 0.1 }, android: { elevation: 4 } };

export const Shadows = {
  // primaire naamgeving
  sm: shadowSm,
  md: shadowMd,
  lg: shadowLg,
  // aliassen voor backwards-compat
  level1: shadowSm,
  level2: shadowMd,
  level3: shadowLg,
} as const;

export const Opacity = {
  transparent: 0,
  disabled: 0.5, 
  solid: 1,      
} as const;

export const Tokens = { Space, Type, Radius, Sizes, Shadows, Opacity } as const;
export type TokensType = typeof Tokens;