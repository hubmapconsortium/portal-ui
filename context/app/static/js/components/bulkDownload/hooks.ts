import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  bulkDownloadOptionsField,
  bulkDownloadOptionsOptionalField,
  bulkDownloadMetadataField,
  bulkDownloadMetadataJsonField,
} from 'js/components/bulkDownload/bulkDownloadFormFields';
import useBulkDownloadToasts from 'js/components/bulkDownload/toastHooks';
import { ALL_BULK_DOWNLOAD_OPTIONS } from 'js/components/bulkDownload/constants';
import { BulkDownloadDataset, useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import useSWR from 'swr';
import { fetchSearchData } from 'js/hooks/useSearchData';
import { useAppContext } from 'js/components/Contexts';
import { SearchHit } from 'js/typings/elasticsearch';
import { useRestrictedDatasetsForm } from 'js/hooks/useRestrictedDatasets';
import { createDownloadUrl } from 'js/helpers/functions';
import { buildManifest } from 'js/helpers/manifest';
import { checkAndDownloadFile, postAndDownloadFile } from 'js/helpers/download';
import { getIDsQuery } from 'js/helpers/queries';
import { restrictedDatasetsErrorMessage } from 'js/components/bulkDownload/bulkDownloadDatasetMessaging';
import { trackEvent } from 'js/helpers/trackers';
import { hashUuidSet } from 'js/helpers/swr/keys';

const EMPTY_SEARCH_HITS: Required<SearchHit<BulkDownloadDataset>>[] = [];

const schema = z
  .object({
    ...bulkDownloadOptionsField,
    ...bulkDownloadMetadataField,
    ...bulkDownloadMetadataJsonField,
  })
  .partial()
  .required({ bulkDownloadOptions: true });

/**
 * Schema for a selection that names individual files.
 *
 * The processing-type options classify whole datasets, which says nothing about an explicitly
 * chosen path, so they are not required (and are hidden) in that case.
 */
const fileSelectionSchema = z
  .object({
    ...bulkDownloadOptionsOptionalField,
    ...bulkDownloadMetadataField,
    ...bulkDownloadMetadataJsonField,
  })
  .partial();

export interface BulkDownloadFormTypes {
  bulkDownloadOptions: string[];
  bulkDownloadMetadata: boolean;
  bulkDownloadMetadataJson: boolean;
}

function useBulkDownloadForm(hasFileSelection: boolean) {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<BulkDownloadFormTypes>({
    defaultValues: {
      bulkDownloadOptions: ALL_BULK_DOWNLOAD_OPTIONS.map((option) => option.key),
      bulkDownloadMetadata: false,
      bulkDownloadMetadataJson: false,
    },
    mode: 'onChange',
    resolver: zodResolver(hasFileSelection ? fileSelectionSchema : schema),
  });

  return {
    handleSubmit,
    setValue,
    control,
    errors,
    reset,
    trigger,
  };
}

const ES_BATCH_SIZE = 10_000;

function useBulkDownloadDialog(deselectRows?: (uuids: string[]) => void) {
  const {
    isOpen,
    uuids,
    close,
    setUuids,
    setDownloadSuccess,
    selectedFiles,
    setSelectedFiles,
    hubmapIdsByUuid,
    analyticsCategory,
  } = useBulkDownloadStore();
  // Individually chosen files, if the caller supplied any. Datasets selected in full stay in
  // `uuids` and keep behaving exactly as they did for every existing caller.
  const hasFileSelection = Boolean(selectedFiles && selectedFiles.size > 0);
  const { control, handleSubmit, errors, reset, trigger } = useBulkDownloadForm(hasFileSelection);
  const { toastErrorDownloadFile, toastSuccessDownloadFile } = useBulkDownloadToasts();
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  // Every dataset the download touches: selected in full, or reached through one of its files.
  // Permissions, the metadata TSV and the restricted-dataset messaging are all per dataset, so all
  // of them need this union rather than just the whole-dataset selection.
  const allSelectedUuids = useMemo(() => new Set([...uuids, ...(selectedFiles?.keys() ?? [])]), [uuids, selectedFiles]);

  // Fetch datasets for the selected uuids, batching to stay within ES limits.
  // Use a hash for the SWR key to avoid creating a large key string from all UUIDs.
  const shouldFetch = allSelectedUuids.size > 0;
  const swrKey = useMemo(
    () => (shouldFetch ? `bulk-download-datasets:${hashUuidSet(allSelectedUuids)}` : null),
    [shouldFetch, allSelectedUuids],
  );
  const { data: searchHits = EMPTY_SEARCH_HITS, isLoading: isDatasetsLoading } = useSWR(swrKey, async () => {
    const allUuids = [...allSelectedUuids];
    const batches: string[][] = [];
    for (let i = 0; i < allUuids.length; i += ES_BATCH_SIZE) {
      batches.push(allUuids.slice(i, i + ES_BATCH_SIZE));
    }

    const results = await Promise.all(
      batches.map((batch) =>
        fetchSearchData<BulkDownloadDataset, unknown>(
          {
            query: getIDsQuery(batch),
            _source: ['hubmap_id', 'processing', 'uuid', 'processing_type'],
            size: batch.length,
          },
          elasticsearchEndpoint,
          groupsToken,
        ),
      ),
    );

    return results.flatMap((r) => (r.hits?.hits ?? []) as Required<SearchHit<BulkDownloadDataset>>[]);
  });
  const datasets = useMemo(() => searchHits.map(({ _source }) => _source), [searchHits]);

  // Which options and datasets to show in the dialog. Scoped to datasets selected *in full*: the
  // processing-type classification is a property of a dataset, so it cannot sensibly include or
  // exclude a path the user named explicitly.
  const wholeDatasetSelection = useMemo(() => datasets.filter((dataset) => uuids.has(dataset.uuid)), [datasets, uuids]);

  const downloadOptions = useMemo(
    () =>
      ALL_BULK_DOWNLOAD_OPTIONS.map((option) => {
        const datasetsForOption = wholeDatasetSelection.filter((dataset) => option.isIncluded(dataset));

        return {
          ...option,
          count: datasetsForOption.length,
          datasets: datasetsForOption,
        };
      }).filter((option) => option.count > 0),
    [wholeDatasetSelection],
  );

  // Remove selected uuids from the list and deselect them in the table if needed
  const removeUuidsOrRows = useCallback(
    (uuidsToRemove: string[]) => {
      if (deselectRows) {
        deselectRows(uuidsToRemove);
      }
      setUuids(new Set([...uuids].filter((uuid) => !uuidsToRemove.includes(uuid))));
      // A restricted dataset has to leave the file selection too, or its files would still reach
      // the manifest after the user removed it.
      if (selectedFiles) {
        const next = new Map(selectedFiles);
        uuidsToRemove.forEach((uuid) => next.delete(uuid));
        setSelectedFiles(next);
      }
    },
    [deselectRows, setUuids, uuids, selectedFiles, setSelectedFiles],
  );

  const selectedRowsSet = allSelectedUuids;
  const restrictedDatasetsFields = useRestrictedDatasetsForm({
    selectedRows: selectedRowsSet,
    deselectRows: removeUuidsOrRows,
    restrictedDatasetsErrorMessage,
  });

  const downloadMetadata = useCallback(
    (datasetsToDownload: BulkDownloadDataset[]) => {
      postAndDownloadFile({
        url: '/metadata/v0/datasets.tsv',
        body: { uuids: datasetsToDownload.map((dataset) => dataset.uuid) },
        fileName: 'metadata.tsv',
      })
        .then(() => {
          toastSuccessDownloadFile('Metadata');
          trackEvent({
            category: 'Bulk Download',
            action: 'Bulk Download / Download Dataset Metadata',
            label: `${datasetsToDownload.length} datasets`,
          });
        })
        .catch((e) => {
          toastErrorDownloadFile('Metadata', () => {
            // eslint-disable-next-line react-hooks/immutability -- Intentional in-place mutation of a local accumulator.
            downloadMetadata(datasetsToDownload);
          });
          console.error(e);
        });
    },
    [toastSuccessDownloadFile, toastErrorDownloadFile],
  );

  const downloadManifest = useCallback(
    (datasetsToDownload: BulkDownloadDataset[], includeMetadataJson = false) => {
      // Whole datasets come from `uuids` (filtered by the processing-type options); individually
      // chosen files are added verbatim, since naming a path is already an explicit choice and the
      // processing-type classification says nothing about it.
      const wholeDatasets = new Set(datasetsToDownload.map((dataset) => dataset.uuid));
      const ids = new Map(hubmapIdsByUuid ?? []);
      datasetsToDownload.forEach((dataset) => ids.set(dataset.uuid, dataset.hubmap_id));

      const manifest = buildManifest({
        wholeDatasets,
        selectedFiles,
        hubmapIdsByUuid: ids,
        withMetadataJson: includeMetadataJson ? new Set(selectedFiles?.keys() ?? []) : undefined,
      });

      const url = createDownloadUrl(manifest, 'text/plain');
      const lineCount = manifest ? manifest.split('\n').length : 0;

      checkAndDownloadFile({ url, fileName: 'manifest.txt' })
        .then(() => {
          trackEvent({
            category: analyticsCategory ?? 'Bulk Download',
            action: 'Bulk Download / Download File Manifest',
            label: `${datasetsToDownload.length} datasets, ${lineCount} manifest lines`,
          });
          setDownloadSuccess(true);
        })
        .catch((e) => {
          toastErrorDownloadFile('Manifest', () => {
            // eslint-disable-next-line react-hooks/immutability -- Intentional in-place mutation of a local accumulator.
            downloadManifest(datasetsToDownload, includeMetadataJson);
          });
          console.error(e);
        });
    },
    [toastErrorDownloadFile, setDownloadSuccess, selectedFiles, hubmapIdsByUuid, analyticsCategory],
  );

  // Datasets present only because one of their files was chosen. Needed for the metadata TSV and
  // for the dialog's summary copy; they are deliberately absent from `downloadOptions`.
  const fileSelectionDatasets = useMemo(
    () => datasets.filter((dataset) => selectedFiles?.has(dataset.uuid) && !uuids.has(dataset.uuid)),
    [datasets, selectedFiles, uuids],
  );

  const selectedFileCount = useMemo(
    () => [...(selectedFiles?.values() ?? [])].reduce((total, files) => total + files.size, 0),
    [selectedFiles],
  );

  const handleClose = useCallback(() => {
    reset();
    close();
  }, [close, reset]);

  const onSubmit = useCallback(
    ({ bulkDownloadOptions, bulkDownloadMetadata, bulkDownloadMetadataJson }: BulkDownloadFormTypes) => {
      const datasetsToDownload = downloadOptions
        .filter((option) => bulkDownloadOptions?.includes(option.key))
        .flatMap((option) => option.datasets);

      if (bulkDownloadMetadata) {
        // The metadata TSV is dataset-level, so include datasets reached through a file selection
        // as well -- otherwise a files-only download would produce an empty TSV.
        const metadataDatasets = fileSelectionDatasets.length
          ? [...datasetsToDownload, ...fileSelectionDatasets]
          : datasetsToDownload;
        downloadMetadata(metadataDatasets);
      }

      downloadManifest(datasetsToDownload, bulkDownloadMetadataJson);
      handleClose();
    },
    [handleClose, downloadOptions, downloadMetadata, downloadManifest, fileSelectionDatasets],
  );

  // Trigger error on initial load for required fields. Not applicable to a file selection, whose
  // options are optional and hidden.
  useEffect(() => {
    if (isOpen && !hasFileSelection) {
      trigger('bulkDownloadOptions').catch((e) => {
        console.error(e);
      });
    }
  }, [isOpen, trigger, hasFileSelection]);

  return {
    ...restrictedDatasetsFields,
    isOpen,
    isLoading: isDatasetsLoading || restrictedDatasetsFields.isLoading,
    errors,
    control,
    downloadOptions,
    hasFileSelection,
    selectedFileCount,
    fileSelectionDatasetCount: fileSelectionDatasets.length,
    onSubmit,
    handleSubmit,
    handleClose,
    downloadManifest,
    downloadMetadata,
  };
}

export { useBulkDownloadDialog };
