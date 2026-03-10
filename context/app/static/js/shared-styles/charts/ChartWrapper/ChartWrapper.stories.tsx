import React, { ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalStackedBarChart';
import {
  Basic as BasicVerticalStackedBarChart,
  colorScale,
} from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalStackedBarChart.stories';
import ChartWrapper from './ChartWrapper';

const meta = {
  title: 'Charts/ChartWrapper',
  component: ChartWrapper,
} satisfies Meta<typeof ChartWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

const chartArgs = (BasicVerticalStackedBarChart.args ?? {}) as ComponentProps<typeof VerticalStackedBarChart>;
const margin = chartArgs.margin ?? { top: 20, right: 10, left: 60, bottom: 200 };

export const Default: Story = {
  args: {
    margin,
    colorScale,
    chartTitle: 'Chart With Legend',
  },
  render: (args) => (
    <ChartWrapper {...args}>
      <VerticalStackedBarChart {...chartArgs} />
    </ChartWrapper>
  ),
};

function Container(props: ComponentProps<typeof ChartWrapper>) {
  const [chartTitle, setChartTitle] = useState('Chart with Dropdown A');

  function handleChange(event: SelectChangeEvent) {
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

export const WithDropdown: Story = {
  args: {
    margin,
    colorScale,
  },
  render: (args) => (
    <Container {...args}>
      <VerticalStackedBarChart {...chartArgs} />
    </Container>
  ),
};
