import React, { useCallback, useMemo } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';

import { decimal } from 'js/helpers/number-format';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import { useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import { useSearchStore } from '../../store';
import { useFilesSelectionStore, countSelectedDatasets } from './useFilesSelectionStore';
import useAddAllMatchingFiles, { ADD_ALL_MAX_FILES } from './useAddAllMatchingFiles';

/**
 * Selection summary and transfer actions for the files search.
 *
 * This replaces `TableHeaderActions` rather than extending it: saved lists, workspaces, LineUp and
 * the tile-view switch all act on entities, and files are not entities. Download itself is handed
 * to the shared bulk download dialog, which brings the permission check, restricted-dataset
 * removal, retry toasts and success alert.
 */
function AddAllMatchingButton() {
  const { addAll, state, reset } = useAddAllMatchingFiles();
  const isBusy = state.status === 'counting' || state.status === 'adding';

  const handleClick = useCallback(() => {
    reset();
    addAll().catch(console.error);
  }, [addAll, reset]);

  const label = useMemo(() => {
    switch (state.status) {
      case 'counting':
        return 'Counting…';
      case 'adding':
        return `Adding ${decimal.format(state.added)}…`;
      default:
        return 'Add All Matching Files';
    }
  }, [state]);

  const tooltip = useMemo(() => {
    switch (state.status) {
      case 'too-many':
        return `${decimal.format(state.total)} files match, more than the ${decimal.format(
          ADD_ALL_MAX_FILES,
        )} that can be added at once. Narrow the filters, or select whole datasets instead.`;
      case 'error':
        return 'Could not add the matching files. Try again.';
      case 'done':
        return `Added ${decimal.format(state.added)} files to the selection.`;
      default:
        return 'Add every file matching the current filters to the selection.';
    }
  }, [state]);

  return (
    <Tooltip title={tooltip}>
      <span>
        <Button
          variant="text"
          color="primary"
          onClick={handleClick}
          disabled={isBusy}
          startIcon={isBusy ? <CircularProgress size={16} /> : <PlaylistAddRoundedIcon />}
        >
          {label}
        </Button>
      </span>
    </Tooltip>
  );
}

function FilesTableActions() {
  const wholeDatasets = useFilesSelectionStore((state) => state.wholeDatasets);
  const selectedFiles = useFilesSelectionStore((state) => state.selectedFiles);
  const hubmapIds = useFilesSelectionStore((state) => state.hubmapIds);
  const clearAll = useFilesSelectionStore((state) => state.clearAll);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const { isOpen, openDialog } = useBulkDownloadStore();

  const selectedDatasetCount = useMemo(
    () => countSelectedDatasets(wholeDatasets, selectedFiles),
    [wholeDatasets, selectedFiles],
  );

  const selectedFileCount = useMemo(
    () => [...selectedFiles.values()].reduce((total, files) => total + files.size, 0),
    [selectedFiles],
  );

  const handleDownload = useCallback(() => {
    openDialog(new Set(wholeDatasets), {
      selectedFiles,
      hubmapIdsByUuid: hubmapIds,
      analyticsCategory,
    });
  }, [openDialog, wholeDatasets, selectedFiles, hubmapIds, analyticsCategory]);

  const hasSelection = selectedDatasetCount > 0;

  const summary = useMemo(() => {
    if (!hasSelection) {
      return 'Select datasets or individual files to transfer.';
    }
    const parts = [`${decimal.format(selectedDatasetCount)} dataset${selectedDatasetCount === 1 ? '' : 's'} selected`];
    if (wholeDatasets.size > 0) {
      parts.push(`${decimal.format(wholeDatasets.size)} in full`);
    }
    if (selectedFileCount > 0) {
      parts.push(`${decimal.format(selectedFileCount)} individual file${selectedFileCount === 1 ? '' : 's'}`);
    }
    return parts.join(' · ');
  }, [hasSelection, wholeDatasets.size, selectedDatasetCount, selectedFileCount]);

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexGrow={1}>
      <Typography variant="body2" color="secondary">
        {summary}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <AddAllMatchingButton />
        {hasSelection && (
          <Button variant="text" color="primary" onClick={clearAll}>
            Clear Selection
          </Button>
        )}
        <Button variant="outlined" color="primary" disabled={!hasSelection} onClick={handleDownload}>
          Download Files
        </Button>
      </Stack>
      {isOpen && <BulkDownloadDialog deselectRows={undefined} />}
    </Stack>
  );
}

export default FilesTableActions;
