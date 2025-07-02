const errorHelper = {
  inaccessibleDataset: () =>
    `You have selected a protected dataset that cannot be downloaded with your current permissions. To proceed, click “Remove Protected Datasets” below.`,
  inaccessibleDatasets: (inaccessibleRows: string[]) =>
    `You have selected ${inaccessibleRows.length} protected datasets that cannot be downloaded with your current permissions. To proceed, click “Remove Protected Datasets” below.`,
};

const warningHelper = {
  protectedDataset: () =>
    `You have selected a protected dataset. Depending on your access level, you may not be able to download this dataset. If you do not have access, this dataset will not be downloaded correctly from the provided manifest.`,
  protectedDatasets: (protectedRows: string[]) =>
    `You have selected ${protectedRows.length} protected datasets. Depending on your access level, you may not be able to download these datasets. If you do not have access, these datasets will not be downloaded correctly from the provided manifest.`,
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
