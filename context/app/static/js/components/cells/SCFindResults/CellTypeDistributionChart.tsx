import { Skeleton } from '@mui/material';
import useCellTypeCountForTissue from 'js/api/scfind/useCellTypeCountForTissue';
import React from 'react';

interface CellTypeDistributionChartProps {
  cellType: string;
}

export default function CellTypeDistributionChart({ cellType }: CellTypeDistributionChartProps) {
  const tissue = cellType.split('.')[0]; // Extract tissue from cellType

  const { data, isLoading } = useCellTypeCountForTissue({ tissue });

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={300} />;
  }

  if (!data) {
    return <div>No cell type distribution data available</div>;
  }

  return (
    <div>
      <h2>Cell Type Distribution Chart</h2>
      <p>Cell Type: {cellType}</p>
      <p>Tissue: {tissue}</p>
      <ul>
        {data.cellTypeCounts.map((cellTypeCount) => (
          <li key={cellTypeCount.index}>
            {cellTypeCount.index}: {cellTypeCount.cell_count}
          </li>
        ))}
      </ul>
      {/* Placeholder for chart rendering */}
      <p>Chart will be rendered here.</p>
      {/* Add your chart rendering logic here */}
    </div>
  );
}
