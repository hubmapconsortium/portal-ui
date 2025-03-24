import { Draft } from 'immer';
import { createStoreImmer } from 'js/helpers/zustand';

interface SelectableTableStoreState {
  selectedRows: Set<string>;
  totalNumRows: number;
  headerRowIsSelected: boolean;
  tableLabel: string;
}

export type InitialSelectableTableState = Omit<SelectableTableStoreState, 'tableLabel'>;

const defaultInitialState: InitialSelectableTableState = {
  selectedRows: new Set(),
  totalNumRows: 0,
  headerRowIsSelected: false,
};

interface SelectableTableStoreActions {
  selectRow: (rowKey: string) => void;
  deselectRow: (rowKey: string) => void;
  deselectRows: (rowKeys: string[]) => void;
  toggleRow: (rowKey: string) => void;
  setSelectedRows: (rowKeys: string[]) => void;
  setTotalNumRows: (totalNumRows: number) => void;
  deselectAllRows: () => void;
  selectHeaderAndRows: (rowKeys: string[]) => void;
  deselectHeaderAndRows: () => void;
  toggleHeaderAndRows: (rowKeys: string[]) => void;
}

export interface SelectableTableStore extends SelectableTableStoreState, SelectableTableStoreActions {}
export interface CreateSelectableTableStoreInput extends Partial<InitialSelectableTableState> {
  tableLabel: string;
}

export const createStore = ({ tableLabel, ...initialState }: CreateSelectableTableStoreInput) =>
  createStoreImmer<SelectableTableStore>((set) => {
    const updateHeaderRowIsSelected = (state: Draft<SelectableTableStore>) => {
      state.headerRowIsSelected = state.selectedRows.size === state.totalNumRows && state.totalNumRows > 0;
    };

    return {
      ...defaultInitialState,
      ...initialState,
      tableLabel,

      selectRow: (rowKey) => {
        set((state) => {
          state.selectedRows.add(rowKey);
          updateHeaderRowIsSelected(state);
        });
      },

      deselectRow: (rowKey) => {
        set((state) => {
          state.selectedRows.delete(rowKey);
          updateHeaderRowIsSelected(state);
        });
      },

      deselectRows: (rowKeys) => {
        set((state) => {
          rowKeys.forEach((rowKey) => {
            state.selectedRows.delete(rowKey);
          });
          updateHeaderRowIsSelected(state);
        });
      },

      toggleRow: (rowKey) => {
        set((state) => {
          if (state.selectedRows.has(rowKey)) {
            state.selectedRows.delete(rowKey);
          } else {
            state.selectedRows.add(rowKey);
          }
          updateHeaderRowIsSelected(state);
        });
      },

      setSelectedRows: (rowKeys) => {
        set((state) => {
          state.selectedRows = new Set(rowKeys);
          updateHeaderRowIsSelected(state);
        });
      },

      setTotalNumRows: (totalNumRows) => {
        set((state) => {
          state.totalNumRows = totalNumRows;
          updateHeaderRowIsSelected(state);
        });
      },

      deselectAllRows: () => {
        set((state) => {
          state.selectedRows.clear();
          updateHeaderRowIsSelected(state);
        });
      },

      selectHeaderAndRows: (rowKeys) => {
        set((state) => {
          state.selectedRows = new Set(rowKeys);
          updateHeaderRowIsSelected(state);
        });
      },

      deselectHeaderAndRows: () => {
        set((state) => {
          state.selectedRows.clear();
          updateHeaderRowIsSelected(state);
        });
      },

      toggleHeaderAndRows: (rowKeys) => {
        set((state) => {
          if (state.headerRowIsSelected) {
            state.selectedRows.clear();
          } else {
            state.selectedRows = new Set(rowKeys);
          }
          updateHeaderRowIsSelected(state);
        });
      },
    };
  });
