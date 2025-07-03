import { EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS, MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';

export const errorHelper = {
  excessiveDatasets: () =>
    `You have selected over ${EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS} datasets, which may extend launch time. Workspace will still launch, but reduce your selection for a quicker launch.`,
  maxDatasets: (workspaceDatasets: number) =>
    `You have selected ${workspaceDatasets} datasets. The dataset limit for workspaces is ${MAX_NUMBER_OF_WORKSPACE_DATASETS} datasets. Please reduce your selection.`,
  restrictedDataset: (restrictedHubmapId: string) =>
    `You have selected a protected dataset (${restrictedHubmapId}) that cannot be accessed with your current permissions. To continue, click "Remove Restricted Datasets" below, or return to the previous screen to remove it manually.`,
  restrictedDatasets: (restrictedHubmapIds: string[]) =>
    `You have selected ${restrictedHubmapIds.length} protected datasets that cannot be accessed with your current permissions. To continue, click "Remove Restricted Datasets" below, or return to the previous screen to remove them manually.`,
};

export const warningHelper = {
  protectedDataset: (protectedHubmapId: string) =>
    `You have selected a protected dataset (${protectedHubmapId}). Access to this dataset depends on your user permissions. If you do not have access, it will not be linked properly in your workspace.`,
  protectedDatasets: (protectedHubmapIds: string[]) =>
    `You have selected ${protectedHubmapIds.length} protected datasets. Access to these datasets depends on your user permissions. If you do not have access, they will not be linked properly in your workspace.`,
};

export const restrictedDatasetsErrorMessage = (restrictedHubmapIds: string[]) => {
  if (restrictedHubmapIds.length === 1) {
    return errorHelper.restrictedDataset(restrictedHubmapIds[0]);
  }
  return errorHelper.restrictedDatasets(restrictedHubmapIds);
};

export const protectedDatasetsWarningMessage = (protectedHubmapIds: string[]) => {
  if (protectedHubmapIds.length === 1) {
    return warningHelper.protectedDataset(protectedHubmapIds[0]);
  }
  return warningHelper.protectedDatasets(protectedHubmapIds);
};
