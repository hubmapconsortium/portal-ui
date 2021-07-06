import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { Alert } from 'js/shared-styles/alerts';

import SearchBySubstring from './SearchBySubstring';
import CellPercentagesForDatasets from './CellPercentagesForDatasets';
import CellExpressionInDataset from './CellExpressionInDataset';
import DatasetsSelectedByExpression from './DatasetsSelectedByExpression';

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

// eslint-disable-next-line no-unused-vars
function CellsAPIDemo(props) {
  return (
    <>
      <Alert severity="warning">UI is still being designed, but we want to demonstrate that the API works.</Alert>

      <About
        title="Search genes by substring"
        given="a substring from a gene name"
        returns="a list of the first few matches"
      />
      <SearchBySubstring targetEntity="genes" />

      <About
        title="Search proteins by substring"
        given="a substring from a protein name"
        returns="a list of the first few matches"
      />
      <SearchBySubstring targetEntity="proteins" />

      <About
        title="Datasets selected by expression"
        given="a gene, a minimum expression level, and a minimum percentage of cells at that expression level"
        returns="a list of UUIDs for datasets which meet those minimums"
      />
      <DatasetsSelectedByExpression />

      <About
        title="Cell percentages for datasets"
        given="a list of dataset UUIDs, a gene, and a minimum expression level"
        returns="for each UUID the percentage of cells above that minimum"
      />
      <CellPercentagesForDatasets />

      <About
        title="Cell expression in dataset"
        given="a dataset UUID and a list of genes"
        returns="the expression level of those genes for every cell in the dataset"
      />
      <CellExpressionInDataset />
    </>
  );
}

export default CellsAPIDemo;
