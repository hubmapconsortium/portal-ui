import React from 'react';

import LabelledSectionText from './LabelledSectionText';

export default {
  title: 'Sections/LabelledSectionText',
  component: LabelledSectionText,
};

const Template = (args) => <LabelledSectionText {...args} />;
export const Default = Template.bind({});
Default.args = {
  label: 'Interesting Label',
  children:
    'Ut officia veniam Lorem sit velit occaecat aliqua velit consequat commodo ut. Laborum proident quis ipsum deserunt cillum incididunt ullamco irure ea aliqua sint aute. Nulla enim pariatur cupidatat sunt aute exercitation laborum non nostrud eu duis aute. Est esse deserunt laboris ea ad mollit labore. Non nulla pariatur culpa commodo ex occaecat non anim velit. Nulla esse aute elit ex veniam minim ullamco proident. Id officia cillum ex magna aute.',
};
