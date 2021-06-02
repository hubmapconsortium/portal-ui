import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { Alert } from 'js/shared-styles/alerts';

import CellPercentagesForDatasets from './CellPercentagesForDatasets';
import CellExpressionInDataset from './CellExpressionInDataset';
import DatasetsSelectedByGene from './DatasetsSelectedByGene';

// eslint-disable-next-line no-unused-vars
function CellsAPIDemo(props) {
  return (
    <>
      <Alert severity="warning">UI is still being designed, but we want to demonstrate that the API works.</Alert>

      <SectionHeader>Datasets selected by gene</SectionHeader>
      <p>
        <b>Given</b> a gene, a minimum expression level, and a minimum percentage of cells at that expression level
      </p>
      <p>
        <b>Return</b> a list of UUIDs for datasets which meet those minimums
      </p>
      <DatasetsSelectedByGene />

      <SectionHeader>Cell percentages for datasets</SectionHeader>
      <p>
        <b>Given</b> a list of dataset UUIDs, a gene, and a minimum expression level
      </p>
      <p>
        <b>Return</b> for each UUID the percentage of cells above that minimum
      </p>
      <p>
        (Getting counts of cells for each dataset is feasible, but would require multiple API calls. Requests with
        multiple UUIDs are failing on the backend: https://github.com/hubmapconsortium/cross_modality_query/issues/19)
      </p>
      <CellPercentagesForDatasets />

      <SectionHeader>Cell expression in dataset</SectionHeader>
      <p>
        <b>Given</b> a dataset UUID and a list of genes
      </p>
      <p>
        <b>Return</b> the expression level of those genes for every cell in the dataset
      </p>
      <CellExpressionInDataset />
    </>
  );
}

export default CellsAPIDemo;
