import { LocalNoonClockPort } from './LocalNoonClockPort';

export class LocalNoonClock implements LocalNoonClockPort {
  getCurrentLocalNoon(): Date {
    const now = new Date();
    // Normaliseer naar 12:00 lokale tijd voor consistentie in dag-gebaseerde logica
    now.setHours(12, 0, 0, 0);
    return now;
  }
}