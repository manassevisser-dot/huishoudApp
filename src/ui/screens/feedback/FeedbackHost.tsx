// src/ui/screens/feedback/FeedbackHost.tsx
// Helemaal bovenaan, direct na imports

/**
 * Pure projector voor gebruikersfeedback op basis van AuditEvents.
 *
 * @module ui/screens/feedback
 * @see {@link ./README.md | FeedbackHost - Details}
 *
 * @remarks
 * - Rendert toasts (non-blocking) en critical modals (blocking)
 * - Geen beslissingslogica; alles komt van FeedbackOrchestrator
 */

import React, { useEffect } from 'react';
import { AccessibilityInfo, Modal, Text, TouchableOpacity, View } from 'react-native'; // 👈 Platform verwijderd
import { useAuditFeedback } from '@ui/providers/FeedbackProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import type { AppStyles } from '@ui/styles/useAppStyles';
import type { ColorScheme } from '@ui/kernel';
import type { FeedbackItem, FeedbackSeverity, RecoveryAction } from '@app/orchestrators/FeedbackOrchestrator';
import WizStrings from '@config/WizStrings';

const S = WizStrings.feedback;

// ─── Helpers ────────────────────────────────────────────────────────────────
const makeSeverityTextColor = (severity: FeedbackSeverity, colors: ColorScheme): string => {
  if (severity === 'warning') return colors.warning;
  return colors.error;
};

const getSeverityStyleKey = (severity: FeedbackSeverity): 'toastWarning' | 'toastError' | 'toastCritical' => {
  switch (severity) {
    case 'warning': return 'toastWarning';
    case 'error': return 'toastError';
    case 'critical': return 'toastCritical';
  }
};

// ✅ VERWIJDERD: const TOAST_STACK_TOP = Platform.select(...)

const RECOVERY_LABEL: Record<RecoveryAction, string> = {
  reset_full: S.restoreApp,
  reset_setup: S.restoreSettings,
  dismiss: S.dismiss,
};

// ─── Root Component ─────────────────────────────────────────────────────────
export const FeedbackHost: React.FC = () => {
  const { items, dismiss, executeRecovery } = useAuditFeedback();
  const { styles, colors } = useAppStyles(); // 👈 styles bevat nu toastStack met top
  const toasts = items.filter(i => i.kind === 'toast');
  const modal = items.find(i => i.kind === 'modal');

  return (
    <>
      {/* ✅ Geen inline style meer nodig - top zit in styles.toastStack */}
      <View style={styles.toastStack} pointerEvents="box-none">
        {toasts.map(item => <ToastBanner key={item.id} item={item} onDismiss={dismiss} styles={styles} colors={colors} />)}
      </View>
      {modal !== undefined && <CriticalModal item={modal} onDismiss={dismiss} onRecovery={executeRecovery} styles={styles} colors={colors} />}
    </>
  );
};

// ─── ToastBanner (≤30 lines) ────────────────────────────────────────────────
interface ToastBannerProps { item: FeedbackItem; onDismiss: (id: string) => void; styles: AppStyles; colors: ColorScheme; }

const ToastBanner: React.FC<ToastBannerProps> = ({ item, onDismiss, styles, colors }) => {
  useEffect(() => {
  if (item.autoDismissMs !== undefined) {
    const t = setTimeout(() => onDismiss(item.id), item.autoDismissMs);
    return () => clearTimeout(t);
  }
}, [item.id, item.autoDismissMs, onDismiss]);
  useEffect(() => { AccessibilityInfo.announceForAccessibility(item.message); }, [item.message]); // WCAG 2.1 SC 4.1.3

  const severityKey = getSeverityStyleKey(item.severity);
  const textColor = makeSeverityTextColor(item.severity, colors);

  return (
    <View testID={`toast-${item.severity}`} accessible accessibilityRole="alert" accessibilityLabel={item.message} accessibilityLiveRegion="assertive" style={[styles.toast, styles[severityKey]]}>
      <Text style={[styles.toastText, { color: textColor }]} numberOfLines={2}>{item.message}</Text>
      <TouchableOpacity onPress={() => onDismiss(item.id)} accessibilityLabel="Close notification" accessibilityRole="button" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.toastDismissButton} testID="toast-dismiss">
        <Text style={[styles.toastDismissText, { color: textColor }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── CriticalModal (≤30 lines) ──────────────────────────────────────────────
interface CriticalModalProps {
  item: FeedbackItem;
  onDismiss: (id: string) => void;
  onRecovery: (action: RecoveryAction, id: string) => void;
  styles: AppStyles;
  colors: ColorScheme;
}

const CriticalModal: React.FC<CriticalModalProps> = ({ item, onDismiss, onRecovery, styles, colors }) => {
  // ✅ Expliciete checks voor nullable values
  const hasRecovery = item.recoveryAction !== undefined && item.recoveryAction !== 'dismiss';
  
  // ✅ Narrowing naar local variable — TypeScript kan dit wel volgen
  const recoveryAction = hasRecovery ? item.recoveryAction : undefined;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent accessibilityViewIsModal onRequestClose={() => onDismiss(item.id)} testID="critical-modal">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard} accessibilityLabel={`Critical error: ${item.message}`} accessible>
          <View style={styles.modalHeader}><Text style={styles.modalIcon}>⚠️</Text><Text style={styles.modalTitle}>{S.somethingWentWrong}</Text></View>
          <Text style={styles.modalBody}>{item.message}</Text>
          
          {/* ✅ Gebruik de local variable in de callback */}
          {hasRecovery && recoveryAction !== undefined && (<TouchableOpacity style={styles.recoveryButton} onPress={() => onRecovery(recoveryAction, item.id)} 
              accessibilityRole="button" accessibilityLabel={RECOVERY_LABEL[recoveryAction]} testID="recovery-button">
              <Text style={[styles.recoveryButtonText, { color: colors.error }]}>{RECOVERY_LABEL[recoveryAction]}</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.dismissModalButton} 
            onPress={() => onDismiss(item.id)} 
            accessibilityRole="button" 
            accessibilityLabel={S.close}
            testID="modal-dismiss"
          >
            <Text style={styles.dismissModalText}>{S.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};