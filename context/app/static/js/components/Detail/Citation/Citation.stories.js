import React from 'react';

import Citation from './Citation';

export default {
  title: 'EntityDetail/Citation',
  component: Citation,
};

const Template = (args) => <Citation {...args} />;
export const Default = Template.bind({});
Default.args = {
  contributors: [
    { last_name: 'Aanders', first_name: 'Aanne' },
    { last_name: 'Banders', first_name: 'Banne' },
    { last_name: 'Canders', first_name: 'Canne' },
  ],
  citationTitle: 'Something Science-y',
  createTimestamp: 1520153805000,
  doi: 'fakeDoi',
  doi_url: 'https://www.doi.org/',
};
