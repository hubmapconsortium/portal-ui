import React, { useState, useEffect } from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';

import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalStackedBarChart';
import CellsService from '../CellsService';

function DatasetClusterChart({ uuid, geneName, minGeneExpression }) {
  const [results, setResults] = useState({});
  const [scales, setScales] = useState({});

  useEffect(() => {
    if (Object.keys(results).length) {
      const selectedClusterType = Object.keys(results)[0];
      const yScale = scaleLinear({
        domain: [0, Math.max(...results[selectedClusterType].map((result) => result.matched + result.unmatched))],
        nice: true,
      });

      const xScale = scaleBand({
        domain: results[selectedClusterType].map((result) => result.cluster_number).sort((a, b) => a - b),
        padding: 0.2,
      });

      const colorScale = scaleOrdinal({
        domain: ['matched', 'unmatched'],
        range: ['#DA348A', '#6C8938'],
      });

      setScales({
        yScale,
        xScale,
        colorScale,
      });
    }
  }, [setScales, results]);

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

  return Object.keys(scales).length ? (
    <VerticalStackedBarChart
      parentWidth={500}
      parentHeight={500}
      visxData={results[Object.keys(results)[0]]}
      yScale={scales.yScale}
      xScale={scales.xScale}
      colorScale={scales.colorScale}
      getX={(x) => x.cluster_number}
      keys={['matched', 'unmatched']}
      margin={{
        top: 50,
        right: 50,
        left: 100,
        bottom: 200,
      }}
    />
  ) : (
    <div>Please wait...</div>
  );
}

export default DatasetClusterChart;
