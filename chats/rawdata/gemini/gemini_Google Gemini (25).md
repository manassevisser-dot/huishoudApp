**Geëxporteerd:** 4-1-2026, 16:09:51
**Aantal berichten:** 10

---
**User:**

```
useAppOrchestration
```

```
SyncPayload
```

```
import { useState, useEffect, useMemo } from 'react';

/** Phoenix envelope v2 + V1.0 schema */
type PhoenixEnvelopeV2 = {
  version: 2;
  state: {
    schemaVersion: '1.0';
    data?: {
      setup?: { aantalMensen?: number; aantalVolwassen?: number };
      household?: { members?: Array<any> };
      finance?: Record<string, unknown>;
    };
  };
};

/** Legacy state definitie */
type LegacyStateLike = {
  schemaVersion?: string;
  data?: {
    setup?: { aantalMensen?: number; aantalVolwassen?: number };
    household?: { members?: Array<any> };
    finance?: Record<string, unknown>;
  };
} | null;

| Key | Value |
| --- | --- |
| /** Status types | 'ONBOARDING' vervangt 'UNBOARDING' voor consistentie */ |
| type OrchestrationStatus = 'HYDRATING' | 'ONBOARDING' \| 'READY' \| 'ERROR'; |

| aantalMensen: number |  |
| --- | --- |
| aantalVolwassen: number |  |
| } |  |

/** Type guards voor veilige state detectie */
const isPhoenixV2 = (x: unknown): x is PhoenixEnvelopeV2 =>
  !!x && typeof x === 'object' && (x as any).version === 2 && (x as any).state?.schemaVersion === '1.0';

const isLegacyV1State = (x: unknown): x is LegacyStateLike =>
  !!x && typeof x === 'object' && (x as any).schemaVersion === '1.0';

| loadState: PhoenixEnvelopeV2 \| LegacyStateLike \| undefined |  |
| --- | --- |
| const [status | setStatus] = useState<OrchestrationStatus>('HYDRATING'); |

| /** * Memoized payload voor huishoud-synchronisatie. | /** * Memoized payload voor huishoud-synchronisatie. |
| --- | --- |
| * Haalt data op uit zowel de v2 envelope als legacy v1 state. | * Haalt data op uit zowel de v2 envelope als legacy v1 state. |
| */ | */ |
| const syncPayload: SyncPayload = useMemo(() => { | const syncPayload: SyncPayload = useMemo(() => { |
| const setup = ( | const setup = ( |
| isPhoenixV2(loadState) ? loadState.state.data?.setup : | isPhoenixV2(loadState) ? loadState.state.data?.setup : |
| isLegacyV1State(loadState) ? loadState.data?.setup : | isLegacyV1State(loadState) ? loadState.data?.setup : |
| undefined | undefined |
| ) ?? {}; | ) ?? {}; |

| aantalMensen: Number(setup.aantalMensen ?? 0) |  |
| --- | --- |
| aantalVolwassen: Number(setup.aantalVolwassen ?? 0) |  |
| } | [loadState]); |

| setStatus('HYDRATING') |  |
| --- | --- |
| return |  |

| setStatus('ONBOARDING') |  |
| --- | --- |
| return |  |

| // 3. Valideer Phoenix v2 of Legacy v1 State | // 3. Valideer Phoenix v2 of Legacy v1 State |
| --- | --- |
| if (isPhoenixV2(loadState) \|\| isLegacyV1State(loadState)) { | if (isPhoenixV2(loadState) \|\| isLegacyV1State(loadState)) { |
| setStatus('READY'); | setStatus('READY'); |

| dispatch({ type: 'SYNC_HOUSEHOLD', payload: syncPayload }) |  |
| --- | --- |
| return |  |

| setStatus('ERROR') |  |
| --- | --- |
| setStatus('ERROR') |  |
| }, [loadState, dispatch, syncPayload]) |  |

| setStatus('READY') |  |
| --- | --- |
| if (dispatch) dispatch({ type: 'SYNC_HOUSEHOLD', payload: syncPayload }) |  |
| setStatus('ONBOARDING') |  |
| setStatus(typeof loadState === 'undefined' ? 'HYDRATING' : 'ERROR') |  |
| } |  |

  return { status, init, syncPayload };
};
```

```
import { useState, useEffect, useMemo } from 'react';

/** Phoenix envelope v2 + V1.0 schema */
type PhoenixEnvelopeV2 = {
  version: 2;
  state: {
    schemaVersion: '1.0';
    data?: {
      setup?: { aantalMensen?: number; aantalVolwassen?: number };
      household?: { members?: Array<any> };
      finance?: Record<string, unknown>;
    };
  };
};

/** Legacy state definitie */
type LegacyStateLike = {
  schemaVersion?: string;
  data?: {
    setup?: { aantalMensen?: number; aantalVolwassen?: number };
    household?: { members?: Array<any> };
    finance?: Record<string, unknown>;
  };
} | null;

| Key | Value |
| --- | --- |
| /** Status types | 'ONBOARDING' vervangt 'UNBOARDING' voor consistentie */ |
| type OrchestrationStatus = 'HYDRATING' | 'ONBOARDING' \| 'READY' \| 'ERROR'; |

| aantalMensen: number |  |
| --- | --- |
| aantalVolwassen: number |  |
| } |  |

/** Type guards voor veilige state detectie */
const isPhoenixV2 = (x: unknown): x is PhoenixEnvelopeV2 =>
  !!x && typeof x === 'object' && (x as any).version === 2 && (x as any).state?.schemaVersion === '1.0';

const isLegacyV1State = (x: unknown): x is LegacyStateLike =>
  !!x && typeof x === 'object' && (x as any).schemaVersion === '1.0';

| loadState: PhoenixEnvelopeV2 \| LegacyStateLike \| undefined |  |
| --- | --- |
| const [status | setStatus] = useState<OrchestrationStatus>('HYDRATING'); |

| /** * Memoized payload voor huishoud-synchronisatie. | /** * Memoized payload voor huishoud-synchronisatie. |
| --- | --- |
| * Haalt data op uit zowel de v2 envelope als legacy v1 state. | * Haalt data op uit zowel de v2 envelope als legacy v1 state. |
| */ | */ |
| const syncPayload: SyncPayload = useMemo(() => { | const syncPayload: SyncPayload = useMemo(() => { |
| const setup = ( | const setup = ( |
| isPhoenixV2(loadState) ? loadState.state.data?.setup : | isPhoenixV2(loadState) ? loadState.state.data?.setup : |
| isLegacyV1State(loadState) ? loadState.data?.setup : | isLegacyV1State(loadState) ? loadState.data?.setup : |
| undefined | undefined |
| ) ?? {}; | ) ?? {}; |

| aantalMensen: Number(setup.aantalMensen ?? 0) |  |
| --- | --- |
| aantalVolwassen: Number(setup.aantalVolwassen ?? 0) |  |
| } | [loadState]); |

| setStatus('HYDRATING') |  |
| --- | --- |
| return |  |

| setStatus('ONBOARDING') |  |
| --- | --- |
| return |  |

| // 3. Valideer Phoenix v2 of Legacy v1 State | // 3. Valideer Phoenix v2 of Legacy v1 State |
| --- | --- |
| if (isPhoenixV2(loadState) \|\| isLegacyV1State(loadState)) { | if (isPhoenixV2(loadState) \|\| isLegacyV1State(loadState)) { |
| setStatus('READY'); | setStatus('READY'); |

| dispatch({ type: 'SYNC_HOUSEHOLD', payload: syncPayload }) |  |
| --- | --- |
| return |  |

| setStatus('ERROR') |  |
| --- | --- |
| setStatus('ERROR') |  |
| }, [loadState, dispatch, syncPayload]) |  |

| setStatus('READY') |  |
| --- | --- |
| if (dispatch) dispatch({ type: 'SYNC_HOUSEHOLD', payload: syncPayload }) |  |
| setStatus('ONBOARDING') |  |
| setStatus(typeof loadState === 'undefined' ? 'HYDRATING' : 'ERROR') |  |
| } |  |

  return { status, init, syncPayload };
};
```

```
PhoenixEnvelopeV2 | LegacyStateLike
```

```
SYNC_HOUSEHOLD
```

```
App.test.tsx
```

```
syncPayload
```

| - Data Extractie: De hook is nu slim genoeg om data te vinden | of het nu in de nieuwe state.data wrapper zit (v2) of direct in de root (v1 legacy). |
| --- | --- |
| - Side Effects: De hook kan nu optioneel een actie dispatchen zodra de state READY is | wat de data-integriteit in de rest van de app waarborgt. |

import { useState, useEffect, useMemo } from 'react';

/** Phoenix envelope v2 + V1.0 schema */

type PhoenixEnvelopeV2 = {

  version: 2;

  state: {

    schemaVersion: '1.0';

    data?: {

      setup?: { aantalMensen?: number; aantalVolwassen?: number };

      household?: { members?: Array<any> };

      finance?: Record<string, unknown>;

    };

    // ... overige velden (C7, C10, etc.)

  };

};

/** Legacy (soms direct FormState of andere versie zonder envelope) */

