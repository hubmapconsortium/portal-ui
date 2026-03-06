import React from 'react';

import LabelledSectionDate from './LabelledSectionDate';
import LabelledSectionText from '../LabelledSectionText';

export default {
  title: 'Sections/LabelledSectionDate',
  component: LabelledSectionDate,
  subcomponents: { LabelledSectionText },
};

const sharedArgs = {
  label: 'Date Section',
  timestamp: Date.now(),
};

function Template(args: any) {
  return <LabelledSectionDate {...args} />;
}
export const Default = Template.bind({}) as any;
Default.args = sharedArgs;

export const DifferentDateFormat = Template.bind({}) as any;
DifferentDateFormat.args = { ...sharedArgs, dateFormat: 'MMMM dd, yyyy' };

export const UndefinedTimestamp = Template.bind({}) as any;
UndefinedTimestamp.args = { label: sharedArgs.label };
