export type ExtractState<S> = S extends { getState: () => infer X } ? X : never;