type LegacyStateLike = {

  schemaVersion?: string;

  data?: {

    setup?: { aantalMensen?: number; aantalVolwassen?: number };

    household?: { members?: Array<any> };

    finance?: Record<string, unknown>;

  };

  // ... overige legacy velden

} | null;

/** Discriminant helper: zie of het Phoenix v2 envelope is */

const isPhoenixV2 = (x: unknown): x is PhoenixEnvelopeV2 =>

  !!x && typeof x === 'object' && (x as any).version === 2 && (x as any).state?.schemaVersion === '1.0';

/** Legacy v1.0 direct state (geen envelope) */

const isLegacyV1State = (x: unknown): x is LegacyStateLike =>

  !!x && typeof x === 'object' && (x as any).schemaVersion === '1.0';

/** Status type — corrigeer 'UNBOARDING' naar 'ONBOARDING' */

type OrchestrationStatus = 'HYDRATING' | 'ONBOARDING' | 'READY' | 'ERROR';

export type SyncPayload = {

  aantalMensen: number;

  aantalVolwassen: number;

};

export const useAppOrchestration = (

  loadState: PhoenixEnvelopeV2 | LegacyStateLike | undefined,

  dispatch?: (action: { type: string; payload?: unknown }) => void

) => {

  const [status, setStatus] = useState<OrchestrationStatus>('HYDRATING');

  // Bouw een payload voor SYNC_HOUSEHOLD (uit Phoenix/Legacy state)

  const syncPayload: SyncPayload | null = useMemo(() => {

    const setup =

      (isPhoenixV2(loadState) ? loadState.state.data?.setup

        : isLegacyV1State(loadState) ? loadState.data?.setup

        : undefined) ?? {};

    const aantalMensen = Number(setup.aantalMensen ?? 0);

    const aantalVolwassen = Number(setup.aantalVolwassen ?? 0);

    // Minimale sanity: payload bestaat altijd, maar laat 0/0 toe (hook is niet verantwoordelijk voor validatie)

    return { aantalMensen, aantalVolwassen };

  }, [loadState]);

  useEffect(() => {

    if (typeof loadState === 'undefined') {

      // Loader is bezig: blijf hydraten

      setStatus('HYDRATING');

      return;

    }

    try {

      if (loadState === null) {

        // Geen opgeslagen state → onboarding/first run

        setStatus('ONBOARDING');

        return;

      }

      // Phoenix v2 envelope met schema v1.0

      if (isPhoenixV2(loadState)) {

        setStatus('READY');

        // Optioneel: direct een sync dispatch

        if (dispatch) {

          dispatch({ type: 'SYNC_HOUSEHOLD', payload: syncPayload });

        }

        return;

      }

      // Legacy v1.0 direct state (geen envelope) — toegestaan, maar je kunt migratie starten

      if (isLegacyV1State(loadState)) {

        setStatus('READY');

        if (dispatch) {

          dispatch({ type: 'SYNC_HOUSEHOLD', payload: syncPayload });

        }

        return;

      }

      // Onbekende vorm

      setStatus('ERROR');

    } catch {

      setStatus('ERROR');

    }

  }, [loadState, dispatch, syncPayload]);

  /** Optioneel: expliciete init() als je dit liever vanuit component aanroept i.p.v. in useEffect */

  const init = () => {

    if (isPhoenixV2(loadState) || isLegacyV1State(loadState)) {

      setStatus('READY');

      if (dispatch) dispatch({ type: 'SYNC_HOUSEHOLD', payload: syncPayload });

    } else if (loadState === null) {

      setStatus('ONBOARDING');

    } else if (typeof loadState === 'undefined') {

      setStatus('HYDRATING');

    } else {

      setStatus('ERROR');

    }

  };

  return { status, init, syncPayload };

};

Boven de verbeteringen, onder het origineel. Kun jij merge doen voor mij??

import { useState, useEffect } from 'react';

export const useAppOrchestration = (loadState: any) => {

  const [status, setStatus] = useState<'HYDRATING' | 'UNBOARDING' | 'READY' | 'ERROR'>('HYDRATING');

  useEffect(() => {

    if (loadState === undefined) return; // Wacht op data

    try {

      if (loadState === null) {

        setStatus('UNBOARDING');

      } else if (loadState?.version === '1.0') {

        setStatus('READY');

      } else {

        setStatus('ERROR');

      }

    } catch (e) {

      setStatus('ERROR');

    }

  }, [loadState]);

  return { status };

};

Hier is de samengevoegde (merge) versie van de hook. In deze versie is de robuuste type-checking en de logica uit de verbeterde versie gecombineerd met de kernfunctionaliteit van het origineel.

De Gemergde Orchestrator Hook
TypeScript
Belangrijkste wijzigingen in de Merge:

Zal ik je helpen bij het aanpassen van de zodat deze rekening houdt met de nieuwe ONBOARDING status en de ?

---

**User:**

```
buttonSecondary
```

```
secondaryButton
```

```
sed -i 's/buttonSecondary/secondaryButton/g' $(rg -l 'buttonSecondary' src)
```

```
sed -i 's/buttonSecondary/secondaryButton/g' $(rg -l 'buttonSecondary' src)
```

```
rg -l 'buttonSecondary' src
```

```
buttonSecondary
```

```
's/buttonSecondary/secondaryButton/g'
```

```
rg 'buttonSecondary' src --replace 'secondaryButton'
```

```
rg 'buttonSecondary' src --replace 'secondaryButton'
```

```
./phoenix audit
```

```
./phoenix full
```

```
State Machine Rendering
```

```
./phoenix clean
```

```
phoenix-check.sh
```

| Key | Value |
| --- | --- |
|  | Gebruikt ripgrep om alleen de bestandsnamen (-l) te vinden in de src map die de tekst bevatten. |
| sed | i: Voert een "in-place" vervanging uit in de gevonden bestanden. |
|  | De instructie om de oude term te zoeken en te vervangen door de nieuwe term (de g staat voor globaal, dus meerdere keren per regel). |

| Key | Value |
| --- | --- |
| Audit | Draai na de vervanging om te controleren of er geen syntaxfouten zijn ontstaan in je shell-checks. |
| Tests | Voer uit om te garanderen dat je UI-tests (zoals de test) nog steeds slagen met de nieuwe button-naam. |
| Cleaning | Als er tijdelijke backup-bestanden zijn aangemaakt door sed, gebruik dan om je werkmap op te ruimen. |

zoekcomman om buttonSecondary in te wisselen voor secondaryButton

Om alle instanties van te vervangen door binnen de bronbestanden van je project, kun je het volgende commando gebruiken in je terminal:

Bash
Uitleg van het commando:
Phoenix Commander Alternatief

Aangezien je werkt met de Phoenix Commander v3.2 , kun je dit ook veiliger aanpakken door een migratie-script te gebruiken of de migrate commandostructuur te volgen.

Als je de wijziging eerst wilt controleren zonder de bestanden daadwerkelijk aan te passen (een "dry run"), kun je dit commando gebruiken:

Bash
Belangrijke controle voor Project Phoenix:

Zal ik je helpen bij het toevoegen van een specifieke migratie-stap aan je zodat deze naamswijziging voortaan automatisch wordt gecontroleerd?

Bronnen

---

**User:**

```
sed: no input files
```

```
buttonSecondary
```

```
$(rg -l ...)
```

```
buttonSecondary
```

```
PROJECT_ROOT
```

```
files=$(rg -l 'buttonSecondary' src)
if [ -n "$files" ]; then
    sed -i 's/buttonSecondary/secondaryButton/g' $files
    echo "✅ Vervanging voltooid."
else
    echo "ℹ️ Geen bestanden gevonden met 'buttonSecondary'."
fi
```

```
files=$(rg -l 'buttonSecondary' src)
if [ -n "$files" ]; then
    sed -i 's/buttonSecondary/secondaryButton/g' $files
    echo "✅ Vervanging voltooid."
else
    echo "ℹ️ Geen bestanden gevonden met 'buttonSecondary'."
fi
```

```
./phoenix audit
```

```
PROJECT_ROOT
```

```
./phoenix clean
```

```
/tmp/phoenix-audit-cache
```

```
./phoenix full
```

```
sed -i '' 's/buttonSecondary/secondaryButton/g' $files
```

- De tekst  staat niet (meer) in de map src.
- Je bevindt je niet in de .
- De bestanden staan in een andere map die niet door src wordt gedekt.

- Check de huidige status: Gebruik   om te zien of de huidige codebases schoon zijn voordat je begint.
- Controleer de locatie: Het script stelt de  vast op basis van de locatie van het phoenix bestand. Zorg dat je daar bent.
- Vervang en Schoon op:Voer het bovenstaande sed script uit.Draai  om eventuele tijdelijke artifacts of caches (zoals ) te verwijderen.Draai  om te verifiëren dat de npm test suite nog steeds slaagt met de nieuwe button-naam.
- Voer het bovenstaande sed script uit.
- Draai  om eventuele tijdelijke artifacts of caches (zoals ) te verwijderen.
- Draai  om te verifiëren dat de npm test suite nog steeds slaagt met de nieuwe button-naam.

