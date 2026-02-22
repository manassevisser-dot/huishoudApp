import React from 'react';
import { ScrollView } from 'react-native';
import { DynamicSection } from '@ui/sections/sections';
import { NavigationFooter } from '@ui/navigation/NavigationFooter';
import { DailyInputActionFooter } from '@ui/screens/actions/DailyInputActionFooter';
import type { RenderScreenVM } from '@app/orchestrators/MasterOrchestrator';

interface ScreenRendererProps {
  screenVM: RenderScreenVM;
  topPadding: number;
  onSaveDailyTransaction: () => void;
}

const SectionList: React.FC<{ screenVM: RenderScreenVM; topPadding: number }> = ({
  screenVM,
  topPadding,
}) => (
  <ScrollView contentContainerStyle={{ paddingTop: topPadding }}>
    {screenVM.sections.map((section) => (
      <DynamicSection
        key={section.sectionId}
        sectionId={section.sectionId}
        title={section.title}
        layout={section.layout}
        uiModel={section.uiModel}
        children={section.children}
      />
    ))}
  </ScrollView>
);

const DefaultScreenRenderer: React.FC<ScreenRendererProps> = ({ screenVM, topPadding }) => (
  <SectionList screenVM={screenVM} topPadding={topPadding} />
);

const DailyInputScreenRenderer: React.FC<ScreenRendererProps> = ({
  screenVM,
  topPadding,
  onSaveDailyTransaction,
}) => (
  <>
    <SectionList screenVM={screenVM} topPadding={topPadding} />
    <DailyInputActionFooter onSave={onSaveDailyTransaction} />
  </>
);

const WizardScreenRenderer: React.FC<ScreenRendererProps> = ({ screenVM, topPadding }) => (
  <>
    <SectionList screenVM={screenVM} topPadding={topPadding} />
    <NavigationFooter />
  </>
);

type ScreenRenderer = React.ComponentType<ScreenRendererProps>;

const SCREEN_RENDERERS: Record<string, ScreenRenderer> = {
  DAILY_INPUT: DailyInputScreenRenderer,
};

const SCREEN_TYPE_RENDERERS: Record<string, ScreenRenderer> = {
  WIZARD: WizardScreenRenderer,
};

export function resolveScreenRenderer(screenVM: RenderScreenVM): ScreenRenderer {
  const byId = SCREEN_RENDERERS[screenVM.screenId];
  if (byId !== undefined) {
    return byId;
  }

  const byType = SCREEN_TYPE_RENDERERS[screenVM.type];
  if (byType !== undefined) {
    return byType;
  }

  return DefaultScreenRenderer;
}
