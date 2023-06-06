import React from 'react';

import TutorialTooltip from './TutorialTooltip';
import TutorialProvider from '../TutorialProvider';

export default {
  title: 'Tutorials/TutorialTooltip',
  component: TutorialTooltip,
};

const sharedArgs = {
  step: {
    title: 'Step Title',
    content:
      'Reprehenderit voluptate culpa deserunt est ex esse ad ea reprehenderit laborum aute. Aute reprehenderit tempor sunt sit commodo fugiat minim aute. Consectetur consequat elit ea nisi pariatur et occaecat deserunt esse. Eiusmod est magna qui id in in qui. Reprehenderit exercitation do esse aliqua anim cupidatat consequat labore sint magna. Aliqua labore ullamco tempor Lorem. Proident aute dolore ad velit officia laboris do aute tempor do nulla ad aute cupidatat.',
    contentIsComponent: false,
  },
  tooltipProps: {},
  decrementStepOnClick: () => {},
  closeOnClick: () => {},
  incrementStepOnClick: () => {},
};

function Template(args) {
  return (
    <TutorialProvider>
      <TutorialTooltip {...args} />
    </TutorialProvider>
  );
}
export const InitialStep = Template.bind({});
InitialStep.args = {
  index: 0,
  isLastStep: false,
  size: 5,
  ...sharedArgs,
};

export const IntermediaryStep = Template.bind({});
IntermediaryStep.args = {
  index: 2,
  isLastStep: false,
  size: 5,
  ...sharedArgs,
};

export const LastStep = Template.bind({});
LastStep.args = {
  index: 4,
  isLastStep: true,
  size: 5,
  ...sharedArgs,
};
