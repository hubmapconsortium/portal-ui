import { resultFieldsToSortOptions } from '../utils';

test('resultFieldsToSortOptions', () => {
  const fields = [
    { id: 'plain_text', name: 'Text' },
    { id: 'numeric_value', name: 'Number' },
    { id: 'array.size', name: 'Size' },
    { id: 'mapped_last_modified_timestamp', name: 'Last Modified' },
  ];
  const sortOptions = resultFieldsToSortOptions(fields);
  expect(sortOptions).toEqual([
    {
      defaultOption: false,
      field: 'plain_text.keyword',
      label: 'Text',
      order: 'desc',
    },
    {
      defaultOption: false,
      field: 'plain_text.keyword',
      label: 'Text',
      order: 'asc',
    },
    {
      defaultOption: false,
      field: 'numeric_value',
      label: 'Number',
      order: 'desc',
    },
    {
      defaultOption: false,
      field: 'numeric_value',
      label: 'Number',
      order: 'asc',
    },
    {
      defaultOption: false,
      field: 'array.size',
      label: 'Size',
      order: 'desc',
    },
    {
      defaultOption: false,
      field: 'array.size',
      label: 'Size',
      order: 'asc',
    },
    {
      defaultOption: true,
      field: 'mapped_last_modified_timestamp.keyword',
      label: 'Last Modified',
      order: 'desc',
    },
    {
      defaultOption: false,
      field: 'mapped_last_modified_timestamp.keyword',
      label: 'Last Modified',
      order: 'asc',
    },
  ]);
});
