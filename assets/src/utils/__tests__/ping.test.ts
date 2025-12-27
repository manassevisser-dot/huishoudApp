import { ping } from '@utils/ping';

describe('Phoenix Alias Sanity Check', () => {
  it('moet de ping functie vinden via de @utils alias', () => {
    expect(ping()).toBe('pong');
  });
});
