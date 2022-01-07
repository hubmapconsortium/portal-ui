import create from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

function getDeselectRowState(state, key) {
  const setCopy = new Set(state.selectedRows);
  setCopy.delete(key);
  return { selectedRows: setCopy };
}

function getSelectRowState(state, key) {
  return { selectedRows: state.selectedRows.add(key) };
}

function getSetSelectedRowsState(keys) {
  return { selectedRows: new Set(keys) };
}

function getSelectHeaderAndRowsState(keys) {
  return { headerRowIsSelected: true, ...getSetSelectedRowsState(keys) };
}

function getDeselectHeaderAndRowsState() {
  return { headerRowIsSelected: false, ...getSetSelectedRowsState([]) };
}

const createStore = (tableLabel) =>
  create((set) => ({
    selectedRows: new Set([]),
    selectRow: (key) => set((state) => getSelectRowState(state, key)),
    deselectRow: (key) => set((state) => getDeselectRowState(state, key)),
    toggleRow: (key) =>
      set((state) => (state.selectedRows.has(key) ? getDeselectRowState(state, key) : getSelectRowState(state, key))),
    setSelectedRows: (keys) => set(getSetSelectedRowsState(keys)),
    deselectAllRows: () => set(getSetSelectedRowsState([])),
    headerRowIsSelected: false,
    selectHeaderAndRows: (keys) => set(getSelectHeaderAndRowsState(keys)),
    deselectHeaderAndRows: () => set(getDeselectHeaderAndRowsState()),
    toggleHeaderAndRows: (keys) =>
      set((state) => (state.headerRowIsSelected ? getDeselectHeaderAndRowsState() : getSelectHeaderAndRowsState(keys))),
    tableLabel,
  }));

export { Provider, useStore, createStore };
