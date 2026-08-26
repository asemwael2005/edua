/**
 * Utility to match content grade level with student grade level.
 * Ensures a Grade 10 student only sees Grade 10 materials.
 */
export function isMatchingGrade(itemGrade?: string, studentGrade?: string): boolean {
  if (!itemGrade || itemGrade === 'all' || !studentGrade) return true;

  const cleanItem = itemGrade.toLowerCase().trim();
  const cleanStudent = studentGrade.toLowerCase().trim();

  // Direct exact match
  if (cleanItem === cleanStudent) return true;

  // Grade 10 / الصف الأول الثانوي
  const isItem10 = cleanItem.includes('أول') || cleanItem.includes('اول') || cleanItem.includes('10');
  const isStudent10 = cleanStudent.includes('أول') || cleanStudent.includes('اول') || cleanStudent.includes('10');
  if (isItem10 && isStudent10) return true;

  // Grade 11 / الصف الثاني الثانوي
  const isItem11 = cleanItem.includes('ثان') || cleanItem.includes('11');
  const isStudent11 = cleanStudent.includes('ثان') || cleanStudent.includes('11');
  if (isItem11 && isStudent11) return true;

  // Grade 12 / الصف الثالث الثانوي
  const isItem12 = cleanItem.includes('ثالث') || cleanItem.includes('12');
  const isStudent12 = cleanStudent.includes('ثالث') || cleanStudent.includes('12');
  if (isItem12 && isStudent12) return true;

  // If item doesn't specify any recognized grade, default to visible
  const isItemGeneric = !isItem10 && !isItem11 && !isItem12;
  if (isItemGeneric) return true;

  return false;
}
