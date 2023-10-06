import { useCallback } from 'react';

import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider/store';

import { useDatasetsAccessLevel } from './copiedHooks';

// Selected rows are a Set, so we must use `.size` to avoid a needless conversion to an array
// Protected rows are an array, so we can use `.length`
const errorHelper = {
  datasets: (selectedRows) =>
    `You have selected ${selectedRows.size} datasets. Workspaces currently only supports up to 10 datasets. Please unselect datasets.`,
  protectedDataset: (protectedRows) =>
    `You have selected a protected dataset (${protectedRows[0]._source.hubmap_id}). Workspaces currently only supports published public datasets. To remove the protected dataset from workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove this dataset.`,
  protectedDatasets: (protectedRows) =>
    `You have selected ${protectedRows.length} protected datasets. Workspaces currently only supports published public datasets. To remove protected datasets from this workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove those datasets.`,
};

function useProtectedDatasetsForm() {
  const { selectedRows, deselectRows } = useSelectableTableStore();
  const { toastSuccess } = useSnackbarActions();
  const protectedRows = useDatasetsAccessLevel(selectedRows.size > 0 ? [...selectedRows] : []).datasets;
  const containsProtectedDataset = protectedRows.length > 0;

  const errorMessages = [];

  if (selectedRows.size > 10) {
    errorMessages.push(errorHelper.datasets(selectedRows));
  }

  if (containsProtectedDataset) {
    const protectedRowsError =
      protectedRows.length === 1 ? errorHelper.protectedDataset : errorHelper.protectedDatasets;
    errorMessages.push(protectedRowsError(protectedRows));
  }
  const protectedHubmapIds = protectedRows?.map((row) => row._source.hubmap_id).join(', ');

  const removeProtectedDatasets = useCallback(() => {
    deselectRows(protectedRows.map((r) => r._id));
    toastSuccess('Protected datasets successfully removed from selection.');
  }, [deselectRows, protectedRows, toastSuccess]);

  return { errorMessages, protectedHubmapIds, removeProtectedDatasets, protectedRows, selectedRows };
}

export default useProtectedDatasetsForm;
