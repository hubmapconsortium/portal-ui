import { create } from 'zustand';

import { queryTypes } from 'js/components/cells/queryTypes';

interface CellsSearchState {
  results: unknown[];
  isLoading: boolean;
  minExpressionLog: number;
  minCellPercentage: number;
  cellVariableNames: string[];
  queryType: string;
  selectedQueryType: string;
}

const defaultState: CellsSearchState = {
  results: [],
  isLoading: true,
  minExpressionLog: 1,
  minCellPercentage: 10,
  cellVariableNames: [],
  queryType: queryTypes.gene.value,
  selectedQueryType: queryTypes.gene.value,
};

interface CellsSearchActions {
  setResults: (results: unknown[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setMinExpressionLog: (minExpressionLog: number) => void;
  setMinCellPercentage: (minCellPercentage: number) => void;
  setCellVariableNames: (cellVariableNames: string[]) => void;
  setQueryType: (queryType: string) => void;
  setSelectedQueryType: (selectedQueryType: string) => void;
  resetStore: () => void;
}

export type CellsSearchStore = CellsSearchState & CellsSearchActions;

export const useStore = create<CellsSearchStore>((set) => ({
  ...defaultState,
  setResults: (results: unknown[]) => set({ results }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setMinExpressionLog: (minExpressionLog: number) => set({ minExpressionLog }),
  setMinCellPercentage: (minCellPercentage: number) => set({ minCellPercentage }),
  setCellVariableNames: (cellVariableNames: string[]) => set({ cellVariableNames }),
  setQueryType: (queryType) => set({ queryType }),
  setSelectedQueryType: (selectedQueryType) => set({ selectedQueryType }),
  resetStore: () => set({ ...defaultState }),
}));
