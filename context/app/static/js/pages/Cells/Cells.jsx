import React, { useState } from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { Alert } from 'js/shared-styles/alerts';
import StepAccordion from 'js/shared-styles/accordions/StepAccordion';
import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';
import DatasetsTable from 'js/components/cells/DatasetsTable';

function About(props) {
  const { title, given, returns } = props;
  return (
    <>
      <SectionHeader>{title}</SectionHeader>
      <p>
        <b>Given</b> {given}
      </p>
      <p>
        <b>Returns</b> {returns}
      </p>
    </>
  );
}

function Cells() {
  const [results, setResults] = useState([]);
  return (
    <>
      <Alert severity="warning">UI is still being designed, but we want to demonstrate that the API works.</Alert>
      <About
        title="Datasets selected by gene expression"
        given="a list of genes, a minimum expression level, and a minimum percentage of cells at that expression level"
        returns="a list of UUIDs for datasets which meet those minimums"
      />
      <StepAccordion summaryHeading="Parameters" content={<DatasetsSelectedByExpression setResults={setResults} />} />
      {results.length > 0 && (
        <StepAccordion
          summaryHeading="Results"
          content={<DatasetsTable datasets={results} minGeneExpression={10 ** 1} geneName="VIM" />}
        />
      )}
    </>
  );
}

export default Cells;
