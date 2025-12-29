import * as React from 'react';
import { render } from '@testing-library/react-native';
import WizardPage from '../WizardPage';

import { ThemeProvider } from '../../../app/context/ThemeContext';
import { FormProvider } from '../../../app/context/FormContext'; // Importeer deze!

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, next: 0, right: 0, bottom: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockPage = {
  id: 'test-page',
  title: 'Test Title',
  component: () => null,
  fields: [] 
};

describe('WizardPage', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider>
        <FormProvider> 
          <WizardPage
            page={mockPage}
            onNext={jest.fn()}
            onPrev={jest.fn()}
            isFirst={true}
            isLast={false} 
          />
        </FormProvider>
      </ThemeProvider>
    );
  });
});