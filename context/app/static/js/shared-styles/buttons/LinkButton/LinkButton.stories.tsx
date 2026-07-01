import type { Meta, StoryObj } from '@storybook/react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LinkButton from './LinkButton';

const meta = {
  title: 'Buttons/LinkButton',
  component: LinkButton,
  parameters: {
    docs: {
      description: {
        component: 'A button with the appearance of a link.',
      },
    },
  },
} satisfies Meta<typeof LinkButton>;
export default meta;

type Story = StoryObj<typeof meta>;

const sharedArgs = {
  onClick: () => {},
};

export const Default: Story = {
  args: { ...sharedArgs, children: 'Default Link Button' },
};

export const OutboundIconLinkButton: Story = {
  args: {
    ...sharedArgs,
    children: 'Outbound Icon Link Button',
    linkComponent: OutboundIconLink,
  },
};
