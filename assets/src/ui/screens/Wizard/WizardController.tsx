// src/ui/screens/Wizard/WizardController.tsx
import * as React from 'react';
import { View } from 'react-native';

// LET OP: pad naar WizardPage kan in jouw project anders zijn
import WizardPage from './WizardPage';

// Types zoals gebruikt in WizardPage — pas pad aan indien nodig
import { PageConfig } from 'src/shared-types/form';

// Compat-shim (zoals voorgesteld): setWizardState terug als contract
import { useWizard } from '@a../a../a../a../a../a../a../a../a../a../a../a../a../a../a../app/context/WizardContext';

// -------------------------------------------------------------
// Props & component handtekening
// -------------------------------------------------------------
type WizardControllerProps = {
  /** De lijst met pagina-configs voor de wizard in de gewenste volgorde */
  pages: PageConfig[];

  /** Startindex (default: 0) */
  initialIndex?: number;

  /** Callback wanneer laatste pagina 'Volgende' triggert */
  onFinish?: () => void;
};

const WizardController: React.FC<WizardControllerProps> = (props) => {
  const { pages, initialIndex = 0, onFinish } = props;

  // Veiligheidsnet voor lege input
  const totalPages = Array.isArray(pages) ? pages.length : 0;
  const [currentPageIndex, setCurrentPageIndex] = React.useState<number>(
    Math.min(Math.max(0, initialIndex), Math.max(0, totalPages - 1)),
  );

  // Huidige pagina (kan undefined zijn bij lege pages)
  const page = pages[currentPageIndex];

  // Compatibiliteits-shim: voed oude consumers die op setWizardState leunen
  const { setWizardState } = useWizard();

  // -----------------------------------------------------------
  // Effect: bij elke paginawissel of paginalijst-update, shim bijwerken
  // -----------------------------------------------------------
  React.useEffect(() => {
    // Alleen bij geldige pagina
    if (!page) return;

    setWizardState({
      id: page.id,
      pageIndex: currentPageIndex,
      totalPages: totalPages,
    });
  }, [page?.id, currentPageIndex, totalPages, setWizardState]);

  // -----------------------------------------------------------
  // Navigatiehandlers
  // -----------------------------------------------------------
  const goPrev = React.useCallback(() => {
    setCurrentPageIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = React.useCallback(() => {
    // Als dit de laatste pagina is → finish
    if (currentPageIndex >= totalPages - 1) {
      onFinish?.();
    } else {
      setCurrentPageIndex((i) => Math.min(totalPages - 1, i + 1));
    }
  }, [currentPageIndex, totalPages, onFinish]);

  // -----------------------------------------------------------
  // Render: enkel de huidige pagina
  // -----------------------------------------------------------
  if (!page || totalPages === 0) {
    // Je kunt hier ook een fallback-view renderen
    return <View />;
  }

  return (
    <WizardPage
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

export default WizardController;
