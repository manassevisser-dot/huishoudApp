// src/ui/screens/UniversalScreen.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { UniversalScreen } from './UniversalScreen';
import { useMaster } from '@ui/providers/MasterProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { resolveScreenRenderer } from '@ui/screens/screens';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';
import type { RenderScreenVM } from '@app/orchestrators/MasterOrchestrator';

// Mocks
jest.mock('@ui/providers/MasterProvider', () => ({
  useMaster: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: jest.fn(),
}));

jest.mock('@ui/screens/screens', () => ({
  resolveScreenRenderer: jest.fn(),
}));

describe('UniversalScreen', () => {
  const mockScreenId = 'TEST_SCREEN';
  
  const mockInsets = {
    top: 50,
    bottom: 0,
    left: 0,
    right: 0,
  };

  const mockTokens = {
    Space: {
      md: 16,
    },
  };

  const mockStyles = {
    container: { flex: 1, backgroundColor: 'white' },
  };

  const mockScreenVM: RenderScreenVM = {
    screenId: mockScreenId,
    type: 'WIZARD',
    title: 'Test Screen',
    navigation: {
      next: 'NEXT_SCREEN',
      previous: 'PREV_SCREEN',
    },
    sections: [
      {
        sectionId: 'SECTION_1',
        title: 'Test Section',
        layout: 'default',
        uiModel: 'test-model',
        children: [],
      },
    ],
  };

  const mockMaster: Partial<MasterOrchestratorAPI> = {
    buildRenderScreen: jest.fn().mockReturnValue(mockScreenVM),
    saveDailyTransaction: jest.fn(),
    navigation: {
      goToDashboard: jest.fn(),
    } as any,
  };

  const MockScreenRenderer = jest.fn(({ screenVM, topPadding, onSaveDailyTransaction }) => {
  const { View } = require('react-native');
  return (
    <View 
      testID="screen-renderer"
      data-screenvm={JSON.stringify(screenVM)}
      data-toppadding={topPadding}
      data-onsave={typeof onSaveDailyTransaction}
    />
  );
});
 

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useMaster as jest.Mock).mockReturnValue(mockMaster);
    (useSafeAreaInsets as jest.Mock).mockReturnValue(mockInsets);
    (useAppStyles as jest.Mock).mockReturnValue({
      Tokens: mockTokens,
      styles: mockStyles,
    });
    (resolveScreenRenderer as jest.Mock).mockReturnValue(MockScreenRenderer);
  });

  it('should render null when screenVM is null', () => {
    (mockMaster.buildRenderScreen as jest.Mock).mockReturnValueOnce(null);
    
    const { queryByTestId } = render(<UniversalScreen screenId={mockScreenId} />);
    
    expect(queryByTestId('screen-renderer')).toBeNull();
    expect(resolveScreenRenderer).not.toHaveBeenCalled();
  });

  it('should build screenVM using master.buildRenderScreen with correct screenId', () => {
    render(<UniversalScreen screenId={mockScreenId} />);
    
    expect(mockMaster.buildRenderScreen).toHaveBeenCalledWith(mockScreenId);
    expect(mockMaster.buildRenderScreen).toHaveBeenCalledTimes(1);
  });

  it('should resolve screen renderer with screenVM', () => {
    render(<UniversalScreen screenId={mockScreenId} />);
    
    expect(resolveScreenRenderer).toHaveBeenCalledWith(mockScreenVM);
    expect(resolveScreenRenderer).toHaveBeenCalledTimes(1);
  });

  it('should render the resolved screen renderer with correct props', () => {
    const expectedTopPadding = mockInsets.top + mockTokens.Space.md;
    
    const { getByTestId } = render(<UniversalScreen screenId={mockScreenId} />);
    
    const renderer = getByTestId('screen-renderer');
    expect(renderer).toBeTruthy();
    expect(renderer.props['data-screenvm']).toBe(JSON.stringify(mockScreenVM));
    expect(renderer.props['data-toppadding']).toBe(expectedTopPadding);
    expect(renderer.props['data-onsave']).toBe('function');
  });

  it('should memoize screenVM calculation based on screenId and master', () => {
    const { rerender } = render(<UniversalScreen screenId={mockScreenId} />);
    
    // Eerste render zou buildRenderScreen moeten aanroepen
    expect(mockMaster.buildRenderScreen).toHaveBeenCalledTimes(1);
    
    // Re-render met zelfde screenId zou memoized result moeten gebruiken
    rerender(<UniversalScreen screenId={mockScreenId} />);
    expect(mockMaster.buildRenderScreen).toHaveBeenCalledTimes(1);
    
    // Re-render met andere screenId zou opnieuw moeten berekenen
    rerender(<UniversalScreen screenId="DIFFERENT_SCREEN" />);
    expect(mockMaster.buildRenderScreen).toHaveBeenCalledTimes(2);
    expect(mockMaster.buildRenderScreen).toHaveBeenLastCalledWith('DIFFERENT_SCREEN');
  });

  describe('saveDailyTransaction handler', () => {
    it('should call master.saveDailyTransaction when onSaveDailyTransaction is invoked', () => {
      (mockMaster.saveDailyTransaction as jest.Mock).mockReturnValueOnce(true);
      
      render(<UniversalScreen screenId={mockScreenId} />);
      
      // Haal de onSave prop op uit de mock renderer
      const onSaveCall = (MockScreenRenderer as jest.Mock).mock.calls[0][0].onSaveDailyTransaction;
      
      // Roep de handler aan
      onSaveCall();
      
      expect(mockMaster.saveDailyTransaction).toHaveBeenCalledTimes(1);
      expect(mockMaster.navigation?.goToDashboard).toHaveBeenCalledTimes(1);
    });

    it('should not navigate to dashboard if saveDailyTransaction returns false', () => {
      (mockMaster.saveDailyTransaction as jest.Mock).mockReturnValueOnce(false);
      
      render(<UniversalScreen screenId={mockScreenId} />);
      
      const onSaveCall = (MockScreenRenderer as jest.Mock).mock.calls[0][0].onSaveDailyTransaction;
      onSaveCall();
      
      expect(mockMaster.saveDailyTransaction).toHaveBeenCalledTimes(1);
      expect(mockMaster.navigation?.goToDashboard).not.toHaveBeenCalled();
    });

    it('should memoize onSaveDailyTransaction handler', () => {
      const { rerender } = render(<UniversalScreen screenId={mockScreenId} />);
      
      const firstHandler = (MockScreenRenderer as jest.Mock).mock.calls[0][0].onSaveDailyTransaction;
      
      rerender(<UniversalScreen screenId={mockScreenId} />);
      
      const secondHandler = (MockScreenRenderer as jest.Mock).mock.calls[1][0].onSaveDailyTransaction;
      
      // Zou dezelfde functie moeten zijn (memoized)
      expect(firstHandler).toBe(secondHandler);
    });

    it('should recreate onSaveDailyTransaction handler when master changes', () => {
      const { rerender } = render(<UniversalScreen screenId={mockScreenId} />);
      
      const firstHandler = (MockScreenRenderer as jest.Mock).mock.calls[0][0].onSaveDailyTransaction;
      
      // Simuleer master change door master dependency te veranderen
      (useMaster as jest.Mock).mockReturnValue({ ...mockMaster, different: true });
      
      rerender(<UniversalScreen screenId={mockScreenId} />);
      
      const secondHandler = (MockScreenRenderer as jest.Mock).mock.calls[1][0].onSaveDailyTransaction;
      
      // Zou een nieuwe functie moeten zijn
      expect(firstHandler).not.toBe(secondHandler);
    });
  });

  describe('styling and layout', () => {
 it('should apply container styles from useAppStyles', () => {
  const { toJSON } = render(<UniversalScreen screenId={mockScreenId} />);
  const tree = toJSON();
  
  // De root View zou de container styles moeten hebben
  expect(tree?.props?.style).toEqual(mockStyles.container);
});

  
      
     // Vervang met een simpele check:
it('should calculate topPadding based on insets.top and tokens', () => {
  const expectedTopPadding = mockInsets.top + mockTokens.Space.md; // 50 + 16 = 66
  
  render(<UniversalScreen screenId={mockScreenId} />);
  
  // ✅ Gebruik mock.calls om de props te inspecteren
  const props = (MockScreenRenderer as jest.Mock).mock.calls[0][0];
  expect(props.topPadding).toBe(expectedTopPadding);
});

    it('should update topPadding when insets change', () => {
      const { rerender } = render(<UniversalScreen screenId={mockScreenId} />);
      
      const firstCall = (MockScreenRenderer as jest.Mock).mock.calls[0][0];
      
      // Simuleer inset verandering
      (useSafeAreaInsets as jest.Mock).mockReturnValue({ ...mockInsets, top: 100 });
      
      rerender(<UniversalScreen screenId={mockScreenId} />);
      
      const secondCall = (MockScreenRenderer as jest.Mock).mock.calls[1][0];
      
      expect(secondCall.topPadding).toBe(100 + mockTokens.Space.md);
      expect(secondCall.topPadding).not.toBe(firstCall.topPadding);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle missing sections gracefully', () => {
      const vmWithoutSections = {
        ...mockScreenVM,
        sections: [],
      };
      (mockMaster.buildRenderScreen as jest.Mock).mockReturnValueOnce(vmWithoutSections);
      
      render(<UniversalScreen screenId={mockScreenId} />);
      
      expect(resolveScreenRenderer).toHaveBeenCalledWith(vmWithoutSections);
    });

    it('should handle missing navigation properties', () => {
      const vmWithoutNav = {
        ...mockScreenVM,
        navigation: {},
      };
      (mockMaster.buildRenderScreen as jest.Mock).mockReturnValueOnce(vmWithoutNav);
      
      render(<UniversalScreen screenId={mockScreenId} />);
      
      expect(resolveScreenRenderer).toHaveBeenCalledWith(vmWithoutNav);
    });

    it('should handle undefined master methods gracefully', () => {
      const incompleteMaster = {
        buildRenderScreen: jest.fn().mockReturnValue(mockScreenVM),
        // saveDailyTransaction ontbreekt
      };
      (useMaster as jest.Mock).mockReturnValueOnce(incompleteMaster);
      
      render(<UniversalScreen screenId={mockScreenId} />);
      
      // Zou nog moeten renderen zonder errors
      expect(MockScreenRenderer).toHaveBeenCalled();
    });
  });

  describe('integration with JSDoc claims', () => {
   it('should be a "domme" container that delegates rendering to resolved renderer', () => {
  render(<UniversalScreen screenId={mockScreenId} />);
  
  // ✅ Inspecteer de props direct
  const props = (MockScreenRenderer as jest.Mock).mock.calls[0][0];
  
  expect(props.screenVM).toEqual(mockScreenVM);
  expect(typeof props.topPadding).toBe('number');
  expect(typeof props.onSaveDailyTransaction).toBe('function');
});

    it('should work with any screenId without needing modification', () => {
      const testScreenIds = ['GREETING_STEP', 'INCOME_STEP', 'EXPENSES_STEP', 'SUMMARY_SCREEN'];
      
      testScreenIds.forEach(screenId => {
        (mockMaster.buildRenderScreen as jest.Mock).mockClear();
        
        render(<UniversalScreen screenId={screenId} />);
        
        expect(mockMaster.buildRenderScreen).toHaveBeenCalledWith(screenId);
      });
    });
  });
});