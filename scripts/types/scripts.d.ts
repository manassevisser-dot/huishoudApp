// src/types/scripts.d.ts
declare module '*/scripts/maintenance/audit-orchestrator.js' {
    // We typeren het als 'any' omdat het een extern script is
    const content: any;
    export default content;
    // Als je named exports gebruikt in de JS, kun je die hier ook toevoegen:
    // export const runAudit: () => void;
  }