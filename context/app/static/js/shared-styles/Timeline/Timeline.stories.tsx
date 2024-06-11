import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { HOME_TIMELINE_ITEMS } from 'js/components/home/Hero';
import Timeline from 'js/shared-styles/Timeline';

function TimelineStory() {
  return <Timeline data={HOME_TIMELINE_ITEMS} />;
}

export default {
  title: 'Timeline',
  component: TimelineStory,
} satisfies Meta<typeof TimelineStory>;

export const Default: StoryObj<typeof TimelineStory> = {};
