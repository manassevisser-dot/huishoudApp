/**
 * @file_intent Gecentraliseerde repository voor user-facing validatie- en bevestigingsberichten.
 * @repo_architecture State Layer - Validation Schemas.
 * @term_definition Validation Message = Een gebruiksvriendelijke string die uitlegt waarom input ongeldig is of om bevestiging vraagt voor een destructieve actie.
 * @contract Dit bestand exporteert een genest object `validationMessages`. De structuur van dit object moet de structuur van de data die het valideert weerspiegelen om de duidelijkheid te bewaren.
 * @ai_instruction Houd bij het toevoegen of wijzigen van berichten de taal beknopt en helder voor de eindgebruiker. Gebruik consistente terminologie. Groepeer berichten per onderdeel van de staat waar ze betrekking op hebben (bijv. `setup`, `dateOfBirth`).
 */
// src/state/schemas/sections/validationMessages.ts
export const validationMessages = {
  setup: {
    aantalMensen: {
      required: "vul in",
      min: "Minimaal 1 persoon vereist",
      max: "Maximaal 10 personen toegestaan",
      warning: "Let op: je nadert het maximum"
    },
    aantalVolwassen: {
      required: "vul in",
      min: "Minimaal 1 volwassene vereist",
      max: "Maximaal 7 volwassenen toegestaan",
      warning: "Let op: je nadert het maximum"
    }
  },
  dateOfBirth: {
    required: "Geboortedatum is verplicht",
    invalidType: "Geboortedatum moet tekst zijn",
    invalidFormat: "Gebruik formaat DD-MM-YYYY",
    invalidDate: "Ongeldige datum",
    minor: "Je moet minimaal 18 jaar oud zijn"
  },
  reset: {
    wipe: {
      title: "Alles wissen",
      message:
        "Weet je zeker dat je alle gegevens wilt verwijderen? Dit omvat setup, transacties en instellingen. Deze actie kan niet ongedaan worden gemaakt.",
      confirm: "Ja, wis alles",
      cancel: "Annuleer",
      hint: "Na het wissen start de app opnieuw met een lege omgeving."
    },
    wizardOnly: {
      title: "Setup opnieuw starten",
      message:
        "De setup‑wizard wordt teruggezet naar lege velden. Je transacties en overige instellingen blijven behouden.",
      confirm: "Setup opnieuw starten",
      cancel: "Annuleer",
      hint: "Je kunt later altijd nog gegevens aanpassen in het dashboard."
    }
  },
    // ⬇️ NIEUW: top-level audit tokens
    CSV_IMPORT_SUCCESS: 'CSV-bestand succesvol verwerkt',
    CSV_IMPORT_EMPTY: 'Geen transacties gevonden in het geüploade CSV-bestand',
    CSV_IMPORT_FAILED: 'Er is een fout opgetreden tijdens het verwerken van het CSV-bestand',
    CSV_IMPORT_DISCREPANCY_FOUND: 'Er zijn afwijkingen gevonden in de geïmporteerde financiële data'
};