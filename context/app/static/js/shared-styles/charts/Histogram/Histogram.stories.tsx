import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import HistogramComponent from './Histogram';

const meta = {
  title: 'Charts/Histogram',
  component: HistogramComponent,
} satisfies Meta<typeof HistogramComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Histogram: Story = {
  args: {
    visxData: Array.from({ length: 40 }, () => Math.floor(Math.random() * 40)),
    margin: {
      top: 50,
      right: 50,
      left: 50,
      bottom: 50,
    },
    xAxisLabel: 'Value',
    yAxisLabel: 'Frequency',
    barColor: '#6C8938',
  },
  render: (args) => (
    <div style={{ width: 500, height: 500 }}>
      <HistogramComponent {...args} />
    </div>
  ),
};
