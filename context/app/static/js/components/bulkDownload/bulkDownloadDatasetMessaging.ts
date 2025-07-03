import { generateCommaList } from 'js/helpers/functions';

const errorHelper = {
  restrictedDataset: (restrictedHubmapId: string) =>
    `You have selected a protected dataset (${restrictedHubmapId}) that cannot be downloaded with your current permissions. To continue, click “Remove Restricted Datasets” below.`,
  restrictedDatasets: (restrictedHubmapIds: string[]) =>
    `You have selected ${restrictedHubmapIds.length} protected datasets that cannot be downloaded with your current permissions. To continue, click “Remove Restricted Datasets” below.`,
};

const warningHelper = {
  protectedDataset: (protectedHubmapId: string) =>
    `You have selected a protected dataset (${protectedHubmapId}). Access to this dataset depends on your user permissions. If you do not have access, it cannot be downloaded correctly using the provided manifest.`,
  protectedDatasets: (protectedHubmapIds: string[]) =>
    `You have selected ${protectedHubmapIds.length} protected datasets (${generateCommaList(protectedHubmapIds)}). Access to these datasets depends on your user permissions. If you do not have access, they cannot be downloaded correctly using the provided manifest.`,
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
