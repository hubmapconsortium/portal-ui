import { Dataset, isDataset, isSample, PartialEntity } from 'js/components/types';
import { getEntityCreationInfo } from 'js/helpers/functions';

interface Column {
  id: string;
  label: string;
  renderColumnCell: (entity: PartialEntity & Partial<Pick<Dataset, 'published_timestamp'>>) => string | number;
}

const descendantCountsCol: Column = {
  id: 'descendant_counts.entity_type.Dataset',
  label: 'Derived Dataset Count',
  renderColumnCell: ({ descendant_counts }) => descendant_counts?.entity_type?.Dataset ?? 0,
};

const createdTimestampCol: Column = {
  id: 'created_timestamp',
  label: 'Creation Date',
  renderColumnCell: ({ entity_type, created_timestamp }) =>
    getEntityCreationInfo({ entity_type, created_timestamp }).creationDate,
};

const publishedTimestampCol: Column = {
  id: 'published_timestamp',
  label: 'Publication Date',
  renderColumnCell: ({ entity_type, published_timestamp }) =>
    getEntityCreationInfo({ entity_type, published_timestamp }).creationDate,
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
  createdTimestampCol,
];

const derivedDatasetsColumns = [dataTypesCol, statusCol, descendantCountsCol, publishedTimestampCol];

export {
  derivedSamplesColumns,
  derivedDatasetsColumns,
  createdTimestampCol,
  publishedTimestampCol,
  organCol,
  dataTypesCol,
  statusCol,
};
