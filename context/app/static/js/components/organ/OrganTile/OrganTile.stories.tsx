import type { Meta, StoryObj } from '@storybook/react';

import OrganTileComponent from './OrganTile';

const meta = {
  title: 'Tiles/OrganTile',
  component: OrganTileComponent,
} satisfies Meta<typeof OrganTileComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OrganTile: Story = {
  args: {
    organ: {
      name: 'Spleen',
      uberon_short: 'ABC123',
      uberon: 'UBERON:0002106',
      icon: 'https://cdn.jsdelivr.net/gh/cns-iu/md-icons@main/other-icons/organs/ico-organs-spleen.svg',
      asctb: '',
      description: '',
      has_iu_component: false,
      search: [],
      descendantCounts: { Dataset: 2 },
    },
  },
};
