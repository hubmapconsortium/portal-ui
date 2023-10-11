/* eslint-disable no-underscore-dangle */
import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import { useSearchConfigStore } from 'js/components/entity-search/SearchWrapper/store';
import { InternalLink } from 'js/shared-styles/Links';
import SortingHeaderCell from 'js/components/entity-search/results/SortingHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell/';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import { StyledTableRow } from './style';
import { getFieldFromHitFields } from './utils';

function ResultsTable({ hits, allResultsUUIDs }) {
  const { fields } = useSearchConfigStore();

  return (
    <TableContainer component={Paper}>
      <Table data-testid="search-results-table">
        <TableHead>
          <TableRow>
            <SelectableHeaderCell allTableRowKeys={allResultsUUIDs} />
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
              <SelectableRowCell rowKey={hit.id} />
              {Object.values(fields).map(({ field, identifier }) => (
                <TableCell key={field}>
                  {identifier === 'hubmap_id' ? (
                    <InternalLink href={`/browse/dataset/${hit.id}`}>{hit.fields[identifier]}</InternalLink>
                  ) : (
                    getFieldFromHitFields(hit.fields, identifier)
                  )}
                </TableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default ResultsTable;
