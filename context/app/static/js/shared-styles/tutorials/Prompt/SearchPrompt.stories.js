import React from 'react';

import PromptComponent from './Prompt';

export default {
  title: 'Tutorials/Prompt',
  component: PromptComponent,
};

export const Prompt = (args) => <PromptComponent {...args} />;
Prompt.args = {
  headerText: 'Tutorial Title',
  descriptionText: 'Welcome to the tutorial!',
  buttonText: 'Start the tutorial',
  buttonOnClick: () => {},
  buttonIsDisabled: false,
  closeOnClick: () => {},
};
Prompt.storyName = 'Prompt'; // needed for single story hoisting for multi word component names
