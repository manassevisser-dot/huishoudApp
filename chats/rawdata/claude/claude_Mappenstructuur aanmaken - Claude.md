# Mappenstructuur aanmaken - Claude

**Geëxporteerd:** 4-1-2026, 18:05:29
**Aantal berichten:** 226

---
**Claude:**

| Situatie | Actie |
| --- | --- |
| Complexe state | Discriminated Union |
| Herhaalde logica (3x) | Extraheer functie/hook |
| Onduidelijke naam | Hernoem naar doel |
| Lange functie (>20) | Split op (SRP) |
| API data | Parse met Zod |
| Legacy code | Boy Scout + Mikado |
| Test schrijven | Test gedrag, niet impl |
| Performance issue | Meet eerst, dan optimize |

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

```
utils/finance.ts → domain/income/finance.ts
```

```
utils/finance.ts → domain/income/finance.ts
```

```
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```ts
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

```
daysUntilDeadline
```

```
shouldRender
```

```
tempVariable
```

```
type UserId = string
```

```
({ title, onClick })
```

```
props.title
```

```
useUserAuth
```

```html
useState<User | null>(null)
```

```
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```ts
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```
type Status = 'open' | 'closed'
```

```html
ReturnType<typeof fn>
```

```json
{ success: boolean, data?: T, error?: string }
```

```yaml
strict: true
```

```
/features/auth/*
```

```
/components/*
```

```
noImplicitAny
```

```
strictNullChecks
```

```
@components/*
```

```
../../components
```

```
console.log
```

```
const MAX_RETRIES = 3
```

```
npx tsc --noEmit
```

```html
<input_delimiters>
```

```
AsyncStorage
```

```
household, members, income
```

```
ISO-8601 UTC-Noon
```

```
YYYY-MM-DDT12:00:00Z
```

```
NumericParser
```

```
isSpecialStatus
```

```
INITIALIZING | READY | ERROR
```

```
useAppOrchestration
```

```
isSpecialStatus
```

```
Math.random()
```

```
AsyncStorage
```

```
NumericParser
```

```
FormField.tsx
```

```
formReducer
```

```
NumericParser
```

```html
<input_structure>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Altijd als laatste!
    ],
  };
};

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    /* Phoenix Aliassen */
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
     }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

Waarom werken de aliassen niet??
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Altijd als laatste!
    ],
  };
};

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    /* Phoenix Aliassen */
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
     }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

Waarom werken de aliassen niet??
```

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```ts
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```
module-resolver
```

```
module-resolver
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```
babel-plugin-module-resolver
```

```
npm list babel-plugin-module-resolver
```

```bash
npm list babel-plugin-module-resolver
```

```
npm install --save-dev babel-plugin-module-resolver
```

```bash
npm install --save-dev babel-plugin-module-resolver
```

```
./src/domain
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```
tsconfig.json
```

```
jsconfig.json
```

```
jsconfig.json
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```
babel-preset-expo
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```ts
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```ts
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```ts
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```
npx react-native start --reset-cache
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```ts
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```
verify-aliases.js
```

```
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```js
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```
node verify-aliases.js
```

```bash
node verify-aliases.js
```

```
Alias "${name}" is reserved
```

```
Found ${aliases.length} aliases in tsconfig.json
```

```
${a.name} → ${a.target}
```

```yaml
alias: {
${aliases.map(a =>
```

```
).join('\n')}
            },
```

```yaml
moduleNameMapper: {
${aliases.map(a =>
```

```
).join('\n')}
  },
```

```
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```js
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```js
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```js
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```js
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```
sync-aliases.js
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

- Testen makkelijker maakt
- AI-begeleide refactors veiliger maakt
- Future features isoleerbaar houdt

- Zijn netter, maar niet urgent
- Kosten meer tijd zonder directe winst
- Kunnen gradueel tijdens feature-werk

- De minimale refactor (fase 1) als script uitschrijf?
- Een ADR maak voor "Waarom wizard een subsystem is"?
- Een import-regel docje maak ("wie mag wie importeren")?

| - ✅ Boolean prefixen: isLoading | hasAccess |  |
| --- | --- | --- |
| - ✅ Geen ruis: vermijd dataObject | userInfo |  |

- ✅ Single Responsibility: één functie = één taak
- ✅ Max 20 regels (vuistregel voor leesbaarheid)
- ✅ Max 2 argumenten (meer? → gebruik object)
- ✅ Guard Clauses: handel edge cases bovenaan af (return early)
- ✅ Geen side effects: voorspelbaar gedrag
- ✅ Pure functions waar mogelijk: zelfde input = zelfde output

| Key | Value |
| --- | --- |
| ✅ Kleine componenten | max 100-150 regels JSX |
| ✅ Destructuring props | ipv |
| ✅ Fragmenten | gebruik <>...</> ipv onnodige divs |
| ✅ Composition over Inheritance | gebruik children prop |
| ✅ Logica uit UI | verplaats naar Custom Hooks () |
| ✅ Feature | based structure: alles van één feature in één map |

- ✅ Expliciet typen:
- ✅ useCallback/useMemo: alleen bij échte performance issues
- ✅ Custom Hooks: extraheer herbruikbare logica
- ✅ React.FC: vermijd (tenzij je children expliciet nodig hebt)

- ✅ NOOIT any: gebruik unknown als je type niet weet
- ✅ Interfaces voor props: beter uitbreidbaar dan type
- ✅ Discriminated Unions voor state:

- ✅ Enums/Unions voor constanten:
- ✅ readonly voor immutable data
- ✅ Utility Types: Omit, Pick,

- ✅ Generics met constraints: flexibel maar type-safe
- ✅ Parse, don't validate: gebruik Zod aan systeemgrenzen
- ✅ Result types:
- ✅ Strict tsconfig: schakel  in

| Key | Value |
| --- | --- |
| ✅ Shallow codebase | max 3-4 niveaus diep |
| ✅ Feature | based folders: ipv |
| ✅ Domain layer | business logica apart van UI |
| ✅ Just Use Functions | vermijd onnodige classes |
| ✅ DRY (Don't Repeat Yourself) | Regel van Drie |

1x = schrijf het
2x = dupliceer (acceptabel)
3x = refactor naar herbruikbare functie
- 1x = schrijf het
- 2x = dupliceer (acceptabel)
- 3x = refactor naar herbruikbare functie

- 1x = schrijf het
- 2x = dupliceer (acceptabel)
- 3x = refactor naar herbruikbare functie

| Key | Value |
| --- | --- |
| ✅ Strangler Fig | vervang legacy code geleidelijk |
| ✅ Façade pattern | wrap oude code, route verkeer om |
| ✅ Repository pattern | scheid data-access van business logica |
| ✅ Discriminated Unions | voorkom onmogelijke states |

| - ✅ Test gedrag | niet implementatie |
| --- | --- |
| - ✅ Gebruik Testing Library: getByRole | getByText |

| - ✅ ESLint strict mode: waarschuw bij any | complexiteit |
| --- | --- |
| - ✅ TypeScript strict mode: |  |

- ✅ Boy Scout Rule: laat code schoner achter dan je het vond
- ✅ Mikado Method:

Stel doel → probeer → visualiseer blokkades
Revert → los sub-doelen op → werk terug naar doel
- Stel doel → probeer → visualiseer blokkades
- Revert → los sub-doelen op → werk terug naar doel
- ✅ Prioriteer op impact:

High-change areas
Bug-prone modules
Onboarding blockers
- High-change areas
- Bug-prone modules
- Onboarding blockers
- ✅ Incremental refactoring: kleine stappen, blijf deploybaar

- Stel doel → probeer → visualiseer blokkades
- Revert → los sub-doelen op → werk terug naar doel

- High-change areas
- Bug-prone modules
- Onboarding blockers

| Key | Value |
| --- | --- |
| ✅ Custom Path Aliases | ipv |
| ✅ React Compiler | bereid je voor (minder handmatige memo's) |
| ✅ Vitest | snellere test runner dan Jest |
| ✅ Biome | all-in-one linter/formatter (alternatief voor ESLint+Prettier) |

| Key | Value |
| --- | --- |
| ✅ Don't outsource thinking | AI voor boilerplate, jij voor architectuur |
| ✅ Vermijd "vibe coding" | begrijp wat AI genereert |
| ✅ Validate AI output | check logica en edge cases |
| ✅ Use AI for refactoring suggestions | maar neem bewuste beslissingen |

| - ✅ Structured logging: niet | maar structured data |
| --- | --- |
| - ✅ Distributed tracing: in microservices (Jaeger | OpenTelemetry) |
| - ✅ Performance monitoring: Lighthouse | React DevTools Profiler |

| - ✅ Commentaar op "waarom" | niet "wat" |
| --- | --- |
| - ✅ Code is voor mensen: machine compileert alles | mensen moeten het begrijpen |

| Key | Value |
| --- | --- |
| ✅ Vermijd deep nesting | max 2-3 niveaus |
| ✅ Ternary overkill voorkomen | complexe conditie? → if statement |
| ✅ Failing gracefully | voorspelbaar foutgedrag |
| ✅ Consistent naming | zelfde concepten, zelfde namen |

| Key | Value |
| --- | --- |
| ✅ TypeScript default sinds 0.71 | gebruik het |
| ✅ Babel voor transforms | niet tsc voor compilatie |
| ✅ Type | check met CLI: |
| ✅ @react | native/typescript-config: gebruik officiële config |

| Key | Value |
| --- | --- |
| ✅ FlatList voor lange lijsten | niet .map() |
| ✅ Memoize zware componenten | React.memo met zorg |
| ✅ Hermes engine | snellere JS-uitvoering |
| ✅ Native modules | schrijf performance-kritieke code in native |

| Key | Value |
| --- | --- |
| ⬜ Naamgeving check | zijn alle namen self-explanatory? |
| ⬜ Functie lengte | < 20 regels per functie? |
| ⬜ TypeScript strict | geen any, expliciete types? |
| ⬜ Tests aanwezig | gedekt met betekenisvolle tests? |
| ⬜ Boy Scout Rule | code schoner achtergelaten? |
| ⬜ Discriminated Unions | onmogelijke states voorkomen? |
| ⬜ Import paths | relatieve paths < 3 niveaus of gebruik aliases? |
| ⬜ Side effects | functies voorspelbaar en pure? |
| ⬜ Commentaar nodig? | zo ja, leg "waarom" uit, niet "wat" |
| ⬜ Leave No Questions | zou een nieuwe dev dit snappen? |

| - Refactoring is geen taak | het is een workflow (Martin Fowler) |
| --- | --- |
| - Parse | don't validate: dwing types af aan grenzen |

- Wetenschappelijke debugging methodologieën (Five Whys, Binary Search, etc.)
- React Native specifieke tools en technieken
- 7 verschillende debugging strategieën
- Common bug types met aanpak per type
- Best practices en anti-patterns
- Cognitive strategies en bias awareness
- Complete debugging workflow (8 stappen)

- Sterke en zwakke punten van elk
- Concrete verbeterpunten per prompt (5 voor elk)
- Nieuwe elementen die in beide ontbraken
- Ideale hybride kenmerken tabel
- 14 missende elementen geïdentificeerd

- 9 output secties (vs 4 in Debug1, 7 in Debug2)
- Five Whys verplicht voor root cause
- React Native specifieke diagnostics
- TypeScript error decoder
- Emergency protocols (production down, data loss, security)
- Advanced scenarios (race conditions, memory leaks, performance)
- Absolute constraints met IRON LAW regels
- Quality checklist voor self-verification
- Confidence % systeem (geen vage "hoog/laag")

| Key | Value |
| --- | --- |
| Structured Thinking | Investigation log + Five Whys + Hypothesis ranking |
| External Research | Verplichte verificatie met citatie regels |
| React Native Focus | Platform-specifieke diagnostics en tools |
| No Code Policy | Absolute verbod op code fixes (conceptueel only) |
| Preventie Focus | Korte + lange termijn vaccinatie strategie |
| Emergency Ready | Protocols voor production incidents |
| Escalation Criteria | Wanneer stoppen en hulp vragen |

- Een voorbeeld debugging sessie doorloop met de nieuwe prompt?
- De prompt further specialize voor jouw specifieke React Native project structuur?
- Een quick reference card maken voor dagelijks gebruik?

- 7 kritieke gaps geïdentificeerd (pre-migration assessment, testing strategy, data quality, etc.)
- 4 anti-patterns blootgelegd (big bang risk, undefined success criteria, manual error handling)
- 8 verbeterpunten uit research (data migration testing pyramid, phased percentages, automated balance)
- 8 DO's en 8 DON'Ts uit praktijk (Netflix, Google, Adobe case studies)
- Quantified industry benchmarks (83% big bang failure rate, $13M data quality cost)

| - Pre-migration assessment (profiling | baselines | dependency mapping) |
| --- | --- | --- |
| - Compliance & security (GDPR | HIPAA | SOC2) |

- Error thresholds: < 0.1% (was: "toetsbaar")
- Performance: < 5% degradation (was: vague "acceptable")
- Rollback time: < 2 hours (was: undefined)
- Coexistence: 30-90 days (was: not specified)
- 10+ industry benchmarks included

- ✅ Pre-migration data profiling (ROT analysis)
- ✅ POC phase (90% vs 17% success rate)
- ✅ Automated rollback triggers
- ✅ Comparison testing protocol (row/column/hash)
- ✅ Data quality gates
- ✅ Performance baseline establishment
- ✅ Rollback drills (test the safety net!)
- ✅ Post-migration coexistence period
- ✅ Compliance audit trails
- ✅ Quantified stop criteria

- Conceptually sound maar operationally vague
- "Toetsbaar" zonder getallen
- Geen pre-assessment
- 4 fases
- Generieke test strategy

| - Quantified (< 0.1% | < 5% | < 2h) |
| --- | --- | --- |
| - Automated (rollback | validation | monitoring) |

| Key | Value |
| --- | --- |
| Nooit blind migreren | Data profiling is non-negotiable |
| POC eerst | 90% success rate vs 17% big bang |
| Quantify everything | "< 0.1%" beats "low" |
| Test the rollback | Safety net moet werken |
| Coexistence period | 30-90 days is industry standard |
| Automate validation | 50% fewer errors |
| Compliance upfront | €1.2B in GDPR fines (2025) |

- Een voorbeeld migration strategy genereer met deze prompt?
- Quick reference cards maken voor dagelijks gebruik?
- De prompt verder customize voor jouw specifieke React Native project?

| - Kritiek Risico: "Taal-Spaghetti" (mix van NL/EN keys) en "Primitive Obsession" (datums als strings | leeftijd als numbers)333333333. |
| --- | --- |
| - Oplossing: Overstap naar een Ubiquitous Language (Engelse keys | Nederlandse labels)4444. |

| Key | Value |
| --- | --- |
| Mandaat | Migratie naar UUIDs (v4) voor alle leden en transacties8888. |
| Storage | Gate: Implementatie van het Repository Pattern om te isoleren. Gebruik van Zod-schema's om corrupte data bij de I/O-grens te blokkeren9999. |

| Key | Value |
| --- | --- |
| Mandaat | Introductie van een robuuste en het verbieden van any in financiële objecten (vervangen door unknown of Discriminated Unions)111111111111111111. |
| Principe | "Parse, don't validate." Data wordt bij binnenkomst (Input/CSV) direct getransformeerd naar valide types12121212. |

- Alignment: Verwijder de "A2 FIX" uit de UI-controllers en verplaats de synchronisatie-logica naar de .
- Opschoning: Implementeer "State Purging" om "Orphan Data" (bijv. oude huurdata bij een koopwoning) automatisch te wissen.
🎯 De Specifieke Opdracht voor Flow 3.5
Flow 3.5 moet op basis van deze input de volgende drie producten leveren voor de Navigator:
- De Migratie-Matrix: Een stap-voor-stap plan om de huidige "platte" data (met index-IDs en NL-keys) te migreren naar de nieuwe DDD-structuur (met UUIDs en EN-keys) zonder dataverlies voor de gebruiker.
- Het Test-Harnas: Een Jest-testplan dat specifiek de "edge cases" dekt:
De berekening van de "Speciale Status" (>5 volwassenen).De  met diverse Europese notaties.Het "Orphan Data" purge-mechanisme.
- De berekening van de "Speciale Status" (>5 volwassenen).
- De  met diverse Europese notaties.
- Het "Orphan Data" purge-mechanisme.
- De Rollback-Strategie: Wat doen we als de Zod-validatie de bestaande (vervuilde) gebruikersdata blokkeert bij de eerste start na de update?
Zal ik deze input direct doorzetten naar Flow 3.5 om het Migratie- & Testplan op te stellen?

- De berekening van de "Speciale Status" (>5 volwassenen).
- De  met diverse Europese notaties.
- Het "Orphan Data" purge-mechanisme.

- Duidelijke Legacy Baseline ✅

Platte structuur met circulaire dependencies
Index-based identiteit (fragiel)
UI als "reparateur" (anti-pattern)
- Platte structuur met circulaire dependencies
- Index-based identiteit (fragiel)
- UI als "reparateur" (anti-pattern)
- High-Risk Migration Points Geïdentificeerd ✅

UUID transformatie (breaking change)
Semantische ID migratie (storage compatibility)
Datum-strategie wijziging (data corruption risk)
- UUID transformatie (breaking change)
- Semantische ID migratie (storage compatibility)
- Datum-strategie wijziging (data corruption risk)
- Concrete Test Scenarios ✅

Komma-bug boundary testing
Purge validation
5-volwassenen grens
Hydration failure
- Komma-bug boundary testing
- Purge validation
- 5-volwassenen grens
- Hydration failure
- Technology Stack Context ✅

React 19 / RN 0.81 (bleeding edge risk)
Fast Refresh stability concerns
- React 19 / RN 0.81 (bleeding edge risk)
- Fast Refresh stability concerns

- Platte structuur met circulaire dependencies
- Index-based identiteit (fragiel)
- UI als "reparateur" (anti-pattern)

- UUID transformatie (breaking change)
- Semantische ID migratie (storage compatibility)
- Datum-strategie wijziging (data corruption risk)

- Komma-bug boundary testing
- Purge validation
- 5-volwassenen grens
- Hydration failure

- React 19 / RN 0.81 (bleeding edge risk)
- Fast Refresh stability concerns

| - Aantal records (leden | transacties)? |
| --- | --- |
| - Current app performance metrics (startup time | etc.)? |

- Nieuwe storage structure (Zod schemas)?
- Performance requirements (startup time < X sec)?
- Size limits per user?

- Circulaire dependencies genoemd
- UI ↔ State koppeling

- Volledige dependency diagram (welke components precies?)
- External dependencies (AsyncStorage, Expo libraries)
- Critical path analysis

| Key | Value |
| --- | --- |
| Downtime tolerance | App update (minutes) of live migration (zero)? |
| Timeline | Wanneer moet dit live? Sprint planning? |
| Team | Hoeveel developers beschikbaar? Full-time of part-time? |
| Compliance | GDPR data migration rules? User consent needed? |
| Rollback window | Kan oude app versie blijven draaien? |

- Excellent migration scope definition (6 concrete items)
- Clear risk identification (UUID, dates, orphan data)
- Specific test scenarios (komma-bug, purge, special status)
- Good technical context (React 19, RN 0.76)

| - Team capacity (hoeveel developers | hoe lang?) |
| --- | --- |
| - Existing tests (huidige coverage | CI/CD?) |

- Financial domain (zero tolerance for data corruption)
- Bleeding edge stack (React 19 = risk)
- First migration (team learning curve)

- Flow 3.5 genereert strategie met placeholders
- Gebruik voor planning & stakeholder buy-in
- Identificeert wat je nog moet weten
- Timeline: 1-2 dagen

- Verzamel missing info (4-5 dagen)
- Flow 3.5 genereert production-ready plan
- Kwantitatieve thresholds, concrete dates
- Timeline: Week 2

| Key | Value |
| --- | --- |
| Pro | Direct resultaat, ziet wat er komt |
| Con | Niet executeerbaar zonder extra info |

| Key | Value |
| --- | --- |
| Pro | Production-ready output |
| Con | 4-5 dagen prep work |

| Key | Value |
| --- | --- |
| Pro | Beste van beide werelden |
| Con | Extra ronde met Flow 3.5 later nodig |

- CMD/CTRL + Shift + P
- "TypeScript: Restart TS Server"

- Metro bundler terminal
- VSCode Problems tab (CMD/CTRL + Shift + M)

- Kopieer de exacte error message
- Check welke terminal (Metro bundler of VSCode)
- Vertel me de error, dan help ik verder debuggen

- Geen check of alias block al bestaat in babel
- Geen backup van originele files
- Geen validatie of target directories bestaan
- Geen check voor duplicate aliases

- ✅ Alle 4 syntax errors gefixed
- ✅ Comprehensive validation toegevoegd
- ✅ Backup mechanisme
- ✅ Verbose + dry-run modes
- ✅ Help documentation
- ✅ Production-ready

- Volledige bug analyse
- Voor/na vergelijking
- Best practices toegepast
- Testing checklist

- Quick fixes voor 90% van issues
- Diagnosis by symptom
- Complete reset procedure
- Prevention tips

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dacm.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dntietz.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwearebrain.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dresearchgate.net&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dappdeskservices.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddemandtalk.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dguvi.in&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlambdatest.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwikipedia.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dtulip.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dasq.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlean.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbusinessmap.io&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dindeed.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Disixsigma.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Deworkorders.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcms.gov&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlearningloop.io&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatateams.ai&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dibm.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dautomq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dnetsharx.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dphygital-insights.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Derpsoftwareblog.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dkraftbusiness.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dc-metric.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Datlassian.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcouchbase.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatalark.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dquinnox.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbrowserstack.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatamigrationpro.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatafold.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwinwire.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Duniridge.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgoogle.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dforbytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dk2view.com&w=32&q=75)

### RecentsHide

# 🎯 Review van het advies

## TL;DR: JA, het advies klopt — met 2 nuances

## ✅ Wat absoluut klopt

### 1. De diagnose is accuraat

### 2. De voorgestelde structuur is pragmatisch

### 3. De mappings zijn praktisch uitvoerbaar

## ⚠️ Wat je moet nuanceren

### Nuance 1: utils/ vs domain/

## 📋 Wat ik zou doen (actieplan)

# 🎯 Complete Clean Code Checklist 2025

## React + TypeScript + React Native

## 📋 BASIS PRINCIPES

### Naamgeving

### Functies

## ⚛️ REACT BEST PRACTICES

### Component Structuur

### Hooks

## 🔷 TYPESCRIPT ESSENTIALS

### Type Safety

### Geavanceerd

## 🏗️ ARCHITECTUUR & STRUCTUUR

### Code Organisatie

### Patterns

## 🧪 TESTING & KWALITEIT

### Test Strategie

### Code Quality

## 📦 REFACTORING LEGACY CODE

### Strategieën

## 🚀 2025-SPECIFIC TIPS

### Modern Tooling

### AI-Assisted Development

### Observability

## 💡 COGNITIEVE BELASTING REDUCEREN

### Leesbaarheid

### Mentale Energie

## 🔧 REACT NATIVE SPECIFIEK

### Setup

### Performance

## ✅ DAILY CHECKLIST

## 🎯 EXPERT MINDSET

## 📚 QUICK REFERENCE

### debug2.txt

### Debug1.txt

## 📦 WAT JE ONTVANGEN HEBT

### 1️⃣ Complete Debugging Adviezenlijst 2025

### 2️⃣ Vergelijking & Verbeterpunten

### 3️⃣ ULTIMATE A-TIER DEBUG PROMPT 2025 🔥

## 🎯 KERNVERNIEUWINGEN IN ULTIMATE PROMPT

## 💡 HOE TE GEBRUIKEN

## 🎯 WAT JE ONTVANGEN HEBT

### 1️⃣ Kritische Analyse van Flow 3.5

### 2️⃣ ULTIMATE A-TIER MIGRATION PROMPT 2025 🔥

## 💡 KERNVERSCHILLEN

### Original Flow 3.5:

### Ultimate A-Tier:

## 🎓 BELANGRIJKSTE LESSEN

# 🎯 Analyse van Input voor Ultimate Migration Prompt

## ✅ WAT ER GOED IS

### Sterke Punten in de Input:

## ⚠️ WAT ONTBREEKT (Kritiek voor Migration Prompt)

### 1. Source System Details ❌

### 2. Target System Specs ❌

### 3. Dependency Graph ⚠️ (Partieel aanwezig)

### 4. Constraints ❌ (Meest kritieke gap!)

### 5. Baseline Metrics ❌

### 6. Existing Test Infrastructure ❌

## 📋 COMPLETE INPUT TEMPLATE (Wat Flow 3.5 ECHT nodig heeft)

## 🎯 ANTWOORD OP JE VRAAG

### Korte antwoord: JA, maar met significante gaps ⚠️

### Lange antwoord:

## 💡 MIJN ADVIES

### → Recommended: 2-fase aanpak

## 🚀 WAT WIL JE?

# 🔍 Diagnose: Path Aliases Werken Niet

## 🚨 Meest Waarschijnlijke Oorzaken

### 1. Metro Bundler Cache (90% van de gevallen!)

### 3.  Plugin Positie

### 4.  Niet Geïnstalleerd?

### 5. Relative Paths in Alias Definition

### 6. TypeScript vs Runtime Mismatch

### 7. Expo vs React Native CLI Conflict

### 8. Import Syntax Check

## 🔧 Volledige Debug Checklist

## 🐛 Specifieke Error Messages

### Error: "Cannot find module '@domain/...'"

### Error: Red squiggly in VSCode but app runs fine

### Error: "Module does not exist in the module map"

### Error: Works in one file, not another

## 🎯 Snelle Win Checklist

## 📊 Verificatie: Werken Ze Nu?

## 💡 Pro Tip: Verify Configuration

# 🔍 Analyse & Verbeterd Script

## 🐛 Gevonden Bugs

### 1. Template Literal Syntax Errors ❌

### 2. JSON Parsing Error Handling Te Breed

### 3. Regex Replace Te Greedy

### 4. Geen Validatie van Array Destructuring

### 5. Ontbrekende Edge Case Handling

## ✅ Verbeterd Script (Production-Ready)

## 🎯 Samenvatting

### 1️⃣ Gefixed Script ()

### 2️⃣ Verbeteringen Document

### 3️⃣ Troubleshooting Cheatsheet

## 🚀 Volgende Stappen

> "Code is een verhaal dat je vertelt aan je toekomstige zelf en je teamgenoten. Maak het een goed verhaal."

> "Is dit voldoende input voor ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025?"

New chatChatsProjectsArtifactsCodeAll chatsMManasseFree planMappenstructuur aanmakenSharePerfect — **dit is precies genoeg om je repo “te lezen”** 👍
Ik ga nu:

1. **je huidige structuur duiden** (wat is het nu echt?)
2. **de knelpunten benoemen** (waar wringt het al)
3. **een concrete doel-structuur voorstellen**
4. **een expliciete mapping: huidig → nieuw**
   (zonder onnodige pastedHuidige mappenstructuur:
src
├── components
│   ├── ChipButton.tsx
│   ├── ConditionalField.tsx
│   ├── DateField.tsx
│   ├── FormField.tsx
│   ├── InputCounter.tsx
│   └── ToggleSwitch.tsx
├── config
│   └── features.ts
├── context
│   ├── FormContext.tsx
│   ├── FormContext.tsx.bak
│   └── ThemeContext.tsx
├── hooks
│   └── useDobInput.ts
├── navigation
│   └── Navigator.tsx
├── organisms
│   ├── ExpenseRepeater.tsx
│   ├── HouseholdMemberRepeater.tsx
│   ├── HouseholdMemberRepeater.tsx.bak
│   └── IncomeRepeater.tsx
├── screens
│   ├── CSV
│   │   └── CsvUploadScreen.tsx
│   ├── Daily
│   │   └── UndoScreen.tsx
│   ├── DailyInput
│   │   └── DailyInputScreen.tsx
│   ├── Dashboard
│   │   └── DashboardScreen.tsx
│   ├── LandingScreen.tsx
│   ├── Options
│   │   └── OptionsScreen.tsx
│   ├── Reset
│   │   └── ResetScreen.tsx
│   ├── Settings
│   │   └── SettingsScreen.tsx
│   └── Wizard
│       ├── pages
│       │   ├── C10.config.ts
│       │   ├── C1.config.ts
│       │   ├── C4.config.ts
│       │   └── C7.config.ts
│       ├── WizardController.tsx
│       ├── WizardController.tsx.bak
│       └── WizardPage.tsx
├── services
│   ├── csvService.ts
│   ├── householdAlign.ts
│   ├── storage.ts
│   └── transactionService.ts
├── styles
│   ├── Colors.ts
│   └── useAppStyles.ts
├── types
│   ├── expenses.ts
│   ├── form.ts
│   ├── household.ts
│   ├── income.ts
│   └── transaction.ts
└── utils
    ├── conditions.ts
    ├── date.ts
    ├── finance.ts
    ├── numbers.ts
    ├── strings.ts
    └── validation.ts
ADVIES :
KLOPT HET ADVIES?Show more20 dec 2025

Het advies is solide en praktisch. De analist heeft je repo goed begrepen en stelt een evolutionaire refactor voor die past bij jouw situatie.
Maar laat me specifiek ingaan op wat WEL en NIET klopt:

De 3 kernproblemen zijn echt:

👉 Dit zijn echte architectural smells die je gaat voelen bij schalen

Dit is geen over-engineering, maar logische scheiding die:

De tabel met "huidig → nieuw" is geen theorie, maar een executable migration plan. Je kunt dit letterlijk file-by-file doorlopen.

Het advies stelt voor:

Dit klopt conceptueel, maar:
typescript
Waarom? Deze moves:

bash
Dit geeft je 80% van de winst met 20% van de moeite.

Wil je dat ik:

Zeg maar wat het meest helpt! 🚀Hier is de belangrijkste punten uit het artikel "7 Tips for Clean React TypeScript Code You Must Know" van Tapajyoti Bose.
Opmerking: Als je de "Gemini Live" modus gebruikt op je telefoon, kan ik deze tekst direct voor je uitspreken met een natuurlijke stem.
7 Tips voor Schone React TypeScript CodpastedLEES en stel een nette lijst samen; vul eventueel aan met missende tips om code 2025-proof te maken20 dec 2025

typescript

Voor elke feature/bugfix:

Laatst bijgewerkt: December 2024
Voor: React Native + TypeScript + Clean Architecture190 linestxt121 linestxtVerzamel zoveel mogelijk adviezen met betrekking tot debuggen van de code in mijn project. Analyseer en vergelijk daarna de prompts in in Debug1.txt en debug2.txt. Zoek naar tips om de prompts te verbeteren (verrijkt met de adviezen die je gevonden hebt). Geef mij die tips en gebruik tot slot zelf alle gevonden adviezen en tips om die  "ultieme ultra A-TIER god-modus prompt" zelf te schrijven. Denk over alles heel goed na20 dec 20251 stepsystematic debugging methodology software engineering 202510 resultsWhy Programs Fail: A Guide to Systematic Debugging | Guide books | ACM Digital Libraryacm.orgA systematic approach to debugging | nicole@webntietz.com10 effective debugging techniques for developers - WeAreBrainwearebrain.comA Systematic Review on Program Debugging Techniques | Request PDFresearchgate.netDebugging Approaches - Software Engineering - GeeksforGeeksgeeksforgeeks.orgBest Debugging Techniques : Process, Guidelines and Approaches - 2024appdeskservices.comUnveil Pro Debugging Techniques & Explore Its Role As a Soft Skilldemandtalk.comDebugging in Software Development: The Ultimate Guide 2025guvi.inDebugging: Its Strategies And Tools With Best Practiceslambdatest.comWhat is Debugging in Software Engineering? - GeeksforGeeksgeeksforgeeks.orgroot cause analysis debugging Five Whys hypothesis testing10 resultsFive whys - Wikipediawikipedia.orgWhat are the Five Whys? A Tool For Root Cause Analysis | Tuliptulip.coFive Whys and Five Hows | ASQasq.org5 Whys - What is it? | Lean Enterprise Institutelean.orgThe 5 Whys Explained: How to Get to the Root Cause Fastbusinessmap.io5 Whys Technique: Root Cause Analysis (With Examples) | Indeed.comindeed.comRoot Cause Analysis: Integrating Ishikawa Diagrams and the 5 Whys - isixsigma.comisixsigma.com5 Whys Root Cause Analysis Techniqueseworkorders.comFive Whys Tool for Root Cause Analysiscms.gov5 Whys. What it is, How it Works, Examples.learningloop.ioLaat me nu een uitgebreide analyse maken en de ultieme debugging prompt schrijven.Complete Debugging Adviezenlijst 2025Document # 🔍 Complete Debugging Adviezenlijst 2025
## React Native + TypeScript Focus

---

## 📊 **DEBUGGING METHODOLOGIE**

### Wetenschappelijke Aanpak (Scientific Method)
- ✅ **Observatie → Hypothese → Test → Conclusie**
- ✅ **Evidence-based**: nooit radNu ga ik de twee prompts analyseren en verbetertips geven:Analyse & Vergelijking Debug Prompts + VerbeterpuntenDocument # 🔬 Analyse Debug Prompts + Verbeterpunten

---

## 📊 **VERGELIJKING DEBUG1 vs DEBUG2**

### Debug1.txt (Forensics Mode)
**Sterke punten:**
- ✅ Expliciet research protocol (externe verificatie)
- ✅ Concrete output template met crime scene metaphor
Nu schrijf ik de ultieme A-tier debug prompt:🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document # 🔬 ULTIMATE A-TIER DEBUG PROMPT 2025
## Lyra Forensics Engine - React Native Edition

---

```xml
<system_configuration>
  <role>Senior Site Reliability Engineer & Forensic Code Investigator</role>
  <name>Lyra (Forensics Mode)</name>
  <specialty>Continue20 dec 2025<function_results>OK</function_results>
<system_warning>Token usage: 41953/190000; 148047 remaining</system_warning>🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document ∙ Version 2   <time_management>
    Signaleer wanneer escalatie nodig is:
    - Na 3 hypotheses allemaal fout: "Dit vereist senior review"
    - Intermittent bug na 2 uur: "Monitoring setup nodig"
    - Native crash zonder native expertise: "Xcode/Android StudioPerfect! Ik heb nu een complete analyse gemaakt. Laat me een samenvatting geven van wat ik heb geleverd:

Een uitgebreide verzameling van:

Een forensische analyse van beide prompts met:

De god-modus prompt met:

De ultimate prompt is production-ready en kan direct gebruikt worden. Je vult de input template in volgens de  en krijgt een systematisch 9-sectie rapport dat je door het hele debugging proces leidt zonder premature oplossingen te geven.
Wil je dat ik:

Laat het maar weten! 🚀Absoluut — ik begrijp wat je bedoelt met **Flow 3.5**: een AI-agent die *geen nieuwe architectuur bedenkt*, *geen implementatie doet* en *geen debug uitvoert*, maar die **voor elk verbeterpunt dat uit Flow 2 en Flow 3 komt**:

* **een gefaseerde migratieparagraaf oplevert**
* **een gedegen teststpastedAnalyseer deze prompt; Wat kan hier beter aan en waarom? Zoek naar do's en don'ts uit de praktijk. Kijk kritisch naar al jouw eigen observaties en de gevonden do's en dont's. Gebruik jouw kennis van prompt-schrijven en zet alles in om de ULTIMATE A-TIER MIGRATION EN TEST PROMPT 2025 samen te stellen:20 dec 2025migration strategy best practices phased rollout 202510 results8 Data Migration Best Practices for Enterprise Teams in 2025 - DataTeams AIdatateams.aiKubernetes Migration Strategy and Best Practices | IBMibm.comKafka Migration Demystified: Choosing Between a “Big Bang” Cutover and a Phased Rolloutautomq.comCloud Migration Best Practices: 10 Essential Tips for 2025netsharx.comData Migration in 2025: Key Strategies & Best Practicesphygital-insights.comDynamics GP to Dynamics 365 BC: 7 Steps for a Smooth Migration - ERP Software Blogerpsoftwareblog.com10 Cloud Migration Best Practices for Success in 2025kraftbusiness.comTop Google Cloud Migration Strategies for 2025c-metric.comCloud adoption guide | Atlassianatlassian.comData Migration: Strategy, Best Practices & Tools - The Couchbase Blogcouchbase.comtesting strategy migration validation best practices 202510 resultsData Migration Testing: A Complete Guide to Ensuring Accuracy, Integrity, and Performancedatalark.comData Migration Validation Best Practices for 2025quinnox.comA Complete Guide to Data Migration Testing | BrowserStackbrowserstack.comData Migration Test Strategy: Create an Effective Test Plan — Data Migration Prodatamigrationpro.comHow to build a successful cloud migration testing strategydatafold.comData Migration Testing – Strategy, Types and Best Practiceswinwire.comData Migration Testing: Strategy, Test Plans, Tools and Best Practicesuniridge.coMigrate to Google Cloud: Best practices for validating a migration plan | Cloud Architecture Centergoogle.comSpeed Up Deployment with Smart Data Migration Testingforbytes.comData Migration Testing: What You Need to Knowk2view.comPerfect! Nu heb ik genoeg materiaal. Laat me de analyse en de ultieme prompt maken:Kritische Analyse Flow 3.5 Migration PromptDocument # 🔬 Kritische Analyse: Flow 3.5 Migration & Test Prompt

---

## 📊 **WAT IS GOED** ✅

### Sterke Fundamenten
1. **Duidelijke scope**: Geen architectuur, geen code, geen debugging
2. **Gefaseerde aanpak**: 4-fase structuur is industry standard
3. **Nu de ultieme prompt zelf:🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document # 🚀 ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025
## Enterprise-Grade | Evidence-Based | Risk-Managed

---

```xml
<system_configuration>
  <role>Senior Migration Strategy Architect & Test Engineering Lead</role>
  <name>Lyra (Migration ModeContinue20 dec 2025🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 2 #### T9: Compliance & Security Validation
**Purpose:** Ensure migration meets regulatory & security requirements

**Compliance Checks:** (if applicable)

1. **GDPR Compliance**
   - [ ] Data minimization: Only necessary data migrated
   - [ ] Consent2 / 2Continue20 dec 2025<function_results>OK</function_results>🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 3 **Internal:**
- Wiki page: Migration case study
- Brown bag session: Share learnings with broader team
- Runbook: Updated procedures

**External:**
- Blog post (if public company)
- Conference talk (if applicable)
- Open-source tools/scripts developePerfect! Ik heb nu een complete set geleverd. Laat me een samenvatting geven:

Een forensische breakdown met:

Een complete enterprise-grade prompt met:
15 output secties (vs 7 in origineel):

Kwantitatieve verbeteringen:

Nieuwe elementen:

Wil je dat ik:

Laat maar weten! 🚀1) Dat is een uitstekende toevoeging. Flow 3.5 vormt de brug tussen de abstracte blauwdruk en de rauwe code. Om deze strategist effectief te laten zijn, heeft hij niet alleen de "wat" nodig, maar vooral de "hoe we het breken en herstellen" context uit de volledige audit-geschiedenis.
Hier is de geaggregeerde input-set die je aan Flow 3.5 kunt voeden. Deze is opgebouwd uit de meest kritieke technische bevindingen die een migratie-impact hebben:
📑 Input voor Flow 3.5: De Migration & Test Strategist
1. De "Legacy" Baseline (Wat we achterlaten)
* Structuur: Een platte mappenstructuur met circulaire afhankelijkheden en "Shotgun Parsing" (data wordt overal ter plekke van string naar number omgezet).
* Identiteit: Data in arrays is gebonden aan de index. Dit maakt de state extreem fragiel tijdens sorteer- of verwijderacties.
* Integriteit: De UI fungeert als "reparateur" (useEffect-synchronisatie) in plaats van als passieve weergave.
2. Kritieke Migratie-Punten (High Risk)
A. De UUID-transformatie (Cluster 2)
* Risico: Bestaande gebruikersdata in  gebruikt nog array-indices.
* Opdracht: Ontwerp een migratie-script dat bij de eerste "hydration" unieke IDs (UUID) toekent aan bestaande huishoudleden en transacties zonder de koppelingen te verbreken.
B. Semantische ID-migratie (Cluster 4)
* Risico: Pagina-sleutels veranderen van C1, C4, C7 naar .
* Opdracht: Implementeer een "Alias Mapping" in de storage-service zodat oude state-bestanden correct landen in de nieuwe semantische structuur.
C. De "Noon" Datum-strategie (Cluster 1 & 3)
* Risico: Datums zijn nu opgeslagen als diverse string-formats of lokale tijden, wat leidt tot "Off-by-one" errors bij verjaardagen.
* Opdracht: Transformeer alle opgeslagen geboortedatums naar de  standaard ().
3. Test-Strategie Parameters (Boundary Testing)
Flow 3.5 moet test-scenario's schrijven voor de volgende grensgevallen:
* De Komma-Bug: Unit-tests voor de  met inputs: "1.250,50", "1250.50", "1250", en "ongeldig".
* De "Purge" Validatie: Integratietest waarbij het wijzigen van woningtype (Koop naar Huur) de "Dirty State" vlag triggert en na bevestiging de hypotheek-state wist.
* De 5-Volwassenen Grens: Een data-audit test die bevestigt dat bij 6 volwassenen de  vlag in de metadata verschijnt, maar niet in de UI-state of console logs.
* Hydration Failure: Een test die een corrupte JSON in de storage injecteert en bevestigt dat de app stopt (of een veilige fallback kiest) in plaats van de corrupte data te overschrijven met een lege state.
4. De "Bleeding Edge" Safety-Check (React 19 / RN 0.81)
* Opdracht: Gezien de vroege adoptie van deze stack, moet Flow 3.5 een "Regression Suite" definiëren die na elke grote architecturale wijziging (zoals de invoer van Path Aliases) controleert of de Fast Refresh en de Metro-bundler nog stabiel draaien.
🚦 Volgende stap voor Flow 3.5
Vraag de strategist om op basis van deze input een Gefaseerd Migratieplan op te stellen:
1. Fase 1: Infrastructuur & Test-steigers (Path Aliases & Jest setup).
2. Fase 2: Data-sanering (Parser & UUID-injectie).
3. Fase 3: Architecturale verschuiving (Navigator State Machine & Reducer Alignment).
Wil je dat ik deze set direct doorzet naar Flow 3.5, of wil je nog specifieke randvoorwaarden toevoegen aan de test-parameters?2)
Dit is een strategische zet. Flow 3.5 (de MIGRATION & TEST strategist) is de essentiële schakel die de theoretische architectuur van Lyra (Flow 2) en de kritische audit van ARIA (Flow 3) vertaalt naar een veilig executieplan voor de Navigator (Flow 4).
Om Flow 3.5 direct op stoothoogte te brengen, heb ik hieronder de integrale synthese van alle bevindingen uit de eerdere flows geclusterd.
📋 Input-Dossier voor Flow 3.5: "Project Standaard 2025"
🏗️ Cluster 0 & 5: De Architecturale Schil & Navigatie
* 
Bevinding: De applicatie lijdt aan "Boolean Soup" in de navigatie (9+ losse booleans voor schermen)1111.⚙️ Cluster 2: State & Persistence Layer
* 
Kritiek Risico: Identiteitscrisis door het gebruik van  voor financiële records, wat leidt tot ID-collisies777777777.🧮 Cluster 1 (Finance): Rekenlogica & Ingestie
* 
Gevaar: De "Komma-bug" (1.250,50 wordt 1.25) door naïeve replace logica101010101010101010.🧩 Cluster 3 & 4: UI Atoms & Wizard Logic
* 
Schoonmaak:  moet worden ontdaan van alle domeinkennis; het mag alleen atomen aansturen13131313.Is dit voldoende input voor ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025 om zijn werk te kunnen doen?Show more20 dec 2025
Laat me de input grondig evalueren tegen de requirements van de Ultimate A-Tier Migration & Test Strategy Prompt:

De Ultimate Migration Prompt heeft strikte input requirements volgens . Laten we checken wat er mist:

xml
Wat ontbreekt:

Waarom kritiek: Migration time estimates, rollback strategy, testing scope

xml
Wat ontbreekt:

Waarom kritiek: Capacity planning, performance validation

xml
Wat aanwezig is:

Wat ontbreekt:

Waarom kritiek: Phase sequencing, rollback impact

xml
Volledig afwezig maar ESSENTIEEL:

Waarom kritiek: Bepaalt hele migration strategy (phased vs big bang)

xml
Waarom kritiek: Het hele "Post-Migration Validation" framework hangt hierop!

xml
Wat ontbreekt: Error budget, acceptable failure rate

✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument # ✅ Complete Input Template voor Flow 3.5 Migration Strategy
## Project: Standaard 2025 - AsyncStorage → DDD Structure Migration

---

## 📦 **APPROVED ADVICE** (from Flow 2 + 3)

### Migration Item 1: UUID Transformation (Cluster 2)
**Current State:Continue20 dec 2025✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument ∙ Version 2 ### HIGH PRIORITY (Strongly recommended)
- [ ] **Monitoring:** Sentry/Crashlytics setup? Analytics?
- [ ] **Migration Budget:** Error budget (X% failures acceptable?)
- [ ] **Rollback Strategy:** Force update mechanism? Or tolerate old versions?
- [ Perfect! Ik heb nu een complete analyse gemaakt. Laat me samenvatten:

WAT ER GOED IS: ✅

WAT ER ONTBREEKT (Kritiek): ❌

Impact: Flow 3.5 kan een generieke strategie maken, maar niet een production-ready, date-committed, risk-quantified plan.

Gezien:

Fase 1: Quick Generic Strategy (NU)

Fase 2: Complete Strategy (na data gathering)

Optie A: Ik genereer nu een generic strategy met placeholders

Optie B: Ik help je eerst missing info verzamelen

Optie C: Hybrid: Generic strategy NU + checklist voor later

Wat kies jij? A, B, of C? 🎯Show more22 dec 2025
Je hebt alles correct geconfigureerd, maar er zijn een paar veelvoorkomende oorzaken waarom ze nog niet werken:

Metro cache is extreem hardnekkig en pikt nieuwe Babel config niet automatisch op.
Fix:
bash
Test daarna:
typescript

| Je hebt correct reanimated als laatste | maar soms moet eerste zijn. |
| --- | --- |
| Dit is al correct bij jou | maar goed om te verifiëren. |

Check of de plugin er is:
bash
Als niet gevonden:
bash

Je gebruikt  (relative), soms werkt absolute path beter:
Probeer:
javascript

Je  is correct, maar soms moet je ook  toevoegen voor niet-TS files.
Voeg toe:  (naast tsconfig.json):
json

Je gebruikt , wat suggereert Expo. Soms heeft Expo een eigen caching mechanisme.
Als je Expo gebruikt:
bash

Zorg dat je imports correct zijn:
✅ Correct:
typescript
❌ Fout:
typescript

Voer deze stappen in volgorde uit:
bash
9. VSCode restart:

10. Test import:
typescript
Kijk naar errors in:

→ Babel niet correct of Metro cache issue
→ Fix: Reset cache (stap 7 hierboven)

→ TypeScript server niet bijgewerkt
→ Fix: Restart TS Server (CMD+Shift+P → "Restart TS Server")

→ Metro cache corrupt
→ Fix: 

→ Stale import cache in specific file
→ Fix: Delete .js.map files, restart bundler

Probeer deze 3 snelle fixes eerst:
bash
Als dat niet werkt, volg de volledige checklist hierboven.

Test met deze code in App.tsx:
typescript
Als je errors ziet:

Maak een test script om te verifiëren dat aliassen werken:
:
javascript
Run:
bash
Dit vertelt je of de directories bestaan waar de aliases naar wijzen.

| Laat me weten welke error je krijgt, dan help ik verder! 🚀ik krijg deze melding [node scripts/sync-aliases.js ❌ Failed to parse tsconfig.json (JSONC + trailing commas)] bij uitvoeren van dit script. Analyseer script, zoek alle tips en best practices en pas deze toe op het script | analyseer het door jouw geschreven script nogmaals en verbeter het waar mogelijk. #!/usr/bin/env node |
| --- | --- |
| const fs = require('fs') |  |
| const path = require('path') |  |
| const ROOT = process.cwd() |  |
| const TSCONFIG = path.join(ROOT, 'tsconfig.json') |  |
| const BABEL = path.join(ROOT, 'babel.config.js') |  |
| const JEST = path.join(ROOT, 'jest.config.js') |  |
| const DRY_RUN = process.argv.includes('--dry-run') |  |
| ] |  |
| console.error❌ ${msg}) |  |
| process.exit(1) |  |
| .replace(/,\s*([}\]])/g, '$1') |  |
| console.logℹ️ ${msg}) |  |
| console.log✅ ${msg}) |  |
| if (!fs.existsSync(TSCONFIG)) die('tsconfig.json not found') |  |
| let ts |  |
| const raw = fs.readFileSync(TSCONFIG, 'utf8') |  |
| ts = JSON.parse(sanitizeJson(raw)) |  |
| die('Failed to parse tsconfig.json (JSONC + trailing commas)') |  |
| const paths = ts.compilerOptions?.paths |  |
| if (!paths) die('No compilerOptions.paths found') |  |
| const name = key.replace(/\/\*$/, '') |  |
| const target = value.replace(/\/\*$/, '') |  |
| die) |  |
| return { name, target } |  |
| }) |  |
| info) |  |
| aliases.forEach(a => info)) |  |
| if (!fs.existsSync(BABEL)) die('babel.config.js not found') |  |
| let babelSrc = fs.readFileSync(BABEL, 'utf8') |  |
| info('babel.config.js: alias block NOT found') |  |
| ok('babel.config.js: alias block found') |  |
| const babelAliasBlock = '${a.name}': './${a.target}', |  |
| ) |  |
| fs.writeFileSync(BABEL, babelSrc) |  |
| if (!fs.existsSync(JEST)) die('jest.config.js not found') |  |
| let jestSrc = fs.readFileSync(JEST, 'utf8') |  |
| info('jest.config.js: moduleNameMapper NOT found') |  |
| ok('jest.config.js: moduleNameMapper found') |  |
| const jestMapperBlock = '^${a.name.replace('@', '\\@')}/(.*)$': '<rootDir>/${a.target}/$1', |  |
| ) |  |
| fs.writeFileSync(JEST, jestSrc) |  |
| ok('Dry-run complete (no files modified)') |  |
| ok('Aliases synced from tsconfig.json') |  |

