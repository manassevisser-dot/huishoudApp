import React from 'react';
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';

// Update de mock zodat StyleSheet ook bestaat
jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: ({ children }: any) => React.createElement('View', {}, children),
    Text: ({ children }: any) => React.createElement('Text', {}, children),
    StyleSheet: {
      create: (obj: any) => obj,
      flatten: (obj: any) => obj, // Dit is wat er miste
    },
  };
});

test('Core Sanity Check', () => {
  const { getByText } = render(
    <View>
      <Text>Hello World</Text>
    </View>,
  );
  expect(getByText('Hello World')).toBeTruthy();
});