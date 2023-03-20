import format from 'date-fns/format';

const descendantCountsCol = {
  id: 'descendant_counts.entity_type.Dataset',
  label: 'Derived Dataset Count',
  renderColumnCell: ({ descendant_counts }) => descendant_counts?.entity_type?.Dataset || 0,
};

const lastModifiedTimestampCol = {
  id: 'last_modified_timestamp',
  label: 'Last Modified',
  renderColumnCell: ({ last_modified_timestamp }) => format(last_modified_timestamp, 'yyyy-MM-dd'),
};

export { descendantCountsCol, lastModifiedTimestampCol };
