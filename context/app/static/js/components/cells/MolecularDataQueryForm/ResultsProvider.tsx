import { createStoreContext, createStoreImmer } from 'js/helpers/zustand';
import { PropsWithChildren } from 'react';

interface ResultsProviderValues {
  resultCount: number;
  isLoading: boolean;
  error?: unknown;
}

interface ResultsProviderActions {
  setResults: (count: number, loading: boolean, error?: unknown) => void;
  setResultCount: (count: number) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: unknown) => void;
  reset: () => void;
}

interface ResultsProviderStore extends ResultsProviderValues, ResultsProviderActions {}

const initialState = {
  resultCount: 0,
  isLoading: false,
  error: null,
};

export const createStore = () =>
  createStoreImmer<ResultsProviderStore>((set) => ({
    ...initialState,
    setResults: (count, loading, error) => {
      set({ resultCount: count, isLoading: loading, error });
    },
    setResultCount: (count) => {
      set({ resultCount: count });
    },
    setIsLoading: (loading) => {
      set({ isLoading: loading });
    },
    setError: (error) => {
      set({ error });
    },
    reset: () => {
      set(initialState);
    },
  }));

export const [ResultsProvider, useResultsProvider] = createStoreContext<ResultsProviderStore, PropsWithChildren>(
  createStore,
  'Results Provider Store',
);
