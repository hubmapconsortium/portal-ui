import React from 'react';
import Button from '@material-ui/core/Button';
import SectionButtonRow, { BottomAlignedTypography } from './SectionButtonRow';

export default {
  title: 'Sections/SectionButtonRow',
  component: SectionButtonRow,
  argTypes: {
    buttons: {
      control: false,
    },
    leftText: {
      control: false,
    },
  },
};

const Template = (args) => <SectionButtonRow {...args} />;
export const Default = Template.bind({});
Default.args = {
  buttons: ['Right', 'Aligned', 'Buttons'].map((buttonText) => (
    <Button variant="contained" color="primary">
      {buttonText}
    </Button>
  )),
  leftText: <BottomAlignedTypography>Bottom Left Text</BottomAlignedTypography>,
};
