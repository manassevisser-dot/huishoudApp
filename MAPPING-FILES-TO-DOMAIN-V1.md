| Bestand | Huidige locatie | Voorgestelde locatie | Reden | Migreren? (J/N) |
|---|---|---|---|---|
| evaluateDomainRules.ts | src/domain/rules/ | src/domain/rules/ (Splitsen)/ | Splits logica (finance/household) | J |
| frequency.ts | src/utils/ | src/domain/helpers/ | Alleen domein-specifiek | J |
| numbers.ts | src/utils/ | src/domain/helpers/ | Alleen domein-specifiek | J |
| validation.ts | src/utils/ | src/domain/validation/ | Alleen parsing + validatie voor domein | J |
| core.ts | src/shared-types/ | src/domain/types/ | Semantische domein-entiteit (Check: infra?) | J |
| expenses.ts | src/shared-types/ | src/domain/types/ | Semantische domein-entiteit (Check: infra?) | J |
| extendedFormState.ts | src/shared-types/ | src/domain/types/ | Semantische domein-entiteit (Check: infra?) | J |
| fields.ts | src/shared-types/ | src/domain/types/ | Semantische domein-entiteit (Check: infra?) | J |
| finance.ts | src/shared-types/ | src/domain/types/ | Semantische domein-entiteit (Check: infra?) | J |
| form.ts | src/shared-types/ | src/domain/types/ | Semantische domein-entiteit (Check: infra?) | J |
| income.ts | src/shared-types/ | src/domain/types/ | Semantische domein-entiteit (Check: infra?) | J |
| transaction.ts | src/shared-types/ | src/domain/types/ | Semantische domein-entiteit (Check: infra?) | J |
| wizard.ts | src/shared-types/ | src/domain/types/ | Semantische domein-entiteit (Check: infra?) | J |
| export.ts | src/logic/ | src/app/orchestrators/ | Mogelijk orchestrator (controleren) | J |
| storage.ts | src/services/ | src/adapters/storage/ | Platform-specifiek | J |
| csvService.ts | src/services/ | src/adapters/csv/ | Parsing/formatting | J |
