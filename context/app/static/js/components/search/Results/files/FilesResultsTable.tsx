import React, { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import prettyBytes from 'pretty-bytes';

import { InternalLink } from 'js/shared-styles/Links';
import { decimal } from 'js/helpers/number-format';
import { StyledTable, StyledTableBody, StyledTableCell, StyledTableRow } from '../style';
import { useSearch } from '../../Search';
import { useSearchStore } from '../../store';
import { useGetFieldLabel } from '../../fieldConfigurations';
import SearchTableHeaderCell from '../SearchTableHeaderCell';
import ViewMoreResults from '../ViewMoreResults';
import FilterChips from '../../Facets/FilterChips';
import TopSearchBar from '../../TopSearchBar';
import FilesTableActions from './FilesTableActions';
import FileSelectionModal, { FileSelectionTarget } from './FileSelectionModal';
import FileDownloadLink from './FileDownloadLink';
import DatasetGlobusLink from './DatasetGlobusLink';
import { FilesSearchDUAProvider } from './FilesSearchDUA';
import { useFilesSelectionStore } from './useFilesSelectionStore';
import {
  CollapsedDatasetHit,
  FileDocument,
  getFileTypes,
  getInnerFileCount,
  getInnerFiles,
  getOrganLabels,
  sumFileSizes,
} from './utils';

/** Columns derived from `inner_hits` rather than a source field, so not sortable. */
const derivedColumns = ['Files', 'Total Size'];

function FileTypeChips({ files }: { files: FileDocument[] }) {
  const types = getFileTypes(files);
  if (types.length === 0) {
    return <>—</>;
  }
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
      {types.map((type) => (
        <Chip key={type} label={type} size="small" variant="outlined" />
      ))}
    </Stack>
  );
}

function ExpandedFileList({
  hit,
  innerHitsName,
  source,
}: {
  hit: CollapsedDatasetHit;
  innerHitsName: string;
  source: FileDocument;
}) {
  const files = getInnerFiles(hit, innerHitsName);
  const totalCount = getInnerFileCount(hit, innerHitsName);
  const hasMore = totalCount > files.length;

  return (
    <Stack spacing={1} sx={{ py: 1, pl: 6, pr: 2 }}>
      <DatasetGlobusLink
        datasetUuid={source.dataset_uuid}
        datasetHubmapId={source.dataset_hubmap_id}
        dataAccessLevel={source.data_access_level}
      />
      {files.map((file) => (
        <Stack key={file.rel_path} direction="row" spacing={1} alignItems="baseline">
          <FileDownloadLink
            datasetUuid={source.dataset_uuid}
            relPath={file.rel_path}
            dataAccessLevel={source.data_access_level}
          />
          <Typography variant="caption" color="secondary">
            {file.size === undefined ? '' : prettyBytes(file.size)}
          </Typography>
        </Stack>
      ))}
      {hasMore && (
        <Typography variant="caption" color="secondary">
          {`Showing ${decimal.format(files.length)} of ${decimal.format(totalCount)} matching files. Use "Select files" to see them all.`}
        </Typography>
      )}
    </Stack>
  );
}

