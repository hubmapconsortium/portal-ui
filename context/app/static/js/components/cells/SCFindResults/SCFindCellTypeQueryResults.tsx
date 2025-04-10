import React from 'react';
import { useSCFindCellTypeResults } from './hooks';
import { useAugmentedResults } from '../MolecularDataQueryResults/hooks';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import DatasetsTable from '../DatasetsTable';
import CellTypesChart from '../CellsCharts/CellTypesCharts';

interface SCFindCellTypeQueryResultsProps {
  datasetIds: { hubmap_id: string }[];
}

function SCFindCellTypeQueryResults({ datasetIds }: SCFindCellTypeQueryResultsProps) {
  const cellTypes = useCellVariableNames();
  const { hitsMap, isLoading, list } = useAugmentedResults(datasetIds);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hitsMap || Object.keys(hitsMap).length === 0) {
    return <div>No datasets found</div>;
  }

  return <DatasetsTable datasets={list} expandedContent={CellTypesChart} />;
}

function SCFindCellTypeQueryResultsLoader() {
  const { datasets, isLoading } = useSCFindCellTypeResults();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!datasets || datasets.length === 0) {
    return <div>No datasets found</div>;
  }

  return <SCFindCellTypeQueryResults datasetIds={datasets.map((hubmap_id) => ({ hubmap_id }))} />;
}

export default SCFindCellTypeQueryResultsLoader;
