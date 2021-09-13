import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { Alert } from 'js/shared-styles/alerts';

import DatasetsSelectedByExpression from 'js/components/cells/DatasetsSelectedByExpression';

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
  return (
    <>
      <Alert severity="warning">UI is still being designed, but we want to demonstrate that the API works.</Alert>
      <About
        title="Datasets selected by gene expression"
        given="a list of genes, a minimum expression level, and a minimum percentage of cells at that expression level"
        returns="a list of UUIDs for datasets which meet those minimums"
      />
      <DatasetsSelectedByExpression />
    </>
  );
}

export default Cells;
