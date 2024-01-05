export const organs = {
  id: 'organs',
  title: 'Organs',
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
  organs: organs.id,
  cellTypes: cellTypes.id,
};
