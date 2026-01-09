import React from 'react';
import EntityTable from 'js/shared-styles/tables/EntitiesTable/EntityTable';
import { withSelectableTableProvider, useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { Dataset } from 'js/components/types';
import {
  hubmapID,
  organCol,
  datasetDescription,
  donorAge,
  donorBMI,
  donorSex,
  donorRace,
  createdTimestamp,
} from 'js/shared-styles/tables/columns';

interface IntegratedDataTableProps {
  entityType: 'Dataset' | 'Donor' | 'Sample';
  entityIds: string[];
}

function IntegratedDataTable({ entityType, entityIds }: IntegratedDataTableProps) {
  const { selectedRows } = useSelectableTableStore();

  const entityTypeAdditionalSources = {
    Dataset: ['origin_samples_unique_mapped_organs', 'entity_type', 'description'],
    Donor: ['mapped_metadata', 'created_timestamp'],
    Sample: ['origin_samples_unique_mapped_organs', 'created_timestamp'],
  };
  const entityTypeAdditionalColumns = {
    Dataset: [organCol, datasetDescription],
    Donor: [donorAge, donorBMI, donorSex, donorRace, createdTimestamp],
    Sample: [organCol, createdTimestamp],
  };

  return (
    <EntityTable<Dataset>
      isSelectable={true}
      query={{
        query: {
          bool: {
            must: {
              ids: {
                values: entityIds,
              },
            },
          },
        },
        size: 10000,
        _source: [
          'hubmap_id',
          'mapped_status',
          'mapped_data_types',
          'mapped_data_access_level',
          'uuid',
          ...entityTypeAdditionalSources[entityType],
        ],
      }}
      columns={[hubmapID, ...entityTypeAdditionalColumns[entityType]]}
      numSelected={selectedRows.size}
    />
  );
}

export default withSelectableTableProvider(IntegratedDataTable, 'integrated-data');
