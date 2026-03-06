import React from 'react';

import SectionPaper from './SectionPaper';
import { Default as DefaultLabelledSectionText } from '../LabelledSectionText/LabelledSectionText.stories';

export default {
  title: 'Sections/SectionPaper',
  component: SectionPaper,
};

export function Default() {
  return <SectionPaper />;
}

export function WithExampleText() {
  return (
    <SectionPaper>
      <DefaultLabelledSectionText {...DefaultLabelledSectionText.args} />
    </SectionPaper>
  );
}
