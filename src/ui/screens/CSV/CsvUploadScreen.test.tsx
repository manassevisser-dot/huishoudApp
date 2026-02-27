// src/ui/screens/csv/CsvUploadScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CsvUploadScreen } from './CsvUploadScreen';
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { ActivityIndicator } from 'react-native';
// Mocks
jest.mock('@domain/constants/uiSections', () => ({
  UI_SECTIONS: {
    CSV_UPLOAD: 'CSV Upload Test Titel',
  },
}));

jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: jest.fn(),
}));

describe('CsvUploadScreen', () => {
  const mockStyles = {
    screenContainer: { flex: 1, padding: 16 },
    screenTitle: { fontSize: 24, fontWeight: 'bold' },
    button: { borderRadius: 8, padding: 12, backgroundColor: 'blue' },
    buttonText: { fontSize: 16, color: 'white' },
  };

  const mockOnPickFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStyles as jest.Mock).mockReturnValue({
      styles: mockStyles,
    });
  });

  it('should render correctly', () => {
    const { getByText } = render(
      <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={false} />
    );
    
    expect(getByText(UI_SECTIONS.CSV_UPLOAD)).toBeTruthy();
    expect(getByText('Kies csv-bestand')).toBeTruthy();
  });

  it('should call onPickFile when button is pressed', () => {
    const { getByText } = render(
      <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={false} />
    );
    
    const button = getByText('Kies csv-bestand');
    fireEvent.press(button);
    
    expect(mockOnPickFile).toHaveBeenCalledTimes(1);
  });

  it('should show ActivityIndicator when isUploading is true', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={true} />
    );
    
    // Button text mag niet zichtbaar zijn
    expect(queryByText('Kies csv-bestand')).toBeNull();
    
    // ActivityIndicator moet zichtbaar zijn
  const activityIndicator = UNSAFE_getByType(ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
  });

it('should disable button when isUploading is true', () => {
  const { getByTestId } = render(
    <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={true} />
  );
  
  const button = getByTestId('Kies csv-bestand');
  expect(button.props.accessibilityState?.disabled).toBe(true);
});

it('should enable button when isUploading is false', () => {
  const { getByTestId } = render(
    <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={false} />
  );
  
  const button = getByTestId('Kies csv-bestand');
  expect(button.props.accessibilityState?.disabled).toBe(false);
});

it('should apply correct styles from useAppStyles', () => {
  const { getByTestId, getByText } = render(
    <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={false} />
  );
  
  // Vind de title
  const title = getByText(UI_SECTIONS.CSV_UPLOAD);
  
  // De container is de parent van de parent van de title
  const container = title.parent?.parent;
  expect(container?.props.style).toEqual(
    expect.objectContaining(mockStyles.screenContainer)
  );
  
  // Title styles checken
  expect(title.props.style).toBe(mockStyles.screenTitle);
  
  // Button styles checken - is een object, geen array!
  const buttonNode = getByTestId('Kies csv-bestand');
  expect(buttonNode.props.style).toEqual(
    expect.objectContaining(mockStyles.button)
  );
  
  // Button text styles checken
  const buttonText = getByText('Kies csv-bestand');
  expect(buttonText.props.style).toBe(mockStyles.buttonText);
});

  describe('accessibility', () => {
    it('should have correct testID for button', () => {
      const { getByTestId } = render(
        <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={false} />
      );
      
      expect(() => getByTestId('Kies csv-bestand')).not.toThrow();
    });
  });

  describe('JSDoc claims verification', () => {
    it('should use UI_SECTIONS for title text', () => {
      const { getByText } = render(
        <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={false} />
      );
      
      expect(getByText(UI_SECTIONS.CSV_UPLOAD)).toBeTruthy();
      expect(UI_SECTIONS.CSV_UPLOAD).toBe('CSV Upload Test Titel');
    });

   it('should be a presentational component with props', () => {
  // rerender() triggert TouchableOpacity.componentDidUpdate → AnimatedValue.start →
  // native renderer version-mismatch crash. Twee losse renders omzeilen dat.
  const { getByTestId: getFirst, unmount: unmountFirst } = render(
    <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={false} />
  );
  expect(getFirst('Kies csv-bestand').props.accessibilityState?.disabled).toBe(false);
  unmountFirst();

  const { getByTestId: getSecond } = render(
    <CsvUploadScreen onPickFile={mockOnPickFile} isUploading={true} />
  );
  expect(getSecond('Kies csv-bestand').props.accessibilityState?.disabled).toBe(true);
});
  });
});