
// src/test-utils/rtl.ts
import * as React from 'react';
import {
  render as rtlRender,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { Providers } from './render';
import {makePhoenixState} from './state';
import { HouseholdFixture } from './fixtures';
import {FormStateFixture} from './fixtures';

/**
 * Drop-in render:
 * - Zelfde signatuur als RTL's render
 * - Wrapt UI in Providers (ThemeProvider + FormContext)
 * - Opties (`state`, `dispatch`) worden doorgegeven aan Providers
 */
export function render(ui: React.ReactElement, options?: any) {
  return rtlRender(<Providers {...options}>{ui}</Providers>, options);
}

// Re-export helpers zodat je tests niets hoeven te veranderen
export { screen, fireEvent, waitFor, makePhoenixState, HouseholdFixture, FormStateFixture }; // Voeg makePhoenixState hier toe
