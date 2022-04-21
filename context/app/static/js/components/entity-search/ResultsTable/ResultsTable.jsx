/* eslint-disable no-underscore-dangle */
import React from 'react';
import get from 'lodash/get';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { LightBlueLink } from 'js/shared-styles/Links';
import SortingHeaderCell from 'js/components/entity-search/results/SortingHeaderCell';
import { StyledTable, StyledTableRow } from './style';

function ResultsTable({ hits }) {
  const { fields } = useStore();

  return (
    <StyledTable data-testid="search-results-table">
      <TableHead>
        <TableRow>
          {Object.values(fields).map(({ label, field }) => (
            <SortingHeaderCell key={field} field={field}>
              {label}
            </SortingHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {hits.items.map((hit) => (
          <StyledTableRow key={hit.id}>
            {Object.values(fields).map(({ field, identifier }) => (
              <TableCell key={field}>
                {identifier === 'hubmap_id' ? (
                  <LightBlueLink href={`/browse/dataset/${hit.id}`}>{hit.fields[identifier]}</LightBlueLink>
                ) : (
                  get(hit.fields, identifier)
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
