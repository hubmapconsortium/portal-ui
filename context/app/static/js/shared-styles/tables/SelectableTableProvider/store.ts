import { createStoreImmer } from 'js/helpers/zustand';

interface SelectableTableStoreState {
  selectedRows: Set<string>;
  headerRowIsSelected: boolean;
  tableLabel: string;
}

export type InitialSelectableTableState = Omit<SelectableTableStoreState, 'tableLabel'>;

const defaultInitialState: InitialSelectableTableState = {
  selectedRows: new Set(),
  headerRowIsSelected: false,
};

interface SelectableTableStoreActions {
  selectRow: (rowKey: string) => void;
  deselectRow: (rowKey: string) => void;
  deselectRows: (rowKeys: string[]) => void;
  toggleRow: (rowKey: string) => void;
  setSelectedRows: (rowKeys: string[]) => void;
  deselectAllRows: () => void;
  selectHeaderAndRows: (rowKeys: string[]) => void;
  deselectHeaderAndRows: () => void;
  toggleHeaderAndRows: (rowKeys: string[]) => void;
}

export type SelectableTableStore = SelectableTableStoreState & SelectableTableStoreActions;

const createStore = (tableLabel: string, initialState: Partial<InitialSelectableTableState> = {}) =>
  createStoreImmer<SelectableTableStore>((set) => ({
    ...defaultInitialState,
    ...initialState,
    tableLabel,
    selectRow: (rowKey) => {
      set((state) => {
        state.selectedRows.add(rowKey);
      });
    },
    deselectRow: (rowKey) => {
      set((state) => {
        state.selectedRows.delete(rowKey);
      });
    },
    deselectRows: (rowKeys) => {
      set((state) => {
        rowKeys.forEach((rowKey) => {
          state.selectedRows.delete(rowKey);
        });
      });
    },
    toggleRow: (rowKey) => {
      set((state) => {
        if (state.selectedRows.has(rowKey)) {
          state.selectedRows.delete(rowKey);
        } else {
          state.selectedRows.add(rowKey);
        }
      });
    },
    setSelectedRows: (rowKeys) => {
      set((state) => {
        state.selectedRows = new Set(rowKeys);
      });
    },
    deselectAllRows: () => {
      set((state) => {
        state.selectedRows.clear();
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

export { createStore };