javascript

javascript

javascript

javascript

sync-aliases.js (Fixed & Enhanced)Code #!/usr/bin/env node
/**
 * Sync path aliases from tsconfig.json → babel.config.js + jest.config.js
 * 
 * Features:
 * - JSONC support (comments, trailing commas)
 * - Dry-run mode (--dry-run)
 * - Backup creation (--backup)
 * - Validation (reservedPerfect! Nu nog een vergelijkingstabel en best practices document:Script Verbeteringen & Best PracticesDocument # 📊 Script Verbeteringen & Best Practices

---

## 🔍 **Wat Was Er Mis**

### Bug 1: Template Literal Syntax Errors
```javascript
// ❌ ORIGINEEL (4 locaties!)
console.error`❌ ${msg}`);
console.log`ℹ️  ${msg}`);
die`Alias "${name}" is reserved`);
infPerfect! Nog één ding - een quick reference card voor dagelijks gebruik:Path Aliases Troubleshooting CheatsheetDocument # 🚨 Path Aliases Troubleshooting Cheatsheet

---

## ⚡ **Quick Fixes (Try These First)**

```bash
# 1. Nuclear cache clear (solves 90% of issues)
npx react-native start --reset-cache

# 2. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeS
Ik heb je complete set geleverd:

Direct doen:
bash
Aliases zouden nu moeten werken! 🎉
Heb je nog errors? Laat me de exacte error message zien en ik help verder debuggen! 🔍Claude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

### RecentsHide

ChatsProjectsArtifactsCodeAll chats

---

**Claude:**

ChatsProjectsArtifactsCode

---

**Claude:**

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

### RecentsHide

All chats

---

**Claude:**

Markdown bestanden combineren met PowerShell

---

**Claude:**

Verbeteringssuggestions gevraagd

---

**Claude:**

Scripts analyseren en verbeteringsadvies

---

**Claude:**

Scripts organiseren en opschonen

---

**Claude:**

Audit-script update en verbeterpunten analyseren

---

**Claude:**

Haakje of puntkomma zoeken in code

---

**Claude:**

Wat is dit?

---

**Claude:**

Protocol en documentenanalyse met validatie

---

**Claude:**

Flow 2 architect prompt evaluation

---

**Claude:**

Flow 6 analyse en optimalisatie

---

**Claude:**

CU-assembler prompt optimalisatie voor WAI-audit

---

**Claude:**

CU-assembler ultimate prompt ophalen

---

**Claude:**

Audit-script optimalisatie voor WAI-001 tot WAI-006

---

**Claude:**

Mappenstructuur aanmaken

---

**Claude:**

Prompt optimization en vergelijking PR2

---

**Claude:**

CSV service parsing and validation improvements

---

**Claude:**

Code analyse en verbeteringsadvies

---

**Claude:**

Identificatie bestanden voor theme-code integratie

---

**Claude:**

Untitled

---

**Claude:**

Resuming project development context

---

**Claude:**

Implementation plan development

---

**Claude:**

Dagelijkse invoer voor transactiebeheer

---

**Claude:**

Applying a specific diff

---

**Claude:**

Analyse, vergelijking en aanbevelingen

---

**Claude:**

React Native app wizard flow implementation

---

**Claude:**

Financial household management app architecture

---

**Claude:**

AI CTO initialization and project planning

---

**Claude:**

Mermaid chart van code

---

**Claude:**

All chats

---

**Claude:**

MManasseFree plan

---

**Claude:**

M

---

**Claude:**

ManasseFree plan

---

**Claude:**

| Situatie | Actie |
| --- | --- |
| Complexe state | Discriminated Union |
| Herhaalde logica (3x) | Extraheer functie/hook |
| Onduidelijke naam | Hernoem naar doel |
| Lange functie (>20) | Split op (SRP) |
| API data | Parse met Zod |
| Legacy code | Boy Scout + Mikado |
| Test schrijven | Test gedrag, niet impl |
| Performance issue | Meet eerst, dan optimize |

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

```
utils/finance.ts → domain/income/finance.ts
```

```
utils/finance.ts → domain/income/finance.ts
```

```
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```ts
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

```
daysUntilDeadline
```

```
shouldRender
```

```
tempVariable
```

```
type UserId = string
```

```
({ title, onClick })
```

```
props.title
```

```
useUserAuth
```

```html
useState<User | null>(null)
```

```
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```ts
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```
type Status = 'open' | 'closed'
```

```html
ReturnType<typeof fn>
```

```json
{ success: boolean, data?: T, error?: string }
```

```yaml
strict: true
```

```
/features/auth/*
```

```
/components/*
```

```
noImplicitAny
```

```
strictNullChecks
```

```
@components/*
```

```
../../components
```

```
console.log
```

```
const MAX_RETRIES = 3
```

```
npx tsc --noEmit
```

```html
<input_delimiters>
```

```
AsyncStorage
```

```
household, members, income
```

```
ISO-8601 UTC-Noon
```

```
YYYY-MM-DDT12:00:00Z
```

```
NumericParser
```

```
isSpecialStatus
```

```
INITIALIZING | READY | ERROR
```

```
useAppOrchestration
```

```
isSpecialStatus
```

```
Math.random()
```

```
AsyncStorage
```

```
NumericParser
```

```
FormField.tsx
```

```
formReducer
```

```
NumericParser
```

```html
<input_structure>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Altijd als laatste!
    ],
  };
};

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    /* Phoenix Aliassen */
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
     }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

Waarom werken de aliassen niet??
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Altijd als laatste!
    ],
  };
};

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    /* Phoenix Aliassen */
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
     }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

Waarom werken de aliassen niet??
```

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```ts
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```
module-resolver
```

```
module-resolver
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```
babel-plugin-module-resolver
```

```
npm list babel-plugin-module-resolver
```

```bash
npm list babel-plugin-module-resolver
```

```
npm install --save-dev babel-plugin-module-resolver
```

```bash
npm install --save-dev babel-plugin-module-resolver
```

```
./src/domain
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```
tsconfig.json
```

```
jsconfig.json
```

```
jsconfig.json
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```
babel-preset-expo
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```ts
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```ts
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```ts
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```
npx react-native start --reset-cache
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```ts
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```
verify-aliases.js
```

```
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```js
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```
node verify-aliases.js
```

```bash
node verify-aliases.js
```

```
Alias "${name}" is reserved
```

```
Found ${aliases.length} aliases in tsconfig.json
```

```
${a.name} → ${a.target}
```

```yaml
alias: {
${aliases.map(a =>
```

```
).join('\n')}
            },
```

```yaml
moduleNameMapper: {
${aliases.map(a =>
```

```
).join('\n')}
  },
