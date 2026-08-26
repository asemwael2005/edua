/**
 * Phone Number Normalizer & Validation Utility
 */
export function normalizePhone(phone?: string | null): string {
  if (!phone) return '';

  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let clean = phone.toString().trim();

  // Convert Arabic numerals to English numerals
  clean = clean.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());

  // Remove all non-digit characters
  clean = clean.replace(/\D/g, '');

  // Remove leading 20 prefix if present (e.g. 201012345678 -> 01012345678)
  if (clean.startsWith('20') && clean.length === 12) {
    clean = clean.slice(2);
  }

  // Remove leading 0 for normalized comparison (e.g. 01012345678 -> 1012345678)
  if (clean.startsWith('0')) {
    clean = clean.slice(1);
  }

  return clean;
}

export function isValidEgyptianPhone(phone: string): boolean {
  if (!phone) return false;
  const clean = normalizePhone(phone);
  // Egyptian mobile numbers: 10 digits after stripping leading 0 (e.g. 1012345678, 1112345678, 1212345678, 1512345678)
  return /^1[0125]\d{8}$/.test(clean);
}
