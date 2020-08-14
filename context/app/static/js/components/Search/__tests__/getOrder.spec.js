import { getOrder } from '../SortingTableHead';

test('get the order', () => {
  const pair = [
    { key: 'abc', order: 'desc' },
    { key: 'xyz', order: 'asc' },
  ];
  const selectedItems = ['abc'];
  expect(getOrder(pair, selectedItems)).toEqual('desc');
});
