import { useCallback, useReducer } from 'react';

export interface SortState {
  columnId?: string;
  direction?: 'asc' | 'desc';
}

type SortAction =
  | {
      type: 'sort';
      payload: string;
    }
  | {
      type: 'reset';
      payload: SortState;
    };

const defaultInitialSortState: SortState = {
  columnId: undefined,
  direction: undefined,
} as SortState;

function sortReducer(state: SortState, action: SortAction): SortState {
  switch (action.type) {
    case 'sort':
      if (state.columnId === action.payload) {
        return {
          columnId: action.payload,
          direction: state.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        columnId: action.payload,
        direction: 'desc',
      } as SortState;
    case 'reset':
      return action.payload;
    default:
      console.warn('Unrecognized action type', action);
      return state;
  }
}

export type ColumnNameMapping = Record<string, string>;

/**
 * Hook to manage sort state for a table.
 *
 * @param columnNameMapping Mapping of column ID's to their sort values. If a column ID is not in the mapping, it will be used as is.
 * @example
 * ```
 * {
 *  'hubmap_id': 'hubmap_id.keyword',
 *  'donor.mapped_metadata.race': 'donor.mapped_metadata.race.keyword'
 * }
 * ```
 *
 * @returns {object} An object containing the sort state, a sort array for use with the ES API, and functions to set and reset the sort state.
 */
export const useSortState = (
  columnNameMapping: ColumnNameMapping,
  initialSortState: SortState = defaultInitialSortState,
) => {
  const [sortState, dispatch] = useReducer(sortReducer, initialSortState);

  const setSort = useCallback((columnId: string) => {
    dispatch({ type: 'sort', payload: columnId });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'reset', payload: initialSortState });
  }, [initialSortState]);

  const columnName =
    sortState.columnId && columnNameMapping[sortState.columnId]
      ? columnNameMapping[sortState.columnId]
      : sortState.columnId;

  // The doc _id is used as a tiebreaker which is necessary for search_after queries.
  // TODO: Update types to improve s
  const sort = columnName ? [{ [columnName]: sortState.direction }, { _id: 'asc' }] : [];

  return { sortState, sort, setSort, reset };
};
