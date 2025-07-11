import { EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS, MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';

export const errorHelper = {
  excessiveDatasets: () =>
    `You have selected over ${EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS} datasets, which may extend launch time. The workspace will still launch, but reduce your selection for a quicker launch.`,

  maxDatasets: (count: number) =>
    `You have selected ${count} datasets. The dataset limit for workspaces is ${MAX_NUMBER_OF_WORKSPACE_DATASETS} datasets. Please reduce your selection.`,

  restrictedDataset: (id: string) =>
    `You have selected a protected dataset (${id}) that cannot be accessed with your current permissions. To continue, click "Remove Restricted Datasets" below, or return to the previous screen to remove it manually.`,

  restrictedDatasets: (ids: string[]) =>
    `You have selected ${ids.length} protected datasets that cannot be accessed with your current permissions. To continue, click "Remove Restricted Datasets" below, or return to the previous screen to remove them manually.`,
};

export const warningHelper = {
  protectedDataset: (id: string) =>
    `You have selected a protected dataset (${id}). Access to this dataset depends on your user permissions. If you do not have access, it will not be linked properly in your workspace.`,

  protectedDatasets: (ids: string[]) =>
    `You have selected ${ids.length} protected datasets. Access to these datasets depends on your user permissions. If you do not have access, they will not be linked properly in your workspace.`,
};

export const restrictedDatasetsErrorMessage = (ids: string[]): string =>
  ids.length === 1 ? errorHelper.restrictedDataset(ids[0]) : errorHelper.restrictedDatasets(ids);

export const protectedDatasetsWarningMessage = (ids: string[]): string =>
  ids.length === 1 ? warningHelper.protectedDataset(ids[0]) : warningHelper.protectedDatasets(ids);
