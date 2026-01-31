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
  }
};