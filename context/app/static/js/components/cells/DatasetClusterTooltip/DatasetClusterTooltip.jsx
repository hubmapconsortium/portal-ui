import React from 'react';
import Typography from '@mui/material/Typography';

function DatasetClusterTooltip({ tooltipData }) {
  if (!('bar' in tooltipData)) {
    return (
      <Typography variant="h6" component="p" color="textPrimary">
        {tooltipData.key}
      </Typography>
    );
  }

  const { matched, unmatched, cluster_number } = tooltipData.bar.data;
  const matchedOrUnmatchedCount = tooltipData.bar.data[tooltipData.key];
  const percent = ((matchedOrUnmatchedCount / (matched + unmatched)) * 100).toFixed(2);
  return (
    <>
      <Typography variant="h6" component="p" color="textPrimary">
        Cluster {cluster_number}
      </Typography>
      <Typography color="textPrimary">
        {`${matchedOrUnmatchedCount} (${percent}%) cells ${tooltipData.key}.`}
      </Typography>
    </>
  );
}

export default DatasetClusterTooltip;
