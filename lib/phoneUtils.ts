/**
 * Phone Number Normalizer Utility
 * 1. Converts Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) to Latin digits (0123456789).
 * 2. Removes non-digit characters (+, -, spaces, brackets).
 * 3. Standardizes Egyptian phone formats (e.g. +201012345678, 01012345678, 1012345678 -> 1012345678).
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
