import { useCallback, useReducer } from 'react';

type SortState = {
  columnId?: string;
  columnSortName?: string;
  direction?: 'asc' | 'desc';
};

type SortAction =
  | {
      type: 'sort';
      payload: string;
    }
  | {
      type: 'reset';
    };

const initialSortState: SortState = {
  columnId: undefined,
  columnSortName: undefined,
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
      return initialSortState;
    default:
      console.warn('Unrecognized action type', action);
      return state;
  }
}

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
export const useSortState = (columnNameMapping: Record<string, string>) => {
  const [sortState, dispatch] = useReducer(sortReducer, initialSortState);

  const setSort = useCallback((columnId: string) => {
    dispatch({ type: 'sort', payload: columnId });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const columnName =
    sortState.columnId && columnNameMapping[sortState.columnId]
      ? columnNameMapping[sortState.columnId]
      : sortState.columnId;

  const sort = columnName ? [{ [columnName]: sortState.direction }] : [];

  return { sortState, sort, setSort, reset };
};
