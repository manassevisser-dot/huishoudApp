/**
 * Splitst een naamstring voor UX doeleinden.
 * "Jan Janssen" -> { firstName: "Jan", lastName: "Janssen" }
 */
export function splitNameForUX(fullName: string = ''): { firstName: string; lastName: string } {
  const trimmedName = fullName.trim();
  const parts = trimmedName.split(/\s+/);

  // Pak de eerste naam als die bestaat en niet leeg is, anders 'Lid'
  const firstPart = parts[0];
  const firstName = (firstPart !== undefined && firstPart !== '') ? firstPart : 'Lid';

  // Pak de rest als achternaam
  const remainingParts = parts.slice(1);
  const lastName = remainingParts.length > 0 ? remainingParts.join(' ') : '';

  return {
    firstName,
    lastName,
  };
}