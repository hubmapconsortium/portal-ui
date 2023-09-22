import create from 'zustand';
import { queryTypes } from 'js/components/cells/queryTypes';

const types = {
  setResults: 'SET_RESULTS',
  setIsLoading: 'SET_IS_LOADING',
  setMinExpressionLog: 'SET_MIN_EXPRESSION_LOG',
  setMinCellPercentage: 'SET_MIN_CELL_PERCENTAGE',
  setCellVariableNames: 'SET_CELL_VARIABLE_NAMES',
  setQueryType: 'SET_QUERY_TYPE',
  setSelectedQueryType: 'SET_SELECTED_QUERY_TYPE',
  resetStore: 'RESET_STORE',
};

const defaultState = {
  results: [],
  isLoading: true,
  minExpressionLog: 1,
  minCellPercentage: 10,
  cellVariableNames: [],
  queryType: queryTypes.gene.value,
  selectedQueryType: queryTypes.gene.value,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case types.setResults:
      return { results: payload };
    case types.setIsLoading:
      return { isLoading: payload };
    case types.setMinExpressionLog:
      return { minExpressionLog: payload };
    case types.setMinCellPercentage:
      return { minCellPercentage: payload };
    case types.setCellVariableNames:
      return { cellVariableNames: payload };
    case types.setQueryType:
      return { queryType: payload };
    case types.setSelectedQueryType:
      return { selectedQueryType: payload };
    case types.resetStore:
      return defaultState;
    default:
      return state;
  }
};

const useStore = create((set, get) => ({
  ...defaultState,
  dispatch: (args) => set((state) => reducer(state, args)),
  setResults: (results) => get().dispatch({ type: types.setResults, payload: results }),
  setIsLoading: (isLoading) => get().dispatch({ type: types.setIsLoading, payload: isLoading }),
  setMinExpressionLog: (minExpressionLog) =>
    get().dispatch({ type: types.setMinExpressionLog, payload: minExpressionLog }),
  setMinCellPercentage: (minCellPercentage) =>
    get().dispatch({ type: types.setMinCellPercentage, payload: minCellPercentage }),
  setCellVariableNames: (cellVariableNames) =>
    get().dispatch({ type: types.setCellVariableNames, payload: cellVariableNames }),
  setQueryType: (queryType) => get().dispatch({ type: types.setQueryType, payload: queryType }),
  setSelectedQueryType: (selectedQueryType) =>
    get().dispatch({ type: types.setSelectedQueryType, payload: selectedQueryType }),
  resetStore: () => get().dispatch({ type: types.resetStore }),
}));

export { useStore, reducer, types };
