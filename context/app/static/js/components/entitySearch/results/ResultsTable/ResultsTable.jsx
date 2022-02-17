/* eslint-disable no-underscore-dangle */
import React from 'react';
import get from 'lodash/get';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { useStore } from 'js/pages/entitySearch/searchConfig/store';
import { LightBlueLink } from 'js/shared-styles/Links';
import { StyledTable, StyledTableRow } from './style';

function ResultsTable({ data }) {
  const { fields } = useStore();

  return (
    <StyledTable data-testid="search-results-table">
      <TableHead>
        <TableRow>
          {fields.map(({ title }) => (
            <TableCell>{title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((hit) => (
          <StyledTableRow key={hit._id}>
            {fields.map(({ field }) => (
              <TableCell key={field}>
                {field === 'hubmap_id' ? (
                  <LightBlueLink href={`/browse/dataset/${hit._id}`}>{hit.hubmap_id}</LightBlueLink>
                ) : (
                  get(hit, field)
                )}
              </TableCell>
            ))}
          </StyledTableRow>
        ))}
      </TableBody>
    </StyledTable>
  );
}
export default ResultsTable;
