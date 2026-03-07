import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import SectionButtonRow, { BottomAlignedTypography } from './SectionButtonRow';

const meta = {
  title: 'Sections/SectionButtonRow',
  component: SectionButtonRow,
  parameters: {
    docs: {
      description: {
        component: 'A right aligned button row often used above entity detail sections.',
      },
    },
  },
  argTypes: {
    buttons: {
      control: false,
    },
    leftText: {
      control: false,
    },
  },
} satisfies Meta<typeof SectionButtonRow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    buttons: ['Right', 'Aligned', 'Buttons'].map((buttonText) => (
      <Button variant="contained" color="primary" key={buttonText}>
        {buttonText}
      </Button>
    )),
    leftText: <BottomAlignedTypography>Bottom Left Text</BottomAlignedTypography>,
  },
};

export const WithoutLeftText: Story = {
  args: {
    leftText: null,
    buttons: ['Right', 'Aligned', 'Buttons'].map((buttonText) => (
      <Button variant="contained" color="primary" key={buttonText}>
        {buttonText}
      </Button>
    )),
  },
};
