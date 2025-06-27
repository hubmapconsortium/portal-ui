import { EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS, MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';

export const errorHelper = {
  excessiveDatasets: () =>
    `You have selected over ${EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS} datasets, which may extend launch time. Workspace will still launch, but reduce your selection for a quicker launch.`,
  maxDatasets: (workspaceDatasets: number) =>
    `You have selected ${workspaceDatasets} datasets. The dataset limit for workspaces is ${MAX_NUMBER_OF_WORKSPACE_DATASETS} datasets. Please reduce your selection.`,
  inaccessibleDataset: () =>
    `You have selected a protected dataset that cannot be accessed with your current permissions in workspaces. To proceed, click “Remove Protected Datasets” below, or go back to the previous screen to remove it manually.`,
  inaccessibleDatasets: (inaccessibleRows: string[]) =>
    `You have selected ${inaccessibleRows.length} protected datasets that cannot be accessed with your current permissions in workspaces. To proceed, click “Remove Protected Datasets” below, or go back to the previous screen to remove them manually.`,
};

export const warningHelper = {
  protectedDataset: () =>
    `You have selected a protected dataset. Depending on your access level, you may not be able to access this dataset in the workspace. If you do not have access, this dataset will not be linked correctly to your workspace.`,
  protectedDatasets: (protectedRows: string[]) =>
    `You have selected ${protectedRows.length} protected datasets. Depending on your access level, you may not be able to access these datasets in the workspace. If you do not have access, these datasets will not be linked correctly to your workspace.`,
};

export const inaccessibleDatasetsErrorMessage = (inaccessibleRows: string[]) => {
  if (inaccessibleRows.length === 1) {
    return errorHelper.inaccessibleDataset();
  }
  return errorHelper.inaccessibleDatasets(inaccessibleRows);
};

export const protectedDatasetsWarningMessage = (protectedRows: string[]) => {
  if (protectedRows.length === 1) {
    return warningHelper.protectedDataset();
  }
  return warningHelper.protectedDatasets(protectedRows);
};
