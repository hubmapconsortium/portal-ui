import React from 'react';
import Typography from '@material-ui/core/Typography';

function DatasetClusterTooltip({ tooltipData }) {
  const { matched, unmatched, cluster_number } = tooltipData.bar.data;
  const matchedOrUnmatchedCount = tooltipData.bar.data[tooltipData.key];
  return (
    <>
      <Typography variant="h5" component="p" color="textPrimary">
        Cluster {cluster_number}
      </Typography>
      <Typography color="textPrimary">
        {`${matchedOrUnmatchedCount} (${((matchedOrUnmatchedCount / (matched + unmatched)) * 100).toFixed(2)}%) cells ${
          tooltipData.key
        }.`}
      </Typography>
    </>
  );
}

export default DatasetClusterTooltip;
