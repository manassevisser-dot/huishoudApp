/**
 * @file_intent Gecentraliseerde repository voor **veld-specifieke validatie- en warning-berichten**. 
 *              Bevat géén algemene UI-strings, critical errors of module-specifieke berichten (zie WizStrings).
 * @repo_architecture State Layer - Validation Schemas (User-facing messages only).
 * @term_definition Validation Message = Een gebruiksvriendelijke string die uitlegt waarom een specifieke input ongeldig is, 
 *                   een warning geeft bij ongewone waarden, of om bevestiging vraagt voor een veld-specifieke actie.
 * @contract 
 *   - Exporteert een genest object `validationMessages` waarvan de structuur de domein-data weerspiegelt (bijv. `setup.personal`, `financial.income`).
 *   - Bevat ALLEEN berichten die direct gekoppeld zijn aan veld-validatie (error/warning/success states).
 *   - Bevat GEEN: critical system errors, reset-bevestigingen, CSV-feedback, of algemene UI-labels → deze leven in `WizStrings`.
 *   - Berichten zijn altijd functies of strings die contextuele parameters accepteren (bijv. `(value) => \`Te hoog: ${value}\``).
 * @separation_of_concerns 
 *   - Dit bestand = validatie-logic gekoppeld aan domein-constraints.
 *   - `WizStrings` = algemene UI-teksten, module-specifieke feedback, en niet-validatie gerelateerde messages.
 *   - Bij twijfel: hoort dit bericht bij een validatieregel uit een schema? → hier. Is het algemene UI-feedback? → WizStrings.
 * @ai_instruction 
 *   - Houd berichten beknopt, actiegericht en in consistente terminologie (bijv. altijd "vul in" i.p.v. mix van "voer in"/"vul in").
 *   - Groepeer per domein-entiteit (bijv. `dateOfBirth`, `nettoSalaris`), niet per UI-component.
 *   - Gebruik parameters voor dynamische waarden: `({min, max}) => \`Alleen tussen ${min} en ${max}\``.
 *   - Voeg geen nieuwe message-types toe zonder eerst te checken of ze niet beter in WizStrings passen.
 */
// src/state/schemas/sections/validationMessages.ts
// ✅ Scope verduidelijkt: alleen veld-validatie messages
// ❌ VERWIJDERD: criticalError → WizStrings.critical
// ❌ VERWIJDERD: reset → WizStrings.reset  
// ❌ VERWIJDERD: csv_* → WizStrings.csv
// 💡 TOEGEVOEGD: @separation_of_concerns voor duidelijke architectuur-bewaking

export const validationMessages = {
  // ✅ ALLEEN tokens (geen UI-teksten meer!)
  boundary: {
    invalidFormat: 'boundary.invalidFormat',
    required: 'boundary.required',
    mustBeNumber: 'boundary.mustBeNumber',
    unexpectedValidationError: 'boundary.unexpectedValidationError',
    validationError: 'boundary.validationError',
    amountMustBeCents: 'boundary.amountMustBeCents',
    yearlyAmountHint: 'boundary.yearlyAmountHint',
    wealthTaxWarning: 'boundary.wealthTaxWarning',
    invalidPostalCode: 'boundary.invalidPostalCode',
  },

  // ✅ setup/dateOfBirth blijven (validatie, geen UI)
  setup: {
    aantalMensen: {
      required: 'setup.aantalMensen.required',
      min: 'setup.aantalMensen.min',
      max: 'setup.aantalMensen.max',
      warning: 'setup.aantalMensen.warning',
    },
    aantalVolwassen: {
      required: 'setup.aantalVolwassen.required',
      min: 'setup.aantalVolwassen.min',
      max: 'setup.aantalVolwassen.max',
      warning: 'setup.aantalVolwassen.warning',
    },
  },
  dateOfBirth: {
    required: 'dateOfBirth.required',
    invalidType: 'dateOfBirth.invalidType',
    invalidFormat: 'dateOfBirth.invalidFormat',
    invalidDate: 'dateOfBirth.invalidDate',
    minor: 'dateOfBirth.minor',
  },


};