- Voer het bovenstaande sed script uit.
- Draai  om eventuele tijdelijke artifacts of caches (zoals ) te verwijderen.
- Draai  om te verifiëren dat de npm test suite nog steeds slaagt met de nieuwe button-naam.

sed -i 's/buttonSecondary/secondaryButton/g' $(rg -l 'buttonSecondary' src)

sed: no input files

De fout betekent dat ripgrep geen bestanden heeft kunnen vinden die de tekst bevatten. De subshell geeft daardoor niets terug aan sed.

Dit kan drie oorzaken hebben:

De Veilige Oplossing

Gebruik dit commando om de foutmelding te voorkomen en de vervanging alleen uit te voeren als er daadwerkelijk resultaten zijn:

Bash
Integratie met Phoenix Commander

Omdat je werkt met Phoenix Commander v3.2, kun je dit het beste uitvoeren vanuit de hoofdmap van je project. Volg deze stappen voor een veilige migratie:

Waarschuwing voor macOS gebruikers

Als je op een Mac werkt, vereist de standaard sed een extra argument voor de -i vlag. Gebruik dan:

Zal ik een tijdelijk migratie-commando toevoegen aan je cmd_help in het phoenix script, zodat je dit soort hernoemingen vaker kunt doen?

Bronnen

---

**User:**

```
makePhoenixState
```

```
import { computePhoenixSummary } from '@logic/finance';
import { makePhoenixState } from '@test-utils/state';

describe('WAI-004C Finance Integratie (Phoenix)', () => {

| it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => { | it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => { |
| --- | --- |
| // Gebruik de state helper voor een schone mock-opbouw | // Gebruik de state helper voor een schone mock-opbouw |
| const state = makePhoenixState({ | const state = makePhoenixState({ |
| activeStep: 'WIZARD', | activeStep: 'WIZARD', |
| data: { | data: { |
| finance: { | finance: { |
| income: { | income: { |
| items: [{ id: 'inc-1', amountCents: 10000, frequency: 'month' }] | items: [{ id: 'inc-1', amountCents: 10000, frequency: 'month' }] |
| }, | }, |
| expenses: { | expenses: { |
| items: [{ id: 'exp-1', amountCents: 4000, frequency: 'month' }] | items: [{ id: 'exp-1', amountCents: 4000, frequency: 'month' }] |
| }, | }, |
| }, | }, |
| }, | }, |
| }); | }); |

    const summary = computePhoenixSummary(state);

| expect(summary.totalIncomeCents).toBe(10000) |  |
| --- | --- |
| expect(summary.totalExpensesCents).toBe(4000) |  |
| expect(summary.netCents).toBe(6000) |  |
| }) |  |

| it('aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie', () => { | it('aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie', () => { |
| --- | --- |
| const state = makePhoenixState({ | const state = makePhoenixState({ |
| activeStep: 'WIZARD', | activeStep: 'WIZARD', |
| data: { | data: { |
| finance: { | finance: { |
| income: { | income: { |
| items: [ | items: [ |
| { id: 'week-100', amountCents: 10000, frequency: 'week' }, // ≈ 43333 | { id: 'week-100', amountCents: 10000, frequency: 'week' }, // ≈ 43333 |
| { id: '4wk-1000', amountCents: 100000, frequency: '4wk' }, // ≈ 108333 | { id: '4wk-1000', amountCents: 100000, frequency: '4wk' }, // ≈ 108333 |
| { id: 'q-300', amountCents: 30000, frequency: 'quarter' }, // 10000 | { id: 'q-300', amountCents: 30000, frequency: 'quarter' }, // 10000 |
| { id: 'y-12000', amountCents: 1200000, frequency: 'year' }, // 100000 | { id: 'y-12000', amountCents: 1200000, frequency: 'year' }, // 100000 |
| ], | ], |
| }, | }, |
| expenses: { items: [] }, | expenses: { items: [] }, |
| }, | }, |
| }, | }, |
| }); | }); |

    const summary = computePhoenixSummary(state);

| expect(summary.totalIncomeCents).toBe(261666) |  |
| --- | --- |
| expect(summary.totalExpensesCents).toBe(0) |  |
| expect(summary.netCents).toBe(261666) |  |
| }) |  |

| it('lege income/expenses → alle totals 0' | () => { |
| --- | --- |
| activeStep: 'WIZARD' |  |
| income: { items: [] } |  |
| expenses: { items: [] } |  |
| } |  |
| } |  |

    const summary = computePhoenixSummary(state);

    expect(summary.totalIncomeCents).toBe(0);
    expect(summary.totalExpensesCents).toBe(0);
    expect(summary.netCents).toBe(0);
  });
});
```

```
import { computePhoenixSummary } from '@logic/finance';
import { makePhoenixState } from '@test-utils/state';

describe('WAI-004C Finance Integratie (Phoenix)', () => {

| it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => { | it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => { |
| --- | --- |
| // Gebruik de state helper voor een schone mock-opbouw | // Gebruik de state helper voor een schone mock-opbouw |
| const state = makePhoenixState({ | const state = makePhoenixState({ |
| activeStep: 'WIZARD', | activeStep: 'WIZARD', |
| data: { | data: { |
| finance: { | finance: { |
| income: { | income: { |
| items: [{ id: 'inc-1', amountCents: 10000, frequency: 'month' }] | items: [{ id: 'inc-1', amountCents: 10000, frequency: 'month' }] |
| }, | }, |
| expenses: { | expenses: { |
| items: [{ id: 'exp-1', amountCents: 4000, frequency: 'month' }] | items: [{ id: 'exp-1', amountCents: 4000, frequency: 'month' }] |
| }, | }, |
| }, | }, |
| }, | }, |
| }); | }); |

    const summary = computePhoenixSummary(state);

| expect(summary.totalIncomeCents).toBe(10000) |  |
| --- | --- |
| expect(summary.totalExpensesCents).toBe(4000) |  |
| expect(summary.netCents).toBe(6000) |  |
| }) |  |

| it('aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie', () => { | it('aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie', () => { |
| --- | --- |
| const state = makePhoenixState({ | const state = makePhoenixState({ |
| activeStep: 'WIZARD', | activeStep: 'WIZARD', |
| data: { | data: { |
| finance: { | finance: { |
| income: { | income: { |
| items: [ | items: [ |
| { id: 'week-100', amountCents: 10000, frequency: 'week' }, // ≈ 43333 | { id: 'week-100', amountCents: 10000, frequency: 'week' }, // ≈ 43333 |
| { id: '4wk-1000', amountCents: 100000, frequency: '4wk' }, // ≈ 108333 | { id: '4wk-1000', amountCents: 100000, frequency: '4wk' }, // ≈ 108333 |
| { id: 'q-300', amountCents: 30000, frequency: 'quarter' }, // 10000 | { id: 'q-300', amountCents: 30000, frequency: 'quarter' }, // 10000 |
| { id: 'y-12000', amountCents: 1200000, frequency: 'year' }, // 100000 | { id: 'y-12000', amountCents: 1200000, frequency: 'year' }, // 100000 |
| ], | ], |
| }, | }, |
| expenses: { items: [] }, | expenses: { items: [] }, |
| }, | }, |
| }, | }, |
| }); | }); |

    const summary = computePhoenixSummary(state);

| expect(summary.totalIncomeCents).toBe(261666) |  |
| --- | --- |
| expect(summary.totalExpensesCents).toBe(0) |  |
| expect(summary.netCents).toBe(261666) |  |
| }) |  |

| it('lege income/expenses → alle totals 0' | () => { |
| --- | --- |
| activeStep: 'WIZARD' |  |
| income: { items: [] } |  |
| expenses: { items: [] } |  |
| } |  |
| } |  |

    const summary = computePhoenixSummary(state);

    expect(summary.totalIncomeCents).toBe(0);
    expect(summary.totalExpensesCents).toBe(0);
    expect(summary.netCents).toBe(0);
  });
});
```

```
makePhoenixState
```

```
./phoenix full
```

```
computePhoenixSummary
```

| - Efficiëntie: Door te gebruiken | hoef je niet bij elke test handmatig lege objecten voor setup of household te definiëren. |
| --- | --- |
| - Traceerbaarheid: De complexe berekening met normalisatie (week naar maand) is nu gedocumenteerd met commentaren in de test zelf | wat helpt bij toekomstige debugging. |

Kun je dit samenvoegen?

import { computePhoenixSummary } from '@logic/finance';

import { makePhoenixState } from '@test-utils/state';

describe('WAI-004C Finance Integratie (Phoenix)', () => {

  it('100,00 - 40,00 → 6000 ct', () => {

    const state = makePhoenixState({

      activeStep: 'WIZARD',

      data: {

        finance: {

          income:   { items: [{ id: 'inc', amountCents: 10000, frequency: 'month' }] },

          expenses: { items: [{ id: 'exp', amountCents:  4000, frequency: 'month' }] },

        },

      },

    });

    const s = computePhoenixSummary(state);

    expect(s.totalIncomeCents).toBe(10000);

    expect(s.totalExpensesCents).toBe(4000);

    expect(s.netCents).toBe(6000);

  });

});

// src/logic/__tests__/finance.test.ts

import { computePhoenixSummary } from '@logic/finance';

