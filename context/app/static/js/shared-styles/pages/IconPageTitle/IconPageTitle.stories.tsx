import type { Meta, StoryObj } from '@storybook/react';

import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import { DatasetIcon } from 'js/shared-styles/icons';

const meta = {
  title: 'Pages/IconPageTitle',
  component: IconPageTitle,
  subcomponents: { PageTitle },
} satisfies Meta<typeof IconPageTitle>;
export default meta;

type Story = StoryObj<typeof meta>;

const sharedArgs = {
  icon: DatasetIcon,
  children: 'Page Title',
};

export const Default: Story = {
  args: sharedArgs,
};

export const WithIconProps: Story = {
  args: { ...sharedArgs, iconProps: { color: 'secondary' } },
};