```

```
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```js
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```js
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```js
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```js
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```
sync-aliases.js
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

- Testen makkelijker maakt
- AI-begeleide refactors veiliger maakt
- Future features isoleerbaar houdt

- Zijn netter, maar niet urgent
- Kosten meer tijd zonder directe winst
- Kunnen gradueel tijdens feature-werk

- De minimale refactor (fase 1) als script uitschrijf?
- Een ADR maak voor "Waarom wizard een subsystem is"?
- Een import-regel docje maak ("wie mag wie importeren")?

| - ✅ Boolean prefixen: isLoading | hasAccess |  |
| --- | --- | --- |
| - ✅ Geen ruis: vermijd dataObject | userInfo |  |

- ✅ Single Responsibility: één functie = één taak
- ✅ Max 20 regels (vuistregel voor leesbaarheid)
- ✅ Max 2 argumenten (meer? → gebruik object)
- ✅ Guard Clauses: handel edge cases bovenaan af (return early)
- ✅ Geen side effects: voorspelbaar gedrag
- ✅ Pure functions waar mogelijk: zelfde input = zelfde output

| Key | Value |
| --- | --- |
| ✅ Kleine componenten | max 100-150 regels JSX |
| ✅ Destructuring props | ipv |
| ✅ Fragmenten | gebruik <>...</> ipv onnodige divs |
| ✅ Composition over Inheritance | gebruik children prop |
| ✅ Logica uit UI | verplaats naar Custom Hooks () |
| ✅ Feature | based structure: alles van één feature in één map |

- ✅ Expliciet typen:
- ✅ useCallback/useMemo: alleen bij échte performance issues
- ✅ Custom Hooks: extraheer herbruikbare logica
- ✅ React.FC: vermijd (tenzij je children expliciet nodig hebt)

- ✅ NOOIT any: gebruik unknown als je type niet weet
- ✅ Interfaces voor props: beter uitbreidbaar dan type
- ✅ Discriminated Unions voor state:

- ✅ Enums/Unions voor constanten:
- ✅ readonly voor immutable data
- ✅ Utility Types: Omit, Pick,

- ✅ Generics met constraints: flexibel maar type-safe
- ✅ Parse, don't validate: gebruik Zod aan systeemgrenzen
- ✅ Result types:
- ✅ Strict tsconfig: schakel  in

| Key | Value |
| --- | --- |
| ✅ Shallow codebase | max 3-4 niveaus diep |
| ✅ Feature | based folders: ipv |
| ✅ Domain layer | business logica apart van UI |
| ✅ Just Use Functions | vermijd onnodige classes |
| ✅ DRY (Don't Repeat Yourself) | Regel van Drie |

1x = schrijf het
2x = dupliceer (acceptabel)
3x = refactor naar herbruikbare functie
- 1x = schrijf het
- 2x = dupliceer (acceptabel)
- 3x = refactor naar herbruikbare functie

- 1x = schrijf het
- 2x = dupliceer (acceptabel)
- 3x = refactor naar herbruikbare functie

| Key | Value |
| --- | --- |
| ✅ Strangler Fig | vervang legacy code geleidelijk |
| ✅ Façade pattern | wrap oude code, route verkeer om |
| ✅ Repository pattern | scheid data-access van business logica |
| ✅ Discriminated Unions | voorkom onmogelijke states |

| - ✅ Test gedrag | niet implementatie |
| --- | --- |
| - ✅ Gebruik Testing Library: getByRole | getByText |

| - ✅ ESLint strict mode: waarschuw bij any | complexiteit |
| --- | --- |
| - ✅ TypeScript strict mode: |  |

- ✅ Boy Scout Rule: laat code schoner achter dan je het vond
- ✅ Mikado Method:

Stel doel → probeer → visualiseer blokkades
Revert → los sub-doelen op → werk terug naar doel
- Stel doel → probeer → visualiseer blokkades
- Revert → los sub-doelen op → werk terug naar doel
- ✅ Prioriteer op impact:

High-change areas
Bug-prone modules
Onboarding blockers
- High-change areas
- Bug-prone modules
- Onboarding blockers
- ✅ Incremental refactoring: kleine stappen, blijf deploybaar

- Stel doel → probeer → visualiseer blokkades
- Revert → los sub-doelen op → werk terug naar doel

- High-change areas
- Bug-prone modules
- Onboarding blockers

| Key | Value |
| --- | --- |
| ✅ Custom Path Aliases | ipv |
| ✅ React Compiler | bereid je voor (minder handmatige memo's) |
| ✅ Vitest | snellere test runner dan Jest |
| ✅ Biome | all-in-one linter/formatter (alternatief voor ESLint+Prettier) |

| Key | Value |
| --- | --- |
| ✅ Don't outsource thinking | AI voor boilerplate, jij voor architectuur |
| ✅ Vermijd "vibe coding" | begrijp wat AI genereert |
| ✅ Validate AI output | check logica en edge cases |
| ✅ Use AI for refactoring suggestions | maar neem bewuste beslissingen |

| - ✅ Structured logging: niet | maar structured data |
| --- | --- |
| - ✅ Distributed tracing: in microservices (Jaeger | OpenTelemetry) |
| - ✅ Performance monitoring: Lighthouse | React DevTools Profiler |

| - ✅ Commentaar op "waarom" | niet "wat" |
| --- | --- |
| - ✅ Code is voor mensen: machine compileert alles | mensen moeten het begrijpen |

| Key | Value |
| --- | --- |
| ✅ Vermijd deep nesting | max 2-3 niveaus |
| ✅ Ternary overkill voorkomen | complexe conditie? → if statement |
| ✅ Failing gracefully | voorspelbaar foutgedrag |
| ✅ Consistent naming | zelfde concepten, zelfde namen |

| Key | Value |
| --- | --- |
| ✅ TypeScript default sinds 0.71 | gebruik het |
| ✅ Babel voor transforms | niet tsc voor compilatie |
| ✅ Type | check met CLI: |
| ✅ @react | native/typescript-config: gebruik officiële config |

| Key | Value |
| --- | --- |
| ✅ FlatList voor lange lijsten | niet .map() |
| ✅ Memoize zware componenten | React.memo met zorg |
| ✅ Hermes engine | snellere JS-uitvoering |
| ✅ Native modules | schrijf performance-kritieke code in native |

| Key | Value |
| --- | --- |
| ⬜ Naamgeving check | zijn alle namen self-explanatory? |
| ⬜ Functie lengte | < 20 regels per functie? |
| ⬜ TypeScript strict | geen any, expliciete types? |
| ⬜ Tests aanwezig | gedekt met betekenisvolle tests? |
| ⬜ Boy Scout Rule | code schoner achtergelaten? |
| ⬜ Discriminated Unions | onmogelijke states voorkomen? |
| ⬜ Import paths | relatieve paths < 3 niveaus of gebruik aliases? |
| ⬜ Side effects | functies voorspelbaar en pure? |
| ⬜ Commentaar nodig? | zo ja, leg "waarom" uit, niet "wat" |
| ⬜ Leave No Questions | zou een nieuwe dev dit snappen? |

| - Refactoring is geen taak | het is een workflow (Martin Fowler) |
| --- | --- |
| - Parse | don't validate: dwing types af aan grenzen |

- Wetenschappelijke debugging methodologieën (Five Whys, Binary Search, etc.)
- React Native specifieke tools en technieken
- 7 verschillende debugging strategieën
- Common bug types met aanpak per type
- Best practices en anti-patterns
- Cognitive strategies en bias awareness
- Complete debugging workflow (8 stappen)

- Sterke en zwakke punten van elk
- Concrete verbeterpunten per prompt (5 voor elk)
- Nieuwe elementen die in beide ontbraken
- Ideale hybride kenmerken tabel
- 14 missende elementen geïdentificeerd

- 9 output secties (vs 4 in Debug1, 7 in Debug2)
- Five Whys verplicht voor root cause
- React Native specifieke diagnostics
- TypeScript error decoder
- Emergency protocols (production down, data loss, security)
- Advanced scenarios (race conditions, memory leaks, performance)
- Absolute constraints met IRON LAW regels
- Quality checklist voor self-verification
- Confidence % systeem (geen vage "hoog/laag")

| Key | Value |
| --- | --- |
| Structured Thinking | Investigation log + Five Whys + Hypothesis ranking |
| External Research | Verplichte verificatie met citatie regels |
| React Native Focus | Platform-specifieke diagnostics en tools |
| No Code Policy | Absolute verbod op code fixes (conceptueel only) |
| Preventie Focus | Korte + lange termijn vaccinatie strategie |
| Emergency Ready | Protocols voor production incidents |
| Escalation Criteria | Wanneer stoppen en hulp vragen |

- Een voorbeeld debugging sessie doorloop met de nieuwe prompt?
- De prompt further specialize voor jouw specifieke React Native project structuur?
- Een quick reference card maken voor dagelijks gebruik?

- 7 kritieke gaps geïdentificeerd (pre-migration assessment, testing strategy, data quality, etc.)
- 4 anti-patterns blootgelegd (big bang risk, undefined success criteria, manual error handling)
- 8 verbeterpunten uit research (data migration testing pyramid, phased percentages, automated balance)
- 8 DO's en 8 DON'Ts uit praktijk (Netflix, Google, Adobe case studies)
- Quantified industry benchmarks (83% big bang failure rate, $13M data quality cost)

| - Pre-migration assessment (profiling | baselines | dependency mapping) |
| --- | --- | --- |
| - Compliance & security (GDPR | HIPAA | SOC2) |

- Error thresholds: < 0.1% (was: "toetsbaar")
- Performance: < 5% degradation (was: vague "acceptable")
- Rollback time: < 2 hours (was: undefined)
- Coexistence: 30-90 days (was: not specified)
- 10+ industry benchmarks included

- ✅ Pre-migration data profiling (ROT analysis)
- ✅ POC phase (90% vs 17% success rate)
- ✅ Automated rollback triggers
- ✅ Comparison testing protocol (row/column/hash)
- ✅ Data quality gates
- ✅ Performance baseline establishment
- ✅ Rollback drills (test the safety net!)
- ✅ Post-migration coexistence period
- ✅ Compliance audit trails
- ✅ Quantified stop criteria

- Conceptually sound maar operationally vague
- "Toetsbaar" zonder getallen
- Geen pre-assessment
- 4 fases
- Generieke test strategy

| - Quantified (< 0.1% | < 5% | < 2h) |
| --- | --- | --- |
| - Automated (rollback | validation | monitoring) |

| Key | Value |
| --- | --- |
| Nooit blind migreren | Data profiling is non-negotiable |
| POC eerst | 90% success rate vs 17% big bang |
| Quantify everything | "< 0.1%" beats "low" |
| Test the rollback | Safety net moet werken |
| Coexistence period | 30-90 days is industry standard |
| Automate validation | 50% fewer errors |
| Compliance upfront | €1.2B in GDPR fines (2025) |

- Een voorbeeld migration strategy genereer met deze prompt?
- Quick reference cards maken voor dagelijks gebruik?
- De prompt verder customize voor jouw specifieke React Native project?

| - Kritiek Risico: "Taal-Spaghetti" (mix van NL/EN keys) en "Primitive Obsession" (datums als strings | leeftijd als numbers)333333333. |
| --- | --- |
| - Oplossing: Overstap naar een Ubiquitous Language (Engelse keys | Nederlandse labels)4444. |

| Key | Value |
| --- | --- |
| Mandaat | Migratie naar UUIDs (v4) voor alle leden en transacties8888. |
| Storage | Gate: Implementatie van het Repository Pattern om te isoleren. Gebruik van Zod-schema's om corrupte data bij de I/O-grens te blokkeren9999. |

| Key | Value |
| --- | --- |
| Mandaat | Introductie van een robuuste en het verbieden van any in financiële objecten (vervangen door unknown of Discriminated Unions)111111111111111111. |
| Principe | "Parse, don't validate." Data wordt bij binnenkomst (Input/CSV) direct getransformeerd naar valide types12121212. |

- Alignment: Verwijder de "A2 FIX" uit de UI-controllers en verplaats de synchronisatie-logica naar de .
- Opschoning: Implementeer "State Purging" om "Orphan Data" (bijv. oude huurdata bij een koopwoning) automatisch te wissen.
🎯 De Specifieke Opdracht voor Flow 3.5
Flow 3.5 moet op basis van deze input de volgende drie producten leveren voor de Navigator:
- De Migratie-Matrix: Een stap-voor-stap plan om de huidige "platte" data (met index-IDs en NL-keys) te migreren naar de nieuwe DDD-structuur (met UUIDs en EN-keys) zonder dataverlies voor de gebruiker.
- Het Test-Harnas: Een Jest-testplan dat specifiek de "edge cases" dekt:
De berekening van de "Speciale Status" (>5 volwassenen).De  met diverse Europese notaties.Het "Orphan Data" purge-mechanisme.
- De berekening van de "Speciale Status" (>5 volwassenen).
- De  met diverse Europese notaties.
- Het "Orphan Data" purge-mechanisme.
- De Rollback-Strategie: Wat doen we als de Zod-validatie de bestaande (vervuilde) gebruikersdata blokkeert bij de eerste start na de update?
Zal ik deze input direct doorzetten naar Flow 3.5 om het Migratie- & Testplan op te stellen?

- De berekening van de "Speciale Status" (>5 volwassenen).
- De  met diverse Europese notaties.
- Het "Orphan Data" purge-mechanisme.

- Duidelijke Legacy Baseline ✅

Platte structuur met circulaire dependencies
Index-based identiteit (fragiel)
UI als "reparateur" (anti-pattern)
- Platte structuur met circulaire dependencies
- Index-based identiteit (fragiel)
- UI als "reparateur" (anti-pattern)
- High-Risk Migration Points Geïdentificeerd ✅

UUID transformatie (breaking change)
Semantische ID migratie (storage compatibility)
Datum-strategie wijziging (data corruption risk)
- UUID transformatie (breaking change)
- Semantische ID migratie (storage compatibility)
- Datum-strategie wijziging (data corruption risk)
- Concrete Test Scenarios ✅

Komma-bug boundary testing
Purge validation
5-volwassenen grens
Hydration failure
- Komma-bug boundary testing
- Purge validation
- 5-volwassenen grens
- Hydration failure
- Technology Stack Context ✅

React 19 / RN 0.81 (bleeding edge risk)
Fast Refresh stability concerns
- React 19 / RN 0.81 (bleeding edge risk)
- Fast Refresh stability concerns

- Platte structuur met circulaire dependencies
- Index-based identiteit (fragiel)
- UI als "reparateur" (anti-pattern)

- UUID transformatie (breaking change)
- Semantische ID migratie (storage compatibility)
- Datum-strategie wijziging (data corruption risk)

- Komma-bug boundary testing
- Purge validation
- 5-volwassenen grens
- Hydration failure

- React 19 / RN 0.81 (bleeding edge risk)
- Fast Refresh stability concerns

| - Aantal records (leden | transacties)? |
| --- | --- |
| - Current app performance metrics (startup time | etc.)? |

- Nieuwe storage structure (Zod schemas)?
- Performance requirements (startup time < X sec)?
- Size limits per user?

- Circulaire dependencies genoemd
- UI ↔ State koppeling

- Volledige dependency diagram (welke components precies?)
- External dependencies (AsyncStorage, Expo libraries)
- Critical path analysis

| Key | Value |
| --- | --- |
| Downtime tolerance | App update (minutes) of live migration (zero)? |
| Timeline | Wanneer moet dit live? Sprint planning? |
| Team | Hoeveel developers beschikbaar? Full-time of part-time? |
| Compliance | GDPR data migration rules? User consent needed? |
| Rollback window | Kan oude app versie blijven draaien? |

- Excellent migration scope definition (6 concrete items)
- Clear risk identification (UUID, dates, orphan data)
- Specific test scenarios (komma-bug, purge, special status)
- Good technical context (React 19, RN 0.76)

| - Team capacity (hoeveel developers | hoe lang?) |
| --- | --- |
| - Existing tests (huidige coverage | CI/CD?) |

- Financial domain (zero tolerance for data corruption)
- Bleeding edge stack (React 19 = risk)
- First migration (team learning curve)

- Flow 3.5 genereert strategie met placeholders
- Gebruik voor planning & stakeholder buy-in
- Identificeert wat je nog moet weten
- Timeline: 1-2 dagen

- Verzamel missing info (4-5 dagen)
- Flow 3.5 genereert production-ready plan
- Kwantitatieve thresholds, concrete dates
- Timeline: Week 2

| Key | Value |
| --- | --- |
| Pro | Direct resultaat, ziet wat er komt |
| Con | Niet executeerbaar zonder extra info |

| Key | Value |
| --- | --- |
| Pro | Production-ready output |
| Con | 4-5 dagen prep work |

| Key | Value |
| --- | --- |
| Pro | Beste van beide werelden |
| Con | Extra ronde met Flow 3.5 later nodig |

- CMD/CTRL + Shift + P
- "TypeScript: Restart TS Server"

- Metro bundler terminal
- VSCode Problems tab (CMD/CTRL + Shift + M)

- Kopieer de exacte error message
- Check welke terminal (Metro bundler of VSCode)
- Vertel me de error, dan help ik verder debuggen

- Geen check of alias block al bestaat in babel
- Geen backup van originele files
- Geen validatie of target directories bestaan
- Geen check voor duplicate aliases

- ✅ Alle 4 syntax errors gefixed
- ✅ Comprehensive validation toegevoegd
- ✅ Backup mechanisme
- ✅ Verbose + dry-run modes
- ✅ Help documentation
- ✅ Production-ready

- Volledige bug analyse
- Voor/na vergelijking
- Best practices toegepast
- Testing checklist

- Quick fixes voor 90% van issues
- Diagnosis by symptom
- Complete reset procedure
- Prevention tips

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dacm.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dntietz.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwearebrain.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dresearchgate.net&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dappdeskservices.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddemandtalk.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dguvi.in&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlambdatest.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwikipedia.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dtulip.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dasq.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlean.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbusinessmap.io&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dindeed.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Disixsigma.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Deworkorders.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcms.gov&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlearningloop.io&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatateams.ai&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dibm.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dautomq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dnetsharx.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dphygital-insights.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Derpsoftwareblog.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dkraftbusiness.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dc-metric.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Datlassian.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcouchbase.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatalark.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dquinnox.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbrowserstack.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatamigrationpro.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatafold.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwinwire.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Duniridge.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgoogle.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dforbytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dk2view.com&w=32&q=75)

# 🎯 Review van het advies

## TL;DR: JA, het advies klopt — met 2 nuances

## ✅ Wat absoluut klopt

### 1. De diagnose is accuraat

### 2. De voorgestelde structuur is pragmatisch

### 3. De mappings zijn praktisch uitvoerbaar

## ⚠️ Wat je moet nuanceren

### Nuance 1: utils/ vs domain/

## 📋 Wat ik zou doen (actieplan)

# 🎯 Complete Clean Code Checklist 2025

## React + TypeScript + React Native

## 📋 BASIS PRINCIPES

### Naamgeving

### Functies

## ⚛️ REACT BEST PRACTICES

### Component Structuur

### Hooks

## 🔷 TYPESCRIPT ESSENTIALS

### Type Safety

### Geavanceerd

## 🏗️ ARCHITECTUUR & STRUCTUUR

### Code Organisatie

### Patterns

## 🧪 TESTING & KWALITEIT

### Test Strategie

### Code Quality

## 📦 REFACTORING LEGACY CODE

### Strategieën

## 🚀 2025-SPECIFIC TIPS

### Modern Tooling

### AI-Assisted Development

### Observability

## 💡 COGNITIEVE BELASTING REDUCEREN

### Leesbaarheid

### Mentale Energie

## 🔧 REACT NATIVE SPECIFIEK

### Setup

### Performance

## ✅ DAILY CHECKLIST

## 🎯 EXPERT MINDSET

## 📚 QUICK REFERENCE

### debug2.txt

### Debug1.txt

## 📦 WAT JE ONTVANGEN HEBT

### 1️⃣ Complete Debugging Adviezenlijst 2025

### 2️⃣ Vergelijking & Verbeterpunten

### 3️⃣ ULTIMATE A-TIER DEBUG PROMPT 2025 🔥

## 🎯 KERNVERNIEUWINGEN IN ULTIMATE PROMPT

## 💡 HOE TE GEBRUIKEN

## 🎯 WAT JE ONTVANGEN HEBT

### 1️⃣ Kritische Analyse van Flow 3.5

### 2️⃣ ULTIMATE A-TIER MIGRATION PROMPT 2025 🔥

## 💡 KERNVERSCHILLEN

### Original Flow 3.5:

### Ultimate A-Tier:

## 🎓 BELANGRIJKSTE LESSEN

# 🎯 Analyse van Input voor Ultimate Migration Prompt

## ✅ WAT ER GOED IS

### Sterke Punten in de Input:

## ⚠️ WAT ONTBREEKT (Kritiek voor Migration Prompt)

### 1. Source System Details ❌

### 2. Target System Specs ❌

### 3. Dependency Graph ⚠️ (Partieel aanwezig)

### 4. Constraints ❌ (Meest kritieke gap!)

### 5. Baseline Metrics ❌

### 6. Existing Test Infrastructure ❌

## 📋 COMPLETE INPUT TEMPLATE (Wat Flow 3.5 ECHT nodig heeft)

## 🎯 ANTWOORD OP JE VRAAG

### Korte antwoord: JA, maar met significante gaps ⚠️

### Lange antwoord:

## 💡 MIJN ADVIES

### → Recommended: 2-fase aanpak

## 🚀 WAT WIL JE?

# 🔍 Diagnose: Path Aliases Werken Niet

## 🚨 Meest Waarschijnlijke Oorzaken

### 1. Metro Bundler Cache (90% van de gevallen!)

### 3.  Plugin Positie

### 4.  Niet Geïnstalleerd?

### 5. Relative Paths in Alias Definition

### 6. TypeScript vs Runtime Mismatch

### 7. Expo vs React Native CLI Conflict

### 8. Import Syntax Check

## 🔧 Volledige Debug Checklist

## 🐛 Specifieke Error Messages

### Error: "Cannot find module '@domain/...'"

### Error: Red squiggly in VSCode but app runs fine

### Error: "Module does not exist in the module map"

### Error: Works in one file, not another

## 🎯 Snelle Win Checklist

## 📊 Verificatie: Werken Ze Nu?

## 💡 Pro Tip: Verify Configuration

# 🔍 Analyse & Verbeterd Script

## 🐛 Gevonden Bugs

### 1. Template Literal Syntax Errors ❌

### 2. JSON Parsing Error Handling Te Breed

### 3. Regex Replace Te Greedy

### 4. Geen Validatie van Array Destructuring

### 5. Ontbrekende Edge Case Handling

## ✅ Verbeterd Script (Production-Ready)

## 🎯 Samenvatting

### 1️⃣ Gefixed Script ()

### 2️⃣ Verbeteringen Document

### 3️⃣ Troubleshooting Cheatsheet

## 🚀 Volgende Stappen

> "Code is een verhaal dat je vertelt aan je toekomstige zelf en je teamgenoten. Maak het een goed verhaal."

> "Is dit voldoende input voor ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025?"

Mappenstructuur aanmakenSharePerfect — **dit is precies genoeg om je repo “te lezen”** 👍
Ik ga nu:

1. **je huidige structuur duiden** (wat is het nu echt?)
2. **de knelpunten benoemen** (waar wringt het al)
3. **een concrete doel-structuur voorstellen**
4. **een expliciete mapping: huidig → nieuw**
   (zonder onnodige pastedHuidige mappenstructuur:
src
├── components
│   ├── ChipButton.tsx
│   ├── ConditionalField.tsx
│   ├── DateField.tsx
│   ├── FormField.tsx
│   ├── InputCounter.tsx
│   └── ToggleSwitch.tsx
├── config
│   └── features.ts
├── context
│   ├── FormContext.tsx
│   ├── FormContext.tsx.bak
│   └── ThemeContext.tsx
├── hooks
│   └── useDobInput.ts
├── navigation
│   └── Navigator.tsx
├── organisms
│   ├── ExpenseRepeater.tsx
│   ├── HouseholdMemberRepeater.tsx
│   ├── HouseholdMemberRepeater.tsx.bak
│   └── IncomeRepeater.tsx
├── screens
│   ├── CSV
│   │   └── CsvUploadScreen.tsx
│   ├── Daily
│   │   └── UndoScreen.tsx
│   ├── DailyInput
│   │   └── DailyInputScreen.tsx
│   ├── Dashboard
│   │   └── DashboardScreen.tsx
│   ├── LandingScreen.tsx
│   ├── Options
│   │   └── OptionsScreen.tsx
│   ├── Reset
│   │   └── ResetScreen.tsx
│   ├── Settings
│   │   └── SettingsScreen.tsx
│   └── Wizard
│       ├── pages
│       │   ├── C10.config.ts
│       │   ├── C1.config.ts
│       │   ├── C4.config.ts
│       │   └── C7.config.ts
│       ├── WizardController.tsx
│       ├── WizardController.tsx.bak
│       └── WizardPage.tsx
├── services
│   ├── csvService.ts
│   ├── householdAlign.ts
│   ├── storage.ts
│   └── transactionService.ts
├── styles
│   ├── Colors.ts
│   └── useAppStyles.ts
├── types
│   ├── expenses.ts
│   ├── form.ts
│   ├── household.ts
│   ├── income.ts
│   └── transaction.ts
└── utils
    ├── conditions.ts
    ├── date.ts
    ├── finance.ts
    ├── numbers.ts
    ├── strings.ts
    └── validation.ts
ADVIES :
KLOPT HET ADVIES?Show more20 dec 2025

Het advies is solide en praktisch. De analist heeft je repo goed begrepen en stelt een evolutionaire refactor voor die past bij jouw situatie.
Maar laat me specifiek ingaan op wat WEL en NIET klopt:

De 3 kernproblemen zijn echt:

👉 Dit zijn echte architectural smells die je gaat voelen bij schalen

Dit is geen over-engineering, maar logische scheiding die:

De tabel met "huidig → nieuw" is geen theorie, maar een executable migration plan. Je kunt dit letterlijk file-by-file doorlopen.

Het advies stelt voor:

Dit klopt conceptueel, maar:
typescript
Waarom? Deze moves:

bash
Dit geeft je 80% van de winst met 20% van de moeite.

Wil je dat ik:

Zeg maar wat het meest helpt! 🚀Hier is de belangrijkste punten uit het artikel "7 Tips for Clean React TypeScript Code You Must Know" van Tapajyoti Bose.
Opmerking: Als je de "Gemini Live" modus gebruikt op je telefoon, kan ik deze tekst direct voor je uitspreken met een natuurlijke stem.
7 Tips voor Schone React TypeScript CodpastedLEES en stel een nette lijst samen; vul eventueel aan met missende tips om code 2025-proof te maken20 dec 2025

typescript

Voor elke feature/bugfix:

Laatst bijgewerkt: December 2024
Voor: React Native + TypeScript + Clean Architecture190 linestxt121 linestxtVerzamel zoveel mogelijk adviezen met betrekking tot debuggen van de code in mijn project. Analyseer en vergelijk daarna de prompts in in Debug1.txt en debug2.txt. Zoek naar tips om de prompts te verbeteren (verrijkt met de adviezen die je gevonden hebt). Geef mij die tips en gebruik tot slot zelf alle gevonden adviezen en tips om die  "ultieme ultra A-TIER god-modus prompt" zelf te schrijven. Denk over alles heel goed na20 dec 20251 stepsystematic debugging methodology software engineering 202510 resultsWhy Programs Fail: A Guide to Systematic Debugging | Guide books | ACM Digital Libraryacm.orgA systematic approach to debugging | nicole@webntietz.com10 effective debugging techniques for developers - WeAreBrainwearebrain.comA Systematic Review on Program Debugging Techniques | Request PDFresearchgate.netDebugging Approaches - Software Engineering - GeeksforGeeksgeeksforgeeks.orgBest Debugging Techniques : Process, Guidelines and Approaches - 2024appdeskservices.comUnveil Pro Debugging Techniques & Explore Its Role As a Soft Skilldemandtalk.comDebugging in Software Development: The Ultimate Guide 2025guvi.inDebugging: Its Strategies And Tools With Best Practiceslambdatest.comWhat is Debugging in Software Engineering? - GeeksforGeeksgeeksforgeeks.orgroot cause analysis debugging Five Whys hypothesis testing10 resultsFive whys - Wikipediawikipedia.orgWhat are the Five Whys? A Tool For Root Cause Analysis | Tuliptulip.coFive Whys and Five Hows | ASQasq.org5 Whys - What is it? | Lean Enterprise Institutelean.orgThe 5 Whys Explained: How to Get to the Root Cause Fastbusinessmap.io5 Whys Technique: Root Cause Analysis (With Examples) | Indeed.comindeed.comRoot Cause Analysis: Integrating Ishikawa Diagrams and the 5 Whys - isixsigma.comisixsigma.com5 Whys Root Cause Analysis Techniqueseworkorders.comFive Whys Tool for Root Cause Analysiscms.gov5 Whys. What it is, How it Works, Examples.learningloop.ioLaat me nu een uitgebreide analyse maken en de ultieme debugging prompt schrijven.Complete Debugging Adviezenlijst 2025Document # 🔍 Complete Debugging Adviezenlijst 2025
## React Native + TypeScript Focus

---

## 📊 **DEBUGGING METHODOLOGIE**

### Wetenschappelijke Aanpak (Scientific Method)
- ✅ **Observatie → Hypothese → Test → Conclusie**
- ✅ **Evidence-based**: nooit radNu ga ik de twee prompts analyseren en verbetertips geven:Analyse & Vergelijking Debug Prompts + VerbeterpuntenDocument # 🔬 Analyse Debug Prompts + Verbeterpunten

---

## 📊 **VERGELIJKING DEBUG1 vs DEBUG2**

### Debug1.txt (Forensics Mode)
**Sterke punten:**
- ✅ Expliciet research protocol (externe verificatie)
- ✅ Concrete output template met crime scene metaphor
Nu schrijf ik de ultieme A-tier debug prompt:🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document # 🔬 ULTIMATE A-TIER DEBUG PROMPT 2025
## Lyra Forensics Engine - React Native Edition

---

```xml
<system_configuration>
  <role>Senior Site Reliability Engineer & Forensic Code Investigator</role>
  <name>Lyra (Forensics Mode)</name>
  <specialty>Continue20 dec 2025<function_results>OK</function_results>
<system_warning>Token usage: 41953/190000; 148047 remaining</system_warning>🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document ∙ Version 2   <time_management>
    Signaleer wanneer escalatie nodig is:
    - Na 3 hypotheses allemaal fout: "Dit vereist senior review"
    - Intermittent bug na 2 uur: "Monitoring setup nodig"
    - Native crash zonder native expertise: "Xcode/Android StudioPerfect! Ik heb nu een complete analyse gemaakt. Laat me een samenvatting geven van wat ik heb geleverd:

Een uitgebreide verzameling van:

Een forensische analyse van beide prompts met:

De god-modus prompt met:

De ultimate prompt is production-ready en kan direct gebruikt worden. Je vult de input template in volgens de  en krijgt een systematisch 9-sectie rapport dat je door het hele debugging proces leidt zonder premature oplossingen te geven.
Wil je dat ik:

Laat het maar weten! 🚀Absoluut — ik begrijp wat je bedoelt met **Flow 3.5**: een AI-agent die *geen nieuwe architectuur bedenkt*, *geen implementatie doet* en *geen debug uitvoert*, maar die **voor elk verbeterpunt dat uit Flow 2 en Flow 3 komt**:

* **een gefaseerde migratieparagraaf oplevert**
* **een gedegen teststpastedAnalyseer deze prompt; Wat kan hier beter aan en waarom? Zoek naar do's en don'ts uit de praktijk. Kijk kritisch naar al jouw eigen observaties en de gevonden do's en dont's. Gebruik jouw kennis van prompt-schrijven en zet alles in om de ULTIMATE A-TIER MIGRATION EN TEST PROMPT 2025 samen te stellen:20 dec 2025migration strategy best practices phased rollout 202510 results8 Data Migration Best Practices for Enterprise Teams in 2025 - DataTeams AIdatateams.aiKubernetes Migration Strategy and Best Practices | IBMibm.comKafka Migration Demystified: Choosing Between a “Big Bang” Cutover and a Phased Rolloutautomq.comCloud Migration Best Practices: 10 Essential Tips for 2025netsharx.comData Migration in 2025: Key Strategies & Best Practicesphygital-insights.comDynamics GP to Dynamics 365 BC: 7 Steps for a Smooth Migration - ERP Software Blogerpsoftwareblog.com10 Cloud Migration Best Practices for Success in 2025kraftbusiness.comTop Google Cloud Migration Strategies for 2025c-metric.comCloud adoption guide | Atlassianatlassian.comData Migration: Strategy, Best Practices & Tools - The Couchbase Blogcouchbase.comtesting strategy migration validation best practices 202510 resultsData Migration Testing: A Complete Guide to Ensuring Accuracy, Integrity, and Performancedatalark.comData Migration Validation Best Practices for 2025quinnox.comA Complete Guide to Data Migration Testing | BrowserStackbrowserstack.comData Migration Test Strategy: Create an Effective Test Plan — Data Migration Prodatamigrationpro.comHow to build a successful cloud migration testing strategydatafold.comData Migration Testing – Strategy, Types and Best Practiceswinwire.comData Migration Testing: Strategy, Test Plans, Tools and Best Practicesuniridge.coMigrate to Google Cloud: Best practices for validating a migration plan | Cloud Architecture Centergoogle.comSpeed Up Deployment with Smart Data Migration Testingforbytes.comData Migration Testing: What You Need to Knowk2view.comPerfect! Nu heb ik genoeg materiaal. Laat me de analyse en de ultieme prompt maken:Kritische Analyse Flow 3.5 Migration PromptDocument # 🔬 Kritische Analyse: Flow 3.5 Migration & Test Prompt

---

## 📊 **WAT IS GOED** ✅

### Sterke Fundamenten
1. **Duidelijke scope**: Geen architectuur, geen code, geen debugging
2. **Gefaseerde aanpak**: 4-fase structuur is industry standard
3. **Nu de ultieme prompt zelf:🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document # 🚀 ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025
## Enterprise-Grade | Evidence-Based | Risk-Managed

---

