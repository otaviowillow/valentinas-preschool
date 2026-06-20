// Small formatting helpers shared across the admin panel.

export function money(cents: number | null | undefined): string {
  const n = (cents ?? 0) / 100;
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/** Parse a dollar string (e.g. "350" or "$1,250.50") into integer cents. */
export function toCents(input: FormDataEntryValue | null): number {
  const raw = String(input ?? '').replace(/[^0-9.]/g, '');
  if (!raw) return 0;
  return Math.round(parseFloat(raw) * 100);
}

export function formatDate(value: Date | number | string | null | undefined): string {
  if (value == null || value === '') return '—';
  const d =
    value instanceof Date
      ? value
      : typeof value === 'number'
        ? new Date(value * 1000)
        : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function ageFromDob(dob: string | null | undefined): string {
  if (!dob) return '—';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return '—';
  const now = new Date();
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) return '—';
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${months} mo`;
  return rem === 0 ? `${years} yr` : `${years} yr ${rem} mo`;
}

/** Turn a string-or-empty form value into a trimmed string or null. */
export function str(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? '').trim();
  return s.length ? s : null;
}

/** Turn a numeric form value into an integer or null. */
export function intOrNull(value: FormDataEntryValue | null): number | null {
  const s = String(value ?? '').trim();
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

export function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
