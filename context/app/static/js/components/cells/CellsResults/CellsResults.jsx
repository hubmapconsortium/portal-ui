import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import DatasetsTable from 'js/components/cells/DatasetsTable';
import { useStore } from 'js/components/cells/store';
import { CenteredFlex, FullWidthAlert } from './style';

const cellsStoreSelector = (state) => ({
  isLoading: state.isLoading,
  results: state.results,
  minExpressionLog: state.minExpressionLog,
  cellVariableNames: state.cellVariableNames,
  queryType: state.queryType,
});

function CellsResults({ completeStep }) {
  const { isLoading, results, minExpressionLog, cellVariableNames, queryType } = useStore(cellsStoreSelector);

  if (isLoading) {
    return (
      <CenteredFlex>
        <Typography>Please wait while your results are loading.</Typography>
        <CircularProgress />
      </CenteredFlex>
    );
  }

  if (!results.length) {
    return (
      <FullWidthAlert severity="info">
        No results found matching your search. Edit query parameters by returning to the previous step.
      </FullWidthAlert>
    );
  }
  return (
    <DatasetsTable
      datasets={results}
      minExpression={10 ** minExpressionLog}
      cellVariableName={cellVariableNames[0]}
      queryType={queryType}
      completeStep={completeStep}
    />
  );
}

export default CellsResults;
