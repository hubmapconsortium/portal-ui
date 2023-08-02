import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import {
  Basic as BasicVerticalStackedBarChart,
  colorScale,
} from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalStackedBarChart.stories';
import ChartWrapper from './ChartWrapper';

export default {
  title: 'Charts/ChartWrapper',
  component: ChartWrapper,
};

const sharedArgs = {
  margin: BasicVerticalStackedBarChart.args.margin,
  colorScale,
  children: <BasicVerticalStackedBarChart {...BasicVerticalStackedBarChart.args} />,
};

export function Default(args) {
  return <ChartWrapper {...args} />;
}

Default.args = { ...sharedArgs, chartTitle: 'Chart With Legend' };

function Container(props) {
  const [chartTitle, setChartTitle] = useState('Chart with Dropdown A');

  function handleChange(event) {
    setChartTitle(event.target.value);
  }

  return (
    <ChartWrapper
      {...props}
      dropdown={
        <Select value={chartTitle} onChange={handleChange} label="Chart Title">
          <MenuItem value="Chart with Dropdown A">Chart with Dropdown A</MenuItem>
          <MenuItem value="Chart with Dropdown B">Chart with Dropdown B</MenuItem>
        </Select>
      }
      chartTitle={chartTitle}
    />
  );
}

export function WithDropdown(args) {
  return <Container {...args} />;
}
WithDropdown.args = {
  ...sharedArgs,
};
