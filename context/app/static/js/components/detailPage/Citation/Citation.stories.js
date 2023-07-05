import React from 'react';

import CitationComponent from './Citation';

export default {
  title: 'EntityDetail/Citation',
  component: CitationComponent,
};

export function Citation(args) {
  return <CitationComponent {...args} />;
}
Citation.args = {
  contributors: [
    { last_name: 'Aanders', first_name: 'Aanne' },
    { last_name: 'Banders', first_name: 'Banne' },
    { last_name: 'Canders', first_name: 'Canne' },
  ],
  citationTitle: 'Something Science-y',
  created_timestamp: 1520153805000,
  doi: 'fakeDoi',
  doi_url: 'https://www.doi.org/',
};
