// src/domain/styles/modules/index.ts
//
// Barrel re-export — alle modules via StyleRegistry
// Consumers zouden @domain/registry/StyleRegistry moeten gebruiken,
// maar deze index bestaat voor backwards compatibility.

export {
    makeAlerts,
    makeButtons,
    makeCards,
    makeCheckboxes,
    makeChips,
    makeContainers,
    makeDashboard,
    makeForms,
    makeHeader,
    makeHelpers,
    makeLayout,
    makeSummary,
    makeToggles,
    makeTypography,
  } from '@domain/registry/StyleRegistry';
  