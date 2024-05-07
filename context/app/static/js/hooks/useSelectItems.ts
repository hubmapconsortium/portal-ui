import { useCallback, useReducer } from 'react';

export type SelectedItems = Set<string>;

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
  const temp = new Set([...state]);
  switch (action.type) {
    case 'addItem':
      temp.add(action.payload);
      return new Set([...temp]);
    case 'removeItem':
      temp.delete(action.payload);
      return new Set([...temp]);
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
  const addItem = useCallback((itemKey: string) => {
    dispatch({ type: 'addItem', payload: itemKey });
  }, []);

  const removeItem = useCallback((itemKey: string) => {
    dispatch({ type: 'removeItem', payload: itemKey });
  }, []);

  const setSelectedItems = useCallback((itemKeys: string[]) => {
    dispatch({ type: 'setSelectedItems', payload: itemKeys });
  }, []);

  const clearSelectedItems = useCallback(() => {
    dispatch({ type: 'setSelectedItems', payload: [] });
  }, []);

  return { selectedItems, toggleItem, addItem, removeItem, setSelectedItems, clearSelectedItems };
};
