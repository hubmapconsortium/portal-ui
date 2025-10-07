import React from 'react';

import Typography from '@mui/material/Typography';
import { TooltipData, tooltipHasBarData, tooltipHasTickLabelData } from './types';
import { PropsWithChildren } from 'react';
import { capitalize } from '@mui/material/utils';

interface ChartTooltipProps<Datum> {
  tooltipData: TooltipData<Datum>;
}

interface InnerVariantTooltipProps<Datum> extends ChartTooltipProps<Datum>, PropsWithChildren {}

function BaseTooltipDisplay<Datum>({ tooltipData, children }: InnerVariantTooltipProps<Datum>) {
  return (
    <>
      <Typography variant="h6" component="p" color="textPrimary">
        {tooltipData.key}
      </Typography>
      {children}
    </>
  );
}

interface TickDataDisplayProps<Datum> extends ChartTooltipProps<Datum> {
  excludedKeys?: string[];
}

function TickDataDisplay<Datum>({ tooltipData, excludedKeys = [] }: TickDataDisplayProps<Datum>) {
  if (!tooltipHasTickLabelData(tooltipData)) {
    throw new Error('TickDataDisplay received tooltipData with malformed tick label data');
  }

  return (
    <BaseTooltipDisplay tooltipData={tooltipData}>
      {Object.entries(tooltipData.bar.data)
        .filter(([key, value]) => !excludedKeys?.includes(key) && value !== tooltipData.key)
        .map(([key, value]) => (
          <Typography key={key} variant="body2" component="p" color="textSecondary">
            {capitalize(key)}: {value}
          </Typography>
        ))}
    </BaseTooltipDisplay>
  );
}

function BarDataDisplay<Datum>({ tooltipData }: ChartTooltipProps<Datum>) {
  if (!tooltipHasBarData(tooltipData)) {
    throw new Error('BarDataDisplay received tooltipData with malformed bar data');
  }

  return (
    <BaseTooltipDisplay tooltipData={tooltipData}>
      {Object.entries(tooltipData.bar.data).map(([key, value]) => (
        <Typography key={key} variant="body2" component="p" color="textSecondary">
          {key}: {value}
        </Typography>
      ))}
    </BaseTooltipDisplay>
  );
}

interface OuterProps<Datum> extends TickDataDisplayProps<Datum> {
  TooltipContent?: React.ComponentType<{ tooltipData: TooltipData<Datum> }>;
}

export default function ChartTooltip<Datum>({ TooltipContent, tooltipData, excludedKeys }: OuterProps<Datum>) {
  if (!tooltipData) {
    return null;
  }

  if (TooltipContent) {
    return <TooltipContent tooltipData={tooltipData} />;
  }

  if (tooltipHasBarData(tooltipData)) {
    return <BarDataDisplay tooltipData={tooltipData} />;
  }

  if (tooltipHasTickLabelData(tooltipData)) {
    return <TickDataDisplay tooltipData={tooltipData} excludedKeys={excludedKeys} />;
  }
}
