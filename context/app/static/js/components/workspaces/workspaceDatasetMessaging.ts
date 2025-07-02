import { EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS, MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';

export const errorHelper = {
  excessiveDatasets: () =>
    `You have selected over ${EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS} datasets, which may extend launch time. Workspace will still launch, but reduce your selection for a quicker launch.`,
  maxDatasets: (workspaceDatasets: number) =>
    `You have selected ${workspaceDatasets} datasets. The dataset limit for workspaces is ${MAX_NUMBER_OF_WORKSPACE_DATASETS} datasets. Please reduce your selection.`,
  inaccessibleDataset: (inaccessibleHubmapId: string) =>
    `You have selected a protected dataset (${inaccessibleHubmapId}) that cannot be accessed with your current permissions in workspaces. To proceed, click “Remove Protected Datasets” below, or go back to the previous screen to remove it manually.`,
  inaccessibleDatasets: (inaccessibleHubmapIds: string[]) =>
    `You have selected ${inaccessibleHubmapIds.length} protected datasets that cannot be accessed with your current permissions in workspaces. To proceed, click “Remove Protected Datasets” below, or go back to the previous screen to remove them manually.`,
};

export const warningHelper = {
  protectedDataset: (protectedHubmapId: string) =>
    `You have selected a protected dataset (${protectedHubmapId}). Depending on your access level, you may not be able to access this dataset in the workspace. If you do not have access, this dataset will not be linked correctly to your workspace.`,
  protectedDatasets: (protectedHubmapIds: string[]) =>
    `You have selected ${protectedHubmapIds.length} protected datasets. Depending on your access level, you may not be able to access these datasets in the workspace. If you do not have access, these datasets will not be linked correctly to your workspace.`,
};

export const inaccessibleDatasetsErrorMessage = (inaccessibleHubmapIds: string[]) => {
  if (inaccessibleHubmapIds.length === 1) {
    return errorHelper.inaccessibleDataset(inaccessibleHubmapIds[0]);
  }
  return errorHelper.inaccessibleDatasets(inaccessibleHubmapIds);
};

export const protectedDatasetsWarningMessage = (protectedHubmapIds: string[]) => {
  if (protectedHubmapIds.length === 1) {
    return warningHelper.protectedDataset(protectedHubmapIds[0]);
  }
  return warningHelper.protectedDatasets(protectedHubmapIds);
};
