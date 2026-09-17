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
import { filterHasValues, useSearchStore } from '../../store';
import { useFilesSelectionStore } from './useFilesSelectionStore';
import useAddAllMatchingFiles, { ADD_ALL_MAX_FILES } from './useAddAllMatchingFiles';
import useWholeDatasetFileCounts from './useWholeDatasetFileCounts';

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
        return 'Select every file matching the current filters, across all pages, not just the ones shown.';
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

/** True when anything is narrowing the result set, so "add all matching" is a bounded request. */
function useHasQuery() {
  const filters = useSearchStore((state) => state.filters);
  const search = useSearchStore((state) => state.search);
  const filenameFilter = useSearchStore((state) => state.filenameFilter);

  return useMemo(
    () =>
      Boolean(search) ||
      Boolean(filenameFilter) ||
      Object.values(filters).some((filter) => Boolean(filterHasValues({ filter }))),
    [filters, search, filenameFilter],
  );
}

function FilesTableActions() {
  const wholeDatasets = useFilesSelectionStore((state) => state.wholeDatasets);
  const selectedFiles = useFilesSelectionStore((state) => state.selectedFiles);
  const hubmapIds = useFilesSelectionStore((state) => state.hubmapIds);
  const clearAll = useFilesSelectionStore((state) => state.clearAll);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);
  const hasQuery = useHasQuery();

  const { isOpen, openDialog } = useBulkDownloadStore();

  const wholeDatasetUuids = useMemo(() => [...wholeDatasets], [wholeDatasets]);
  const { counts: wholeCounts, isLoading: areCountsLoading } = useWholeDatasetFileCounts(wholeDatasetUuids);

  const selectedFileCount = useMemo(
    () => [...selectedFiles.values()].reduce((total, files) => total + files.size, 0),
    [selectedFiles],
  );

  const wholeFileCount = useMemo(
    () => wholeDatasetUuids.reduce((total, uuid) => total + (wholeCounts.get(uuid) ?? 0), 0),
    [wholeDatasetUuids, wholeCounts],
  );

  const handleDownload = useCallback(() => {
    openDialog(new Set(wholeDatasets), {
      selectedFiles,
      hubmapIdsByUuid: hubmapIds,
      analyticsCategory,
    });
  }, [openDialog, wholeDatasets, selectedFiles, hubmapIds, analyticsCategory]);

  const hasSelection = wholeDatasets.size > 0 || selectedFiles.size > 0;

  const summary = useMemo(() => {
    if (!hasSelection) {
      return 'Select datasets or individual files to transfer.';
    }
    const total = selectedFileCount + wholeFileCount;
    // A whole-dataset count is only known once the unfiltered aggregation lands. Rather than show a
    // number that will jump, mark the total as still settling.
    const isPending = wholeDatasetUuids.some((uuid) => !wholeCounts.has(uuid)) || areCountsLoading;
    if (isPending) {
      return `${decimal.format(total)}… files selected`;
    }
    return `${decimal.format(total)} file${total === 1 ? '' : 's'} selected`;
  }, [hasSelection, selectedFileCount, wholeFileCount, wholeDatasetUuids, wholeCounts, areCountsLoading]);

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexGrow={1}>
      <Typography variant="body2" color="secondary">
        {summary}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Unfiltered, this matches ~9.9M files and can only refuse, so it is noise until the
            result set is narrowed. */}
        {hasQuery && <AddAllMatchingButton />}
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
