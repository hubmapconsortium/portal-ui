import { act, renderHook } from 'test-utils/functions';
import { useExpandableItems } from './hooks';

const testItems = [
  { title: 'Item 1', date: '2021-01-01', description: 'Description 1' },
  { title: 'Item 2', date: '2021-02-01', description: 'Description 2' },
  { title: 'Item 3', date: '2021-03-01', description: 'Description 3' },
  { title: 'Item 4', date: '2021-04-01', description: 'Description 4' },
  { title: 'Item 5', date: '2021-05-01', description: 'Description 5' },
];

describe('useExpandableItems', () => {
  it('should return all items when expandable is false', () => {
    const { result } = renderHook(() => useExpandableItems(testItems, false));
    const { itemsToRender } = result.current;
    expect(itemsToRender).toEqual(testItems);
  });
  it('should return only the first 3 items when expandable is true', () => {
    const { result } = renderHook(() => useExpandableItems(testItems, true));
    const { itemsToRender } = result.current;
    expect(itemsToRender).toEqual(testItems.slice(0, 3));
  });
  it('should return all items when expandable is true and expanded is true', () => {
    const { result } = renderHook(() => useExpandableItems(testItems, true));
    const { handleExpand } = result.current;
    act(() => handleExpand());
    expect(result.current.itemsToRender).toEqual(testItems);
  });
});
