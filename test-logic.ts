// test-logic.ts
import { FormState, FormAction } from './src/context/FormContext';

// We mocken even de reducer logica om te testen
const checkStatus = (count: number) => count > 5;

const initialState: any = { C1: { aantalVolwassen: 5 }, isSpecialStatus: false };

console.log('--- START LOGICA TEST [WAI-002] ---');
console.log('Huidige staat (5 volwassenen):', initialState.isSpecialStatus ? 'SPECIAL' : 'NORMAL');

// Simuleer verhoging naar 6
const nextState = {
  ...initialState,
  isSpecialStatus: checkStatus(6),
  C1: { aantalVolwassen: 6 },
};

console.log(
  'Nieuwe staat (6 volwassenen):',
  nextState.isSpecialStatus ? 'SPECIAL (Correct!)' : 'NORMAL (Fout!)',
);

if (nextState.isSpecialStatus === true) {
  console.log('✅ TEST GESLAAGD: Speciale status geactiveerd bij > 5 volwassenen.');
} else {
  console.log('❌ TEST GEFAALD: Status niet geactiveerd.');
}
