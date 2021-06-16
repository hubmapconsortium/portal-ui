import React from 'react';

import SectionPaper from './SectionPaper';
import { Default as DefaultLabelledSectionText } from '../LabelledSectionText/LabelledSectionText.stories';

export default {
  title: 'Sections/SectionPaper',
  component: SectionPaper,
};

const Template = (args) => <SectionPaper {...args} />;
export const Default = Template.bind({});
Default.args = {
  children: <DefaultLabelledSectionText {...DefaultLabelledSectionText.args} />,
};