```xml
<system_configuration>
  <role>Senior Migration Strategy Architect & Test Engineering Lead</role>
  <name>Lyra (Migration ModeContinue20 dec 2025🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 2 #### T9: Compliance & Security Validation
**Purpose:** Ensure migration meets regulatory & security requirements

**Compliance Checks:** (if applicable)

1. **GDPR Compliance**
   - [ ] Data minimization: Only necessary data migrated
   - [ ] Consent2 / 2Continue20 dec 2025<function_results>OK</function_results>🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 3 **Internal:**
- Wiki page: Migration case study
- Brown bag session: Share learnings with broader team
- Runbook: Updated procedures

**External:**
- Blog post (if public company)
- Conference talk (if applicable)
- Open-source tools/scripts developePerfect! Ik heb nu een complete set geleverd. Laat me een samenvatting geven:

Een forensische breakdown met:

Een complete enterprise-grade prompt met:
15 output secties (vs 7 in origineel):

Kwantitatieve verbeteringen:

Nieuwe elementen:

Wil je dat ik:

Laat maar weten! 🚀1) Dat is een uitstekende toevoeging. Flow 3.5 vormt de brug tussen de abstracte blauwdruk en de rauwe code. Om deze strategist effectief te laten zijn, heeft hij niet alleen de "wat" nodig, maar vooral de "hoe we het breken en herstellen" context uit de volledige audit-geschiedenis.
Hier is de geaggregeerde input-set die je aan Flow 3.5 kunt voeden. Deze is opgebouwd uit de meest kritieke technische bevindingen die een migratie-impact hebben:
📑 Input voor Flow 3.5: De Migration & Test Strategist
1. De "Legacy" Baseline (Wat we achterlaten)
* Structuur: Een platte mappenstructuur met circulaire afhankelijkheden en "Shotgun Parsing" (data wordt overal ter plekke van string naar number omgezet).
* Identiteit: Data in arrays is gebonden aan de index. Dit maakt de state extreem fragiel tijdens sorteer- of verwijderacties.
* Integriteit: De UI fungeert als "reparateur" (useEffect-synchronisatie) in plaats van als passieve weergave.
2. Kritieke Migratie-Punten (High Risk)
A. De UUID-transformatie (Cluster 2)
* Risico: Bestaande gebruikersdata in  gebruikt nog array-indices.
* Opdracht: Ontwerp een migratie-script dat bij de eerste "hydration" unieke IDs (UUID) toekent aan bestaande huishoudleden en transacties zonder de koppelingen te verbreken.
B. Semantische ID-migratie (Cluster 4)
* Risico: Pagina-sleutels veranderen van C1, C4, C7 naar .
* Opdracht: Implementeer een "Alias Mapping" in de storage-service zodat oude state-bestanden correct landen in de nieuwe semantische structuur.
C. De "Noon" Datum-strategie (Cluster 1 & 3)
* Risico: Datums zijn nu opgeslagen als diverse string-formats of lokale tijden, wat leidt tot "Off-by-one" errors bij verjaardagen.
* Opdracht: Transformeer alle opgeslagen geboortedatums naar de  standaard ().
3. Test-Strategie Parameters (Boundary Testing)
Flow 3.5 moet test-scenario's schrijven voor de volgende grensgevallen:
* De Komma-Bug: Unit-tests voor de  met inputs: "1.250,50", "1250.50", "1250", en "ongeldig".
* De "Purge" Validatie: Integratietest waarbij het wijzigen van woningtype (Koop naar Huur) de "Dirty State" vlag triggert en na bevestiging de hypotheek-state wist.
* De 5-Volwassenen Grens: Een data-audit test die bevestigt dat bij 6 volwassenen de  vlag in de metadata verschijnt, maar niet in de UI-state of console logs.
* Hydration Failure: Een test die een corrupte JSON in de storage injecteert en bevestigt dat de app stopt (of een veilige fallback kiest) in plaats van de corrupte data te overschrijven met een lege state.
4. De "Bleeding Edge" Safety-Check (React 19 / RN 0.81)
* Opdracht: Gezien de vroege adoptie van deze stack, moet Flow 3.5 een "Regression Suite" definiëren die na elke grote architecturale wijziging (zoals de invoer van Path Aliases) controleert of de Fast Refresh en de Metro-bundler nog stabiel draaien.
🚦 Volgende stap voor Flow 3.5
Vraag de strategist om op basis van deze input een Gefaseerd Migratieplan op te stellen:
1. Fase 1: Infrastructuur & Test-steigers (Path Aliases & Jest setup).
2. Fase 2: Data-sanering (Parser & UUID-injectie).
3. Fase 3: Architecturale verschuiving (Navigator State Machine & Reducer Alignment).
Wil je dat ik deze set direct doorzet naar Flow 3.5, of wil je nog specifieke randvoorwaarden toevoegen aan de test-parameters?2)
Dit is een strategische zet. Flow 3.5 (de MIGRATION & TEST strategist) is de essentiële schakel die de theoretische architectuur van Lyra (Flow 2) en de kritische audit van ARIA (Flow 3) vertaalt naar een veilig executieplan voor de Navigator (Flow 4).
Om Flow 3.5 direct op stoothoogte te brengen, heb ik hieronder de integrale synthese van alle bevindingen uit de eerdere flows geclusterd.
📋 Input-Dossier voor Flow 3.5: "Project Standaard 2025"
🏗️ Cluster 0 & 5: De Architecturale Schil & Navigatie
* 
Bevinding: De applicatie lijdt aan "Boolean Soup" in de navigatie (9+ losse booleans voor schermen)1111.⚙️ Cluster 2: State & Persistence Layer
* 
Kritiek Risico: Identiteitscrisis door het gebruik van  voor financiële records, wat leidt tot ID-collisies777777777.🧮 Cluster 1 (Finance): Rekenlogica & Ingestie
* 
Gevaar: De "Komma-bug" (1.250,50 wordt 1.25) door naïeve replace logica101010101010101010.🧩 Cluster 3 & 4: UI Atoms & Wizard Logic
* 
Schoonmaak:  moet worden ontdaan van alle domeinkennis; het mag alleen atomen aansturen13131313.Is dit voldoende input voor ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025 om zijn werk te kunnen doen?Show more20 dec 2025
Laat me de input grondig evalueren tegen de requirements van de Ultimate A-Tier Migration & Test Strategy Prompt:

De Ultimate Migration Prompt heeft strikte input requirements volgens . Laten we checken wat er mist:

xml
Wat ontbreekt:

Waarom kritiek: Migration time estimates, rollback strategy, testing scope

xml
Wat ontbreekt:

Waarom kritiek: Capacity planning, performance validation

xml
Wat aanwezig is:

Wat ontbreekt:

Waarom kritiek: Phase sequencing, rollback impact

xml
Volledig afwezig maar ESSENTIEEL:

Waarom kritiek: Bepaalt hele migration strategy (phased vs big bang)

xml
Waarom kritiek: Het hele "Post-Migration Validation" framework hangt hierop!

xml
Wat ontbreekt: Error budget, acceptable failure rate

✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument # ✅ Complete Input Template voor Flow 3.5 Migration Strategy
## Project: Standaard 2025 - AsyncStorage → DDD Structure Migration

---

## 📦 **APPROVED ADVICE** (from Flow 2 + 3)

### Migration Item 1: UUID Transformation (Cluster 2)
**Current State:Continue20 dec 2025✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument ∙ Version 2 ### HIGH PRIORITY (Strongly recommended)
- [ ] **Monitoring:** Sentry/Crashlytics setup? Analytics?
- [ ] **Migration Budget:** Error budget (X% failures acceptable?)
- [ ] **Rollback Strategy:** Force update mechanism? Or tolerate old versions?
- [ Perfect! Ik heb nu een complete analyse gemaakt. Laat me samenvatten:

WAT ER GOED IS: ✅

WAT ER ONTBREEKT (Kritiek): ❌

Impact: Flow 3.5 kan een generieke strategie maken, maar niet een production-ready, date-committed, risk-quantified plan.

Gezien:

Fase 1: Quick Generic Strategy (NU)

Fase 2: Complete Strategy (na data gathering)

Optie A: Ik genereer nu een generic strategy met placeholders

Optie B: Ik help je eerst missing info verzamelen

Optie C: Hybrid: Generic strategy NU + checklist voor later

Wat kies jij? A, B, of C? 🎯Show more22 dec 2025
Je hebt alles correct geconfigureerd, maar er zijn een paar veelvoorkomende oorzaken waarom ze nog niet werken:

Metro cache is extreem hardnekkig en pikt nieuwe Babel config niet automatisch op.
Fix:
bash
Test daarna:
typescript

| Je hebt correct reanimated als laatste | maar soms moet eerste zijn. |
| --- | --- |
| Dit is al correct bij jou | maar goed om te verifiëren. |

Check of de plugin er is:
bash
Als niet gevonden:
bash

Je gebruikt  (relative), soms werkt absolute path beter:
Probeer:
javascript

Je  is correct, maar soms moet je ook  toevoegen voor niet-TS files.
Voeg toe:  (naast tsconfig.json):
json

Je gebruikt , wat suggereert Expo. Soms heeft Expo een eigen caching mechanisme.
Als je Expo gebruikt:
bash

Zorg dat je imports correct zijn:
✅ Correct:
typescript
❌ Fout:
typescript

Voer deze stappen in volgorde uit:
bash
9. VSCode restart:

10. Test import:
typescript
Kijk naar errors in:

→ Babel niet correct of Metro cache issue
→ Fix: Reset cache (stap 7 hierboven)

→ TypeScript server niet bijgewerkt
→ Fix: Restart TS Server (CMD+Shift+P → "Restart TS Server")

→ Metro cache corrupt
→ Fix: 

→ Stale import cache in specific file
→ Fix: Delete .js.map files, restart bundler

Probeer deze 3 snelle fixes eerst:
bash
Als dat niet werkt, volg de volledige checklist hierboven.

Test met deze code in App.tsx:
typescript
Als je errors ziet:

Maak een test script om te verifiëren dat aliassen werken:
:
javascript
Run:
bash
Dit vertelt je of de directories bestaan waar de aliases naar wijzen.

| Laat me weten welke error je krijgt, dan help ik verder! 🚀ik krijg deze melding [node scripts/sync-aliases.js ❌ Failed to parse tsconfig.json (JSONC + trailing commas)] bij uitvoeren van dit script. Analyseer script, zoek alle tips en best practices en pas deze toe op het script | analyseer het door jouw geschreven script nogmaals en verbeter het waar mogelijk. #!/usr/bin/env node |
| --- | --- |
| const fs = require('fs') |  |
| const path = require('path') |  |
| const ROOT = process.cwd() |  |
| const TSCONFIG = path.join(ROOT, 'tsconfig.json') |  |
| const BABEL = path.join(ROOT, 'babel.config.js') |  |
| const JEST = path.join(ROOT, 'jest.config.js') |  |
| const DRY_RUN = process.argv.includes('--dry-run') |  |
| ] |  |
| console.error❌ ${msg}) |  |
| process.exit(1) |  |
| .replace(/,\s*([}\]])/g, '$1') |  |
| console.logℹ️ ${msg}) |  |
| console.log✅ ${msg}) |  |
| if (!fs.existsSync(TSCONFIG)) die('tsconfig.json not found') |  |
| let ts |  |
| const raw = fs.readFileSync(TSCONFIG, 'utf8') |  |
| ts = JSON.parse(sanitizeJson(raw)) |  |
| die('Failed to parse tsconfig.json (JSONC + trailing commas)') |  |
| const paths = ts.compilerOptions?.paths |  |
| if (!paths) die('No compilerOptions.paths found') |  |
| const name = key.replace(/\/\*$/, '') |  |
| const target = value.replace(/\/\*$/, '') |  |
| die) |  |
| return { name, target } |  |
| }) |  |
| info) |  |
| aliases.forEach(a => info)) |  |
| if (!fs.existsSync(BABEL)) die('babel.config.js not found') |  |
| let babelSrc = fs.readFileSync(BABEL, 'utf8') |  |
| info('babel.config.js: alias block NOT found') |  |
| ok('babel.config.js: alias block found') |  |
| const babelAliasBlock = '${a.name}': './${a.target}', |  |
| ) |  |
| fs.writeFileSync(BABEL, babelSrc) |  |
| if (!fs.existsSync(JEST)) die('jest.config.js not found') |  |
| let jestSrc = fs.readFileSync(JEST, 'utf8') |  |
| info('jest.config.js: moduleNameMapper NOT found') |  |
| ok('jest.config.js: moduleNameMapper found') |  |
| const jestMapperBlock = '^${a.name.replace('@', '\\@')}/(.*)$': '<rootDir>/${a.target}/$1', |  |
| ) |  |
| fs.writeFileSync(JEST, jestSrc) |  |
| ok('Dry-run complete (no files modified)') |  |
| ok('Aliases synced from tsconfig.json') |  |

javascript

javascript

javascript

javascript

sync-aliases.js (Fixed & Enhanced)Code #!/usr/bin/env node
/**
 * Sync path aliases from tsconfig.json → babel.config.js + jest.config.js
 * 
 * Features:
 * - JSONC support (comments, trailing commas)
 * - Dry-run mode (--dry-run)
 * - Backup creation (--backup)
 * - Validation (reservedPerfect! Nu nog een vergelijkingstabel en best practices document:Script Verbeteringen & Best PracticesDocument # 📊 Script Verbeteringen & Best Practices

---

## 🔍 **Wat Was Er Mis**

### Bug 1: Template Literal Syntax Errors
```javascript
// ❌ ORIGINEEL (4 locaties!)
console.error`❌ ${msg}`);
console.log`ℹ️  ${msg}`);
die`Alias "${name}" is reserved`);
infPerfect! Nog één ding - een quick reference card voor dagelijks gebruik:Path Aliases Troubleshooting CheatsheetDocument # 🚨 Path Aliases Troubleshooting Cheatsheet

---

## ⚡ **Quick Fixes (Try These First)**

```bash
# 1. Nuclear cache clear (solves 90% of issues)
npx react-native start --reset-cache

# 2. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeS
Ik heb je complete set geleverd:

Direct doen:
bash
Aliases zouden nu moeten werken! 🎉
Heb je nog errors? Laat me de exacte error message zien en ik help verder debuggen! 🔍Claude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Mappenstructuur aanmakenShare

---

**Claude:**

Share

---

**Claude:**

| Situatie | Actie |
| --- | --- |
| Complexe state | Discriminated Union |
| Herhaalde logica (3x) | Extraheer functie/hook |
| Onduidelijke naam | Hernoem naar doel |
| Lange functie (>20) | Split op (SRP) |
| API data | Parse met Zod |
| Legacy code | Boy Scout + Mikado |
| Test schrijven | Test gedrag, niet impl |
| Performance issue | Meet eerst, dan optimize |

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

```
utils/finance.ts → domain/income/finance.ts
```

```
utils/finance.ts → domain/income/finance.ts
```

```
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```ts
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

```
daysUntilDeadline
```

```
shouldRender
```

```
tempVariable
```

```
type UserId = string
```

```
({ title, onClick })
```

```
props.title
```

```
useUserAuth
```

```html
useState<User | null>(null)
```

```
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```ts
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```
type Status = 'open' | 'closed'
```

```html
ReturnType<typeof fn>
```

```json
{ success: boolean, data?: T, error?: string }
```

```yaml
strict: true
```

```
/features/auth/*
```

```
/components/*
```

```
noImplicitAny
```

```
strictNullChecks
```

```
@components/*
```

```
../../components
```

```
console.log
```

```
const MAX_RETRIES = 3
```

```
npx tsc --noEmit
```

```html
<input_delimiters>
```

```
AsyncStorage
```

```
household, members, income
```

```
ISO-8601 UTC-Noon
```

```
YYYY-MM-DDT12:00:00Z
```

```
NumericParser
```

```
isSpecialStatus
```

```
INITIALIZING | READY | ERROR
```

```
useAppOrchestration
```

```
isSpecialStatus
```

```
Math.random()
```

```
AsyncStorage
```

```
NumericParser
```

```
FormField.tsx
```

```
formReducer
```

```
NumericParser
```

```html
<input_structure>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Altijd als laatste!
    ],
  };
};

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    /* Phoenix Aliassen */
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
     }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

Waarom werken de aliassen niet??
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Altijd als laatste!
    ],
  };
};

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    /* Phoenix Aliassen */
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
     }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

Waarom werken de aliassen niet??
```

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```ts
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```
module-resolver
```

```
module-resolver
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```
babel-plugin-module-resolver
```

```
npm list babel-plugin-module-resolver
```

```bash
npm list babel-plugin-module-resolver
```

```
npm install --save-dev babel-plugin-module-resolver
```

```bash
npm install --save-dev babel-plugin-module-resolver
```

```
./src/domain
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```
tsconfig.json
```

```
jsconfig.json
```

```
jsconfig.json
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```
babel-preset-expo
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```ts
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```ts
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```ts
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```
npx react-native start --reset-cache
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```ts
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```
verify-aliases.js
```

```
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```js
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```
node verify-aliases.js
```

```bash
node verify-aliases.js
```

```
Alias "${name}" is reserved
```

```
Found ${aliases.length} aliases in tsconfig.json
```

```
${a.name} → ${a.target}
```

```yaml
alias: {
${aliases.map(a =>
```

```
).join('\n')}
            },
```

```yaml
moduleNameMapper: {
${aliases.map(a =>
```

```
).join('\n')}
  },
```

```
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```js
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```js
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```js
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```js
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```
sync-aliases.js
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

- Testen makkelijker maakt
- AI-begeleide refactors veiliger maakt
- Future features isoleerbaar houdt

- Zijn netter, maar niet urgent
- Kosten meer tijd zonder directe winst
- Kunnen gradueel tijdens feature-werk

- De minimale refactor (fase 1) als script uitschrijf?
- Een ADR maak voor "Waarom wizard een subsystem is"?
- Een import-regel docje maak ("wie mag wie importeren")?

| - ✅ Boolean prefixen: isLoading | hasAccess |  |
| --- | --- | --- |
| - ✅ Geen ruis: vermijd dataObject | userInfo |  |

- ✅ Single Responsibility: één functie = één taak
- ✅ Max 20 regels (vuistregel voor leesbaarheid)
- ✅ Max 2 argumenten (meer? → gebruik object)
- ✅ Guard Clauses: handel edge cases bovenaan af (return early)
- ✅ Geen side effects: voorspelbaar gedrag
- ✅ Pure functions waar mogelijk: zelfde input = zelfde output

| Key | Value |
| --- | --- |
| ✅ Kleine componenten | max 100-150 regels JSX |
| ✅ Destructuring props | ipv |
| ✅ Fragmenten | gebruik <>...</> ipv onnodige divs |
| ✅ Composition over Inheritance | gebruik children prop |
| ✅ Logica uit UI | verplaats naar Custom Hooks () |
| ✅ Feature | based structure: alles van één feature in één map |

- ✅ Expliciet typen:
- ✅ useCallback/useMemo: alleen bij échte performance issues
- ✅ Custom Hooks: extraheer herbruikbare logica
- ✅ React.FC: vermijd (tenzij je children expliciet nodig hebt)

- ✅ NOOIT any: gebruik unknown als je type niet weet
- ✅ Interfaces voor props: beter uitbreidbaar dan type
- ✅ Discriminated Unions voor state:

- ✅ Enums/Unions voor constanten:
- ✅ readonly voor immutable data
- ✅ Utility Types: Omit, Pick,

- ✅ Generics met constraints: flexibel maar type-safe
- ✅ Parse, don't validate: gebruik Zod aan systeemgrenzen
- ✅ Result types:
- ✅ Strict tsconfig: schakel  in

| Key | Value |
| --- | --- |
| ✅ Shallow codebase | max 3-4 niveaus diep |
| ✅ Feature | based folders: ipv |
| ✅ Domain layer | business logica apart van UI |
| ✅ Just Use Functions | vermijd onnodige classes |
| ✅ DRY (Don't Repeat Yourself) | Regel van Drie |

1x = schrijf het
2x = dupliceer (acceptabel)
3x = refactor naar herbruikbare functie
- 1x = schrijf het
- 2x = dupliceer (acceptabel)
- 3x = refactor naar herbruikbare functie

- 1x = schrijf het
- 2x = dupliceer (acceptabel)
- 3x = refactor naar herbruikbare functie

| Key | Value |
| --- | --- |
| ✅ Strangler Fig | vervang legacy code geleidelijk |
| ✅ Façade pattern | wrap oude code, route verkeer om |
| ✅ Repository pattern | scheid data-access van business logica |
| ✅ Discriminated Unions | voorkom onmogelijke states |

| - ✅ Test gedrag | niet implementatie |
| --- | --- |
| - ✅ Gebruik Testing Library: getByRole | getByText |

| - ✅ ESLint strict mode: waarschuw bij any | complexiteit |
| --- | --- |
| - ✅ TypeScript strict mode: |  |

- ✅ Boy Scout Rule: laat code schoner achter dan je het vond
- ✅ Mikado Method:

Stel doel → probeer → visualiseer blokkades
Revert → los sub-doelen op → werk terug naar doel
- Stel doel → probeer → visualiseer blokkades
- Revert → los sub-doelen op → werk terug naar doel
- ✅ Prioriteer op impact:

High-change areas
Bug-prone modules
Onboarding blockers
- High-change areas
- Bug-prone modules
- Onboarding blockers
- ✅ Incremental refactoring: kleine stappen, blijf deploybaar

- Stel doel → probeer → visualiseer blokkades
- Revert → los sub-doelen op → werk terug naar doel

- High-change areas
- Bug-prone modules
- Onboarding blockers

| Key | Value |
| --- | --- |
| ✅ Custom Path Aliases | ipv |
| ✅ React Compiler | bereid je voor (minder handmatige memo's) |
| ✅ Vitest | snellere test runner dan Jest |
| ✅ Biome | all-in-one linter/formatter (alternatief voor ESLint+Prettier) |

| Key | Value |
| --- | --- |
| ✅ Don't outsource thinking | AI voor boilerplate, jij voor architectuur |
| ✅ Vermijd "vibe coding" | begrijp wat AI genereert |
| ✅ Validate AI output | check logica en edge cases |
| ✅ Use AI for refactoring suggestions | maar neem bewuste beslissingen |

| - ✅ Structured logging: niet | maar structured data |
| --- | --- |
| - ✅ Distributed tracing: in microservices (Jaeger | OpenTelemetry) |
| - ✅ Performance monitoring: Lighthouse | React DevTools Profiler |

| - ✅ Commentaar op "waarom" | niet "wat" |
| --- | --- |
| - ✅ Code is voor mensen: machine compileert alles | mensen moeten het begrijpen |

| Key | Value |
| --- | --- |
| ✅ Vermijd deep nesting | max 2-3 niveaus |
| ✅ Ternary overkill voorkomen | complexe conditie? → if statement |
| ✅ Failing gracefully | voorspelbaar foutgedrag |
| ✅ Consistent naming | zelfde concepten, zelfde namen |

| Key | Value |
| --- | --- |
| ✅ TypeScript default sinds 0.71 | gebruik het |
| ✅ Babel voor transforms | niet tsc voor compilatie |
| ✅ Type | check met CLI: |
| ✅ @react | native/typescript-config: gebruik officiële config |

| Key | Value |
| --- | --- |
| ✅ FlatList voor lange lijsten | niet .map() |
| ✅ Memoize zware componenten | React.memo met zorg |
| ✅ Hermes engine | snellere JS-uitvoering |
| ✅ Native modules | schrijf performance-kritieke code in native |

| Key | Value |
| --- | --- |
| ⬜ Naamgeving check | zijn alle namen self-explanatory? |
| ⬜ Functie lengte | < 20 regels per functie? |
| ⬜ TypeScript strict | geen any, expliciete types? |
| ⬜ Tests aanwezig | gedekt met betekenisvolle tests? |
| ⬜ Boy Scout Rule | code schoner achtergelaten? |
| ⬜ Discriminated Unions | onmogelijke states voorkomen? |
| ⬜ Import paths | relatieve paths < 3 niveaus of gebruik aliases? |
| ⬜ Side effects | functies voorspelbaar en pure? |
| ⬜ Commentaar nodig? | zo ja, leg "waarom" uit, niet "wat" |
| ⬜ Leave No Questions | zou een nieuwe dev dit snappen? |

| - Refactoring is geen taak | het is een workflow (Martin Fowler) |
| --- | --- |
| - Parse | don't validate: dwing types af aan grenzen |

- Wetenschappelijke debugging methodologieën (Five Whys, Binary Search, etc.)
- React Native specifieke tools en technieken
- 7 verschillende debugging strategieën
- Common bug types met aanpak per type
- Best practices en anti-patterns
- Cognitive strategies en bias awareness
- Complete debugging workflow (8 stappen)

- Sterke en zwakke punten van elk
- Concrete verbeterpunten per prompt (5 voor elk)
- Nieuwe elementen die in beide ontbraken
- Ideale hybride kenmerken tabel
- 14 missende elementen geïdentificeerd

- 9 output secties (vs 4 in Debug1, 7 in Debug2)
- Five Whys verplicht voor root cause
- React Native specifieke diagnostics
- TypeScript error decoder
- Emergency protocols (production down, data loss, security)
- Advanced scenarios (race conditions, memory leaks, performance)
- Absolute constraints met IRON LAW regels
- Quality checklist voor self-verification
- Confidence % systeem (geen vage "hoog/laag")

| Key | Value |
| --- | --- |
| Structured Thinking | Investigation log + Five Whys + Hypothesis ranking |
| External Research | Verplichte verificatie met citatie regels |
| React Native Focus | Platform-specifieke diagnostics en tools |
| No Code Policy | Absolute verbod op code fixes (conceptueel only) |
| Preventie Focus | Korte + lange termijn vaccinatie strategie |
| Emergency Ready | Protocols voor production incidents |
| Escalation Criteria | Wanneer stoppen en hulp vragen |

- Een voorbeeld debugging sessie doorloop met de nieuwe prompt?
- De prompt further specialize voor jouw specifieke React Native project structuur?
- Een quick reference card maken voor dagelijks gebruik?

- 7 kritieke gaps geïdentificeerd (pre-migration assessment, testing strategy, data quality, etc.)
- 4 anti-patterns blootgelegd (big bang risk, undefined success criteria, manual error handling)
- 8 verbeterpunten uit research (data migration testing pyramid, phased percentages, automated balance)
- 8 DO's en 8 DON'Ts uit praktijk (Netflix, Google, Adobe case studies)
- Quantified industry benchmarks (83% big bang failure rate, $13M data quality cost)

| - Pre-migration assessment (profiling | baselines | dependency mapping) |
| --- | --- | --- |
| - Compliance & security (GDPR | HIPAA | SOC2) |

- Error thresholds: < 0.1% (was: "toetsbaar")
- Performance: < 5% degradation (was: vague "acceptable")
- Rollback time: < 2 hours (was: undefined)
- Coexistence: 30-90 days (was: not specified)
- 10+ industry benchmarks included

- ✅ Pre-migration data profiling (ROT analysis)
- ✅ POC phase (90% vs 17% success rate)
- ✅ Automated rollback triggers
- ✅ Comparison testing protocol (row/column/hash)
- ✅ Data quality gates
- ✅ Performance baseline establishment
- ✅ Rollback drills (test the safety net!)
- ✅ Post-migration coexistence period
- ✅ Compliance audit trails
- ✅ Quantified stop criteria

- Conceptually sound maar operationally vague
- "Toetsbaar" zonder getallen
- Geen pre-assessment
- 4 fases
- Generieke test strategy

| - Quantified (< 0.1% | < 5% | < 2h) |
| --- | --- | --- |
| - Automated (rollback | validation | monitoring) |

| Key | Value |
| --- | --- |
| Nooit blind migreren | Data profiling is non-negotiable |
| POC eerst | 90% success rate vs 17% big bang |
| Quantify everything | "< 0.1%" beats "low" |
| Test the rollback | Safety net moet werken |
| Coexistence period | 30-90 days is industry standard |
| Automate validation | 50% fewer errors |
| Compliance upfront | €1.2B in GDPR fines (2025) |

- Een voorbeeld migration strategy genereer met deze prompt?
- Quick reference cards maken voor dagelijks gebruik?
- De prompt verder customize voor jouw specifieke React Native project?

| - Kritiek Risico: "Taal-Spaghetti" (mix van NL/EN keys) en "Primitive Obsession" (datums als strings | leeftijd als numbers)333333333. |
| --- | --- |
| - Oplossing: Overstap naar een Ubiquitous Language (Engelse keys | Nederlandse labels)4444. |

| Key | Value |
| --- | --- |
| Mandaat | Migratie naar UUIDs (v4) voor alle leden en transacties8888. |
| Storage | Gate: Implementatie van het Repository Pattern om te isoleren. Gebruik van Zod-schema's om corrupte data bij de I/O-grens te blokkeren9999. |

| Key | Value |
| --- | --- |
| Mandaat | Introductie van een robuuste en het verbieden van any in financiële objecten (vervangen door unknown of Discriminated Unions)111111111111111111. |
| Principe | "Parse, don't validate." Data wordt bij binnenkomst (Input/CSV) direct getransformeerd naar valide types12121212. |

- Alignment: Verwijder de "A2 FIX" uit de UI-controllers en verplaats de synchronisatie-logica naar de .
- Opschoning: Implementeer "State Purging" om "Orphan Data" (bijv. oude huurdata bij een koopwoning) automatisch te wissen.
🎯 De Specifieke Opdracht voor Flow 3.5
Flow 3.5 moet op basis van deze input de volgende drie producten leveren voor de Navigator:
- De Migratie-Matrix: Een stap-voor-stap plan om de huidige "platte" data (met index-IDs en NL-keys) te migreren naar de nieuwe DDD-structuur (met UUIDs en EN-keys) zonder dataverlies voor de gebruiker.
- Het Test-Harnas: Een Jest-testplan dat specifiek de "edge cases" dekt:
De berekening van de "Speciale Status" (>5 volwassenen).De  met diverse Europese notaties.Het "Orphan Data" purge-mechanisme.
- De berekening van de "Speciale Status" (>5 volwassenen).
- De  met diverse Europese notaties.
- Het "Orphan Data" purge-mechanisme.
- De Rollback-Strategie: Wat doen we als de Zod-validatie de bestaande (vervuilde) gebruikersdata blokkeert bij de eerste start na de update?
Zal ik deze input direct doorzetten naar Flow 3.5 om het Migratie- & Testplan op te stellen?

- De berekening van de "Speciale Status" (>5 volwassenen).
- De  met diverse Europese notaties.
- Het "Orphan Data" purge-mechanisme.

- Duidelijke Legacy Baseline ✅

Platte structuur met circulaire dependencies
Index-based identiteit (fragiel)
UI als "reparateur" (anti-pattern)
- Platte structuur met circulaire dependencies
- Index-based identiteit (fragiel)
- UI als "reparateur" (anti-pattern)
- High-Risk Migration Points Geïdentificeerd ✅

UUID transformatie (breaking change)
Semantische ID migratie (storage compatibility)
Datum-strategie wijziging (data corruption risk)
- UUID transformatie (breaking change)
- Semantische ID migratie (storage compatibility)
- Datum-strategie wijziging (data corruption risk)
- Concrete Test Scenarios ✅

Komma-bug boundary testing
Purge validation
5-volwassenen grens
Hydration failure
- Komma-bug boundary testing
- Purge validation
- 5-volwassenen grens
- Hydration failure
- Technology Stack Context ✅

React 19 / RN 0.81 (bleeding edge risk)
Fast Refresh stability concerns
- React 19 / RN 0.81 (bleeding edge risk)
- Fast Refresh stability concerns

- Platte structuur met circulaire dependencies
- Index-based identiteit (fragiel)
- UI als "reparateur" (anti-pattern)

- UUID transformatie (breaking change)
- Semantische ID migratie (storage compatibility)
- Datum-strategie wijziging (data corruption risk)

- Komma-bug boundary testing
- Purge validation
- 5-volwassenen grens
- Hydration failure

- React 19 / RN 0.81 (bleeding edge risk)
- Fast Refresh stability concerns

| - Aantal records (leden | transacties)? |
| --- | --- |
| - Current app performance metrics (startup time | etc.)? |

- Nieuwe storage structure (Zod schemas)?
- Performance requirements (startup time < X sec)?
- Size limits per user?

- Circulaire dependencies genoemd
- UI ↔ State koppeling

- Volledige dependency diagram (welke components precies?)
- External dependencies (AsyncStorage, Expo libraries)
- Critical path analysis

| Key | Value |
| --- | --- |
| Downtime tolerance | App update (minutes) of live migration (zero)? |
| Timeline | Wanneer moet dit live? Sprint planning? |
| Team | Hoeveel developers beschikbaar? Full-time of part-time? |
| Compliance | GDPR data migration rules? User consent needed? |
| Rollback window | Kan oude app versie blijven draaien? |

- Excellent migration scope definition (6 concrete items)
- Clear risk identification (UUID, dates, orphan data)
- Specific test scenarios (komma-bug, purge, special status)
- Good technical context (React 19, RN 0.76)

| - Team capacity (hoeveel developers | hoe lang?) |
| --- | --- |
| - Existing tests (huidige coverage | CI/CD?) |

- Financial domain (zero tolerance for data corruption)
- Bleeding edge stack (React 19 = risk)
- First migration (team learning curve)

- Flow 3.5 genereert strategie met placeholders
- Gebruik voor planning & stakeholder buy-in
- Identificeert wat je nog moet weten
- Timeline: 1-2 dagen

- Verzamel missing info (4-5 dagen)
- Flow 3.5 genereert production-ready plan
- Kwantitatieve thresholds, concrete dates
- Timeline: Week 2

| Key | Value |
| --- | --- |
| Pro | Direct resultaat, ziet wat er komt |
| Con | Niet executeerbaar zonder extra info |

| Key | Value |
| --- | --- |
| Pro | Production-ready output |
| Con | 4-5 dagen prep work |

| Key | Value |
| --- | --- |
| Pro | Beste van beide werelden |
| Con | Extra ronde met Flow 3.5 later nodig |

- CMD/CTRL + Shift + P
- "TypeScript: Restart TS Server"

- Metro bundler terminal
- VSCode Problems tab (CMD/CTRL + Shift + M)

- Kopieer de exacte error message
- Check welke terminal (Metro bundler of VSCode)
- Vertel me de error, dan help ik verder debuggen

- Geen check of alias block al bestaat in babel
- Geen backup van originele files
- Geen validatie of target directories bestaan
- Geen check voor duplicate aliases

- ✅ Alle 4 syntax errors gefixed
- ✅ Comprehensive validation toegevoegd
- ✅ Backup mechanisme
- ✅ Verbose + dry-run modes
- ✅ Help documentation
- ✅ Production-ready

- Volledige bug analyse
- Voor/na vergelijking
- Best practices toegepast
- Testing checklist

- Quick fixes voor 90% van issues
- Diagnosis by symptom
- Complete reset procedure
- Prevention tips

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dacm.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dntietz.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwearebrain.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dresearchgate.net&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dappdeskservices.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddemandtalk.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dguvi.in&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlambdatest.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwikipedia.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dtulip.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dasq.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlean.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbusinessmap.io&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dindeed.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Disixsigma.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Deworkorders.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcms.gov&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlearningloop.io&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatateams.ai&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dibm.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dautomq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dnetsharx.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dphygital-insights.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Derpsoftwareblog.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dkraftbusiness.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dc-metric.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Datlassian.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcouchbase.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatalark.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dquinnox.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbrowserstack.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatamigrationpro.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatafold.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwinwire.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Duniridge.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgoogle.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dforbytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dk2view.com&w=32&q=75)

# 🎯 Review van het advies

## TL;DR: JA, het advies klopt — met 2 nuances

## ✅ Wat absoluut klopt

### 1. De diagnose is accuraat

### 2. De voorgestelde structuur is pragmatisch

### 3. De mappings zijn praktisch uitvoerbaar

## ⚠️ Wat je moet nuanceren

### Nuance 1: utils/ vs domain/

## 📋 Wat ik zou doen (actieplan)

# 🎯 Complete Clean Code Checklist 2025

## React + TypeScript + React Native

## 📋 BASIS PRINCIPES

### Naamgeving

### Functies

## ⚛️ REACT BEST PRACTICES

### Component Structuur

### Hooks

## 🔷 TYPESCRIPT ESSENTIALS

### Type Safety

### Geavanceerd

## 🏗️ ARCHITECTUUR & STRUCTUUR

### Code Organisatie

### Patterns

## 🧪 TESTING & KWALITEIT

### Test Strategie

### Code Quality

## 📦 REFACTORING LEGACY CODE

### Strategieën

## 🚀 2025-SPECIFIC TIPS

### Modern Tooling

### AI-Assisted Development

### Observability

## 💡 COGNITIEVE BELASTING REDUCEREN

### Leesbaarheid

### Mentale Energie

## 🔧 REACT NATIVE SPECIFIEK

### Setup

### Performance

## ✅ DAILY CHECKLIST

## 🎯 EXPERT MINDSET

## 📚 QUICK REFERENCE

### debug2.txt

### Debug1.txt

## 📦 WAT JE ONTVANGEN HEBT

### 1️⃣ Complete Debugging Adviezenlijst 2025

### 2️⃣ Vergelijking & Verbeterpunten

### 3️⃣ ULTIMATE A-TIER DEBUG PROMPT 2025 🔥

## 🎯 KERNVERNIEUWINGEN IN ULTIMATE PROMPT

## 💡 HOE TE GEBRUIKEN

## 🎯 WAT JE ONTVANGEN HEBT

### 1️⃣ Kritische Analyse van Flow 3.5

### 2️⃣ ULTIMATE A-TIER MIGRATION PROMPT 2025 🔥

## 💡 KERNVERSCHILLEN

### Original Flow 3.5:

### Ultimate A-Tier:

## 🎓 BELANGRIJKSTE LESSEN

# 🎯 Analyse van Input voor Ultimate Migration Prompt

## ✅ WAT ER GOED IS

### Sterke Punten in de Input:

## ⚠️ WAT ONTBREEKT (Kritiek voor Migration Prompt)

### 1. Source System Details ❌

### 2. Target System Specs ❌

### 3. Dependency Graph ⚠️ (Partieel aanwezig)

### 4. Constraints ❌ (Meest kritieke gap!)

### 5. Baseline Metrics ❌

### 6. Existing Test Infrastructure ❌

## 📋 COMPLETE INPUT TEMPLATE (Wat Flow 3.5 ECHT nodig heeft)

## 🎯 ANTWOORD OP JE VRAAG

### Korte antwoord: JA, maar met significante gaps ⚠️

### Lange antwoord:

## 💡 MIJN ADVIES

### → Recommended: 2-fase aanpak

## 🚀 WAT WIL JE?

# 🔍 Diagnose: Path Aliases Werken Niet

## 🚨 Meest Waarschijnlijke Oorzaken

### 1. Metro Bundler Cache (90% van de gevallen!)

### 3.  Plugin Positie

### 4.  Niet Geïnstalleerd?

### 5. Relative Paths in Alias Definition

### 6. TypeScript vs Runtime Mismatch

### 7. Expo vs React Native CLI Conflict

### 8. Import Syntax Check

## 🔧 Volledige Debug Checklist

## 🐛 Specifieke Error Messages

### Error: "Cannot find module '@domain/...'"

### Error: Red squiggly in VSCode but app runs fine

### Error: "Module does not exist in the module map"

### Error: Works in one file, not another

## 🎯 Snelle Win Checklist

## 📊 Verificatie: Werken Ze Nu?

## 💡 Pro Tip: Verify Configuration

# 🔍 Analyse & Verbeterd Script

## 🐛 Gevonden Bugs

### 1. Template Literal Syntax Errors ❌

### 2. JSON Parsing Error Handling Te Breed

### 3. Regex Replace Te Greedy

### 4. Geen Validatie van Array Destructuring

### 5. Ontbrekende Edge Case Handling

## ✅ Verbeterd Script (Production-Ready)

## 🎯 Samenvatting

### 1️⃣ Gefixed Script ()

### 2️⃣ Verbeteringen Document

### 3️⃣ Troubleshooting Cheatsheet

## 🚀 Volgende Stappen

> "Code is een verhaal dat je vertelt aan je toekomstige zelf en je teamgenoten. Maak het een goed verhaal."

> "Is dit voldoende input voor ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025?"

Perfect — **dit is precies genoeg om je repo “te lezen”** 👍
Ik ga nu:

1. **je huidige structuur duiden** (wat is het nu echt?)
2. **de knelpunten benoemen** (waar wringt het al)
3. **een concrete doel-structuur voorstellen**
4. **een expliciete mapping: huidig → nieuw**
   (zonder onnodige pastedHuidige mappenstructuur:
src
├── components
│   ├── ChipButton.tsx
│   ├── ConditionalField.tsx
│   ├── DateField.tsx
│   ├── FormField.tsx
│   ├── InputCounter.tsx
│   └── ToggleSwitch.tsx
├── config
│   └── features.ts
├── context
│   ├── FormContext.tsx
│   ├── FormContext.tsx.bak
│   └── ThemeContext.tsx
├── hooks
│   └── useDobInput.ts
├── navigation
│   └── Navigator.tsx
├── organisms
│   ├── ExpenseRepeater.tsx
│   ├── HouseholdMemberRepeater.tsx
│   ├── HouseholdMemberRepeater.tsx.bak
│   └── IncomeRepeater.tsx
├── screens
│   ├── CSV
│   │   └── CsvUploadScreen.tsx
│   ├── Daily
│   │   └── UndoScreen.tsx
│   ├── DailyInput
│   │   └── DailyInputScreen.tsx
│   ├── Dashboard
│   │   └── DashboardScreen.tsx
│   ├── LandingScreen.tsx
│   ├── Options
│   │   └── OptionsScreen.tsx
│   ├── Reset
│   │   └── ResetScreen.tsx
│   ├── Settings
│   │   └── SettingsScreen.tsx
│   └── Wizard
│       ├── pages
│       │   ├── C10.config.ts
│       │   ├── C1.config.ts
│       │   ├── C4.config.ts
│       │   └── C7.config.ts
│       ├── WizardController.tsx
│       ├── WizardController.tsx.bak
│       └── WizardPage.tsx
├── services
│   ├── csvService.ts
│   ├── householdAlign.ts
│   ├── storage.ts
│   └── transactionService.ts
├── styles
│   ├── Colors.ts
│   └── useAppStyles.ts
├── types
│   ├── expenses.ts
│   ├── form.ts
│   ├── household.ts
│   ├── income.ts
│   └── transaction.ts
└── utils
    ├── conditions.ts
    ├── date.ts
    ├── finance.ts
    ├── numbers.ts
    ├── strings.ts
    └── validation.ts
ADVIES :
KLOPT HET ADVIES?Show more20 dec 2025

Het advies is solide en praktisch. De analist heeft je repo goed begrepen en stelt een evolutionaire refactor voor die past bij jouw situatie.
Maar laat me specifiek ingaan op wat WEL en NIET klopt:

De 3 kernproblemen zijn echt:

👉 Dit zijn echte architectural smells die je gaat voelen bij schalen

Dit is geen over-engineering, maar logische scheiding die:

De tabel met "huidig → nieuw" is geen theorie, maar een executable migration plan. Je kunt dit letterlijk file-by-file doorlopen.

Het advies stelt voor:

Dit klopt conceptueel, maar:
typescript
Waarom? Deze moves:

bash
Dit geeft je 80% van de winst met 20% van de moeite.

Wil je dat ik:

Zeg maar wat het meest helpt! 🚀Hier is de belangrijkste punten uit het artikel "7 Tips for Clean React TypeScript Code You Must Know" van Tapajyoti Bose.
Opmerking: Als je de "Gemini Live" modus gebruikt op je telefoon, kan ik deze tekst direct voor je uitspreken met een natuurlijke stem.
7 Tips voor Schone React TypeScript CodpastedLEES en stel een nette lijst samen; vul eventueel aan met missende tips om code 2025-proof te maken20 dec 2025

typescript

Voor elke feature/bugfix:

Laatst bijgewerkt: December 2024
Voor: React Native + TypeScript + Clean Architecture190 linestxt121 linestxtVerzamel zoveel mogelijk adviezen met betrekking tot debuggen van de code in mijn project. Analyseer en vergelijk daarna de prompts in in Debug1.txt en debug2.txt. Zoek naar tips om de prompts te verbeteren (verrijkt met de adviezen die je gevonden hebt). Geef mij die tips en gebruik tot slot zelf alle gevonden adviezen en tips om die  "ultieme ultra A-TIER god-modus prompt" zelf te schrijven. Denk over alles heel goed na20 dec 20251 stepsystematic debugging methodology software engineering 202510 resultsWhy Programs Fail: A Guide to Systematic Debugging | Guide books | ACM Digital Libraryacm.orgA systematic approach to debugging | nicole@webntietz.com10 effective debugging techniques for developers - WeAreBrainwearebrain.comA Systematic Review on Program Debugging Techniques | Request PDFresearchgate.netDebugging Approaches - Software Engineering - GeeksforGeeksgeeksforgeeks.orgBest Debugging Techniques : Process, Guidelines and Approaches - 2024appdeskservices.comUnveil Pro Debugging Techniques & Explore Its Role As a Soft Skilldemandtalk.comDebugging in Software Development: The Ultimate Guide 2025guvi.inDebugging: Its Strategies And Tools With Best Practiceslambdatest.comWhat is Debugging in Software Engineering? - GeeksforGeeksgeeksforgeeks.orgroot cause analysis debugging Five Whys hypothesis testing10 resultsFive whys - Wikipediawikipedia.orgWhat are the Five Whys? A Tool For Root Cause Analysis | Tuliptulip.coFive Whys and Five Hows | ASQasq.org5 Whys - What is it? | Lean Enterprise Institutelean.orgThe 5 Whys Explained: How to Get to the Root Cause Fastbusinessmap.io5 Whys Technique: Root Cause Analysis (With Examples) | Indeed.comindeed.comRoot Cause Analysis: Integrating Ishikawa Diagrams and the 5 Whys - isixsigma.comisixsigma.com5 Whys Root Cause Analysis Techniqueseworkorders.comFive Whys Tool for Root Cause Analysiscms.gov5 Whys. What it is, How it Works, Examples.learningloop.ioLaat me nu een uitgebreide analyse maken en de ultieme debugging prompt schrijven.Complete Debugging Adviezenlijst 2025Document # 🔍 Complete Debugging Adviezenlijst 2025
## React Native + TypeScript Focus

---

## 📊 **DEBUGGING METHODOLOGIE**

### Wetenschappelijke Aanpak (Scientific Method)
- ✅ **Observatie → Hypothese → Test → Conclusie**
- ✅ **Evidence-based**: nooit radNu ga ik de twee prompts analyseren en verbetertips geven:Analyse & Vergelijking Debug Prompts + VerbeterpuntenDocument # 🔬 Analyse Debug Prompts + Verbeterpunten

---

## 📊 **VERGELIJKING DEBUG1 vs DEBUG2**

### Debug1.txt (Forensics Mode)
**Sterke punten:**
- ✅ Expliciet research protocol (externe verificatie)
- ✅ Concrete output template met crime scene metaphor
Nu schrijf ik de ultieme A-tier debug prompt:🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document # 🔬 ULTIMATE A-TIER DEBUG PROMPT 2025
## Lyra Forensics Engine - React Native Edition

---

```xml
<system_configuration>
  <role>Senior Site Reliability Engineer & Forensic Code Investigator</role>
  <name>Lyra (Forensics Mode)</name>
  <specialty>Continue20 dec 2025<function_results>OK</function_results>
