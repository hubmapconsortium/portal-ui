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

const Template = (args) => <LabelledSectionDate {...args} />;
export const Default = Template.bind({});
Default.args = sharedArgs;

export const DifferentDateFormat = Template.bind({});
DifferentDateFormat.args = { ...sharedArgs, dateFormat: 'MMMM dd, yyyy' };
