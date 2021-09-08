import React from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';

import VerticalStackedBarChartComponent from './VerticalStackedBarChart';

export default {
  title: 'Charts/VerticalStackedBarChart',
  component: VerticalStackedBarChartComponent,
};

export const VerticalStackedBarChart = (args) => <VerticalStackedBarChartComponent {...args} />;
const yScale = scaleLinear({
  domain: [0, 13],
  nice: true,
});

const xScale = scaleBand({
  domain: [1, 2, 3, 4, 5],
  padding: 0.2,
});

const colorScale = scaleOrdinal({
  domain: ['matched', 'unmatched'],
  range: ['#DA348A', '#6C8938'],
});

VerticalStackedBarChart.args = {
  parentWidth: 500,
  parentHeight: 500,
  visxData: [
    {
      cluster: 1,
      matched: 3,
      unmatched: 5,
      total: 8,
    },
    {
      cluster: 2,
      matched: 5,
      unmatched: 2,
      total: 7,
    },
    {
      cluster: 3,
      matched: 3,
      unmatched: 9,
      total: 12,
    },
    {
      cluster: 4,
      matched: 0,
      unmatched: 6,
      total: 6,
    },
    {
      cluster: 5,
      matched: 7,
      unmatched: 6,
      total: 13,
    },
  ],
  yScale,
  xScale,
  colorScale,
  keys: ['matched', 'unmatched'],
  margin: {
    top: 50,
    right: 50,
    left: 100,
    bottom: 200,
  },
  getX: (d) => d.cluster,
};
VerticalStackedBarChart.storyName = 'VerticalStackedBarChart'; // needed for single story hoisting for multi word component names
