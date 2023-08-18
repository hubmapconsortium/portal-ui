import { useCallback, useReducer } from 'react';

type SortState = {
  columnId?: string;
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

export const useSortState = () => {
  const [sortState, dispatch] = useReducer(sortReducer, initialSortState);

  const sort = useCallback((columnId: string) => {
    dispatch({ type: 'sort', payload: columnId });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  return { sortState, sort, reset };
};
