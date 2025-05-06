import { Dataset } from 'js/components/types';
import React from 'react';
import { SCFindCellTypesChart } from './CellTypesChart';

interface SCFindGeneChartsProps {
  dataset: Dataset;
}

function SCFindGeneExpressionLevelDistributionPlot({ dataset }: SCFindGeneChartsProps) {
  // Placeholder for the actual implementation
  return <div>SCFindGeneExpressionLevelDistributionPlot</div>;
}

export default function SCFindGeneCharts(dataset: Dataset) {
  return (
    <div>
      <SCFindGeneExpressionLevelDistributionPlot dataset={dataset} />
      <SCFindCellTypesChart {...dataset} />
    </div>
  );
}
