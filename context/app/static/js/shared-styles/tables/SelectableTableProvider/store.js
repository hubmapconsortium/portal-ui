import { create } from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

function getDeselectRowState(state, key) {
  const setCopy = new Set(state.selectedRows);
  setCopy.delete(key);
  return { selectedRows: setCopy };
}

function getSelectRowState(state, key) {
  const setCopy = new Set(state.selectedRows);
  return { selectedRows: setCopy.add(key) };
}

function getSetSelectedRowsState(keys) {
  return { selectedRows: new Set(keys) };
}

function getDeselectRowsState() {
  return { selectedRows: new Set() };
}

function getSelectHeaderAndRowsState(keys) {
  return { headerRowIsSelected: true, ...getSetSelectedRowsState(keys) };
}

function getDeselectHeaderAndRowsState() {
  return { headerRowIsSelected: false, ...getDeselectRowsState() };
}

const types = {
  selectRow: 'SELECT_ROW',
  deselectRow: 'DESELECT_ROW',
  toggleRow: 'TOGGLE_ROW',
  setSelectedRows: 'SET_SELECTED_ROWS',
  deselectAllRows: 'DESELECT_ALL_ROWS',
  selectHeaderAndRows: 'SELECT_HEADER_AND_ROWS',
  deselectHeaderAndRows: 'DESELECT_HEADER_AND_ROWS',
  toggleHeaderAndRows: 'TOGGLE_HEADER_AND_ROWS',
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case types.selectRow:
      return getSelectRowState(state, payload);
    case types.deselectRow:
      return getDeselectRowState(state, payload);
    case types.toggleRow:
      return state.selectedRows.has(payload) ? getDeselectRowState(state, payload) : getSelectRowState(state, payload);
    case types.setSelectedRows:
      return getSetSelectedRowsState(payload);
    case types.deselectAllRows:
      return getDeselectRowsState();
    case types.selectHeaderAndRows:
      return getSelectHeaderAndRowsState(payload);
    case types.deselectHeaderAndRows:
      return getDeselectHeaderAndRowsState();
    case types.toggleHeaderAndRows:
      return state.headerRowIsSelected ? getDeselectHeaderAndRowsState() : getSelectHeaderAndRowsState(payload);
    default:
      return state;
  }
};

const createStore = (tableLabel) =>
  create((set, get) => ({
    selectedRows: new Set(),
    headerRowIsSelected: false,
    tableLabel,
    dispatch: (args) => set((state) => reducer(state, args)),
    selectRow: (rowKey) => get().dispatch({ type: types.selectRow, payload: rowKey }),
    deselectRow: (rowKey) => get().dispatch({ type: types.deselectRow, payload: rowKey }),
    toggleRow: (rowKey) => get().dispatch({ type: types.toggleRow, payload: rowKey }),
    setSelectedRows: (rowKeys) => get().dispatch({ type: types.setSelectedRows, payload: rowKeys }),
    deselectAllRows: () => get().dispatch({ type: types.deselectAllRows }),
    selectHeaderAndRows: (rowKeys) => get().dispatch({ type: types.selectHeaderAndRows, payload: rowKeys }),
    deselectHeaderAndRows: () => get().dispatch({ type: types.deselectHeaderAndRows }),
    toggleHeaderAndRows: (rowKeys) => get().dispatch({ type: types.toggleHeaderAndRows, payload: rowKeys }),
  }));

export { Provider, useStore, createStore, reducer, types };
