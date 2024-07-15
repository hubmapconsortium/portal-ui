import React from 'react';

import CitationComponent from './Citation';

export default {
  title: 'EntityDetail/Citation',
  component: CitationComponent,
};

interface CitationArgs {
  contributors: { last_name: string; first_name: string }[];
  citationTitle: string;
  created_timestamp: number;
  doi: string;
  doi_url: string;
}

export function Citation(args: CitationArgs) {
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
