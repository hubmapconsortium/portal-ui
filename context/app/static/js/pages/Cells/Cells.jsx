import React, { useState } from 'react';

import StepAccordion from 'js/shared-styles/accordions/StepAccordion';
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
    <>
      <StepAccordion summaryHeading="Query Type" content={<QuerySelect setQueryType={setQueryType} />} />
      <StepAccordion
        summaryHeading="Parameters"
        content={
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
        }
      />
      <StepAccordion
        summaryHeading="Results"
        disabled={results.length === 0}
        content={
          results.length > 0 ? (
            <DatasetsTable
              datasets={results}
              minGeneExpression={10 ** minExpressionLog}
              geneName={cellVariableNames[0]}
            />
          ) : undefined
        }
      />
    </>
  );
}

export default Cells;
