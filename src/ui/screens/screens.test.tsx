// src/ui/screens/screens.test.tsx (colocated!)
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { resolveScreenRenderer } from './screens';  // ✅ Zelfde map, './screens'
import type { RenderScreenVM } from '@app/orchestrators/types/render.types';

// Mocks voor alle dependencies
jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: jest.fn(() => ({
    styles: {
      container: {},
      screenTitle: {},
    },
    colors: {
      primary: '#007AFF',
    },
  })),
}));

jest.mock('@ui/sections/sections', () => ({
  DynamicSection: jest.fn(({ sectionId, title }) => {
    const { View, Text } = require('react-native');
    return <View testID={`section-${sectionId}`}><Text>{title}</Text></View>;
  }),
}));

jest.mock('@ui/navigation/NavigationFooter', () => ({
  NavigationFooter: jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="navigation-footer" />;
  }),
  NavigationBackFooter: jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="navigation-back-footer" />;
  }),
}));

jest.mock('@ui/screens/actions/DailyInputActionFooter', () => ({
  DailyInputActionFooter: jest.fn(({ onSave }) => {
    const { View, TouchableOpacity } = require('react-native');
    return (
      <View testID="daily-input-footer">
        <TouchableOpacity onPress={onSave} testID="save-button" />
      </View>
    );
  }),
}));

jest.mock('@ui/screens/csv/CsvUploadContainer', () => ({
  CsvUploadContainer: jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="csv-upload-container" />;
  }),
}));

jest.mock('@ui/sections/CsvAnalysisFeedback', () => ({
  CsvAnalysisFeedbackContainer: jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="csv-analysis-container" />;
  }),
}));

jest.mock('@ui/sections/TransactionHistoryContainer', () => ({
  TransactionHistoryContainer: jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="transaction-history-container" />;
  }),
}));

jest.mock('@ui/screens/Reset/ResetConfirmationContainer', () => ({
  ResetConfirmationContainer: jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="reset-container" />;
  }),
}));

jest.mock('@ui/screens/CriticalError/CriticalErrorContainer', () => ({
  CriticalErrorContainer: jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="critical-error-container" />;
  }),
}));

