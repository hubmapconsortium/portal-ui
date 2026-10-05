import React, { useCallback, useMemo, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import prettyBytes from 'pretty-bytes';

import DialogModal from 'js/shared-styles/dialogs/DialogModal';
import { Alert } from 'js/shared-styles/alerts';
import { decimal, formatCount } from 'js/helpers/number-format';
import { useFilesSelectionStore } from './useFilesSelectionStore';
import useDatasetFiles from './useDatasetFiles';
import FileDownloadLink from './FileDownloadLink';
import DatasetGlobusLink from './DatasetGlobusLink';
import FilenameFilterBar from './FilenameFilterBar';
import useDatasetPageStats from './useDatasetPageStats';
import { FiltersType } from '../../store';

export interface FileSelectionTarget {
  datasetUuid: string;
  datasetHubmapId: string;
  /** Files matching the current filters, from the exact per-page aggregation. */
  fileCount: number;
  dataAccessLevel?: string;
  showAllFiles: boolean;
}

interface FileSelectionModalProps {
  target: FileSelectionTarget | null;
  handleClose: () => void;
}

/**
 * A dataset large enough that scrolling to a specific file is impractical, so the filename filter
 * is surfaced rather than merely available. The largest dataset in the index holds 480,337 files.
 */
const LARGE_DATASET_FILE_COUNT = 1_000;

/** Module-level so the stats query is not rebuilt on every render. */
const NO_FACET_FILTERS: FiltersType = {};

function FileRows({ target }: { target: FileSelectionTarget }) {
  const { datasetUuid, dataAccessLevel, showAllFiles, fileCount } = target;
  const { files, error, isLoading, isReachingEnd, loadMore } = useDatasetFiles(datasetUuid, showAllFiles);

  const selectedFilesByDataset = useFilesSelectionStore((state) => state.selectedFilesByDataset);
  const toggleFile = useFilesSelectionStore((state) => state.toggleFile);
  const toggleFiles = useFilesSelectionStore((state) => state.toggleFiles);
  const removeFiles = useFilesSelectionStore((state) => state.removeFiles);
  const clearDataset = useFilesSelectionStore((state) => state.clearDataset);

  const selected = useMemo(() => selectedFilesByDataset.get(datasetUuid), [selectedFilesByDataset, datasetUuid]);
  const isAllSelected = useMemo(() => {
    if (!selected) return false;
    return files.every((file) => selected.has(file.rel_path));
  }, [selected, files]);
  const isIndeterminate = selected && !isAllSelected;

  const handleSelectAll = useCallback(() => {
    if (!target) return;
    if (isAllSelected || isIndeterminate) {
      if (showAllFiles) {
        clearDataset(target.datasetUuid);
      } else {
        removeFiles(
          target.datasetUuid,
          files.map((file) => file.rel_path),
        );
      }
    } else {
      toggleFiles(
        target.datasetUuid,
        files.map((file) => file.rel_path),
      );
    }
  }, [target, isAllSelected, isIndeterminate, showAllFiles, clearDataset, files, toggleFiles, removeFiles]);

  if (error) {
    return <Alert severity="error">Unable to load the files for this dataset.</Alert>;
  }

  if (isLoading && files.length === 0) {
    return (
      <Stack spacing={1}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="text" />
        ))}
      </Stack>
    );
  }

  if (files.length === 0) {
    return <Alert severity="warning">No files in this dataset match the current filters.</Alert>;
  }

  return (
    <Stack spacing={1}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Box>
                <Tooltip
                  title={
                    <Typography variant="body2">
                      {`Select all files in this dataset (${decimal.format(fileCount)})`}
                    </Typography>
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="secondary"
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onChange={handleSelectAll}
                      />
                    }
                    label={''}
                  />
                </Tooltip>
              </Box>
            </TableCell>
            <TableCell>File</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.rel_path} hover>
              <TableCell padding="checkbox">
                <Checkbox
                  color="secondary"
                  // A whole-dataset selection includes every file, so each row reads as checked
                  // without the individual paths having to be enumerated in the store.
                  checked={isAllSelected || Boolean(selected?.has(file.rel_path))}
                  onChange={() => toggleFile(datasetUuid, file.rel_path)}
                  slotProps={{ input: { 'aria-label': `Select ${file.rel_path}` } }}
                />
              </TableCell>
              <TableCell sx={{ wordBreak: 'break-all' }}>
                <FileDownloadLink datasetUuid={datasetUuid} relPath={file.rel_path} dataAccessLevel={dataAccessLevel} />
              </TableCell>
              <TableCell>{file.description ?? '—'}</TableCell>
              <TableCell align="right">{file.size === undefined ? '—' : prettyBytes(file.size)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isReachingEnd && (
        <Button variant="text" onClick={loadMore} disabled={isLoading} fullWidth>
          {isLoading ? 'Loading…' : `Load more files (${decimal.format(files.length)} shown)`}
        </Button>
      )}
    </Stack>
  );
}

