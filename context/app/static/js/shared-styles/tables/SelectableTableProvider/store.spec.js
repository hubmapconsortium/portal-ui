import { reducer, types } from './store';

const defaultState = { selectedRows: new Set([]), headerRowIsSelected: false };
const selectedState = { ...defaultState, selectedRows: new Set(['apple', 'pear']) };

test('should select row', () => {
  const keyToSelect = 'apple';
  expect(reducer(defaultState, { type: types.selectRow, payload: keyToSelect })).toEqual({
    selectedRows: new Set([keyToSelect]),
  });
});

test('should deselect row', () => {
  const keyToDeselelect = 'apple';
  expect(reducer(selectedState, { type: types.deselectRow, payload: keyToDeselelect })).toEqual({
    selectedRows: new Set(['pear']),
  });
});

test('should toggle row', () => {
  const keyToToggle = 'apple';
  expect(reducer(defaultState, { type: types.toggleRow, payload: keyToToggle })).toEqual({
    selectedRows: new Set([keyToToggle]),
  });
  expect(reducer(selectedState, { type: types.toggleRow, payload: keyToToggle })).toEqual({
    selectedRows: new Set(['pear']),
  });
});

test('should set selected rows', () => {
  const keysToSet = ['apple', 'pear', 'lime'];
  expect(reducer(selectedState, { type: types.setSelectedRows, payload: keysToSet })).toEqual({
    selectedRows: new Set(keysToSet),
  });
});

test('should deselect all rows', () => {
  expect(reducer(selectedState, { type: types.deselectAllRows })).toEqual({
    selectedRows: new Set([]),
  });
});

test('should select header and rows', () => {
  const keysToSet = ['apple', 'pear', 'lime'];
  expect(reducer(defaultState, { type: types.selectHeaderAndRows, payload: keysToSet })).toEqual({
    headerRowIsSelected: true,
    selectedRows: new Set(keysToSet),
  });
});

test('should deselect header and rows', () => {
  expect(reducer({ ...selectedState, headerRowIsSelected: true }, { type: types.deselectHeaderAndRows })).toEqual({
    headerRowIsSelected: false,
    selectedRows: new Set([]),
  });
});

test('should toggle rows and header', () => {
  const keysToToggle = ['apple', 'pear', 'lime'];
  expect(reducer(defaultState, { type: types.toggleHeaderAndRows, payload: keysToToggle })).toEqual({
    headerRowIsSelected: true,
    selectedRows: new Set(keysToToggle),
  });
  expect(reducer({ ...selectedState, headerRowIsSelected: true }, { type: types.toggleHeaderAndRows })).toEqual({
    headerRowIsSelected: false,
    selectedRows: new Set([]),
  });
});