<system_warning>Token usage: 41953/190000; 148047 remaining</system_warning>🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document ∙ Version 2   <time_management>
    Signaleer wanneer escalatie nodig is:
    - Na 3 hypotheses allemaal fout: "Dit vereist senior review"
    - Intermittent bug na 2 uur: "Monitoring setup nodig"
    - Native crash zonder native expertise: "Xcode/Android StudioPerfect! Ik heb nu een complete analyse gemaakt. Laat me een samenvatting geven van wat ik heb geleverd:

Een uitgebreide verzameling van:

Een forensische analyse van beide prompts met:

De god-modus prompt met:

De ultimate prompt is production-ready en kan direct gebruikt worden. Je vult de input template in volgens de  en krijgt een systematisch 9-sectie rapport dat je door het hele debugging proces leidt zonder premature oplossingen te geven.
Wil je dat ik:

Laat het maar weten! 🚀Absoluut — ik begrijp wat je bedoelt met **Flow 3.5**: een AI-agent die *geen nieuwe architectuur bedenkt*, *geen implementatie doet* en *geen debug uitvoert*, maar die **voor elk verbeterpunt dat uit Flow 2 en Flow 3 komt**:

* **een gefaseerde migratieparagraaf oplevert**
* **een gedegen teststpastedAnalyseer deze prompt; Wat kan hier beter aan en waarom? Zoek naar do's en don'ts uit de praktijk. Kijk kritisch naar al jouw eigen observaties en de gevonden do's en dont's. Gebruik jouw kennis van prompt-schrijven en zet alles in om de ULTIMATE A-TIER MIGRATION EN TEST PROMPT 2025 samen te stellen:20 dec 2025migration strategy best practices phased rollout 202510 results8 Data Migration Best Practices for Enterprise Teams in 2025 - DataTeams AIdatateams.aiKubernetes Migration Strategy and Best Practices | IBMibm.comKafka Migration Demystified: Choosing Between a “Big Bang” Cutover and a Phased Rolloutautomq.comCloud Migration Best Practices: 10 Essential Tips for 2025netsharx.comData Migration in 2025: Key Strategies & Best Practicesphygital-insights.comDynamics GP to Dynamics 365 BC: 7 Steps for a Smooth Migration - ERP Software Blogerpsoftwareblog.com10 Cloud Migration Best Practices for Success in 2025kraftbusiness.comTop Google Cloud Migration Strategies for 2025c-metric.comCloud adoption guide | Atlassianatlassian.comData Migration: Strategy, Best Practices & Tools - The Couchbase Blogcouchbase.comtesting strategy migration validation best practices 202510 resultsData Migration Testing: A Complete Guide to Ensuring Accuracy, Integrity, and Performancedatalark.comData Migration Validation Best Practices for 2025quinnox.comA Complete Guide to Data Migration Testing | BrowserStackbrowserstack.comData Migration Test Strategy: Create an Effective Test Plan — Data Migration Prodatamigrationpro.comHow to build a successful cloud migration testing strategydatafold.comData Migration Testing – Strategy, Types and Best Practiceswinwire.comData Migration Testing: Strategy, Test Plans, Tools and Best Practicesuniridge.coMigrate to Google Cloud: Best practices for validating a migration plan | Cloud Architecture Centergoogle.comSpeed Up Deployment with Smart Data Migration Testingforbytes.comData Migration Testing: What You Need to Knowk2view.comPerfect! Nu heb ik genoeg materiaal. Laat me de analyse en de ultieme prompt maken:Kritische Analyse Flow 3.5 Migration PromptDocument # 🔬 Kritische Analyse: Flow 3.5 Migration & Test Prompt

---

## 📊 **WAT IS GOED** ✅

### Sterke Fundamenten
1. **Duidelijke scope**: Geen architectuur, geen code, geen debugging
2. **Gefaseerde aanpak**: 4-fase structuur is industry standard
3. **Nu de ultieme prompt zelf:🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document # 🚀 ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025
## Enterprise-Grade | Evidence-Based | Risk-Managed

---

```xml
<system_configuration>
  <role>Senior Migration Strategy Architect & Test Engineering Lead</role>
  <name>Lyra (Migration ModeContinue20 dec 2025🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 2 #### T9: Compliance & Security Validation
**Purpose:** Ensure migration meets regulatory & security requirements

**Compliance Checks:** (if applicable)

1. **GDPR Compliance**
   - [ ] Data minimization: Only necessary data migrated
   - [ ] Consent2 / 2Continue20 dec 2025<function_results>OK</function_results>🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 3 **Internal:**
- Wiki page: Migration case study
- Brown bag session: Share learnings with broader team
- Runbook: Updated procedures

**External:**
- Blog post (if public company)
- Conference talk (if applicable)
- Open-source tools/scripts developePerfect! Ik heb nu een complete set geleverd. Laat me een samenvatting geven:

Een forensische breakdown met:

Een complete enterprise-grade prompt met:
15 output secties (vs 7 in origineel):

Kwantitatieve verbeteringen:

Nieuwe elementen:

Wil je dat ik:

Laat maar weten! 🚀1) Dat is een uitstekende toevoeging. Flow 3.5 vormt de brug tussen de abstracte blauwdruk en de rauwe code. Om deze strategist effectief te laten zijn, heeft hij niet alleen de "wat" nodig, maar vooral de "hoe we het breken en herstellen" context uit de volledige audit-geschiedenis.
Hier is de geaggregeerde input-set die je aan Flow 3.5 kunt voeden. Deze is opgebouwd uit de meest kritieke technische bevindingen die een migratie-impact hebben:
📑 Input voor Flow 3.5: De Migration & Test Strategist
1. De "Legacy" Baseline (Wat we achterlaten)
* Structuur: Een platte mappenstructuur met circulaire afhankelijkheden en "Shotgun Parsing" (data wordt overal ter plekke van string naar number omgezet).
* Identiteit: Data in arrays is gebonden aan de index. Dit maakt de state extreem fragiel tijdens sorteer- of verwijderacties.
* Integriteit: De UI fungeert als "reparateur" (useEffect-synchronisatie) in plaats van als passieve weergave.
2. Kritieke Migratie-Punten (High Risk)
A. De UUID-transformatie (Cluster 2)
* Risico: Bestaande gebruikersdata in  gebruikt nog array-indices.
* Opdracht: Ontwerp een migratie-script dat bij de eerste "hydration" unieke IDs (UUID) toekent aan bestaande huishoudleden en transacties zonder de koppelingen te verbreken.
B. Semantische ID-migratie (Cluster 4)
* Risico: Pagina-sleutels veranderen van C1, C4, C7 naar .
* Opdracht: Implementeer een "Alias Mapping" in de storage-service zodat oude state-bestanden correct landen in de nieuwe semantische structuur.
C. De "Noon" Datum-strategie (Cluster 1 & 3)
* Risico: Datums zijn nu opgeslagen als diverse string-formats of lokale tijden, wat leidt tot "Off-by-one" errors bij verjaardagen.
* Opdracht: Transformeer alle opgeslagen geboortedatums naar de  standaard ().
3. Test-Strategie Parameters (Boundary Testing)
Flow 3.5 moet test-scenario's schrijven voor de volgende grensgevallen:
* De Komma-Bug: Unit-tests voor de  met inputs: "1.250,50", "1250.50", "1250", en "ongeldig".
* De "Purge" Validatie: Integratietest waarbij het wijzigen van woningtype (Koop naar Huur) de "Dirty State" vlag triggert en na bevestiging de hypotheek-state wist.
* De 5-Volwassenen Grens: Een data-audit test die bevestigt dat bij 6 volwassenen de  vlag in de metadata verschijnt, maar niet in de UI-state of console logs.
* Hydration Failure: Een test die een corrupte JSON in de storage injecteert en bevestigt dat de app stopt (of een veilige fallback kiest) in plaats van de corrupte data te overschrijven met een lege state.
4. De "Bleeding Edge" Safety-Check (React 19 / RN 0.81)
* Opdracht: Gezien de vroege adoptie van deze stack, moet Flow 3.5 een "Regression Suite" definiëren die na elke grote architecturale wijziging (zoals de invoer van Path Aliases) controleert of de Fast Refresh en de Metro-bundler nog stabiel draaien.
🚦 Volgende stap voor Flow 3.5
Vraag de strategist om op basis van deze input een Gefaseerd Migratieplan op te stellen:
1. Fase 1: Infrastructuur & Test-steigers (Path Aliases & Jest setup).
2. Fase 2: Data-sanering (Parser & UUID-injectie).
3. Fase 3: Architecturale verschuiving (Navigator State Machine & Reducer Alignment).
Wil je dat ik deze set direct doorzet naar Flow 3.5, of wil je nog specifieke randvoorwaarden toevoegen aan de test-parameters?2)
Dit is een strategische zet. Flow 3.5 (de MIGRATION & TEST strategist) is de essentiële schakel die de theoretische architectuur van Lyra (Flow 2) en de kritische audit van ARIA (Flow 3) vertaalt naar een veilig executieplan voor de Navigator (Flow 4).
Om Flow 3.5 direct op stoothoogte te brengen, heb ik hieronder de integrale synthese van alle bevindingen uit de eerdere flows geclusterd.
📋 Input-Dossier voor Flow 3.5: "Project Standaard 2025"
🏗️ Cluster 0 & 5: De Architecturale Schil & Navigatie
* 
Bevinding: De applicatie lijdt aan "Boolean Soup" in de navigatie (9+ losse booleans voor schermen)1111.⚙️ Cluster 2: State & Persistence Layer
* 
Kritiek Risico: Identiteitscrisis door het gebruik van  voor financiële records, wat leidt tot ID-collisies777777777.🧮 Cluster 1 (Finance): Rekenlogica & Ingestie
* 
Gevaar: De "Komma-bug" (1.250,50 wordt 1.25) door naïeve replace logica101010101010101010.🧩 Cluster 3 & 4: UI Atoms & Wizard Logic
* 
Schoonmaak:  moet worden ontdaan van alle domeinkennis; het mag alleen atomen aansturen13131313.Is dit voldoende input voor ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025 om zijn werk te kunnen doen?Show more20 dec 2025
Laat me de input grondig evalueren tegen de requirements van de Ultimate A-Tier Migration & Test Strategy Prompt:

De Ultimate Migration Prompt heeft strikte input requirements volgens . Laten we checken wat er mist:

xml
Wat ontbreekt:

Waarom kritiek: Migration time estimates, rollback strategy, testing scope

xml
Wat ontbreekt:

Waarom kritiek: Capacity planning, performance validation

xml
Wat aanwezig is:

Wat ontbreekt:

Waarom kritiek: Phase sequencing, rollback impact

xml
Volledig afwezig maar ESSENTIEEL:

Waarom kritiek: Bepaalt hele migration strategy (phased vs big bang)

xml
Waarom kritiek: Het hele "Post-Migration Validation" framework hangt hierop!

xml
Wat ontbreekt: Error budget, acceptable failure rate

✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument # ✅ Complete Input Template voor Flow 3.5 Migration Strategy
## Project: Standaard 2025 - AsyncStorage → DDD Structure Migration

---

## 📦 **APPROVED ADVICE** (from Flow 2 + 3)

### Migration Item 1: UUID Transformation (Cluster 2)
**Current State:Continue20 dec 2025✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument ∙ Version 2 ### HIGH PRIORITY (Strongly recommended)
- [ ] **Monitoring:** Sentry/Crashlytics setup? Analytics?
- [ ] **Migration Budget:** Error budget (X% failures acceptable?)
- [ ] **Rollback Strategy:** Force update mechanism? Or tolerate old versions?
- [ Perfect! Ik heb nu een complete analyse gemaakt. Laat me samenvatten:

WAT ER GOED IS: ✅

WAT ER ONTBREEKT (Kritiek): ❌

Impact: Flow 3.5 kan een generieke strategie maken, maar niet een production-ready, date-committed, risk-quantified plan.

Gezien:

Fase 1: Quick Generic Strategy (NU)

Fase 2: Complete Strategy (na data gathering)

Optie A: Ik genereer nu een generic strategy met placeholders

Optie B: Ik help je eerst missing info verzamelen

Optie C: Hybrid: Generic strategy NU + checklist voor later

Wat kies jij? A, B, of C? 🎯Show more22 dec 2025
Je hebt alles correct geconfigureerd, maar er zijn een paar veelvoorkomende oorzaken waarom ze nog niet werken:

Metro cache is extreem hardnekkig en pikt nieuwe Babel config niet automatisch op.
Fix:
bash
Test daarna:
typescript

| Je hebt correct reanimated als laatste | maar soms moet eerste zijn. |
| --- | --- |
| Dit is al correct bij jou | maar goed om te verifiëren. |

Check of de plugin er is:
bash
Als niet gevonden:
bash

Je gebruikt  (relative), soms werkt absolute path beter:
Probeer:
javascript

Je  is correct, maar soms moet je ook  toevoegen voor niet-TS files.
Voeg toe:  (naast tsconfig.json):
json

Je gebruikt , wat suggereert Expo. Soms heeft Expo een eigen caching mechanisme.
Als je Expo gebruikt:
bash

Zorg dat je imports correct zijn:
✅ Correct:
typescript
❌ Fout:
typescript

Voer deze stappen in volgorde uit:
bash
9. VSCode restart:

10. Test import:
typescript
Kijk naar errors in:

→ Babel niet correct of Metro cache issue
→ Fix: Reset cache (stap 7 hierboven)

→ TypeScript server niet bijgewerkt
→ Fix: Restart TS Server (CMD+Shift+P → "Restart TS Server")

→ Metro cache corrupt
→ Fix: 

→ Stale import cache in specific file
→ Fix: Delete .js.map files, restart bundler

Probeer deze 3 snelle fixes eerst:
bash
Als dat niet werkt, volg de volledige checklist hierboven.

Test met deze code in App.tsx:
typescript
Als je errors ziet:

Maak een test script om te verifiëren dat aliassen werken:
:
javascript
Run:
bash
Dit vertelt je of de directories bestaan waar de aliases naar wijzen.

| Laat me weten welke error je krijgt, dan help ik verder! 🚀ik krijg deze melding [node scripts/sync-aliases.js ❌ Failed to parse tsconfig.json (JSONC + trailing commas)] bij uitvoeren van dit script. Analyseer script, zoek alle tips en best practices en pas deze toe op het script | analyseer het door jouw geschreven script nogmaals en verbeter het waar mogelijk. #!/usr/bin/env node |
| --- | --- |
| const fs = require('fs') |  |
| const path = require('path') |  |
| const ROOT = process.cwd() |  |
| const TSCONFIG = path.join(ROOT, 'tsconfig.json') |  |
| const BABEL = path.join(ROOT, 'babel.config.js') |  |
| const JEST = path.join(ROOT, 'jest.config.js') |  |
| const DRY_RUN = process.argv.includes('--dry-run') |  |
| ] |  |
| console.error❌ ${msg}) |  |
| process.exit(1) |  |
| .replace(/,\s*([}\]])/g, '$1') |  |
| console.logℹ️ ${msg}) |  |
| console.log✅ ${msg}) |  |
| if (!fs.existsSync(TSCONFIG)) die('tsconfig.json not found') |  |
| let ts |  |
| const raw = fs.readFileSync(TSCONFIG, 'utf8') |  |
| ts = JSON.parse(sanitizeJson(raw)) |  |
| die('Failed to parse tsconfig.json (JSONC + trailing commas)') |  |
| const paths = ts.compilerOptions?.paths |  |
| if (!paths) die('No compilerOptions.paths found') |  |
| const name = key.replace(/\/\*$/, '') |  |
| const target = value.replace(/\/\*$/, '') |  |
| die) |  |
| return { name, target } |  |
| }) |  |
| info) |  |
| aliases.forEach(a => info)) |  |
| if (!fs.existsSync(BABEL)) die('babel.config.js not found') |  |
| let babelSrc = fs.readFileSync(BABEL, 'utf8') |  |
| info('babel.config.js: alias block NOT found') |  |
| ok('babel.config.js: alias block found') |  |
| const babelAliasBlock = '${a.name}': './${a.target}', |  |
| ) |  |
| fs.writeFileSync(BABEL, babelSrc) |  |
| if (!fs.existsSync(JEST)) die('jest.config.js not found') |  |
| let jestSrc = fs.readFileSync(JEST, 'utf8') |  |
| info('jest.config.js: moduleNameMapper NOT found') |  |
| ok('jest.config.js: moduleNameMapper found') |  |
| const jestMapperBlock = '^${a.name.replace('@', '\\@')}/(.*)$': '<rootDir>/${a.target}/$1', |  |
| ) |  |
| fs.writeFileSync(JEST, jestSrc) |  |
| ok('Dry-run complete (no files modified)') |  |
| ok('Aliases synced from tsconfig.json') |  |

javascript

javascript

javascript

javascript

sync-aliases.js (Fixed & Enhanced)Code #!/usr/bin/env node
/**
 * Sync path aliases from tsconfig.json → babel.config.js + jest.config.js
 * 
 * Features:
 * - JSONC support (comments, trailing commas)
 * - Dry-run mode (--dry-run)
 * - Backup creation (--backup)
 * - Validation (reservedPerfect! Nu nog een vergelijkingstabel en best practices document:Script Verbeteringen & Best PracticesDocument # 📊 Script Verbeteringen & Best Practices

---

## 🔍 **Wat Was Er Mis**

### Bug 1: Template Literal Syntax Errors
```javascript
// ❌ ORIGINEEL (4 locaties!)
console.error`❌ ${msg}`);
console.log`ℹ️  ${msg}`);
die`Alias "${name}" is reserved`);
infPerfect! Nog één ding - een quick reference card voor dagelijks gebruik:Path Aliases Troubleshooting CheatsheetDocument # 🚨 Path Aliases Troubleshooting Cheatsheet

---

## ⚡ **Quick Fixes (Try These First)**

```bash
# 1. Nuclear cache clear (solves 90% of issues)
npx react-native start --reset-cache

# 2. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeS
Ik heb je complete set geleverd:

Direct doen:
bash
Aliases zouden nu moeten werken! 🎉
Heb je nog errors? Laat me de exacte error message zien en ik help verder debuggen! 🔍Claude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

pasted

---

**Claude:**

Huidige mappenstructuur:
src
├── components
│   ├── ChipButton.tsx
│   ├── ConditionalField.tsx
│   ├── DateField.tsx
│   ├── FormField.tsx
│   ├── InputCounter.tsx
│   └── ToggleSwitch.tsx
├── config
│   └── features.ts
├── context
│   ├── FormContext.tsx
│   ├── FormContext.tsx.bak
│   └── ThemeContext.tsx
├── hooks
│   └── useDobInput.ts
├── navigation
│   └── Navigator.tsx
├── organisms
│   ├── ExpenseRepeater.tsx
│   ├── HouseholdMemberRepeater.tsx
│   ├── HouseholdMemberRepeater.tsx.bak
│   └── IncomeRepeater.tsx
├── screens
│   ├── CSV
│   │   └── CsvUploadScreen.tsx
│   ├── Daily
│   │   └── UndoScreen.tsx
│   ├── DailyInput
│   │   └── DailyInputScreen.tsx
│   ├── Dashboard
│   │   └── DashboardScreen.tsx
│   ├── LandingScreen.tsx
│   ├── Options
│   │   └── OptionsScreen.tsx
│   ├── Reset
│   │   └── ResetScreen.tsx
│   ├── Settings
│   │   └── SettingsScreen.tsx
│   └── Wizard
│       ├── pages
│       │   ├── C10.config.ts
│       │   ├── C1.config.ts
│       │   ├── C4.config.ts
│       │   └── C7.config.ts
│       ├── WizardController.tsx
│       ├── WizardController.tsx.bak
│       └── WizardPage.tsx
├── services
│   ├── csvService.ts
│   ├── householdAlign.ts
│   ├── storage.ts
│   └── transactionService.ts
├── styles
│   ├── Colors.ts
│   └── useAppStyles.ts
├── types
│   ├── expenses.ts
│   ├── form.ts
│   ├── household.ts
│   ├── income.ts
│   └── transaction.ts
└── utils
    ├── conditions.ts
    ├── date.ts
    ├── finance.ts
    ├── numbers.ts
    ├── strings.ts
    └── validation.ts
ADVIES :
KLOPT HET ADVIES?Show more20 dec 2025

---

**Claude:**

20 dec 2025

---

**Claude:**

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

```
utils/finance.ts → domain/income/finance.ts
```

```
utils/finance.ts → domain/income/finance.ts
```

```
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```ts
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

- Testen makkelijker maakt
- AI-begeleide refactors veiliger maakt
- Future features isoleerbaar houdt

- Zijn netter, maar niet urgent
- Kosten meer tijd zonder directe winst
- Kunnen gradueel tijdens feature-werk

- De minimale refactor (fase 1) als script uitschrijf?
- Een ADR maak voor "Waarom wizard een subsystem is"?
- Een import-regel docje maak ("wie mag wie importeren")?

# 🎯 Review van het advies

## TL;DR: JA, het advies klopt — met 2 nuances

## ✅ Wat absoluut klopt

### 1. De diagnose is accuraat

### 2. De voorgestelde structuur is pragmatisch

### 3. De mappings zijn praktisch uitvoerbaar

## ⚠️ Wat je moet nuanceren

### Nuance 1: utils/ vs domain/

## 📋 Wat ik zou doen (actieplan)

Het advies is solide en praktisch. De analist heeft je repo goed begrepen en stelt een evolutionaire refactor voor die past bij jouw situatie.
Maar laat me specifiek ingaan op wat WEL en NIET klopt:

De 3 kernproblemen zijn echt:

👉 Dit zijn echte architectural smells die je gaat voelen bij schalen

Dit is geen over-engineering, maar logische scheiding die:

De tabel met "huidig → nieuw" is geen theorie, maar een executable migration plan. Je kunt dit letterlijk file-by-file doorlopen.

Het advies stelt voor:

Dit klopt conceptueel, maar:
typescript
Waarom? Deze moves:

bash
Dit geeft je 80% van de winst met 20% van de moeite.

Wil je dat ik:

Zeg maar wat het meest helpt! 🚀

---

**Claude:**

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

```
❌ services/ = vuilnisbak
   → householdAlign.ts is geen service, het is domeinlogica
   
