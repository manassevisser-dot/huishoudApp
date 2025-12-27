// src/tempwizard/TempPages/TempWizardController.tsx
import * as React from 'react';
import { View } from 'react-native';
import TempWizardPage from './TempWizardPage';
import type { TempPageConfig } from 'src/shared-types/temp-form'; // pas pad aan als je eigen types hebt

type TempWizardControllerProps = {
  pages: TempPageConfig[];
  initialIndex?: number;
  onFinish?: () => void;
};

const TempWizardController: React.FC<TempWizardControllerProps> = ({
  pages,
  initialIndex = 0,
  onFinish,
}) => {
  const totalPages = Array.isArray(pages) ? pages.length : 0;
  const [currentPageIndex, setCurrentPageIndex] = React.useState<number>(
    Math.min(Math.max(0, initialIndex), Math.max(0, totalPages - 1)),
  );

  const page = pages[currentPageIndex];

  const goPrev = React.useCallback(() => {
    setCurrentPageIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = React.useCallback(() => {
    if (currentPageIndex >= totalPages - 1) {
      onFinish?.();
    } else {
      setCurrentPageIndex((i) => Math.min(totalPages - 1, i + 1));
    }
  }, [currentPageIndex, totalPages, onFinish]);

  if (!page || totalPages === 0) {
    return <View />; // skeleton fallback
  }

  return (
    <TempWizardPage
      page={page}
      onNext={goNext}
      onPrev={goPrev}
      isFirst={currentPageIndex === 0}
      isLast={currentPageIndex === totalPages - 1}
      totalPages={totalPages}
      currentPageIndex={currentPageIndex}
    />
  );
};

export default TempWizardController;
