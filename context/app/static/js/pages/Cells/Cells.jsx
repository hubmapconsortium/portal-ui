import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';

import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import QuerySelect from 'js/components/cells/QuerySelect';
import CellsResults from 'js/components/cells/CellsResults';

function Cells() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minExpressionLog, setMinExpressionLog] = useState(1);
  const [minCellPercentage, setMinCellPercentage] = useState(10);
  const [cellVariableNames, setCellVariableNames] = useState([]);
  const [queryType, setQueryType] = useState([]);

  return (
    <>
      <Typography variant="h2" component="h1" color="primary">
        Cells
      </Typography>
      <AccordionSteps
        steps={[
          {
            heading: '1. Query Type',
            content: <QuerySelect setQueryType={setQueryType} setCellVariableNames={setCellVariableNames} />,
          },
          {
            heading: '2. Parameters',
            content: (
              <DatasetsSelectedByExpression
                setResults={setResults}
                minExpressionLog={minExpressionLog}
                setMinExpressionLog={setMinExpressionLog}
                minCellPercentage={minCellPercentage}
                setMinCellPercentage={setMinCellPercentage}
                cellVariableNames={cellVariableNames}
                setCellVariableNames={setCellVariableNames}
                queryType={queryType}
                setIsLoading={setIsLoading}
              />
            ),
          },
          {
            heading: '3. Results',
            content: (
              <CellsResults
                isLoading={isLoading}
                results={results}
                minExpressionLog={minExpressionLog}
                cellVariableNames={cellVariableNames}
                queryType={queryType}
              />
            ),
          },
        ]}
        isFirstStepOpen
      />
    </>
  );
}

export default Cells;
