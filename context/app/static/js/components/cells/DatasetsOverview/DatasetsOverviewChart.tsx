import React, { RefObject, useMemo, useRef, useState } from 'react';
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
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
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
  left: 36,
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

  // If "Show Comparison" is unchecked, the chart will only display matched datasets
  // Otherwise, it will show both matched and unmatched datasets
  const [showComparison, setShowComparison] = useState(false);
  const toggleShowComparison = useEventCallback(() => {
    setShowComparison((prev) => {
      if (trackingInfo) {
        const label = prev ? 'Hide Comparison' : 'Show Comparison';
        const actionName = 'Datasets Overview / Toggle Show Comparison';
        trackEvent({
          ...trackingInfo,
          action: trackingInfo.action ? `${trackingInfo.action} / ${actionName}` : actionName,
          label: trackingInfo.label ? `${trackingInfo.label} ${label}` : label,
        } as EventInfo);
      }
      return !prev;
    });
    // On disable of comparison, reset percentMode and compareToAll
    if (showComparison) {
      setPercentMode(false);
      setCompareToAll(false);
    }
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
    showComparison,
    toggleShowComparison,
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
    showComparison,
    toggleShowComparison,
    onChangeYAxis,
    onChangeXAxis,
    downloadImage,
  } = useDatasetsOverviewChartState(chartRef, trackingInfo);

  const comparisonData = compareToAll ? all : indexed;

  // Given the selected settings, calculate the appropriate data for the chart
  // and the maximum value for the Y axis
  const { data, max } = useFormattedOverviewChartData(
    matched,
    comparisonData,
    xAxis,
    yAxis,
    compareBy,
    percentMode,
    showComparison,
  );

  const yAxisOptionLabelMap: Record<YAxisOptions, string> = useMemo(() => {
    if (!showComparison) {
      return {
        Datasets: `Datasets (${matched.totalDatasets})`,
        Donors: `Donors (${matched.totalDonors})`,
      };
    }
    return {
      Datasets: `Datasets (${matched.totalDatasets} matched, ${comparisonData.totalDatasets} total)`,
      Donors: `Donors (${matched.totalDonors} matched, ${comparisonData.totalDonors} total)`,
    };
  }, [
    showComparison,
    matched.totalDatasets,
    matched.totalDonors,
    comparisonData.totalDatasets,
    comparisonData.totalDonors,
  ]);

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

  // Create color keys for both matched and unmatched, but map them to the same base colors
  const compareByColorKeys = useMemo(() => {
    return compareByKeys.map((key) => [`${key} matched`, `${key} unmatched`]).flat();
  }, [compareByKeys]);

  // Create color values that repeat the base colors for matched/unmatched pairs
  const colorValues = useMemo(() => {
    const baseColors = colors.slice(0, compareByKeys.length);
    return compareByKeys.map((_, index) => [baseColors[index], baseColors[index]]).flat();
  }, [compareByKeys, colors]);

  const xScale = useBandScale(xAxisKeys, { padding: 0.1 });
  const colorScale = useOrdinalScale(compareByColorKeys, {
    domain: compareByColorKeys,
    range: colorValues,
  });

  // Create a separate legend scale that only shows the base categories
  const legendColorScale = useOrdinalScale(compareByKeys, {
    domain: compareByKeys,
    range: colors.slice(0, compareByKeys.length),
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
    <Paper>
      <ChartWrapper
        ref={chartRef}
        margin={margin}
        colorScale={legendColorScale}
        dividersInLegend={compareBy === 'Race'}
        caption={
          <>
            This chart shows the distribution of HuBMAP datasets that are compatible with the scFind method. The
            distribution is based on the number of unique donors and the average age of donors in each dataset.
            {showComparison && (
              <> Striped segments represent matched datasets, while solid segments represent unmatched datasets.</>
            )}
          </>
        }
        additionalControls={
          <Stack direction="row" spacing={2} px={1} pt={1} alignItems="center" useFlexGap>
            <LabeledPrimarySwitch
              label="Plot Type"
              checked={showComparison}
              onChange={toggleShowComparison}
              color="success"
              disabledLabel="Matched Only"
              enabledLabel="With Comparison"
              ariaLabel="Show Comparison"
              tooltip="Toggle to show only matched datasets or include comparison with unmatched datasets"
            />
            <SecondaryBackgroundTooltip
              title={showComparison ? undefined : 'Set "Plot Type" to "With Comparison" to toggle these options'}
            >
              <Stack direction="row" spacing={2} alignItems="center" useFlexGap>
                <LabeledPrimarySwitch
                  label="Comparison Group"
                  checked={compareToAll}
                  onChange={toggleCompareToAll}
                  color={showComparison ? 'secondary' : 'success'}
                  disabledLabel="Indexed Data"
                  enabledLabel="All Data"
                  ariaLabel="Compare to All Data"
                  tooltip="Toggle to compare matched data to scFind-indexed data or all data in HuBMAP"
                  disabled={!showComparison}
                />
                <LabeledPrimarySwitch
                  label="Display As"
                  value="percentMode"
                  checked={percentMode}
                  onChange={togglePercentMode}
                  color={showComparison ? 'secondary' : 'success'}
                  ariaLabel="Toggle display as raw counts or percentage"
                  disabledLabel="Raw Counts"
                  enabledLabel="Compare Across Groups"
                  tooltip="Toggle between displaying data as raw counts or fractions."
                  disabled={!showComparison}
                />
              </Stack>
            </SecondaryBackgroundTooltip>
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
            sx={{ minWidth: 'max(fit-content, 175px)', pr: 1 }}
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
          yAxisLabel={yAxisOptionLabelMap[yAxis]}
          xAxisLabel={xAxis}
        />
      </ChartWrapper>
    </Paper>
  );
}
