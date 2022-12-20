import React from 'react';
import format from 'date-fns/format';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { getSharedColumns } from 'js/shared-styles/tables/EntitiesTable/utils';
import { LightBlueLink } from 'js/shared-styles/Links';

function DerivedSamplesTable({ entities }) {
  const { displayDOICol, descendantCountsCol, lastModifiedTimestampCol } = getSharedColumns();

  const sampleColumns = [
    { id: 'origin_sample.mapped_organ', label: 'Organ' },
    { id: 'sample_category', label: 'Sample Category' },
  ];

  const columns = [displayDOICol, ...sampleColumns, descendantCountsCol, lastModifiedTimestampCol];
  return (
    <EntitiesTable columns={columns}>
      {entities.map(
        ({
          _source: {
            uuid: entityUUID,
            hubmap_id,
            origin_sample,
            sample_category,
            descendant_counts,
            last_modified_timestamp,
          },
        }) => (
          <TableRow key={hubmap_id}>
            <TableCell>
              <LightBlueLink href={`/browse/sample/${entityUUID}`} variant="body2">
                {hubmap_id}
              </LightBlueLink>
            </TableCell>
            <TableCell>{origin_sample?.mapped_organ}</TableCell>
            <TableCell>{sample_category}</TableCell>
            <TableCell>{descendant_counts?.entity_type?.Dataset || 0}</TableCell>
            <TableCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
          </TableRow>
        ),
      )}
    </EntitiesTable>
  );
}

export default DerivedSamplesTable;
