import React from 'react';
import Button from '@mui/material/Button';
import SectionButtonRow, { BottomAlignedTypography } from './SectionButtonRow';

export default {
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
};

function Template(args: any) {
  return <SectionButtonRow {...args} />;
}

export const Default = Template.bind({}) as any;
Default.args = {
  buttons: ['Right', 'Aligned', 'Buttons'].map((buttonText) => (
    <Button variant="contained" color="primary" key={buttonText}>
      {buttonText}
    </Button>
  )),
  leftText: <BottomAlignedTypography>Bottom Left Text</BottomAlignedTypography>,
};

export const WithoutLeftText = Template.bind({}) as any;
WithoutLeftText.args = {
  buttons: ['Right', 'Aligned', 'Buttons'].map((buttonText) => (
    <Button variant="contained" color="primary" key={buttonText}>
      {buttonText}
    </Button>
  )),
};
