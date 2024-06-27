import React from 'react';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';

import { InternalLink } from 'js/shared-styles/Links';
import { Entity } from 'js/components/types';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell';
import { getByPath } from './utils';
import {
  StyledTable,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
  ArrowUpOn,
  ArrowDownOn,
  ArrowDownOff,
  StyledHeaderCell,
} from './style';
import { useSearch } from '../Search';
import { useSearchStore } from '../store';
import { getFieldLabel } from '../labelMap';
import ViewMoreResults from './ViewMoreResults';

type SortDirection = 'asc' | 'desc';

export function OrderIcon({
  direction,
  isCurrentSortField,
}: {
  direction: SortDirection;
  isCurrentSortField: boolean;
}) {
  if (!isCurrentSortField) return <ArrowDownOff />;
  if (direction === 'asc') return <ArrowUpOn />;
  if (direction === 'desc') return <ArrowDownOn />;
}

export function getSortOrder({
  direction,
  isCurrentSortField,
}: {
  direction: SortDirection;
  isCurrentSortField: boolean;
}) {
  if (!isCurrentSortField) {
    return 'desc';
  }

  return direction === 'desc' ? 'asc' : 'desc';
}

function SortHeaderCell({ field, label }: { field: string; label: string }) {
  const { sortField, setSortField } = useSearchStore();

  const { direction, field: currentSortField } = sortField;

  const isCurrentSortField = field === currentSortField;

  return (
    <StyledHeaderCell>
      {label}
      <IconButton onClick={() => setSortField({ direction: getSortOrder({ direction, isCurrentSortField }), field })}>
        <OrderIcon direction={direction} isCurrentSortField={isCurrentSortField} />
      </IconButton>
    </StyledHeaderCell>
  );
}

function ResultCell({ hit, field }: { field: string; hit: SearchHit<Partial<Entity>> }) {
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

function HighlightRow({ colSpan, highlight }: { colSpan: number } & Required<Pick<SearchHit, 'highlight'>>) {
  const sanitizedHighlight = DOMPurify.sanitize(Object.values(highlight).join(' ... '));
  return (
    <StyledTableRow $highlight>
      <StyledTableCell colSpan={colSpan}>{parse(sanitizedHighlight)}</StyledTableCell>
    </StyledTableRow>
  );
}

function ResultsTable() {
  const { searchHits: hits } = useSearch();
  const {
    sourceFields: { table: tableFields },
  } = useSearchStore();

  // TODO: Loading State
  if (!hits.length) {
    return null;
  }

  return (
    <Box>
      <StyledTable data-testid="search-results-table">
        <TableHead>
          <TableRow>
            <SelectableHeaderCell allTableRowKeys={hits.map((h) => h._id)} disabled={false} />
            {tableFields.map((field) => (
              <SortHeaderCell key={field} field={field} label={getFieldLabel(field)} />
            ))}
          </TableRow>
        </TableHead>
        <StyledTableBody>
          {hits.map((hit) => (
            <React.Fragment key={hit._id}>
              <StyledTableRow $beforeHighlight={Boolean(hit?.highlight)}>
                <SelectableRowCell rowKey={hit._id} />
                {tableFields.map((field) => (
                  <ResultCell hit={hit} field={field} key={field} />
                ))}
              </StyledTableRow>
              {hit?.highlight && <HighlightRow colSpan={tableFields.length + 1} highlight={hit.highlight} />}
            </React.Fragment>
          ))}
        </StyledTableBody>
      </StyledTable>
      <ViewMoreResults />
    </Box>
  );
}

export default ResultsTable;
