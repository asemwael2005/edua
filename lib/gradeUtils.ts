/**
 * Utility to strictly match content grade level with student grade level.
 * Ensures a Grade 10 student only sees Grade 10 materials,
 * Grade 11 only Grade 11, and Grade 12 only Grade 12, unless grade is 'all'.
 */
export function isMatchingGrade(itemGrade?: string, studentGrade?: string): boolean {
  if (!itemGrade) return true;
  
  const cleanItem = itemGrade.toLowerCase().trim();
  const cleanStudent = studentGrade ? studentGrade.toLowerCase().trim() : '';

  // If item is assigned to all grades or universal
  if (
    cleanItem === 'all' ||
    cleanItem === 'جميع المراحل' ||
    cleanItem.includes('جميع') ||
    cleanItem.includes('كل المراحل') ||
    cleanItem.includes('عام')
  ) {
    return true;
  }

  if (!cleanStudent) return true;

  // Direct exact string match
  if (cleanItem === cleanStudent) return true;

  // Extract grade numbers if present
  const item10 = cleanItem.includes('10') || cleanItem.includes('أول') || cleanItem.includes('اول');
  const item11 = cleanItem.includes('11') || cleanItem.includes('ثاني') || cleanItem.includes('ثان');
  const item12 = cleanItem.includes('12') || cleanItem.includes('ثالث');

  const student10 = cleanStudent.includes('10') || cleanStudent.includes('أول') || cleanStudent.includes('اول');
  const student11 = cleanStudent.includes('11') || cleanStudent.includes('ثاني') || cleanStudent.includes('ثان');
  const student12 = cleanStudent.includes('12') || cleanStudent.includes('ثالث');

  if (item10) return student10;
  if (item11) return student11;
  if (item12) return student12;

  // Fallback: substring match if both clean strings contain common token
  return cleanItem.includes(cleanStudent) || cleanStudent.includes(cleanItem);
}

/**
 * Checks if content is published and matching the student's grade level.
 */
export function isContentVisibleToStudent(
  item: { grade?: string; isPublished?: boolean; isHidden?: boolean; status?: string },
  studentGrade?: string
): boolean {
  if (item.isPublished === false || item.isHidden === true || item.status === 'draft' || item.status === 'hidden') {
    return false;
  }
  return isMatchingGrade(item.grade, studentGrade);
}