import { FormState } from '../../shared-types/form';

describe('WAI-004C Finance Integratie (Phoenix)', () => {

  it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => {

    const mockState: FormState = {

      activeStep: 'WIZARD',

      data: {

        setup: {},

        household: { members: [] },

        finance: {

          income: {

            items: [

              // €100,00

              { id: 'inc-1', amountCents: 10000, frequency: 'month' },

            ],

          },

          expenses: {

            items: [

              // €40,00

              { id: 'exp-1', amountCents: 4000, frequency: 'month' },

            ],

          },

        },

      },

    };

    const summary = computePhoenixSummary(mockState);

    expect(summary.totalIncomeCents).toBe(10000);

    expect(summary.totalExpensesCents).toBe(4000);

    expect(summary.netCents).toBe(6000);

  });

  it('aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie', () => {

    const mockState: FormState = {

      activeStep: 'WIZARD',

      data: {

        setup: {},

        household: { members: [] },

        finance: {

          income: {

            items: [

              { id: 'week-100', amountCents: 10000, frequency: 'week' },    // ≈ 43333

              { id: '4wk-1000', amountCents: 100000, frequency: '4wk' },    // ≈ 108333

              { id: 'q-300',    amountCents: 30000, frequency: 'quarter' }, // 10000

              { id: 'y-12000',  amountCents: 1200000, frequency: 'year' },  // 100000

            ],

          },

          expenses: { items: [] },

        },

      },

    };

    const summary = computePhoenixSummary(mockState);

    // 43333 + 108333 + 10000 + 100000 = 261666

    expect(summary.totalIncomeCents).toBe(261666);

    expect(summary.totalExpensesCents).toBe(0);

    expect(summary.netCents).toBe(261666);

  });

  it('lege income/expenses → alle totals 0', () => {

    const mockState: FormState = {

      activeStep: 'WIZARD',

      data: {

        setup: {},

        household: { members: [] },

        finance: {

          income:   { items: [] },

          expenses: { items: [] },

        },

      },

    };

    const summary = computePhoenixSummary(mockState);

    expect(summary.totalIncomeCents).toBe(0);

    expect(summary.totalExpensesCents).toBe(0);

    expect(summary.netCents).toBe(0);

  });

});

Hier is de samengevoegde testsuite voor de Finance Integratie. Ik heb gebruikgemaakt van de helper om de tests compacter en leesbaarder te maken, terwijl de uitgebreide testscenario's voor de normalisatie behouden zijn gebleven.

src/logic/__tests__/finance.test.ts
TypeScript
Waarom deze opzet?

Wanneer je deze tests draait via de Phoenix Commander, kun je de coverage direct inzien:

Zal ik je ook helpen bij het schrijven van de logica zelf, voor het geval de maandnormalisatie nog niet volledig geïmplementeerd is?

Bronnen

---

**User:**

```
makePhoenixState
```

```
import { computePhoenixSummary } from '@logic/finance';
import { makePhoenixState } from '@test-utils/state';

describe('WAI-004C Finance Integratie (Phoenix)', () => {

| it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => { | it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => { |
| --- | --- |
| // Gebruik van makePhoenixState voor een schone en snelle setup | // Gebruik van makePhoenixState voor een schone en snelle setup |
| const state = makePhoenixState({ | const state = makePhoenixState({ |
| activeStep: 'WIZARD', | activeStep: 'WIZARD', |
| data: { | data: { |
| finance: { | finance: { |
| income: { items: [{ id: 'inc-1', amountCents: 10000, frequency: 'month' }] }, | income: { items: [{ id: 'inc-1', amountCents: 10000, frequency: 'month' }] }, |
| expenses: { items: [{ id: 'exp-1', amountCents: 4000, frequency: 'month' }] }, | expenses: { items: [{ id: 'exp-1', amountCents: 4000, frequency: 'month' }] }, |
| }, | }, |
| }, | }, |
| }); | }); |

    const summary = computePhoenixSummary(state);

| expect(summary.totalIncomeCents).toBe(10000) |  |
| --- | --- |
| expect(summary.totalExpensesCents).toBe(4000) |  |
| expect(summary.netCents).toBe(6000) |  |
| }) |  |

| it('aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie', () => { | it('aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie', () => { |
| --- | --- |
| const state = makePhoenixState({ | const state = makePhoenixState({ |
| activeStep: 'WIZARD', | activeStep: 'WIZARD', |
| data: { | data: { |
| finance: { | finance: { |
| income: { | income: { |
| items: [ | items: [ |
| { id: 'week-100', amountCents: 10000, frequency: 'week' }, // ≈ 43333 | { id: 'week-100', amountCents: 10000, frequency: 'week' }, // ≈ 43333 |
| { id: '4wk-1000', amountCents: 100000, frequency: '4wk' }, // ≈ 108333 | { id: '4wk-1000', amountCents: 100000, frequency: '4wk' }, // ≈ 108333 |
| { id: 'q-300', amountCents: 30000, frequency: 'quarter' }, // 10000 | { id: 'q-300', amountCents: 30000, frequency: 'quarter' }, // 10000 |
| { id: 'y-12000', amountCents: 1200000, frequency: 'year' }, // 100000 | { id: 'y-12000', amountCents: 1200000, frequency: 'year' }, // 100000 |
| ], | ], |
| }, | }, |
| expenses: { items: [] }, | expenses: { items: [] }, |
| }, | }, |
| }, | }, |
| }); | }); |

    const summary = computePhoenixSummary(state);

| expect(summary.totalIncomeCents).toBe(261666) |  |
| --- | --- |
| expect(summary.totalExpensesCents).toBe(0) |  |
| expect(summary.netCents).toBe(261666) |  |
| }) |  |

| it('lege income/expenses → alle totals 0' | () => { |
| --- | --- |
| activeStep: 'WIZARD' |  |
| income: { items: [] } |  |
| expenses: { items: [] } |  |
| } |  |
| } |  |

    const summary = computePhoenixSummary(state);

    expect(summary.totalIncomeCents).toBe(0);
    expect(summary.totalExpensesCents).toBe(0);
    expect(summary.netCents).toBe(0);
  });
});
```

```
import { computePhoenixSummary } from '@logic/finance';
import { makePhoenixState } from '@test-utils/state';

describe('WAI-004C Finance Integratie (Phoenix)', () => {

| it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => { | it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => { |
| --- | --- |
| // Gebruik van makePhoenixState voor een schone en snelle setup | // Gebruik van makePhoenixState voor een schone en snelle setup |
| const state = makePhoenixState({ | const state = makePhoenixState({ |
| activeStep: 'WIZARD', | activeStep: 'WIZARD', |
| data: { | data: { |
| finance: { | finance: { |
| income: { items: [{ id: 'inc-1', amountCents: 10000, frequency: 'month' }] }, | income: { items: [{ id: 'inc-1', amountCents: 10000, frequency: 'month' }] }, |
| expenses: { items: [{ id: 'exp-1', amountCents: 4000, frequency: 'month' }] }, | expenses: { items: [{ id: 'exp-1', amountCents: 4000, frequency: 'month' }] }, |
| }, | }, |
| }, | }, |
| }); | }); |

    const summary = computePhoenixSummary(state);

| expect(summary.totalIncomeCents).toBe(10000) |  |
| --- | --- |
| expect(summary.totalExpensesCents).toBe(4000) |  |
| expect(summary.netCents).toBe(6000) |  |
| }) |  |

| it('aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie', () => { | it('aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie', () => { |
| --- | --- |
| const state = makePhoenixState({ | const state = makePhoenixState({ |
| activeStep: 'WIZARD', | activeStep: 'WIZARD', |
| data: { | data: { |
| finance: { | finance: { |
| income: { | income: { |
| items: [ | items: [ |
| { id: 'week-100', amountCents: 10000, frequency: 'week' }, // ≈ 43333 | { id: 'week-100', amountCents: 10000, frequency: 'week' }, // ≈ 43333 |
| { id: '4wk-1000', amountCents: 100000, frequency: '4wk' }, // ≈ 108333 | { id: '4wk-1000', amountCents: 100000, frequency: '4wk' }, // ≈ 108333 |
| { id: 'q-300', amountCents: 30000, frequency: 'quarter' }, // 10000 | { id: 'q-300', amountCents: 30000, frequency: 'quarter' }, // 10000 |
| { id: 'y-12000', amountCents: 1200000, frequency: 'year' }, // 100000 | { id: 'y-12000', amountCents: 1200000, frequency: 'year' }, // 100000 |
| ], | ], |
| }, | }, |
| expenses: { items: [] }, | expenses: { items: [] }, |
| }, | }, |
| }, | }, |
| }); | }); |

    const summary = computePhoenixSummary(state);

| expect(summary.totalIncomeCents).toBe(261666) |  |
| --- | --- |
| expect(summary.totalExpensesCents).toBe(0) |  |
| expect(summary.netCents).toBe(261666) |  |
| }) |  |

| it('lege income/expenses → alle totals 0' | () => { |
| --- | --- |
| activeStep: 'WIZARD' |  |
| income: { items: [] } |  |
| expenses: { items: [] } |  |
| } |  |
| } |  |

    const summary = computePhoenixSummary(state);

    expect(summary.totalIncomeCents).toBe(0);
    expect(summary.totalExpensesCents).toBe(0);
    expect(summary.netCents).toBe(0);
  });
});
```

