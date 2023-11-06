/* eslint-disable no-underscore-dangle */
import React, { useMemo } from 'react';
import Box from '@mui/material/Box';

import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { DatasetDocument } from 'js/typings/search';
import { getIDsQuery } from 'js/helpers/queries';
import { hubmapID, lastModifiedTimestamp, assayTypes, status, organ } from 'js/shared-styles/tables/columns';

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];
interface WorkspaceDatasetsTableProps {
  datasetsUUIDs: string[];
}

function WorkspaceDatasetsTable({ datasetsUUIDs }: WorkspaceDatasetsTableProps) {
  const query = useMemo(
    () => ({
      query: {
        ...getIDsQuery(datasetsUUIDs),
      },
      size: 500,
      _source: [
        'hubmap_id',
        'origin_samples_unique_mapped_organs',
        'mapped_status',
        'mapped_data_types',
        'mapped_data_access_level',
        'uuid',
        'last_modified_timestamp',
      ],
    }),
    [datasetsUUIDs],
  );

  return (
    <Box>
      <EntitiesTables<DatasetDocument> entities={[{ query, columns, entityType: 'Dataset' }]} />
    </Box>
  );
}
export default withSelectableTableProvider(WorkspaceDatasetsTable, 'workspace-datasets');
