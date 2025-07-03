import { generateCommaList } from 'js/helpers/functions';

const errorHelper = {
  single: (id: string) =>
    `You have selected a protected dataset (${id}) that cannot be downloaded with your current permissions. To continue, click “Remove Restricted Datasets” below.`,
  multiple: (ids: string[]) =>
    `You have selected ${ids.length} protected datasets that cannot be downloaded with your current permissions. To continue, click “Remove Restricted Datasets” below.`,
};

const warningHelper = {
  single: (id: string) =>
    `You have selected a protected dataset (${id}). Access to this dataset depends on your user permissions. If you do not have access, it cannot be downloaded correctly using the provided manifest.`,
  multiple: (ids: string[]) =>
    `You have selected ${ids.length} protected datasets (${generateCommaList(ids)}). Access to these datasets depends on your user permissions. If you do not have access, they cannot be downloaded correctly using the provided manifest.`,
};

export const restrictedDatasetsErrorMessage = (ids: string[]): string =>
  ids.length === 1 ? errorHelper.single(ids[0]) : errorHelper.multiple(ids);

export const protectedDatasetsWarningMessage = (ids: string[]): string =>
  ids.length === 1 ? warningHelper.single(ids[0]) : warningHelper.multiple(ids);
