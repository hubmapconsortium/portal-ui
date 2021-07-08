import React from 'react';
import Button from '@material-ui/core/Button';
import SectionButtonRowComponent, { BottomAlignedTypography } from './SectionButtonRow';

export default {
  title: 'Sections/SectionButtonRow',
  component: SectionButtonRowComponent,
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

export const SectionButtonRow = (args) => <SectionButtonRowComponent {...args} />;
SectionButtonRow.args = {
  buttons: ['Right', 'Aligned', 'Buttons'].map((buttonText) => (
    <Button variant="contained" color="primary">
      {buttonText}
    </Button>
  )),
  leftText: <BottomAlignedTypography>Bottom Left Text</BottomAlignedTypography>,
};
SectionButtonRow.storyName = 'SectionButtonRow'; // needed for single story hoisting for multi word component names