```
makePhoenixState
```

```
./phoenix full
```

| Key | Value |
| --- | --- |
| Helper Integratie | Alle tests maken nu gebruik van . Hierdoor hoef je niet langer handmatig lege setup of household objecten mee te geven, wat de tests veel minder fragiel maakt bij schema-wijzigingen. |
| Normalisatie Logica | De complexe testcase voor verschillende frequenties (week, kwartaal, etc.) is behouden, inclusief de verwachte afrondingen naar maandbedragen. |
| Naamgeving | De testomschrijvingen zijn gestandaardiseerd volgens je WAI-004C referentie. |

Zou je deze willen samenvoegen?

Ik heb de twee testbestanden voor je samengevoegd tot één krachtige en overzichtelijke testsuite. Hierbij heb ik de helper uit je eerste voorbeeld gebruikt om de code in de overige tests ook direct te verkorten en te moderniseren.

src/logic/tests/finance.test.ts
TypeScript
Wat is er aangepast?

Je kunt deze tests nu direct draaien met de Phoenix Commander:

Bronnen

---

**User:**

```
StorageShim
```

```
makePhoenixState
```

```
import { makePhoenixState } from '@test-utils/state';

| jest.resetModules() |  |
| --- | --- |
| jest.clearAllMocks() |  |
| }) |  |

  // Helper voor AsyncStorage toegang
  const getAsyncMock = () => require('@react-native-async-storage/async-storage').default;

| it('delegates loadState to legacy wanneer beschikbaar (Integriteits-gate)' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ |
| __esModule: true |  |
| schemaVersion: '1.0' |  |
| setup: { aantalMensen: 2 } |  |
| household: { members: [] } |  |
| finance: {} |  |
| } |  |
| })) |  |
| } |  |

| const { StorageShim } = require('../storageShim') |  |
| --- | --- |
| const res = await StorageShim.loadState() |  |

| expect(res?.schemaVersion).toBe('1.0') |  |
| --- | --- |
| expect(res?.data?.setup?.aantalMensen).toBe(2) |  |
| expect(res?.data?.household?.members).toEqual([]) |  |
| }) |  |

| it('enforces schemaVersion en envelope op saveState (Audit gate)' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ __esModule: true })); |
| jest.doMock('@react-native-async-storage/async-storage' | () => ({ |
| __esModule: true |  |
| default: { setItem: mockSetItem } |  |

    const { StorageShim } = require('../storageShim');

| // Gebruik de centrale helper voor het genereren van de state | // Gebruik de centrale helper voor het genereren van de state |
| --- | --- |
| const mockState = makePhoenixState({ | const mockState = makePhoenixState({ |
| data: { | data: { |
| setup: { aantalMensen: 2 }, | setup: { aantalMensen: 2 }, |
| household: { members: [] } | household: { members: [] } |
| } | } |
| }); | }); |

    await StorageShim.saveState(mockState as any);

| const [key, rawValue] = mockSetItem.mock.calls[0] |  |
| --- | --- |
| const payload = JSON.parse(rawValue) |  |

| expect(key).toBe('@CashflowWizardState') |  |
| --- | --- |
| expect(payload.version).toBe(2) |  |
| expect(payload.state.schemaVersion).toBe('1.0') |  |
| expect(payload.state.data.setup.aantalMensen).toBe(2) |  |
| }) |  |

| it('gebruikt removeItem in plaats van clear() voor compliance (Safety gate)' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ __esModule: true })); |
| jest.doMock('@react-native-async-storage/async-storage' | () => ({ |
| __esModule: true |  |
| default: { removeItem: mockRemoveItem } |  |

| const { StorageShim } = require('../storageShim') |  |
| --- | --- |
| await StorageShim.clearAll() |  |

| expect(mockRemoveItem).toHaveBeenCalledWith('@CashflowWizardState') |  |
| --- | --- |
| }) |  |

| it('delegates clearAll naar legacy indien beschikbaar' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ |
| __esModule: true |  |
| Storage: { clearAll: mockLegacyClear } |  |

| const { StorageShim } = require('../storageShim') |  |
| --- | --- |
| await StorageShim.clearAll() |  |

| expect(mockLegacyClear).toHaveBeenCalled() |  |
| --- | --- |
| }) |  |

| it('returns null op loadState wanneer legacy afwezig is (Anti-corruption gate)' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ __esModule: true })); |

| const { StorageShim } = require('../storageShim') |  |
| --- | --- |
| const res = await StorageShim.loadState() |  |

    expect(res).toBeNull();
  });
});
```

```
import { makePhoenixState } from '@test-utils/state';

| jest.resetModules() |  |
| --- | --- |
| jest.clearAllMocks() |  |
| }) |  |

  // Helper voor AsyncStorage toegang
  const getAsyncMock = () => require('@react-native-async-storage/async-storage').default;

| it('delegates loadState to legacy wanneer beschikbaar (Integriteits-gate)' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ |
| __esModule: true |  |
| schemaVersion: '1.0' |  |
| setup: { aantalMensen: 2 } |  |
| household: { members: [] } |  |
| finance: {} |  |
| } |  |
| })) |  |
| } |  |

| const { StorageShim } = require('../storageShim') |  |
| --- | --- |
| const res = await StorageShim.loadState() |  |

| expect(res?.schemaVersion).toBe('1.0') |  |
| --- | --- |
| expect(res?.data?.setup?.aantalMensen).toBe(2) |  |
| expect(res?.data?.household?.members).toEqual([]) |  |
| }) |  |

| it('enforces schemaVersion en envelope op saveState (Audit gate)' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ __esModule: true })); |
| jest.doMock('@react-native-async-storage/async-storage' | () => ({ |
| __esModule: true |  |
| default: { setItem: mockSetItem } |  |

    const { StorageShim } = require('../storageShim');

| // Gebruik de centrale helper voor het genereren van de state | // Gebruik de centrale helper voor het genereren van de state |
| --- | --- |
| const mockState = makePhoenixState({ | const mockState = makePhoenixState({ |
| data: { | data: { |
| setup: { aantalMensen: 2 }, | setup: { aantalMensen: 2 }, |
| household: { members: [] } | household: { members: [] } |
| } | } |
| }); | }); |

    await StorageShim.saveState(mockState as any);

| const [key, rawValue] = mockSetItem.mock.calls[0] |  |
| --- | --- |
| const payload = JSON.parse(rawValue) |  |

| expect(key).toBe('@CashflowWizardState') |  |
| --- | --- |
| expect(payload.version).toBe(2) |  |
| expect(payload.state.schemaVersion).toBe('1.0') |  |
| expect(payload.state.data.setup.aantalMensen).toBe(2) |  |
| }) |  |

| it('gebruikt removeItem in plaats van clear() voor compliance (Safety gate)' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ __esModule: true })); |
| jest.doMock('@react-native-async-storage/async-storage' | () => ({ |
| __esModule: true |  |
| default: { removeItem: mockRemoveItem } |  |

| const { StorageShim } = require('../storageShim') |  |
| --- | --- |
| await StorageShim.clearAll() |  |

| expect(mockRemoveItem).toHaveBeenCalledWith('@CashflowWizardState') |  |
| --- | --- |
| }) |  |

| it('delegates clearAll naar legacy indien beschikbaar' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ |
| __esModule: true |  |
| Storage: { clearAll: mockLegacyClear } |  |

| const { StorageShim } = require('../storageShim') |  |
| --- | --- |
| await StorageShim.clearAll() |  |

| expect(mockLegacyClear).toHaveBeenCalled() |  |
| --- | --- |
| }) |  |

| it('returns null op loadState wanneer legacy afwezig is (Anti-corruption gate)' | async () => { |
| --- | --- |
| jest.doMock('@services/storage' | () => ({ __esModule: true })); |

| const { StorageShim } = require('../storageShim') |  |
| --- | --- |
| const res = await StorageShim.loadState() |  |

    expect(res).toBeNull();
  });
});
```

```
makePhoenixState
```

```
StorageShim
```

```
@CashflowWizardState
```

| Key | Value |
| --- | --- |
| Architecturale Consistentie | De test voor saveState valideert nu expliciet de version 2 envelope en de schemaVersion 1.0 shadow flag, wat essentieel is voor je orchestrator. |
| Compacte State Setup | Door te gebruiken, is de code minder gevoelig voor wijzigingen in het FormState type, omdat de helper de standaardvelden invult. |
| Safety Gates | De tests voor removeItem en de legacy-delegatie zorgen ervoor dat de applicatie veilig kan migreren zonder globale opslag te vervuilen. |

import { makePhoenixState } from '@test-utils/state';

import StorageShim from '../../services/storageShim';

describe('CU-001-SHIM StorageShim', () => {

  it('envelope v2 met schemaVersion 1.0', async () => {

    const mock = makePhoenixState({ data: { setup: { aantalMensen: 2 } } });

    await StorageShim.saveState(mock as any);

    // ... assertions op AsyncStorage mock

  });

});

