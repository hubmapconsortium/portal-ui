import { create } from 'zustand';

import { QueryType, queryTypes } from 'js/components/cells/queryTypes';
import { WrappedCellsResultsDataset } from './types';

export type ResultCounts = Record<'matching' | 'total', number>;

interface CellsSearchState {
  results: WrappedCellsResultsDataset[];
  resultCounts?: ResultCounts;
  isLoading: boolean;
  minExpressionLog: number;
  minCellPercentage: number;
  cellVariableNames: string[];
  queryType: QueryType;
}

const defaultState: CellsSearchState = {
  results: [],
  resultCounts: undefined,
  isLoading: true,
  minExpressionLog: 1,
  minCellPercentage: 5,
  cellVariableNames: [],
  queryType: queryTypes.gene.value,
};

interface CellsSearchActions {
  setResults: (results: WrappedCellsResultsDataset[]) => void;
  setResultCounts: (resultsCounts: ResultCounts) => void;
  setIsLoading: (isLoading: boolean) => void;
  setMinExpressionLog: (minExpressionLog: number) => void;
  setMinCellPercentage: (minCellPercentage: number) => void;
  setCellVariableNames: (cellVariableNames: string[]) => void;
  setQueryType: (queryType: QueryType) => void;
  resetStore: () => void;
}

export interface CellsSearchStore extends CellsSearchState, CellsSearchActions {}

export const useStore = create<CellsSearchStore>((set) => ({
  ...defaultState,
  setResults: (results: WrappedCellsResultsDataset[]) => set({ results }),
  setResultCounts: (resultCounts: ResultCounts | undefined) => set({ resultCounts }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setMinExpressionLog: (minExpressionLog: number) => set({ minExpressionLog }),
  setMinCellPercentage: (minCellPercentage: number) => set({ minCellPercentage }),
  setCellVariableNames: (cellVariableNames: string[]) => set({ cellVariableNames }),
  setQueryType: (queryType) => set({ queryType }),
  resetStore: () => set({ ...defaultState }),
}));
