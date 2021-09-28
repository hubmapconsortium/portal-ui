import React, { useState } from 'react';

import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import DatasetsTable from 'js/components/cells/DatasetsTable';
import QuerySelect from 'js/components/cells/QuerySelect';

function Cells() {
  const [results, setResults] = useState([]);
  const [minExpressionLog, setMinExpressionLog] = useState(1);
  const [minCellPercentage, setMinCellPercentage] = useState(10);
  const [cellVariableNames, setCellVariableNames] = useState([]);
  const [queryType, setQueryType] = useState([]);

  return (
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
            />
          ),
        },
        {
          heading: '3. Results',
          content:
            results.length > 0 ? (
              <DatasetsTable
                datasets={results}
                minExpression={10 ** minExpressionLog}
                cellVariableName={cellVariableNames[0]}
              />
            ) : undefined,
        },
      ]}
    />
  );
}

export default Cells;