// src/services/__tests__/storageShim.test.ts

import { type FormState } from '../../shared-types/form';

describe('CU-001-SHIM StorageShim', () => {

  beforeEach(() => {

    jest.resetModules();

    jest.clearAllMocks();

  });

  const getAsyncMock = () => require('@react-native-async-storage/async-storage').default;

  it('delegates loadState to legacy when available (Integriteits-gate)', async () => {

    // Mock legacy storage met volledige Phoenix state

    jest.doMock('@services/storage', () => ({

      __esModule: true,

      Storage: {

        loadState: jest.fn(async () => ({

          schemaVersion: '1.0',

          data: {

            setup: {},

            household: { members: [] },

            finance: {},

          },

        })),

      },

    }));

    const { StorageShim } = require('../storageShim');

    const res = await StorageShim.loadState();

    expect(res?.schemaVersion).toBe('1.0');

    expect(res?.data?.household?.members).toEqual([]);

  });

  it('returns null on loadState when legacy is absent (Anti-corruption gate)', async () => {

    jest.doMock('@services/storage', () => ({ __esModule: true }));

    const { StorageShim } = require('../storageShim');

    const res = await StorageShim.loadState();

    expect(res).toBeNull();

  });

  it('enforces schemaVersion and envelope on saveState (Audit gate)', async () => {

    const mockSetItem = jest.fn();

    jest.doMock('@services/storage', () => ({ __esModule: true }));

    jest.doMock('@react-native-async-storage/async-storage', () => ({

      __esModule: true,

      default: { setItem: mockSetItem },

    }));

    const { StorageShim } = require('../storageShim');

    const mockState: FormState = {

      activeStep: 'WIZARD',

      data: {

        setup: { aantalMensen: 2 },

        household: { members: [] },

        finance: {},

      },

    };

    await StorageShim.saveState(mockState as any);

    const [key, rawValue] = mockSetItem.mock.calls[0];

    const payload = JSON.parse(rawValue);

    expect(key).toBe('@CashflowWizardState');

    expect(payload.version).toBe(2);

    expect(payload.state.schemaVersion).toBe('1.0');

    expect(payload.state.data.setup.aantalMensen).toBe(2);

  });

  it('uses removeItem instead of clear() for compliance (Safety gate)', async () => {

    const mockRemoveItem = jest.fn();

    jest.doMock('@services/storage', () => ({ __esModule: true }));

    jest.doMock('@react-native-async-storage/async-storage', () => ({

      __esModule: true,

      default: { removeItem: mockRemoveItem },

    }));

    const { StorageShim } = require('../storageShim');

    await StorageShim.clearAll();

    expect(mockRemoveItem).toHaveBeenCalledWith('@CashflowWizardState');

  });

  it('delegates clearAll to legacy if available', async () => {

    const mockLegacyClear = jest.fn();

    jest.doMock('@services/storage', () => ({

      __esModule: true,

      Storage: { clearAll: mockLegacyClear },

    }));

    const { StorageShim } = require('../storageShim');

    await StorageShim.clearAll();

    expect(mockLegacyClear).toHaveBeenCalled();

  });

});

Zou je deze willen samenvoegen?

Hier is de samengevoegde testsuite voor de . Ik heb de helper geïntegreerd om de handmatige mock-data te verkorten en de tests consistent te maken met de Phoenix v2 Envelope architectuur.

src/services/tests/storageShim.test.ts
TypeScript
Belangrijkste verbeteringen in de samengevoegde versie:

Zou je willen dat ik de zelf aanpas zodat deze de key als constante gebruikt, om consistentie met de tests te garanderen?

---

**User:**

```
makePhoenixState
```

```
accessibility
```

```
react-native-testing-library
```

```
import * as React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Navigator from '../navigation/Navigator';
import { makePhoenixState } from '@test-utils/state';

| describe('WAI-009: Focus Management (Project Eis 2025)' | () => { |
| --- | --- |
| it('focust het juiste invoerveld op de WIZARD-setup pagina (Phoenix fieldId)' | async () => { |

    const screen = render(<Navigator state={landingState} />);

    // 2) LANDING: Controleer of de welkomsttekst zichtbaar is
    expect(screen.getByText(/Welkom/i)).toBeTruthy();

| activeStep: 'WIZARD' |  |
| --- | --- |
| currentPageId: 'setupHousehold' |  |
| setup: { aantalMensen: 1 } |  |
| entityId: '1' |  |
| fieldId: 'member_1' |  |
| memberType: 'adult' |  |
| } |  |
| finance: {} |  |
| } |  |

    screen.rerender(<Navigator state={wizardState} />);

| screen.queryByRole('header') |  |  |
| --- | --- | --- |
| screen.queryByA11yRole('header') |  |  |
| screen.queryByText(/(Setup | Huishouden | Wizard)/i); |

| expect(header).toBeTruthy() |  |
| --- | --- |
| }) |  |

| // 5) Zoek het invoerveld via de Phoenix fieldId-conventie | // 5) Zoek het invoerveld via de Phoenix fieldId-conventie |
| --- | --- |
| const inputAantal = | const inputAantal = |
| screen.queryByTestId('input-aantalMensen') \|\| | screen.queryByTestId('input-aantalMensen') \|\| |
| screen.queryByText(/Totaal aantal bewoners\|aantalMensen/i); | screen.queryByText(/Totaal aantal bewoners\|aantalMensen/i); |

    expect(inputAantal).toBeTruthy();

| screen.queryByTestId('focused-aantalMensen') |  |  |
| --- | --- | --- |
| screen.queryByRole({ selected: true }) |  |  |

    expect(focused).toBeTruthy();
  });
});
```

```
import * as React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Navigator from '../navigation/Navigator';
import { makePhoenixState } from '@test-utils/state';

| describe('WAI-009: Focus Management (Project Eis 2025)' | () => { |
| --- | --- |
| it('focust het juiste invoerveld op de WIZARD-setup pagina (Phoenix fieldId)' | async () => { |

    const screen = render(<Navigator state={landingState} />);

    // 2) LANDING: Controleer of de welkomsttekst zichtbaar is
    expect(screen.getByText(/Welkom/i)).toBeTruthy();

| activeStep: 'WIZARD' |  |
| --- | --- |
| currentPageId: 'setupHousehold' |  |
| setup: { aantalMensen: 1 } |  |
| entityId: '1' |  |
| fieldId: 'member_1' |  |
| memberType: 'adult' |  |
| } |  |
| finance: {} |  |
| } |  |

    screen.rerender(<Navigator state={wizardState} />);

| screen.queryByRole('header') |  |  |
| --- | --- | --- |
| screen.queryByA11yRole('header') |  |  |
| screen.queryByText(/(Setup | Huishouden | Wizard)/i); |

| expect(header).toBeTruthy() |  |
| --- | --- |
| }) |  |

| // 5) Zoek het invoerveld via de Phoenix fieldId-conventie | // 5) Zoek het invoerveld via de Phoenix fieldId-conventie |
| --- | --- |
| const inputAantal = | const inputAantal = |
| screen.queryByTestId('input-aantalMensen') \|\| | screen.queryByTestId('input-aantalMensen') \|\| |
| screen.queryByText(/Totaal aantal bewoners\|aantalMensen/i); | screen.queryByText(/Totaal aantal bewoners\|aantalMensen/i); |

    expect(inputAantal).toBeTruthy();

| screen.queryByTestId('focused-aantalMensen') |  |  |
| --- | --- | --- |
| screen.queryByRole({ selected: true }) |  |  |

    expect(focused).toBeTruthy();
  });
});
```

```
makePhoenixState
```

```
getByA11yRole
```

```
input-aantalMensen
```

```
FocusManager
```

```
focused-${fieldId}
```

| Key | Value |
| --- | --- |
| Helper Integratie | Door te gebruiken, is de test minder gevoelig voor toekomstige wijzigingen in het FormState object, aangezien de helper de standaard boilerplate invult. |
| Verbeterde Selectors | De test gebruikt nu zowel getByRole als om compatibiliteit tussen verschillende versies van de testing-library te garanderen. |
| Phoenix FieldId Conventie | De zoeklogica voor sluit aan bij de audit-scripts en migratie-tools in je Phoenix Commander. |
| Focus Assertions | Er is een fallback-keten toegevoegd om de focus-status te verifiëren, wat cruciaal is voor de toegankelijkheidseisen van 2025. |

zou je deze willen samen voegen?

import { render, waitFor } from '@testing-library/react-native';

import Navigator from '../navigation/Navigator';

import { makePhoenixState } from '@test-utils/state';

describe('WAI-009: Focus Management', () => {

  it('focust op het juiste inputveld', async () => {

    const landing = makePhoenixState({ activeStep: 'LANDING' });

    const screen = render(<Navigator state={landing} />);

    expect(screen.getByText(/Welkom/i)).toBeTruthy();

    const wizard = makePhoenixState({

      activeStep: 'WIZARD',

      currentPageId: 'setupHousehold',

      data: {

        setup: { aantalMensen: 1 },

        household: { members: [{ entityId: '1', fieldId: 'member-1', memberType: 'adult', naam: '' }] },

        finance: {},

      },

    });

    screen.rerender(<Navigator state={wizard} />);

    await waitFor(() => {

      // RN-RTL: gebruik getByA11yRole i.p.v. getByRole

      const header = screen.getByA11yRole('header');

      expect(header).toBeTruthy();

    });

    // Zoek input via fieldId conventie (als je testID zo hebt ingesteld)

    const inputAantal = screen.queryByTestId('input-aantalMensen') || screen.queryByText(/Totaal/i);

    expect(inputAantal).toBeTruthy();

  });

});

