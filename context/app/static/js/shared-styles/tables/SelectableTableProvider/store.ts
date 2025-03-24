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
  createStoreImmer<SelectableTableStore>((set) => ({
    ...defaultInitialState,
    ...initialState,
    tableLabel,
    selectRow: (rowKey) => {
      set((state) => {
        state.selectedRows.add(rowKey);
        state.headerRowIsSelected = state.selectedRows.size === state.totalNumRows && state.totalNumRows > 0;
      });
    },

    deselectRow: (rowKey) => {
      set((state) => {
        state.selectedRows.delete(rowKey);
        state.headerRowIsSelected = false;
      });
    },

    deselectRows: (rowKeys) => {
      set((state) => {
        rowKeys.forEach((rowKey) => {
          state.selectedRows.delete(rowKey);
        });
        state.headerRowIsSelected = false;
      });
    },

    toggleRow: (rowKey) => {
      set((state) => {
        if (state.selectedRows.has(rowKey)) {
          state.selectedRows.delete(rowKey);
          state.headerRowIsSelected = false;
        } else {
          state.selectedRows.add(rowKey);
          state.headerRowIsSelected = state.selectedRows.size === state.totalNumRows && state.totalNumRows > 0;
        }
      });
    },

    setSelectedRows: (rowKeys) => {
      set((state) => {
        state.selectedRows = new Set(rowKeys);
        state.headerRowIsSelected = state.selectedRows.size === state.totalNumRows && state.totalNumRows > 0;
      });
    },
    setTotalNumRows: (totalNumRows) => {
      set((state) => {
        state.totalNumRows = totalNumRows;
        state.headerRowIsSelected = state.selectedRows.size === state.totalNumRows && state.totalNumRows > 0;
      });
    },
    deselectAllRows: () => {
      set((state) => {
        state.selectedRows.clear();
        state.headerRowIsSelected = false;
      });
    },

    selectHeaderAndRows: (rowKeys) => {
      set((state) => {
        state.headerRowIsSelected = true;
        state.selectedRows = new Set(rowKeys);
      });
    },

    deselectHeaderAndRows: () => {
      set((state) => {
        state.headerRowIsSelected = false;
        state.selectedRows.clear();
      });
    },

    toggleHeaderAndRows: (rowKeys) => {
      set((state) => {
        if (state.headerRowIsSelected) {
          state.headerRowIsSelected = false;
          state.selectedRows.clear();
        } else {
          state.headerRowIsSelected = true;
          state.selectedRows = new Set(rowKeys);
        }
      });
    },
  }));
