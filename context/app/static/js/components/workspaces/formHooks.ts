import { useCallback, useRef } from 'react';

import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { trackEvent } from 'js/helpers/trackers';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';
import { Dataset } from 'js/components/types';
import { EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS, MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';

type DatasetAccessLevelHits = SearchHit<Pick<Dataset, 'hubmap_id' | 'mapped_dataset_access_level' | 'uuid'>>[];

function useDatasetsAccessLevel(ids: string[]) {
  const query = {
    query: {
      bool: {
        must: [getIDsQuery(ids), getTermClause('mapped_data_access_level.keyword', 'Protected')],
      },
    },
    _source: ['mapped_data_access_level', 'hubmap_id', 'uuid'],
    size: ids.length,
  };
  const { searchHits: datasets } = useSearchHits(query) as { searchHits: DatasetAccessLevelHits };
  return { datasets };
}

const errorHelper = {
  excessiveDatasets: () =>
    `You have selected over ${EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS} datasets, which may extend launch time. Workspace will still launch, but reduce your selection for a quicker launch.`,
  maxDatasets: (workspaceDatasets: number) =>
    `You have selected ${workspaceDatasets} datasets. The dataset limit for workspaces is ${MAX_NUMBER_OF_WORKSPACE_DATASETS} datasets. Please reduce your selection.`,
  protectedDataset: (protectedRows: DatasetAccessLevelHits) =>
    `You have selected a protected dataset (${protectedRows[0]?._source?.hubmap_id}). Workspaces currently only supports published public datasets. To remove the protected dataset from workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove this dataset.`,
  protectedDatasets: (protectedRows: DatasetAccessLevelHits) =>
    `You have selected ${protectedRows.length} protected datasets. Workspaces currently only supports published public datasets. To remove protected datasets from this workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove those datasets.`,
};

function useProtectedDatasetsForm() {
  const { selectedRows, deselectRows } = useSelectableTableStore();
  const { toastSuccessRemoveProtectedDatasets } = useWorkspaceToasts();
  const protectedRows = useDatasetsAccessLevel(selectedRows.size > 0 ? [...selectedRows] : []).datasets;
  const containsProtectedDataset = protectedRows.length > 0;

  const reportedProtectedRows = useRef(false);

  const errorMessages = [];

  if (containsProtectedDataset) {
    const protectedRowsError =
      protectedRows.length === 1 ? errorHelper.protectedDataset : errorHelper.protectedDatasets;
    errorMessages.push(protectedRowsError(protectedRows));
    if (!reportedProtectedRows.current) {
      reportedProtectedRows.current = true;
      trackEvent({
        category: 'Workspaces',
        action: 'Create Workspace / Protected datasets selected',
        value: protectedRows.length,
      });
    }
  }
  const protectedHubmapIds = protectedRows?.map((row) => row?._source?.hubmap_id).join(', ');

  const removeProtectedDatasets = useCallback(() => {
    deselectRows(protectedRows.map((r) => r._id));
    toastSuccessRemoveProtectedDatasets();
  }, [deselectRows, protectedRows, toastSuccessRemoveProtectedDatasets]);

  return { errorMessages, protectedHubmapIds, removeProtectedDatasets, protectedRows, selectedRows };
}

function useTooManyDatasetsErrors({ numWorkspaceDatasets }: { numWorkspaceDatasets: number }) {
  const errorMessages = [];
  const reportedTooManyRows = useRef(false);
  if (numWorkspaceDatasets > MAX_NUMBER_OF_WORKSPACE_DATASETS) {
    errorMessages.push(errorHelper.maxDatasets(numWorkspaceDatasets));
    if (!reportedTooManyRows.current) {
      reportedTooManyRows.current = true;
      trackEvent({
        category: 'Workspaces',
        action: 'Create Workspace / Too many datasets selected',
        value: numWorkspaceDatasets,
      });
    }
  }

  return errorMessages;
}

function useTooManyDatasetsWarnings({ numWorkspaceDatasets }: { numWorkspaceDatasets: number }) {
  const warningMessages = [];
  if (numWorkspaceDatasets > EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS) {
    warningMessages.push(errorHelper.excessiveDatasets());
  }

  return warningMessages;
}

export { useProtectedDatasetsForm, useTooManyDatasetsErrors, useTooManyDatasetsWarnings };