❌ components/ bevat 3 soorten dingen
   → UI + form-engine + business-logic gemengd
   
❌ Wizard verdient eigen subsystem
   → Het ÍS een mini-app in je app
```

---

**Claude:**

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

```
domain/          → business logica zonder React
components/
  ├─ ui/         → herbruikbaar
  ├─ form/       → form-engine
  └─ layout/     
wizard/          → subsystem
state/           → context providers
```

---

**Claude:**

```
utils/finance.ts → domain/income/finance.ts
```

```
utils/finance.ts → domain/income/finance.ts
```

---

**Claude:**

```
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```ts
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

typescript

---

**Claude:**

typescript

---

**Claude:**

```
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

```ts
// Als finance.ts dit bevat:
export const formatCurrency = (amount: number) => ...
export const calculateNetIncome = (gross: number, tax: number) => ...
```

Dan is het **niet zwart-wit**:
- `formatCurrency` = utility (kan in `utils/`)
- `calculateNetIncome` = domain logic (moet naar `domain/`)

👉 **Kijk per functie**, niet per file. Je mag ook:
```
domain/income/
  ├─ income.types.ts
  ├─ calculations.ts    ← domain logic
  └─ formatting.ts      ← domain-specific utilities
```

---

### Nuance 2: Niet alles hoeft meteen

Het advies suggereert een **complete refactor**. Dat kan, maar je kunt ook:

#### Fase 1 (low-hanging fruit):
```
1. Maak domain/ en verplaats householdAlign.ts
2. Maak components/form/ en verplaats repeaters
3. Maak wizard/ en verplaats configs
```

**Stop hier. Ship features.**

#### Fase 2 (later):
```
4. Split components/ in ui/form/layout
5. Herstructureer utils/ waar nodig
```

👉 **Incrementeel is veiliger** dan big-bang

---

## 🎯 Mijn concrete aanbeveling

### Doe dit WEL (hoge ROI):
```
✅ domain/household/householdAlign.ts
✅ wizard/configs/*.config.ts  
✅ components/form/repeaters/*
✅ state/FormContext.tsx (hernoeming)
```

**Waarom?** Deze moves:
- Elimineren conceptuele verwarring
- Maken testen triviaal
- Kosten <1 uur werk

---

### Doe dit LATER (lagere prioriteit):
```
⏳ utils/ opsplitsen (pas bij volgende feature)
⏳ components/ui/ vs components/form/ (gradueel)
⏳ domain/*/*.types.ts (alleen bij échte duplicatie)
```

---

**Claude:**

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

bash

---

**Claude:**

bash

---

**Claude:**

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

```sql
# 1. Maak de belangrijkste mappen
mkdir -p src/{domain/household,wizard/configs,components/form/repeaters,state}

# 2. Move high-impact files (15 min)
mv src/services/householdAlign.ts src/domain/household/
mv src/screens/Wizard/pages/*.config.ts src/wizard/configs/
mv src/organisms/*Repeater.tsx src/components/form/repeaters/
mv src/context/*.tsx src/state/

# 3. Fix imports (gebruik je IDE's rename/move)
# VS Code doet dit automatisch als je via UI verplaatst

# 4. Update één import-pad tegelijk, test, commit
```

**Timeline:** 1-2 uur voor fase 1, dan verder met features.

---

## 🏁 Conclusie

| Vraag | Antwoord |
|-------|----------|
| **Klopt het advies?** | Ja, conceptueel 100% |
| **Moet je alles doen?** | Nee, begin met 4-5 high-impact moves |
| **Is het te complex?** | Nee, het is juist pragmatisch |
| **Moet je dit nu doen?** | Fase 1 nu, fase 2 gradueel |

---

## 💡 Mijn variant (compromis)

Als je **minimaal** wilt refactoren maar **maximaal** wilt winnen:
```
src/
├─ domain/          ← NEW: householdAlign + finance logic
├─ wizard/          ← NEW: configs + controller  
├─ components/
│  ├─ form/         ← NEW: repeaters, FormField
│  └─ [rest blijft hier]
├─ state/           ← RENAME van context/
└─ [rest ongewijzigd]
```

---

**Claude:**

Hier is de belangrijkste punten uit het artikel "7 Tips for Clean React TypeScript Code You Must Know" van Tapajyoti Bose.
Opmerking: Als je de "Gemini Live" modus gebruikt op je telefoon, kan ik deze tekst direct voor je uitspreken met een natuurlijke stem.
7 Tips voor Schone React TypeScript CodpastedLEES en stel een nette lijst samen; vul eventueel aan met missende tips om code 2025-proof te maken20 dec 2025

---

**Claude:**

LEES en stel een nette lijst samen; vul eventueel aan met missende tips om code 2025-proof te maken20 dec 2025

---

**Claude:**

LEES en stel een nette lijst samen; vul eventueel aan met missende tips om code 2025-proof te maken

---

**Claude:**

| Situatie | Actie |
| --- | --- |
| Complexe state | Discriminated Union |
| Herhaalde logica (3x) | Extraheer functie/hook |
| Onduidelijke naam | Hernoem naar doel |
| Lange functie (>20) | Split op (SRP) |
| API data | Parse met Zod |
| Legacy code | Boy Scout + Mikado |
| Test schrijven | Test gedrag, niet impl |
| Performance issue | Meet eerst, dan optimize |

```
daysUntilDeadline
```

```
shouldRender
```

```
tempVariable
```

```
type UserId = string
```

```
({ title, onClick })
```

```
props.title
```

```
useUserAuth
```

```html
useState<User | null>(null)
```

```
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```ts
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```
type Status = 'open' | 'closed'
```

```html
ReturnType<typeof fn>
```

```json
{ success: boolean, data?: T, error?: string }
```

```yaml
strict: true
```

```
/features/auth/*
```

```
/components/*
```

```
noImplicitAny
```

```
strictNullChecks
```

```
@components/*
```

```
../../components
```

```
console.log
```

```
const MAX_RETRIES = 3
```

```
npx tsc --noEmit
```

| - ✅ Boolean prefixen: isLoading | hasAccess |  |
| --- | --- | --- |
| - ✅ Geen ruis: vermijd dataObject | userInfo |  |

- ✅ Single Responsibility: één functie = één taak
- ✅ Max 20 regels (vuistregel voor leesbaarheid)
- ✅ Max 2 argumenten (meer? → gebruik object)
- ✅ Guard Clauses: handel edge cases bovenaan af (return early)
- ✅ Geen side effects: voorspelbaar gedrag
- ✅ Pure functions waar mogelijk: zelfde input = zelfde output

| Key | Value |
| --- | --- |
| ✅ Kleine componenten | max 100-150 regels JSX |
| ✅ Destructuring props | ipv |
| ✅ Fragmenten | gebruik <>...</> ipv onnodige divs |
| ✅ Composition over Inheritance | gebruik children prop |
| ✅ Logica uit UI | verplaats naar Custom Hooks () |
| ✅ Feature | based structure: alles van één feature in één map |

- ✅ Expliciet typen:
- ✅ useCallback/useMemo: alleen bij échte performance issues
- ✅ Custom Hooks: extraheer herbruikbare logica
- ✅ React.FC: vermijd (tenzij je children expliciet nodig hebt)

- ✅ NOOIT any: gebruik unknown als je type niet weet
- ✅ Interfaces voor props: beter uitbreidbaar dan type
- ✅ Discriminated Unions voor state:

- ✅ Enums/Unions voor constanten:
- ✅ readonly voor immutable data
- ✅ Utility Types: Omit, Pick,

- ✅ Generics met constraints: flexibel maar type-safe
- ✅ Parse, don't validate: gebruik Zod aan systeemgrenzen
- ✅ Result types:
- ✅ Strict tsconfig: schakel  in

| Key | Value |
| --- | --- |
| ✅ Shallow codebase | max 3-4 niveaus diep |
| ✅ Feature | based folders: ipv |
| ✅ Domain layer | business logica apart van UI |
| ✅ Just Use Functions | vermijd onnodige classes |
| ✅ DRY (Don't Repeat Yourself) | Regel van Drie |

1x = schrijf het
2x = dupliceer (acceptabel)
3x = refactor naar herbruikbare functie
- 1x = schrijf het
- 2x = dupliceer (acceptabel)
- 3x = refactor naar herbruikbare functie

- 1x = schrijf het
- 2x = dupliceer (acceptabel)
- 3x = refactor naar herbruikbare functie

| Key | Value |
| --- | --- |
| ✅ Strangler Fig | vervang legacy code geleidelijk |
| ✅ Façade pattern | wrap oude code, route verkeer om |
| ✅ Repository pattern | scheid data-access van business logica |
| ✅ Discriminated Unions | voorkom onmogelijke states |

| - ✅ Test gedrag | niet implementatie |
| --- | --- |
| - ✅ Gebruik Testing Library: getByRole | getByText |

| - ✅ ESLint strict mode: waarschuw bij any | complexiteit |
| --- | --- |
| - ✅ TypeScript strict mode: |  |

- ✅ Boy Scout Rule: laat code schoner achter dan je het vond
- ✅ Mikado Method:

Stel doel → probeer → visualiseer blokkades
Revert → los sub-doelen op → werk terug naar doel
- Stel doel → probeer → visualiseer blokkades
- Revert → los sub-doelen op → werk terug naar doel
- ✅ Prioriteer op impact:

High-change areas
Bug-prone modules
Onboarding blockers
- High-change areas
- Bug-prone modules
- Onboarding blockers
- ✅ Incremental refactoring: kleine stappen, blijf deploybaar

- Stel doel → probeer → visualiseer blokkades
- Revert → los sub-doelen op → werk terug naar doel

- High-change areas
- Bug-prone modules
- Onboarding blockers

| Key | Value |
| --- | --- |
| ✅ Custom Path Aliases | ipv |
| ✅ React Compiler | bereid je voor (minder handmatige memo's) |
| ✅ Vitest | snellere test runner dan Jest |
| ✅ Biome | all-in-one linter/formatter (alternatief voor ESLint+Prettier) |

| Key | Value |
| --- | --- |
| ✅ Don't outsource thinking | AI voor boilerplate, jij voor architectuur |
| ✅ Vermijd "vibe coding" | begrijp wat AI genereert |
| ✅ Validate AI output | check logica en edge cases |
| ✅ Use AI for refactoring suggestions | maar neem bewuste beslissingen |

| - ✅ Structured logging: niet | maar structured data |
| --- | --- |
| - ✅ Distributed tracing: in microservices (Jaeger | OpenTelemetry) |
| - ✅ Performance monitoring: Lighthouse | React DevTools Profiler |

| - ✅ Commentaar op "waarom" | niet "wat" |
| --- | --- |
| - ✅ Code is voor mensen: machine compileert alles | mensen moeten het begrijpen |

| Key | Value |
| --- | --- |
| ✅ Vermijd deep nesting | max 2-3 niveaus |
| ✅ Ternary overkill voorkomen | complexe conditie? → if statement |
| ✅ Failing gracefully | voorspelbaar foutgedrag |
| ✅ Consistent naming | zelfde concepten, zelfde namen |

| Key | Value |
| --- | --- |
| ✅ TypeScript default sinds 0.71 | gebruik het |
| ✅ Babel voor transforms | niet tsc voor compilatie |
| ✅ Type | check met CLI: |
| ✅ @react | native/typescript-config: gebruik officiële config |

| Key | Value |
| --- | --- |
| ✅ FlatList voor lange lijsten | niet .map() |
| ✅ Memoize zware componenten | React.memo met zorg |
| ✅ Hermes engine | snellere JS-uitvoering |
| ✅ Native modules | schrijf performance-kritieke code in native |

| Key | Value |
| --- | --- |
| ⬜ Naamgeving check | zijn alle namen self-explanatory? |
| ⬜ Functie lengte | < 20 regels per functie? |
| ⬜ TypeScript strict | geen any, expliciete types? |
| ⬜ Tests aanwezig | gedekt met betekenisvolle tests? |
| ⬜ Boy Scout Rule | code schoner achtergelaten? |
| ⬜ Discriminated Unions | onmogelijke states voorkomen? |
| ⬜ Import paths | relatieve paths < 3 niveaus of gebruik aliases? |
| ⬜ Side effects | functies voorspelbaar en pure? |
| ⬜ Commentaar nodig? | zo ja, leg "waarom" uit, niet "wat" |
| ⬜ Leave No Questions | zou een nieuwe dev dit snappen? |

| - Refactoring is geen taak | het is een workflow (Martin Fowler) |
| --- | --- |
| - Parse | don't validate: dwing types af aan grenzen |

# 🎯 Complete Clean Code Checklist 2025

## React + TypeScript + React Native

## 📋 BASIS PRINCIPES

### Naamgeving

### Functies

## ⚛️ REACT BEST PRACTICES

### Component Structuur

### Hooks

## 🔷 TYPESCRIPT ESSENTIALS

### Type Safety

### Geavanceerd

## 🏗️ ARCHITECTUUR & STRUCTUUR

### Code Organisatie

### Patterns

## 🧪 TESTING & KWALITEIT

### Test Strategie

### Code Quality

## 📦 REFACTORING LEGACY CODE

### Strategieën

## 🚀 2025-SPECIFIC TIPS

### Modern Tooling

### AI-Assisted Development

### Observability

## 💡 COGNITIEVE BELASTING REDUCEREN

### Leesbaarheid

### Mentale Energie

## 🔧 REACT NATIVE SPECIFIEK

### Setup

### Performance

## ✅ DAILY CHECKLIST

## 🎯 EXPERT MINDSET

## 📚 QUICK REFERENCE

> "Code is een verhaal dat je vertelt aan je toekomstige zelf en je teamgenoten. Maak het een goed verhaal."

typescript

Voor elke feature/bugfix:

| Key | Value |
| --- | --- |
| Laatst bijgewerkt | December 2024 |
| Voor | React Native + TypeScript + Clean Architecture |

---

**Claude:**

```
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```ts
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

typescript

---

**Claude:**

```
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

```ts
type State = 
    | { status: 'loading' }
    | { status: 'error', message: string }
    | { status: 'success', data: User }
```

---

**Claude:**

| Situatie | Actie |
| --- | --- |
| Complexe state | Discriminated Union |
| Herhaalde logica (3x) | Extraheer functie/hook |
| Onduidelijke naam | Hernoem naar doel |
| Lange functie (>20) | Split op (SRP) |
| API data | Parse met Zod |
| Legacy code | Boy Scout + Mikado |
| Test schrijven | Test gedrag, niet impl |
| Performance issue | Meet eerst, dan optimize |

---

**Claude:**

### debug2.txt

### Debug1.txt

190 linestxt121 linestxtVerzamel zoveel mogelijk adviezen met betrekking tot debuggen van de code in mijn project. Analyseer en vergelijk daarna de prompts in in Debug1.txt en debug2.txt. Zoek naar tips om de prompts te verbeteren (verrijkt met de adviezen die je gevonden hebt). Geef mij die tips en gebruik tot slot zelf alle gevonden adviezen en tips om die  "ultieme ultra A-TIER god-modus prompt" zelf te schrijven. Denk over alles heel goed na20 dec 2025

---

**Claude:**

### debug2.txt

### Debug1.txt

190 linestxt121 linestxt

---

**Claude:**

### debug2.txt

190 linestxt

---

**Claude:**

### debug2.txt

190 lines

---

**Claude:**

txt

---

**Claude:**

### Debug1.txt

121 linestxt

---

**Claude:**

### Debug1.txt

121 lines

---

**Claude:**

Verzamel zoveel mogelijk adviezen met betrekking tot debuggen van de code in mijn project. Analyseer en vergelijk daarna de prompts in in Debug1.txt en debug2.txt. Zoek naar tips om de prompts te verbeteren (verrijkt met de adviezen die je gevonden hebt). Geef mij die tips en gebruik tot slot zelf alle gevonden adviezen en tips om die  "ultieme ultra A-TIER god-modus prompt" zelf te schrijven. Denk over alles heel goed na20 dec 2025

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dacm.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dntietz.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwearebrain.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dresearchgate.net&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dappdeskservices.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddemandtalk.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dguvi.in&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlambdatest.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwikipedia.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dtulip.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dasq.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlean.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbusinessmap.io&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dindeed.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Disixsigma.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Deworkorders.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcms.gov&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlearningloop.io&w=32&q=75)

1 stepsystematic debugging methodology software engineering 202510 resultsWhy Programs Fail: A Guide to Systematic Debugging | Guide books | ACM Digital Libraryacm.orgA systematic approach to debugging | nicole@webntietz.com10 effective debugging techniques for developers - WeAreBrainwearebrain.comA Systematic Review on Program Debugging Techniques | Request PDFresearchgate.netDebugging Approaches - Software Engineering - GeeksforGeeksgeeksforgeeks.orgBest Debugging Techniques : Process, Guidelines and Approaches - 2024appdeskservices.comUnveil Pro Debugging Techniques & Explore Its Role As a Soft Skilldemandtalk.comDebugging in Software Development: The Ultimate Guide 2025guvi.inDebugging: Its Strategies And Tools With Best Practiceslambdatest.comWhat is Debugging in Software Engineering? - GeeksforGeeksgeeksforgeeks.orgroot cause analysis debugging Five Whys hypothesis testing10 resultsFive whys - Wikipediawikipedia.orgWhat are the Five Whys? A Tool For Root Cause Analysis | Tuliptulip.coFive Whys and Five Hows | ASQasq.org5 Whys - What is it? | Lean Enterprise Institutelean.orgThe 5 Whys Explained: How to Get to the Root Cause Fastbusinessmap.io5 Whys Technique: Root Cause Analysis (With Examples) | Indeed.comindeed.comRoot Cause Analysis: Integrating Ishikawa Diagrams and the 5 Whys - isixsigma.comisixsigma.com5 Whys Root Cause Analysis Techniqueseworkorders.comFive Whys Tool for Root Cause Analysiscms.gov5 Whys. What it is, How it Works, Examples.learningloop.ioLaat me nu een uitgebreide analyse maken en de ultieme debugging prompt schrijven.Complete Debugging Adviezenlijst 2025Document # 🔍 Complete Debugging Adviezenlijst 2025
## React Native + TypeScript Focus

---

## 📊 **DEBUGGING METHODOLOGIE**

### Wetenschappelijke Aanpak (Scientific Method)
- ✅ **Observatie → Hypothese → Test → Conclusie**
- ✅ **Evidence-based**: nooit radNu ga ik de twee prompts analyseren en verbetertips geven:Analyse & Vergelijking Debug Prompts + VerbeterpuntenDocument # 🔬 Analyse Debug Prompts + Verbeterpunten

---

## 📊 **VERGELIJKING DEBUG1 vs DEBUG2**

### Debug1.txt (Forensics Mode)
**Sterke punten:**
- ✅ Expliciet research protocol (externe verificatie)
- ✅ Concrete output template met crime scene metaphor
Nu schrijf ik de ultieme A-tier debug prompt:🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document # 🔬 ULTIMATE A-TIER DEBUG PROMPT 2025
## Lyra Forensics Engine - React Native Edition

---

```xml
<system_configuration>
  <role>Senior Site Reliability Engineer & Forensic Code Investigator</role>
  <name>Lyra (Forensics Mode)</name>
  <specialty>

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dacm.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dntietz.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwearebrain.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dresearchgate.net&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dappdeskservices.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddemandtalk.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dguvi.in&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlambdatest.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

systematic debugging methodology software engineering 202510 resultsWhy Programs Fail: A Guide to Systematic Debugging | Guide books | ACM Digital Libraryacm.orgA systematic approach to debugging | nicole@webntietz.com10 effective debugging techniques for developers - WeAreBrainwearebrain.comA Systematic Review on Program Debugging Techniques | Request PDFresearchgate.netDebugging Approaches - Software Engineering - GeeksforGeeksgeeksforgeeks.orgBest Debugging Techniques : Process, Guidelines and Approaches - 2024appdeskservices.comUnveil Pro Debugging Techniques & Explore Its Role As a Soft Skilldemandtalk.comDebugging in Software Development: The Ultimate Guide 2025guvi.inDebugging: Its Strategies And Tools With Best Practiceslambdatest.comWhat is Debugging in Software Engineering? - GeeksforGeeksgeeksforgeeks.org

---

**Claude:**

systematic debugging methodology software engineering 2025

---

**Claude:**

10 results

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dacm.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dntietz.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwearebrain.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dresearchgate.net&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dappdeskservices.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddemandtalk.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dguvi.in&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlambdatest.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeeksforgeeks.org&w=32&q=75)

Why Programs Fail: A Guide to Systematic Debugging | Guide books | ACM Digital Libraryacm.orgA systematic approach to debugging | nicole@webntietz.com10 effective debugging techniques for developers - WeAreBrainwearebrain.comA Systematic Review on Program Debugging Techniques | Request PDFresearchgate.netDebugging Approaches - Software Engineering - GeeksforGeeksgeeksforgeeks.orgBest Debugging Techniques : Process, Guidelines and Approaches - 2024appdeskservices.comUnveil Pro Debugging Techniques & Explore Its Role As a Soft Skilldemandtalk.comDebugging in Software Development: The Ultimate Guide 2025guvi.inDebugging: Its Strategies And Tools With Best Practiceslambdatest.comWhat is Debugging in Software Engineering? - GeeksforGeeksgeeksforgeeks.org

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwikipedia.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dtulip.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dasq.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlean.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbusinessmap.io&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dindeed.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Disixsigma.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Deworkorders.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcms.gov&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlearningloop.io&w=32&q=75)

root cause analysis debugging Five Whys hypothesis testing10 resultsFive whys - Wikipediawikipedia.orgWhat are the Five Whys? A Tool For Root Cause Analysis | Tuliptulip.coFive Whys and Five Hows | ASQasq.org5 Whys - What is it? | Lean Enterprise Institutelean.orgThe 5 Whys Explained: How to Get to the Root Cause Fastbusinessmap.io5 Whys Technique: Root Cause Analysis (With Examples) | Indeed.comindeed.comRoot Cause Analysis: Integrating Ishikawa Diagrams and the 5 Whys - isixsigma.comisixsigma.com5 Whys Root Cause Analysis Techniqueseworkorders.comFive Whys Tool for Root Cause Analysiscms.gov5 Whys. What it is, How it Works, Examples.learningloop.io

---

**Claude:**

root cause analysis debugging Five Whys hypothesis testing

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwikipedia.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dtulip.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dasq.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlean.org&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbusinessmap.io&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dindeed.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Disixsigma.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Deworkorders.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcms.gov&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dlearningloop.io&w=32&q=75)

Five whys - Wikipediawikipedia.orgWhat are the Five Whys? A Tool For Root Cause Analysis | Tuliptulip.coFive Whys and Five Hows | ASQasq.org5 Whys - What is it? | Lean Enterprise Institutelean.orgThe 5 Whys Explained: How to Get to the Root Cause Fastbusinessmap.io5 Whys Technique: Root Cause Analysis (With Examples) | Indeed.comindeed.comRoot Cause Analysis: Integrating Ishikawa Diagrams and the 5 Whys - isixsigma.comisixsigma.com5 Whys Root Cause Analysis Techniqueseworkorders.comFive Whys Tool for Root Cause Analysiscms.gov5 Whys. What it is, How it Works, Examples.learningloop.io

---

**Claude:**

Laat me nu een uitgebreide analyse maken en de ultieme debugging prompt schrijven.

---

**Claude:**

Complete Debugging Adviezenlijst 2025Document # 🔍 Complete Debugging Adviezenlijst 2025
## React Native + TypeScript Focus

---

## 📊 **DEBUGGING METHODOLOGIE**

### Wetenschappelijke Aanpak (Scientific Method)
- ✅ **Observatie → Hypothese → Test → Conclusie**
- ✅ **Evidence-based**: nooit rad

---

**Claude:**

Complete Debugging Adviezenlijst 2025Document

---

**Claude:**

Complete Debugging Adviezenlijst 2025

---

**Claude:**

Document

---

**Claude:**

# 🔍 Complete Debugging Adviezenlijst 2025
## React Native + TypeScript Focus

---

## 📊 **DEBUGGING METHODOLOGIE**

### Wetenschappelijke Aanpak (Scientific Method)
- ✅ **Observatie → Hypothese → Test → Conclusie**
- ✅ **Evidence-based**: nooit rad

---

**Claude:**

Nu ga ik de twee prompts analyseren en verbetertips geven:

---

**Claude:**

Analyse & Vergelijking Debug Prompts + VerbeterpuntenDocument # 🔬 Analyse Debug Prompts + Verbeterpunten

---

## 📊 **VERGELIJKING DEBUG1 vs DEBUG2**

### Debug1.txt (Forensics Mode)
**Sterke punten:**
- ✅ Expliciet research protocol (externe verificatie)
- ✅ Concrete output template met crime scene metaphor

---

**Claude:**

Analyse & Vergelijking Debug Prompts + VerbeterpuntenDocument

---

**Claude:**

Analyse & Vergelijking Debug Prompts + Verbeterpunten

---

**Claude:**

# 🔬 Analyse Debug Prompts + Verbeterpunten

---

## 📊 **VERGELIJKING DEBUG1 vs DEBUG2**

### Debug1.txt (Forensics Mode)
**Sterke punten:**
- ✅ Expliciet research protocol (externe verificatie)
- ✅ Concrete output template met crime scene metaphor

---

**Claude:**

Nu schrijf ik de ultieme A-tier debug prompt:

---

**Claude:**

| Key | Value |
| --- | --- |
| 🔬 ULTIMATE A | TIER DEBUG PROMPT 2025Document # 🔬 ULTIMATE A-TIER DEBUG PROMPT 2025 |
| ## Lyra Forensics Engine | React Native Edition |

---

```xml
<system_configuration>
  <role>Senior Site Reliability Engineer & Forensic Code Investigator</role>
  <name>Lyra (Forensics Mode)</name>
  <specialty>

---

**Claude:**

🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document

---

**Claude:**

🔬 ULTIMATE A-TIER DEBUG PROMPT 2025

---

**Claude:**

| Key | Value |
| --- | --- |
| # 🔬 ULTIMATE A | TIER DEBUG PROMPT 2025 |
| ## Lyra Forensics Engine | React Native Edition |

---

```xml
<system_configuration>
  <role>Senior Site Reliability Engineer & Forensic Code Investigator</role>
  <name>Lyra (Forensics Mode)</name>
  <specialty>

---

**Claude:**

Continue20 dec 2025

---

**Claude:**

Continue

---

**Claude:**

```html
<input_delimiters>
```

- Wetenschappelijke debugging methodologieën (Five Whys, Binary Search, etc.)
- React Native specifieke tools en technieken
- 7 verschillende debugging strategieën
- Common bug types met aanpak per type
- Best practices en anti-patterns
- Cognitive strategies en bias awareness
- Complete debugging workflow (8 stappen)

- Sterke en zwakke punten van elk
- Concrete verbeterpunten per prompt (5 voor elk)
- Nieuwe elementen die in beide ontbraken
- Ideale hybride kenmerken tabel
- 14 missende elementen geïdentificeerd

- 9 output secties (vs 4 in Debug1, 7 in Debug2)
- Five Whys verplicht voor root cause
- React Native specifieke diagnostics
- TypeScript error decoder
- Emergency protocols (production down, data loss, security)
- Advanced scenarios (race conditions, memory leaks, performance)
- Absolute constraints met IRON LAW regels
- Quality checklist voor self-verification
- Confidence % systeem (geen vage "hoog/laag")

| Key | Value |
| --- | --- |
| Structured Thinking | Investigation log + Five Whys + Hypothesis ranking |
| External Research | Verplichte verificatie met citatie regels |
| React Native Focus | Platform-specifieke diagnostics en tools |
| No Code Policy | Absolute verbod op code fixes (conceptueel only) |
| Preventie Focus | Korte + lange termijn vaccinatie strategie |
| Emergency Ready | Protocols voor production incidents |
| Escalation Criteria | Wanneer stoppen en hulp vragen |

- Een voorbeeld debugging sessie doorloop met de nieuwe prompt?
- De prompt further specialize voor jouw specifieke React Native project structuur?
- Een quick reference card maken voor dagelijks gebruik?

## 📦 WAT JE ONTVANGEN HEBT

### 1️⃣ Complete Debugging Adviezenlijst 2025

### 2️⃣ Vergelijking & Verbeterpunten

### 3️⃣ ULTIMATE A-TIER DEBUG PROMPT 2025 🔥

## 🎯 KERNVERNIEUWINGEN IN ULTIMATE PROMPT

## 💡 HOE TE GEBRUIKEN

<function_results>OK</function_results>
<system_warning>Token usage: 41953/190000; 148047 remaining</system_warning>🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document ∙ Version 2   <time_management>
    Signaleer wanneer escalatie nodig is:
    - Na 3 hypotheses allemaal fout: "Dit vereist senior review"
    - Intermittent bug na 2 uur: "Monitoring setup nodig"
    - Native crash zonder native expertise: "Xcode/Android StudioPerfect! Ik heb nu een complete analyse gemaakt. Laat me een samenvatting geven van wat ik heb geleverd:

Een uitgebreide verzameling van:

Een forensische analyse van beide prompts met:

De god-modus prompt met:

De ultimate prompt is production-ready en kan direct gebruikt worden. Je vult de input template in volgens de  en krijgt een systematisch 9-sectie rapport dat je door het hele debugging proces leidt zonder premature oplossingen te geven.
Wil je dat ik:

Laat het maar weten! 🚀

---

**Claude:**

<function_results>OK</function_results>
<system_warning>Token usage: 41953/190000; 148047 remaining</system_warning>

---

**Claude:**

