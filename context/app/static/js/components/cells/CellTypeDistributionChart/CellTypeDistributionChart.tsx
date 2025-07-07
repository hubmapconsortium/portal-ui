import Skeleton from '@mui/material/Skeleton';
import useCellTypeCountForTissue from 'js/api/scfind/useCellTypeCountForTissue';

import React from 'react';
import Description from 'js/shared-styles/sections/Description';
import FractionGraph from './FractionGraph';

interface CellTypeDistributionChartProps {
  tissue: string;
  cellTypes: string[];
  skipDescription?: boolean;
}

export default function CellTypeDistributionChart({
  tissue,
  cellTypes,
  skipDescription,
}: CellTypeDistributionChartProps) {
  const { data, isLoading } = useCellTypeCountForTissue({ tissue });

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={300} />;
  }

  if (!data) {
    return <div>No cell type distribution data available</div>;
  }

  const graph = <FractionGraph data={data.cellTypeCounts} tissue={tissue} targetCellTypes={cellTypes} />;

  if (skipDescription) {
    return graph;
  }

  return (
    <div>
      <Description>
        The bar below shows the distribution of cell types in the {tissue} tissue. The distribution is based on the
        number of cells annotated in HuBMAP datasets and indexed by scFind.
      </Description>
      {graph}
    </div>
  );
}
