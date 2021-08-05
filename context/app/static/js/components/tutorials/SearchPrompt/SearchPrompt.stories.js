import React from 'react';

import SearchPromptComponent from './SearchPrompt';

export default {
  title: 'Tutorials/SearchPrompt',
  component: SearchPromptComponent,
};

export const SearchPrompt = (args) => <SearchPromptComponent {...args} />;
SearchPrompt.args = {
  headerText: 'Tutorial Title',
  descriptionText: 'Welcome to the tutorial!',
  buttonText: 'Start the tutorial',
  buttonOnClick: () => {},
  buttonIsDisabled: false,
  closeOnClick: () => {},
};
SearchPrompt.storyName = 'SearchPrompt'; // needed for single story hoisting for multi word component names
