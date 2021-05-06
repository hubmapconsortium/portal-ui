import React from 'react';

import CellCountsForDatasets from './CellCountsForDatasets';
import CellExpressionInDataset from './CellExpressionInDataset';
import DatasetsSelectedByGene from './DatasetsSelectedByGene';

// eslint-disable-next-line no-unused-vars
function CellsAPIDemo(props) {
  return (
    <>
      <DatasetsSelectedByGene />
      <CellCountsForDatasets />
      <CellExpressionInDataset />
    </>
  );
}

export default CellsAPIDemo;
