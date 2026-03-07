import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { DatasetIcon } from 'js/shared-styles/icons';
import { StyledIcon } from 'js/components/entity-tile/EntityTile/style';
import Tile from './Tile';

const meta = {
  title: 'Tiles/Tile',
  component: Tile,
} satisfies Meta<typeof Tile>;
export default meta;

type Story = StoryObj<typeof meta>;

// @ts-expect-error - styled-components component prop typing issue with MUI SvgIcon
const Icon = <StyledIcon component={DatasetIcon} />;

const sharedArgs = {
  href: '',
  icon: Icon,
  tileWidth: 310,
  ariaLabelText: 'Example tile',
};

export const Default: Story = {
  args: {
    ...sharedArgs,
    bodyContent: (
      <>
        <Tile.Title>Hello</Tile.Title>
        <Tile.Text>World</Tile.Text>
      </>
    ),
    footerContent: <Tile.Text>Footer</Tile.Text>,
  },
};

export const Inverted: Story = {
  args: {
    ...sharedArgs,
    bodyContent: (
      <>
        <Tile.Title>Hello</Tile.Title>
        <Tile.Text>World</Tile.Text>
      </>
    ),
    footerContent: <Tile.Text>Footer</Tile.Text>,
    invertColors: true,
  },
};

export const FooterDivider: Story = {
  args: {
    ...sharedArgs,
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
  },
};
