import React from 'react';

import SearchBarComponent from './SearchBar';

export default {
  title: 'inputs/SearchBar',
  component: SearchBarComponent,
  argTypes: {
    severity: {
      options: ['warning', 'error', 'success', 'info'],
      control: { type: 'select' },
    },
  },
};

export function SearchBar(args: any) {
  return <SearchBarComponent {...args} />;
}
(SearchBar as any).args = {
  onChange: () => {},
};
SearchBar.storyName = 'SearchBar'; // needed for single story hoisting for multi word component names
