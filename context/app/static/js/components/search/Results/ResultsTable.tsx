import React from 'react';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';

import { InternalLink } from 'js/shared-styles/Links';
import { getByPath } from './utils';
import { StyledTable, StyledTableBody, StyledTableRow, StyledTableCell } from './style';
import { useSearch } from '../Search';
import { useSearchStore } from '../store';
import { HitDoc } from '../types';
import SortingTableHead from './SortingTableHead';

function ResultCell({ hit, field }: { field: string; hit: SearchHit<HitDoc> }) {
  const source = hit?._source;

  if (!source) {
    return <StyledTableCell />;
  }

  const fieldValue = getByPath(source, field);

  return (
    <StyledTableCell key={field}>
      {field === 'hubmap_id' ? <InternalLink href={`/browse/${fieldValue}`}>{fieldValue}</InternalLink> : fieldValue}
    </StyledTableCell>
  );
}

function ResultsTable() {
  const { data } = useSearch();
  const { sourceFields } = useSearchStore();
  const hits = data?.hits?.hits;

  // TODO: Loading State
  if (!hits) {
    return null;
  }

  return (
    <StyledTable data-testid="search-results-table">
      <TableHead>
        <TableRow>
          {Object.entries(sourceFields).map(([field, { label }]) => (
            <SortingTableHead key={field} field={field} label={label} />
          ))}
        </TableRow>
      </TableHead>
      {hits.map((hit) => (
        <StyledTableBody key={hit._id}>
          <StyledTableRow>
            {Object.keys(sourceFields).map((field) => (
              <ResultCell hit={hit} field={field} key={field} />
            ))}
          </StyledTableRow>
        </StyledTableBody>
      ))}
    </StyledTable>
  );
}

export default ResultsTable;
