import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import ExpandableRow from './ExpandableRow';

const meta = {
  title: 'Tables/ExpandableRow',
  component: ExpandableRow,
} satisfies Meta<typeof ExpandableRow>;
export default meta;

type Story = StoryObj<typeof meta>;

function Content({ heightRef }: { heightRef: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={heightRef}>
      Mollit irure sit fugiat eiusmod ullamco laborum. Deserunt aliqua nulla occaecat reprehenderit est cupidatat ex
      laborum. Occaecat ipsum anim dolore anim ut velit irure exercitation sunt. Incididunt pariatur dolore ut duis. Eu
      nulla ut amet irure deserunt eiusmod aliqua fugiat labore.
    </div>
  );
}

const sharedArgs = {
  numCells: 4,
  expandedContent: <Content heightRef={null} />,
};

export const Default: Story = {
  args: sharedArgs,
  render: (args) => (
    <ExpandableRow {...args}>
      <ExpandableRowCell>A</ExpandableRowCell>
      <ExpandableRowCell>B</ExpandableRowCell>
      <ExpandableRowCell>C</ExpandableRowCell>
    </ExpandableRow>
  ),
};

export const Disabled: Story = {
  args: {
    ...sharedArgs,
    disabled: true,
  },
  render: (args) => (
    <ExpandableRow {...args}>
      <ExpandableRowCell>A</ExpandableRowCell>
      <ExpandableRowCell>B</ExpandableRowCell>
      <ExpandableRowCell>C</ExpandableRowCell>
    </ExpandableRow>
  ),
};

export const DisabledWithTooltip: Story = {
  args: {
    ...sharedArgs,
    disabled: true,
    disabledTooltipTitle: "Can't open now.",
  },
  render: (args) => (
    <ExpandableRow {...args}>
      <ExpandableRowCell>A</ExpandableRowCell>
      <ExpandableRowCell>B</ExpandableRowCell>
      <ExpandableRowCell>C</ExpandableRowCell>
    </ExpandableRow>
  ),
};
