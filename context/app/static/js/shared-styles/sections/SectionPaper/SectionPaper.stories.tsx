import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import LabelledSectionText from '../LabelledSectionText/LabelledSectionText';
import { Default as DefaultLabelledSectionText } from '../LabelledSectionText/LabelledSectionText.stories';
import SectionPaper from './SectionPaper';

const meta = {
  title: 'Sections/SectionPaper',
  component: SectionPaper,
} satisfies Meta<typeof SectionPaper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithExampleText: Story = {
  render: () => (
    <SectionPaper>
      <LabelledSectionText {...DefaultLabelledSectionText.args} />
    </SectionPaper>
  ),
};
