import React, { useMemo, useState } from 'react';
import Description from 'js/shared-styles/sections/Description';
import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart';
import ChartDropdown from 'js/components/home/HuBMAPDatasetsChartDropdown';
import { X } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FormControlLabel, Switch, ToggleButton } from '@mui/material';
import { useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { DatasetsOverviewType } from './hooks';

interface DatasetsOverviewChartProps {
  matched: DatasetsOverviewType;
  indexed: DatasetsOverviewType;
  all: DatasetsOverviewType;
}

const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const MALE_NON_MATCH = '#d1dac1';
const MALE_MATCH = '#6c8938';
const FEMALE_NON_MATCH = '#c5c7cf';
const FEMALE_MATCH = '#444a65';

const Y_AXIS_OPTIONS = ['datasets', 'donors'] as const;
type YAxisOptions = (typeof Y_AXIS_OPTIONS)[number];

const X_AXIS_OPTIONS = ['age', 'race', 'sex'] as const;
type XAxisOptions = (typeof X_AXIS_OPTIONS)[number];

export default function DatasetsOverviewChart({ matched, indexed, all }: DatasetsOverviewChartProps) {
  const [yAxis, setYAxis] = useState<YAxisOptions>('datasets');
  const [xAxis, setXAxis] = useState<XAxisOptions>('age');
  const [compareBy, setCompareBy] = useState<XAxisOptions>('sex');

  // If the user selects "Compare to All", the chart will show the distribution of matched datasets all datasets
  // Otherwise, it will show the distribution of matched datasets against the indexed datasets
  const [compareToAll, setCompareToAll] = useState(false);

  // If the user selects "Percentage" for the Y axis, the chart will display the percentage of matched datasets within the category
  // Otherwise, it will display the absolute number of matched datasets
  const [percentMode, setPercentMode] = useState(false);

  const yAxisOptions: Record<YAxisOptions, string> = useMemo(() => {
    return {
      datasets: `Datasets (${matched.totalDatasets})`,
      donors: `Donors (${matched.totalDonors})`,
    };
  }, [matched]);

  const xAxisOptions = useMemo(() => {
    return X_AXIS_OPTIONS.filter((option) => option !== compareBy);
  }, [compareBy]);

  const compareByOptions = useMemo(() => {
    return X_AXIS_OPTIONS.filter((option) => option !== xAxis);
  }, [xAxis]);

  const colorScale = useOrdinalScale([], {
    domain: [],
    range: [],
  });

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
          <>
            <FormControlLabel
              control={
                <Switch
                  value="comparisonMetric"
                  checked={compareToAll}
                  onChange={() => setCompareToAll((prev) => !prev)}
                  color="success"
                />
              }
              label="Comparison Metric" // TODO: Add tooltip
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <Switch
                  value="percentMode"
                  checked={percentMode}
                  onChange={() => setPercentMode((prev) => !prev)}
                  color="success"
                />
              }
              label="Y-Axis" // TODO: Add tooltip
              labelPlacement="top"
            />
          </>
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
            options={Y_AXIS_OPTIONS} // TODO: Add display of number of datasets/donors to option labels
            value={yAxis}
            label="Y-Axis"
            fullWidth
            onChange={(e: SelectChangeEvent) => {
              setYAxis(e.target.value as YAxisOptions);
            }}
          />
        }
      >
        {/* <VerticalStackedBarChart
          visxData={[]}
          xScale={undefined}
          yScale={undefined}
          colorScale={colorScale}
          getX={function (d: unknown): string {
            throw new Error('Function not implemented.');
          }}
          keys={[]}
          margin={margin}
          xAxisLabel="" // Labels are on the dropdowns
          yAxisLabel="" // Labels are on the dropdowns
          xAxisTickLabels={[]}
        /> */}
      </ChartWrapper>
    </div>
  );
}
