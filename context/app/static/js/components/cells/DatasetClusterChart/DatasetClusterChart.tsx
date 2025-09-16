import React, { useMemo } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import DropdownListbox, { useSelectedDropdownIndex } from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart';
import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import DatasetClusterTooltip from 'js/components/cells/DatasetClusterTooltip';

import { useEventCallback } from '@mui/material/utils';
import Stack from '@mui/material/Stack';
import { getOptionLabels, addMatchedAndUnmatched } from './utils';
import { ClusterCellMatch } from '../CellsService';

interface DatasetClusterChartProps {
  uuid: string;
  results: Record<string, ClusterCellMatch[]>;
}

const useColorScale = () => {
  const theme = useTheme();
  return useMemo(
    () =>
      scaleOrdinal({
        domain: ['matched', 'unmatched'],
        range: [theme.palette.warning.dark, theme.palette.warning.light],
      }),
    [theme],
  );
};

const chartMargin = {
  top: 20,
  right: 20,
  left: 100,
  bottom: 20,
};

function DatasetClusterChart({ uuid, results }: DatasetClusterChartProps) {
  const [selectedClusterTypeIndex, setSelectedClusterTypeIndex] = useSelectedDropdownIndex(0);

  const selectedData = useMemo(() => {
    return results[Object.keys(results)[selectedClusterTypeIndex]];
  }, [results, selectedClusterTypeIndex]);

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

  const colorScale = useColorScale();

  const optionLabels = getOptionLabels(Object.keys(results), uuid);

  const selectOnClick = useEventCallback((selectedItem: { option: string; i: number }) => {
    setSelectedClusterTypeIndex(selectedItem.i);
  });

  return (
    <ChartWrapper
      chartTitle="Cluster Membership"
      margin={chartMargin}
      colorScale={colorScale}
      dropdown={
        <Stack direction="column">
          <Typography component="label">Cluster Method</Typography>
          <DropdownListbox
            id="bar-fill-dropdown"
            optionComponent={DropdownListboxOption}
            buttonComponent={Button}
            selectedOptionIndex={selectedClusterTypeIndex}
            options={Object.keys(results)}
            selectOnClick={selectOnClick}
            getOptionLabel={(option) => optionLabels[option]}
            buttonProps={{ variant: 'outlined' }}
          />
        </Stack>
      }
    >
      <VerticalStackedBarChart
        parentHeight={350}
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
