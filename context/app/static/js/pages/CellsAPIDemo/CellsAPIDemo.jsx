import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { Alert } from 'js/shared-styles/alerts';

import CellCountsForDatasets from './CellCountsForDatasets';
import CellExpressionInDataset from './CellExpressionInDataset';
import DatasetsSelectedByGene from './DatasetsSelectedByGene';

// eslint-disable-next-line no-unused-vars
function CellsAPIDemo(props) {
  return (
    <>
      <Alert severity="warning">
        We&apos;ve gotten ahead of what the python client and the API server support, but this demonstrates what
        we&apos;re aiming for.
      </Alert>

      <SectionHeader>Datasets selected by gene</SectionHeader>
      <p>
        <b>Given</b> a gene, a minimum expression level, and a minimum percentage of cells at that expression level
      </p>
      <p>
        <b>Return</b> a list of UUIDs for datasets which meet those minimums
      </p>
      <DatasetsSelectedByGene />

      <SectionHeader>Cell counts for datasets</SectionHeader>
      <p>
        <b>Given</b> a list of dataset UUIDs, a gene, and a minimum expression level
      </p>
      <p>
        <b>Return</b> for each UUID the number of cells above that minimum, and the total number of cells
      </p>
      <CellCountsForDatasets />

      <SectionHeader>Cell expression in dataset</SectionHeader>
      <p>
        <b>Given</b> a dataset UUID and a gene
      </p>
      <p>
        <b>Return</b> the expression level of that gene for every cell in the dataset
      </p>
      <CellExpressionInDataset />
    </>
  );
}

export default CellsAPIDemo;