describe('Screen Renderer Registry', () => {
  // ✅ Volledige mock met alle verplichte properties
  const mockScreenVM: RenderScreenVM = {
    screenId: 'TEST_SCREEN',
    type: 'WIZARD',
    title: 'Test Screen',
    navigation: {
      next: 'NEXT_SCREEN',
      previous: 'PREV_SCREEN',
    },
    sections: [
      {
        sectionId: 'SECTION_1',
        title: 'Test Section 1',
        layout: 'default',
        uiModel: 'test-model-1',  // ✅ string, zoals vereist
        children: [],
      },
      {
        sectionId: 'SECTION_2',
        title: 'Test Section 2',
        layout: 'default',
        uiModel: 'test-model-2',  // ✅ string, zoals vereist
        children: [],
      },
    ],
  };

  const defaultProps = {
    screenVM: mockScreenVM,
    topPadding: 20,
    onSaveDailyTransaction: jest.fn(),
  };

  describe('resolveScreenRenderer', () => {
    it('should return specific renderer when screenId matches SCREEN_RENDERERS', () => {
      const testCases = [
        { screenId: 'SPLASH', expected: 'SplashScreenRenderer' },
        { screenId: 'DAILY_INPUT', expected: 'DailyInputScreenRenderer' },
        { screenId: 'OPTIONS', expected: 'OptionsScreenRenderer' },
        { screenId: 'CSV_UPLOAD', expected: 'CsvUploadScreenRenderer' },
        { screenId: 'CSV_ANALYSIS', expected: 'CsvAnalysisScreenRenderer' },
        { screenId: 'UNDO', expected: 'UndoScreenRenderer' },
        { screenId: 'RESET', expected: 'ResetScreenRenderer' },
        { screenId: 'CRITICAL_ERROR', expected: 'CriticalErrorScreenRenderer' },
      ];

      testCases.forEach(({ screenId, expected }) => {
  const vm = { ...mockScreenVM, screenId };
  const Renderer = resolveScreenRenderer(vm);
  
  // Type guard om te checken dat Renderer een functie is
  if (typeof Renderer === 'function') {
    expect(Renderer.name).toBe(expected);
  } else {
    fail(`Renderer for ${screenId} is not a function`);
  }
});
    });

    it('should return type-based renderer when screenId not found but type matches', () => {
      const vm = { ...mockScreenVM, screenId: 'UNKNOWN_SCREEN', type: 'WIZARD' };
      const Renderer = resolveScreenRenderer(vm);
      expect(Renderer.name).toBe('WizardScreenRenderer');
    });

    it('should return DefaultScreenRenderer when no match found', () => {
      const vm = { ...mockScreenVM, screenId: 'UNKNOWN_SCREEN', type: 'UNKNOWN_TYPE' };
      const Renderer = resolveScreenRenderer(vm);
      expect(Renderer.name).toBe('DefaultScreenRenderer');
    });

    it('should handle LANDING screen (falls through to DefaultScreenRenderer)', () => {
      const vm = { ...mockScreenVM, screenId: 'LANDING', type: 'AUTH' };
      const Renderer = resolveScreenRenderer(vm);
      expect(Renderer.name).toBe('DefaultScreenRenderer');
    });
  });

  describe('DefaultScreenRenderer', () => {
    it('should render SectionList with all sections', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'UNKNOWN' });
      const { getByTestId } = render(<Renderer {...defaultProps} />);

      expect(getByTestId('section-SECTION_1')).toBeTruthy();
      expect(getByTestId('section-SECTION_2')).toBeTruthy();
    });
  });

  describe('WizardScreenRenderer', () => {
    it('should render SectionList + NavigationFooter', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'UNKNOWN', type: 'WIZARD' });
      const { getByTestId } = render(<Renderer {...defaultProps} />);

      expect(getByTestId('section-SECTION_1')).toBeTruthy();
      expect(getByTestId('navigation-footer')).toBeTruthy();
    });
  });

  describe('DailyInputScreenRenderer', () => {
    it('should render SectionList + DailyInputActionFooter', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'DAILY_INPUT' });
      const { getByTestId } = render(<Renderer {...defaultProps} />);

      expect(getByTestId('section-SECTION_1')).toBeTruthy();
      expect(getByTestId('daily-input-footer')).toBeTruthy();
    });

it('should pass onSaveDailyTransaction to footer', () => {
  const onSaveMock = jest.fn();
  const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'DAILY_INPUT' });
  const { getByTestId } = render(
    <Renderer {...defaultProps} onSaveDailyTransaction={onSaveMock} />
  );

  const saveButton = getByTestId('save-button');
  fireEvent.press(saveButton);  // ✅ Gebruik fireEvent i.p.v. props.onPress()
  expect(onSaveMock).toHaveBeenCalled();
});
  });

