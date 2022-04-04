/* eslint-disable no-underscore-dangle */
import React from 'react';
import get from 'lodash/get';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { LightBlueLink } from 'js/shared-styles/Links';
import { StyledTable, StyledTableRow } from './style';

function ResultsTable({ hits }) {
  const { fields } = useStore();

  return (
    <StyledTable data-testid="search-results-table">
      <TableHead>
        <TableRow>
          {fields.map(({ label, field }) => (
            <TableCell key={field}>{label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {hits.items.map((hit) => (
          <StyledTableRow key={hit.id}>
            {fields.map(({ field }) => (
              <TableCell key={field}>
                {field === 'hubmap_id' ? (
                  <LightBlueLink href={`/browse/dataset/${hit.id}`}>{hit.fields[field]}</LightBlueLink>
                ) : (
                  get(hit.fields, field)
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
