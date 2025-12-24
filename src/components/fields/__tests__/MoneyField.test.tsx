
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import MoneyField from '../../fields/MoneyField';
import { ThemeProvider } from '@app/context/ThemeContext';
import * as FormContextModule from '@context/FormContext'; // ⬅️ voor spyOn i.p.v. factory mock

// ⚠️ Geen mock van @ui/components/MoneyInput — we testen de echte component.
// (Jest alias-mapping voor @ui kan wisselen; met de echte component is de test robuuster)

// Lokale FormContext bridge
const Ctx = React.createContext<any>(null);

// Wrapper: vangt SET_PAGE_DATA en exposeert state voor asserts via RN Text
const Wrapper = ({ children }: any) => {
  const [state, dispatch] = React.useReducer((s: any, a: any) => {
    if (a.type === 'SET_PAGE_DATA') {
      const { pageId, data } = a;
      return { ...s, [pageId]: { ...(s[pageId] ?? {}), ...data } };
    }
    return s;
  }, { C7: { amount: 0 } });

  return (
    <Ctx.Provider value={{ state, dispatch }}>
      <View>
        {children}
        <Text testID="state-snapshot">{JSON.stringify(state)}</Text>
      </View>
    </Ctx.Provider>
  );
};

describe('MoneyField', () => {
  beforeEach(() => {
    // ⬅️ Mock de hook in test-scope; géén factory met out-of-scope refs
    jest.spyOn(FormContextModule, 'useFormContext')
      .mockImplementation(() => React.useContext(Ctx));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('dispatches cents on blur via MoneyInput (typ "12,34" → blur → 1234)', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <Wrapper>
          <MoneyField pageId="C7" fieldId="amount" />
        </Wrapper>
      </ThemeProvider>
    );

    // Zoek het echte TextInput via de zichtbare placeholder ("0,00")
    const input = getByPlaceholderText('0,00');

    // Simuleer gebruiker: typ "12,34" (NL notatie) → blur
    fireEvent.changeText(input, '12,34');
    fireEvent(input, 'blur'); // RN-correcte generieke event API

    // Bewijs: wrapper-state bevat nu 1234 centen
    const snapshot = getByTestId('state-snapshot').props.children;
    const parsed = JSON.parse(snapshot);
    expect(parsed.C7.amount).toBe(1234);
  });
});
