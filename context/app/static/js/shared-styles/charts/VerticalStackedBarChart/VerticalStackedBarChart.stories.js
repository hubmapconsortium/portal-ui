import React from 'react';
import { scaleLinear, scaleOrdinal, scaleBand } from '@visx/scale';

import VerticalStackedBarChart from './VerticalStackedBarChart';

export default {
  title: 'Charts/VerticalStackedBarChart',
  component: VerticalStackedBarChart,
  excludeStories: ['colorScale'],
};

const Template = (args) => (
  <div style={{ height: 500, width: 500 }}>
    <VerticalStackedBarChart {...args} />
  </div>
);
const yScale = scaleLinear({
  domain: [0, 13],
  nice: true,
});

const xScale = scaleBand({
  domain: [1, 2, 3, 4, 5],
  padding: 0.2,
});

export const colorScale = scaleOrdinal({
  domain: ['matched', 'unmatched'],
  range: ['#DA348A', '#6C8938'],
});

const sharedArgs = {
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
    top: 20,
    right: 10,
    left: 60,
    bottom: 200,
  },
  getX: (d) => d.cluster,
  xAxisLabel: 'Cluster',
  xAxisTickLabels: ['1', '2', '3', '4', '5'],
  yAxisLabel: 'Cell Count',
  chartTitle: 'Cluster Membership',
};

export const Basic = Template.bind({});
Basic.args = sharedArgs;

function Tooltip({ tooltipData }) {
  return (
    <>
      <p>Key: {tooltipData.key}</p>
      <p>Or anything else.</p>
    </>
  );
}

export const CustomTooltip = Template.bind({});
CustomTooltip.args = {
  ...sharedArgs,
  TooltipContent: Tooltip,
};
