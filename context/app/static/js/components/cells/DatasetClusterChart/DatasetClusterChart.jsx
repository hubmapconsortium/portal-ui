import React, { useState, useEffect, useRef } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalStackedBarChart';
import CellsService from 'js/components/cells/CellsService';

import { StyledSkeleton } from 'js/components/cells/CellsCharts/style';

function DatasetClusterChart({
  uuid,
  cellVariableName,
  minExpression,
  isLoading,
  finishLoading,
  loadingKey,
  isExpanded,
}) {
  const [results, setResults] = useState({});
  const [scales, setScales] = useState({});
  const [selectedClusterTypeIndex, setSelectedClusterTypeIndex] = useState(0);
  const theme = useTheme();
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (Object.keys(results).length) {
      const selectedData = results[Object.keys(results)[selectedClusterTypeIndex]];
      const yScale = scaleLinear({
        domain: [0, Math.max(...selectedData.map((result) => result.matched + result.unmatched))],
        nice: true,
      });

      const xScale = scaleBand({
        domain: selectedData.map((result) => result.cluster_number).sort((a, b) => a - b),
        padding: 0.2,
      });

      setScales({
        selectedData,
        yScale,
        xScale,
      });
      finishLoading(loadingKey);
    }
  }, [setScales, results, selectedClusterTypeIndex, finishLoading, loadingKey]);

  const colorScale = scaleOrdinal({
    domain: ['matched', 'unmatched'],
    range: [theme.palette.error.main, theme.palette.success.main],
  });

  useEffect(() => {
    async function fetchCellClusterMatches() {
      const response = await new CellsService().getClusterCellMatchesInDataset({
        uuid,
        cellVariableName,
        minExpression,
      });
      setResults(response);
    }
    if (loadedOnce.current) {
      return;
    }
    if (isExpanded) {
      fetchCellClusterMatches();
      loadedOnce.current = true;
    }
  }, [cellVariableName, isExpanded, minExpression, uuid]);

  function handleSelectClusterType({ i }) {
    setSelectedClusterTypeIndex(i);
  }

  if (Object.values(isLoading).some((val) => val)) {
    return <StyledSkeleton variant="rect" />;
  }

  return (
    <>
      <DropdownListbox
        id="bar-fill-dropdown"
        optionComponent={DropdownListboxOption}
        buttonComponent={Button}
        selectedOptionIndex={selectedClusterTypeIndex}
        options={Object.keys(results)}
        selectOnClick={handleSelectClusterType}
        getOptionLabel={(v) => v}
        buttonProps={{ variant: 'outlined' }}
      />
      <VerticalStackedBarChart
        visxData={scales.selectedData}
        yScale={scales.yScale}
        xScale={scales.xScale}
        colorScale={colorScale}
        getX={(x) => x.cluster_number}
        keys={['matched', 'unmatched']}
        margin={{
          top: 50,
          right: 50,
          left: 50,
          bottom: 60, // TODO: Fix height of chart and dropdown instead of compensating with extra bottom margin.
        }}
      />
    </>
  );
}
export default DatasetClusterChart;
