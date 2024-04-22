import { useCallback, useRef } from 'react';

import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { trackEvent } from 'js/helpers/trackers';

import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';
import { MAX_NUMBER_OF_WORKSPACE_DATASETS } from './api';
import { Dataset } from '../Contexts';

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
  datasets: (workspaceDatasets: number) =>
    `You have selected ${workspaceDatasets} datasets. Workspaces currently only supports up to ${MAX_NUMBER_OF_WORKSPACE_DATASETS} datasets. Please unselect datasets.`,
  protectedDataset: (protectedRows: DatasetAccessLevelHits) =>
    `You have selected a protected dataset (${protectedRows[0]?._source?.hubmap_id}). Workspaces currently only supports published public datasets. To remove the protected dataset from workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove this dataset.`,
  protectedDatasets: (protectedRows: DatasetAccessLevelHits) =>
    `You have selected ${protectedRows.length} protected datasets. Workspaces currently only supports published public datasets. To remove protected datasets from this workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove those datasets.`,
};

function useProtectedDatasetsForm() {
  const { selectedRows, deselectRows } = useSelectableTableStore();
  const { toastSuccess } = useSnackbarActions();
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
    toastSuccess('Protected datasets successfully removed from selection.');
  }, [deselectRows, protectedRows, toastSuccess]);

  return { errorMessages, protectedHubmapIds, removeProtectedDatasets, protectedRows, selectedRows };
}

function useTooManyDatasetsErrors({ numWorkspaceDatasets }: { numWorkspaceDatasets: number }) {
  const errorMessages = [];
  const reportedTooManyRows = useRef(false);
  if (numWorkspaceDatasets > MAX_NUMBER_OF_WORKSPACE_DATASETS) {
    errorMessages.push(errorHelper.datasets(numWorkspaceDatasets));
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

export { useProtectedDatasetsForm, useTooManyDatasetsErrors };
