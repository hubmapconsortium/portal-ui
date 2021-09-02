import React, { useState, useEffect } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalStackedBarChart';
import CellsService from '../CellsService';

function DatasetClusterChart({ uuid, geneName, minGeneExpression }) {
  const [results, setResults] = useState({});
  const [scales, setScales] = useState({});
  const [diagnosticInfo, setDiagnosticInfo] = useState({});
  const [selectedClusterTypeIndex, setSelectedClusterTypeIndex] = useState(0);

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
        range: ['#DA348A', '#6C8938'],
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
      const t0 = performance.now();
      const response = await new CellsService().getClusterCellMatchesInDataset({
        uuid,
        geneName,
        minGeneExpression,
      });
      const t1 = performance.now();
      const timeWaiting = (t1 - t0) / 1000;
      const numCells = Object.values(response)
        .flat()
        .map(({ matched, unmatched }) => matched + unmatched)
        .reduce((a, b) => a + b);
      setDiagnosticInfo({ numCells, timeWaiting });
      setResults(response);
    }
    fetchCellClusterMatches();
  }, [geneName, minGeneExpression, uuid]);

  function handleSelectClusterType({ i }) {
    setSelectedClusterTypeIndex(i);
  }

  return Object.keys(scales).length ? (
    <>
      <Typography>
        {diagnosticInfo.timeWaiting.toFixed(2)} seconds to receive an API response for {diagnosticInfo.numCells} cells.
      </Typography>
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
