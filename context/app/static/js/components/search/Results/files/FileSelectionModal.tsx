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
import useDatasetFiles, { MAX_DATASET_FILES } from './useDatasetFiles';
import FileDownloadLink from './FileDownloadLink';

export interface FileSelectionTarget {
  datasetUuid: string;
  datasetHubmapId: string;
  fileCount: number;
}

interface FileSelectionModalProps {
  target: FileSelectionTarget | null;
  handleClose: () => void;
}

function FileRows({ datasetUuid, fileCount }: Omit<FileSelectionTarget, 'datasetHubmapId'>) {
  const { files, error, isLoading } = useDatasetFiles(datasetUuid, fileCount);
  const wholeDatasets = useFilesSelectionStore((state) => state.wholeDatasets);
  const selectedFiles = useFilesSelectionStore((state) => state.selectedFiles);
  const toggleFile = useFilesSelectionStore((state) => state.toggleFile);

  const isWholeSelected = wholeDatasets.has(datasetUuid);
  const selected = selectedFiles.get(datasetUuid);

  if (error) {
    return <Alert severity="error">Unable to load the files for this dataset.</Alert>;
  }

  if (isLoading) {
    return (
      <Stack spacing={1}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="text" />
        ))}
      </Stack>
    );
  }

  return (
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
                onChange={() => toggleFile(datasetUuid, file.rel_path)}
                inputProps={{ 'aria-label': `Select ${file.rel_path}` }}
              />
            </TableCell>
            <TableCell sx={{ wordBreak: 'break-all' }}>
              <FileDownloadLink datasetUuid={datasetUuid} relPath={file.rel_path} />
            </TableCell>
            <TableCell>{file.description ?? '—'}</TableCell>
            <TableCell align="right">{file.size === undefined ? '—' : prettyBytes(file.size)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
    if (!datasetUuid) return;
    if (wholeDatasets.has(datasetUuid) || selectedFiles.has(datasetUuid)) {
      clearDataset(datasetUuid);
    } else {
      toggleWholeDataset(datasetUuid);
    }
  }, [datasetUuid, wholeDatasets, selectedFiles, clearDataset, toggleWholeDataset]);

  if (!target) {
    return null;
  }

  const truncated = target.fileCount > MAX_DATASET_FILES;

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
          {truncated && (
            <Alert severity="info">
              {`Showing the first ${decimal.format(MAX_DATASET_FILES)} files. Select the whole dataset to include all of them, or narrow the filters.`}
            </Alert>
          )}
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
              label={<Typography variant="body2">Select all files in this dataset</Typography>}
            />
          </Box>
          <FileRows datasetUuid={target.datasetUuid} fileCount={target.fileCount} />
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
