//src/screens/Wizard/WizardController.tsx
import * as React from 'react';
import { View } from 'react-native';
import WizardPage from './WizardPage';
import { PageConfig } from '../../types/form';
import { useFormContext } from '@context/FormContext';

// Importeer de bestaande PageConfigs (feiten uit repo)
import { C1Config } from './pages/C1.config';
import { C4Config } from './pages/C4.config';
import { C7Config } from './pages/C7.config';
import { C10Config } from './pages/C10.config';

// De wizard-flow (volgorde conform handover)
const PAGES: PageConfig[] = [C1Config, C4Config, C7Config, C10Config];

type WizardControllerProps = {
  pages?: PageConfig[];
  pageIndex?: number;
  onNext?: () => void;
  onPrev?: () => void;
};

const WizardController: React.FC<WizardControllerProps> = (props) => {
  const { state, dispatch } = useFormContext();
  const effectivePages = props.pages ?? PAGES;
  const totalPages = effectivePages.length;
  const isControlled = typeof props.pageIndex === 'number' && !!props.onNext && !!props.onPrev;

  // Uncontrolled fallback
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(0);
  const currentPageIndex = isControlled ? (props.pageIndex as number) : uncontrolledIndex;

  const handleNext = React.useCallback(() => {
    if (isControlled) return props.onNext!();
    setUncontrolledIndex((prev) => Math.min(prev + 1, totalPages - 1));
  }, [isControlled, props, totalPages]);

  const handlePrev = React.useCallback(() => {
    if (isControlled) return props.onPrev!();
    setUncontrolledIndex((prev) => Math.max(prev - 1, 0));
  }, [isControlled, props]);

  const page = effectivePages[currentPageIndex];
  const isFirst = currentPageIndex === 0;
  const isLast = currentPageIndex === totalPages - 1;

  // ============================================
  // A2 FIX: Just-in-time ALIGN bij page-enter C4
  // ============================================

  // ============================================
  // A2 FIX: Just-in-time ALIGN bij page-enter C4
  // ============================================
  React.useEffect(() => {
      id: page?.id,
      pageIndex: currentPageIndex,
      totalPages,
    });

    if (page?.id === 'C4') {

      const aantalMensen = Math.max(1, Number(state.C1?.aantalMensen ?? 1));
      const aantalVolwassen = Math.min(
        aantalMensen,
        Math.max(1, Number(state.C1?.aantalVolwassen ?? 1)),
      );

      dispatch({
        type: 'ALIGN_HOUSEHOLD_MEMBERS',
        payload: { aantalMensen, aantalVolwassen },
      });
    }
  }, [page?.id]);

  // ============================================
  // RENDER
  // ============================================
  if (!page) {
    return <View />;
  }

  return (
    <WizardPage
      page={page}
      isFirst={isFirst}
      isLast={isLast}
      onNext={handleNext}
      onPrev={handlePrev}
      totalPages={totalPages}
      currentPageIndex={currentPageIndex}
    />
  );
};

export default WizardController;
