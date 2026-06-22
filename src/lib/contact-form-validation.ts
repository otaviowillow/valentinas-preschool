/** Client-safe email/phone checks — keep in sync with validation.ts */
export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return /^\d{10}$/.test(trimmed);
}

export function digitsOnlyPhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}
