import type { Meta, StoryObj } from '@storybook/react';

import LabelledSectionDate from './LabelledSectionDate';
import LabelledSectionText from '../LabelledSectionText';

const meta = {
  title: 'Sections/LabelledSectionDate',
  component: LabelledSectionDate,
  subcomponents: { LabelledSectionText },
} satisfies Meta<typeof LabelledSectionDate>;
export default meta;

type Story = StoryObj<typeof meta>;

const sharedArgs = {
  label: 'Date Section',
  timestamp: Date.now(),
};

export const Default: Story = {
  args: sharedArgs,
};

export const DifferentDateFormat: Story = {
  args: { ...sharedArgs, dateFormat: 'MMMM dd, yyyy' },
};

export const UndefinedTimestamp: Story = {
  args: { label: sharedArgs.label, timestamp: undefined as unknown as number },
};
