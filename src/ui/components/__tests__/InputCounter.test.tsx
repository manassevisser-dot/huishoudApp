
// src/ui/components/__tests__/InputCounter.test.tsx
import { render, fireEvent } from '@test-utils/index';
import  InputCounter  from '@fields/InputCounter';

describe('InputCounter', () => {
  it('moet de waarde verhogen bij een klik op de plus en action structuur doorgeven', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <InputCounter
        fieldId="aantalMensen"
        value={1}
        onChange={onChange}
      />
    );

    fireEvent.press(getByTestId('counter-increment'));

    // Nieuw contract: { fieldId, value }
    expect(onChange).toHaveBeenCalledWith({ fieldId: 'aantalMensen', value: 2 });
  });
});
