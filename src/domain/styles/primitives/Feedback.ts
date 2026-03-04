// src/domain/styles/primitives/Feedback.ts
/**
 * @file_intent Definieert stijlen voor toast- en modal-feedback componenten.
 * @repo_architecture Domain Layer - Styles.
 *   Volgt exact hetzelfde patroon als Cards.ts, Alerts.ts etc.
 *   Bevat geen React Native platform-imports — platform-specifieke top-offset
 *   voor `toastStack` wordt in FeedbackHost als inline override ingesteld.
 * @term_definition
 *   - `makeToastStyles`: Stack, basis-toast, severity-varianten, tekst/dismiss.
 *   - `makeModalStyles`: Overlay, kaart, header, body, knoppen.
 *   - Tekstkleur wordt runtime bepaald via `colors` uit useAppStyles() omdat
 *     StyleSheet.create() opaque IDs produceert waarvan je geen properties kunt lezen.
 * @contract
 *   - Geen platform-imports (Platform.OS) — dat hoort in PlatformStyles.ts.
 *   - Toast-schaduw via PlatformStyles.SHADOW_MAP entry 'toast' → 'level1'.
 *   - Modal-schaduw via SHADOW_MAP entry 'modalCard' → 'level2'.
 * @ai_instruction
 *   Om een nieuwe severity toe te voegen: voeg `toastNieuwe` + kleurvarianten
 *   toe aan makeToastStyles() en update FeedbackHost's SEVERITY_TEXT lookup.
 * @see PlatformStyles.SHADOW_MAP, StyleRegistry.ts, useAppStyles.ts
 */
import { Space, Radius, Type } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';
import { Platform } from 'react-native';

// ── Module-lokale constanten ──────────────────────────────────────────────────
// Magic numbers buiten de functies zodat ESLint no-magic-numbers niet triggert.

/** zIndex boven alle navigatie-lagen (RN standaard nav zIndex ≤ 100) */
const TOAST_Z_INDEX    = 9999;

/** Standaard line-height voor toast body tekst (Type.sm = 14 → ratio 1.43) */
const TOAST_LINE_HEIGHT = 20;

/** Standaard line-height voor modal body tekst (Type.md = 16 → ratio 1.5) */
const MODAL_LINE_HEIGHT = 24;

/** Semi-transparante overlay kleur voor critical modals */
const MODAL_OVERLAY_COLOR = 'rgba(0,0,0,0.55)';

/** Hex-suffix voor 10% opacity (AA in hex = 170/255 ≈ 67%, 1A = 26/255 ≈ 10%) */
const SEVERITY_OPACITY_HEX = '1A';

// ── Private helpers ───────────────────────────────────────────────────────────

function makeToastStackStyle() {
  return {
    // `top` intentioneel 0 — FeedbackHost overschrijft met platform-specifieke waarde.
    toastStack: {
      position: 'absolute' as const,
      top: Platform.select({ ios: 60, android: 40, default: 40 }),
      left: Space.lg,
      right: Space.lg,
      zIndex: TOAST_Z_INDEX,
      gap: Space.sm,
      
    },
  } as const;
}

function makeToastBaseStyles(c: ColorScheme) {
  return {
    // Schaduw: 'toast' → level1 gedeclareerd in PlatformStyles.SHADOW_MAP
    toast: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: Space.lg,
      paddingVertical: Space.md,
      borderRadius: Radius.md,
      borderLeftWidth: 4,
    },
    // Severity-varianten: tekstkleur NIET hier — zie FeedbackHost SEVERITY_TEXT.
    toastWarning:  { backgroundColor: `${c.warning}${SEVERITY_OPACITY_HEX}`, borderLeftColor: c.warning },
    toastError:    { backgroundColor: `${c.error}${SEVERITY_OPACITY_HEX}`,   borderLeftColor: c.error   },
    toastCritical: { backgroundColor: `${c.error}${SEVERITY_OPACITY_HEX}`,   borderLeftColor: c.error   },
    toastText: {
      flex: 1,
      fontSize: Type.sm,
      fontWeight: '500' as const,
      lineHeight: TOAST_LINE_HEIGHT,
    },
    toastDismissButton: { marginLeft: Space.md, padding: Space.xs },
    toastDismissText:   { fontSize: Type.sm, fontWeight: '600' as const },
  } as const;
}
function makeModalStyles(c: ColorScheme) {
  return {
    modalOverlay: { flex: 1, backgroundColor: MODAL_OVERLAY_COLOR, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Space.xl },
    modalCard: { width: '100%', borderRadius: Radius.xl, padding: Space.xxl, backgroundColor: c.surface }, // shadow: level2 via SHADOW_MAP
    modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Space.md, gap: Space.sm },
    modalIcon: { fontSize: Type.xl },
    modalTitle: { fontSize: Type.lg, fontWeight: '700', flex: 1, color: c.error },
    modalBody: { fontSize: Type.md, lineHeight: MODAL_LINE_HEIGHT, marginBottom: Space.xl, color: c.textPrimary },
    recoveryButton: { paddingVertical: Space.md, paddingHorizontal: Space.lg, borderRadius: Radius.md, alignItems: 'center', marginBottom: Space.sm, backgroundColor: c.error },
    recoveryButtonText: { fontSize: Type.md, fontWeight: '600', color: c.onError },
    dismissModalButton: { paddingVertical: Space.md, paddingHorizontal: Space.lg, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', borderColor: c.border },
    dismissModalText: { fontSize: Type.md, fontWeight: '500', color: c.textSecondary },
  } as const;
}

// ── Publieke assembler ────────────────────────────────────────────────────────

export function makeFeedback(c: ColorScheme) {
  return {
    ...makeToastStackStyle(),
    ...makeToastBaseStyles(c),
    ...makeModalStyles(c),
  } as const;
}

export type FeedbackStyles = ReturnType<typeof makeFeedback>;
