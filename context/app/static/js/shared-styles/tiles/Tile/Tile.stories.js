import React from 'react';

import { DatasetIcon } from 'js/shared-styles/icons';
import Tile from './Tile';

export default {
  title: 'Tile/Tile',
  component: Tile,
};

export const Default = (args) => (
  <Tile {...args}>
    <Tile.Title>Hello</Tile.Title>
    <Tile.BodyText>World</Tile.BodyText>
  </Tile>
);
Default.args = {
  href: '/',
  icon: DatasetIcon,
};