function FileSelectionModal({ target, handleClose }: FileSelectionModalProps) {
  const wholeDatasets = useFilesSelectionStore((state) => state.wholeDatasets);
  const selectedFilesByDataset = useFilesSelectionStore((state) => state.selectedFilesByDataset);

  const datasetUuid = target?.datasetUuid;

  const datasetUuids = useMemo(() => (datasetUuid ? [datasetUuid] : []), [datasetUuid]);
  const { stats } = useDatasetPageStats(datasetUuids, NO_FACET_FILTERS);
  const datasetStats = datasetUuid ? stats.get(datasetUuid) : undefined;
  const showToggleFiles = datasetStats !== undefined && datasetStats.fileCount !== target?.fileCount;

  const [showAllFiles, setShowAllFiles] = useState<boolean>(false);
  const handleAllFilesChange = (event: React.ChangeEvent<HTMLInputElement, Element>) => {
    setShowAllFiles(event.target.checked);
  };

  const selectedCount = useMemo(() => {
    if (!datasetUuid) return 0;
    if (wholeDatasets.has(datasetUuid)) return target?.fileCount ?? 0;
    return selectedFilesByDataset.get(datasetUuid)?.size ?? 0;
  }, [datasetUuid, wholeDatasets, selectedFilesByDataset, target?.fileCount]);

  if (!target) {
    return null;
  }

  const isLarge = target.fileCount > LARGE_DATASET_FILE_COUNT;

  return (
    <DialogModal
      slotProps={{
        paper: {
          sx: {
            minHeight: '500px',
          },
        },
      }}
      isOpen
      withCloseButton
      maxWidth="lg"
      title={`Select Files — ${target.datasetHubmapId}`}
      secondaryText={
        <>
          <p>
            Choose files from this dataset here. They will be included with other files picked for download from the
            main search page via the &quot;Download Files&quot; button.
          </p>
          <Box sx={{ mt: 2, mb: 1 }}>
            {formatCount(target.fileCount, 'file')} {target.fileCount === 1 ? 'matches' : 'match'} the current filters.{' '}
            {decimal.format(selectedCount)} selected.
            {datasetStats ? ` ${formatCount(datasetStats.fileCount, 'total file')}.` : ''}
          </Box>
        </>
      }
      handleClose={handleClose}
      content={
        <Stack spacing={2}>
          {isLarge && (
            <Alert severity="info">
              {/* Some datasets hold hundreds of thousands of unstitched image tiles, where picking
                  files one at a time is not realistic. */}
              This dataset has a large number of files. Select it in full to include all of them, or narrow the list by
              name below.
            </Alert>
          )}
          <FilenameFilterBar />
          <Stack direction={{ xs: 'column', sm: 'row' }}>
            <DatasetGlobusLink
              datasetUuid={target.datasetUuid}
              datasetHubmapId={target.datasetHubmapId}
              dataAccessLevel={target.dataAccessLevel}
            />
            {showToggleFiles && (
              <FormControlLabel
                sx={{ ml: 'auto' }}
                control={<Switch onChange={handleAllFilesChange} checked={showAllFiles} />}
                labelPlacement={showAllFiles ? 'start' : 'end'}
                label={
                  !showAllFiles
                    ? `Show all ${formatCount(datasetStats?.fileCount ?? 0, 'file')}`
                    : `Show ${formatCount(target.fileCount, 'filtered file')}`
                }
              />
            )}
          </Stack>
          <FileRows target={{ ...target, showAllFiles }} />
        </Stack>
      }
      actions={
        <Button variant="contained" color="primary" onClick={handleClose}>
          Done
        </Button>
      }
    />
  );
}

export default FileSelectionModal;
