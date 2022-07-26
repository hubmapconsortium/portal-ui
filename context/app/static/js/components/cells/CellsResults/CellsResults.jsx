import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import DatasetsTable from 'js/components/cells/DatasetsTable';
import { CenteredFlex } from './style';

function CellsResults({ isLoading, results, minExpressionLog, cellVariableNames, queryType, completeStep }) {
  if (isLoading) {
    return (
      <CenteredFlex>
        <Typography>Please wait while your results are loading.</Typography>
        <CircularProgress />
      </CenteredFlex>
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
