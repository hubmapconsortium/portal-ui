/* eslint-disable no-underscore-dangle */
import React from 'react';
import get from 'lodash/get';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { LightBlueLink } from 'js/shared-styles/Links';
import { initialDatasetFields } from 'js/pages/TestSearch/initialConfig';
import { StyledTable, StyledTableRow } from './style';

function ResultsTable({ data }) {
  return (
    <StyledTable data-testid="search-results-table">
      <TableHead>
        <TableRow>
          {initialDatasetFields.map(({ title }) => (
            <TableCell>{title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((hit) => (
          <StyledTableRow key={hit._id}>
            {initialDatasetFields.map(({ field }) => (
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
