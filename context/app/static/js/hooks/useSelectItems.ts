import { useCallback, useReducer } from 'react';

type SelectedItems = Set<string>;

type SelectAction =
  | {
      type: 'addItem';
      payload: string;
    }
  | {
      type: 'removeItem';
      payload: string;
    }
  | {
      type: 'setSelectedItems';
      payload: string[];
    };

function selectReducer(state: SelectedItems, action: SelectAction): SelectedItems {
  switch (action.type) {
    case 'addItem':
      state.add(action.payload);
      return new Set([...state]);
    case 'removeItem':
      state.delete(action.payload);
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

  const toggleItem = useCallback(
    (itemKey: string) => {
      if (selectedItems.has(itemKey)) {
        dispatch({ type: 'removeItem', payload: itemKey });
      } else {
        dispatch({ type: 'addItem', payload: itemKey });
      }
    },
    [selectedItems],
  );

  const setSelectedItems = useCallback((itemKeys: string[]) => {
    dispatch({ type: 'setSelectedItems', payload: itemKeys });
  }, []);

  const clearSelectedItems = useCallback(() => {
    dispatch({ type: 'setSelectedItems', payload: [] });
  }, []);

  return { selectedItems, toggleItem, setSelectedItems, clearSelectedItems };
};
