/**
 * LocalNoonClock: Clock die altijd 12:00 lokale tijd retourneert
 */
export class LocalNoonClock {
  static now(): Date {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    return date;
  }
  
  static nowISO(): string {
    return this.now().toISOString();
  }
  
  static at(year: number, month: number, day: number): Date {
    const date = new Date(year, month - 1, day);
    date.setHours(12, 0, 0, 0);
    return date;
  }
}