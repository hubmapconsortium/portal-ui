interface DescendantCounts {
  entity_type: Record<string, number>;
}

function filterDescendantCountsByType(descendant_counts: DescendantCounts['entity_type'], type: string) {
  if (type === 'Dataset') {
    return descendant_counts?.Dataset ? { Dataset: descendant_counts.Dataset } : {};
  }
  return descendant_counts;
}

function getTileDescendantCounts(source: object, type: string) {
  const defaultDescendantCounts: Record<string, number> = ['Donor', 'Sample'].includes(type)
    ? { Sample: 0, Dataset: 0 }
    : { Dataset: 0 };
  if ('descendant_counts' in source === false) return defaultDescendantCounts;
  const counts = source.descendant_counts as DescendantCounts;
  return { ...defaultDescendantCounts, ...filterDescendantCountsByType(counts.entity_type, type) };
}

export { getTileDescendantCounts };
