import React from 'react';

import Histogram from './Histogram';

export default {
  title: 'Charts/Histogram',
  component: Histogram,
};

const Template = (args) => <Histogram {...args} />;
export const Default = Template.bind({});
Default.args = {
  parentWidth: 500,
  parentHeight: 500,
  visxData: Array.from({ length: 40 }, () => Math.floor(Math.random() * 40)),
  margin: {
    top: 50,
    right: 50,
    left: 100,
    bottom: 200,
  },
};
