import React, { useCallback, useMemo } from 'react';
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
import prettyBytes from 'pretty-bytes';

import DialogModal from 'js/shared-styles/dialogs/DialogModal';
import { Alert } from 'js/shared-styles/alerts';
import { decimal } from 'js/helpers/number-format';
import { useFilesSelectionStore } from './useFilesSelectionStore';
import useDatasetFiles from './useDatasetFiles';
import FileDownloadLink from './FileDownloadLink';
import DatasetGlobusLink from './DatasetGlobusLink';
import FilenameFilterBar from './FilenameFilterBar';

export interface FileSelectionTarget {
  datasetUuid: string;
  datasetHubmapId: string;
  /** Files matching the current filters, from the exact per-page aggregation. */
  fileCount: number;
  dataAccessLevel?: string;
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

function FileRows({ target }: { target: FileSelectionTarget }) {
  const { datasetUuid, datasetHubmapId, dataAccessLevel } = target;
  const { files, error, isLoading, isReachingEnd, loadMore } = useDatasetFiles(datasetUuid);
  const wholeDatasets = useFilesSelectionStore((state) => state.wholeDatasets);
  const selectedFiles = useFilesSelectionStore((state) => state.selectedFiles);
  const toggleFile = useFilesSelectionStore((state) => state.toggleFile);

  const isWholeSelected = wholeDatasets.has(datasetUuid);
  const selected = selectedFiles.get(datasetUuid);

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
            <TableCell padding="checkbox" />
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
                  checked={isWholeSelected || Boolean(selected?.has(file.rel_path))}
                  onChange={() => toggleFile(datasetUuid, datasetHubmapId, file.rel_path)}
                  inputProps={{ 'aria-label': `Select ${file.rel_path}` }}
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
  const selectedFiles = useFilesSelectionStore((state) => state.selectedFiles);
  const toggleWholeDataset = useFilesSelectionStore((state) => state.toggleWholeDataset);
  const clearDataset = useFilesSelectionStore((state) => state.clearDataset);

  const datasetUuid = target?.datasetUuid;

  const selectedCount = useMemo(() => {
    if (!datasetUuid) return 0;
    if (wholeDatasets.has(datasetUuid)) return target?.fileCount ?? 0;
    return selectedFiles.get(datasetUuid)?.size ?? 0;
  }, [datasetUuid, wholeDatasets, selectedFiles, target?.fileCount]);

  const handleSelectAll = useCallback(() => {
    if (!target) return;
    if (wholeDatasets.has(target.datasetUuid) || selectedFiles.has(target.datasetUuid)) {
      clearDataset(target.datasetUuid);
    } else {
      toggleWholeDataset(target.datasetUuid, target.datasetHubmapId);
    }
  }, [target, wholeDatasets, selectedFiles, clearDataset, toggleWholeDataset]);

  if (!target) {
    return null;
  }

  const isLarge = target.fileCount > LARGE_DATASET_FILE_COUNT;

  return (
    <DialogModal
      isOpen
      withCloseButton
      maxWidth="lg"
      title={`Select Files — ${target.datasetHubmapId}`}
      secondaryText={`${decimal.format(target.fileCount)} files match the current filters. ${decimal.format(selectedCount)} selected.`}
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
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  checked={wholeDatasets.has(target.datasetUuid)}
                  indeterminate={selectedFiles.has(target.datasetUuid)}
                  onChange={handleSelectAll}
                />
              }
              label={
                <Typography variant="body2">
                  {`Select all files in this dataset (${decimal.format(target.fileCount)})`}
                </Typography>
              }
            />
          </Box>
          <DatasetGlobusLink
            datasetUuid={target.datasetUuid}
            datasetHubmapId={target.datasetHubmapId}
            dataAccessLevel={target.dataAccessLevel}
          />
          <FileRows target={target} />
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
