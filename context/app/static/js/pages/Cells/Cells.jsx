import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import AccordionSteps from 'js/shared-styles/accordions/AccordionSteps';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
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
        Datasets: Molecular Data Queries
      </Typography>
      <SectionPaper>
        <p>
          Retrieve datasets based on the abundance of transcriptomic, epigenomic, and proteomic biomarkers across cells.
          For example, you can retrieve a list of datasets where normalized transcript abundance for the UMOD
          (uromodulin) gene is above a user-defined cut off, e.g., 1, in at least 5% of all cells. This query will
          return a list of kidney datasets. To begin your search, select a query type (&quot;Gene&quot; for
          transcriptomic and epigenomic measurements, &quot;Protein&quot; for proteomic measurements) and set the
          desired parameters.
        </p>
        <p>
          Molecular data queries are in beta testing and there is a{' '}
          <OutboundLink href="https://github.com/hubmapconsortium/portal-ui/issues?q=is%3Aopen+is%3Aissue+label%3A%22feature%3A+cells%22">
            list of known issues
          </OutboundLink>
          . In the future, <OutboundLink href="#TODO">additional types of queries</OutboundLink> will be supported.
        </p>
      </SectionPaper>
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
