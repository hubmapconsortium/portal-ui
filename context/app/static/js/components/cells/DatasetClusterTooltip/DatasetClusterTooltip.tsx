import React from 'react';
import Typography from '@mui/material/Typography';
import { TooltipData } from 'js/shared-styles/charts/types';
import { ClusterCellMatch } from '../CellsService';

function DatasetClusterTooltip({ tooltipData }: { tooltipData: TooltipData<ClusterCellMatch> }) {
  if (!tooltipData.bar) {
    return (
      <Typography variant="h6" component="p" color="textPrimary">
        {tooltipData.key}
      </Typography>
    );
  }

  const { matched, unmatched, cluster_number } = tooltipData.bar.data;
  const key = tooltipData.key ?? '';
  const matchedOrUnmatchedCount = key === 'matched' ? matched : unmatched;
  const percent = ((matchedOrUnmatchedCount / (matched + unmatched)) * 100).toFixed(2);
  return (
    <>
      <Typography variant="h6" component="p" color="textPrimary">
        Cluster {cluster_number}
      </Typography>
      <Typography color="textPrimary">{`${matchedOrUnmatchedCount} (${percent}%) cells ${key}.`}</Typography>
    </>
  );
}

export default DatasetClusterTooltip;
