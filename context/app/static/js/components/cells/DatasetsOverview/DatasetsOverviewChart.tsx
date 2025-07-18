import React, { useMemo, useState } from 'react';
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

interface DatasetsOverviewChartProps {
  matched: DatasetsOverviewDigest;
  indexed: DatasetsOverviewDigest;
  all: DatasetsOverviewDigest;
}

const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const graphMargin = {
  ...margin,
  top: 16,
  left: 48,
};

const MALE_NON_MATCH = '#d1dac1';
const MALE_MATCH = '#6c8938';
const FEMALE_NON_MATCH = '#c5c7cf';
const FEMALE_MATCH = '#444a65';

export default function DatasetsOverviewChart({ matched, indexed, all }: DatasetsOverviewChartProps) {
  const [yAxis, setYAxis] = useState<YAxisOptions>('Datasets');

  const {
    axis: xAxis,
    setAxis: setXAxis,
    compareBy,
    setCompareBy,
    xAxisOptions,
    compareByOptions,
  } = useAxisAndCompareBy(X_AXIS_OPTIONS, 'Age', 'Sex');

  // If the user selects "Compare to All", the chart will show the distribution of matched datasets all datasets
  // Otherwise, it will show the distribution of matched datasets against the indexed datasets
  const [compareToAll, setCompareToAll] = useState(false);

  // If the user selects "Percentage" for the Y axis, the chart will display the percentage of matched datasets within the category
  // Otherwise, it will display the absolute number of matched datasets
  const [percentMode, setPercentMode] = useState(false);

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
    range: [MALE_MATCH, MALE_NON_MATCH, FEMALE_MATCH, FEMALE_NON_MATCH],
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
    <div>
      <Description>
        The chart below shows the distribution of HuBMAP datasets that are compatible with the scFind method. The
        distribution is based on the number of unique donors and the average age of donors in each dataset.
      </Description>
      <ChartWrapper
        margin={margin}
        colorScale={colorScale}
        additionalControls={
          <Stack direction="row" spacing={2} alignItems="center">
            <LabeledPrimarySwitch
              label="Comparison Metric"
              checked={compareToAll}
              onChange={() => setCompareToAll((prev) => !prev)}
              color="success"
              disabledLabel="Indexed Datasets"
              enabledLabel="All Datasets"
              ariaLabel="Compare to All Datasets"
            />
            <LabeledPrimarySwitch
              label="Y-Axis Mode"
              value="percentMode"
              checked={percentMode}
              onChange={() => setPercentMode((prev) => !prev)}
              color="success"
              ariaLabel="Toggle Percentage Mode"
              disabledLabel="Total Count"
              enabledLabel="Percentage"
            />
          </Stack>
        }
        dropdown={
          <ChartDropdown
            options={compareByOptions}
            value={compareBy}
            label="Compare by"
            onChange={(e: SelectChangeEvent) => setCompareBy(e.target.value as XAxisOptions)}
            fullWidth
          />
        }
        xAxisDropdown={
          <ChartDropdown
            options={xAxisOptions}
            value={xAxis}
            label="X-Axis"
            fullWidth
            onChange={(e: SelectChangeEvent) => {
              setXAxis(e.target.value as XAxisOptions);
            }}
          />
        }
        yAxisDropdown={
          <ChartDropdown
            options={Y_AXIS_OPTIONS}
            displayLabels={yAxisOptionLabelMap}
            value={yAxis}
            label="Y-Axis"
            fullWidth
            onChange={(e: SelectChangeEvent) => {
              setYAxis(e.target.value as YAxisOptions);
            }}
          />
        }
      >
        <GroupedBarStackChart
          data={data}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          getX={(d) => d.group}
          margin={graphMargin}
          xAxisLabel="" // Labels are on the dropdowns
          yAxisLabel="" // Labels are on the dropdowns
          xAxisTickLabels={xAxisTickLabels}
          getTickValues={() => yScale.ticks(5)}
          compareByKeys={compareByKeys}
          stackMemberKeys={['matched', 'unmatched']}
          yTickFormat={yScaleFormat}
        />
      </ChartWrapper>
    </div>
  );
}
