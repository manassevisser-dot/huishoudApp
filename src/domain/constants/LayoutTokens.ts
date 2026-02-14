// src/domain/constants/LayoutTokens.ts
import {Tokens} from '@domain/constants/Tokens';

export const Space = Tokens.Space;

// LAYOUT TOKENS — herbruikbare structuur-patronen
// Geen kleuren, geen spacing-waarden — alleen compositie.
// Waarden komen uit Tokens.ts (Space) waar nodig.
//
// Gebruik:  ...Layout.rowBetween  in StyleRegistry-modules

export const Layout = {
    // ── Flex basis ──────────────────────────────────
    fullWidth:        { flex: 1 } as const,
  
    // ── Row varianten ──────────────────────────────
    row:              { flexDirection: 'row' as const },
    rowBetween:       { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
    rowCenter:        { flexDirection: 'row' as const, alignItems: 'center' as const },
    rowBetweenCenter: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
    rowWrap:          { flexDirection: 'row' as const, flexWrap: 'wrap' as const },
    rowWrapCenter:    { flexDirection: 'row' as const, flexWrap: 'wrap' as const, justifyContent: 'center' as const },
  // ── Rij varianten (Uitbreiding) ──────────────
  rowCentered:      { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const },
    
  // ── Positionering (Uitbreiding) ─────────────
  absolute:         { position: 'absolute' as const },
  hidden:           { overflow: 'hidden' as const },
  
    // ── Alignment ──────────────────────────────────
    centered:         { alignItems: 'center' as const, justifyContent: 'center' as const },
    centerText:       { textAlign: 'center' as const },
    rightText:        { textAlign: 'right' as const },
  
    // ── Positionering ──────────────────────────────
    pinBottom:        { position: 'absolute' as const, bottom: 0, left: 0, right: 0 },
    relative:         { position: 'relative' as const },
  
    footer: {
      minHeight: 80,
      horizontalPadding: Space.xl,
      verticalPadding: Space.md,
      safeAreaMin: 16, // De minimale padding onderaan als insets.bottom 0 is
    },
  
    buttonRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      width: '100%',
    }
  
  } as const;
  
  // Type-export zodat consumers het kunnen typen als ze willen
  export type LayoutToken = keyof typeof Layout;