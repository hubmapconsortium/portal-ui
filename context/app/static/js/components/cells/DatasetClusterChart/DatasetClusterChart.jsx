import React, { useState, useEffect } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalStackedBarChart';
import CellsService from 'js/components/cells/CellsService';

function DatasetClusterChart({ uuid, geneName, minGeneExpression }) {
  const [results, setResults] = useState({});
  const [scales, setScales] = useState({});
  const [selectedClusterTypeIndex, setSelectedClusterTypeIndex] = useState(0);
  const theme = useTheme();

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

      const colorScale = scaleOrdinal({
        domain: ['matched', 'unmatched'],
        range: [theme.palette.error.main, theme.palette.success.main],
      });

      setScales({
        selectedData,
        yScale,
        xScale,
        colorScale,
      });
    }
  }, [setScales, results, selectedClusterTypeIndex]);

  useEffect(() => {
    async function fetchCellClusterMatches() {
      const response = await new CellsService().getClusterCellMatchesInDataset({
        uuid,
        geneName,
        minGeneExpression,
      });
      setResults(response);
    }
    fetchCellClusterMatches();
  }, [geneName, minGeneExpression, uuid]);

  function handleSelectClusterType({ i }) {
    setSelectedClusterTypeIndex(i);
  }

  return Object.keys(scales).length ? (
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
        parentWidth={500}
        parentHeight={500}
        visxData={scales.selectedData}
        yScale={scales.yScale}
        xScale={scales.xScale}
        colorScale={scales.colorScale}
        getX={(x) => x.cluster_number}
        keys={['matched', 'unmatched']}
        margin={{
          top: 50,
          right: 50,
          left: 50,
          bottom: 50,
        }}
      />
    </>
  ) : (
    <Typography>Please wait for cluster chart...</Typography>
  );
}

export default DatasetClusterChart;
