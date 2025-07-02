import { generateCommaList } from 'js/helpers/functions';

const errorHelper = {
  inaccessibleDataset: (inaccessibleHubmapId: string) =>
    `You have selected a protected dataset (${inaccessibleHubmapId}) that cannot be downloaded with your current permissions. To proceed, click “Remove Protected Datasets” below.`,
  inaccessibleDatasets: (inaccessibleHubmapIds: string[]) =>
    `You have selected ${inaccessibleHubmapIds.length} protected datasets that cannot be downloaded with your current permissions. To proceed, click “Remove Protected Datasets” below.`,
};

const warningHelper = {
  protectedDataset: (protectedHubmapId: string) =>
    `You have selected a protected dataset (${protectedHubmapId}). Depending on your access level, you may not be able to download this dataset. If you do not have access, this dataset will not be downloaded correctly from the provided manifest.`,
  protectedDatasets: (protectedHubmapIds: string[]) =>
    `You have selected ${protectedHubmapIds.length} protected datasets (${generateCommaList(protectedHubmapIds)}). Depending on your access level, you may not be able to download these datasets. If you do not have access, these datasets will not be downloaded correctly from the provided manifest.`,
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
