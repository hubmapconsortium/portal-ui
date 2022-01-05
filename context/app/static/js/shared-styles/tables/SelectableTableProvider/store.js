import create from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = (tableLabel) =>
  create((set) => ({
    selectedRows: new Set([]),
    selectRow: (key) => set((state) => ({ selectedRows: state.selectedRows.add(key) })),
    deselectRow: (key) =>
      set((state) => {
        const setCopy = new Set(state.selectedRows);
        setCopy.delete(key);
        return { selectedRows: setCopy };
      }),
    setSelectedRows: (keys) => set({ selectedRows: keys }),
    deselectAllRows: () => set({ selectedRows: new Set([]) }),
    headerRowIsSelected: false,
    selectHeaderRow: () => set({ headerRowIsSelected: true }),
    deselectHeaderRow: () => set({ headerRowIsSelected: false }),
    tableLabel,
  }));

export { Provider, useStore, createStore };