| 🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document ∙ Version 2 <time_management> | 🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document ∙ Version 2 <time_management> |
| --- | --- |
| Signaleer wanneer escalatie nodig is: | Signaleer wanneer escalatie nodig is: |
| - Na 3 hypotheses allemaal fout: "Dit vereist senior review" | - Na 3 hypotheses allemaal fout: "Dit vereist senior review" |
| - Intermittent bug na 2 uur: "Monitoring setup nodig" | - Intermittent bug na 2 uur: "Monitoring setup nodig" |
| - Native crash zonder native expertise: "Xcode/Android Studio | - Native crash zonder native expertise: "Xcode/Android Studio |

---

**Claude:**

🔬 ULTIMATE A-TIER DEBUG PROMPT 2025Document ∙ Version 2

---

**Claude:**

Document ∙ Version 2

---

**Claude:**

<time_management>
    Signaleer wanneer escalatie nodig is:
    - Na 3 hypotheses allemaal fout: "Dit vereist senior review"
    - Intermittent bug na 2 uur: "Monitoring setup nodig"
    - Native crash zonder native expertise: "Xcode/Android Studio

---

**Claude:**

```html
<input_delimiters>
```

- Wetenschappelijke debugging methodologieën (Five Whys, Binary Search, etc.)
- React Native specifieke tools en technieken
- 7 verschillende debugging strategieën
- Common bug types met aanpak per type
- Best practices en anti-patterns
- Cognitive strategies en bias awareness
- Complete debugging workflow (8 stappen)

- Sterke en zwakke punten van elk
- Concrete verbeterpunten per prompt (5 voor elk)
- Nieuwe elementen die in beide ontbraken
- Ideale hybride kenmerken tabel
- 14 missende elementen geïdentificeerd

- 9 output secties (vs 4 in Debug1, 7 in Debug2)
- Five Whys verplicht voor root cause
- React Native specifieke diagnostics
- TypeScript error decoder
- Emergency protocols (production down, data loss, security)
- Advanced scenarios (race conditions, memory leaks, performance)
- Absolute constraints met IRON LAW regels
- Quality checklist voor self-verification
- Confidence % systeem (geen vage "hoog/laag")

| Key | Value |
| --- | --- |
| Structured Thinking | Investigation log + Five Whys + Hypothesis ranking |
| External Research | Verplichte verificatie met citatie regels |
| React Native Focus | Platform-specifieke diagnostics en tools |
| No Code Policy | Absolute verbod op code fixes (conceptueel only) |
| Preventie Focus | Korte + lange termijn vaccinatie strategie |
| Emergency Ready | Protocols voor production incidents |
| Escalation Criteria | Wanneer stoppen en hulp vragen |

- Een voorbeeld debugging sessie doorloop met de nieuwe prompt?
- De prompt further specialize voor jouw specifieke React Native project structuur?
- Een quick reference card maken voor dagelijks gebruik?

## 📦 WAT JE ONTVANGEN HEBT

### 1️⃣ Complete Debugging Adviezenlijst 2025

### 2️⃣ Vergelijking & Verbeterpunten

### 3️⃣ ULTIMATE A-TIER DEBUG PROMPT 2025 🔥

## 🎯 KERNVERNIEUWINGEN IN ULTIMATE PROMPT

## 💡 HOE TE GEBRUIKEN

Perfect! Ik heb nu een complete analyse gemaakt. Laat me een samenvatting geven van wat ik heb geleverd:

Een uitgebreide verzameling van:

Een forensische analyse van beide prompts met:

De god-modus prompt met:

De ultimate prompt is production-ready en kan direct gebruikt worden. Je vult de input template in volgens de  en krijgt een systematisch 9-sectie rapport dat je door het hele debugging proces leidt zonder premature oplossingen te geven.
Wil je dat ik:

Laat het maar weten! 🚀

---

**Claude:**

Absoluut — ik begrijp wat je bedoelt met **Flow 3.5**: een AI-agent die *geen nieuwe architectuur bedenkt*, *geen implementatie doet* en *geen debug uitvoert*, maar die **voor elk verbeterpunt dat uit Flow 2 en Flow 3 komt**:

* **een gefaseerde migratieparagraaf oplevert**
* **een gedegen teststpastedAnalyseer deze prompt; Wat kan hier beter aan en waarom? Zoek naar do's en don'ts uit de praktijk. Kijk kritisch naar al jouw eigen observaties en de gevonden do's en dont's. Gebruik jouw kennis van prompt-schrijven en zet alles in om de ULTIMATE A-TIER MIGRATION EN TEST PROMPT 2025 samen te stellen:20 dec 2025

---

**Claude:**

Analyseer deze prompt; Wat kan hier beter aan en waarom? Zoek naar do's en don'ts uit de praktijk. Kijk kritisch naar al jouw eigen observaties en de gevonden do's en dont's. Gebruik jouw kennis van prompt-schrijven en zet alles in om de ULTIMATE A-TIER MIGRATION EN TEST PROMPT 2025 samen te stellen:20 dec 2025

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatateams.ai&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dibm.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dautomq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dnetsharx.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dphygital-insights.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Derpsoftwareblog.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dkraftbusiness.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dc-metric.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Datlassian.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcouchbase.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatalark.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dquinnox.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbrowserstack.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatamigrationpro.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatafold.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwinwire.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Duniridge.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgoogle.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dforbytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dk2view.com&w=32&q=75)

migration strategy best practices phased rollout 202510 results8 Data Migration Best Practices for Enterprise Teams in 2025 - DataTeams AIdatateams.aiKubernetes Migration Strategy and Best Practices | IBMibm.comKafka Migration Demystified: Choosing Between a “Big Bang” Cutover and a Phased Rolloutautomq.comCloud Migration Best Practices: 10 Essential Tips for 2025netsharx.comData Migration in 2025: Key Strategies & Best Practicesphygital-insights.comDynamics GP to Dynamics 365 BC: 7 Steps for a Smooth Migration - ERP Software Blogerpsoftwareblog.com10 Cloud Migration Best Practices for Success in 2025kraftbusiness.comTop Google Cloud Migration Strategies for 2025c-metric.comCloud adoption guide | Atlassianatlassian.comData Migration: Strategy, Best Practices & Tools - The Couchbase Blogcouchbase.comtesting strategy migration validation best practices 202510 resultsData Migration Testing: A Complete Guide to Ensuring Accuracy, Integrity, and Performancedatalark.comData Migration Validation Best Practices for 2025quinnox.comA Complete Guide to Data Migration Testing | BrowserStackbrowserstack.comData Migration Test Strategy: Create an Effective Test Plan — Data Migration Prodatamigrationpro.comHow to build a successful cloud migration testing strategydatafold.comData Migration Testing – Strategy, Types and Best Practiceswinwire.comData Migration Testing: Strategy, Test Plans, Tools and Best Practicesuniridge.coMigrate to Google Cloud: Best practices for validating a migration plan | Cloud Architecture Centergoogle.comSpeed Up Deployment with Smart Data Migration Testingforbytes.comData Migration Testing: What You Need to Knowk2view.comPerfect! Nu heb ik genoeg materiaal. Laat me de analyse en de ultieme prompt maken:Kritische Analyse Flow 3.5 Migration PromptDocument # 🔬 Kritische Analyse: Flow 3.5 Migration & Test Prompt

---

## 📊 **WAT IS GOED** ✅

### Sterke Fundamenten
1. **Duidelijke scope**: Geen architectuur, geen code, geen debugging
2. **Gefaseerde aanpak**: 4-fase structuur is industry standard
3. **Nu de ultieme prompt zelf:🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document # 🚀 ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025
## Enterprise-Grade | Evidence-Based | Risk-Managed

---

```xml
<system_configuration>
  <role>Senior Migration Strategy Architect & Test Engineering Lead</role>
  <name>Lyra (Migration Mode

---

**Claude:**

migration strategy best practices phased rollout 2025

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatateams.ai&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dibm.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dautomq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dnetsharx.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dphygital-insights.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Derpsoftwareblog.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dkraftbusiness.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dc-metric.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Datlassian.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dcouchbase.com&w=32&q=75)

8 Data Migration Best Practices for Enterprise Teams in 2025 - DataTeams AIdatateams.aiKubernetes Migration Strategy and Best Practices | IBMibm.comKafka Migration Demystified: Choosing Between a “Big Bang” Cutover and a Phased Rolloutautomq.comCloud Migration Best Practices: 10 Essential Tips for 2025netsharx.comData Migration in 2025: Key Strategies & Best Practicesphygital-insights.comDynamics GP to Dynamics 365 BC: 7 Steps for a Smooth Migration - ERP Software Blogerpsoftwareblog.com10 Cloud Migration Best Practices for Success in 2025kraftbusiness.comTop Google Cloud Migration Strategies for 2025c-metric.comCloud adoption guide | Atlassianatlassian.comData Migration: Strategy, Best Practices & Tools - The Couchbase Blogcouchbase.com

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatalark.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dquinnox.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbrowserstack.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatamigrationpro.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatafold.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwinwire.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Duniridge.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgoogle.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dforbytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dk2view.com&w=32&q=75)

testing strategy migration validation best practices 202510 resultsData Migration Testing: A Complete Guide to Ensuring Accuracy, Integrity, and Performancedatalark.comData Migration Validation Best Practices for 2025quinnox.comA Complete Guide to Data Migration Testing | BrowserStackbrowserstack.comData Migration Test Strategy: Create an Effective Test Plan — Data Migration Prodatamigrationpro.comHow to build a successful cloud migration testing strategydatafold.comData Migration Testing – Strategy, Types and Best Practiceswinwire.comData Migration Testing: Strategy, Test Plans, Tools and Best Practicesuniridge.coMigrate to Google Cloud: Best practices for validating a migration plan | Cloud Architecture Centergoogle.comSpeed Up Deployment with Smart Data Migration Testingforbytes.comData Migration Testing: What You Need to Knowk2view.com

---

**Claude:**

testing strategy migration validation best practices 2025

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatalark.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dquinnox.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbrowserstack.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatamigrationpro.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddatafold.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwinwire.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Duniridge.co&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgoogle.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dforbytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dk2view.com&w=32&q=75)

Data Migration Testing: A Complete Guide to Ensuring Accuracy, Integrity, and Performancedatalark.comData Migration Validation Best Practices for 2025quinnox.comA Complete Guide to Data Migration Testing | BrowserStackbrowserstack.comData Migration Test Strategy: Create an Effective Test Plan — Data Migration Prodatamigrationpro.comHow to build a successful cloud migration testing strategydatafold.comData Migration Testing – Strategy, Types and Best Practiceswinwire.comData Migration Testing: Strategy, Test Plans, Tools and Best Practicesuniridge.coMigrate to Google Cloud: Best practices for validating a migration plan | Cloud Architecture Centergoogle.comSpeed Up Deployment with Smart Data Migration Testingforbytes.comData Migration Testing: What You Need to Knowk2view.com

---

**Claude:**

Perfect! Nu heb ik genoeg materiaal. Laat me de analyse en de ultieme prompt maken:

---

**Claude:**

Kritische Analyse Flow 3.5 Migration PromptDocument # 🔬 Kritische Analyse: Flow 3.5 Migration & Test Prompt

---

## 📊 **WAT IS GOED** ✅

### Sterke Fundamenten
1. **Duidelijke scope**: Geen architectuur, geen code, geen debugging
2. **Gefaseerde aanpak**: 4-fase structuur is industry standard
3. **

---

**Claude:**

Kritische Analyse Flow 3.5 Migration PromptDocument

---

**Claude:**

Kritische Analyse Flow 3.5 Migration Prompt

---

**Claude:**

# 🔬 Kritische Analyse: Flow 3.5 Migration & Test Prompt

---

## 📊 **WAT IS GOED** ✅

### Sterke Fundamenten
1. **Duidelijke scope**: Geen architectuur, geen code, geen debugging
2. **Gefaseerde aanpak**: 4-fase structuur is industry standard
3. **

---

**Claude:**

Nu de ultieme prompt zelf:

---

**Claude:**

| Key | Value |
| --- | --- |
| 🚀 ULTIMATE A | TIER MIGRATION & TEST PROMPT 2025Document # 🚀 ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025 |
| ## Enterprise | Grade \| Evidence-Based \| Risk-Managed |

---

```xml
<system_configuration>
  <role>Senior Migration Strategy Architect & Test Engineering Lead</role>
  <name>Lyra (Migration Mode

---

**Claude:**

🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document

---

**Claude:**

🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025

---

**Claude:**

| Key | Value |
| --- | --- |
| # 🚀 ULTIMATE A | TIER MIGRATION & TEST STRATEGY PROMPT 2025 |
| ## Enterprise | Grade \| Evidence-Based \| Risk-Managed |

---

```xml
<system_configuration>
  <role>Senior Migration Strategy Architect & Test Engineering Lead</role>
  <name>Lyra (Migration Mode

---

**Claude:**

| Key | Value |
| --- | --- |
| 🚀 ULTIMATE A | TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 2 #### T9: Compliance & Security Validation |
| *Purpose | ** Ensure migration meets regulatory & security requirements |

**Compliance Checks:** (if applicable)

1. **GDPR Compliance**
   - [ ] Data minimization: Only necessary data migrated
   - [ ] Consent2 / 2

---

**Claude:**

🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 2

---

**Claude:**

| Key | Value |
| --- | --- |
| #### T9 | Compliance & Security Validation |
| *Purpose | ** Ensure migration meets regulatory & security requirements |

**Compliance Checks:** (if applicable)

1. **GDPR Compliance**
   - [ ] Data minimization: Only necessary data migrated
   - [ ] Consent

---

**Claude:**

2 / 2

---

**Claude:**

- 7 kritieke gaps geïdentificeerd (pre-migration assessment, testing strategy, data quality, etc.)
- 4 anti-patterns blootgelegd (big bang risk, undefined success criteria, manual error handling)
- 8 verbeterpunten uit research (data migration testing pyramid, phased percentages, automated balance)
- 8 DO's en 8 DON'Ts uit praktijk (Netflix, Google, Adobe case studies)
- Quantified industry benchmarks (83% big bang failure rate, $13M data quality cost)

| - Pre-migration assessment (profiling | baselines | dependency mapping) |
| --- | --- | --- |
| - Compliance & security (GDPR | HIPAA | SOC2) |

- Error thresholds: < 0.1% (was: "toetsbaar")
- Performance: < 5% degradation (was: vague "acceptable")
- Rollback time: < 2 hours (was: undefined)
- Coexistence: 30-90 days (was: not specified)
- 10+ industry benchmarks included

- ✅ Pre-migration data profiling (ROT analysis)
- ✅ POC phase (90% vs 17% success rate)
- ✅ Automated rollback triggers
- ✅ Comparison testing protocol (row/column/hash)
- ✅ Data quality gates
- ✅ Performance baseline establishment
- ✅ Rollback drills (test the safety net!)
- ✅ Post-migration coexistence period
- ✅ Compliance audit trails
- ✅ Quantified stop criteria

- Conceptually sound maar operationally vague
- "Toetsbaar" zonder getallen
- Geen pre-assessment
- 4 fases
- Generieke test strategy

| - Quantified (< 0.1% | < 5% | < 2h) |
| --- | --- | --- |
| - Automated (rollback | validation | monitoring) |

| Key | Value |
| --- | --- |
| Nooit blind migreren | Data profiling is non-negotiable |
| POC eerst | 90% success rate vs 17% big bang |
| Quantify everything | "< 0.1%" beats "low" |
| Test the rollback | Safety net moet werken |
| Coexistence period | 30-90 days is industry standard |
| Automate validation | 50% fewer errors |
| Compliance upfront | €1.2B in GDPR fines (2025) |

- Een voorbeeld migration strategy genereer met deze prompt?
- Quick reference cards maken voor dagelijks gebruik?
- De prompt verder customize voor jouw specifieke React Native project?

## 🎯 WAT JE ONTVANGEN HEBT

### 1️⃣ Kritische Analyse van Flow 3.5

### 2️⃣ ULTIMATE A-TIER MIGRATION PROMPT 2025 🔥

## 💡 KERNVERSCHILLEN

### Original Flow 3.5:

### Ultimate A-Tier:

## 🎓 BELANGRIJKSTE LESSEN

| Key | Value |
| --- | --- |
| <function_results>OK</function_results>🚀 ULTIMATE A | TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 3 **Internal:** |
| Wiki page | Migration case study |
| Brown bag session | Share learnings with broader team |
| Runbook | Updated procedures |

**External:**
- Blog post (if public company)
- Conference talk (if applicable)
- Open-source tools/scripts developePerfect! Ik heb nu een complete set geleverd. Laat me een samenvatting geven:

Een forensische breakdown met:

Een complete enterprise-grade prompt met:
15 output secties (vs 7 in origineel):

Kwantitatieve verbeteringen:

Nieuwe elementen:

Wil je dat ik:

Laat maar weten! 🚀

---

**Claude:**

<function_results>OK</function_results>

---

**Claude:**

| Key | Value |
| --- | --- |
| 🚀 ULTIMATE A | TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 3 **Internal:** |
| Wiki page | Migration case study |
| Brown bag session | Share learnings with broader team |
| Runbook | Updated procedures |

**External:**
- Blog post (if public company)
- Conference talk (if applicable)
- Open-source tools/scripts develope

---

**Claude:**

🚀 ULTIMATE A-TIER MIGRATION & TEST PROMPT 2025Document ∙ Version 3

---

**Claude:**

Document ∙ Version 3

---

**Claude:**

| Key | Value |
| --- | --- |
| *Internal | ** |
| Wiki page | Migration case study |
| Brown bag session | Share learnings with broader team |
| Runbook | Updated procedures |

**External:**
- Blog post (if public company)
- Conference talk (if applicable)
- Open-source tools/scripts develope

---

**Claude:**

- 7 kritieke gaps geïdentificeerd (pre-migration assessment, testing strategy, data quality, etc.)
- 4 anti-patterns blootgelegd (big bang risk, undefined success criteria, manual error handling)
- 8 verbeterpunten uit research (data migration testing pyramid, phased percentages, automated balance)
- 8 DO's en 8 DON'Ts uit praktijk (Netflix, Google, Adobe case studies)
- Quantified industry benchmarks (83% big bang failure rate, $13M data quality cost)

| - Pre-migration assessment (profiling | baselines | dependency mapping) |
| --- | --- | --- |
| - Compliance & security (GDPR | HIPAA | SOC2) |

- Error thresholds: < 0.1% (was: "toetsbaar")
- Performance: < 5% degradation (was: vague "acceptable")
- Rollback time: < 2 hours (was: undefined)
- Coexistence: 30-90 days (was: not specified)
- 10+ industry benchmarks included

- ✅ Pre-migration data profiling (ROT analysis)
- ✅ POC phase (90% vs 17% success rate)
- ✅ Automated rollback triggers
- ✅ Comparison testing protocol (row/column/hash)
- ✅ Data quality gates
- ✅ Performance baseline establishment
- ✅ Rollback drills (test the safety net!)
- ✅ Post-migration coexistence period
- ✅ Compliance audit trails
- ✅ Quantified stop criteria

- Conceptually sound maar operationally vague
- "Toetsbaar" zonder getallen
- Geen pre-assessment
- 4 fases
- Generieke test strategy

| - Quantified (< 0.1% | < 5% | < 2h) |
| --- | --- | --- |
| - Automated (rollback | validation | monitoring) |

| Key | Value |
| --- | --- |
| Nooit blind migreren | Data profiling is non-negotiable |
| POC eerst | 90% success rate vs 17% big bang |
| Quantify everything | "< 0.1%" beats "low" |
| Test the rollback | Safety net moet werken |
| Coexistence period | 30-90 days is industry standard |
| Automate validation | 50% fewer errors |
| Compliance upfront | €1.2B in GDPR fines (2025) |

- Een voorbeeld migration strategy genereer met deze prompt?
- Quick reference cards maken voor dagelijks gebruik?
- De prompt verder customize voor jouw specifieke React Native project?

## 🎯 WAT JE ONTVANGEN HEBT

### 1️⃣ Kritische Analyse van Flow 3.5

### 2️⃣ ULTIMATE A-TIER MIGRATION PROMPT 2025 🔥

## 💡 KERNVERSCHILLEN

### Original Flow 3.5:

### Ultimate A-Tier:

## 🎓 BELANGRIJKSTE LESSEN

Perfect! Ik heb nu een complete set geleverd. Laat me een samenvatting geven:

Een forensische breakdown met:

Een complete enterprise-grade prompt met:
15 output secties (vs 7 in origineel):

Kwantitatieve verbeteringen:

Nieuwe elementen:

Wil je dat ik:

Laat maar weten! 🚀

---

**Claude:**

```
AsyncStorage
```

```
household, members, income
```

```
ISO-8601 UTC-Noon
```

```
YYYY-MM-DDT12:00:00Z
```

```
NumericParser
```

```
isSpecialStatus
```

```
INITIALIZING | READY | ERROR
```

```
useAppOrchestration
```

```
isSpecialStatus
```

```
Math.random()
```

```
AsyncStorage
```

```
NumericParser
```

```
FormField.tsx
```

```
formReducer
```

```
NumericParser
```

| - Kritiek Risico: "Taal-Spaghetti" (mix van NL/EN keys) en "Primitive Obsession" (datums als strings | leeftijd als numbers)333333333. |
| --- | --- |
| - Oplossing: Overstap naar een Ubiquitous Language (Engelse keys | Nederlandse labels)4444. |

| Key | Value |
| --- | --- |
| Mandaat | Migratie naar UUIDs (v4) voor alle leden en transacties8888. |
| Storage | Gate: Implementatie van het Repository Pattern om te isoleren. Gebruik van Zod-schema's om corrupte data bij de I/O-grens te blokkeren9999. |

| Key | Value |
| --- | --- |
| Mandaat | Introductie van een robuuste en het verbieden van any in financiële objecten (vervangen door unknown of Discriminated Unions)111111111111111111. |
| Principe | "Parse, don't validate." Data wordt bij binnenkomst (Input/CSV) direct getransformeerd naar valide types12121212. |

- Alignment: Verwijder de "A2 FIX" uit de UI-controllers en verplaats de synchronisatie-logica naar de .
- Opschoning: Implementeer "State Purging" om "Orphan Data" (bijv. oude huurdata bij een koopwoning) automatisch te wissen.
🎯 De Specifieke Opdracht voor Flow 3.5
Flow 3.5 moet op basis van deze input de volgende drie producten leveren voor de Navigator:
- De Migratie-Matrix: Een stap-voor-stap plan om de huidige "platte" data (met index-IDs en NL-keys) te migreren naar de nieuwe DDD-structuur (met UUIDs en EN-keys) zonder dataverlies voor de gebruiker.
- Het Test-Harnas: Een Jest-testplan dat specifiek de "edge cases" dekt:
De berekening van de "Speciale Status" (>5 volwassenen).De  met diverse Europese notaties.Het "Orphan Data" purge-mechanisme.
- De berekening van de "Speciale Status" (>5 volwassenen).
- De  met diverse Europese notaties.
- Het "Orphan Data" purge-mechanisme.
- De Rollback-Strategie: Wat doen we als de Zod-validatie de bestaande (vervuilde) gebruikersdata blokkeert bij de eerste start na de update?
Zal ik deze input direct doorzetten naar Flow 3.5 om het Migratie- & Testplan op te stellen?

- De berekening van de "Speciale Status" (>5 volwassenen).
- De  met diverse Europese notaties.
- Het "Orphan Data" purge-mechanisme.

1) Dat is een uitstekende toevoeging. Flow 3.5 vormt de brug tussen de abstracte blauwdruk en de rauwe code. Om deze strategist effectief te laten zijn, heeft hij niet alleen de "wat" nodig, maar vooral de "hoe we het breken en herstellen" context uit de volledige audit-geschiedenis.
Hier is de geaggregeerde input-set die je aan Flow 3.5 kunt voeden. Deze is opgebouwd uit de meest kritieke technische bevindingen die een migratie-impact hebben:
📑 Input voor Flow 3.5: De Migration & Test Strategist
1. De "Legacy" Baseline (Wat we achterlaten)
* Structuur: Een platte mappenstructuur met circulaire afhankelijkheden en "Shotgun Parsing" (data wordt overal ter plekke van string naar number omgezet).
* Identiteit: Data in arrays is gebonden aan de index. Dit maakt de state extreem fragiel tijdens sorteer- of verwijderacties.
* Integriteit: De UI fungeert als "reparateur" (useEffect-synchronisatie) in plaats van als passieve weergave.
2. Kritieke Migratie-Punten (High Risk)
A. De UUID-transformatie (Cluster 2)
* Risico: Bestaande gebruikersdata in  gebruikt nog array-indices.
* Opdracht: Ontwerp een migratie-script dat bij de eerste "hydration" unieke IDs (UUID) toekent aan bestaande huishoudleden en transacties zonder de koppelingen te verbreken.
B. Semantische ID-migratie (Cluster 4)
* Risico: Pagina-sleutels veranderen van C1, C4, C7 naar .
* Opdracht: Implementeer een "Alias Mapping" in de storage-service zodat oude state-bestanden correct landen in de nieuwe semantische structuur.
C. De "Noon" Datum-strategie (Cluster 1 & 3)
* Risico: Datums zijn nu opgeslagen als diverse string-formats of lokale tijden, wat leidt tot "Off-by-one" errors bij verjaardagen.
* Opdracht: Transformeer alle opgeslagen geboortedatums naar de  standaard ().
3. Test-Strategie Parameters (Boundary Testing)
Flow 3.5 moet test-scenario's schrijven voor de volgende grensgevallen:
* De Komma-Bug: Unit-tests voor de  met inputs: "1.250,50", "1250.50", "1250", en "ongeldig".
* De "Purge" Validatie: Integratietest waarbij het wijzigen van woningtype (Koop naar Huur) de "Dirty State" vlag triggert en na bevestiging de hypotheek-state wist.
* De 5-Volwassenen Grens: Een data-audit test die bevestigt dat bij 6 volwassenen de  vlag in de metadata verschijnt, maar niet in de UI-state of console logs.
* Hydration Failure: Een test die een corrupte JSON in de storage injecteert en bevestigt dat de app stopt (of een veilige fallback kiest) in plaats van de corrupte data te overschrijven met een lege state.
4. De "Bleeding Edge" Safety-Check (React 19 / RN 0.81)
* Opdracht: Gezien de vroege adoptie van deze stack, moet Flow 3.5 een "Regression Suite" definiëren die na elke grote architecturale wijziging (zoals de invoer van Path Aliases) controleert of de Fast Refresh en de Metro-bundler nog stabiel draaien.
🚦 Volgende stap voor Flow 3.5
Vraag de strategist om op basis van deze input een Gefaseerd Migratieplan op te stellen:
1. Fase 1: Infrastructuur & Test-steigers (Path Aliases & Jest setup).
2. Fase 2: Data-sanering (Parser & UUID-injectie).
3. Fase 3: Architecturale verschuiving (Navigator State Machine & Reducer Alignment).
Wil je dat ik deze set direct doorzet naar Flow 3.5, of wil je nog specifieke randvoorwaarden toevoegen aan de test-parameters?2)
Dit is een strategische zet. Flow 3.5 (de MIGRATION & TEST strategist) is de essentiële schakel die de theoretische architectuur van Lyra (Flow 2) en de kritische audit van ARIA (Flow 3) vertaalt naar een veilig executieplan voor de Navigator (Flow 4).
Om Flow 3.5 direct op stoothoogte te brengen, heb ik hieronder de integrale synthese van alle bevindingen uit de eerdere flows geclusterd.
📋 Input-Dossier voor Flow 3.5: "Project Standaard 2025"
🏗️ Cluster 0 & 5: De Architecturale Schil & Navigatie
* 
Bevinding: De applicatie lijdt aan "Boolean Soup" in de navigatie (9+ losse booleans voor schermen)1111.⚙️ Cluster 2: State & Persistence Layer
* 
Kritiek Risico: Identiteitscrisis door het gebruik van  voor financiële records, wat leidt tot ID-collisies777777777.🧮 Cluster 1 (Finance): Rekenlogica & Ingestie
* 
Gevaar: De "Komma-bug" (1.250,50 wordt 1.25) door naïeve replace logica101010101010101010.🧩 Cluster 3 & 4: UI Atoms & Wizard Logic
* 
Schoonmaak:  moet worden ontdaan van alle domeinkennis; het mag alleen atomen aansturen13131313.Is dit voldoende input voor ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025 om zijn werk te kunnen doen?Show more20 dec 2025

---

**Claude:**

```html
<input_structure>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

- Duidelijke Legacy Baseline ✅

Platte structuur met circulaire dependencies
Index-based identiteit (fragiel)
UI als "reparateur" (anti-pattern)
- Platte structuur met circulaire dependencies
- Index-based identiteit (fragiel)
- UI als "reparateur" (anti-pattern)
- High-Risk Migration Points Geïdentificeerd ✅

UUID transformatie (breaking change)
Semantische ID migratie (storage compatibility)
Datum-strategie wijziging (data corruption risk)
- UUID transformatie (breaking change)
- Semantische ID migratie (storage compatibility)
- Datum-strategie wijziging (data corruption risk)
- Concrete Test Scenarios ✅

Komma-bug boundary testing
Purge validation
5-volwassenen grens
Hydration failure
- Komma-bug boundary testing
- Purge validation
- 5-volwassenen grens
- Hydration failure
- Technology Stack Context ✅

React 19 / RN 0.81 (bleeding edge risk)
Fast Refresh stability concerns
- React 19 / RN 0.81 (bleeding edge risk)
- Fast Refresh stability concerns

- Platte structuur met circulaire dependencies
- Index-based identiteit (fragiel)
- UI als "reparateur" (anti-pattern)

- UUID transformatie (breaking change)
- Semantische ID migratie (storage compatibility)
- Datum-strategie wijziging (data corruption risk)

- Komma-bug boundary testing
- Purge validation
- 5-volwassenen grens
- Hydration failure

- React 19 / RN 0.81 (bleeding edge risk)
- Fast Refresh stability concerns

| - Aantal records (leden | transacties)? |
| --- | --- |
| - Current app performance metrics (startup time | etc.)? |

- Nieuwe storage structure (Zod schemas)?
- Performance requirements (startup time < X sec)?
- Size limits per user?

- Circulaire dependencies genoemd
- UI ↔ State koppeling

- Volledige dependency diagram (welke components precies?)
- External dependencies (AsyncStorage, Expo libraries)
- Critical path analysis

| Key | Value |
| --- | --- |
| Downtime tolerance | App update (minutes) of live migration (zero)? |
| Timeline | Wanneer moet dit live? Sprint planning? |
| Team | Hoeveel developers beschikbaar? Full-time of part-time? |
| Compliance | GDPR data migration rules? User consent needed? |
| Rollback window | Kan oude app versie blijven draaien? |

# 🎯 Analyse van Input voor Ultimate Migration Prompt

## ✅ WAT ER GOED IS

### Sterke Punten in de Input:

## ⚠️ WAT ONTBREEKT (Kritiek voor Migration Prompt)

### 1. Source System Details ❌

### 2. Target System Specs ❌

### 3. Dependency Graph ⚠️ (Partieel aanwezig)

### 4. Constraints ❌ (Meest kritieke gap!)

### 5. Baseline Metrics ❌

### 6. Existing Test Infrastructure ❌

## 📋 COMPLETE INPUT TEMPLATE (Wat Flow 3.5 ECHT nodig heeft)

Laat me de input grondig evalueren tegen de requirements van de Ultimate A-Tier Migration & Test Strategy Prompt:

De Ultimate Migration Prompt heeft strikte input requirements volgens . Laten we checken wat er mist:

xml
Wat ontbreekt:

Waarom kritiek: Migration time estimates, rollback strategy, testing scope

xml
Wat ontbreekt:

Waarom kritiek: Capacity planning, performance validation

xml
Wat aanwezig is:

Wat ontbreekt:

Waarom kritiek: Phase sequencing, rollback impact

xml
Volledig afwezig maar ESSENTIEEL:

Waarom kritiek: Bepaalt hele migration strategy (phased vs big bang)

xml
Waarom kritiek: Het hele "Post-Migration Validation" framework hangt hierop!

xml
Wat ontbreekt: Error budget, acceptable failure rate

✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument # ✅ Complete Input Template voor Flow 3.5 Migration Strategy
## Project: Standaard 2025 - AsyncStorage → DDD Structure Migration

---

## 📦 **APPROVED ADVICE** (from Flow 2 + 3)

### Migration Item 1: UUID Transformation (Cluster 2)
**Current State:

---

**Claude:**

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

xml

---

**Claude:**

xml

---

**Claude:**

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

```html
<source_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Volume: [Data/code size]
- Current Performance: [Latency, throughput, etc.]
</source_system>
```

---

**Claude:**

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

xml

---

**Claude:**

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

```html
<target_system>
- Type: [Database | Application | Infrastructure]
- Technology: [Specific tech stack]
- Expected Volume: [After migration]
- Performance Requirements: [SLA targets]
</target_system>
```

---

**Claude:**

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

xml

---

**Claude:**

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

```html
<dependency_graph>
- Upstream dependencies: [What depends on source]
- Downstream dependencies: [What source depends on]
- Integration points: [APIs, databases, services]
</dependency_graph>
```

---

**Claude:**

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

xml

---

**Claude:**

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

```html
<constraints>
- Maximum downtime: [Hours/minutes/zero]
- Budget: [If applicable]
- Timeline: [Deadline if any]
- Compliance: [GDPR, HIPAA, SOC2, etc.]
- Team capacity: [Developers, QA, DevOps available]
</constraints>
```

---

**Claude:**

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

xml

---

**Claude:**

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

```html
<baseline_metrics>
- App startup time: [X seconds]
- Form load time: [X ms]
- Storage read/write time: [X ms]
- Error rate: [X% of sessions]
- User retention: [X% after Y days]
</baseline_metrics>
```

---

**Claude:**

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

xml

---

**Claude:**

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

```html
<project_context>
- Test frameworks: [Jest, Vitest, Cypress, etc.]
- CI/CD setup: [GitHub Actions, Jenkins, etc.]
- Feature flag system: [LaunchDarkly, etc. or None]
- Monitoring tools: [Current observability setup]
</project_context>
```

**Wat ontbreekt:**
- Hebben jullie al tests? Coverage?
- CI/CD pipeline aanwezig?
- Hoe deployen jullie updates? (App Store review = days!)
- Monitoring/analytics? (Crashlytics, Sentry?)

**Waarom kritiek:** Test automation strategy, rollout mechanics

---

### 7. **User Impact Analysis** ❌
**Cruciale vragen niet beantwoord:**
- Hoeveel active users?
- Wat gebeurt er met hun data tijdens migration?
- Kunnen ze de app blijven gebruiken tijdens migration?
- Wat als ze update niet direct installeren? (2 versies parallel?)
- Backwards compatibility vereist?

**Waarom kritiek:** Phased rollout strategy, communication plan

---

## 🔧 **SPECIFIEKE VERBETERINGEN NODIG**

### Probleem 1: "AsyncStorage Migration" is complex in Mobile
De prompt gaat uit van server-side migrations waar je traffic kunt shiften. **Maar:**
```
MOBILE REALITY:
- Users installeren update op eigen tempo (days/weeks)
- Geen "canary rollout" mogelijk zonder extra infra
- App Store review = 1-2 dagen delay
- Rollback = nieuwe app versie (again 1-2 dagen)
```

**Wat Flow 3.5 moet weten:**
- Is dit een "on-update migration" (runs once on app startup)?
- Backwards compatibility window? (v1.0 en v2.0 parallel?)
- Forced update strategy? (block old versions?)

---

### Probleem 2: "Test Scenarios" vs "Test Strategy"
Input geeft **wat** te testen, maar niet **hoe** te testen:

**Voorbeeld: "De Komma-Bug"**
```
❌ Huidige input:
"Unit-tests voor NumericParser met inputs: '1.250,50', '1250.50'"

✅ Wat Flow 3.5 nodig heeft:
- Test type: Unit (Jest)
- Test location: domain/finance/NumericParser.test.ts
- Coverage target: 100% (critical financial logic)
- Regression prevention: Add to CI/CD gate
- Performance: <1ms per parse (10k ops/sec)
- Edge cases: null, undefined, empty string, special chars
```

---

| Key | Value |
| --- | --- |
| ### Probleem 3 | "Rollback Strategy" in Mobile Context |
| Input vraagt | "Wat doen we als Zod-validatie data blokkeert?" |

**Maar Flow 3.5 moet ook weten:**
```
BESLISBOOM NODIG:
1. Zod validation fails op 5% van users
   → Action: Log error, keep old data structure, alert team
   
2. Zod validation fails op 50% van users  
   → Action: Migrate what we can, preserve rest, show UI message
   
3. Zod validation fails op 100% of users
   → Action: Schema bug! Hotfix needed, preserve ALL old data
   
4. Migration crashes app
   → Action: Catch error, rollback to v1.0 data, alert user
```

---

**Claude:**

✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument # ✅ Complete Input Template voor Flow 3.5 Migration Strategy
## Project: Standaard 2025 - AsyncStorage → DDD Structure Migration

---

## 📦 **APPROVED ADVICE** (from Flow 2 + 3)

### Migration Item 1: UUID Transformation (Cluster 2)
**Current State:

---

**Claude:**

✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument

---

**Claude:**

✅ Complete Input Template voor Flow 3.5 Migration Strategy

---

**Claude:**

# ✅ Complete Input Template voor Flow 3.5 Migration Strategy
## Project: Standaard 2025 - AsyncStorage → DDD Structure Migration

---

## 📦 **APPROVED ADVICE** (from Flow 2 + 3)

### Migration Item 1: UUID Transformation (Cluster 2)
**Current State:

---

**Claude:**

- Excellent migration scope definition (6 concrete items)
- Clear risk identification (UUID, dates, orphan data)
- Specific test scenarios (komma-bug, purge, special status)
- Good technical context (React 19, RN 0.76)

| - Team capacity (hoeveel developers | hoe lang?) |
| --- | --- |
| - Existing tests (huidige coverage | CI/CD?) |

- Financial domain (zero tolerance for data corruption)
- Bleeding edge stack (React 19 = risk)
- First migration (team learning curve)

- Flow 3.5 genereert strategie met placeholders
- Gebruik voor planning & stakeholder buy-in
- Identificeert wat je nog moet weten
- Timeline: 1-2 dagen

- Verzamel missing info (4-5 dagen)
- Flow 3.5 genereert production-ready plan
- Kwantitatieve thresholds, concrete dates
- Timeline: Week 2

| Key | Value |
| --- | --- |
| Pro | Direct resultaat, ziet wat er komt |
| Con | Niet executeerbaar zonder extra info |

| Key | Value |
| --- | --- |
| Pro | Production-ready output |
| Con | 4-5 dagen prep work |

| Key | Value |
| --- | --- |
| Pro | Beste van beide werelden |
| Con | Extra ronde met Flow 3.5 later nodig |

## 🎯 ANTWOORD OP JE VRAAG

### Korte antwoord: JA, maar met significante gaps ⚠️

### Lange antwoord:

## 💡 MIJN ADVIES

### → Recommended: 2-fase aanpak

## 🚀 WAT WIL JE?

> "Is dit voldoende input voor ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025?"

✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument ∙ Version 2 ### HIGH PRIORITY (Strongly recommended)
- [ ] **Monitoring:** Sentry/Crashlytics setup? Analytics?
- [ ] **Migration Budget:** Error budget (X% failures acceptable?)
- [ ] **Rollback Strategy:** Force update mechanism? Or tolerate old versions?
- [ Perfect! Ik heb nu een complete analyse gemaakt. Laat me samenvatten:

WAT ER GOED IS: ✅

WAT ER ONTBREEKT (Kritiek): ❌

Impact: Flow 3.5 kan een generieke strategie maken, maar niet een production-ready, date-committed, risk-quantified plan.

Gezien:

Fase 1: Quick Generic Strategy (NU)

Fase 2: Complete Strategy (na data gathering)

Optie A: Ik genereer nu een generic strategy met placeholders

Optie B: Ik help je eerst missing info verzamelen

Optie C: Hybrid: Generic strategy NU + checklist voor later

Wat kies jij? A, B, of C? 🎯

---

**Claude:**

✅ Complete Input Template voor Flow 3.5 Migration StrategyDocument ∙ Version 2

---

**Claude:**

### HIGH PRIORITY (Strongly recommended)
- [ ] **Monitoring:** Sentry/Crashlytics setup? Analytics?
- [ ] **Migration Budget:** Error budget (X% failures acceptable?)
- [ ] **Rollback Strategy:** Force update mechanism? Or tolerate old versions?
- [

---

**Claude:**

- Excellent migration scope definition (6 concrete items)
- Clear risk identification (UUID, dates, orphan data)
- Specific test scenarios (komma-bug, purge, special status)
- Good technical context (React 19, RN 0.76)

| - Team capacity (hoeveel developers | hoe lang?) |
| --- | --- |
| - Existing tests (huidige coverage | CI/CD?) |

- Financial domain (zero tolerance for data corruption)
- Bleeding edge stack (React 19 = risk)
- First migration (team learning curve)

- Flow 3.5 genereert strategie met placeholders
- Gebruik voor planning & stakeholder buy-in
- Identificeert wat je nog moet weten
- Timeline: 1-2 dagen

- Verzamel missing info (4-5 dagen)
- Flow 3.5 genereert production-ready plan
- Kwantitatieve thresholds, concrete dates
- Timeline: Week 2

| Key | Value |
| --- | --- |
| Pro | Direct resultaat, ziet wat er komt |
| Con | Niet executeerbaar zonder extra info |

| Key | Value |
| --- | --- |
| Pro | Production-ready output |
| Con | 4-5 dagen prep work |

| Key | Value |
| --- | --- |
| Pro | Beste van beide werelden |
| Con | Extra ronde met Flow 3.5 later nodig |

## 🎯 ANTWOORD OP JE VRAAG

### Korte antwoord: JA, maar met significante gaps ⚠️

### Lange antwoord:

## 💡 MIJN ADVIES

### → Recommended: 2-fase aanpak

## 🚀 WAT WIL JE?

> "Is dit voldoende input voor ULTIMATE A-TIER MIGRATION & TEST STRATEGY PROMPT 2025?"

Perfect! Ik heb nu een complete analyse gemaakt. Laat me samenvatten:

WAT ER GOED IS: ✅

WAT ER ONTBREEKT (Kritiek): ❌

Impact: Flow 3.5 kan een generieke strategie maken, maar niet een production-ready, date-committed, risk-quantified plan.

Gezien:

Fase 1: Quick Generic Strategy (NU)

Fase 2: Complete Strategy (na data gathering)

Optie A: Ik genereer nu een generic strategy met placeholders

Optie B: Ik help je eerst missing info verzamelen

Optie C: Hybrid: Generic strategy NU + checklist voor later

Wat kies jij? A, B, of C? 🎯

---

**Claude:**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Altijd als laatste!
    ],
  };
};

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    /* Phoenix Aliassen */
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
     }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

