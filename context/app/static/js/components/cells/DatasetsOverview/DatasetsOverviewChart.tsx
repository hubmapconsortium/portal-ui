import React, { RefObject, useMemo, useRef, useState } from 'react';
import Description from 'js/shared-styles/sections/Description';
import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import ChartDropdown from 'js/shared-styles/charts/ChartDropdown';
import { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import {
  useBandScale,
  useLinearScale,
  useOrdinalScale,
  usePercentageYScaleFormat,
} from 'js/shared-styles/charts/hooks';
import GroupedBarStackChart from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalGroupedStackedBarChart';
import { LabeledPrimarySwitch } from 'js/shared-styles/switches';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';
import { useEventCallback } from '@mui/material/utils';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';
import Paper from '@mui/material/Paper';
import { useDownloadImage } from 'js/hooks/useDownloadImage';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import Box from '@mui/material/Box';
import {
  ageBucketLabels,
  DatasetsOverviewDigest,
  useAxisAndCompareBy,
  useFormattedOverviewChartData,
  X_AXIS_OPTIONS,
  XAxisOptions,
  Y_AXIS_OPTIONS,
  YAxisOptions,
} from './hooks';
import { OverviewChartTooltip } from './DatasetsOverviewChartTooltip';

interface DatasetsOverviewChartProps {
  matched: DatasetsOverviewDigest;
  indexed: DatasetsOverviewDigest;
  all: DatasetsOverviewDigest;
  trackingInfo?: EventInfo;
}

const margin = {
  top: 0,
  right: 0,
  bottom: 48,
  left: 0,
};

const graphMargin = {
  ...margin,
  top: 16,
  left: 48,
};

type StackKeys = 'matched' | 'unmatched';

const useDatasetsOverviewChartState = (chartRef: RefObject<HTMLElement>, trackingInfo?: EventInfo) => {
  const [yAxis, setYAxis] = useState<YAxisOptions>('Datasets');

  const onChangeYAxis = useEventCallback((e: SelectChangeEvent) => {
    setYAxis(e.target.value as YAxisOptions);
    if (trackingInfo) {
      const yAxisLabel = e.target.value as YAxisOptions;
      const actionName = 'Datasets Overview / Select Y-Axis';
      const actionlabel = `${yAxisLabel}`;
      trackEvent({
        ...trackingInfo,
        action: trackingInfo.action ? `${trackingInfo.action} / ${actionName}` : actionName,
        label: trackingInfo.label ? `${trackingInfo.label} ${actionlabel}` : actionlabel,
      } as EventInfo);
    }
  });

  const {
    axis: xAxis,
    setAxis: setXAxis,
    compareBy,
    setCompareBy,
    xAxisOptions,
    compareByOptions,
  } = useAxisAndCompareBy(X_AXIS_OPTIONS, 'Age', 'Sex');

  const onChangeXAxis = useEventCallback((e: SelectChangeEvent) => {
    setXAxis(e.target.value as XAxisOptions);
    if (trackingInfo) {
      const xAxisLabel = e.target.value as XAxisOptions;
      const actionName = 'Datasets Overview / Select X-Axis';
      const actionlabel = `${xAxisLabel}`;
      trackEvent({
        ...trackingInfo,
        action: trackingInfo.action ? `${trackingInfo.action} / ${actionName}` : actionName,
        label: trackingInfo.label ? `${trackingInfo.label} ${actionlabel}` : actionlabel,
      } as EventInfo);
    }
  });

  const onChangeCompareBy = useEventCallback((e: SelectChangeEvent) => {
    setCompareBy(e.target.value as XAxisOptions);
    if (trackingInfo) {
      const compareByLabel = e.target.value as XAxisOptions;
      const actionName = 'Datasets Overview / Select Grouping';
      const actionlabel = `${compareByLabel}`;
      trackEvent({
        ...trackingInfo,
        action: trackingInfo.action ? `${trackingInfo.action} / ${actionName}` : actionName,
        label: trackingInfo.label ? `${trackingInfo.label} ${actionlabel}` : actionlabel,
      } as EventInfo);
    }
  });

  // If the user selects "Compare to All", the chart will show the distribution of matched datasets all datasets
  // Otherwise, it will show the distribution of matched datasets against the indexed datasets
  const [compareToAll, setCompareToAll] = useState(false);
  const toggleCompareToAll = useEventCallback(() => {
    setCompareToAll((prev) => {
      if (trackingInfo) {
        const label = prev ? 'Indexed Datasets' : 'All Datasets';
        const actionName = 'Datasets Overview / Toggle Comparison Metric';
        trackEvent({
          ...trackingInfo,
          action: trackingInfo.action ? `${trackingInfo.action} / ${actionName}` : actionName,
          label: trackingInfo.label ? `${trackingInfo.label} ${label}` : label,
        } as EventInfo);
      }
      return !prev;
    });
  });

  // If the user selects "Percentage" for the Y axis, the chart will display the percentage of matched datasets within the category
  // Otherwise, it will display the absolute number of matched datasets
  const [percentMode, setPercentMode] = useState(false);
  const togglePercentMode = useEventCallback(() => {
    setPercentMode((prev) => {
      if (trackingInfo) {
        const label = prev ? 'Total Count' : 'Percentage';
        const actionName = 'Datasets Overview / Toggle Graph Type';
        trackEvent({
          ...trackingInfo,
          action: trackingInfo.action ? `${trackingInfo.action} / ${actionName}` : actionName,
          label: trackingInfo.label ? `${trackingInfo.label} ${label}` : label,
        } as EventInfo);
      }
      return !prev;
    });
  });

  const download = useDownloadImage(chartRef, `${xAxis} vs ${compareBy} - Datasets Overview`);

  const downloadImage = useEventCallback(() => {
    download();
    if (trackingInfo) {
      const actionName = 'Datasets Overview / Download Visualization';
      trackEvent({
        ...trackingInfo,
        action: trackingInfo.action ? `${trackingInfo.action} / ${actionName}` : actionName,
      } as EventInfo);
    }
  });

  return {
    yAxis,
    onChangeYAxis,
    xAxis,
    setXAxis,
    onChangeXAxis,
    compareBy,
    setCompareBy,
    xAxisOptions,
    compareByOptions,
    compareToAll,
    toggleCompareToAll,
    percentMode,
    togglePercentMode,
    onChangeCompareBy,
    downloadImage,
  };
};

export default function DatasetsOverviewChart({ matched, indexed, all, trackingInfo }: DatasetsOverviewChartProps) {
  const colors = useChartPalette();

  const chartRef = useRef<HTMLDivElement>(null);

  const {
    yAxis,
    xAxis,
    compareBy,
    onChangeCompareBy,
    xAxisOptions,
    compareByOptions,
    compareToAll,
    toggleCompareToAll,
    percentMode,
    togglePercentMode,
    onChangeYAxis,
    onChangeXAxis,
    downloadImage,
  } = useDatasetsOverviewChartState(chartRef, trackingInfo);

  const comparisonData = compareToAll ? all : indexed;

  // Given the selected settings, calculate the appropriate data for the chart
  // and the maximum value for the Y axis
  const { data, max } = useFormattedOverviewChartData(matched, comparisonData, xAxis, yAxis, compareBy, percentMode);

  const yAxisOptionLabelMap: Record<YAxisOptions, string> = useMemo(() => {
    return {
      Datasets: `Datasets (${matched.totalDatasets})`,
      Donors: `Donors (${matched.totalDonors})`,
    };
  }, [matched]);

  const compareByKeys = useMemo(() => {
    const comparison = compareToAll ? all : indexed;
    const keys = (() => {
      switch (compareBy) {
        case 'Age':
          return ageBucketLabels;
        case 'Race':
          return comparison.fullAggs?.donors_by_race.buckets.map((d) => d.key).sort() ?? [];
        case 'Sex':
          return comparison.fullAggs?.donors_by_sex.buckets.map((d) => d.key).sort() ?? [];
        case 'Organ':
          return comparison.fullAggs?.donors_by_organ.buckets.map((d) => d.key).sort() ?? [];
        default:
          console.error(`unknown comparison key type:`, compareBy);
          return [];
      }
    })();
    return keys;
  }, [compareBy, compareToAll, indexed, all]);

  const xAxisKeys = useMemo(() => {
    const comparison = compareToAll ? all : indexed;
    switch (xAxis) {
      case 'Age':
        return ageBucketLabels;
      case 'Race':
        return comparison.fullAggs?.donors_by_race.buckets.map((d) => d.key).sort() ?? [];
      case 'Sex':
        return comparison.fullAggs?.donors_by_sex.buckets.map((d) => d.key).sort() ?? [];
      case 'Organ':
        return comparison.fullAggs?.donors_by_organ.buckets.map((d) => d.key).sort() ?? [];
      default:
        console.error(`unknown x axis key type:`, xAxis);
        return [];
    }
  }, [xAxis, compareToAll, indexed, all]);

  const compareByColorKeys = useMemo(() => {
    return compareByKeys.map((key) => [`${key} matched`, `${key} unmatched`]).flat();
  }, [compareByKeys]);

  const xScale = useBandScale(xAxisKeys, { padding: 0.1 });
  const colorScale = useOrdinalScale(compareByColorKeys, {
    domain: compareByColorKeys,
    range: colors,
  });

  const yScaleDomain = useMemo(() => {
    if (percentMode) {
      return [0, 1];
    }
    return [0, max];
  }, [max, percentMode]);

  const yScale = useLinearScale(yScaleDomain, { nice: true });

  const yScaleFormat = usePercentageYScaleFormat(percentMode);

  const xAxisTickLabels = useMemo(() => {
    return data.map((d) => d.group);
  }, [data]);

  return (
    <>
      <Description>
        The chart below shows the distribution of HuBMAP datasets that are compatible with the scFind method. The
        distribution is based on the number of unique donors and the average age of donors in each dataset.
      </Description>
      <Paper>
        <ChartWrapper
          ref={chartRef}
          margin={margin}
          colorScale={colorScale}
          dividersInLegend={compareBy === 'Race'}
          additionalControls={
            <Stack direction="row" spacing={2} px={1} pt={1} alignItems="center" useFlexGap>
              <LabeledPrimarySwitch
                label="Comparison Metric"
                checked={compareToAll}
                onChange={toggleCompareToAll}
                color="success"
                disabledLabel="Indexed Datasets"
                enabledLabel="All Datasets"
                ariaLabel="Compare to All Datasets"
                tooltip="Toggle to compare matched datasets to scFind-indexed datasets or all datasets published in HuBMAP"
              />
              <LabeledPrimarySwitch
                label="Graph Type"
                value="percentMode"
                checked={percentMode}
                onChange={togglePercentMode}
                color="success"
                ariaLabel="Toggle Percentage Mode"
                disabledLabel="Total Count"
                enabledLabel="Percentage"
                tooltip="Toggle between displaying data as raw counts or fractions."
              />
              <Box ml="auto">
                <DownloadButton
                  onClick={downloadImage}
                  tooltip="Download chart as PNG"
                  aria-label="Download Chart as PNG"
                />
              </Box>
            </Stack>
          }
          dropdown={
            <ChartDropdown
              options={compareByOptions}
              value={compareBy}
              label="Compare by"
              onChange={onChangeCompareBy}
              fullWidth
              sx={{ minWidth: 'min(fit-content, 175px)', pr: 1 }}
            />
          }
          xAxisDropdown={
            <ChartDropdown options={xAxisOptions} value={xAxis} label="X-Axis" fullWidth onChange={onChangeXAxis} />
          }
          yAxisDropdown={
            <ChartDropdown
              options={Y_AXIS_OPTIONS}
              displayLabels={yAxisOptionLabelMap}
              value={yAxis}
              label="Y-Axis"
              fullWidth
              onChange={onChangeYAxis}
            />
          }
        >
          <GroupedBarStackChart<StackKeys, string, string>
            data={data}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            getX={(d) => d.group}
            margin={graphMargin}
            xAxisTickLabels={xAxisTickLabels}
            // Filter out any decimal values from the Y axis ticks if percentMode is disabled
            getTickValues={() => yScale.ticks(5).filter((d) => (percentMode ? d : Math.floor(d)) === d)}
            compareByKeys={compareByKeys}
            stackKeys={['matched', 'unmatched'] as const}
            yTickFormat={yScaleFormat}
            TooltipContent={OverviewChartTooltip(percentMode)}
          />
        </ChartWrapper>
      </Paper>
    </>
  );
}
