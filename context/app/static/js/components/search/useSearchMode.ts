import { parseAsStringLiteral, useQueryState } from 'nuqs';

export const SEARCH_MODES = ['filter', 'say-see'] as const;
export type SearchMode = (typeof SEARCH_MODES)[number];

const modeParser = parseAsStringLiteral(SEARCH_MODES).withDefault('filter');

export function useSearchMode() {
  return useQueryState('mode', modeParser);
}
