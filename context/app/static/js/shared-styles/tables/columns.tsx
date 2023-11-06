import React from 'react';
import format from 'date-fns/format';

import { EntityDocument, DatasetDocument, SampleDocument } from 'js/typings/search';
import { InternalLink } from 'js/shared-styles/Links';

interface CellContentProps<SearchDoc> {
  hit: SearchDoc;
}

function HubmapIDCell({ hit: { uuid, hubmap_id } }: CellContentProps<EntityDocument>) {
  return (
    <InternalLink href={`/browse/dataset/${uuid}`} variant="body2">
      {hubmap_id}
    </InternalLink>
  );
}

export const hubmapID = {
  id: 'hubmap_id',
  label: 'HuBMAP ID',
  sort: 'hubmap_id.keyword',
  cellContent: HubmapIDCell,
};

function LastModifiedTimestampCell({ hit: { last_modified_timestamp } }: CellContentProps<EntityDocument>) {
  return format(last_modified_timestamp, 'yyyy-MM-dd');
}

export const lastModifiedTimestamp = {
  id: 'last_modified_timestamp',
  label: 'Last Modified',
  cellContent: LastModifiedTimestampCell,
};

function AssayTypesCell({ hit: { mapped_data_types } }: CellContentProps<DatasetDocument>) {
  return mapped_data_types.join(', ');
}

export const assayTypes = {
  id: 'mapped_data_types',
  label: 'AssayTypes',
  sort: 'mapped_data_types.keyword',
  cellContent: AssayTypesCell,
};

function StatusCell({ hit: { mapped_status, mapped_data_access_level } }: CellContentProps<DatasetDocument>) {
  return `${mapped_status} (${mapped_data_access_level})`;
}

export const status = {
  id: 'status',
  label: 'Status',
  sort: 'mapped_status.keyword',
  cellContent: StatusCell,
};

function OrganCell({
  hit: { origin_samples_unique_mapped_organs },
}: CellContentProps<DatasetDocument | SampleDocument>) {
  return origin_samples_unique_mapped_organs.join(', ');
}

export const organ = {
  id: 'origin_samples.mapped_organ',
  label: 'Organ',
  sort: 'origin_samples.mapped_organ.keyword',
  cellContent: OrganCell,
};
