
/**
 * Splitst een naamstring voor UX doeleinden.
 * "Jan Janssen" -> { firstName: "Jan", lastName: "Janssen" }
 */
export function splitNameForUX(fullName: string = ''): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] || 'Lid',
      lastName: parts.slice(1).join(' ') || '',
    };
  }
  