import React from 'react';
import format from 'date-fns/format';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { LightBlueLink } from 'js/shared-styles/Links';

function DerivedEntitiesTableBody({ entities }) {
  return (
    <TableBody>
      {entities.map(
        ({
          _source: {
            uuid: entityUUID,
            display_doi,
            mapped_data_types,
            status,
            origin_sample,
            mapped_specimen_type,
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
            <TableCell>{mapped_data_types || origin_sample?.mapped_organ}</TableCell>
            <TableCell>{status || mapped_specimen_type}</TableCell>
            <TableCell>{descendant_counts?.entity_type?.Dataset || 0}</TableCell>
            <TableCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
          </TableRow>
        ),
      )}
    </TableBody>
  );
}

export default DerivedEntitiesTableBody;
