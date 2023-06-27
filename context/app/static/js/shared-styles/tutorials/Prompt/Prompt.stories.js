import React from 'react';

import PromptComponent from './Prompt';
import TutorialProvider from '../TutorialProvider';

export default {
  title: 'Tutorials/Prompt',
  component: PromptComponent,
};

export function Prompt(args) {
  return (
    <TutorialProvider>
      <PromptComponent {...args} />
    </TutorialProvider>
  );
}
Prompt.args = {
  headerText: 'Tutorial Title',
  descriptionText: 'Welcome to the tutorial!',
  buttonText: 'Start the tutorial',
  buttonIsDisabled: false,
};
Prompt.storyName = 'Prompt'; // needed for single story hoisting for multi word component names
