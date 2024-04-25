import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import DatasetsTable from 'js/components/cells/DatasetsTable';
import { useStore, CellsSearchStore } from 'js/components/cells/store';
import { CenteredFlex, FullWidthAlert } from './style';
import CellTypeResults from '../CellTypeResults';

const cellsStoreSelector = (state: CellsSearchStore) => ({
  isLoading: state.isLoading,
  results: state.results,
  minExpressionLog: state.minExpressionLog,
  cellVariableNames: state.cellVariableNames,
  queryType: state.queryType,
});

function CellsResults() {
  const { isLoading, results, minExpressionLog, cellVariableNames, queryType } = useStore(cellsStoreSelector);

  if (isLoading) {
    return (
      <CenteredFlex>
        <Typography>Please wait while your results are loading.</Typography>
        <CircularProgress />
      </CenteredFlex>
    );
  }

  if (!results) {
    return (
      <FullWidthAlert severity="info">
        No results found matching your search. Edit query parameters by returning to the previous step.
      </FullWidthAlert>
    );
  }

  if (queryType === 'cell-type') {
    return <CellTypeResults />;
  }

  return (
    <DatasetsTable
      datasets={results}
      minExpression={10 ** minExpressionLog}
      cellVariableName={cellVariableNames[0]}
      queryType={queryType}
    />
  );
}

export default CellsResults;
