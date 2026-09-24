import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import prettyBytes from 'pretty-bytes';

import { InternalLink } from 'js/shared-styles/Links';
import { decimal } from 'js/helpers/number-format';
import { StyledTable, StyledTableBody, StyledTableCell, StyledTableRow } from '../style';
import { useSearchStore } from '../../store';
import { useGetFieldLabel } from '../../fieldConfigurations';
import SearchTableHeaderCell from '../SearchTableHeaderCell';
import ViewMoreResults from '../ViewMoreResults';
import FilterChips from '../../Facets/FilterChips';
import TopSearchBar from '../../TopSearchBar';
import FilenameFilterBar from './FilenameFilterBar';
import FilesTableActions from './FilesTableActions';
import FileSelectionModal, { FileSelectionTarget } from './FileSelectionModal';
import { FilesSearchDUAProvider } from './FilesSearchDUA';
import { useFilesSelectionStore } from './useFilesSelectionStore';
import { DatasetStats } from './useDatasetPageStats';
import { CollapsedDatasetHit, getOrganLabels } from './utils';

/** Columns derived from the per-page stats aggregation rather than a source field, so not sortable. */
const derivedColumns = [
  { label: 'Files', align: 'left' as const },
  { label: 'Total Size', align: 'right' as const },
];

function DatasetRow({
  hit,
  stats,
  isStatsLoading,
  onSelectFiles,
}: {
  hit: CollapsedDatasetHit;
  stats?: DatasetStats;
  isStatsLoading: boolean;
  onSelectFiles: (target: FileSelectionTarget) => void;
}) {
  const wholeDatasets = useFilesSelectionStore((state) => state.wholeDatasets);
  const selectedFiles = useFilesSelectionStore((state) => state.selectedFiles);
  const toggleWholeDataset = useFilesSelectionStore((state) => state.toggleWholeDataset);

  const source = hit._source;
  if (!source) {
    return null;
  }

  const { dataset_uuid: datasetUuid, dataset_hubmap_id: hubmapId } = source;
  const organs = getOrganLabels(source);

  const isWhole = wholeDatasets.has(datasetUuid);
  const selected = selectedFiles.get(datasetUuid);
  // "Deselect HBM…" read as removing the dataset from the results rather than from the selection.
  const checkboxLabel = isWhole ? `Deselect all files in ${hubmapId}` : `Select all files in ${hubmapId}`;
  const fileCount = stats?.fileCount ?? 0;

  return (
    <StyledTableRow>
      <StyledTableCell padding="checkbox">
        <Tooltip title={checkboxLabel}>
          <Checkbox
            color="secondary"
            checked={isWhole}
            // Partial selections come from the file-selection modal; the row checkbox itself only
            // toggles the whole dataset.
            indeterminate={Boolean(selected)}
            onChange={() => toggleWholeDataset(datasetUuid, hubmapId)}
            inputProps={{ 'aria-label': checkboxLabel }}
          />
        </Tooltip>
      </StyledTableCell>
      <StyledTableCell>
        <InternalLink href={`/browse/${hubmapId}`}>{hubmapId}</InternalLink>
      </StyledTableCell>
      <StyledTableCell>{source.dataset_type ?? '—'}</StyledTableCell>
      <StyledTableCell>{source.data_class ?? '—'}</StyledTableCell>
      <StyledTableCell>{organs.length ? organs.join(' / ') : '—'}</StyledTableCell>
      <StyledTableCell>
        {/* The count is exact, from an aggregation over the whole match rather than a page of
            inner hits. Opening the picker replaces what the removed row expander used to show. */}
        {isStatsLoading && !stats ? (
          <Skeleton variant="text" width={120} />
        ) : (
          <Button
            variant="text"
            size="small"
            sx={{ p: 0, minWidth: 0, textAlign: 'left' }}
            aria-label={`Choose files in ${hubmapId}`}
            onClick={() =>
              onSelectFiles({
                datasetUuid,
                datasetHubmapId: hubmapId,
                fileCount,
                showAllFiles: false,
                dataAccessLevel: source.data_access_level,
              })
            }
          >
            {`Choose Files (${decimal.format(fileCount)}${
              selected ? `, ${decimal.format(selected.size)} selected` : ''
            })`}
          </Button>
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        {isStatsLoading && !stats ? <Skeleton variant="text" /> : prettyBytes(stats?.bytes ?? 0)}
      </StyledTableCell>
    </StyledTableRow>
  );
}

function LoadingRows({ columnCount }: { columnCount: number }) {
  const size = useSearchStore((state) => state.size);
  return Array.from({ length: size }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: columnCount }).map((__, j) => (
        <StyledTableCell key={j}>
          <Skeleton variant="text" />
        </StyledTableCell>
      ))}
    </TableRow>
  ));
}

function FilesResultsTable({
  isLoading,
  hits,
  datasetStats,
}: {
  isLoading: boolean;
  hits: CollapsedDatasetHit[];
  datasetStats: { isLoading: boolean; stats?: Map<string, DatasetStats> };
}) {
  const tableFields = useSearchStore((state) => state.sourceFields.table);
  const getFieldLabel = useGetFieldLabel();
  const [selectionTarget, setSelectionTarget] = useState<FileSelectionTarget | null>(null);

  // Checkbox column + sortable columns + the two derived columns.
  const columnCount = 1 + tableFields.length + derivedColumns.length;

  const handleCloseModal = useCallback(() => setSelectionTarget(null), []);

  return (
    <FilesSearchDUAProvider>
      <Box>
        <StyledTable data-testid="files-search-results-table">
          <TableHead>
            <TableRow sx={{ p: 0, borderBottom: 1, borderColor: 'divider' }}>
              <StyledTableCell colSpan={columnCount} sx={{ p: 1, borderBottom: 0 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                  <Box flexGrow={1}>
                    <TopSearchBar />
                  </Box>
                  <Box flexGrow={1}>
                    <FilenameFilterBar />
                  </Box>
                </Stack>
              </StyledTableCell>
            </TableRow>
            <TableRow sx={{ p: 0, borderBottom: 1, borderColor: 'divider' }}>
              <StyledTableCell colSpan={columnCount} sx={{ p: 1, borderBottom: 0 }}>
                <FilterChips />
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell colSpan={columnCount} sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                <FilesTableActions />
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell padding="checkbox" />
              {tableFields.map((field) => (
                <SearchTableHeaderCell key={field} field={field} label={getFieldLabel(field)} />
              ))}
              {derivedColumns.map(({ label, align }) => (
                <StyledTableCell key={label} align={align}>
                  <Typography variant="subtitle2">{label}</Typography>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <StyledTableBody>
            {isLoading && <LoadingRows columnCount={columnCount} />}
            {hits.map((hit) => (
              <DatasetRow
                key={hit._source?.dataset_uuid ?? hit._id}
                hit={hit}
                stats={
                  hit._source?.dataset_uuid && !datasetStats?.isLoading
                    ? datasetStats?.stats?.get(hit._source.dataset_uuid)
                    : undefined
                }
                isStatsLoading={datasetStats?.isLoading}
                onSelectFiles={setSelectionTarget}
              />
            ))}
          </StyledTableBody>
        </StyledTable>
        <ViewMoreResults />
        <FileSelectionModal target={selectionTarget} handleClose={handleCloseModal} />
      </Box>
    </FilesSearchDUAProvider>
  );
}

export default FilesResultsTable;
