import create from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

function deselectRowAndReturnRows(state, key) {
  const setCopy = new Set(state.selectedRows);
  setCopy.delete(key);
  return { selectedRows: setCopy };
}

function selectRowAndReturnRows(state, key) {
  return { selectedRows: state.selectedRows.add(key) };
}

const createStore = (tableLabel) =>
  create((set) => ({
    selectedRows: new Set([]),
    selectRow: (key) => set((state) => selectRowAndReturnRows(state, key)),
    deselectRow: (key) => set((state) => deselectRowAndReturnRows(state, key)),
    toggleRow: (key) =>
      set((state) =>
        state.selectedRows.has(key) ? deselectRowAndReturnRows(state, key) : selectRowAndReturnRows(state, key),
      ),
    setSelectedRows: (keys) => set({ selectedRows: new Set(keys) }),
    deselectAllRows: () => set({ selectedRows: new Set([]) }),
    headerRowIsSelected: false,
    selectHeaderRow: () => set({ headerRowIsSelected: true }),
    deselectHeaderRow: () => set({ headerRowIsSelected: false }),
    deselectHeaderAndRows: () => set({ headerRowIsSelected: false, selectedRows: new Set([]) }),
    tableLabel,
  }));

export { Provider, useStore, createStore };