// src/__tests__/WAI009_FocusManagement.test.tsx

import * as React from 'react';

import { render, waitFor } from '@testing-library/react-native';

import Navigator from '../navigation/Navigator';

import { FormState } from '../shared-types/form';

describe('WAI-009: Focus Management (Project Eis 2025)', () => {

  it('focust het juiste invoerveld op de WIZARD-setup pagina (Phoenix fieldId)', async () => {

    // 1) Start op LANDING met minimale Phoenix-state

    const testState: FormState = {

      activeStep: 'LANDING',

      data: {

        setup: { aantalMensen: 1 }, // nodig om het veld zichtbaar te maken op WIZARD

        household: { members: [// In de members array

          {

            entityId: '1',

            fieldId: 'member_1', // VOEG DIT TOE

            memberType: 'adult',

            naam: 'Jan'

          }] },

        finance: {},

      },

    };

    const screen = render(<Navigator state={testState} />);

    // 2) LANDING: header of welkomsttekst zichtbaar

    // Gebruik getByText of role; afhankelijk van je LandingScreen implementatie:

    expect(screen.getByText(/Welkom/i)).toBeTruthy();

    // 3) Ga naar WIZARD (setup step index 0)

    const wizardState: FormState = {

      ...testState,

      activeStep: 'WIZARD',

      // optioneel: als je currentPageId of pageIndex gebruikt:

      // currentPageId: 'setupHousehold',

      // of activeStep: 0 (indien numerieke index), maar we gebruiken string hier:

    };

    screen.rerender(<Navigator state={wizardState} />);

    // 4) Wacht tot wizard UI er staat (bijv. header of step-title)

    // Let op: afhankelijk van je a11y-setup kun je getByRole('header') gebruiken

    await waitFor(() => {

      const header =

        // Voor react-native-testing-library:

        (screen as any).getByRole?.('header') ||

        // Fallback: a11y role selector als je 'getByRole' niet hebt:

        screen.getByRole?.('header') ||

        // Fallback: tekst van de wizard header

        screen.getByText(/(Setup|Huishouden|Wizard)/i);

      expect(header).toBeTruthy();

    });

    // 5) Zoek het invoerveld via fieldId-conventie: "input-aantalMensen"

    const inputAantal =

      screen.queryByTestId('input-aantalMensen') ||

      // Fallback op label-tekst, als je geen testID hebt:

      screen.queryByText(/Totaal aantal bewoners|aantalMensen/i);

    expect(inputAantal).toBeTruthy();

    // 6) (Optioneel) focus-check: veel RN-componenten hebben geen 'focus' event zoals web.

    // Als je een custom focus-actie hebt (bijv. setFocus(fieldId)), kun je daarop testen:

    // fireEvent(inputAantal!, 'focus'); // Alleen als je component het ondersteunt

    // Of controleer dat jouw focus-manager het juiste input als 'actief' markeert (bv. stijl/testID toggle):

    // Voorbeeld: controleer dat er een 'focused' style/testID actief is

    const focused =

      screen.queryByTestId('focused-aantalMensen') ||

      // Als de component een accessibilityState gebruikt:

      screen.queryByRole?.({ selected: true }) ||

      // Laatste fallback: bestaat het element en is het enabled:

      inputAantal;

    expect(focused).toBeTruthy();

  });

});

Hier is de samengevoegde testsuite voor Focus Management. Ik heb de robuuste scenario's van de tweede test gecombineerd met de compacte helper uit je eerste voorbeeld. Ook zijn de selectors geoptimaliseerd voor .

src/__tests__/WAI009_FocusManagement.test.tsx
TypeScript
Belangrijkste verbeteringen in de Merge:

Zal ik je helpen bij het aanpassen van de component zelf, zodat deze de testID automatisch toevoegt aan het actieve veld?

Bronnen

---

**User:**

```
selected: true
```

```
selected: true
```

```
# De basis selectors hernoemen
sed -i 's/getByA11yRole/getByRole/g' $(rg -l 'getByA11yRole' src)
sed -i 's/getByA11yLabel/getByLabelText/g' $(rg -l 'getByA11yLabel' src)
sed -i 's/queryByA11yRole/queryByRole/g' $(rg -l 'queryByA11yRole' src)
```

```
# De basis selectors hernoemen
sed -i 's/getByA11yRole/getByRole/g' $(rg -l 'getByA11yRole' src)
sed -i 's/getByA11yLabel/getByLabelText/g' $(rg -l 'getByA11yLabel' src)
sed -i 's/queryByA11yRole/queryByRole/g' $(rg -l 'queryByA11yRole' src)
```

```
selected: true
```

```
queryByRole
```

```
queryByRole({ selected: true })
```

```
queryByRole('button', { selected: true })
```

```
sed -i "s/queryByRole({ selected: true })/queryByRole('button', { selected: true })/g" $(rg -l 'selected: true' src)
```

```
sed -i "s/queryByRole({ selected: true })/queryByRole('button', { selected: true })/g" $(rg -l 'selected: true' src)
```

```
getByLabelText
```

```
./phoenix full
```

```
./phoenix full
```

```
WAI009_FocusManagement.test.tsx
```

```
StorageShim
```

```
scripts/audit_keys.sh
```

heb je een commando voor dit?

Actie: Vervang deze handmatig of via dit commando:

getByA11yRole $\rightarrow$ getByRole

getByA11yLabel $\rightarrow$ getByLabelText

queryByA11yRole $\rightarrow$ queryByRole

Specifiek voor de selected: true error:

In queryByRole moet de state nu in een apart object:

Fout: queryByRole({ selected: true })

Goed: queryByRole('button', { selected: true }) (of welke rol het ook is).

Voor het opruimen van deze legacy RTL (React Testing Library) selectors en het fixen van de syntax, kun je een combinatie van sed en rg gebruiken.

Omdat de wijziging contextgevoelig is (er moet een rol zoals 'button' bij), heb ik het commando zo opgebouwd dat het de meest voorkomende rol in jouw project gebruikt.

1. Massa-vervanging van de namen

Dit commando vervangt de namen van de functies in je hele src map:

Bash
2. De fix

De foutmelding ontstaat omdat vanaf nu de rol als eerste argument verplicht stelt. In jouw Phoenix-project zijn dit meestal buttons of menu-items.

Vervang door :

Bash

Let op: Als je veel custom roles hebt die niet 'button' zijn, kun je de --replace vlag van ripgrep gebruiken om ze handmatig langs te lopen, of dit commando herhalen voor specifieke rollen.

3. Controle via Phoenix Commander

Na het draaien van deze commando's is het cruciaal om te controleren of de tests nog draaien, omdat soms net anders reageert dan de oude A11yLabel.

Voer dit uit in je root:

Bash

Waarom dit nodig is voor Project Phoenix: Jouw (die we net hebben samengevoegd) gebruikt specifiek deze rollen. Als je de shim tests ook draait, voorkom je hiermee dat de test-output volloopt met "Deprecation Warnings" of syntax-errors die je coverage omlaag halen.

Zal ik een kleine regex-check toevoegen aan je die voortaan direct waarschuwt als iemand per ongeluk weer de oude A11y selectors gebruikt?

---

**User:**

```
audit_keys.sh
```

```
scripts/audit_keys.sh
```

```
# 3) Legacy RTL Selector Check (Anti-deprecation gate)
echo -e "\n=== Legacy RTL Selectors (Deprecated A11y) ==="
LEGACY_SELECTORS="getByA11yRole|getByA11yLabel|queryByA11yRole|queryByA11yLabel"
DEPRECATED_FOUND=$(rg -Hn -P "$LEGACY_SELECTORS" $ROOTS || true)

if [ -n "$DEPRECATED_FOUND" ]; then
  echo "$DEPRECATED_FOUND" | awk -F: '{print "❌ Legacy selector gevonden: " $3 " in " $1 ":" $2}'
  echo -e "\n⚠️  Gevaar: Gebruik de nieuwe 'getByRole' of 'getByLabelText' syntax."
  EXIT=1
else
  echo "✅ Geen legacy selectors gevonden."
fi

| Key | Value |
| --- | --- |
| # 4) Syntax Check | queryByRole state object |
| echo | e "\n=== queryByRole Syntax Check ===" |
| # Zoekt naar queryByRole({ selected | true }) zonder rol-argument |
| BAD_SYNTAX=$(rg | Hn -P "queryByRole\(\{\s*selected:\s*true\s*\}\)" $ROOTS \|\| true) |

if [ -n "$BAD_SYNTAX" ]; then
  echo "$BAD_SYNTAX" | awk -F: '{print "❌ Foutieve syntax: " $3 " in " $1 ":" $2}'
  echo "👉 Fix: Voeg een rol toe, bijv: queryByRole('button', { selected: true })"
  EXIT=1
else
  echo "✅ queryByRole syntax is correct."
fi
```

