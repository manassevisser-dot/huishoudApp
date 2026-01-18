import { TimeProvider } from "@domain/helpers/TimeProvider";

export function isMinor(birthDate: Date, provider: TimeProvider): boolean {
  const today = provider.getCurrentLocalNoon();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1 < 18;
  }
  return age < 18;
}

export function isSenior(birthDate: Date, provider: TimeProvider): boolean {
  const today = provider.getCurrentLocalNoon();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1 >= 65;
  }
  return age >= 65;
}
