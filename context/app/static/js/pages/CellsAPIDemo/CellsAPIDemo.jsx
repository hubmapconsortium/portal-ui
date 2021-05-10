import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';

import CellCountsForDatasets from './CellCountsForDatasets';
import CellExpressionInDataset from './CellExpressionInDataset';
import DatasetsSelectedByGene from './DatasetsSelectedByGene';

// eslint-disable-next-line no-unused-vars
function CellsAPIDemo(props) {
  return (
    <>
      <SectionHeader>Datasets selected by gene</SectionHeader>
      <DatasetsSelectedByGene />

      <SectionHeader>Cell counts for datasets</SectionHeader>
      <CellCountsForDatasets />

      <SectionHeader>Cell expression in dataset</SectionHeader>
      <CellExpressionInDataset />
    </>
  );
}

export default CellsAPIDemo;
