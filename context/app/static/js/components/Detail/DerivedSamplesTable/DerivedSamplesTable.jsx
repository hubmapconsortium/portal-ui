import React from 'react';
import format from 'date-fns/format';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import DerivedEntitiesTable from 'js/components/Detail/DerivedEntitiesTable';
import { getSharedColumns } from 'js/components/Detail/DerivedEntitiesTable/utils';
import { LightBlueLink } from 'js/shared-styles/Links';

function DerivedSamplesTable({ entities }) {
  const { displayDOICol, descendantCountsCol, lastModifiedTimestampCol } = getSharedColumns();

  const sampleColumns = [
    { id: 'origin_sample.mapped_organ', label: 'Organ' },
    { id: 'mapped_specimen_type', label: 'Specimen' },
  ];

  const columns = [displayDOICol, ...sampleColumns, descendantCountsCol, lastModifiedTimestampCol];
  return (
    <DerivedEntitiesTable columns={columns}>
      {entities.map(
        ({
          _source: {
            uuid: entityUUID,
            display_doi,
            origin_sample,
            mapped_specimen_type,
            descendant_counts,
            last_modified_timestamp,
          },
        }) => (
          <TableRow key={display_doi}>
            <TableCell>
              <LightBlueLink href={`/browse/sample/${entityUUID}`} variant="body2">
                {display_doi}
              </LightBlueLink>
            </TableCell>
            <TableCell>{origin_sample?.mapped_organ}</TableCell>
            <TableCell>{mapped_specimen_type}</TableCell>
            <TableCell>{descendant_counts?.entity_type?.Dataset || 0}</TableCell>
            <TableCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
          </TableRow>
        ),
      )}
    </DerivedEntitiesTable>
  );
}

export default DerivedSamplesTable;
