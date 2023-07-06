import React from 'react';

import SectionFooter from './SectionFooter';

export default {
  title: 'Sections/SectionFooter',
  component: SectionFooter,
};

export const Basic = {
  args: {
    items: [
      { key: '1', component: <>Item 1</> },
      { key: '2', component: <>Item 2</> },
    ],
  },
};
