import React from 'react';
import EntityTable from 'js/shared-styles/tables/EntitiesTable/EntityTable';
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
  if (entityType === 'Dataset')
    return (
      <EntityTable<Dataset>
        isSelectable={false}
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
            'origin_samples_unique_mapped_organs',
            'mapped_status',
            'mapped_data_types',
            'mapped_data_access_level',
            'uuid',
            'entity_type',
            'description',
          ],
        }}
        columns={[hubmapID, organCol, datasetDescription]}
      />
    );

  if (entityType === 'Donor')
    return (
      <EntityTable<Dataset>
        isSelectable={false}
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
            'mapped_metadata',
            'mapped_status',
            'mapped_data_types',
            'mapped_data_access_level',
            'uuid',
            'created_timestamp',
          ],
        }}
        columns={[hubmapID, donorAge, donorBMI, donorSex, donorRace, createdTimestamp]}
      />
    );

  if (entityType === 'Sample')
    return (
      <EntityTable<Dataset>
        isSelectable={false}
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
            'origin_samples_unique_mapped_organs',
            'mapped_status',
            'mapped_data_types',
            'mapped_data_access_level',
            'uuid',
            'created_timestamp',
          ],
        }}
        columns={[hubmapID, organCol, createdTimestamp]}
      />
    );
}
export default IntegratedDataTable;
