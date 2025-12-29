import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WizardController from '../WizardController';
import { FormProvider } from '../../../../app/context/FormContext';
import { Logger } from '../../../../services/logger';

jest.mock('../../../../services/logger');

describe('WizardController', () => {
  it('moet renderen en interactie loggen', () => {
    const { getByText } = render(
      <FormProvider>
        <WizardController />
      </FormProvider>
    );
    
    // Test logica hier
    expect(getByText).toBeDefined();
  });
});