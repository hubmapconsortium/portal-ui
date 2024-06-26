export function makeGridTemplateColumns(cards: unknown[], expandedCardIndex: number | null) {
  if (expandedCardIndex === null) {
    return '1fr 1fr 1fr';
  }
  const expandedColSize = '3fr';
  const otherColSize = '1fr';

  return cards
    .reduce<string>((acc, _, idx) => `${acc} ${idx === expandedCardIndex ? expandedColSize : otherColSize}`, '')
    .trim();
}
