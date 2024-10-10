import { format } from 'date-fns/format';
import { isDataset, isSample, PartialEntity } from 'js/components/types';

interface Column {
  id: string;
  label: string;
  renderColumnCell: (entity: PartialEntity) => string | number;
}

const descendantCountsCol: Column = {
  id: 'descendant_counts.entity_type.Dataset',
  label: 'Derived Dataset Count',
  renderColumnCell: ({ descendant_counts }) => descendant_counts?.entity_type?.Dataset ?? 0,
};

const lastModifiedTimestampCol: Column = {
  id: 'last_modified_timestamp',
  label: 'Last Modified',
  renderColumnCell: ({ last_modified_timestamp }) => format(last_modified_timestamp ?? 0, 'yyyy-MM-dd'),
};

const organCol: Column = {
  id: 'origin_samples_unique_mapped_organs',
  label: 'Organ',
  renderColumnCell: (entity) =>
    isDataset(entity) || isSample(entity) ? entity.origin_samples_unique_mapped_organs.join(', ') : '',
};

const dataTypesCol: Column = {
  id: 'mapped_data_types',
  label: 'Data Types',
  renderColumnCell: (entity) => (isDataset(entity) ? entity.mapped_data_types.join(', ') : ''),
};

const statusCol: Column = {
  id: 'mapped_status',
  label: 'Status',
  renderColumnCell: ({ mapped_status, status }) => mapped_status ?? status ?? '',
};

const derivedSamplesColumns: Column[] = [
  organCol,
  {
    id: 'sample_category',
    label: 'Sample Category',
    renderColumnCell: (entity) => (isSample(entity) ? entity.sample_category : ''),
  },
  descendantCountsCol,
  lastModifiedTimestampCol,
];

const derivedDatasetsColumns = [dataTypesCol, statusCol, descendantCountsCol, lastModifiedTimestampCol];

export { derivedSamplesColumns, derivedDatasetsColumns, lastModifiedTimestampCol, organCol, dataTypesCol, statusCol };
