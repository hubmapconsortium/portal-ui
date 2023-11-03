/* eslint-disable no-underscore-dangle */
import React, { useMemo } from 'react';
import format from 'date-fns/format';
import Box from '@mui/material/Box';

import { InternalLink } from 'js/shared-styles/Links';
import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { DatasetDocument } from 'js/typings/search';
import { getIDsQuery } from 'js/helpers/queries';

interface CellContentProps {
  hit: DatasetDocument;
}

const columns = [
  {
    id: 'hubmap_id',
    label: 'HuBMAP ID',
    sort: 'hubmap_id.keyword',
    cellContent: ({ hit: { uuid, hubmap_id } }: CellContentProps) => (
      <InternalLink href={`/browse/dataset/${uuid}`} variant="body2">
        {hubmap_id}
      </InternalLink>
    ),
  },
  {
    id: 'last_modified_timestamp',
    label: 'Last Modified',
    cellContent: ({ hit: { last_modified_timestamp } }: CellContentProps) =>
      format(last_modified_timestamp, 'yyyy-MM-dd'),
  },
];

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
      _source: ['hubmap_id', 'uuid', 'last_modified_timestamp'],
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
