import React from 'react';
import format from 'date-fns/format';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import DerivedEntitiesTable from 'js/components/Detail/DerivedEntitiesTable';
import { getSharedColumns } from 'js/components/Detail/DerivedEntitiesTable/utils';
import { LightBlueLink } from 'js/shared-styles/Links';

function DerivedDatasetsTable({ entities }) {
  const { displayDOICol, descendantCountsCol, lastModifiedTimestampCol } = getSharedColumns();

  const datasetColumns = [
    { id: 'mapped_data_types', label: 'Data Types' },
    { id: 'status', label: 'Status' },
  ];

  const columns = [displayDOICol, ...datasetColumns, descendantCountsCol, lastModifiedTimestampCol];
  return (
    <DerivedEntitiesTable columns={columns}>
      {entities.map(
        ({
          _source: {
            uuid: entityUUID,
            display_doi,
            mapped_data_types,
            status,
            descendant_counts,
            last_modified_timestamp,
          },
        }) => (
          <TableRow key={display_doi}>
            <TableCell>
              <LightBlueLink href={`/browse/dataset/${entityUUID}`} variant="body2">
                {display_doi}
              </LightBlueLink>
            </TableCell>
            <TableCell>{mapped_data_types}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{descendant_counts?.entity_type?.Dataset || 0}</TableCell>
            <TableCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
          </TableRow>
        ),
      )}
    </DerivedEntitiesTable>
  );
}

export default DerivedDatasetsTable;
