import React from 'react';

import { DatasetIcon } from 'js/shared-styles/icons';
import { StyledIcon } from 'js/components/entity-tile/EntityTile/style';
import Tile from './Tile';

export default {
  title: 'Tiles/Tile',
  component: Tile,
};

// @ts-expect-error - styled-components component prop typing issue with MUI SvgIcon
const Icon = <StyledIcon component={DatasetIcon} />;

function Template(args: any) {
  return <Tile {...args} />;
}
export const Default = Template.bind({}) as any;
Default.args = {
  href: '',
  icon: Icon,
  bodyContent: (
    <>
      <Tile.Title>Hello</Tile.Title>
      <Tile.Text>World</Tile.Text>
    </>
  ),
  footerContent: <Tile.Text>Footer</Tile.Text>,
};

export const Inverted = Template.bind({}) as any;
Inverted.args = {
  href: '',
  icon: Icon,
  bodyContent: (
    <>
      <Tile.Title>Hello</Tile.Title>
      <Tile.Text>World</Tile.Text>
    </>
  ),
  footerContent: <Tile.Text>Footer</Tile.Text>,
  invertColors: true,
};

export const FooterDivider = Template.bind({}) as any;
FooterDivider.args = {
  href: '',
  icon: Icon,
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
