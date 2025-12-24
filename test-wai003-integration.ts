import { selectIsSpecialStatus } from './src/selectors/householdSelectors'; // 1. Simuleer de initiële staat (leeg/start)
let state: any = {
  C1: { aantalVolwassen: 1 },
  isSpecialStatus: false,
};

console.log('--- WAI-003 INTEGRATIE TEST ---');
console.log('Start State:', JSON.stringify(state));

// 2. Simuleer de actie van de AdultsCounter naar 6 volwassenen
// In de app gebeurt dit in de 'onValueChange' van de container
const newVal = 6;
const nextState = {
  ...state,
  C1: { ...state.C1, aantalVolwassen: newVal },
};

// 3. De Container berekent de nieuwe status via de Selector (Shadow Logic per ADR-12)
const isSpecial = selectIsSpecialStatus(nextState);

// 4. De finale state update (zoals de dispatch/reducer dat zou doen)
state = { ...nextState, isSpecialStatus: isSpecial };

console.log('\nUpdate naar 6 volwassenen...');
console.log('Nieuwe State:', JSON.stringify(state));
console.log(
  'Resultaat:',
  state.isSpecialStatus === true
    ? '✅ PASS: Speciale status actief bij > 5'
    : '❌ FAIL: Status niet gezet',
);

// 5. Check de grensgeval (Project eis: > 5, dus 5 is nog niet speciaal)
const borderCase = selectIsSpecialStatus({ C1: { aantalVolwassen: 5 } } as any);
console.log(
  '\nCheck bij 5 volwassenen:',
  borderCase === false ? '✅ PASS: Status inactief bij 5' : '❌ FAIL: Status onterecht actief',
);
