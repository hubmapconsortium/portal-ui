/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-underscore-dangle */
import React, { useMemo, useCallback } from 'react';
import format from 'date-fns/format';
import { TableVirtuoso } from 'react-virtuoso';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import { InternalLink } from 'js/shared-styles/Links';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { useScrollSearchHits } from 'js/hooks/useSearchData';
import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell';
import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import AddItemsToListDialog from 'js/components/savedLists/AddItemsToListDialog';
import { getDonorAgeString } from 'js/helpers/functions';

import { OrderIcon } from 'js/components/searchPage/SortingTableHead/SortingTableHead';
import { useSortState } from 'js/hooks/useSortState';
import { LinearProgress } from '@mui/material';
import { keepPreviousData } from 'js/helpers/swr';
import { StyledSectionHeader } from './style';
import { getSearchURL } from '../utils';

const columns = [
  { id: 'hubmap_id', label: 'Sample', sort: 'hubmap_id.keyword' },
  { id: 'donor.mapped_metadata.age_value', label: 'Donor Age' },
  { id: 'donor.mapped_metadata.sex', label: 'Donor Sex', sort: 'donor.mapped_metadata.sex.keyword' },
  { id: 'donor.mapped_metadata.race', label: 'Donor Race', sort: 'donor.mapped_metadata.race.keyword' },
  {
    id: 'descendant_counts.entity_type.Dataset',
    label: 'Derived Dataset Count',
  },
  { id: 'last_modified_timestamp', label: 'Last Modified' },
];

const columnIdMap = columns.reduce((acc, column) => ({ ...acc, [column.id]: column.sort }), {});

function SampleHeaderCell({ column, setSort, sortState }) {
  // This is a workaround to ensure the header cell control is accessible with consistent keyboard navigation
  // and appearance. The header cell contains a disabled, hidden button that is the full width of the cell. This
  // allows us to set the header cell to position: relative and create another button that is absolutely positioned
  // within the cell. The absolute button is the one that is visible and clickable, and takes up the full width of
  // the cell, which is guaranteed to be wide enough to contain the column label.
  return (
    <HeaderCell key={column.id} sx={{ position: 'relative' }}>
      <Button sx={{ visibility: 'hidden', whiteSpace: 'nowrap', py: 0 }} fullWidth disabled>
        {column.label}
      </Button>
      <Button
        variant="text"
        onClick={() => {
          setSort(column.id);
        }}
        disableTouchRipple
        sx={{
          justifyContent: 'flex-start',
          whiteSpace: 'nowrap',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pl: 2,
        }}
        endIcon={<OrderIcon order={sortState.columnId === column.id ? sortState.direction : undefined} />}
      >
        {column.label}
      </Button>
    </HeaderCell>
  );
}

const TableComponents = {
  Scroller: React.forwardRef((props, ref) => <StyledTableContainer component={Paper} {...props} ref={ref} />),
  Table: (props) => <Table {...props} style={{ borderCollapse: 'separate' }} stickyHeader />,
  TableHead,
  TableRow,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function Samples({ organTerms }) {
  const { selectedRows, deselectHeaderAndRows } = useStore();
  const searchUrl = getSearchURL({ entityType: 'Sample', organTerms });
  const { sortState, setSort, sort } = useSortState(columnIdMap);

  const pageSize = 25;
  const query = useMemo(
    () => ({
      post_filter: {
        bool: {
          must: [
            {
              term: {
                'entity_type.keyword': 'Sample',
              },
            },
            {
              bool: {
                should: organTerms.map((searchTerm) => ({
                  term: { 'origin_samples.mapped_organ.keyword': searchTerm },
                })),
              },
            },
          ],
        },
      },
      _source: [...columns.map((column) => column.id), 'donor.mapped_metadata.age_unit'],
      size: pageSize,
      sort,
    }),
    [organTerms, sort],
  );

  const { searchHits, isLoading, getNextHits, totalHitsCount, isReachingEnd } = useScrollSearchHits(query, {
    use: [keepPreviousData],
  });

  const loadMore = useCallback(() => {
    if (isReachingEnd) {
      return;
    }
    getNextHits();
  }, [isReachingEnd, getNextHits]);

  return (
    <SectionContainer>
      <SpacedSectionButtonRow
        leftText={
          <div>
            <StyledSectionHeader>Samples</StyledSectionHeader>
            <Typography variant="subtitle1">{totalHitsCount} Samples</Typography>
          </div>
        }
        buttons={
          <>
            <Button color="primary" variant="outlined" component="a" href={searchUrl}>
              View Data on Search Page
            </Button>
            <AddItemsToListDialog
              itemsToAddUUIDS={selectedRows}
              onSaveCallback={deselectHeaderAndRows}
              disabled={selectedRows.size === 0}
            />
          </>
        }
      />
      <TableVirtuoso
        style={{ height: 400 }}
        data={searchHits}
        totalCount={totalHitsCount}
        endReached={loadMore}
        components={TableComponents}
        fixedHeaderContent={() => (
          <>
            <TableRow>
              <SelectableHeaderCell allTableRowKeys={searchHits.map((hit) => hit._id)} />
              {columns.map((column) => (
                <SampleHeaderCell column={column} setSort={setSort} sortState={sortState} key={column.id} />
              ))}
            </TableRow>
            <LinearProgress
              sx={{
                position: 'absolute',
                bottom: 0,
                zIndex: 50,
                width: '100%',
                opacity: isLoading ? 1 : 0,
                transition: 'opacity',
              }}
              variant="indeterminate"
            />
          </>
        )}
        itemContent={(
          index,
          { _id: uuid, _source: { hubmap_id, donor = {}, descendant_counts, last_modified_timestamp } },
        ) => (
          <>
            <SelectableRowCell rowKey={uuid} />
            <TableCell>
              <InternalLink href={`/browse/sample/${uuid}`} variant="body2">
                {hubmap_id}
              </InternalLink>
            </TableCell>
            <TableCell>{donor?.mapped_metadata && getDonorAgeString(donor.mapped_metadata)}</TableCell>
            <TableCell>{donor?.mapped_metadata?.sex}</TableCell>
            <TableCell>{donor?.mapped_metadata?.race}</TableCell>
            <TableCell>{descendant_counts?.entity_type?.Dataset || 0}</TableCell>
            <TableCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
          </>
        )}
      />
    </SectionContainer>
  );
}
export default withSelectableTableProvider(Samples, 'organ-samples');
