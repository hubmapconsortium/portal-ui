import React from 'react';
import Stack from '@mui/material/Stack';
import { TooltipData } from 'js/shared-styles/charts/types';
import { decimal, percent } from 'js/helpers/number-format';

interface DatasetOverviewTooltipDisplayProps {
  groupLabel: string;
  barKey: string;
  formattedMatched: string;
  formattedUnmatched: string;
}

function DatasetOverviewTooltipDisplay({
  groupLabel,
  barKey,
  formattedMatched,
  formattedUnmatched,
}: DatasetOverviewTooltipDisplayProps) {
  return (
    <Stack spacing={1}>
      <div>
        <strong>{groupLabel}</strong>
      </div>
      <div>
        <strong>{barKey}</strong>
      </div>
      <div>
        <strong>Matched:</strong> {formattedMatched}
      </div>
      <div>
        <strong>Unmatched:</strong> {formattedUnmatched}
      </div>
    </Stack>
  );
}

function TotalCountModeOverviewChartTooltip({
  tooltipData,
}: {
  tooltipData: TooltipData<{ matched: number; unmatched: number; group: string }>;
}) {
  if (!tooltipData.key) {
    return null;
  }
  if (!tooltipData.bar) {
    return <strong>{tooltipData.key}</strong>;
  }

  const { matched, unmatched } = tooltipData.bar.data;

  const formattedMatched = decimal.format(matched);
  const formattedUnmatched = decimal.format(unmatched);

  const { group } = tooltipData.bar.data;

  return (
    <DatasetOverviewTooltipDisplay
      groupLabel={group}
      barKey={tooltipData.key}
      formattedMatched={formattedMatched}
      formattedUnmatched={formattedUnmatched}
    />
  );
}

function PercentModeOverviewChartTooltip({
  tooltipData,
}: {
  tooltipData: TooltipData<{ matched: number; unmatched: number; group: string }>;
}) {
  if (!tooltipData.key) {
    return null;
  }
  if (!tooltipData.bar) {
    return <strong>{tooltipData.key}</strong>;
  }

  const { matched, unmatched } = tooltipData.bar.data;

  const formattedMatched = percent.format(matched);
  const formattedUnmatched = percent.format(unmatched);

  const group = tooltipData.bar?.data.group;

  return (
    <DatasetOverviewTooltipDisplay
      groupLabel={group}
      barKey={tooltipData.key}
      formattedMatched={formattedMatched}
      formattedUnmatched={formattedUnmatched}
    />
  );
}

export function OverviewChartTooltip(isPercentMode: boolean) {
  return isPercentMode ? PercentModeOverviewChartTooltip : TotalCountModeOverviewChartTooltip;
}
