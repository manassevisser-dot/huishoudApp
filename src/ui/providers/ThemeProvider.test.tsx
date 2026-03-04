import React from 'react';
import { render, act, renderHook, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';
import type { Theme } from '@ui/kernel';

// ✅ Mock Logger
jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  Logger: {
    warning: jest.fn(),
  },
}));

const mockMaster: MasterOrchestratorAPI = {
  theme: {
    onThemeChange: jest.fn(),
    loadTheme: jest.fn(),
    setTheme: jest.fn(),
  },
} as any;

const originalError = console.error;

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockMaster.theme.loadTheme as jest.Mock).mockResolvedValue('light');
    (mockMaster.theme.setTheme as jest.Mock).mockResolvedValue(undefined);
    console.error = jest.fn(); // Onderdruk errors
  });

  afterEach(() => {
    console.error = originalError; // Herstel console.error
  });

  it('should render children correctly', () => {
    const { getByText } = render(
      <ThemeProvider master={mockMaster}>
        <Text>Test Child</Text>
      </ThemeProvider>
    );
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('useTheme should provide theme context', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider master={mockMaster}>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });

    expect(typeof result.current.setTheme).toBe('function');
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('should throw error when useTheme used outside provider', () => {
    expect(() => renderHook(() => useTheme())).toThrow('useTheme must be used within <ThemeProvider>');
  });

  it('should register theme change listener on mount', () => {
    render(
      <ThemeProvider master={mockMaster}>
        <Text>Test</Text>
      </ThemeProvider>
    );
    expect(mockMaster.theme.onThemeChange).toHaveBeenCalledTimes(1);
  });

  it('should load theme on mount', async () => {
    (mockMaster.theme.loadTheme as jest.Mock).mockResolvedValue('dark');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider master={mockMaster}>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });

  it('should update theme when setTheme is called', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider master={mockMaster}>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });

    await act(async () => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(mockMaster.theme.setTheme).toHaveBeenCalledWith('dark');
  });

  it('should toggle theme correctly', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider master={mockMaster}>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });

    await act(async () => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');

    await act(async () => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('should handle external theme changes', async () => {
    let externalCallback: ((theme: Theme) => void) | null = null;
    (mockMaster.theme.onThemeChange as jest.Mock).mockImplementation((cb) => {
      externalCallback = cb;
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider master={mockMaster}>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });

    await act(async () => {
      if (externalCallback) externalCallback('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(mockMaster.theme.setTheme).not.toHaveBeenCalled();
  });

 it('should handle loadTheme failure gracefully', async () => {
  (mockMaster.theme.loadTheme as jest.Mock).mockRejectedValue(new Error('Load failed'));
  
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider master={mockMaster}>{children}</ThemeProvider>
  );

  const { result } = renderHook(() => useTheme(), { wrapper });

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  // ✅ Theme blijft op default
  expect(result.current.theme).toBe('light');
  
  // ✅ Logger is aangeroepen - verwacht Error object, geen string
  expect(Logger.warning).toHaveBeenCalledWith('theme.load_failed', expect.objectContaining({
    defaultTheme: 'light',
    error: expect.any(Error)  // 👈 Accepteer elk Error object
  }));
  
  // Of specifieker:
  const call = (Logger.warning as jest.Mock).mock.calls[0];
  expect(call[0]).toBe('theme.load_failed');
  expect(call[1].error.message).toBe('Load failed');  // 👈 Check de message property
});

// ✅ Aangepaste test voor setTheme failure
it('should handle setTheme failure gracefully', async () => {
  (mockMaster.theme.setTheme as jest.Mock).mockRejectedValue(new Error('Save failed'));
  
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider master={mockMaster}>{children}</ThemeProvider>
  );

  const { result } = renderHook(() => useTheme(), { wrapper });

  await waitFor(() => {
    expect(result.current.theme).toBe('light');
  });

  await act(async () => {
    result.current.setTheme('dark');
    await new Promise(resolve => setTimeout(resolve, 10));
  });

  // ✅ State wordt nog steeds geüpdatet
  expect(result.current.theme).toBe('dark');
  expect(mockMaster.theme.setTheme).toHaveBeenCalledWith('dark');
  
  // ✅ Logger is aangeroepen - verwacht Error object
  expect(Logger.warning).toHaveBeenCalledWith('theme.save_failed', expect.objectContaining({
    theme: 'dark',
    error: expect.any(Error)  // 👈 Accepteer elk Error object
  }));
  
  // Of specifieker:
  const call = (Logger.warning as jest.Mock).mock.calls[0];
  expect(call[0]).toBe('theme.save_failed');
  expect(call[1].error.message).toBe('Save failed');  // 👈 Check de message property
});

  it('should not update state after unmount', async () => {
    (mockMaster.theme.loadTheme as jest.Mock).mockResolvedValue('dark');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider master={mockMaster}>{children}</ThemeProvider>
    );

    const { result, unmount } = renderHook(() => useTheme(), { wrapper });
    
    unmount();
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    
    expect(result.current.theme).toBe('light');
  });
});