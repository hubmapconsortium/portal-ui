import { useCallback, useReducer } from 'react';

type SelectedItems = Set<string>;

type SelectAction =
  | {
      type: 'toggleItem';
      payload: string;
    }
  | {
      type: 'setSelectedItems';
      payload: string[];
    };

function selectReducer(state: SelectedItems, action: SelectAction): SelectedItems {
  switch (action.type) {
    case 'toggleItem':
      if (state.has(action.payload)) {
        state.delete(action.payload);
      } else {
        state.add(action.payload);
      }
      return new Set([...state]);
    case 'setSelectedItems':
      return new Set(action.payload);
    default:
      console.warn('Unrecognized action type', action);
      return state;
  }
}

export const useSelectItems = (initalSelectedItems: string[] = []) => {
  const [selectedItems, dispatch] = useReducer(selectReducer, new Set<string>(initalSelectedItems));

  const toggleItem = useCallback((itemKey: string) => {
    dispatch({ type: 'toggleItem', payload: itemKey });
  }, []);

  const setSelectedItems = useCallback((itemKeys: string[]) => {
    dispatch({ type: 'setSelectedItems', payload: itemKeys });
  }, []);

  const clearSelectedItems = useCallback(() => {
    dispatch({ type: 'setSelectedItems', payload: [] });
  }, []);

  return { selectedItems, toggleItem, setSelectedItems, clearSelectedItems };
};
