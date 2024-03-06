import { mouseButtonMap, formatEventCategoryAndLabel } from './utils';

describe('mouseButtonMap', () => {
  it('should return the correct mouse button name for known buttons', () => {
    expect(mouseButtonMap[0]).toEqual('Left');
    expect(mouseButtonMap[1]).toEqual('Middle');
    expect(mouseButtonMap[2]).toEqual('Right');
  });
  it('should return the correct mouse button name for unknown buttons', () => {
    expect(mouseButtonMap[3]).toEqual('Unknown (3)');
    expect(mouseButtonMap[4]).toEqual('Unknown (4)');
    expect(mouseButtonMap[5]).toEqual('Unknown (5)');
  });
});

describe('formatEventCategoryAndLabel', () => {
  it('should return the correct category and label', () => {
    expect(formatEventCategoryAndLabel('category', 'label')).toEqual({
      category: 'Visualization - category',
      label: 'label',
    });
  });
});
