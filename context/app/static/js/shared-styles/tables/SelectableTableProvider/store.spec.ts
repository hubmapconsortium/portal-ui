import { act, renderHook } from 'test-utils/functions';
import { RenderHookResult, Renderer } from '@testing-library/react-hooks';
import { InitialSelectableTableState, createStore } from './store';

const defaultState = { selectedRows: new Set([]), headerRowIsSelected: false };
const selectedState = { ...defaultState, selectedRows: new Set(['apple', 'pear']) };

type StoreType = ReturnType<typeof createStore>;

const setupStore = (initialState: InitialSelectableTableState = defaultState) => {
  const render = renderHook(() => createStore({ tableLabel: 'test', ...initialState })) as RenderHookResult<
    StoreType,
    StoreType,
    Renderer<StoreType>
  >;
  if (!render.result.current) {
    throw new Error('Hook result is undefined');
  }
  return render;
};

const getState = ({ result }: RenderHookResult<StoreType, StoreType, Renderer<StoreType>>) => {
  if (!result.current) {
    throw new Error('Hook result is undefined');
  }
  return result.current.getState();
};

test('should select row', () => {
  const keyToSelect = 'apple';
  const store = setupStore();
  const { selectRow } = getState(store);
  act(() => selectRow(keyToSelect));
  expect(getState(store).selectedRows).toEqual(new Set([keyToSelect]));
});

test('should deselect row', () => {
  const keyToDeselect = 'apple';
  const store = setupStore(selectedState);
  const { deselectRow } = getState(store);
  act(() => deselectRow(keyToDeselect));
  expect(getState(store).selectedRows).toEqual(new Set(['pear']));
});

test('should toggle row', () => {
  const keyToToggle = 'apple';
  const store = setupStore(selectedState);
  const { toggleRow } = getState(store);
  act(() => toggleRow(keyToToggle));
  expect(getState(store).selectedRows).toEqual(new Set(['pear']));
  act(() => toggleRow(keyToToggle));
  expect(getState(store).selectedRows).toEqual(selectedState.selectedRows);
});

test('should set selected rows', () => {
  const keysToSet = ['apple', 'pear', 'lime'];
  const store = setupStore(selectedState);
  const { setSelectedRows } = getState(store);
  act(() => setSelectedRows(keysToSet));
  expect(getState(store).selectedRows).toEqual(new Set(keysToSet));
});

test('should deselect all rows', () => {
  const store = setupStore(selectedState);
  const { deselectAllRows } = getState(store);
  act(() => deselectAllRows());
  expect(getState(store).selectedRows).toEqual(new Set([]));
});

test('should select header and rows', () => {
  const keysToSet = ['apple', 'pear', 'lime'];
  const store = setupStore();
  const { selectHeaderAndRows } = getState(store);
  act(() => selectHeaderAndRows(keysToSet));
  expect(getState(store).selectedRows).toEqual(new Set(keysToSet));
  expect(getState(store).headerRowIsSelected).toEqual(true);
});

test('should deselect header and rows', () => {
  const store = setupStore({ ...selectedState, headerRowIsSelected: true });
  const { deselectHeaderAndRows } = getState(store);
  act(() => deselectHeaderAndRows());
  expect(getState(store).selectedRows).toEqual(new Set([]));
  expect(getState(store).headerRowIsSelected).toEqual(false);
});

test('should toggle rows and header', () => {
  const keysToToggle = ['apple', 'pear', 'lime'];
  const store = setupStore();
  const { toggleHeaderAndRows } = getState(store);
  act(() => toggleHeaderAndRows(keysToToggle));
  expect(getState(store).selectedRows).toEqual(new Set(keysToToggle));
  expect(getState(store).headerRowIsSelected).toEqual(true);
  act(() => toggleHeaderAndRows(keysToToggle));
  expect(getState(store).selectedRows).toEqual(new Set([]));
  expect(getState(store).headerRowIsSelected).toEqual(false);
});
