import React from 'react';
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';

// Mock RN
jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: ({ children }: any) => React.createElement('View', {}, children),
    Text: ({ children }: any) => React.createElement('Text', {}, children),
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
