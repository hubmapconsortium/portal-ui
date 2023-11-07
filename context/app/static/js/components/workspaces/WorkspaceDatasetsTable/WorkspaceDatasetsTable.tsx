/* eslint-disable no-underscore-dangle */
import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { withSelectableTableProvider, useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { DatasetDocument } from 'js/typings/search';
import { getIDsQuery } from 'js/helpers/queries';
import { hubmapID, lastModifiedTimestamp, assayTypes, status, organ } from 'js/shared-styles/tables/columns';
import { Copy, Delete } from 'js/shared-styles/tables/actions';

const columns = [hubmapID, organ, assayTypes, status, lastModifiedTimestamp];
interface WorkspaceDatasetsTableProps {
  datasetsUUIDs: string[];
  removeDatasets: (ids: string[]) => void;
}

function WorkspaceDatasetsTable({ datasetsUUIDs, removeDatasets }: WorkspaceDatasetsTableProps) {
  const { selectedRows } = useSelectableTableStore();
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
      <SpacedSectionButtonRow
        buttons={
          <Stack direction="row" gap={1}>
            <Copy />
            <Delete
              onClick={() => removeDatasets([...selectedRows])}
              tooltip="Remove selected datasets."
              disabled={selectedRows.size === 0}
            />
          </Stack>
        }
      />
      <EntitiesTables<DatasetDocument> entities={[{ query, columns, entityType: 'Dataset' }]} />
    </Box>
  );
}
export default withSelectableTableProvider(WorkspaceDatasetsTable, 'workspace-datasets');
