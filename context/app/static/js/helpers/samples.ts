/**
 * Compares two sample categories for sorting purposes.
 * The order is: Organ > Block > Section > Suspension
 */
export function compareSampleCategory(a: string, b: string) {
  const normalizedA = a.toLowerCase();
  const normalizedB = b.toLowerCase();
  const order = ['organ', 'block', 'section', 'suspension'];
  const indexA = order.indexOf(normalizedA);
  const indexB = order.indexOf(normalizedB);

  // For safety: handle unknown categories and empty strings by placing them at the end
  if (indexA === -1 && indexB === -1) {
    return 0;
  }
  if (indexA === -1) {
    return 1;
  }
  if (indexB === -1) {
    return -1;
  }

  return indexA - indexB;
}
