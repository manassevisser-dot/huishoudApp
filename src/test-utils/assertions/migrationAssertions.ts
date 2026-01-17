/**
 * Controleert of de migratie alle leeftijdscategorieën bevat.
 */
export function assertMemberTypePreserved(migratedMembers: any[]) {
  const types = migratedMembers.map((m) => m.memberType);
  expect(types).toContain('teenager');
  expect(types).toContain('child');
  expect(types).toContain('senior');
  expect(types).toContain('adult');
}

/**
 * Basis validatie voor een Phoenix Member object.
 */
export function assertValidMember(member: any) {
  expect(member).toHaveProperty('entityId'); // let op: als jouw Member 'entityId' gebruikt, pas deze regel aan.
  expect(member).toHaveProperty('firstName');
  expect(member).toHaveProperty('memberType'); // basis voor onderzoek
  expect(typeof member.firstName).toBe('string');
}
