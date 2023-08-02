import React from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import DropdownListbox, { useSelectedDropdownIndex } from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart';
import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import DatasetClusterTooltip from 'js/components/cells/DatasetClusterTooltip';

import { getOptionLabels, addMatchedAndUnmatched } from './utils';

function DatasetClusterChart({ uuid, results }) {
  const [selectedClusterTypeIndex, setSelectedClusterTypeIndex] = useSelectedDropdownIndex(0);
  const theme = useTheme();

  const chartMargin = {
    top: 25,
    right: 50,
    left: 65,
    bottom: 100, // TODO: Fix height of chart and dropdown instead of compensating with extra bottom margin.
  };

  const selectedData = results[Object.keys(results)[selectedClusterTypeIndex]];

  const yScale = scaleLinear({
    domain: [0, Math.max(...selectedData.map((result) => result.matched + result.unmatched))],
    nice: true,
  });

  const xScale = scaleBand({
    domain: selectedData
      .sort((a, b) => addMatchedAndUnmatched(b) - addMatchedAndUnmatched(a))
      .map((d) => d.cluster_number),
    padding: 0.2,
  });

  const colorScale = scaleOrdinal({
    domain: ['matched', 'unmatched'],
    range: [theme.palette.warning.dark, theme.palette.warning.light],
  });

  const optionLabels = getOptionLabels(Object.keys(results), uuid);

  return (
    <ChartWrapper
      chartTitle="Cluster Membership"
      margin={chartMargin}
      colorScale={colorScale}
      dropdown={
        <div>
          <Typography>Cluster Method</Typography>
          <DropdownListbox
            id="bar-fill-dropdown"
            optionComponent={DropdownListboxOption}
            buttonComponent={Button}
            selectedOptionIndex={selectedClusterTypeIndex}
            options={Object.keys(results)}
            selectOnClick={setSelectedClusterTypeIndex}
            getOptionLabel={(option) => optionLabels[option]}
            buttonProps={{ variant: 'outlined' }}
          />
        </div>
      }
    >
      <VerticalStackedBarChart
        visxData={selectedData}
        yScale={yScale}
        xScale={xScale}
        colorScale={colorScale}
        getX={(x) => x.cluster_number}
        keys={['matched', 'unmatched']}
        margin={chartMargin}
        xAxisLabel="Cluster"
        yAxisLabel="Cell Set Size"
        TooltipContent={DatasetClusterTooltip}
        xAxisTickLabels={selectedData.map((d) => d.cluster_number)}
      />
    </ChartWrapper>
  );
}
export default DatasetClusterChart;
