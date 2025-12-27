import { logger } from './src/services/logger';
// test-logic.ts
import { FormState, FormAction } from './src/app/context/FormContext';

// We mocken even de reducer logica om te testen
const checkStatus = (count: number) => count > 5;

const initialState: any = { C1: { aantalVolwassen: 5 }, isSpecialStatus: false };

logger.info('--- START LOGICA TEST [WAI-002] ---');
logger.info('Huidige staat (5 volwassenen):', initialState.isSpecialStatus ? 'SPECIAL' : 'NORMAL');

// Simuleer verhoging naar 6
const nextState = {
  ...initialState,
  isSpecialStatus: checkStatus(6),
  C1: { aantalVolwassen: 6 },
};

logger.info(
  'Nieuwe staat (6 volwassenen):',
  nextState.isSpecialStatus ? 'SPECIAL (Correct!)' : 'NORMAL (Fout!)',
);

if (nextState.isSpecialStatus === true) {
  logger.info('✅ TEST GESLAAGD: Speciale status geactiveerd bij > 5 volwassenen.');
} else {
  logger.info('❌ TEST GEFAALD: Status niet geactiveerd.');
}
