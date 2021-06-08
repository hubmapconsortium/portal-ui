function filterDescendantCountsByType(descendant_counts, type) {
  if (type === 'Dataset') {
    return descendant_counts?.Dataset ? { Dataset: descendant_counts.Dataset } : {};
  }
  return descendant_counts;
}

function getTileDescendantCounts(source, type) {
  const defaultDescendantCounts = ['Donor', 'Sample'].includes(type) ? { Sample: 0, Dataset: 0 } : { Dataset: 0 };
  return 'descendant_counts' in source
    ? { ...defaultDescendantCounts, ...filterDescendantCountsByType(source.descendant_counts.entity_type, type) }
    : defaultDescendantCounts;
}

export { getTileDescendantCounts };
