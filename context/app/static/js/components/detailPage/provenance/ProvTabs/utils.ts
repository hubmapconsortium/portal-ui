export function hasDataTypes<T>(dataTypes: T[], typesToCheck: T[]) {
  if (!dataTypes) {
    return false;
  }

  return dataTypes.some((type) => typesToCheck.some((value) => type === value));
}

// Anchor on the tabs container so links can both scroll to the provenance
// section and open the graph tab (see ProvTabs).
export const PROVENANCE_GRAPH_ID = 'provenance-graph';
