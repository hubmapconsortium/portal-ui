import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Citation } from 'js/components/detailPage/Citation/Citation.stories';
import SummaryBody from './SummaryBody';

type Args = React.ComponentProps<typeof SummaryBody>;

function Template(args: Args) {
  return <SummaryBody {...args} />;
}

const meta = {
  title: 'EntityDetail/Summary/SummaryBody',
  component: Template,
} satisfies Meta<typeof Template>;

export default meta;

const sharedArgs = {
  created_timestamp: Date.now(),
  last_modified_timestamp: Date.now(),
};

const description =
  'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.';

export const Default: StoryObj<typeof Template> = {
  args: sharedArgs,
};

export const WithDescription: StoryObj<typeof Template> = {
  args: {
    ...sharedArgs,
    description,
  },
};

export const WithCitation: StoryObj<typeof Template> = {
  args: {
    ...sharedArgs,
    description,
    ...Citation.args,
  },
};

export const WithCollectionName: StoryObj<typeof Template> = {
  args: {
    ...sharedArgs,
    description,
    collectionName: 'Fake Collection Name',
  },
};