Waarom werken de aliassen niet??
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Altijd als laatste!
    ],
  };
};

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "es2020",
    "module": "es2020",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    /* Phoenix Aliassen */
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
     }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

Waarom werken de aliassen niet??
```

Show more22 dec 2025

---

**Claude:**

22 dec 2025

---

**Claude:**

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```ts
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```
module-resolver
```

```
module-resolver
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```
babel-plugin-module-resolver
```

```
npm list babel-plugin-module-resolver
```

```bash
npm list babel-plugin-module-resolver
```

```
npm install --save-dev babel-plugin-module-resolver
```

```bash
npm install --save-dev babel-plugin-module-resolver
```

```
./src/domain
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```
tsconfig.json
```

```
jsconfig.json
```

```
jsconfig.json
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```
babel-preset-expo
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```ts
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```ts
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```ts
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```
npx react-native start --reset-cache
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```ts
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```
verify-aliases.js
```

```
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```js
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```
node verify-aliases.js
```

```bash
node verify-aliases.js
```

- CMD/CTRL + Shift + P
- "TypeScript: Restart TS Server"

- Metro bundler terminal
- VSCode Problems tab (CMD/CTRL + Shift + M)

- Kopieer de exacte error message
- Check welke terminal (Metro bundler of VSCode)
- Vertel me de error, dan help ik verder debuggen

# 🔍 Diagnose: Path Aliases Werken Niet

## 🚨 Meest Waarschijnlijke Oorzaken

### 1. Metro Bundler Cache (90% van de gevallen!)

### 3.  Plugin Positie

### 4.  Niet Geïnstalleerd?

### 5. Relative Paths in Alias Definition

### 6. TypeScript vs Runtime Mismatch

### 7. Expo vs React Native CLI Conflict

### 8. Import Syntax Check

## 🔧 Volledige Debug Checklist

## 🐛 Specifieke Error Messages

### Error: "Cannot find module '@domain/...'"

### Error: Red squiggly in VSCode but app runs fine

### Error: "Module does not exist in the module map"

### Error: Works in one file, not another

## 🎯 Snelle Win Checklist

## 📊 Verificatie: Werken Ze Nu?

## 💡 Pro Tip: Verify Configuration

Je hebt alles correct geconfigureerd, maar er zijn een paar veelvoorkomende oorzaken waarom ze nog niet werken:

Metro cache is extreem hardnekkig en pikt nieuwe Babel config niet automatisch op.
Fix:
bash
Test daarna:
typescript

| Je hebt correct reanimated als laatste | maar soms moet eerste zijn. |
| --- | --- |
| Dit is al correct bij jou | maar goed om te verifiëren. |

Check of de plugin er is:
bash
Als niet gevonden:
bash

Je gebruikt  (relative), soms werkt absolute path beter:
Probeer:
javascript

Je  is correct, maar soms moet je ook  toevoegen voor niet-TS files.
Voeg toe:  (naast tsconfig.json):
json

Je gebruikt , wat suggereert Expo. Soms heeft Expo een eigen caching mechanisme.
Als je Expo gebruikt:
bash

Zorg dat je imports correct zijn:
✅ Correct:
typescript
❌ Fout:
typescript

Voer deze stappen in volgorde uit:
bash
9. VSCode restart:

10. Test import:
typescript
Kijk naar errors in:

→ Babel niet correct of Metro cache issue
→ Fix: Reset cache (stap 7 hierboven)

→ TypeScript server niet bijgewerkt
→ Fix: Restart TS Server (CMD+Shift+P → "Restart TS Server")

→ Metro cache corrupt
→ Fix: 

→ Stale import cache in specific file
→ Fix: Delete .js.map files, restart bundler

Probeer deze 3 snelle fixes eerst:
bash
Als dat niet werkt, volg de volledige checklist hierboven.

Test met deze code in App.tsx:
typescript
Als je errors ziet:

Maak een test script om te verifiëren dat aliassen werken:
:
javascript
Run:
bash
Dit vertelt je of de directories bestaan waar de aliases naar wijzen.

Laat me weten welke error je krijgt, dan help ik verder! 🚀

---

**Claude:**

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

bash

---

**Claude:**

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

```bash
# Stop de bundler (Ctrl+C)

# Clear ALLE caches
npx react-native start --reset-cache

# Of uitgebreider:
rm -rf node_modules/.cache
rm -rf .expo
watchman watch-del-all  # als je watchman gebruikt
npx react-native start --reset-cache

# iOS extra (als je iOS gebruikt):
cd ios && pod install && cd ..
```

---

**Claude:**

```
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```ts
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

typescript

---

**Claude:**

```
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

```ts
// In een bestand, probeer:
import { something } from '@domain/household';
```

Als het werkt → probleem opgelost! ✅

---

### 2. **VSCode/IDE Herstart Vereist**

TypeScript Language Server pikt `tsconfig.json` wijzigingen niet altijd op.

**Fix:**
```
1. CMD/CTRL + Shift + P
2. "TypeScript: Restart TS Server"

Of:
- VSCode volledig sluiten
- Heropenen
```

---

**Claude:**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

javascript

---

**Claude:**

javascript

---

**Claude:**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 EERST module-resolver
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': './src/domain',
            '@state': './src/state',
            '@ui': './src/ui',
            '@app': './src/app',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './assets',
          },
        },
      ],
      // 👇 LAATSTE reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

---

**Claude:**

```
npm list babel-plugin-module-resolver
```

```bash
npm list babel-plugin-module-resolver
```

bash

---

**Claude:**

```
npm list babel-plugin-module-resolver
```

```bash
npm list babel-plugin-module-resolver
```

---

**Claude:**

```
npm install --save-dev babel-plugin-module-resolver
```

```bash
npm install --save-dev babel-plugin-module-resolver
```

bash

---

**Claude:**

```
npm install --save-dev babel-plugin-module-resolver
```

```bash
npm install --save-dev babel-plugin-module-resolver
```

---

**Claude:**

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

javascript

---

**Claude:**

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

```js
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@domain': path.resolve(__dirname, 'src/domain'),
            '@state': path.resolve(__dirname, 'src/state'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@assets': path.resolve(__dirname, 'assets'),
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

---

**Claude:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

json

---

**Claude:**

json

---

**Claude:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@state/*": ["src/state/*"],
      "@ui/*": ["src/ui/*"],
      "@app/*": ["src/app/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

---

**Claude:**

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

bash

---

**Claude:**

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

```bash
# Expo specifieke cache clear:
expo start -c

# Of:
expo start --clear
```

---

**Claude:**

```
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```ts
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

typescript

---

**Claude:**

```
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

```ts
import { HouseholdMember } from '@domain/household/types';
import { FormContext } from '@state/FormContext';
import { Button } from '@ui/Button';
```

---

**Claude:**

```
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```ts
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

typescript

---

**Claude:**

```
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

```ts
import { HouseholdMember } from '@domain/household/types.ts'; // Geen .ts!
import { FormContext } from '@state'; // Moet volledige path
```

---

**Claude:**

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

bash

---

**Claude:**

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

```bash
# 1. Stop alle processen
# - Stop Metro bundler (Ctrl+C)
# - Stop Expo (als je die gebruikt)

# 2. Verwijder alle caches
rm -rf node_modules
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

# 3. Verwijder lock files (optioneel, bij dependency issues)
rm -rf package-lock.json  # of yarn.lock

# 4. Reinstall
npm install
# of
yarn install

| Key | Value |
| --- | --- |
| # 5. Verify babel | plugin-module-resolver installed |
| npm list babel | plugin-module-resolver |

# 6. Als iOS: Pods reinstall
cd ios && pod install && cd ..

# 7. Start bundler met reset
npx react-native start --reset-cache

# 8. In nieuwe terminal: Run app
npm run ios  # of npm run android
```

---

**Claude:**

```
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```ts
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

typescript

---

**Claude:**

```
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

```ts
// Test in App.tsx of ander bestand
import { something } from '@domain/test';
```

---

**Claude:**

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

bash

---

**Claude:**

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

```bash
# Fix 1: Nuclear cache clear
npx react-native start --reset-cache

| Key | Value |
| --- | --- |
| # Fix 2 | Restart VSCode TS Server |
| # CMD/CTRL + Shift + P → "TypeScript | Restart TS Server" |

# Fix 3: Verify plugin installed
npm list babel-plugin-module-resolver
# Als niet gevonden:
npm install --save-dev babel-plugin-module-resolver
```

---

**Claude:**

```
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```ts
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

typescript

---

**Claude:**

```
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

```ts
// Test alle aliases
import { testDomain } from '@domain/test'; // Maak dummy file
import { testState } from '@state/test';
import { testUI } from '@ui/test';
import { testUtils } from '@utils/test';

console.log('Aliases werken!');
```

---

**Claude:**

```
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```js
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

javascript

---

**Claude:**

```
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

```js
const path = require('path');
const fs = require('fs');

| '@domain': './src/domain' |  |
| --- | --- |
| '@state': './src/state' |  |
| '@ui': './src/ui' |  |
| '@app': './src/app' |  |
| '@utils': './src/utils' |  |
| '@services': './src/services' |  |
| '@assets': './assets' |  |

console.log('🔍 Verifying Path Aliases...\n');

Object.entries(aliases).forEach(([alias, targetPath]) => {
  const resolved = path.resolve(__dirname, targetPath);
  const exists = fs.existsSync(resolved);
  
  console.log(`${alias}:`);
  console.log(`  Target: ${targetPath}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}\n`);
});
```

---

**Claude:**

```
node verify-aliases.js
```

```bash
node verify-aliases.js
```

bash

---

**Claude:**

```
node verify-aliases.js
```

```bash
node verify-aliases.js
```

---

**Claude:**

```
Alias "${name}" is reserved
```

```
Found ${aliases.length} aliases in tsconfig.json
```

```
${a.name} → ${a.target}
```

```yaml
alias: {
${aliases.map(a =>
```

```
).join('\n')}
            },
```

```yaml
moduleNameMapper: {
${aliases.map(a =>
```

```
).join('\n')}
  },
```

| ik krijg deze melding [node scripts/sync-aliases.js ❌ Failed to parse tsconfig.json (JSONC + trailing commas)] bij uitvoeren van dit script. Analyseer script, zoek alle tips en best practices en pas deze toe op het script | analyseer het door jouw geschreven script nogmaals en verbeter het waar mogelijk. #!/usr/bin/env node |
| --- | --- |
| const fs = require('fs') |  |
| const path = require('path') |  |
| const ROOT = process.cwd() |  |
| const TSCONFIG = path.join(ROOT, 'tsconfig.json') |  |
| const BABEL = path.join(ROOT, 'babel.config.js') |  |
| const JEST = path.join(ROOT, 'jest.config.js') |  |
| const DRY_RUN = process.argv.includes('--dry-run') |  |
| ] |  |
| console.error❌ ${msg}) |  |
| process.exit(1) |  |
| .replace(/,\s*([}\]])/g, '$1') |  |
| console.logℹ️ ${msg}) |  |
| console.log✅ ${msg}) |  |
| if (!fs.existsSync(TSCONFIG)) die('tsconfig.json not found') |  |
| let ts |  |
| const raw = fs.readFileSync(TSCONFIG, 'utf8') |  |
| ts = JSON.parse(sanitizeJson(raw)) |  |
| die('Failed to parse tsconfig.json (JSONC + trailing commas)') |  |
| const paths = ts.compilerOptions?.paths |  |
| if (!paths) die('No compilerOptions.paths found') |  |
| const name = key.replace(/\/\*$/, '') |  |
| const target = value.replace(/\/\*$/, '') |  |
| die) |  |
| return { name, target } |  |
| }) |  |
| info) |  |
| aliases.forEach(a => info)) |  |
| if (!fs.existsSync(BABEL)) die('babel.config.js not found') |  |
| let babelSrc = fs.readFileSync(BABEL, 'utf8') |  |
| info('babel.config.js: alias block NOT found') |  |
| ok('babel.config.js: alias block found') |  |
| const babelAliasBlock = '${a.name}': './${a.target}', |  |
| ) |  |
| fs.writeFileSync(BABEL, babelSrc) |  |
| if (!fs.existsSync(JEST)) die('jest.config.js not found') |  |
| let jestSrc = fs.readFileSync(JEST, 'utf8') |  |
| info('jest.config.js: moduleNameMapper NOT found') |  |
| ok('jest.config.js: moduleNameMapper found') |  |
| const jestMapperBlock = '^${a.name.replace('@', '\\@')}/(.*)$': '<rootDir>/${a.target}/$1', |  |
| ) |  |
| fs.writeFileSync(JEST, jestSrc) |  |
| ok('Dry-run complete (no files modified)') |  |
| ok('Aliases synced from tsconfig.json') |  |

---

**Claude:**

```
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```js
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```js
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```js
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```js
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```
sync-aliases.js
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

- Geen check of alias block al bestaat in babel
- Geen backup van originele files
- Geen validatie of target directories bestaan
- Geen check voor duplicate aliases

- ✅ Alle 4 syntax errors gefixed
- ✅ Comprehensive validation toegevoegd
- ✅ Backup mechanisme
- ✅ Verbose + dry-run modes
- ✅ Help documentation
- ✅ Production-ready

- Volledige bug analyse
- Voor/na vergelijking
- Best practices toegepast
- Testing checklist

- Quick fixes voor 90% van issues
- Diagnosis by symptom
- Complete reset procedure
- Prevention tips

# 🔍 Analyse & Verbeterd Script

## 🐛 Gevonden Bugs

### 1. Template Literal Syntax Errors ❌

### 2. JSON Parsing Error Handling Te Breed

### 3. Regex Replace Te Greedy

### 4. Geen Validatie van Array Destructuring

### 5. Ontbrekende Edge Case Handling

## ✅ Verbeterd Script (Production-Ready)

## 🎯 Samenvatting

### 1️⃣ Gefixed Script ()

### 2️⃣ Verbeteringen Document

### 3️⃣ Troubleshooting Cheatsheet

## 🚀 Volgende Stappen

Ik zie meerdere bugs in het script. Laat me ze analyseren en een production-ready versie maken.

javascript

javascript

javascript

javascript

sync-aliases.js (Fixed & Enhanced)Code #!/usr/bin/env node
/**
 * Sync path aliases from tsconfig.json → babel.config.js + jest.config.js
 * 
 * Features:
 * - JSONC support (comments, trailing commas)
 * - Dry-run mode (--dry-run)
 * - Backup creation (--backup)
 * - Validation (reservedPerfect! Nu nog een vergelijkingstabel en best practices document:Script Verbeteringen & Best PracticesDocument # 📊 Script Verbeteringen & Best Practices

---

## 🔍 **Wat Was Er Mis**

### Bug 1: Template Literal Syntax Errors
```javascript
// ❌ ORIGINEEL (4 locaties!)
console.error`❌ ${msg}`);
console.log`ℹ️  ${msg}`);
die`Alias "${name}" is reserved`);
infPerfect! Nog één ding - een quick reference card voor dagelijks gebruik:Path Aliases Troubleshooting CheatsheetDocument # 🚨 Path Aliases Troubleshooting Cheatsheet

---

## ⚡ **Quick Fixes (Try These First)**

```bash
# 1. Nuclear cache clear (solves 90% of issues)
npx react-native start --reset-cache

# 2. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeS
Ik heb je complete set geleverd:

Direct doen:
bash
Aliases zouden nu moeten werken! 🎉
Heb je nog errors? Laat me de exacte error message zien en ik help verder debuggen! 🔍

---

**Claude:**

```
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```js
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

javascript

---

**Claude:**

```
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

```js
console.error`❌ ${msg}`);  // ❌ FOUT: backtick maar geen ${}
console.log`ℹ️  ${msg}`);   // ❌ FOUT: idem

// Moet zijn:
console.error(`❌ ${msg}`); // ✅ CORRECT
console.log(`ℹ️  ${msg}`);  // ✅ CORRECT
```

---

**Claude:**

```
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```js
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

javascript

---

**Claude:**

```
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

```js
} catch {  // ❌ Vangt ALLE errors, ook syntax errors in script zelf
  die('Failed to parse tsconfig.json');
}

// Beter:
} catch (err) {
  die(`Failed to parse tsconfig.json: ${err.message}`);
}
```

---

**Claude:**

```
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```js
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

javascript

---

**Claude:**

```
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

```js
// ❌ Matcht mogelijk meerdere alias blocks
.replace(/alias:\s*\{[\s\S]*?\},/, babelAliasBlock)

// ✅ Meer specifiek met lookbehind/lookahead
```

---

**Claude:**

```
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```js
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

javascript

---

**Claude:**

```
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

```js
const aliases = Object.entries(paths).map(([key, [value]]) => {
  // ❌ Wat als paths[key] geen array is?
  // ❌ Wat als array leeg is?
```

---

**Claude:**

sync-aliases.js (Fixed & Enhanced)Code #!/usr/bin/env node
/**
 * Sync path aliases from tsconfig.json → babel.config.js + jest.config.js
 * 
 * Features:
 * - JSONC support (comments, trailing commas)
 * - Dry-run mode (--dry-run)
 * - Backup creation (--backup)
 * - Validation (reserved

---

**Claude:**

sync-aliases.js (Fixed & Enhanced)Code

---

**Claude:**

sync-aliases.js (Fixed & Enhanced)

---

**Claude:**

#!/usr/bin/env node
/**
 * Sync path aliases from tsconfig.json → babel.config.js + jest.config.js
 * 
 * Features:
 * - JSONC support (comments, trailing commas)
 * - Dry-run mode (--dry-run)
 * - Backup creation (--backup)
 * - Validation (reserved

---

**Claude:**

Perfect! Nu nog een vergelijkingstabel en best practices document:

---

**Claude:**

Script Verbeteringen & Best PracticesDocument # 📊 Script Verbeteringen & Best Practices

---

## 🔍 **Wat Was Er Mis**

### Bug 1: Template Literal Syntax Errors
```javascript
// ❌ ORIGINEEL (4 locaties!)
console.error`❌ ${msg}`);
console.log`ℹ️  ${msg}`);
die`Alias "${name}" is reserved`);
inf

---

**Claude:**

Script Verbeteringen & Best PracticesDocument

---

**Claude:**

Script Verbeteringen & Best Practices

---

**Claude:**

# 📊 Script Verbeteringen & Best Practices

---

## 🔍 **Wat Was Er Mis**

### Bug 1: Template Literal Syntax Errors
```javascript
// ❌ ORIGINEEL (4 locaties!)
console.error`❌ ${msg}`);
console.log`ℹ️  ${msg}`);
die`Alias "${name}" is reserved`);
inf

---

**Claude:**

Perfect! Nog één ding - een quick reference card voor dagelijks gebruik:

---

**Claude:**

Path Aliases Troubleshooting CheatsheetDocument # 🚨 Path Aliases Troubleshooting Cheatsheet

---

## ⚡ **Quick Fixes (Try These First)**

```bash
# 1. Nuclear cache clear (solves 90% of issues)
npx react-native start --reset-cache

# 2. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeS

---

**Claude:**

Path Aliases Troubleshooting CheatsheetDocument

---

**Claude:**

Path Aliases Troubleshooting Cheatsheet

---

**Claude:**

# 🚨 Path Aliases Troubleshooting Cheatsheet

---

## ⚡ **Quick Fixes (Try These First)**

```bash
# 1. Nuclear cache clear (solves 90% of issues)
npx react-native start --reset-cache

# 2. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeS

---

**Claude:**

```
sync-aliases.js
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

- ✅ Alle 4 syntax errors gefixed
- ✅ Comprehensive validation toegevoegd
- ✅ Backup mechanisme
- ✅ Verbose + dry-run modes
- ✅ Help documentation
- ✅ Production-ready

- Volledige bug analyse
- Voor/na vergelijking
- Best practices toegepast
- Testing checklist

- Quick fixes voor 90% van issues
- Diagnosis by symptom
- Complete reset procedure
- Prevention tips

## 🎯 Samenvatting

### 1️⃣ Gefixed Script ()

### 2️⃣ Verbeteringen Document

### 3️⃣ Troubleshooting Cheatsheet

## 🚀 Volgende Stappen

Ik heb je complete set geleverd:

Direct doen:
bash
Aliases zouden nu moeten werken! 🎉
Heb je nog errors? Laat me de exacte error message zien en ik help verder debuggen! 🔍

---

**Claude:**

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

bash

---

**Claude:**

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

```bash
# 1. Vervang oude script met nieuwe versie
# 2. Run het script
node scripts/sync-aliases.js --verbose

# 3. Clear Metro cache
npx react-native start --reset-cache

# 4. Restart TypeScript in VSCode
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"

# 5. Test import
import { something } from '@domain/test';
```

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade Sonnet 4.5

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade

---

**Claude:**

You are out of free messages until 4:00 PM

---

**Claude:**

Upgrade

---

**Claude:**

Sonnet 4.5

---

**Claude:**

Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Export (MD)Export (JSON)✅ Lazy-load klaar (0 blokken)

---

**Claude:**

✅ Lazy-load klaar (0 blokken)
