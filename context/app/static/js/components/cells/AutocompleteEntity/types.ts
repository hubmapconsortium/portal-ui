export interface AutocompleteQueryKey {
  targetEntity: string;
  substring: string;
}

export interface AutocompleteResult {
  match: string;
  full: string;
  pre: string;
  post: string;
}

export type AutocompleteQueryResponse = AutocompleteResult[];
