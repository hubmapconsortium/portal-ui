import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { ExternalLinkIcon, SupportIcon, EmailIcon } from 'js/shared-styles/icons';
import IconLink, { IconLinkProps } from './IconLink';

const testIcons = {
  ExternalLinkIcon: <ExternalLinkIcon />,
  SupportIcon: <SupportIcon />,
  EmailIcon: <EmailIcon />,
};

const testIconNames = Object.keys(testIcons) as (keyof typeof testIcons)[];

interface TemplateProps extends IconLinkProps {
  iconName: keyof typeof testIcons;
  iconPosition: 'left' | 'right';
}

function IconLinkTemplate({ iconPosition, isOutbound, iconName, ...rest }: TemplateProps) {
  return (
    <div>
      <IconLink {...rest} icon={testIcons[iconName]} iconOnLeft={iconPosition === 'left'} isOutbound={isOutbound} />
    </div>
  );
}

type IconLinkStory = StoryObj<TemplateProps>;

const meta = {
  title: 'Links/IconLink',
  component: IconLinkTemplate,
  argTypes: {
    iconName: {
      options: testIconNames,
      control: {
        type: 'select',
      },
    },
    iconPosition: {
      control: { type: 'inline-radio' },
      options: ['left', 'right'],
    },
    isOutbound: {
      control: { type: 'boolean' },
    },
    children: {
      control: { type: 'text' },
    },
    href: {
      control: { type: 'text' },
    },
  },
  args: {
    iconName: testIconNames[0],
    iconPosition: 'left',
    isOutbound: true,
    children: 'Icon Link',
    href: '#example',
  },
} satisfies Meta<typeof IconLinkTemplate>;

type Story = StoryObj<IconLinkStory>;

export const Start: Story = {
  args: {
    iconName: testIconNames[0],
    iconPosition: 'left',
    children: 'Icon at Start',
    href: '#example',
    isOutbound: true,
  },
};

export const End: Story = {
  args: {
    iconName: testIconNames[0],
    iconPosition: 'right',
    children: 'Icon at End',
    href: '#example',
    isOutbound: true,
  },
};

export default meta;
