import React from 'react';
import { UI_SECTIONS, UISection } from '../../constants/uiSections';

interface WizardPageProps {
  sectionId: UISection;
  children: React.ReactNode;
}

export const WizardPage: React.FC<WizardPageProps> = ({ sectionId, children }) => {
  return (
    <div className="wizard-page">
      <h2>Sectie: {UI_SECTIONS[sectionId]}</h2>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};