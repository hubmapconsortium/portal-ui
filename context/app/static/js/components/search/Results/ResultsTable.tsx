import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SearchHit } from 'js/typings/elasticsearch';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';

import { Entity } from 'js/components/types';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import NumSelectedHeader from 'js/shared-styles/tables/NumSelectedHeader';
import { useAllSearchIDs } from 'js/hooks/useSearchData';
import { getByPath } from './utils';
import { StyledTable, StyledTableBody, StyledTableRow, StyledTableCell } from './style';
import { useSearch } from '../Search';
import { useSearchStore } from '../store';
import { useGetFieldLabel } from '../fieldConfigurations';
import ViewMoreResults from './ViewMoreResults';
import { buildQuery, isDevSearch } from '../utils';
import useESmapping from '../useEsMapping';
import SearchTableHeaderCell from './SearchTableHeaderCell';
import TableHeaderActions from './TableHeaderActions';
import FilterChips from '../Facets/FilterChips';
import TopSearchBar from '../TopSearchBar';
import { CellContent, getHuBMAPIdDisplayInfo } from './CellContent';

function ResultCell({ hit, field }: { field: string; hit: SearchHit<Partial<Entity>> }) {
  const source = hit?._source;

  if (!source) {
    return <StyledTableCell />;
  }

  const fieldValue = getByPath(source, field);
  const isHubmapIdField = field.split('.').pop() === 'hubmap_id';
  const displayInfo = isHubmapIdField ? getHuBMAPIdDisplayInfo(source) : {};

  return (
    <StyledTableCell key={field}>
      <CellContent field={field} fieldValue={fieldValue} {...displayInfo} />
    </StyledTableCell>
  );
}

function HighlightRow({ colSpan, highlight }: { colSpan: number } & Required<Pick<SearchHit<Entity>, 'highlight'>>) {
  const sanitizedHighlight = DOMPurify.sanitize(Object.values(highlight).join(' ... '));
  return (
    <StyledTableRow $highlight>
      <StyledTableCell colSpan={colSpan}>{parse(sanitizedHighlight)}</StyledTableCell>
    </StyledTableRow>
  );
}

function LoadingRows() {
  const { sourceFields, size } = useSearchStore(
    useShallow((state) => ({
      sourceFields: state.sourceFields,
      size: state.size,
    })),
  );

  const { table: tableFields } = sourceFields;

  return Array.from({ length: size }).map((_, i) => (
    <TableRow key={i}>
      <SelectableRowCell rowKey="" disabled cellComponent={StyledTableCell} />
      {tableFields.map((field) => (
        <StyledTableCell key={field}>
          <Skeleton variant="text" />
        </StyledTableCell>
      ))}
    </TableRow>
  ));
}

interface RowProps {
  hit: SearchHit<Partial<Entity>>;
  tableFields: string[];
}

function compareRowProps(oldProps: RowProps, newProps: RowProps) {
  return oldProps.hit._id === newProps.hit._id;
}

const ResultRow = React.memo(function ResultRow({ hit, tableFields }: RowProps) {
  const id = hit._id;

  if (!id) {
    return null;
  }

  return (
    <>
      <StyledTableRow $beforeHighlight={Boolean(hit?.highlight)}>
        <SelectableRowCell rowKey={id} />
        {tableFields.map((field) => (
          <ResultCell hit={hit} field={field} key={field} />
        ))}
      </StyledTableRow>
      {hit?.highlight && <HighlightRow colSpan={tableFields.length + 1} highlight={hit.highlight} />}
    </>
  );
}, compareRowProps);

const HeaderCells = React.memo(function HeaderCells({ tableFields }: { tableFields: string[] }) {
  const getFieldLabel = useGetFieldLabel();
  return (
    <>
      {tableFields.map((field) => (
        <SearchTableHeaderCell key={field} field={field} label={getFieldLabel(field)} />
      ))}
    </>
  );
});

function SelectableHeaderCells() {
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);
  const search = useSearchStore((state) => state.search);
  const size = useSearchStore((state) => state.size);
  const searchFields = useSearchStore((state) => state.searchFields);
  const sourceFields = useSearchStore((state) => state.sourceFields);
  const sortField = useSearchStore((state) => state.sortField);
  const defaultQuery = useSearchStore((state) => state.defaultQuery);
  const type = useSearchStore((state) => state.type);

  const mappings = useESmapping();

  const query = buildQuery({
    filters,
    facets,
    search,
    size,
    searchFields,
    sourceFields,
    sortField,
    defaultQuery,
    mappings,
    buildAggregations: false,
  });

  const { allSearchIDs, isLoading } = useAllSearchIDs(query);

  const devSearch = isDevSearch(type);

  const selectTooltip = devSearch ? 'Select all entities in results.' : `Select all ${type.toLowerCase()}s in results.`;

  return (
    <SelectableHeaderCell
      allTableRowKeys={allSearchIDs}
      disabled={isLoading}
      selectTooltip={selectTooltip}
      deselectTooltip="Reset all selections."
    />
  );
}

const extraHeaderRowHeight = 48;

const Table = React.memo(function Table({
  isLoading,
  hits,
}: {
  isLoading: boolean;
  hits: never[] | SearchHit<Partial<Entity>>[];
}) {
  const tableFields = useSearchStore((state) => state.sourceFields?.table);
  const { selectedRows } = useSelectableTableStore();

  const colSpan = tableFields.length + 1; // +1 for the selectable checkbox column

  return (
    <Box>
      <StyledTable data-testid="search-results-table">
        <TableHead>
          <TableRow sx={{ p: 0, borderBottom: 1, borderColor: 'divider' }}>
            <StyledTableCell colSpan={colSpan} sx={{ p: 1, borderBottom: 0 }}>
              <TopSearchBar />
            </StyledTableCell>
          </TableRow>
          <TableRow sx={{ p: 0, borderBottom: 1, borderColor: 'divider' }}>
            <StyledTableCell colSpan={colSpan} sx={{ p: 1, borderBottom: 0 }}>
              <FilterChips />
            </StyledTableCell>
          </TableRow>
          <TableRow
            sx={{
              height: extraHeaderRowHeight,
              p: 0,
            }}
          >
            <StyledTableCell colSpan={colSpan} sx={{ p: 0, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <NumSelectedHeader numSelected={selectedRows.size} $noBorderBottom />
                <TableHeaderActions />
              </Stack>
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <SelectableHeaderCells />
            <HeaderCells tableFields={tableFields} />
          </TableRow>
        </TableHead>
        <StyledTableBody>
          {isLoading && !hits?.length && <LoadingRows />}
          {hits.map((hit) => (
            <ResultRow hit={hit} key={hit._id} tableFields={tableFields} />
          ))}
        </StyledTableBody>
      </StyledTable>
      <ViewMoreResults />
    </Box>
  );
});

function ResultsTable({ isLoading }: { isLoading: boolean }) {
  const { searchHits: hits } = useSearch();

  return <Table hits={hits} isLoading={isLoading} />;
}

export default ResultsTable;
