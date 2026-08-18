import React, { useCallback, useMemo } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { createDownloadUrl } from 'js/helpers/functions';
import { checkAndDownloadFile } from 'js/helpers/download';
import { trackEvent } from 'js/helpers/trackers';
import { decimal } from 'js/helpers/number-format';
import { useSearchStore } from '../../store';
import { useFilesSelectionStore, countSelectedDatasets } from './useFilesSelectionStore';
import { buildManifest } from './utils';

/**
 * Selection summary plus the transfer actions for the files search.
 *
 * This replaces `TableHeaderActions` rather than extending it: saved lists, workspaces, LineUp
 * and the tile-view switch all act on entities, and files are not entities.
 */
function FilesTableActions({ hubmapIdsByUuid }: { hubmapIdsByUuid: Map<string, string> }) {
  const wholeDatasets = useFilesSelectionStore((state) => state.wholeDatasets);
  const selectedFiles = useFilesSelectionStore((state) => state.selectedFiles);
  const clearAll = useFilesSelectionStore((state) => state.clearAll);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const selectedDatasetCount = useMemo(
    () => countSelectedDatasets(wholeDatasets, selectedFiles),
    [wholeDatasets, selectedFiles],
  );

  const selectedFileCount = useMemo(
    () => [...selectedFiles.values()].reduce((total, files) => total + files.size, 0),
    [selectedFiles],
  );

  const handleDownloadManifest = useCallback(() => {
    const manifest = buildManifest({ wholeDatasets, selectedFiles, hubmapIdsByUuid });
    if (!manifest) {
      return;
    }
    const url = createDownloadUrl(manifest, 'text/plain');
    checkAndDownloadFile({ url, fileName: 'manifest.txt' })
      .then(() => {
        trackEvent({
          category: analyticsCategory,
          action: 'Download File Manifest',
          label: `${selectedDatasetCount} datasets`,
        });
      })
      .catch(console.error);
  }, [wholeDatasets, selectedFiles, hubmapIdsByUuid, analyticsCategory, selectedDatasetCount]);

  const hasSelection = selectedDatasetCount > 0;

  const summary = useMemo(() => {
    if (!hasSelection) {
      return 'Select datasets or individual files to transfer.';
    }
    const wholeCount = wholeDatasets.size;
    const parts = [`${decimal.format(selectedDatasetCount)} dataset${selectedDatasetCount === 1 ? '' : 's'} selected`];
    if (wholeCount > 0) {
      parts.push(`${decimal.format(wholeCount)} in full`);
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
        {hasSelection && (
          <Button variant="text" color="primary" onClick={clearAll}>
            Clear Selection
          </Button>
        )}
        <Button variant="outlined" color="primary" disabled={!hasSelection} onClick={handleDownloadManifest}>
          Download Manifest
        </Button>
      </Stack>
    </Stack>
  );
}

export default FilesTableActions;
