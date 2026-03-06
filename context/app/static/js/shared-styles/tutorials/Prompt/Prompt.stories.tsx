import React from 'react';

import { LinkPrompt } from './Prompt';

export default {
  title: 'Tutorials/Prompt',
  component: LinkPrompt,
};

export function Prompt(args: any) {
  return <LinkPrompt {...args} />;
}
(Prompt as any).args = {
  headerText: 'Tutorial Title',
  descriptionText: 'Welcome to the tutorial!',
  buttonText: 'Start the tutorial',
  buttonHref: '#',
};
Prompt.storyName = 'Prompt'; // needed for single story hoisting for multi word component names
