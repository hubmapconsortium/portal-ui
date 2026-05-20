import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { HOME_TIMELINE_ITEMS } from 'js/components/home/Hero';
import Timeline from 'js/shared-styles/Timeline';

type TimelineProps = React.ComponentProps<typeof Timeline>;

function TimelineStory({ data }: TimelineProps) {
  return <Timeline data={data} />;
}

const meta = {
  title: 'Timeline/Timeline',
  component: TimelineStory,
} satisfies Meta<typeof TimelineStory>;

export const Default: StoryObj<typeof TimelineStory> = {
  args: {
    data: HOME_TIMELINE_ITEMS,
  },
};

export default meta;
