import React from 'react';

import OrganTileComponent from './OrganTile';

export default {
  title: 'Tiles/OrganTile',
  component: OrganTileComponent,
};

export function OrganTile(args) {
  return <OrganTileComponent {...args} />;
}
OrganTile.args = {
  organ: {
    name: 'Spleen',
    uberon_short: 'ABC123',
    icon: 'https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-spleen.svg',
    descendantCounts: { Dataset: 2 },
  },
};
OrganTile.storyName = 'OrganTile'; // needed for single story hoisting for multi word component names
