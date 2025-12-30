export interface Member {
  entityId: string;    // De unieke database sleutel
  fieldId: string;     // De unieke UI sleutel (nodig voor Phoenix Forms)
  memberType: 'adult' | 'child';
  naam?: string;
  gender?: string;
  dateOfBirth?: string;
  leeftijd?: number;
}

export interface Household {
  householdId: string;
  members: Member[];
  lastUpdated: string;
}