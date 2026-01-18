import { LocalNoonClock } from '@infrastructure/clock/LocalNoonClock';
import { todayLocalNoon, getAdultMaxISO, getChildMaxISO } from '@domain/helpers/DateHydrator';

/**
 * Stateless orchestrator voor datumcontext.
 * Retourneert altijd een nieuw object – geen caching, geen mutatie.
 */
export function getDateContext() {
  // Optioneel: injecteer clock via DI in toekomst, maar nu hardcoded per SVZ-2-L
  const clock = new LocalNoonClock();
  const now = clock.getCurrentLocalNoon(); // of todayLocalNoon() als fallback

  return {
    todayISO: todayLocalNoon(),
    adultMaxISO: getAdultMaxISO(now),
    childMaxISO: getChildMaxISO(now),
  };
}

/**
 * Haalt de huidige systeemdatum op in ISO-formaat (YYYY-MM-DD).
 * Gebruikt LocalNoonClock voor tijdzone-onafhankelijkheid.
 */
export function getCurrentDateISO(): string {
    const clock = new LocalNoonClock();
    const now = clock.getCurrentLocalNoon();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }