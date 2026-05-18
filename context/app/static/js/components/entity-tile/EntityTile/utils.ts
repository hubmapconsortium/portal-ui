interface DescendantCounts {
  entity_type: Record<string, number>;
}

function filterDescendantCountsByType(descendant_counts: DescendantCounts['entity_type'], type: string) {
  if (type === 'Dataset') {
    return descendant_counts?.Dataset ? { Dataset: descendant_counts.Dataset } : {};
  }
  // Support entities share the dataset icon but aren't reachable from the dataset search page,
  // so excluding them avoids misleading counts that don't match the linked search results.
  const { Support: _Support, ...rest } = descendant_counts ?? {};
  return rest;
}

function getTileDescendantCounts(source: object | undefined, type: string) {
  const defaultDescendantCounts: Record<string, number> = ['Donor', 'Sample'].includes(type)
    ? { Sample: 0, Dataset: 0 }
    : { Dataset: 0 };
  if (!source || !('descendant_counts' in source)) return defaultDescendantCounts;
  const counts = source.descendant_counts as DescendantCounts;
  return { ...defaultDescendantCounts, ...filterDescendantCountsByType(counts.entity_type, type) };
}

export { getTileDescendantCounts };
