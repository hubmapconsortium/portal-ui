import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { TooltipData } from 'js/shared-styles/charts/types';
import { BarStackValues } from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalGroupedStackedBarChart';

interface DonorChartTooltipProps {
  tooltipData: TooltipData<BarStackValues<'count'> & { group: string }>;
}

/**
 * Custom tooltip component for donor diversity charts.
 * Displays the X-axis group (e.g., age range or blood type),
 * the comparison category (e.g., race or sex), and the donor count.
 */
export default function DonorChartTooltip({ tooltipData }: DonorChartTooltipProps) {
  if (!tooltipData.key || !tooltipData.bar) {
    return null;
  }

  const { count, group } = tooltipData.bar.data;

  // The key is the comparison category (e.g., "White", "Male")
  const category = tooltipData.key;

  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2" component="p" fontWeight="bold">
        {group}
      </Typography>
      <Typography variant="body2" component="p" color="textSecondary">
        {category}
      </Typography>
      <Typography variant="body2" component="p" color="textSecondary">
        <strong>Count:</strong> {count}
      </Typography>
    </Stack>
  );
}
