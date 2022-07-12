import React from 'react';

import { DatasetIcon } from 'js/shared-styles/icons';
import Tile from './Tile';

export default {
  title: 'Tile/Tile',
  component: Tile,
};

const Template = (args) => <Tile {...args} />;
export const Default = Template.bind({});
Default.args = {
  href: '',
  icon: DatasetIcon,
  bodyContent: (
    <>
      <Tile.Title>Hello</Tile.Title>
      <Tile.Text>World</Tile.Text>
    </>
  ),
  footerContent: <Tile.Text>Footer</Tile.Text>,
};

export const Inverted = Template.bind({});
Inverted.args = {
  href: '',
  icon: DatasetIcon,
  bodyContent: (
    <>
      <Tile.Title>Hello</Tile.Title>
      <Tile.Text>World</Tile.Text>
    </>
  ),
  footerContent: <Tile.Text>Footer</Tile.Text>,
  invertColors: true,
};

export const FooterDivider = Template.bind({});
FooterDivider.args = {
  href: '',
  icon: DatasetIcon,
  bodyContent: (
    <>
      <Tile.Title>Hello</Tile.Title>
      <Tile.Text>World</Tile.Text>
    </>
  ),
  footerContent: (
    <>
      <Tile.Text>Footer 1</Tile.Text>
      <Tile.Divider />
      <Tile.Text>Footer 1</Tile.Text>
    </>
  ),
};
