function filterDescendantCountsByType(descendant_counts, type) {
  // Support entities will not be in the descendants list.
  if (['Sample', 'Dataset'].includes(type)) {
    return descendant_counts?.Dataset ? { Dataset: descendant_counts.Dataset } : {};
  }
  return descendant_counts;
}

function getDescendantCounts(source, type) {
  const defaultDescendantCounts = type === 'Donor' ? { Sample: 0, Dataset: 0 } : { Dataset: 0 };
  return 'descendant_counts' in source
    ? { ...defaultDescendantCounts, ...filterDescendantCountsByType(source.descendant_counts.entity_type, type) }
    : defaultDescendantCounts;
}

export { getDescendantCounts };
