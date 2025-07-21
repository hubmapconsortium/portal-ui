import React from 'react';
import Stack from '@mui/material/Stack';
import { TooltipData } from 'js/shared-styles/charts/types';
import { decimal, percent } from 'js/helpers/number-format';

interface DatasetOverviewTooltipDisplayProps {
  groupLabel: string;
  formattedMatched: string;
  formattedUnmatched: string;
}

function DatasetOverviewTooltipDisplay({
  groupLabel,
  formattedMatched,
  formattedUnmatched,
}: DatasetOverviewTooltipDisplayProps) {
  return (
    <Stack spacing={1}>
      <div>
        <strong>{groupLabel}</strong>
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
  const matched = tooltipData.bar?.data.matched ?? 0;
  const unmatched = tooltipData.bar?.data.unmatched ?? 0;

  const formattedMatched = decimal.format(matched);
  const formattedUnmatched = decimal.format(unmatched);

  const group = tooltipData.bar?.data.group;

  const groupLabel = `${group} (${tooltipData.key})`;

  return (
    <DatasetOverviewTooltipDisplay
      groupLabel={groupLabel}
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
  const matched = tooltipData.bar?.data.matched ?? 0;
  const unmatched = tooltipData.bar?.data.unmatched ?? 0;

  const formattedMatched = percent.format(matched);
  const formattedUnmatched = percent.format(unmatched);

  const group = tooltipData.bar?.data.group;

  const groupLabel = `${group} (${tooltipData.key})`;

  return (
    <DatasetOverviewTooltipDisplay
      groupLabel={groupLabel}
      formattedMatched={formattedMatched}
      formattedUnmatched={formattedUnmatched}
    />
  );
}

export function OverviewChartTooltip(isPercentMode: boolean) {
  return isPercentMode ? PercentModeOverviewChartTooltip : TotalCountModeOverviewChartTooltip;
}