```
# 3) Legacy RTL Selector Check (Anti-deprecation gate)
echo -e "\n=== Legacy RTL Selectors (Deprecated A11y) ==="
LEGACY_SELECTORS="getByA11yRole|getByA11yLabel|queryByA11yRole|queryByA11yLabel"
DEPRECATED_FOUND=$(rg -Hn -P "$LEGACY_SELECTORS" $ROOTS || true)

if [ -n "$DEPRECATED_FOUND" ]; then
  echo "$DEPRECATED_FOUND" | awk -F: '{print "❌ Legacy selector gevonden: " $3 " in " $1 ":" $2}'
  echo -e "\n⚠️  Gevaar: Gebruik de nieuwe 'getByRole' of 'getByLabelText' syntax."
  EXIT=1
else
  echo "✅ Geen legacy selectors gevonden."
fi

| Key | Value |
| --- | --- |
| # 4) Syntax Check | queryByRole state object |
| echo | e "\n=== queryByRole Syntax Check ===" |
| # Zoekt naar queryByRole({ selected | true }) zonder rol-argument |
| BAD_SYNTAX=$(rg | Hn -P "queryByRole\(\{\s*selected:\s*true\s*\}\)" $ROOTS \|\| true) |

if [ -n "$BAD_SYNTAX" ]; then
  echo "$BAD_SYNTAX" | awk -F: '{print "❌ Foutieve syntax: " $3 " in " $1 ":" $2}'
  echo "👉 Fix: Voeg een rol toe, bijv: queryByRole('button', { selected: true })"
  EXIT=1
else
  echo "✅ queryByRole syntax is correct."
fi
```

```
queryByRole
```

```
./phoenix audit
```

```
scripts/audit_keys.sh
```

```
./phoenix audit
```

```
Navigator.test.tsx
```

```
selected: true
```

| - Syntax Validatie: Het controleert specifiek op de fout die je eerder noemde: aanroepen met alleen een object. Omdat de nieuwe RTL-versie een string-argument (de rol) vereist | blokkeert dit script de build als de syntax incompleet is. |
| --- | --- |
| - Integratie met Phoenix Commander: Omdat je (of full) waarschijnlijk dit script aanroept | worden deze regels nu automatisch gehandhaafd tijdens je ontwikkelproces. |

- Voeg de code toe aan .
- Draai  om te zien of er nog legacy code ergens "verstopt" zit.
- Als er fouten opduiken, gebruik je het sed commando van zojuist om ze in bulk te fixen.

Zal ik een kleine regex-check toevoegen aan je scripts/audit_keys.sh die voortaan direct waarschuwt als iemand per ongeluk weer de oude A11y selectors gebruikt? Yes

Dat is een uitstekend plan. Door dit toe te voegen aan , creëer je een "vroegtijdig waarschuwingssysteem" dat voorkomt dat verouderde RTL-code in je repository sluipt. Dit is essentieel voor de stabiliteit van de Project Phoenix 2025 standaarden.

Hier is de geüpdatete sectie die je aan kunt toevoegen:

Bash
Wat deze toevoeging doet:
Hoe nu verder?

Zal ik ook een check toevoegen die controleert of je nog steeds de juiste logica gebruikt na deze wijzigingen?

---

**User:**

```
Property 'data' does not exist on type 'void'
```

```
migrateTransactionsToPhoenix
```

```
schemaVersion
```

```
transactionService.ts
```

```
LegacyStateLike
```

```
// src/services/transactionService.ts

export const migrateTransactionsToPhoenix = async (oldData: any): Promise<any> => {
  // Simuleer asynchrone migratie-logica
  return {
    schemaVersion: '1.0', // De Shadow Flag voor Phoenix
    data: {
      setup: {
        aantalMensen: oldData?.aantalMensen ?? 0,
        aantalVolwassen: oldData?.aantalVolwassen ?? 0,
      },
      household: { members: [] },
      finance: {},
    },
  };
};
```

```
// src/services/transactionService.ts

export const migrateTransactionsToPhoenix = async (oldData: any): Promise<any> => {
  // Simuleer asynchrone migratie-logica
  return {
    schemaVersion: '1.0', // De Shadow Flag voor Phoenix
    data: {
      setup: {
        aantalMensen: oldData?.aantalMensen ?? 0,
        aantalVolwassen: oldData?.aantalVolwassen ?? 0,
      },
      household: { members: [] },
      finance: {},
    },
  };
};
```

```
makePhoenixState
```

```
import { migrateTransactionsToPhoenix } from '../transactionService';

| describe('Storage Migration: V0 to Phoenix' | () => { |
| --- | --- |
| it('moet oude setup data migreren naar de nieuwe data.setup nesting' | async () => { |
| aantalMensen: 4 |  |

    // 2. Act: Voer de migratie uit
    const result = await migrateTransactionsToPhoenix(oldData);

| expect(result).toBeDefined() |  |
| --- | --- |
| expect(result.schemaVersion).toBe('1.0') |  |
| expect(result.data.setup.aantalMensen).toBe(4) |  |
| expect(result.data.setup.aantalVolwassen).toBe(2) |  |
| }) |  |

  it('moet fallback waarden gebruiken bij corrupte oude data', async () => {
    const result = await migrateTransactionsToPhoenix(null);

    expect(result.data.setup.aantalMensen).toBe(0);
    expect(result.schemaVersion).toBe('1.0');
  });
});
```

```
import { migrateTransactionsToPhoenix } from '../transactionService';

| describe('Storage Migration: V0 to Phoenix' | () => { |
| --- | --- |
| it('moet oude setup data migreren naar de nieuwe data.setup nesting' | async () => { |
| aantalMensen: 4 |  |

    // 2. Act: Voer de migratie uit
    const result = await migrateTransactionsToPhoenix(oldData);

| expect(result).toBeDefined() |  |
| --- | --- |
| expect(result.schemaVersion).toBe('1.0') |  |
| expect(result.data.setup.aantalMensen).toBe(4) |  |
| expect(result.data.setup.aantalVolwassen).toBe(2) |  |
| }) |  |

  it('moet fallback waarden gebruiken bij corrupte oude data', async () => {
    const result = await migrateTransactionsToPhoenix(null);

    expect(result.data.setup.aantalMensen).toBe(0);
    expect(result.schemaVersion).toBe('1.0');
  });
});
```

```
./phoenix audit
```

```
schemaVersion
```

```
audit_keys.sh
```

```
schemaVersion: '1.0'
```

```
useAppOrchestration
```

```
Promise<any>
```

```
audit-orchestrator.js
```

```
schemaVersion
```

| - Integriteits-gate: Door hardcoded terug te geven in de migratie | zorg je ervoor dat de hook de staat direct herkent als READY in plaats van ERROR. |
| --- | --- |
| - Fixing TS2339: Door (of beter: je specifieke type) toe te voegen aan de functie-definitie | verdwijnen de rode kringen in je IDE. |

import { migrateTransactionsToPhoenix } from '../transactionService';

describe('Storage Migration: V0 to Phoenix', () => {

  it('moet oude setup data migreren naar de nieuwe data.setup nesting', async () => {

    const oldData = {

      aantalMensen: 4,

      aantalVolwassen: 2

    };

    const result = await migrateTransactionsToPhoenix(oldData);

    expect(result.data.setup.aantalMensen).toBe(4);

    expect(result.schemaVersion).toBe('1.0');

  });

});

[{

"resource": "/home/user/pre7/src/services/__tests__/storage.migration.test.ts",

"owner": "typescript",

"code": "2339",

"severity": 8,

"message": "Property 'data' does not exist on type 'void'.",

"source": "ts",

"startLineNumber": 12,

"startColumn": 19,

"endLineNumber": 12,

"endColumn": 23

},{

"resource": "/home/user/pre7/src/services/__tests__/storage.migration.test.ts",

"owner": "typescript",

"code": "2339",

"severity": 8,

"message": "Property 'schemaVersion' does not exist on type 'void'.",

"source": "ts",

"startLineNumber": 13,

"startColumn": 19,

"endLineNumber": 13,

"endColumn": 32

}]

De TypeScript-fouten () geven aan dat de functie momenteel niets teruggeeft (void), terwijl je test verwacht dat er een object met data en een uitkomt.

Om dit te fixen moeten we de service-logica aanpassen zodat deze voldoet aan de Phoenix v2 Envelope standaard die we eerder hebben vastgesteld.

1. De Fix voor

De functie moet de "platte" oude data transformeren naar de geneste structuur. Zorg dat de return-type overeenkomt met je of FormState.

TypeScript
2. De Samengevoegde Test (Gecorrigeerd)

Ik heb de test nu ook voorzien van de logica (indien van toepassing) en de juiste type-casting om de linter tevreden te houden.

TypeScript
3. Waarom dit belangrijk is voor je Audit

Als je nu draait, zal de check in je (die we zojuist hebben uitgebreid) deze migratie herkennen als een valide transitie.

Zal ik ook een check toevoegen aan de die controleert of alle migratie-bestanden wel de juiste '1.0' als output hebben?