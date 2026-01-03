
// src/test-utils/index.ts

// 1. Factories (Data generatie)
export * from './factories/stateFactory';
export * from './factories/memberFactory';
export * from './factories/csvFactory';

// 2. Renderers (RTL wrappers)
export * from './render/renderers';
export * from './render/providers';
export * from './render/renderers';
export * from './render/providers';
export * from './factories/stateFactory';

// Zorg dat renderWithState expliciet beschikbaar is voor de projector tests
import { render } from './render/renderers';
export { render as renderWithState };
// 3. Assertions (Custom checks)
export * from './assertions/migrationAssertions';

// 4. Utils & Performance
export * from './utils/name';
export * from './perf/measure';

// 5. Fixtures (Statische data)
// (Als fixtures een map is met index.ts, of een bestand fixtures.ts)
// export * from './fixtures'; 