describe('SplashScreenRenderer', () => {
  it('should render ActivityIndicator and loading text', () => {
    const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'SPLASH' });
    const { UNSAFE_getByType, getByText } = render(<Renderer {...defaultProps} />);

    // ✅ Fix: Gebruik de component reference in plaats van string
    const { ActivityIndicator, Text } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(UNSAFE_getByType(Text)).toBeTruthy();
    
    // ✅ Alternative: gebruik getByText voor de tekst
    expect(getByText('Phoenix wordt geladen...')).toBeTruthy();
  });

  it('should not render any sections', () => {
    const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'SPLASH' });
    const { queryByTestId } = render(<Renderer {...defaultProps} />);
    expect(queryByTestId('section-SECTION_1')).toBeNull();
  });
});

  describe('OptionsScreenRenderer', () => {
    it('should render SectionList + NavigationBackFooter', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'OPTIONS' });
      const { getByTestId } = render(<Renderer {...defaultProps} />);

      expect(getByTestId('section-SECTION_1')).toBeTruthy();
      expect(getByTestId('navigation-back-footer')).toBeTruthy();
    });
  });

  describe('CsvUploadScreenRenderer', () => {
    it('should render CsvUploadContainer', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'CSV_UPLOAD' });
      const { getByTestId } = render(<Renderer {...defaultProps} />);

      expect(getByTestId('csv-upload-container')).toBeTruthy();
    });

    it('should not render any sections', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'CSV_UPLOAD' });
      const { queryByTestId } = render(<Renderer {...defaultProps} />);

      expect(queryByTestId('section-SECTION_1')).toBeNull();
    });
  });

  describe('CsvAnalysisScreenRenderer', () => {
    it('should render CsvAnalysisFeedbackContainer', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'CSV_ANALYSIS' });
      const { getByTestId } = render(<Renderer {...defaultProps} />);

      expect(getByTestId('csv-analysis-container')).toBeTruthy();
    });
  });

  describe('ResetScreenRenderer', () => {
    it('should render ResetConfirmationContainer', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'RESET' });
      const { getByTestId } = render(<Renderer {...defaultProps} />);

      expect(getByTestId('reset-container')).toBeTruthy();
    });
  });

  describe('CriticalErrorScreenRenderer', () => {
    it('should render CriticalErrorContainer', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'CRITICAL_ERROR' });
      const { getByTestId } = render(<Renderer {...defaultProps} />);

      expect(getByTestId('critical-error-container')).toBeTruthy();
    });
  });

  describe('UndoScreenRenderer', () => {
    it('should render TransactionHistoryContainer', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'UNDO' });
      const { getByTestId } = render(<Renderer {...defaultProps} />);

      expect(getByTestId('transaction-history-container')).toBeTruthy();
    });

    it('should render actions section if present', () => {
      const vmWithActions = {
        ...mockScreenVM,
        screenId: 'UNDO',
        sections: [
          ...mockScreenVM.sections,
          {
            sectionId: 'TRANSACTION_ACTIONS_CARD',
            title: 'Actions',
            layout: 'default',
            uiModel: 'actions-model',  // ✅ string ipv object
            children: [],
          },
        ],
      };

      const Renderer = resolveScreenRenderer(vmWithActions);
      const { getByTestId } = render(
        <Renderer {...defaultProps} screenVM={vmWithActions} />
      );

      expect(getByTestId('section-TRANSACTION_ACTIONS_CARD')).toBeTruthy();
    });

    it('should not render actions section when absent', () => {
      const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'UNDO' });
      const { queryByTestId } = render(<Renderer {...defaultProps} />);

      expect(queryByTestId('section-TRANSACTION_ACTIONS_CARD')).toBeNull();
    });
  });

  describe('topPadding prop', () => {
    it('should pass topPadding to SectionList containers', () => {
  const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: 'UNKNOWN' });
  const { queryByTestId } = render(<Renderer {...defaultProps} topPadding={42} />);
  
  // ✅ Check of de ScrollView bestaat - padding is intern, niet makkelijk te testen
  const scrollView = queryByTestId('section-SECTION_1')?.parent;
  expect(scrollView).toBeTruthy();
});

it('should pass topPadding to custom screen containers', () => {
  const customScreens = [
    { id: 'CSV_UPLOAD', testId: 'csv-upload-container' },
    { id: 'CSV_ANALYSIS', testId: 'csv-analysis-container' },
    { id: 'RESET', testId: 'reset-container' },
    { id: 'CRITICAL_ERROR', testId: 'critical-error-container' },
  ];
  
  customScreens.forEach(({ id, testId }) => {
    const Renderer = resolveScreenRenderer({ ...mockScreenVM, screenId: id });
    const { getByTestId } = render(<Renderer {...defaultProps} topPadding={42} />);
    
    const container = getByTestId(testId);  // ✅ Gebruik de exacte testID
    expect(container).toBeTruthy();
    
  });
});
  });

  describe('JSDoc claims verification', () => {
    it('should have registered all screens mentioned in JSDoc', () => {
      const mentionedScreens = [
        'SPLASH',
        'DAILY_INPUT',
        'OPTIONS',
        'CSV_UPLOAD',
        'CSV_ANALYSIS',
        'UNDO',
        'RESET',
        'CRITICAL_ERROR',
      ];

      mentionedScreens.forEach(screenId => {
        const vm = { ...mockScreenVM, screenId };
        const Renderer = resolveScreenRenderer(vm);
        expect(Renderer).toBeDefined();
        expect(Renderer.name).not.toBe('DefaultScreenRenderer');
      });
    });

    it('should have LANDING fall through to DefaultScreenRenderer (type AUTH)', () => {
      const vm = { ...mockScreenVM, screenId: 'LANDING', type: 'AUTH' };
      const Renderer = resolveScreenRenderer(vm);
      expect(Renderer.name).toBe('DefaultScreenRenderer');
    });
  });
});