function DatasetRow({
  hit,
  innerHitsName,
  columnCount,
  onSelectFiles,
}: {
  hit: CollapsedDatasetHit;
  innerHitsName: string;
  columnCount: number;
  onSelectFiles: (target: FileSelectionTarget) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const wholeDatasets = useFilesSelectionStore((state) => state.wholeDatasets);
  const selectedFiles = useFilesSelectionStore((state) => state.selectedFiles);
  const toggleWholeDataset = useFilesSelectionStore((state) => state.toggleWholeDataset);

  const source = hit._source;
  if (!source) {
    return null;
  }

  const { dataset_uuid: datasetUuid, dataset_hubmap_id: hubmapId } = source;
  const files = getInnerFiles(hit, innerHitsName);
  const fileCount = getInnerFileCount(hit, innerHitsName);
  const organs = getOrganLabels(source);

  const isWhole = wholeDatasets.has(datasetUuid);
  const isPartial = selectedFiles.has(datasetUuid);

  return (
    <>
      <StyledTableRow>
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="secondary"
            checked={isWhole}
            // Partial selections come from the file-selection modal; the row itself can only
            // toggle the whole dataset.
            indeterminate={isPartial}
            onChange={() => toggleWholeDataset(datasetUuid)}
            inputProps={{ 'aria-label': `Select all files in ${hubmapId}` }}
          />
        </StyledTableCell>
        <StyledTableCell padding="checkbox">
          <IconButton
            size="small"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            aria-label={isExpanded ? `Collapse ${hubmapId}` : `Expand ${hubmapId}`}
          >
            {isExpanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell>
          <InternalLink href={`/browse/${hubmapId}`}>{hubmapId}</InternalLink>
        </StyledTableCell>
        <StyledTableCell>{source.dataset_type ?? '—'}</StyledTableCell>
        <StyledTableCell>{source.data_class ?? '—'}</StyledTableCell>
        <StyledTableCell>{organs.length ? organs.join(' / ') : '—'}</StyledTableCell>
        <StyledTableCell>
          <Stack spacing={0.5} alignItems="flex-start">
            <FileTypeChips files={files} />
            <Button
              variant="text"
              size="small"
              sx={{ p: 0, minWidth: 0 }}
              onClick={() => onSelectFiles({ datasetUuid, datasetHubmapId: hubmapId, fileCount })}
            >
              {`${decimal.format(fileCount)} file${fileCount === 1 ? '' : 's'} — select files`}
            </Button>
          </Stack>
        </StyledTableCell>
        <StyledTableCell align="right">
          {/* Sized from the files returned for this row, so it understates a dataset whose
              matching files exceed the inner-hits size. */}
          {fileCount > files.length ? `≥ ${prettyBytes(sumFileSizes(files))}` : prettyBytes(sumFileSizes(files))}
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <StyledTableCell colSpan={columnCount} sx={{ py: 0 }}>
          <Collapse in={isExpanded} unmountOnExit>
            <ExpandedFileList hit={hit} innerHitsName={innerHitsName} source={source} />
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
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

function FilesResultsTable({ isLoading }: { isLoading: boolean }) {
  const { searchHits } = useSearch();
  const collapse = useSearchStore((state) => state.collapse);
  const tableFields = useSearchStore((state) => state.sourceFields.table);
  const getFieldLabel = useGetFieldLabel();
  const [selectionTarget, setSelectionTarget] = useState<FileSelectionTarget | null>(null);

  const innerHitsName = collapse?.innerHits.name ?? 'files';
  const hits = searchHits as CollapsedDatasetHit[];

  // Checkbox + expand toggle + sortable columns + the two derived columns.
  const columnCount = 2 + tableFields.length + derivedColumns.length;

  // The manifest needs a HuBMAP ID per selected dataset uuid; selections can only be made from
  // rows that have been rendered, so the loaded page is sufficient.
  const hubmapIdsByUuid = useMemo(() => {
    const map = new Map<string, string>();
    hits.forEach((hit) => {
      if (hit._source?.dataset_uuid && hit._source?.dataset_hubmap_id) {
        map.set(hit._source.dataset_uuid, hit._source.dataset_hubmap_id);
      }
    });
    return map;
  }, [hits]);

  const handleCloseModal = useCallback(() => setSelectionTarget(null), []);

  return (
    <FilesSearchDUAProvider>
      <Box>
        <StyledTable data-testid="files-search-results-table">
          <TableHead>
            <TableRow sx={{ p: 0, borderBottom: 1, borderColor: 'divider' }}>
              <StyledTableCell colSpan={columnCount} sx={{ p: 1, borderBottom: 0 }}>
                <TopSearchBar />
              </StyledTableCell>
            </TableRow>
            <TableRow sx={{ p: 0, borderBottom: 1, borderColor: 'divider' }}>
              <StyledTableCell colSpan={columnCount} sx={{ p: 1, borderBottom: 0 }}>
                <FilterChips />
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell colSpan={columnCount} sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                <FilesTableActions hubmapIdsByUuid={hubmapIdsByUuid} />
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell padding="checkbox" />
              <StyledTableCell padding="checkbox" />
              {tableFields.map((field) => (
                <SearchTableHeaderCell key={field} field={field} label={getFieldLabel(field)} />
              ))}
              {derivedColumns.map((label) => (
                <StyledTableCell key={label} align={label === 'Total Size' ? 'right' : 'left'}>
                  <Typography variant="subtitle2">{label}</Typography>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <StyledTableBody>
            {isLoading && !hits.length && <LoadingRows columnCount={columnCount} />}
            {hits.map((hit) => (
              <DatasetRow
                key={hit._source?.dataset_uuid ?? hit._id}
                hit={hit}
                innerHitsName={innerHitsName}
                columnCount={columnCount}
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
