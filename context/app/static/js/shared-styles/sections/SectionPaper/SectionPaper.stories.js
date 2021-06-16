import React from 'react';

import SectionPaper from './SectionPaper';
import { Default as DefaultLabelledSectionText } from '../LabelledSectionText/LabelledSectionText.stories';

export default {
  title: 'Sections/SectionPaper',
  component: SectionPaper,
};

export const Default = () => (
  <SectionPaper>
    <DefaultLabelledSectionText {...DefaultLabelledSectionText.args} />
  </SectionPaper>
);
