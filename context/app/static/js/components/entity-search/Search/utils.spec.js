import { buildSortPairs } from './utils';

test('buildSortPairs should return an array including an asc and desc object for each field', () => {
  const fields = [
    { field: 'color', label: 'Color' },
    { field: 'size', label: 'Size' },
  ];
  expect(buildSortPairs(fields)).toEqual([
    {
      id: 'color.asc',
      label: 'Color',
      field: { color: 'asc' },
    },
    {
      id: 'color.desc',
      label: 'Color',
      field: { color: 'desc' },
    },
    {
      id: 'size.asc',
      label: 'Size',
      field: { size: 'asc' },
    },
    {
      id: 'size.desc',
      label: 'Size',
      field: { size: 'desc' },
    },
  ]);
});
