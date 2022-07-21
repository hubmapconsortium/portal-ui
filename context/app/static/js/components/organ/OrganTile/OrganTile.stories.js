import React from 'react';

import OrganTile from './OrganTile';

export default {
  title: 'Tiles/OrganTile',
  component: OrganTile,
};

const Template = (args) => <OrganTile {...args} />;
export const Default = Template.bind({});
Default.args = {
  organ: {
    name: 'Spleen',
    uberon_short: 'ABC123',
    icon: 'https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-spleen.svg',
    descendantCounts: { Dataset: 2 },
  },
};
