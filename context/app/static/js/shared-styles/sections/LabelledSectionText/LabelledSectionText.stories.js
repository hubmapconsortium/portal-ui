import React from 'react';

import LabelledSectionText from './LabelledSectionText';

export default {
  title: 'Sections/LabelledSectionText',
  component: LabelledSectionText,
};

export function Default(args) {
  return (
    <LabelledSectionText {...args}>
      Ut officia veniam Lorem sit velit occaecat aliqua velit consequat commodo ut. Laborum proident quis ipsum deserunt
      cillum incididunt ullamco irure ea aliqua sint aute. Nulla enim pariatur cupidatat sunt aute exercitation laborum
      non nostrud eu duis aute. Est esse deserunt laboris ea ad mollit labore. Non nulla pariatur culpa commodo ex
      occaecat non anim velit. Nulla esse aute elit ex veniam minim ullamco proident. Id officia cillum ex magna aute.
    </LabelledSectionText>
  );
}
Default.args = {
  label: 'Interesting Label',
};

export function WithIcon(args) {
  return (
    <LabelledSectionText {...args}>
      Ut officia veniam Lorem sit velit occaecat aliqua velit consequat commodo ut. Laborum proident quis ipsum deserunt
      cillum incididunt ullamco irure ea aliqua sint aute. Nulla enim pariatur cupidatat sunt aute exercitation laborum
      non nostrud eu duis aute. Est esse deserunt laboris ea ad mollit labore. Non nulla pariatur culpa commodo ex
      occaecat non anim velit. Nulla esse aute elit ex veniam minim ullamco proident. Id officia cillum ex magna aute.
    </LabelledSectionText>
  );
}
WithIcon.args = {
  label: 'Interesting Label',
  iconTooltipText: 'Interesting Icon',
};
