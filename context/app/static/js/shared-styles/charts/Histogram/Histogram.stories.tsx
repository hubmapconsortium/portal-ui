import React from 'react';

import HistogramComponent from './Histogram';

export default {
  title: 'Charts/Histogram',
  component: HistogramComponent,
};

export function Histogram(args: any) {
  return <HistogramComponent {...args} />;
}
(Histogram as any).args = {
  parentWidth: 500,
  parentHeight: 500,
  visxData: Array.from({ length: 40 }, () => Math.floor(Math.random() * 40)),
  margin: {
    top: 50,
    right: 50,
    left: 50,
    bottom: 50,
  },
};
