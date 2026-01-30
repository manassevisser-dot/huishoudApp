import { LocalNoonClock } from '@infrastructure/clock/LocalNoonClock';
import { todayLocalNoon, getAdultMaxISO, getChildMaxISO } from '@domain/helpers/DateHydrator';

export function getDateContext() {
  const now = LocalNoonClock.now(); 

  return {
    todayISO: todayLocalNoon(),
    adultMaxISO: getAdultMaxISO(now),
    childMaxISO: getChildMaxISO(now),
  };
}

export function getCurrentDateISO(): string {
    const now = LocalNoonClock.now();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}