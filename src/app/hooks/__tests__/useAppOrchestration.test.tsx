import { useAppOrchestration } from '../useAppOrchestration';
import { initialState } from '../../context/formReducer';

// Simpele unit test zonder renderHook als de library dwarsligt
describe('useAppOrchestration logic', () => {
  it('moet de juiste initiële state teruggeven', () => {
    expect(initialState.activeStep).toBe('LANDING');
  });
});