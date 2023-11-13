export const azimuth = {
  id: 'azimuth-organ-reference-dataset',
  title: 'Azimuth Organ Reference Dataset',
  tooltip:
    'Analysis provided by Azimuth that uses an annotated reference dataset to automate the processing, analysis and interpretation of a single-cell RNA-seq experiment.',
};

export const biomarkerQuery = {
  id: 'biomarker-query',
  title: 'Datasets: Biomarker Query',
  tooltip: 'Query HuBMAP datasets for biomarker(s) data',
};

export const cellTypes = {
  id: 'cell-types',
  title: 'Cell Types',
  tooltip: 'Cell types which express this gene. Some of these cell types exist within HuBMAP datasets.',
};

export const pageSectionIDs = {
  summary: 'summary',
  biomarkerQuery: biomarkerQuery.id,
  azimuth: azimuth.id,
  cellTypes: cellTypes.id,
};
