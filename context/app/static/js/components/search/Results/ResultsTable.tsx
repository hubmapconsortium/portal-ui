import React, { useCallback } from 'react';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';
import { format } from 'date-fns/format';

import { InternalLink } from 'js/shared-styles/Links';
import { Entity } from 'js/components/types';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell';
import { trackEvent } from 'js/helpers/trackers';
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
import { getFieldLabel } from '../fieldConfigurations';
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
  const { sortField, setSortField, analyticsCategory } = useSearchStore();

  const { direction, field: currentSortField } = sortField;

  const isCurrentSortField = field === currentSortField;

  const handleClick = useCallback(() => {
    const newSortDirection = getSortOrder({ direction, isCurrentSortField });
    setSortField({ direction: newSortDirection, field });
    trackEvent({
      category: analyticsCategory,
      action: `Sort Table View`,
      label: `${label} ${newSortDirection}}`,
    });
  }, [analyticsCategory, direction, field, isCurrentSortField, label, setSortField]);

  return (
    <StyledHeaderCell>
      {label}
      <IconButton onClick={handleClick}>
        <OrderIcon direction={direction} isCurrentSortField={isCurrentSortField} />
      </IconButton>
    </StyledHeaderCell>
  );
}

function CellContent({ field, fieldValue }: { field: string; fieldValue: string }) {
  switch (field) {
    case 'hubmap_id':
      return <InternalLink href={`/browse/${fieldValue}`}>{fieldValue}</InternalLink>;
    case 'last_modified_timestamp':
      return format(fieldValue, 'yyyy-MM-dd');
    default:
      return fieldValue;
  }
}

function ResultCell({ hit, field }: { field: string; hit: SearchHit<Partial<Entity>> }) {
  const source = hit?._source;

  if (!source) {
    return <StyledTableCell />;
  }

  const fieldValue = getByPath(source, field);

  return (
    <StyledTableCell key={field}>
      <CellContent field={field} fieldValue={fieldValue} />
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
