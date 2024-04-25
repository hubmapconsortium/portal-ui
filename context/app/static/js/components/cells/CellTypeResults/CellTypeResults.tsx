import React from 'react';
import { CellTypeOrgansGraph } from 'js/components/cell-types/CellTypesVisualization';
import CellTypesProvider from 'js/components/cell-types/CellTypesContext';
import { Typography } from '@mui/material';
import { useStore } from '../store';
import { DisambiguationTextbox } from './DisambiguationTextbox';
import { useCellTypeOrgans } from './hooks';
import { extractCLID } from './utils';
// import DatasetsTable from '../DatasetsTable';

function CellTypeResult({ cellType }: { cellType: string }) {
  const { organs = [], error, isLoading } = useCellTypeOrgans(cellType);

  if (error ?? isLoading) {
    if (error) {
      console.error(error);
    }
    return null;
  }

  const clid = extractCLID(cellType);

  if (!clid) {
    console.error('Could not extract CLID from cell type name');
    return null;
  }

  return (
    <CellTypesProvider cellId={clid}>
      <Typography variant="h4">{cellType}</Typography>
      <DisambiguationTextbox cellName={cellType} />
      <CellTypeOrgansGraph organs={organs} />
    </CellTypesProvider>
  );
}

function CellTypeResults() {
  // For cell type queries, the results are displayed differently than for other queries.
  // The total number of datasets that match the query is displayed, out of all datasets.
  // A disambiguation textbox is displayed if a CLID resolves to multiple variants of a cell type.
  // A graph is displayed showing the distribution of the cell type across different organs.

  const { results, resultCounts, cellVariableNames } = useStore();

  if (!results || !resultCounts) {
    return null;
  }

  return (
    <div>
      <div>
        <h3>Cell Type Results</h3>
        <p>
          {resultCounts.matching} out of {resultCounts.total} datasets match the query.
        </p>
      </div>
      <div>
        {cellVariableNames.map((cellTypeName) => (
          <CellTypeResult key={cellTypeName} cellType={cellTypeName} />
        ))}
      </div>
      <div>{/* <DatasetsTable datasets={results} /> */}</div>
    </div>
  );
}

export default CellTypeResults;
