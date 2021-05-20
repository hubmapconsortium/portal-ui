import React from 'react';
import format from 'date-fns/format';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

import { LightBlueLink } from 'js/shared-styles/Links';
import { HeaderCell } from 'js/shared-styles/Table';
import { getColumnNames } from './utils';
import { StyledDiv } from './style';

function DerivedEntitiesTable({ entities, entityType }) {
  const columns = getColumnNames(entityType);

  return (
    <StyledDiv>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <HeaderCell key={column.id}>{column.label}</HeaderCell>
            ))}
          </TableRow>
        </TableHead>
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
        </TableBody>{' '}
      </Table>
    </StyledDiv>
  );
}

export default DerivedEntitiesTable;
